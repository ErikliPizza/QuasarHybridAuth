<template>
    <q-item class="q-my-sm" clickable v-ripple :to="to">
        <q-item-section avatar top>
            <q-avatar :icon="icon" :color="color" text-color="white" />
        </q-item-section>

        <q-item-section>
            <q-item-label>{{ label }}</q-item-label>
        </q-item-section>
    </q-item>
</template>

<script setup>
defineProps({
    icon: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    to: {
        type: [String, Object],
        default: ''
    },
    color: {
        type: String,
        default: 'primary'
    }
});
</script>