import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#controllers/auth_controller')
const PropertiesController = () => import('#controllers/Admin/properties_controller')
const ContactsController = () => import('#controllers/Admin/contacts_controller')
const TestimonialsController = () => import('#controllers/Admin/testimonials_controller')

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
    
    // Properties routes
    router.get('/admin/properties', [PropertiesController, 'index']).as('admin.properties.index')
    router.get('/admin/properties/create', [PropertiesController, 'create']).as('admin.properties.create')
    router.post('/admin/properties', [PropertiesController, 'store']).as('admin.properties.store')
    router.get('/admin/properties/:id/edit', [PropertiesController, 'edit']).as('admin.properties.edit')
    router.put('/admin/properties/:id', [PropertiesController, 'update']).as('admin.properties.update')
    router.delete('/admin/properties/:id', [PropertiesController, 'destroy']).as('admin.properties.destroy')
    
    // Contacts routes
    router.get('/admin/contacts', [ContactsController, 'index']).as('admin.contacts.index')
    router.get('/admin/contacts/:id', [ContactsController, 'show']).as('admin.contacts.show')
    router.put('/admin/contacts/:id/status', [ContactsController, 'updateStatus']).as('admin.contacts.updateStatus')
    router.delete('/admin/contacts/:id', [ContactsController, 'destroy']).as('admin.contacts.destroy')

    // Testimonials routes
    router.get('/admin/testimonials', [TestimonialsController, 'index']).as('admin.testimonials.index')
    router.get('/admin/testimonials/create', [TestimonialsController, 'create']).as('admin.testimonials.create')
    router.post('/admin/testimonials', [TestimonialsController, 'store']).as('admin.testimonials.store')
    router.get('/admin/testimonials/:id/edit', [TestimonialsController, 'edit']).as('admin.testimonials.edit')
    router.put('/admin/testimonials/:id', [TestimonialsController, 'update']).as('admin.testimonials.update')
    router.delete('/admin/testimonials/:id', [TestimonialsController, 'destroy']).as('admin.testimonials.destroy')
  })
  .use([middleware.auth(), middleware.admin()])
