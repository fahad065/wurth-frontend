<template>
  <div style="max-width:860px;">
    <div style="font-size:22px;font-weight:800;color:#1A1A1A;margin-bottom:20px;">Submit Expense Claim</div>

    <!-- Stepper bar -->
    <v-card rounded="lg" elevation="0" class="mb-4 px-4 py-3" style="border:1px solid #E0E0E0;">
      <div class="d-flex align-center">
        <template v-for="(s, i) in steps" :key="i">
          <div class="d-flex align-center ga-2" style="flex-shrink:0;">
            <div :style="{
              width:'28px',height:'28px',borderRadius:'50%',
              background: i < step ? '#CC0000' : i===step ? '#CC0000' : '#E0E0E0',
              color: i<=step ? 'white' : '#999',
              display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:'12px',fontWeight:'700',flexShrink:0
            }">
              <v-icon v-if="i < step" size="14" color="white">mdi-check</v-icon>
              <span v-else>{{ i+1 }}</span>
            </div>
            <span class="d-none d-sm-inline" :style="{fontSize:'12px',fontWeight:i===step?700:400,color:i===step?'#CC0000':i<step?'#333':'#999',whiteSpace:'nowrap'}">{{ s }}</span>
          </div>
          <div v-if="i < steps.length-1" :style="{flex:1,height:'2px',margin:'0 8px',background:i<step?'#CC0000':'#E0E0E0',minWidth:'12px'}"></div>
        </template>
      </div>
    </v-card>

    <!-- STEP 0: Claim Details -->
    <v-card v-if="step===0" rounded="lg" elevation="1" class="pa-6 pa-sm-8">
      <div style="font-size:18px;font-weight:800;color:#1A1A1A;margin-bottom:4px;">Claim Details</div>
      <div style="font-size:13px;color:#666;margin-bottom:24px;">Basic information about this expense claim</div>

      <!-- Auto-filled -->
      <v-sheet color="#F5F5F5" rounded="lg" class="pa-4 mb-6" style="border:1px solid #E0E0E0;">
        <div class="section-label">Claimant (auto-filled from login)</div>
        <v-row dense>
          <v-col cols="6" v-for="[l,v] in claimantFields" :key="l">
            <div style="font-size:11px;color:#999;">{{ l }}</div>
            <div style="font-size:13px;font-weight:500;">{{ v }}</div>
          </v-col>
          <v-col cols="12">
            <div style="font-size:11px;color:#999;">IBAN</div>
            <div style="font-size:13px;font-weight:500;font-family:monospace;">{{ auth.user?.iban }}</div>
          </v-col>
        </v-row>
      </v-sheet>

      <v-row>
        <v-col cols="12" sm="6">
          <label class="field-label">Claim Title *</label>
          <v-text-field v-model="claim.title" placeholder="e.g. Dubai Sales Trip – June 2026" variant="outlined" density="comfortable" color="primary" hide-details="auto" />
        </v-col>
        <v-col cols="12" sm="6">
          <label class="field-label">Period *</label>
          <v-text-field v-model="claim.period" type="month" variant="outlined" density="comfortable" color="primary" hide-details="auto" />
        </v-col>
        <v-col cols="12" sm="6">
          <label class="field-label">Project / Cost Centre</label>
          <v-text-field v-model="claim.project" placeholder="e.g. CC-1042" variant="outlined" density="comfortable" color="primary" hide-details="auto" />
        </v-col>
        <v-col cols="12" sm="6">
          <label class="field-label">Manager / Approver</label>
          <v-text-field v-model="claim.manager" placeholder="Direct manager's name" variant="outlined" density="comfortable" color="primary" hide-details="auto" />
        </v-col>
        <v-col cols="12">
          <label class="field-label">Notes / Purpose</label>
          <v-textarea v-model="claim.notes" placeholder="Brief description of the business purpose…" variant="outlined" color="primary" rows="3" hide-details="auto" auto-grow />
        </v-col>
      </v-row>

      <div class="d-flex justify-end mt-6">
        <v-btn color="primary" rounded="md" style="font-weight:700;" :disabled="!claim.title || !claim.period" @click="step=1">
          Next: Add Expenses <v-icon end>mdi-arrow-right</v-icon>
        </v-btn>
      </div>
    </v-card>

    <!-- STEP 1: Expense Lines -->
    <v-card v-if="step===1" rounded="lg" elevation="1" class="pa-6 pa-sm-8">
      <div class="d-flex align-start justify-space-between flex-wrap ga-3 mb-6">
        <div>
          <div style="font-size:18px;font-weight:800;color:#1A1A1A;">Expense Items</div>
          <div style="font-size:13px;color:#666;margin-top:4px;">Add each expense line with receipt</div>
        </div>
        <v-btn color="primary" rounded="md" style="font-weight:700;" @click="addLine">
          <v-icon start>mdi-plus</v-icon> Add Line
        </v-btn>
      </div>

      <div v-if="lines.length===0" class="text-center py-10">
        <v-icon size="52" color="#E0E0E0">mdi-receipt-text-outline</v-icon>
        <div style="font-size:15px;font-weight:600;color:#999;margin-top:8px;">No expenses yet</div>
        <div style="font-size:13px;color:#ccc;margin-top:4px;">Click "Add Line" to get started</div>
      </div>

      <div v-for="(line, idx) in lines" :key="line.id" class="mb-4">
        <v-sheet rounded="lg" style="border:1px solid #E0E0E0;background:#FAFAFA;" class="pa-4">
          <div class="d-flex align-center justify-space-between mb-4">
            <span style="font-size:13px;font-weight:700;color:#CC0000;">Line {{ idx+1 }}</span>
            <v-btn icon size="small" variant="text" color="grey" @click="removeLine(idx)"><v-icon size="18">mdi-close</v-icon></v-btn>
          </div>
          <v-row dense>
            <v-col cols="12" sm="6">
              <label class="field-label-sm">Date *</label>
              <v-text-field v-model="line.date" type="date" variant="outlined" density="compact" color="primary" hide-details bg-color="white" />
            </v-col>
            <v-col cols="12" sm="6">
              <label class="field-label-sm">Category *</label>
              <v-select v-model="line.category" :items="categories" placeholder="Select…" variant="outlined" density="compact" color="primary" hide-details bg-color="white" />
            </v-col>
            <v-col cols="12">
              <label class="field-label-sm">Description *</label>
              <v-text-field v-model="line.description" placeholder="What was this expense for?" variant="outlined" density="compact" color="primary" hide-details bg-color="white" />
            </v-col>
            <v-col cols="7" sm="5">
              <label class="field-label-sm">Amount *</label>
              <v-text-field v-model="line.amount" type="number" min="0" step="0.01" placeholder="0.00" variant="outlined" density="compact" color="primary" hide-details bg-color="white" />
            </v-col>
            <v-col cols="5" sm="4">
              <label class="field-label-sm">Currency</label>
              <v-select v-model="line.currency" :items="currencyCodes" variant="outlined" density="compact" color="primary" hide-details bg-color="white" />
            </v-col>
            <v-col cols="12" sm="3" class="d-flex align-end">
              <div v-if="line.amount && line.currency !== 'AED'" style="background:#fff0f0;border:1px solid #ffcccc;border-radius:8px;padding:8px 12px;width:100%;margin-bottom:2px;">
                <div style="font-size:10px;color:#999;">Converted</div>
                <div style="font-weight:700;color:#CC0000;font-size:14px;">AED {{ toAED(line.amount, line.currency) }}</div>
                <div style="font-size:10px;color:#aaa;">@ {{ getRate(line.currency) }} / {{ line.currency }}</div>
              </div>
            </v-col>
          </v-row>

          <!-- Receipt upload -->
          <div class="mt-4">
            <label class="field-label-sm">Receipt(s)</label>
            <div class="receipt-drop" @click="triggerUpload(idx)" @dragover.prevent @drop.prevent="onDrop($event, idx)">
              <v-icon color="#CC0000" size="20">mdi-paperclip</v-icon>
              <span style="font-size:13px;color:#666;"><span style="color:#CC0000;font-weight:600;">Attach receipt</span> or drag & drop</span>
              <span style="font-size:11px;color:#aaa;">JPEG · PNG · PDF · Auto-compressed</span>
              <input :ref="el => { if(el) uploadRefs[idx] = el }" type="file" multiple accept="image/*,.pdf" capture="environment" style="display:none;" @change="onFileChange($event, idx)" />
            </div>
            <div v-if="line.receipts.length" class="d-flex flex-wrap ga-2 mt-3">
              <div v-for="(r, ri) in line.receipts" :key="ri" style="position:relative;width:64px;height:64px;border-radius:6px;overflow:hidden;border:1px solid #E0E0E0;">
                <img v-if="r.type==='image'" :src="r.dataUrl" style="width:100%;height:100%;object-fit:cover;" />
                <div v-else style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#F5F5F5;">
                  <v-icon size="22" color="#CC0000">mdi-file-pdf-box</v-icon>
                  <span style="font-size:9px;color:#666;margin-top:2px;">PDF</span>
                </div>
                <button @click.stop="removeReceipt(idx, ri)" style="position:absolute;top:2px;right:2px;background:#CC0000;border:none;color:white;width:16px;height:16px;border-radius:50%;cursor:pointer;font-size:10px;display:flex;align-items:center;justify-content:center;">×</button>
              </div>
            </div>
          </div>
        </v-sheet>
      </div>

      <!-- Grand total -->
      <v-sheet v-if="lines.length > 0" color="#1A1A1A" rounded="lg" class="pa-4 d-flex align-center justify-space-between mb-6">
        <div>
          <div style="font-size:13px;font-weight:600;color:white;">Total Claim Amount</div>
          <div style="font-size:11px;color:#666;margin-top:2px;">All converted to AED</div>
        </div>
        <div style="font-size:22px;font-weight:800;color:#FF6666;">AED {{ grandTotal }}</div>
      </v-sheet>

      <div class="d-flex justify-space-between">
        <v-btn variant="outlined" color="primary" rounded="md" @click="step=0"><v-icon start>mdi-arrow-left</v-icon>Back</v-btn>
        <v-btn color="primary" rounded="md" style="font-weight:700;" :disabled="!linesValid" @click="step=2">Review & Submit <v-icon end>mdi-arrow-right</v-icon></v-btn>
      </div>
    </v-card>

    <!-- STEP 2: Review -->
    <v-card v-if="step===2" rounded="lg" elevation="1" class="pa-6 pa-sm-8">
      <div style="font-size:18px;font-weight:800;color:#1A1A1A;margin-bottom:4px;">Review & Submit</div>
      <div style="font-size:13px;color:#666;margin-bottom:24px;">Check all details before sending to Finance</div>

      <div class="section-label">Claimant</div>
      <v-sheet color="#F5F5F5" rounded="lg" class="pa-4 mb-5" style="border:1px solid #E0E0E0;">
        <v-row dense>
          <v-col cols="6" v-for="[l,v] in claimantFields" :key="l">
            <div style="font-size:11px;color:#999;">{{ l }}</div>
            <div style="font-size:13px;font-weight:500;">{{ v }}</div>
          </v-col>
          <v-col cols="12">
            <div style="font-size:11px;color:#999;">IBAN</div>
            <div style="font-size:13px;font-weight:500;font-family:monospace;">{{ auth.user?.iban }}</div>
          </v-col>
        </v-row>
      </v-sheet>

      <div class="section-label">Claim Details</div>
      <v-sheet color="#F5F5F5" rounded="lg" class="pa-4 mb-5" style="border:1px solid #E0E0E0;">
        <v-row dense>
          <v-col cols="6"><div style="font-size:11px;color:#999;">Title</div><div style="font-size:13px;font-weight:500;">{{ claim.title }}</div></v-col>
          <v-col cols="6"><div style="font-size:11px;color:#999;">Period</div><div style="font-size:13px;font-weight:500;">{{ claim.period }}</div></v-col>
          <v-col cols="6" v-if="claim.project"><div style="font-size:11px;color:#999;">Project</div><div style="font-size:13px;font-weight:500;">{{ claim.project }}</div></v-col>
          <v-col cols="12" v-if="claim.notes"><div style="font-size:11px;color:#999;">Notes</div><div style="font-size:13px;font-weight:500;">{{ claim.notes }}</div></v-col>
        </v-row>
      </v-sheet>

      <div class="section-label">Expense Lines</div>
      <div style="overflow-x:auto;margin-bottom:20px;">
        <table style="width:100%;border-collapse:collapse;font-size:13px;min-width:500px;">
          <thead>
            <tr style="background:#F5F5F5;">
              <th v-for="h in ['#','Date','Category','Description','Amount','AED','Receipts']" :key="h" style="padding:9px 10px;text-align:left;font-weight:600;color:#555;font-size:12px;border-bottom:2px solid #E0E0E0;white-space:nowrap;">{{ h }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(l,i) in lines" :key="l.id" style="border-bottom:1px solid #F0F0F0;">
              <td style="padding:8px 10px;color:#CC0000;font-weight:700;">{{ i+1 }}</td>
              <td style="padding:8px 10px;white-space:nowrap;">{{ l.date }}</td>
              <td style="padding:8px 10px;white-space:nowrap;">{{ l.category }}</td>
              <td style="padding:8px 10px;">{{ l.description }}</td>
              <td style="padding:8px 10px;white-space:nowrap;">{{ l.amount }} {{ l.currency }}</td>
              <td style="padding:8px 10px;font-weight:600;color:#CC0000;white-space:nowrap;">{{ toAED(l.amount, l.currency) }}</td>
              <td style="padding:8px 10px;"><span style="font-size:12px;color:#666;">{{ l.receipts.length }} file(s)</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <v-sheet color="#1A1A1A" rounded="lg" class="pa-4 d-flex align-center justify-space-between mb-5">
        <div style="font-size:14px;font-weight:600;color:white;">Total Claim Amount</div>
        <div style="font-size:24px;font-weight:800;color:#FF6666;">AED {{ grandTotal }}</div>
      </v-sheet>

      <v-alert type="warning" variant="tonal" rounded="lg" class="mb-6" icon="mdi-alert-outline" style="font-size:13px;">
        By submitting, I declare all expenses are genuine business expenses incurred in the performance of my duties.
      </v-alert>

      <div class="d-flex justify-space-between">
        <v-btn variant="outlined" color="primary" rounded="md" :disabled="submitting" @click="step=1"><v-icon start>mdi-arrow-left</v-icon>Back</v-btn>
        <v-btn color="primary" rounded="md" style="font-weight:700;min-width:180px;" :loading="submitting" @click="handleSubmit">
          <v-icon start>mdi-check-circle</v-icon> Submit to Finance
        </v-btn>
      </div>
    </v-card>

    <!-- Confirmation dialog -->
    <v-dialog v-model="doneDialog" max-width="440" persistent>
      <v-card rounded="lg" class="pa-8 text-center">
        <div style="width:64px;height:64px;background:#e6f9e6;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">
          <v-icon color="success" size="36">mdi-check-circle</v-icon>
        </div>
        <div style="font-size:20px;font-weight:800;color:#1A1A1A;margin-bottom:8px;">Claim Submitted!</div>
        <div style="font-size:13px;color:#666;margin-bottom:20px;">Your claim has been sent to Finance for review.</div>
        <v-sheet color="#F5F5F5" rounded="lg" class="pa-4 mb-5 text-left">
          <div class="d-flex justify-space-between mb-2">
            <span style="font-size:13px;color:#999;">Reference No.</span>
            <span style="font-size:13px;font-weight:700;color:#CC0000;font-family:monospace;">{{ submittedRef }}</span>
          </div>
          <div class="d-flex justify-space-between">
            <span style="font-size:13px;color:#999;">Total</span>
            <span style="font-size:16px;font-weight:700;color:#CC0000;">AED {{ grandTotal }}</span>
          </div>
        </v-sheet>
        <div class="d-flex ga-3 justify-center">
          <v-btn color="primary" rounded="md" style="font-weight:700;" @click="goToListing">View My Claims</v-btn>
          <v-btn variant="outlined" color="primary" rounded="md" @click="resetForm">New Claim</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import api from '../../api'

const auth   = useAuthStore()
const router = useRouter()

const CURRENCY_RATES = { AED:1, USD:3.6725, EUR:3.99, TL:0.108, CNY:0.507 }
const categories = ['Travel & Transport','Accommodation','Meals & Entertainment','Office Supplies','Client Entertainment','Training & Conferences','Telecommunications','Other']
const currencyCodes = Object.keys(CURRENCY_RATES)

const steps = ['Claim Details','Expense Items','Review & Submit']
const step  = ref(0)

const claim = ref({ title:'', period:'', project:'', manager:'', notes:'' })
const lines = ref([])
const submitting  = ref(false)
const doneDialog  = ref(false)
const submittedRef = ref('')
const uploadRefs  = ref({})

const claimantFields = computed(() => [
  ['Name',  auth.user?.name],
  ['Dept',  auth.user?.dept],
  ['Email', auth.user?.email],
  ['Bank',  auth.user?.bank],
])

const getRate = (code) => CURRENCY_RATES[code] ?? 1
const toAED   = (amount, currency) => ((parseFloat(amount)||0) * getRate(currency)).toFixed(2)

const grandTotal = computed(() =>
  lines.value.reduce((s,l) => s + (parseFloat(l.amount)||0) * getRate(l.currency), 0).toFixed(2)
)

const linesValid = computed(() =>
  lines.value.length > 0 && lines.value.every(l => l.date && l.category && l.description && l.amount)
)

const addLine    = () => lines.value.push({ id: Date.now(), date:'', category:'', description:'', amount:'', currency:'AED', receipts:[] })
const removeLine = (i) => lines.value.splice(i, 1)
const removeReceipt = (li, ri) => lines.value[li].receipts.splice(ri, 1)
const triggerUpload = (idx) => uploadRefs.value[idx]?.click()

const processFiles = async (files, idx) => {
  for (const file of files) {
    if (!file.type.match(/image\/(jpeg|png|heic|heif|webp)|application\/pdf/)) continue
    if (file.type.startsWith('image/') && file.size > 800_000) {
      const dataUrl = await compressImage(file)
      lines.value[idx].receipts.push({ name: file.name, type: 'image', dataUrl })
    } else if (file.type === 'application/pdf') {
      const dataUrl = await toBase64(file)
      lines.value[idx].receipts.push({ name: file.name, type: 'pdf', dataUrl })
    } else {
      const dataUrl = await toBase64(file)
      lines.value[idx].receipts.push({ name: file.name, type: 'image', dataUrl })
    }
  }
}

const toBase64 = (file) => new Promise((res, rej) => {
  const r = new FileReader()
  r.onload = e => res(e.target.result)
  r.onerror = rej
  r.readAsDataURL(file)
})

const compressImage = (file) => new Promise((resolve) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      const MAX = 1600
      let { width, height } = img
      if (width > MAX || height > MAX) {
        if (width > height) { height = Math.round(height * MAX / width); width = MAX }
        else { width = Math.round(width * MAX / height); height = MAX }
      }
      const canvas = document.createElement('canvas')
      canvas.width = width; canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL('image/jpeg', 0.82))
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(file)
})

const onFileChange = (e, idx) => processFiles(Array.from(e.target.files), idx)
const onDrop = (e, idx) => processFiles(Array.from(e.dataTransfer.files), idx)

const handleSubmit = async () => {
  submitting.value = true
  try {
    const payload = {
      ...claim.value,
      lines: lines.value.map(l => ({
        date: l.date, category: l.category,
        description: l.description, amount: parseFloat(l.amount),
        currency: l.currency, receipts: l.receipts,
      }))
    }
    const { data } = await api.post('/claims', payload)
    submittedRef.value = data.refNo
    doneDialog.value   = true
  } catch (err) {
    alert(err.response?.data?.message || 'Submission failed')
  } finally {
    submitting.value = false
  }
}

const goToListing = () => { doneDialog.value = false; router.push('/employee/my-claims') }
const resetForm = () => {
  doneDialog.value = false
  step.value  = 0
  claim.value = { title:'', period:'', project:'', manager:'', notes:'' }
  lines.value = []
}
</script>
