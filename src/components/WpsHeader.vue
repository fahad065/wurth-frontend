<template>
  <v-app-bar flat color="primary" :height="59" elevation="0">
    <template #prepend>
      <div class="d-flex align-center ga-3 pl-4">
        <div style="background:white;color:#CC0000;font-weight:900;font-size:12px;padding:4px 8px;border-radius:3px;letter-spacing:1px;flex-shrink:0;">
          WÜRTH
        </div>
        <div>
          <div style="color:white;font-weight:700;font-size:14px;line-height:1.1;">Professional Solutions</div>
          <div style="color:rgba(255,255,255,0.8);font-size:11px;">Expense Claims Portal</div>
        </div>
      </div>
    </template>

    <template #append>
      <div class="d-flex align-center ga-3 pr-4">
        <div class="d-none d-sm-block text-right">
          <div style="font-size:13px;font-weight:600;color:white;">{{ auth.user?.name }}</div>
          <div style="font-size:11px;color:rgba(255,255,255,0.75);">{{ auth.user?.dept }} · {{ roleLabel }}</div>
        </div>
        <v-btn variant="outlined" size="small" color="white" @click="logout" style="font-size:12px;">
          <v-icon start size="16">mdi-logout</v-icon> Sign Out
        </v-btn>
      </div>
    </template>

    <!-- Black stripe at bottom of header -->
    <div style="position:absolute;bottom:0;left:0;right:0;height:3px;background:#1A1A1A;"></div>
  </v-app-bar>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth      = useAuthStore()
const router    = useRouter()
const roleLabel = computed(() => auth.isManager ? 'Finance Manager' : 'Employee')
const logout    = () => { auth.logout(); router.push('/login') }
</script>
