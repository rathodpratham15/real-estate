import { Head, Link } from '@inertiajs/react'
import type { Property } from '@/lib/real-estate-types'
import PropertyCard from '@/components/property-card'
import Navbar from '@/components/navbar-new'
import Footer from '@/components/footer-new'
import { Bed, Bath, Square, MapPin, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'

interface PropertyPageProps {
  property: Property
  similarProperties: Property[]
}

export default function PropertyPage({ property, similarProperties }: PropertyPageProps) {
  const formatPrice = (price: number) => {
    const priceStr = Math.floor(price).toString()
    if (priceStr.length <= 3) return `₹${priceStr}`
    // Format: ₹27,00,000 (Indian numbering system)
    const formatted = priceStr.replace(/\B(?=(\d{2})+(?!\d))/g, ',')
    return `₹${formatted}`
  }

  return (
    <>
      <Head title={`${property.title} - Realest`} />

      <div className="min-h-screen bg-white">
        <Navbar />

        {/* Hero Image */}
        <div className="relative h-[400px] md:h-[500px] bg-gray-200">
          {property.mainImage ? (
            <img loading="lazy" decoding="async"
              src={property.mainImage}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span>No Image Available</span>
            </div>
          )}
          {property.featured && (
            <span
              className="absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-semibold"
              style={{ backgroundColor: '#A8D5E2', color: '#1a1a1a' }}
            >
              Featured
            </span>
          )}
        </div>

        <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-black">{property.title}</h1>
              <p className="text-2xl font-bold text-black mb-6">{formatPrice(property.price)}</p>

              <div className="flex flex-wrap items-center gap-4 mb-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>
                    {property.address}, {property.city}, {property.state} {property.zipCode}
                  </span>
                </div>
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-6 rounded-3xl" style={{ backgroundColor: '#A8D5E2' }}>
                {property.bedrooms && (
                  <div>
                    <div className="flex items-center gap-2 text-black mb-1">
                      <Bed className="h-5 w-5" />
                      <span className="font-semibold">Bedrooms</span>
                    </div>
                    <p className="text-2xl font-bold text-black">{property.bedrooms}</p>
                  </div>
                )}
                {property.bathrooms && (
                  <div>
                    <div className="flex items-center gap-2 text-black mb-1">
                      <Bath className="h-5 w-5" />
                      <span className="font-semibold">Bathrooms</span>
                    </div>
                    <p className="text-2xl font-bold text-black">{property.bathrooms}</p>
                  </div>
                )}
                {property.squareFeet && (
                  <div>
                    <div className="flex items-center gap-2 text-black mb-1">
                      <Square className="h-5 w-5" />
                      <span className="font-semibold">Square Feet</span>
                    </div>
                    <p className="text-2xl font-bold text-black">{property.squareFeet.toLocaleString()}</p>
                  </div>
                )}
                {property.yearBuilt && (
                  <div>
                    <div className="flex items-center gap-2 text-black mb-1">
                      <Calendar className="h-5 w-5" />
                      <span className="font-semibold">Year Built</span>
                    </div>
                    <p className="text-2xl font-bold text-black">{property.yearBuilt}</p>
                  </div>
                )}
              </div>

              {/* Description */}
              {property.description && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-black">Description</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{property.description}</p>
                </div>
              )}

              {/* Additional Images */}
              {property.images && property.images.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-black">Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.images.map((image, index) => (
                      <div key={index} className="relative h-48 bg-gray-200 rounded-3xl overflow-hidden">
                        <img loading="lazy" decoding="async" src={image} alt={`${property.title} - Image ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Features */}
              {property.features && Object.keys(property.features).length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-black">Features</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(property.features).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2">
                        <span className="text-gray-600">•</span>
                        <span className="text-gray-700">
                          <strong>{key}:</strong> {String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Contact Agent */}
              {property.agent && (
                <motion.div
                  className="bg-white border border-gray-200 rounded-3xl p-6 mb-8 sticky top-4 shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h3 className="text-xl font-bold mb-4 text-black">Contact Agent</h3>
                  <div className="flex items-center gap-4 mb-4">
                    {property.agent.photo ? (
                      <img loading="lazy" decoding="async"
                        src={property.agent.photo}
                        alt={`${property.agent.firstName} ${property.agent.lastName}`}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A8D5E2' }}>
                        <span className="text-black font-semibold">
                          {property.agent.firstName.charAt(0)}{property.agent.lastName.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-black">
                        {property.agent.firstName} {property.agent.lastName}
                      </p>
                      {property.agent.yearsOfExperience && (
                        <p className="text-sm text-gray-600">{property.agent.yearsOfExperience} years experience</p>
                      )}
                    </div>
                  </div>

                  {property.agent.bio && <p className="text-gray-600 text-sm mb-4">{property.agent.bio}</p>}

                  <div className="space-y-2">
                    {property.agent.phone && (
                      <a
                        href={`tel:${property.agent.phone}`}
                        className="flex items-center gap-2 text-gray-700 hover:text-black"
                      >
                        <Phone className="h-4 w-4" />
                        <span>{property.agent.phone}</span>
                      </a>
                    )}
                    {property.agent.email && (
                      <a
                        href={`mailto:${property.agent.email}`}
                        className="flex items-center gap-2 text-gray-700 hover:text-black"
                      >
                        <Mail className="h-4 w-4" />
                        <span>{property.agent.email}</span>
                      </a>
                    )}
                  </div>

                  <button className="w-full mt-4 px-6 py-3 bg-black text-white rounded-full hover:bg-black/90 transition-colors">
                    Contact Agent
                  </button>
                </motion.div>
              )}

              {/* Property Info */}
              <div className="rounded-3xl p-6" style={{ backgroundColor: '#A8D5E2' }}>
                <h3 className="text-lg font-semibold mb-4 text-black">Property Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-black">Type:</span>
                    <span className="font-medium capitalize text-black">
                      {property.propertyType === 'other' && property.propertyTypeOther 
                        ? property.propertyTypeOther 
                        : property.propertyType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black">Status:</span>
                    <span className="font-medium capitalize text-black">{property.status.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black">Property ID:</span>
                    <span className="font-medium text-black">#{property.id}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Properties */}
          {similarProperties.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6 text-black">Similar Properties</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarProperties.map((similarProperty) => (
                  <PropertyCard key={similarProperty.id} property={similarProperty} />
                ))}
              </div>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  )
}
