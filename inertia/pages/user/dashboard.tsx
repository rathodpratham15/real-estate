import { Head, Link, router } from '@inertiajs/react'
import { useState } from 'react'
import { Heart, Mail, Calendar, MapPin, MessageSquare, Eye, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/navbar-new'
import Footer from '@/components/footer-new'
import PropertyCard from '@/components/property-card'
import type { Property } from '@/lib/real-estate-types'

interface Contact {
  id: number
  subject: string | null
  message: string
  adminResponse: string | null
  status: 'new' | 'read' | 'replied' | 'archived'
  createdAt: string
}

interface DashboardProps {
  favoriteProperties: Property[]
  inquiries: Contact[]
}

export default function Dashboard({ favoriteProperties, inquiries }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'favorites' | 'inquiries'>('favorites')

  const formatPrice = (price: number) => {
    const priceStr = Math.floor(price).toString()
    if (priceStr.length <= 3) return `₹${priceStr}`
    const formatted = priceStr.replace(/\B(?=(\d{2})+(?!\d))/g, ',')
    return `₹${formatted}`
  }

  return (
    <div className="min-h-screen bg-white">
      <Head title="My Dashboard - Realest" />
      <Navbar />

      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-black mb-8">My Dashboard</h1>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b">
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                activeTab === 'favorites'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-600 hover:text-black'
              }`}
            >
              <Heart className="h-5 w-5 inline mr-2" />
              Saved Properties ({favoriteProperties.length})
            </button>
            <button
              onClick={() => setActiveTab('inquiries')}
              className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                activeTab === 'inquiries'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-600 hover:text-black'
              }`}
            >
              <Mail className="h-5 w-5 inline mr-2" />
              My Inquiries ({inquiries.length})
            </button>
          </div>

          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <div>
              {favoriteProperties.length === 0 ? (
                <div className="text-center py-16">
                  <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Saved Properties</h3>
                  <p className="text-gray-500 mb-6">Start exploring and save properties you're interested in!</p>
                  <Link
                    href="/listings"
                    className="inline-block px-6 py-3 rounded-xl font-medium"
                    style={{ backgroundColor: '#A8D5E2', color: '#1a1a1a' }}
                  >
                    Browse Properties
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Inquiries Tab */}
          {activeTab === 'inquiries' && (
            <div>
              {inquiries.length === 0 ? (
                <div className="text-center py-16">
                  <Mail className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Inquiries Yet</h3>
                  <p className="text-gray-500 mb-6">Your property inquiries and admin responses will appear here.</p>
                  <Link
                    href="/listings"
                    className="inline-block px-6 py-3 rounded-xl font-medium"
                    style={{ backgroundColor: '#A8D5E2', color: '#1a1a1a' }}
                  >
                    Browse Properties
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {inquiries.map((inquiry) => (
                    <div key={inquiry.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-black mb-2">
                            {inquiry.subject || 'Property Inquiry'}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(inquiry.createdAt).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                inquiry.status === 'replied'
                                  ? 'bg-green-100 text-green-800'
                                  : inquiry.status === 'read'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Your Message:</h4>
                        <p className="text-gray-600 bg-gray-50 rounded-lg p-3">{inquiry.message}</p>
                      </div>

                      {inquiry.adminResponse && (
                        <div className="border-t pt-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" style={{ color: '#A8D5E2' }} />
                            Admin Response:
                          </h4>
                          <p className="text-gray-700 bg-blue-50 rounded-lg p-3 border-l-4" style={{ borderColor: '#A8D5E2' }}>
                            {inquiry.adminResponse}
                          </p>
                        </div>
                      )}

                      {!inquiry.adminResponse && inquiry.status === 'replied' && (
                        <div className="border-t pt-4">
                          <p className="text-sm text-gray-500 italic">Response coming soon...</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
