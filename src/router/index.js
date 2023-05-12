import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      // Extensions open at index.html, which we redirect to the root
      path: '/index.html',
      redirect: _ => {
        return { path: '/' }
      },
    },
    {
      path: '/report-manual',
      name: 'report-manual',
      meta: { title: 'Report Deceptive Design' },
      component: () => import('../views/ManualReportView.vue')
    },
    {
      path: '/report-auto',
      name: 'report-auto',
      meta: { title: 'Submit Detection Feedback' },
      component: () => import('../views/AutoReportView.vue')
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { top: 0 }
  },
})

export default router
