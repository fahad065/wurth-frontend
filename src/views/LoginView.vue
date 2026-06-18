<template>
  <div style="min-height:100vh;background:#F5F5F5;display:flex;flex-direction:column;">
    <!-- Header -->
    <div style="background:#CC0000;height:56px;display:flex;align-items:center;padding:0 24px;">
      <div style="background:white;color:#CC0000;font-weight:900;font-size:12px;padding:4px 8px;border-radius:3px;letter-spacing:1px;">WÜRTH</div>
      <div style="margin-left:12px;">
        <div style="color:white;font-weight:700;font-size:14px;line-height:1.1;">Professional Solutions</div>
        <div style="color:rgba(255,255,255,0.8);font-size:11px;">Expense Claims Portal</div>
      </div>
      <div style="height:3px;background:#1A1A1A;position:absolute;bottom:0;left:0;right:0;"></div>
    </div>

    <div style="flex:1;display:flex;align-items:center;justify-content:center;padding:32px 16px;">
      <div style="width:100%;max-width:420px;">
        <v-card rounded="lg" elevation="1" class="pa-8">
          <div class="text-center mb-6">
            <div style="width:52px;height:52px;background:#CC0000;border-radius:10px;display:flex;align-items:center;justify-content:center;margin:0 auto 12px;">
              <v-icon color="white" size="28">mdi-receipt-text</v-icon>
            </div>
            <div style="font-size:20px;font-weight:800;color:#1A1A1A;">Sign in to WPS Claims</div>
            <div style="font-size:13px;color:#666;margin-top:4px;">Use your corporate email address</div>
          </div>

          <v-form @submit.prevent="handleLogin">
            <div class="mb-4">
              <label class="field-label">Corporate Email</label>
              <v-text-field v-model="email" type="email" placeholder="you@wuerth-professional.com"
                variant="outlined" density="comfortable" color="primary" hide-details="auto" />
            </div>
            <div class="mb-5">
              <label class="field-label">Password</label>
              <v-text-field v-model="password" :type="showPass ? 'text' : 'password'" placeholder="••••••••"
                variant="outlined" density="comfortable" color="primary"
                :append-inner-icon="showPass ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPass = !showPass" hide-details="auto" />
            </div>

            <v-alert v-if="error" type="error" variant="tonal" rounded="lg" class="mb-4" style="font-size:13px;">
              {{ error }}
            </v-alert>

            <v-btn type="submit" color="primary" block size="large" :loading="loading" rounded="md" style="font-weight:700;">
              Sign In
            </v-btn>
          </v-form>

          <!-- Demo hints -->
          <v-sheet color="#F5F5F5" rounded="lg" class="pa-3 mt-5">
            <div style="font-size:12px;color:#666;line-height:1.8;">
              <strong>Demo Credentials:</strong><br>
              <span style="color:#CC0000;">manager@wuerth-professional.com</span> / manager123<br>
              <span style="color:#1565C0;">fahad@wuerth-professional.com</span> / fahad123<br>
              <span style="color:#1565C0;">test@wuerth-professional.com</span> / test123
            </div>
          </v-sheet>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth     = useAuthStore()
const router   = useRouter()
const email    = ref('')
const password = ref('')
const error    = ref('')
const loading  = ref(false)
const showPass = ref(false)

const handleLogin = async () => {
  error.value   = ''
  loading.value = true
  try {
    const user = await auth.login(email.value, password.value)
    router.push(user.role === 'manager' ? '/manager' : '/employee')
  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
