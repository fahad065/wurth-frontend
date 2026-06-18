<template>
  <v-app style="font-family:'Inter',sans-serif; background:#F5F5F5;">
    <router-view />
  </v-app>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
const auth = useAuthStore()
onMounted(() => auth.fetchMe())
</script>

<style>
* { box-sizing: border-box; }
body { font-family: 'Inter', sans-serif !important; }
.v-btn { text-transform: none !important; letter-spacing: 0 !important; }
.section-label {
  font-size: 11px; font-weight: 700; color: #CC0000;
  text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px;
}
.field-label {
  display: block; font-size: 13px; font-weight: 600; color: #333; margin-bottom: 5px;
}
.field-label-sm {
  display: block; font-size: 12px; font-weight: 600; color: #555; margin-bottom: 4px;
}
.receipt-drop {
  border: 2px dashed #E0E0E0; border-radius: 8px; padding: 14px 16px;
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  cursor: pointer; background: white; transition: border-color 0.2s;
}
.receipt-drop:hover { border-color: #CC0000; }
</style>
