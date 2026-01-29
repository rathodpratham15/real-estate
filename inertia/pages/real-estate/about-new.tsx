import { Head } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import Navbar from '@/components/navbar-new'
import Footer from '@/components/footer-new'
import { Users, Target, Award, Heart } from 'lucide-react'
import type { Agent } from '@/lib/real-estate-types'

interface AboutPageProps {
  agents: Agent[]
  stats: {
    happyClients: number
    propertiesSold: number
    yearsExperience: number
    satisfactionRate: number
  }
}

export default function AboutPage({ agents, stats }: AboutPageProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0)
    }
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  const statsData = [
    { icon: Users, value: `${stats.happyClients}+`, label: 'Happy Clients' },
    { icon: Target, value: `${stats.propertiesSold}+`, label: 'Properties Sold' },
    { icon: Award, value: `${stats.yearsExperience}+`, label: 'Years Experience' },
    { icon: Heart, value: `${stats.satisfactionRate}%`, label: 'Satisfaction Rate' },
  ]

  // Map agents to team format
  const team = agents.map((agent) => ({
    name: `${agent.firstName} ${agent.lastName}`,
    role: agent.specialties?.[0] || 'Real Estate Agent',
    image: agent.photo || `https://ui-avatars.com/api/?name=${agent.firstName}+${agent.lastName}&size=400`,
  }))

  return (
    <div className="min-h-screen bg-white">
      <Head title="About Us - Realest" />
      <Navbar />

      <div
        className="pt-24 pb-16 px-6"
        style={{
          background: 'linear-gradient(180deg, #A8D5E2 0%, #ffffff 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div
            className={`text-center mb-12 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <span
              className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4"
              style={{ backgroundColor: '#ffffff', color: '#1a1a1a' }}
            >
              About Us
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-black mb-4">
              Your Trusted Real Estate Partner
            </h1>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              We're dedicated to helping you find the perfect property and making your real estate journey smooth and successful.
            </p>
          </div>
        </div>
      </div>

      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div
              className={`transition-all duration-1000 delay-200 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`}
            >
              <h2 className="text-4xl font-bold text-black mb-6">Our Story</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Founded in 2008, Realest has grown from a small local agency to one of the most trusted names in luxury real estate. Our passion for exceptional properties and dedication to client satisfaction has been the cornerstone of our success.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                We believe that finding the perfect home is more than just a transaction—it's about discovering a place where memories are made and dreams come true. Our team of experienced professionals is committed to providing personalized service and expert guidance throughout your real estate journey.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Whether you're buying your first home, upgrading to a luxury estate, or selling a property, we're here to make the process seamless and rewarding.
              </p>
            </div>
            <div
              className={`rounded-3xl overflow-hidden shadow-2xl transition-all duration-1000 delay-400 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
              }`}
            >
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop"
                alt="Our office"
                className="w-full h-[500px] object-cover"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {statsData.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={index}
                  className={`text-center p-6 bg-gray-50 rounded-3xl transition-all duration-700 hover:shadow-lg ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${(index + 2) * 100}ms` }}
                >
                  <div
                    className="inline-flex p-4 rounded-full mb-4"
                    style={{ backgroundColor: '#A8D5E2' }}
                  >
                    <Icon className="h-8 w-8 text-black" />
                  </div>
                  <p className="text-4xl font-bold text-black mb-2">{stat.value}</p>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              )
            })}
          </div>

          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-black mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our experienced professionals are dedicated to helping you achieve your real estate goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.length > 0 ? (
              team.map((member, index) => (
                <div
                  key={index}
                  className={`group text-center transition-all duration-700 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${(index + 6) * 100}ms` }}
                >
                  <div className="relative overflow-hidden rounded-3xl mb-4 aspect-square">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-1">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600">No team members available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-black mb-6">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-black mb-3">Integrity</h3>
              <p className="text-gray-600">
                We operate with honesty and transparency in every transaction.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-black mb-3">Excellence</h3>
              <p className="text-gray-600">
                We strive for the highest standards in service and results.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-black mb-3">Client-First</h3>
              <p className="text-gray-600">
                Your satisfaction and success are our top priorities.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
