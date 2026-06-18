import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../api'

export const useAuthStore = defineStore('auth', () => {
  const user  = ref(null)
  const token = ref(localStorage.getItem('wps_token') || null)

  const isLoggedIn  = computed(() => !!token.value)
  const isManager   = computed(() => user.value?.role === 'manager')
  const isEmployee  = computed(() => user.value?.role === 'employee')

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password })
    token.value = data.token
    user.value  = data.user
    localStorage.setItem('wps_token', data.token)
    return data.user
  }

  async function fetchMe() {
    if (!token.value) return
    try {
      const { data } = await api.get('/auth/me')
      user.value = data
    } catch {
      logout()
    }
  }

  function logout() {
    token.value = null
    user.value  = null
    localStorage.removeItem('wps_token')
  }

  return { user, token, isLoggedIn, isManager, isEmployee, login, fetchMe, logout }
})
