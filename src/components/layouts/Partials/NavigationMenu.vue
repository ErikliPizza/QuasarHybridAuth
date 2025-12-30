<template>
  <q-list padding>
    <template v-for="(group, groupIndex) in visibleGroups" :key="group.title">
      <!-- First group: flat items -->
      <template v-if="groupIndex === 0">
        <q-item v-for="(item, i) in group.items" :key="`${groupIndex}-${i}`" :active="isActive(item.to)"
          active-class="bg-primary text-white" :disable="item.disabled" clickable v-ripple
          @click="handleNavigate(item.to, item.disabled)">
          <q-item-section avatar>
            <q-icon :name="item.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ item.text }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>

      <!-- Other groups: collapsible -->
      <template v-else>
        <q-expansion-item :label="group.title" :icon="group.icon" expand-separator>
          <q-item v-for="(item, i) in group.items" :key="`${groupIndex}-${i}`" :active="isActive(item.to)"
            active-class="bg-primary text-white" :disable="item.disabled" clickable v-ripple
            @click="handleNavigate(item.to, item.disabled)">
            <q-item-section avatar>
              <q-icon :name="item.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item.text }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-expansion-item>
      </template>
    </template>
  </q-list>
</template>

<script setup lang="ts">
import { useNavItems } from 'src/composables/useNavItems';

const { visibleGroups, navigate, isActive } = useNavItems();

const handleNavigate = (to?: string, disabled?: boolean) => {
  if (disabled) return;
  navigate(to);
};
</script>
