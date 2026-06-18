import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import LoginView        from '../views/LoginView.vue'
import EmployeeLayout   from '../views/employee/EmployeeLayout.vue'
import ClaimForm        from '../views/employee/ClaimForm.vue'
import ClaimListing     from '../views/employee/ClaimListing.vue'
import ManagerLayout    from '../views/manager/ManagerLayout.vue'
import ManagerDashboard from '../views/manager/ManagerDashboard.vue'
import ManagerClaims    from '../views/manager/ManagerClaims.vue'

const routes = [
  { path: '/',        redirect: '/login' },
  { path: '/login',   component: LoginView },
  {
    path: '/employee',
    component: EmployeeLayout,
    meta: { requiresAuth: true, role: 'employee' },
    children: [
      { path: '',           redirect: '/employee/new-claim' },
      { path: 'new-claim',  component: ClaimForm,    name: 'NewClaim' },
      { path: 'my-claims',  component: ClaimListing, name: 'MyClaims' },
    ],
  },
  {
    path: '/manager',
    component: ManagerLayout,
    meta: { requiresAuth: true, role: 'manager' },
    children: [
      { path: '',         redirect: '/manager/dashboard' },
      { path: 'dashboard', component: ManagerDashboard, name: 'Dashboard' },
      { path: 'claims',    component: ManagerClaims,    name: 'AllClaims' },
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: '/login' },
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth) {
    if (!auth.isLoggedIn) return next('/login')
    if (!auth.user) await auth.fetchMe()
    if (to.meta.role && auth.user?.role !== to.meta.role) {
      return next(auth.isManager ? '/manager' : '/employee')
    }
  }
  if (to.path === '/login' && auth.isLoggedIn) {
    if (!auth.user) await auth.fetchMe()
    return next(auth.isManager ? '/manager' : '/employee')
  }
  next()
})

export default router
