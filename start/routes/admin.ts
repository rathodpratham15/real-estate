import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#controllers/auth_controller')
const PropertiesController = () => import('#controllers/admin/properties_controller')

// Auth routes (public)
router.group(() => {
  router.get('/admin/login', [AuthController, 'showLogin']).as('admin.login')
  router.post('/admin/login', [AuthController, 'login']).as('admin.login.submit')
  router.post('/admin/logout', [AuthController, 'logout']).as('admin.logout')
})

// Admin routes (protected)
router
  .group(() => {
    router.get('/admin', async ({ response }) => response.redirect('/admin/properties'))
    router.get('/admin/properties', [PropertiesController, 'index']).as('admin.properties.index')
    router.get('/admin/properties/create', [PropertiesController, 'create']).as('admin.properties.create')
    router.post('/admin/properties', [PropertiesController, 'store']).as('admin.properties.store')
    router.get('/admin/properties/:id/edit', [PropertiesController, 'edit']).as('admin.properties.edit')
    router.put('/admin/properties/:id', [PropertiesController, 'update']).as('admin.properties.update')
    router.delete('/admin/properties/:id', [PropertiesController, 'destroy']).as('admin.properties.destroy')
  })
  .use([middleware.auth(), middleware.admin()])
