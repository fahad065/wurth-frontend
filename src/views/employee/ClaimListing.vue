<template>
  <div style="max-width:960px;">
    <div style="font-size:22px;font-weight:800;color:#1A1A1A;margin-bottom:20px;">My Claims</div>

    <v-card rounded="lg" elevation="1">
      <!-- Loading -->
      <div v-if="loading" class="d-flex justify-center align-center pa-10">
        <v-progress-circular indeterminate color="primary" />
      </div>

      <!-- Empty -->
      <div v-else-if="!claims.length" class="text-center pa-12">
        <v-icon size="56" color="#E0E0E0">mdi-receipt-text-outline</v-icon>
        <div style="font-size:16px;font-weight:600;color:#999;margin-top:12px;">No claims yet</div>
        <div style="font-size:13px;color:#ccc;margin-top:4px;">Submit your first expense claim</div>
        <v-btn color="primary" rounded="md" class="mt-5" style="font-weight:700;" to="/employee/new-claim">
          <v-icon start>mdi-plus</v-icon> New Claim
        </v-btn>
      </div>

      <!-- Table -->
      <div v-else style="overflow-x:auto;">
        <table style="width:100%;border-collapse:collapse;font-size:13px;">
          <thead>
            <tr style="background:#F5F5F5;border-bottom:2px solid #E0E0E0;">
              <th v-for="h in ['Ref No.','Title','Period','Total (AED)','Lines','Submitted','Status','']" :key="h"
                  style="padding:12px 14px;text-align:left;font-weight:600;color:#555;font-size:12px;white-space:nowrap;">{{ h }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in claims" :key="c._id" style="border-bottom:1px solid #F0F0F0;cursor:pointer;" @click="openDetail(c)"
                @mouseenter="e => e.currentTarget.style.background='#FFF5F5'"
                @mouseleave="e => e.currentTarget.style.background='white'">
              <td style="padding:12px 14px;font-family:monospace;color:#CC0000;font-weight:700;">{{ c.refNo }}</td>
              <td style="padding:12px 14px;font-weight:500;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{ c.title }}</td>
              <td style="padding:12px 14px;color:#666;white-space:nowrap;">{{ c.period }}</td>
              <td style="padding:12px 14px;font-weight:700;color:#1A1A1A;">{{ c.totalAED?.toFixed(2) }}</td>
              <td style="padding:12px 14px;color:#666;text-align:center;">{{ c.lines?.length }}</td>
              <td style="padding:12px 14px;color:#666;white-space:nowrap;">{{ formatDate(c.createdAt) }}</td>
              <td style="padding:12px 14px;"><StatusChip :status="c.status" /></td>
              <td style="padding:12px 14px;">
                <v-btn icon size="x-small" variant="text" color="primary" @click.stop="openDetail(c)">
                  <v-icon size="18">mdi-eye</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </v-card>

    <!-- Detail Dialog -->
    <v-dialog v-model="detailDialog" max-width="700" scrollable>
      <v-card v-if="selected" rounded="lg">
        <v-card-title class="d-flex align-center justify-space-between pa-5 pb-3">
          <div>
            <div style="font-size:16px;font-weight:800;color:#1A1A1A;">Claim Details</div>
            <div style="font-size:12px;color:#CC0000;font-family:monospace;font-weight:600;margin-top:2px;">{{ selected.refNo }}</div>
          </div>
          <div class="d-flex align-center ga-3">
            <StatusChip :status="selected.status" />
            <v-btn icon size="small" variant="text" @click="detailDialog=false"><v-icon>mdi-close</v-icon></v-btn>
          </div>
        </v-card-title>
        <v-divider />

        <v-card-text class="pa-5">
          <!-- Claim info -->
          <v-row dense class="mb-4">
            <v-col cols="6"><div style="font-size:11px;color:#999;">Title</div><div style="font-size:13px;font-weight:500;">{{ selected.title }}</div></v-col>
            <v-col cols="6"><div style="font-size:11px;color:#999;">Period</div><div style="font-size:13px;font-weight:500;">{{ selected.period }}</div></v-col>
            <v-col cols="6" v-if="selected.project"><div style="font-size:11px;color:#999;">Project</div><div style="font-size:13px;font-weight:500;">{{ selected.project }}</div></v-col>
            <v-col cols="6"><div style="font-size:11px;color:#999;">Submitted</div><div style="font-size:13px;font-weight:500;">{{ formatDate(selected.createdAt) }}</div></v-col>
          </v-row>

          <!-- Status timeline -->
          <div class="section-label mb-3">Status Timeline</div>
          <div class="mb-4">
            <div v-for="(h, i) in selected.statusHistory" :key="i" class="d-flex align-start ga-3 mb-3">
              <div style="width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;"
                   :style="{background: h.status==='processing' ? '#FFF3E0' : '#E8F5E9'}">
                <v-icon size="14" :color="h.status==='processing' ? 'warning' : 'success'">
                  {{ h.status==='processing' ? 'mdi-clock-outline' : h.status==='approved' ? 'mdi-check-circle' : 'mdi-check-all' }}
                </v-icon>
              </div>
              <div>
                <div style="font-size:13px;font-weight:600;text-transform:capitalize;">{{ h.status }}</div>
                <div style="font-size:11px;color:#999;">{{ formatDateTime(h.changedAt) }} · {{ h.changedBy?.name || 'System' }}</div>
                <div v-if="h.note" style="font-size:12px;color:#666;margin-top:2px;">{{ h.note }}</div>
              </div>
            </div>
          </div>

          <!-- Lines -->
          <div class="d-flex align-center justify-space-between mb-3">
            <div class="section-label" style="margin-bottom:0;">Expense Lines</div>
            <div v-if="selected.status==='processing'" style="font-size:11px;color:#E65100;font-weight:600;">
              <v-icon size="13" color="warning">mdi-pencil</v-icon> Editable — locked after approval
            </div>
            <div v-else style="font-size:11px;color:#999;">
              <v-icon size="13">mdi-lock</v-icon> Locked after approval
            </div>
          </div>
          <div v-for="(l, i) in editableLines" :key="i" style="border:1px solid #E0E0E0;border-radius:8px;padding:12px;margin-bottom:10px;background:#FAFAFA;">
            <div class="d-flex justify-space-between align-center mb-2">
              <span style="font-size:12px;font-weight:700;color:#CC0000;">Line {{ i+1 }} · {{ l.category }}</span>
              <span style="font-size:13px;font-weight:700;color:#CC0000;">AED {{ calcAED(l.amount, l.currency) }}</span>
            </div>
            <div style="font-size:13px;color:#333;margin-bottom:8px;">{{ l.description }}</div>
            <div class="d-flex align-center ga-3 flex-wrap">
              <div style="min-width:100px;">
                <div style="font-size:11px;color:#999;margin-bottom:3px;">Amount</div>
                <v-text-field v-model="l.amount" type="number" min="0" step="0.01"
                  variant="outlined" density="compact" color="primary" hide-details bg-color="white"
                  :readonly="selected.status !== 'processing'" style="max-width:120px;" />
              </div>
              <div style="min-width:110px;">
                <div style="font-size:11px;color:#999;margin-bottom:3px;">Currency</div>
                <v-select v-model="l.currency" :items="currencyCodes"
                  variant="outlined" density="compact" color="primary" hide-details bg-color="white"
                  :readonly="selected.status !== 'processing'" style="max-width:120px;" />
              </div>
              <div style="margin-top:14px;">
                <div style="font-size:11px;color:#999;">Rate</div>
                <div style="font-size:12px;color:#666;margin-top:2px;">@ {{ getRate(l.currency) }} / {{ l.currency }}</div>
              </div>
            </div>
            <!-- Receipt previews -->
            <div v-if="l.receipts?.length" class="d-flex flex-wrap ga-2 mt-3">
              <div v-for="(r, ri) in l.receipts" :key="ri"
                   style="position:relative;width:64px;height:64px;border-radius:6px;overflow:hidden;border:1px solid #E0E0E0;cursor:pointer;"
                   @click="previewReceipt(r)">
                <img v-if="r.type==='image'" :src="r.dataUrl" style="width:100%;height:100%;object-fit:cover;" />
                <div v-else style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#F5F5F5;">
                  <v-icon size="22" color="#CC0000">mdi-file-pdf-box</v-icon>
                  <span style="font-size:9px;color:#666;margin-top:2px;">PDF</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Save button (processing only) -->
          <div v-if="selected.status==='processing'" class="d-flex justify-end mb-4">
            <v-btn color="primary" variant="tonal" rounded="md" size="small" style="font-weight:700;"
              :loading="savingLines" @click="saveLineChanges">
              <v-icon start size="16">mdi-content-save</v-icon> Save Currency Changes
            </v-btn>
          </div>

          <!-- Total -->
          <v-sheet color="#1A1A1A" rounded="lg" class="pa-4 d-flex justify-space-between align-center mt-2">
            <div>
              <div style="font-size:13px;font-weight:600;color:white;">Total</div>
              <div v-if="selected.status==='processing'" style="font-size:11px;color:#666;margin-top:2px;">Live preview (save to confirm)</div>
            </div>
            <div style="font-size:20px;font-weight:800;color:#FF6666;">
              AED {{ selected.status==='processing' ? liveTotal : selected.totalAED?.toFixed(2) }}
            </div>
          </v-sheet>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Receipt preview dialog -->
    <v-dialog v-model="receiptDialog" max-width="600">
      <v-card rounded="lg" class="pa-4">
        <div class="d-flex justify-space-between align-center mb-3">
          <div style="font-size:14px;font-weight:600;">Receipt Preview</div>
          <v-btn icon size="small" variant="text" @click="receiptDialog=false"><v-icon>mdi-close</v-icon></v-btn>
        </div>
        <img v-if="previewUrl && previewType==='image'" :src="previewUrl" style="width:100%;border-radius:6px;" />
        <div v-else style="text-align:center;padding:20px;color:#666;">
          <v-icon size="48" color="#CC0000">mdi-file-pdf-box</v-icon>
          <div style="margin-top:8px;font-size:13px;">PDF cannot be previewed inline.<br>
            <a :href="previewUrl" target="_blank" style="color:#CC0000;">Open PDF in new tab</a>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import api from '../../api'
import StatusChip from '../../components/StatusChip.vue'

const CURRENCY_RATES = { AED:1, USD:3.6725, EUR:3.99, TL:0.108, CNY:0.507 }
const currencyCodes  = Object.keys(CURRENCY_RATES)
const getRate  = (code) => CURRENCY_RATES[code] ?? 1
const calcAED  = (amount, currency) => ((parseFloat(amount)||0) * getRate(currency)).toFixed(2)

const claims        = ref([])
const loading       = ref(true)
const savingLines   = ref(false)
const detailDialog  = ref(false)
const receiptDialog = ref(false)
const selected      = ref(null)
const editableLines = ref([])
const previewUrl    = ref('')
const previewType   = ref('')

const liveTotal = computed(() =>
  editableLines.value.reduce((s, l) => s + (parseFloat(l.amount)||0) * getRate(l.currency), 0).toFixed(2)
)

watch(selected, (val) => {
  if (val) editableLines.value = val.lines.map(l => ({ ...l, amount: l.amount, currency: l.currency }))
})

const formatDate     = (d) => d ? new Date(d).toLocaleDateString('en-AE', { day:'2-digit', month:'short', year:'numeric' }) : '—'
const formatDateTime = (d) => d ? new Date(d).toLocaleString('en-AE', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }) : '—'

const fetchClaims = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/claims')
    claims.value = data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const saveLineChanges = async () => {
  savingLines.value = true
  try {
    const { data } = await api.patch(`/claims/${selected.value._id}/lines`, {
      lines: editableLines.value.map(l => ({ amount: parseFloat(l.amount), currency: l.currency }))
    })
    const idx = claims.value.findIndex(c => c._id === data._id)
    if (idx !== -1) claims.value[idx] = data
    selected.value = data
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to save changes')
  } finally {
    savingLines.value = false
  }
}

const openDetail = (c) => { selected.value = c; detailDialog.value = true }

const previewReceipt = (r) => {
  previewUrl.value  = r.dataUrl
  previewType.value = r.type
  receiptDialog.value = true
}

onMounted(fetchClaims)
</script>
