<template>
  <div style="max-width:960px;">
    <div style="font-size:22px;font-weight:800;color:#1A1A1A;margin-bottom:20px;">Finance Dashboard</div>

    <!-- Stat cards -->
    <v-row class="mb-6">
      <v-col cols="6" sm="3" v-for="card in statCards" :key="card.label">
        <v-card rounded="lg" elevation="1" class="pa-4">
          <div class="d-flex align-center justify-space-between mb-3">
            <div :style="{width:'40px',height:'40px',borderRadius:'10px',background:card.bg,display:'flex',alignItems:'center',justifyContent:'center'}">
              <v-icon :color="card.iconColor" size="22">{{ card.icon }}</v-icon>
            </div>
            <div :style="{fontSize:'24px',fontWeight:'800',color:card.valColor}">{{ loading ? '…' : stats[card.key] }}</div>
          </div>
          <div style="font-size:13px;font-weight:600;color:#333;">{{ card.label }}</div>
          <div style="font-size:11px;color:#999;margin-top:2px;">{{ card.sub }}</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Total value card -->
    <v-card rounded="lg" elevation="1" class="pa-5 mb-6" style="background:linear-gradient(135deg,#1A1A1A 0%,#333 100%);">
      <div class="d-flex align-center justify-space-between">
        <div>
          <div style="font-size:13px;color:#999;margin-bottom:4px;">Total Claims Value</div>
          <div style="font-size:30px;font-weight:800;color:#FF6666;">AED {{ loading ? '…' : stats.totalValue }}</div>
          <div style="font-size:12px;color:#666;margin-top:4px;">Across all {{ stats.total }} claims</div>
        </div>
        <v-icon size="52" color="#333">mdi-cash-multiple</v-icon>
      </div>
    </v-card>

    <!-- Recent claims quick view -->
    <v-card rounded="lg" elevation="1">
      <div class="d-flex align-center justify-space-between pa-5 pb-3">
        <div style="font-size:16px;font-weight:700;color:#1A1A1A;">Recent Claims</div>
        <v-btn variant="text" color="primary" size="small" to="/manager/claims" style="font-weight:600;">
          View All <v-icon end size="16">mdi-arrow-right</v-icon>
        </v-btn>
      </div>
      <v-divider />
      <div v-if="loadingClaims" class="d-flex justify-center pa-6"><v-progress-circular indeterminate color="primary" /></div>
      <div v-else-if="!recentClaims.length" class="text-center pa-8 text-grey">No claims yet</div>
      <div v-else style="overflow-x:auto;">
        <table style="width:100%;border-collapse:collapse;font-size:13px;">
          <thead>
            <tr style="background:#F5F5F5;border-bottom:2px solid #E0E0E0;">
              <th v-for="h in ['Ref','Employee','Title','Total (AED)','Status']" :key="h" style="padding:10px 14px;text-align:left;font-weight:600;color:#555;font-size:12px;white-space:nowrap;">{{ h }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in recentClaims" :key="c._id" style="border-bottom:1px solid #F0F0F0;">
              <td style="padding:10px 14px;font-family:monospace;color:#CC0000;font-weight:700;">{{ c.refNo }}</td>
              <td style="padding:10px 14px;">{{ c.submittedBy?.name }}</td>
              <td style="padding:10px 14px;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{ c.title }}</td>
              <td style="padding:10px 14px;font-weight:700;">{{ c.totalAED?.toFixed(2) }}</td>
              <td style="padding:10px 14px;"><StatusChip :status="c.status" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../../api'
import StatusChip from '../../components/StatusChip.vue'

const stats        = ref({ processing:0, approved:0, done:0, total:0, totalValue:'0.00' })
const recentClaims = ref([])
const loading      = ref(true)
const loadingClaims = ref(true)

const statCards = [
  { key:'processing', label:'Processing', sub:'Awaiting review',  icon:'mdi-clock-outline',   bg:'#FFF3E0', iconColor:'#E65100', valColor:'#E65100' },
  { key:'approved',   label:'Approved',   sub:'Manager approved', icon:'mdi-check-circle',     bg:'#E8F5E9', iconColor:'#2E7D32', valColor:'#2E7D32' },
  { key:'done',       label:'Done',       sub:'Fully processed',  icon:'mdi-check-all',        bg:'#E3F2FD', iconColor:'#1565C0', valColor:'#1565C0' },
  { key:'total',      label:'Total',      sub:'All claims',       icon:'mdi-receipt-text',     bg:'#F3E5F5', iconColor:'#6A1B9A', valColor:'#6A1B9A' },
]

onMounted(async () => {
  try {
    const [s, c] = await Promise.all([api.get('/claims/stats'), api.get('/claims')])
    stats.value        = s.data
    recentClaims.value = c.data.slice(0, 5)
  } catch (err) { console.error(err) }
  finally { loading.value = false; loadingClaims.value = false }
})
</script>
