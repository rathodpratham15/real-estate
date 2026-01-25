import { Head, Link } from '@inertiajs/react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Property, Agent, BlogPost, Testimonial } from '@/lib/real-estate-types'
import PropertyCard from '@/components/property-card'
import TestimonialCard from '@/components/testimonial-card'
import BlogCard from '@/components/blog-card'
import Header from '@/components/header'
import Footer from '@/components/footer'

interface HomeProps {
  featuredProperties: Property[]
  testimonials: Testimonial[]
  recentBlogPosts: BlogPost[]
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

// Scroll animation component
function ScrollAnimation({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={fadeInUp}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function RealEstateHome({ featuredProperties, testimonials, recentBlogPosts }: HomeProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  })
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  // Auto-play testimonial slider
  useEffect(() => {
    if (testimonials.length <= 3) return
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => 
        prev >= Math.ceil(testimonials.length / 3) - 1 ? 0 : prev + 1
      )
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  return (
    <>
      <Head title="Realest - Discover the perfect place to call home" />
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-1">
          {/* Hero Section */}
          <motion.section
            ref={heroRef}
            className="relative w-full h-[600px] md:h-[700px] lg:h-[800px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            style={{ opacity }}
          >
            {/* Parallax Background Layers */}
            <motion.div
              className="absolute inset-0"
              style={{
                backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M50 50m-40 0a40 40 0 1 1 80 0a40 40 0 1 1 -80 0\" fill=\"none\" stroke=\"rgba(255,255,255,0.05)\" stroke-width=\"1\"/%3E%3C/svg%3E')",
                y: backgroundY,
              }}
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            />
            <motion.div
              className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
            <motion.div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.1\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
              }}
              animate={{
                x: [0, 10, 0],
                y: [0, 10, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            <motion.div
              className="relative container mx-auto px-4 md:px-6 lg:px-8 h-full flex items-center z-10"
              style={{ y: contentY }}
            >
              <motion.div
                className="max-w-4xl"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                <motion.h1
                  className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] tracking-tight"
                  variants={itemVariants}
                >
                  Discover the perfect place to call home
                </motion.h1>
                <motion.p
                  className="text-xl md:text-2xl text-slate-200 mb-10 max-w-2xl leading-relaxed"
                  variants={itemVariants}
                >
                  Your trusted real estate agency for luxury homes, offering exquisite properties.
                </motion.p>
                <motion.div variants={itemVariants}>
                  <motion.div
                    whileHover={{ scale: 1.05, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="inline-block"
                  >
                <Link
                      href="/listings"
                      className="inline-flex items-center justify-center rounded-lg bg-white px-10 py-4 text-lg font-semibold text-slate-900 shadow-lg relative overflow-hidden"
                    >
                      <motion.span
                        className="relative z-10"
                        whileHover={{ x: 2 }}
                        transition={{ duration: 0.2 }}
                >
                  Work with us
                      </motion.span>
                      <motion.div
                        className="absolute inset-0 bg-slate-100"
                        initial={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.section>

          {/* Featured Listings Section */}
          <ScrollAnimation>
            <section className="py-24 md:py-32 lg:py-40 bg-white">
              <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
                <motion.div
                  className="flex items-center justify-between mb-20"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-100px' }}
                  variants={containerVariants}
                >
                  <motion.h2
                    className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900"
                    variants={itemVariants}
                  >
                    Find homes that perfectly match your lifestyle
                  </motion.h2>
                  <motion.div variants={itemVariants}>
                    <Link
                      href="/listings"
                      className="hidden md:flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-all duration-300 group"
                    >
                      View all
                      <motion.span
                        className="inline-block"
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        →
                      </motion.span>
                    </Link>
                  </motion.div>
                </motion.div>
                
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  variants={staggerContainer}
                >
                  {featuredProperties.length > 0 ? (
                    featuredProperties.map((property, index) => (
                      <motion.div
                        key={property.id}
                        variants={staggerItem}
                        custom={index}
                      >
                        <PropertyCard property={property} />
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-slate-500 text-lg">No featured properties available at the moment.</p>
                </div>
                  )}
                </motion.div>
                
                {/* Mobile View All Link */}
                <motion.div
                  className="mt-12 md:hidden text-center"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                <Link
                    href="/listings"
                    className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
                >
                  View all →
                </Link>
                </motion.div>
            </div>
          </section>
          </ScrollAnimation>

          {/* Features Section */}
          <ScrollAnimation>
            <section className="py-24 md:py-32 lg:py-40 bg-gradient-to-b from-white to-slate-50">
              <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
                <motion.div
                  className="text-center mb-20"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-100px' }}
                  variants={containerVariants}
                >
                  <motion.h2
                    className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-slate-900"
                    variants={itemVariants}
                  >
                    A smooth and stress<br />free journey
                  </motion.h2>
                  <motion.p
                    className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
                    variants={itemVariants}
                  >
                We handle every detail with care and expertise from beginning to end.
                  </motion.p>
                </motion.div>
                
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  variants={staggerContainer}
                >
                {[
                  {
                    title: 'Flooring',
                    description: 'We supply and install a wide range of flooring options including hardwood, laminate, vinyl, and tile. Our team focuses on accurate preparation and clean installation, ensuring your floors look great, feel durable, and complement the character of your home.',
                    image: '/image/flooring.jpg',
                  },
                  {
                    title: 'Electrical Works',
                    description: 'Professional electrical installation and maintenance services.',
                    image: '/image/electrical.jpg',
                  },
                  {
                    title: 'Plumbing & Heating',
                    description: 'Expert plumbing and heating solutions for your home.',
                    image: '/image/plumbing.jpg',
                  },
                  {
                    title: 'Painting & Decorating',
                    description: 'Transform your space with our professional painting and decorating services.',
                    image: '/image/painting.jpg',
                  },
                  {
                    title: 'Landscaping',
                    description: 'Create beautiful outdoor spaces with our landscaping expertise.',
                    image: '/image/landscaping.jpg',
                  },
                  {
                    title: 'Roofing',
                    description: 'Quality roofing services to protect your investment.',
                    image: '/image/roofing.jpg',
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="bg-white rounded-2xl overflow-hidden group"
                    variants={staggerItem}
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    {feature.image && (
                      <div className="h-64 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center overflow-hidden">
                        <span className="text-slate-400 text-sm font-medium">Image</span>
                      </div>
                    )}
                    <div className="p-8">
                      <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-slate-700 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed text-base">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
                </motion.div>
              </div>
            </section>
          </ScrollAnimation>

          {/* Process Section */}
          <ScrollAnimation>
            <section className="py-24 md:py-32 lg:py-40 bg-white">
              <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
                <motion.div
                  className="text-center mb-20"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-100px' }}
                  variants={containerVariants}
                >
                  <motion.h2
                    className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-slate-900"
                    variants={itemVariants}
                  >
                    A smooth and stress<br />free journey
                  </motion.h2>
                  <motion.p
                    className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
                    variants={itemVariants}
                  >
                    We handle every detail with care and expertise from beginning to end.
                  </motion.p>
                </motion.div>
                
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  variants={staggerContainer}
                >
                {[
                  {
                    title: 'Initial Consultation',
                    description: 'We begin by understanding your goals, needs, and preferences to tailor our approach to your specific real estate journey.',
                  },
                  {
                    title: 'Market analysis & strategy',
                    description: 'We provide a comprehensive market analysis to help you understand current trends or make informed purchase decisions.',
                  },
                  {
                    title: 'Property Search or Listing',
                    description: 'We assist in finding the perfect property, utilizing our expertise to guide you through the options or marketing strategies.',
                  },
                  {
                    title: 'Home preparation & staging',
                    description: "We enhance your property's appeal with staging and improvement maximizing its value and presentation for potential buyers.",
                  },
                  {
                    title: 'Negotiation and Closing',
                    description: 'Our team handles negotiations, ensuring the best deal, and supports you through the paperwork for a seamless closing process.',
                  },
                  {
                    title: 'Post-sale support',
                    description: "Even after closing, we're here to assist with your next steps. your satisfaction is our long-term priority.",
                  },
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 group"
                    variants={staggerItem}
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-start gap-4">
                      <motion.div
                        className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-lg"
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      >
                        {index + 1}
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-3 text-slate-900">{step.title}</h3>
                        <p className="text-slate-600 leading-relaxed text-base">{step.description}</p>
                    </div>
                  </div>
                  </motion.div>
                ))}
                </motion.div>
              </div>
            </section>
          </ScrollAnimation>

          {/* FAQs Section */}
          <ScrollAnimation>
            <section className="py-24 md:py-32 lg:py-40 bg-gradient-to-b from-slate-50 to-white">
              <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl">
                <motion.div
                  className="text-center mb-20"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-100px' }}
                  variants={containerVariants}
                >
                  <motion.h2
                    className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-slate-900"
                    variants={itemVariants}
                  >
                    Your questions answered
                  </motion.h2>
                  <motion.p
                    className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
                    variants={itemVariants}
                  >
                    Here are the most common questions.
                  </motion.p>
                </motion.div>
                
                <motion.div
                  className="space-y-6"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  variants={staggerContainer}
                >
                {[
                  {
                    question: 'What services does your agency provide?',
                    answer: 'Our agency offers a wide range of services, including buying, selling, and renting residential and commercial properties.',
                  },
                  {
                    question: 'How do you determine the value of a property?',
                    answer: 'We conduct comprehensive market analysis, considering factors like location, property condition, comparable sales, and current market trends to provide accurate valuations.',
                  },
                  {
                    question: 'What are the fees for your services?',
                    answer: 'Our fee structure varies depending on the service. We provide transparent pricing and discuss all fees upfront during our initial consultation.',
                  },
                  {
                    question: 'How long does it typically take to sell a property?',
                    answer: 'The timeline varies based on market conditions, property location, and pricing strategy. On average, properties sell within 30-90 days when properly marketed.',
                  },
                  {
                    question: 'What areas do you specialize in?',
                    answer: 'We specialize in luxury residential properties, commercial real estate, and investment properties across prime locations.',
                  },
                ].map((faq, index) => (
                  <motion.div
                    key={index}
                    className="bg-white rounded-2xl overflow-hidden"
                    variants={staggerItem}
                    initial="closed"
                    animate={openFaq === index ? 'open' : 'closed'}
                  >
                    <motion.button
                      onClick={() => toggleFaq(index)}
                      className="w-full p-8 flex items-center justify-between text-left group"
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h3 className="text-xl font-bold text-slate-900 pr-4">{faq.question}</h3>
                      <motion.div
                        animate={{ rotate: openFaq === index ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                      >
                        <ChevronDown className="h-5 w-5 text-slate-600 flex-shrink-0" />
                      </motion.div>
                    </motion.button>
                    <AnimatePresence>
                      {openFaq === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeOut' }}
                          className="overflow-hidden"
                        >
                          <div className="px-8 pb-8">
                            <p className="text-slate-600 leading-relaxed text-base">{faq.answer}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
                </motion.div>
            </div>
          </section>
          </ScrollAnimation>

          {/* Testimonials Section */}
          <ScrollAnimation>
            <section className="py-24 md:py-32 lg:py-40 bg-white">
              <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
                <motion.div
                  className="text-center mb-20"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-100px' }}
                  variants={containerVariants}
                >
                  <motion.h2
                    className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-slate-900"
                    variants={itemVariants}
                  >
                In our clients' words, real estate done right
                  </motion.h2>
                  <motion.p
                    className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
                    variants={itemVariants}
                  >
                What our clients say about the quality, service, and results we deliver.
                  </motion.p>
                </motion.div>
                
                {testimonials.length > 0 ? (
                  testimonials.length > 3 ? (
                    <div className="relative">
                      <div className="overflow-hidden">
                        <motion.div
                          className="flex"
                          animate={{ x: `-${currentTestimonial * 100}%` }}
                          transition={{ duration: 0.5, ease: 'easeInOut' }}
                          drag="x"
                          dragConstraints={{ left: 0, right: 0 }}
                          onDragEnd={(e, { offset, velocity }) => {
                            const threshold = 50
                            if (Math.abs(velocity.x) > 500 || Math.abs(offset.x) > threshold) {
                              if (offset.x > 0 && currentTestimonial > 0) {
                                setCurrentTestimonial(currentTestimonial - 1)
                              } else if (offset.x < 0 && currentTestimonial < Math.ceil(testimonials.length / 3) - 1) {
                                setCurrentTestimonial(currentTestimonial + 1)
                              }
                            }
                          }}
                        >
                          {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, slideIndex) => (
                            <div key={slideIndex} className="min-w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 px-2">
                              {testimonials.slice(slideIndex * 3, slideIndex * 3 + 3).map((testimonial, cardIndex) => (
                                <motion.div
                                  key={testimonial.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: cardIndex * 0.1 }}
                                >
                                  <TestimonialCard testimonial={testimonial} />
                                </motion.div>
                              ))}
                            </div>
                          ))}
                        </motion.div>
                      </div>
                      
                      {/* Navigation Arrows */}
                      <motion.button
                        onClick={() => setCurrentTestimonial(Math.max(0, currentTestimonial - 1))}
                        disabled={currentTestimonial === 0}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed z-10"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ChevronLeft className="h-5 w-5 text-slate-900" />
                      </motion.button>
                      <motion.button
                        onClick={() => setCurrentTestimonial(Math.min(Math.ceil(testimonials.length / 3) - 1, currentTestimonial + 1))}
                        disabled={currentTestimonial >= Math.ceil(testimonials.length / 3) - 1}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed z-10"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ChevronRight className="h-5 w-5 text-slate-900" />
                      </motion.button>
                      
                      {/* Dots Indicator */}
                      <div className="flex justify-center gap-2 mt-8">
                        {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, index) => (
                          <motion.button
                            key={index}
                            onClick={() => setCurrentTestimonial(index)}
                            className={`h-2 rounded-full transition-all ${
                              currentTestimonial === index ? 'w-8 bg-slate-900' : 'w-2 bg-slate-300'
                            }`}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                          />
                ))}
              </div>
                    </div>
                  ) : (
                    <motion.div
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: '-50px' }}
                      variants={staggerContainer}
                    >
                      {testimonials.map((testimonial, index) => (
                        <motion.div
                          key={testimonial.id}
                          variants={staggerItem}
                          custom={index}
                        >
                          <TestimonialCard testimonial={testimonial} />
                        </motion.div>
                      ))}
                    </motion.div>
                  )
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-500 text-lg">No testimonials available at the moment.</p>
                  </div>
                )}
            </div>
          </section>
          </ScrollAnimation>

          {/* Blog Section */}
          <ScrollAnimation>
            <section className="py-24 md:py-32 lg:py-40 bg-gradient-to-b from-white to-slate-50">
              <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
                <motion.div
                  className="flex items-center justify-between mb-20"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-100px' }}
                  variants={containerVariants}
                >
                  <motion.h2
                    className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900"
                    variants={itemVariants}
                  >
                    Explore our latest blogs for real estate insights
                  </motion.h2>
                  <motion.div variants={itemVariants}>
                    <Link
                      href="/blog"
                      className="hidden md:flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-all duration-300 group"
                    >
                      View all
                      <motion.span
                        className="inline-block"
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        →
                      </motion.span>
                    </Link>
                  </motion.div>
                </motion.div>
                
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  variants={staggerContainer}
                >
                  {recentBlogPosts.length > 0 ? (
                    recentBlogPosts.map((post, index) => (
                      <motion.div
                        key={post.id}
                        variants={staggerItem}
                        custom={index}
                      >
                        <BlogCard post={post} />
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-slate-500 text-lg">No blog posts available at the moment.</p>
                </div>
                  )}
                </motion.div>
                
                {/* Mobile View All Link */}
                <motion.div
                  className="mt-12 md:hidden text-center"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
                >
                  View all →
                </Link>
                </motion.div>
            </div>
          </section>
          </ScrollAnimation>
        </main>
        
        <Footer />
      </div>
    </>
  )
}
