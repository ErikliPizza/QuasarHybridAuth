<template>
    <q-item clickable v-ripple @click="$emit('logout')">
        <q-item-section avatar top>
            <q-avatar icon="logout" color="primary" text-color="white" />
        </q-item-section>

        <q-item-section>
            <q-item-label caption>
                2FA is
                <span class="text-capitalize text-green" v-if="tfaEnabled">ON</span>
                <span class="text-capitalize text-red" v-else>OFF</span>
            </q-item-label>
        </q-item-section>

        <q-item-section side>
            <q-icon name="info" color="red" />
            <q-tooltip anchor="center left" self="center right">
                Two-Factor Authentication
            </q-tooltip>
        </q-item-section>
    </q-item>
</template>

<script setup>
defineProps({
    tfaEnabled: {
        type: Boolean,
        default: false
    }
});

defineEmits(['logout']);
</script>