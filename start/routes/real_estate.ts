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

// Testimonials (public submission)
router.get('/testimonials/share', [RealEstateController, 'showTestimonialForm']).as('testimonials.share')
router.post('/testimonials/share', [RealEstateController, 'submitTestimonial']).as('testimonials.submit')
router.get('/api/ai/property-copilot', [RealEstateController, 'propertyCopilot']).as('api.ai.property-copilot')
router.get('/api/ai/property-copilot/eval', [RealEstateController, 'propertyCopilotEval']).as('api.ai.property-copilot-eval')
