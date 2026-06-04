<template>
  <q-list class="nav-tree">
    <template v-for="(group, groupIndex) in visibleGroups" :key="group.title">
      <!-- Group Label -->
      <q-item-label header class="group-label">
        {{ group.title }}
      </q-item-label>

      <!-- Group Items -->
      <template v-for="(item, i) in group.items" :key="`${groupIndex}-${i}`">
        <!-- Parent with children -->
        <template v-if="item.children">
          <q-item clickable v-ripple class="parent-item" @click="toggleExpand(`${groupIndex}-${i}`)">
            <q-item-section avatar>
              <q-icon :name="item.icon" size="20px" />
            </q-item-section>
            <q-item-section>{{ item.text }}</q-item-section>
            <q-item-section side>
              <q-icon :name="isExpanded(`${groupIndex}-${i}`) ? 'expand_less' : 'expand_more'" size="18px" />
            </q-item-section>
          </q-item>

          <!-- Children -->
          <q-slide-transition>
            <div v-show="isExpanded(`${groupIndex}-${i}`)" class="children-wrapper">
              <q-item v-for="(child, j) in item.children" :key="`${groupIndex}-${i}-${j}`" clickable v-ripple
                class="child-item" :class="{ 'child-active': isActive(child.to) }" :disable="child.disabled"
                @click="handleNavigate(child.to, child.disabled)">
                <q-item-section avatar>
                  <q-icon :name="child.icon" size="18px" />
                </q-item-section>
                <q-item-section>{{ child.text }}</q-item-section>
              </q-item>
            </div>
          </q-slide-transition>
        </template>

        <!-- Regular item (no children) -->
        <q-item v-else clickable v-ripple class="nav-item" :class="{ 'nav-active': isActive(item.to) }"
          :disable="item.disabled" @click="handleNavigate(item.to, item.disabled)">
          <q-item-section avatar>
            <q-icon :name="item.icon" size="20px" />
          </q-item-section>
          <q-item-section>{{ item.text }}</q-item-section>
        </q-item>
      </template>

      <!-- Separator between groups -->
      <q-separator v-if="groupIndex < visibleGroups.length - 1" class="q-my-sm" />
    </template>
  </q-list>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useNavItems, type NavVariant } from 'src/composables/useNavItems';

const props = withDefaults(defineProps<{ variant?: NavVariant }>(), {
  variant: 'main',
});

const { visibleGroups, navigate, isActive } = useNavItems(props.variant);

// Track expanded parent items
const expandedItems = ref<Set<string>>(new Set());

// Auto-expand parents with active children on mount
visibleGroups.value.forEach((group, groupIndex) => {
  group.items.forEach((item, i) => {
    if (item.children?.some((child) => isActive(child.to))) {
      expandedItems.value.add(`${groupIndex}-${i}`);
    }
  });
});

const isExpanded = (key: string) => expandedItems.value.has(key);

const toggleExpand = (key: string) => {
  if (expandedItems.value.has(key)) {
    expandedItems.value.delete(key);
  } else {
    expandedItems.value.add(key);
  }
};

const handleNavigate = (to?: string, disabled?: boolean) => {
  if (disabled) return;
  navigate(to);
};
</script>

<style lang="scss" scoped>
.nav-tree {
  padding: 8px;

  .group-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #78909c;
    padding: 16px 12px 8px;
  }

  .nav-item,
  .parent-item {
    min-height: 40px;
    padding: 0 12px;
    border-radius: 8px;
    margin-bottom: 2px;
    color: #455a64;

    :deep(.q-item__section--avatar) {
      min-width: 36px;
      color: #607d8b;
    }

    &:hover {
      background: #eceff1;
    }
  }

  .nav-active {
    background: #1976d2 !important;
    color: white !important;

    :deep(.q-item__section--avatar) {
      color: white !important;
    }
  }

  .children-wrapper {
    margin-left: 20px;
    padding-left: 12px;
    border-left: 2px solid #e0e0e0;

    .child-item {
      min-height: 36px;
      padding: 0 12px;
      border-radius: 6px;
      margin-bottom: 2px;
      font-size: 0.9em;
      color: #546e7a;

      :deep(.q-item__section--avatar) {
        min-width: 32px;
        color: #78909c;
      }

      &:hover {
        background: #eceff1;
      }
    }

    .child-active {
      background: #e3f2fd !important;
      color: #1565c0 !important;
      font-weight: 500;

      :deep(.q-item__section--avatar) {
        color: #1565c0 !important;
      }
    }
  }
}
</style>
