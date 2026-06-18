<template>
  <v-layout style="min-height:100vh;background:#F5F5F5;">
    <WpsHeader />

    <v-navigation-drawer
      v-model="drawer"
      :permanent="!mobile"
      :temporary="mobile"
      width="220"
      color="white"
      style="border-right:1px solid #E0E0E0;"
    >
      <div style="height:16px;" />
      <v-list density="compact" nav class="pa-2">
        <v-list-item
          v-for="item in navItems" :key="item.to"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          rounded="lg"
          color="primary"
          style="font-size:14px;font-weight:500;margin-bottom:4px;"
        />
      </v-list>
    </v-navigation-drawer>

    <v-main style="background:#F5F5F5;">
      <!-- Mobile hamburger -->
      <div v-if="mobile" class="pa-2">
        <v-btn icon variant="text" @click="drawer = !drawer">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </div>

      <v-container style="max-width:1100px; padding:24px 20px;">
        <router-view />
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useDisplay } from 'vuetify'
import WpsHeader from '../../components/WpsHeader.vue'

const { mobile } = useDisplay()
const drawer = ref(true)

const navItems = [
  { to: '/manager/dashboard', icon: 'mdi-view-dashboard-outline', title: 'Dashboard'  },
  { to: '/manager/claims',    icon: 'mdi-receipt-text-outline',   title: 'All Claims' },
]
</script>
