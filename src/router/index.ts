/**
 * router/index.ts
 *
 * Automatic routes for ./src/pages/*.vue
 *   /         -> pages/index.vue    (início)
 *   /pets     -> pages/pets.vue     (CRUD)
 *   /consulta -> pages/consulta.vue (consulta com filtros)
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
