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
      path: '/report-positive',
      name: 'report-positive',
      meta: { title: 'Report Deceptive Design' },
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ReportPositiveView.vue')
    }
  ]
})

export default router
