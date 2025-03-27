<template>
  <q-page padding>
    <!-- Page Header -->
    <div class="q-mb-lg">
      <h4 class="q-mt-none q-mb-sm">Team Dashboard</h4>
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Home" icon="home" />
        <q-breadcrumbs-el label="Team" />
      </q-breadcrumbs>
    </div>

    <!-- Team Stats -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-primary text-white">
          <q-card-section>
            <div class="text-h6">Team Members</div>
            <div class="text-h3">24</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-secondary text-white">
          <q-card-section>
            <div class="text-h6">Active Projects</div>
            <div class="text-h3">12</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-accent text-white">
          <q-card-section>
            <div class="text-h6">Tasks Completed</div>
            <div class="text-h3">187</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-positive text-white">
          <q-card-section>
            <div class="text-h6">Achievements</div>
            <div class="text-h3">9</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Actions -->
    <div class="q-mb-lg">
      <q-btn color="primary" label="Create Team" icon="add" />
      <q-btn flat color="grey-8" label="Export" icon="file_download" class="q-ml-sm" />
      <q-btn flat color="grey-8" label="Settings" icon="settings" class="q-ml-sm" />
    </div>

    <!-- Team Members List -->
    <q-card class="q-mb-lg">
      <q-card-section>
        <div class="text-h6">Team Members</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table :rows="teamMembers" :columns="columns" row-key="id" :pagination="{ rowsPerPage: 5 }">
          <template v-slot:body-cell-avatar="props">
            <q-td :props="props">
              <q-avatar>
                <img :src="`https://randomuser.me/api/portraits/men/${props.row.id}.jpg`" />
              </q-avatar>
            </q-td>
          </template>
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-chip :color="props.row.status === 'Active' ? 'positive' : 'grey'" text-color="white" dense>
                {{ props.row.status }}
              </q-chip>
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="q-gutter-x-sm">
              <q-btn flat round color="primary" icon="edit" size="sm" />
              <q-btn flat round color="negative" icon="delete" size="sm" />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Projects Section -->
    <q-card class="q-mb-lg">
      <q-card-section>
        <div class="text-h6">Current Projects</div>
      </q-card-section>

      <q-separator />

      <q-list separator>
        <q-item v-for="i in 5" :key="i" class="q-py-md">
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">P{{ i }}</q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>Project {{ i }}</q-item-label>
            <q-item-label caption>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-badge :color="['primary', 'secondary', 'accent', 'positive', 'warning'][i - 1]">
              Phase {{ i }}
            </q-badge>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>

    <!-- Team Activity Feed -->
    <q-card>
      <q-card-section>
        <div class="text-h6">Recent Activity</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-timeline color="secondary">
          <q-timeline-entry v-for="i in 8" :key="i" :title="`Activity ${i}`" :subtitle="`${i} hours ago`">
            <div>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae justo eu metus gravida aliquam.
            </div>
          </q-timeline-entry>
        </q-timeline>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';

// Sample data for team members
const teamMembers = ref([
  { id: 1, name: 'John Smith', email: 'john@example.com', role: 'Team Lead', status: 'Active' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Developer', status: 'Active' },
  { id: 3, name: 'Michael Brown', email: 'michael@example.com', role: 'Designer', status: 'Away' },
  { id: 4, name: 'Emma Wilson', email: 'emma@example.com', role: 'Product Manager', status: 'Active' },
  { id: 5, name: 'James Taylor', email: 'james@example.com', role: 'Developer', status: 'Active' },
  { id: 6, name: 'Lisa Anderson', email: 'lisa@example.com', role: 'QA Engineer', status: 'Away' },
  { id: 7, name: 'Robert Miller', email: 'robert@example.com', role: 'DevOps', status: 'Active' },
  { id: 8, name: 'Jennifer Davis', email: 'jennifer@example.com', role: 'UX Designer', status: 'Active' },
]);

// Table columns definition
const columns = [
  { name: 'avatar', label: '', field: 'avatar', align: 'left' },
  { name: 'name', label: 'Name', field: 'name', sortable: true, align: 'left' },
  { name: 'email', label: 'Email', field: 'email', sortable: true, align: 'left' },
  { name: 'role', label: 'Role', field: 'role', sortable: true, align: 'left' },
  { name: 'status', label: 'Status', field: 'status', sortable: true, align: 'left' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'center' },
];
</script>
