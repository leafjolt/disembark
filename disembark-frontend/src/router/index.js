import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/signup', name: 'Signup', component: () => import('../views/SignupView.vue') },
  { path: '/login', name: 'Login', component: () => import('../views/LoginView.vue') },
  { path: '/trips', name: 'Trips', component: () => import('../views/TripsView.vue'), meta: { requiresAuth: true } },
  { path: '/trip/:id', name: 'Itinerary', component: () => import('../views/ItineraryView.vue'), meta: { requiresAuth: true } },
  { path: '/trip/:id/event', name: 'EventEdit', component: () => import('../views/EventEditView.vue'), meta: { requiresAuth: true } },
  { path: '/trip/:id/event/:eid', name: 'EventEditExisting', component: () => import('../views/EventEditView.vue'), meta: { requiresAuth: true } },
  { path: '/', redirect: '/trips' }
]

const router = createRouter({
 // history: createWebHistory('/disembark/'),
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated()) {
    next('/login')
  } else if ((to.name === 'Login' || to.name === 'Signup') && authStore.isAuthenticated()) {
    next('/trips')
  } else {
    next()
  }
})

export default router
