import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const UserAuthController = () => import('#controllers/user_auth_controller')
const UserDashboardController = () => import('#controllers/user_dashboard_controller')

// Public auth routes
router.group(() => {
  router.get('/register', [UserAuthController, 'showRegister']).as('user.register')
  router.post('/register', [UserAuthController, 'register']).as('user.register.submit')
  router.get('/login', [UserAuthController, 'showLogin']).as('user.login')
  router.post('/login', [UserAuthController, 'login']).as('user.login.submit')
  router.post('/logout', [UserAuthController, 'logout']).as('user.logout')
})

// Protected user routes
router
  .group(() => {
    router.get('/dashboard', [UserDashboardController, 'index']).as('user.dashboard')
    router.post('/properties/:id/favorite', [UserDashboardController, 'toggleFavorite']).as('user.favorite')
    router.get('/properties/:id/favorite-status', [UserDashboardController, 'getFavoriteStatus']).as('user.favorite.status')
  })
  .use([middleware.auth()])
