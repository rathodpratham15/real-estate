import { Head, useForm } from '@inertiajs/react'
import type { Agent } from '@/lib/real-estate-types'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { useState } from 'react'

interface ContactPageProps {
  agents: Agent[]
}

export default function ContactPage({ agents }: ContactPageProps) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    phone: '',
    message: '',
    agentId: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // You'll need to create a contact form handler in the controller
    post('/contact', {
      preserveScroll: true,
    })
  }

  return (
    <>
      <Head title="Contact Us - Realest" />
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-1 py-8 md:py-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-12 text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h1>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-lg p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={data.phone}
                      onChange={(e) => setData('phone', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>

                  <div className="mb-6">
                    <label htmlFor="agentId" className="block text-sm font-medium mb-2">
                      Preferred Agent (Optional)
                    </label>
                    <select
                      id="agentId"
                      value={data.agentId}
                      onChange={(e) => setData('agentId', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
                    >
                      <option value="">Select an agent</option>
                      {agents.map((agent) => (
                        <option key={agent.id} value={agent.id}>
                          {agent.firstName} {agent.lastName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      rows={6}
                      value={data.message}
                      onChange={(e) => setData('message', e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full px-6 py-3 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-slate-600 mt-1" />
                      <div>
                        <p className="font-medium">Address</p>
                        <p className="text-slate-600 text-sm">
                          123 Real Estate Street<br />
                          City, State 12345
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-slate-600 mt-1" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <a href="tel:+1234567890" className="text-slate-600 text-sm hover:text-slate-900">
                          (123) 456-7890
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-slate-600 mt-1" />
                      <div>
                        <p className="font-medium">Email</p>
                        <a href="mailto:info@realest.com" className="text-slate-600 text-sm hover:text-slate-900">
                          info@realest.com
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-slate-600 mt-1" />
                      <div>
                        <p className="font-medium">Office Hours</p>
                        <p className="text-slate-600 text-sm">
                          Monday - Friday: 9:00 AM - 6:00 PM<br />
                          Saturday: 10:00 AM - 4:00 PM<br />
                          Sunday: Closed
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Agents */}
                {agents.length > 0 && (
                  <div className="bg-white border border-slate-200 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Our Agents</h3>
                    <div className="space-y-4">
                      {agents.slice(0, 3).map((agent) => (
                        <div key={agent.id} className="flex items-center gap-3">
                          {agent.photo ? (
                            <img
                              src={agent.photo}
                              alt={`${agent.firstName} ${agent.lastName}`}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center">
                              <span className="text-slate-600 font-semibold text-sm">
                                {agent.firstName.charAt(0)}{agent.lastName.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div>
                            <p className="font-medium">
                              {agent.firstName} {agent.lastName}
                            </p>
                            {agent.phone && (
                              <a href={`tel:${agent.phone}`} className="text-sm text-slate-600 hover:text-slate-900">
                                {agent.phone}
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  )
}
