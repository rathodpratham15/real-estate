import { Head } from '@inertiajs/react'
import type { Agent, Testimonial } from '@/lib/real-estate-types'
import TestimonialCard from '@/components/testimonial-card'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Award, Users, Home, TrendingUp } from 'lucide-react'

interface AboutPageProps {
  agents: Agent[]
  testimonials: Testimonial[]
}

export default function AboutPage({ agents, testimonials }: AboutPageProps) {
  return (
    <>
      <Head title="About Us - Realest" />
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">About Realest</h1>
                <p className="text-xl text-slate-200">
                  Your trusted real estate agency for luxury homes, offering exquisite properties
                  and exceptional service.
                </p>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4 md:px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                    <Home className="h-8 w-8 text-slate-900" />
                  </div>
                  <h3 className="text-3xl font-bold mb-2">500+</h3>
                  <p className="text-slate-600">Properties Sold</p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                    <Users className="h-8 w-8 text-slate-900" />
                  </div>
                  <h3 className="text-3xl font-bold mb-2">1000+</h3>
                  <p className="text-slate-600">Happy Clients</p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                    <Award className="h-8 w-8 text-slate-900" />
                  </div>
                  <h3 className="text-3xl font-bold mb-2">15+</h3>
                  <p className="text-slate-600">Years Experience</p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                    <TrendingUp className="h-8 w-8 text-slate-900" />
                  </div>
                  <h3 className="text-3xl font-bold mb-2">98%</h3>
                  <p className="text-slate-600">Satisfaction Rate</p>
                </div>
              </div>
            </div>
          </section>

          {/* About Content */}
          <section className="py-16 bg-slate-50">
            <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
                <div className="prose prose-lg max-w-none text-slate-700">
                  <p className="mb-4">
                    Realest was founded with a simple mission: to make real estate transactions
                    smooth, transparent, and stress-free for our clients. We understand that buying
                    or selling a property is one of life's most significant decisions, and we're
                    here to guide you through every step of the process.
                  </p>
                  <p className="mb-4">
                    Our team of experienced agents brings together decades of combined expertise
                    in the real estate market. We specialize in luxury properties, helping clients
                    find their dream homes or sell their properties at the best possible value.
                  </p>
                  <p>
                    What sets us apart is our commitment to personalized service. We take the time
                    to understand your unique needs, preferences, and goals, ensuring that every
                    transaction is tailored to your specific situation. Whether you're a first-time
                    buyer or a seasoned investor, we're here to help you achieve your real estate
                    goals.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Our Team */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4 md:px-6">
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Our Team</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {agents.map((agent) => (
                  <div key={agent.id} className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-4 mb-4">
                      {agent.photo ? (
                        <img loading="lazy" decoding="async"
                          src={agent.photo}
                          alt={`${agent.firstName} ${agent.lastName}`}
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center">
                          <span className="text-slate-600 font-semibold text-xl">
                            {agent.firstName.charAt(0)}{agent.lastName.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-semibold">
                          {agent.firstName} {agent.lastName}
                        </h3>
                        {agent.yearsOfExperience && (
                          <p className="text-sm text-slate-600">
                            {agent.yearsOfExperience} years experience
                          </p>
                        )}
                      </div>
                    </div>
                    {agent.bio && (
                      <p className="text-slate-600 mb-4">{agent.bio}</p>
                    )}
                    {agent.specialties && agent.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {agent.specialties.map((specialty, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="py-16 bg-slate-50">
            <div className="container mx-auto px-4 md:px-6">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
                What Our Clients Say
              </h2>
              <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
                Don't just take our word for it - hear from our satisfied clients.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((testimonial) => (
                  <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                ))}
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  )
}
