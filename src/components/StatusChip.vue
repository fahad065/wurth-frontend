<template>
  <v-chip :color="color" variant="tonal" size="small" style="font-weight:700;font-size:11px;">
    <v-icon start size="12">{{ icon }}</v-icon>
    {{ label }}
  </v-chip>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ status: String })

const map = {
  processing: { color: 'warning',  icon: 'mdi-clock-outline',    label: 'Processing' },
  approved:   { color: 'success',  icon: 'mdi-check-circle',     label: 'Approved'   },
  done:       { color: 'success',  icon: 'mdi-check-all',        label: 'Done'       },
}

const color = computed(() => map[props.status]?.color || 'grey')
const icon  = computed(() => map[props.status]?.icon  || 'mdi-help')
const label = computed(() => map[props.status]?.label || props.status)
</script>
