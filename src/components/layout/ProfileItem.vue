<template>
    <q-item class="q-my-sm" clickable v-ripple :to="to">
        <q-item-section avatar>
            <q-avatar color="primary" text-color="white">
                <img :src="avatar" alt="avatar">
            </q-avatar>
        </q-item-section>

        <q-item-section>
            <q-item-label>{{ name }}</q-item-label>
            <q-item-label caption lines="1">{{ email }}</q-item-label>
        </q-item-section>

        <q-item-section side>
            <q-icon name="manage_accounts" color="primary" />
        </q-item-section>
    </q-item>
</template>

<script setup>
defineProps({
    avatar: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    to: {
        type: [String, Object],
        default: ''
    }
});
</script>