import router from '@adonisjs/core/services/router'

const RealEstateController = () => import('#controllers/real_estate_controller')

// Home page
router.get('/', [RealEstateController, 'home']).as('home')

// Listings
router.get('/listings', [RealEstateController, 'listings']).as('listings')
router.get('/listings/:slug', [RealEstateController, 'property']).as('property')

// Blog
router.get('/blog', [RealEstateController, 'blog']).as('blog')
router.get('/blog/:slug', [RealEstateController, 'blogPost']).as('blog-post')

// About
router.get('/about', [RealEstateController, 'about']).as('about')

// Contact
router.get('/contact', [RealEstateController, 'contact']).as('contact')
router.post('/contact', [RealEstateController, 'contact']).as('contact.submit')
