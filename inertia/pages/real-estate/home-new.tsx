import { Head } from '@inertiajs/react'
import type { Property, BlogPost, Testimonial } from '@/lib/real-estate-types'
import Navbar from '@/components/navbar-new'
import Hero from '@/components/hero-new'
import Listings from '@/components/listings-new'
import Features from '@/components/features-new'
import Testimonials from '@/components/testimonials-new'
import Process from '@/components/process-new'
import FAQs from '@/components/faqs-new'
import Blog from '@/components/blog-new'
import Footer from '@/components/footer-new'

interface HomeProps {
  featuredProperties: Property[]
  testimonials: Testimonial[]
  recentBlogPosts: BlogPost[]
}

// Mock features data - in production, this would come from the backend
const featuresData = [
  {
    id: 1,
    title: 'Flooring',
    description:
      'We supply and install a wide range of flooring options including hardwood, laminate, vinyl, and tile. Our team focuses on accurate preparation and clean installation, ensuring your floors look great, feel durable, and complement the character of your home.',
    image: 'https://images.unsplash.com/photo-1582635167029-a7632ba81b6a?crop=entropy&cs=srgb&fm=jpg&q=85',
  },
  {
    id: 2,
    title: 'Electrical Works',
    description:
      'Professional electrical installation and maintenance services ensuring safety and efficiency throughout your property with certified electricians.',
    image: 'https://images.unsplash.com/photo-1582145078208-191fc429b031?crop=entropy&cs=srgb&fm=jpg&q=85',
  },
  {
    id: 3,
    title: 'Plumbing & Heating',
    description:
      'Comprehensive plumbing and heating solutions for your home, from installation to repairs and regular maintenance services.',
    image: 'https://images.unsplash.com/photo-1637237498552-ba012c4a29c9?crop=entropy&cs=srgb&fm=jpg&q=85',
  },
  {
    id: 4,
    title: 'Painting & Decorating',
    description:
      'Expert painting and decorating services to transform your space with high-quality finishes and attention to detail.',
    image: 'https://images.pexels.com/photos/34733216/pexels-photo-34733216.jpeg',
  },
  {
    id: 5,
    title: 'Landscaping',
    description:
      'Professional landscaping services to create beautiful outdoor spaces that enhance your property\'s curb appeal and value.',
    image: 'https://images.pexels.com/photos/34853734/pexels-photo-34853734.jpeg',
  },
  {
    id: 6,
    title: 'Roofing',
    description:
      'Complete roofing solutions including installation, repairs, and maintenance to protect your home from the elements.',
    image: 'https://images.unsplash.com/photo-1724688078741-6d89e587e809?crop=entropy&cs=srgb&fm=jpg&q=85',
  },
]

// Mock process steps - in production, this would come from the backend
const processSteps = [
  {
    id: 1,
    title: 'Initial Consultation',
    description:
      'We begin by understanding your goals, needs, and preferences to tailor our approach to your specific real estate journey.',
  },
  {
    id: 2,
    title: 'Market analysis & strategy',
    description:
      'We provide a comprehensive market analysis to help you understand current trends or make informed purchase decisions.',
  },
  {
    id: 3,
    title: 'Property Search or Listing',
    description:
      'We assist in finding the perfect property, utilizing our expertise to guide you through the options or marketing strategies.',
  },
  {
    id: 4,
    title: 'Home preparation & staging',
    description:
      'We enhance your property\'s appeal with staging and improvement maximizing its value and presentation for potential buyers.',
  },
  {
    id: 5,
    title: 'Negotiation and Closing',
    description:
      'Our team handles negotiations, ensuring the best deal, and supports you through the paperwork for a seamless closing process.',
  },
  {
    id: 6,
    title: 'Post-sale support',
    description:
      'Even after closing, we\'re here to assist with your next steps. your satisfaction is our long-term priority.',
  },
]

// Mock FAQs - in production, this would come from the backend
const faqsData = [
  {
    id: 1,
    question: 'What services does your agency provide?',
    answer:
      'Our agency offers a wide range of services, including buying, selling, and renting residential and commercial properties. We provide comprehensive market analysis, property staging, professional photography, and expert negotiation to ensure the best outcomes for our clients.',
  },
  {
    id: 2,
    question: 'How do you determine the value of a property?',
    answer:
      'We use a combination of comparative market analysis, recent sales data, property condition assessment, and current market trends to accurately determine property values. Our experienced appraisers ensure you get the most accurate valuation.',
  },
  {
    id: 3,
    question: 'What are the fees for your services?',
    answer:
      'Our fee structure is transparent and competitive. Typically, we charge a commission based on the final sale price. We offer different packages tailored to your needs and will discuss all costs upfront before you commit.',
  },
  {
    id: 4,
    question: 'How long does it typically take to sell a property?',
    answer:
      'The time to sell varies depending on market conditions, property location, pricing, and condition. On average, properties sell within 30-90 days. Our marketing strategies and extensive network help us achieve faster sales than the market average.',
  },
  {
    id: 5,
    question: 'What areas do you specialize in?',
    answer:
      'We specialize in luxury residential properties, waterfront estates, modern contemporary homes, and commercial real estate across the region. Our team has deep knowledge of local markets and exclusive listings in premium neighborhoods.',
  },
]

export default function RealEstateHome({ featuredProperties, testimonials, recentBlogPosts }: HomeProps) {
  return (
    <>
      <Head title="Realest - Discover the perfect place to call home" />

      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Hero />
          <Listings properties={featuredProperties} />
          <Features features={featuresData} />
          <Testimonials testimonials={testimonials} />
          <Process steps={processSteps} />
          <FAQs faqs={faqsData} />
          <Blog posts={recentBlogPosts} />
        </main>
        <Footer />
      </div>
    </>
  )
}
