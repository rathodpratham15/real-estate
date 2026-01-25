import { Head, Link, router } from '@inertiajs/react'
import { useEffect, useRef, useState } from 'react'
import type { Property } from '@/lib/real-estate-types'
import Navbar from '@/components/navbar-new'
import Footer from '@/components/footer-new'
import { Bed, Bath, Maximize, MapPin, Filter } from 'lucide-react'
import { motion } from 'framer-motion'

interface ListingsProps {
  properties: {
    data: Property[]
    meta: {
      currentPage: number
      lastPage: number
      perPage: number
      total: number
    }
  }
  filters: {
    propertyType: string | null
    status: string
    city: string | null
    minPrice: string | null
    maxPrice: string | null
    bedrooms: string | null
  }
  cities: string[]
}

export default function Listings({ properties, filters, cities }: ListingsProps) {
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [localFilters, setLocalFilters] = useState(filters)
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const observers = cardRefs.current.map((ref, index) => {
      if (!ref) return null
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleCards((prev) => [...new Set([...prev, index])])
            }
          })
        },
        { threshold: 0.1 }
      )
      observer.observe(ref)
      return observer
    })

    return () => {
      observers.forEach((observer) => observer?.disconnect())
    }
  }, [properties.data])

  const handleFilterChange = (key: string, value: string) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    router.get('/listings', localFilters, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  const clearFilters = () => {
    const clearedFilters = {
      propertyType: null,
      status: 'for_sale',
      city: null,
      minPrice: null,
      maxPrice: null,
      bedrooms: null,
    }
    setLocalFilters(clearedFilters)
    router.get('/listings', clearedFilters)
  }

  const formatPrice = (price: number) => {
    const priceStr = Math.floor(price).toString()
    if (priceStr.length <= 3) return `$${priceStr}`
    const formatted = priceStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return `$${formatted}`
  }

  return (
    <>
      <Head title="Listings - Realest" />

      <div className="min-h-screen bg-white">
        <Navbar />

        {/* Hero Section */}
        <div
          className="pt-24 pb-16 px-6"
          style={{
            background: 'linear-gradient(180deg, #A8D5E2 0%, #ffffff 100%)',
          }}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span
                className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4"
                style={{ backgroundColor: '#ffffff', color: '#1a1a1a' }}
              >
                All Listings
              </span>
              <h1 className="text-5xl md:text-6xl font-bold text-black mb-4">
                Explore Our Properties
              </h1>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Discover your dream home from our curated collection of luxury properties
              </p>
            </motion.div>

            {/* Filters */}
            <div className="max-w-4xl mx-auto">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 mb-4"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </button>

              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 p-6 bg-white rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  <div>
                    <label className="block text-sm font-medium mb-2 text-black">Property Type</label>
                    <select
                      value={localFilters.propertyType || ''}
                      onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-black"
                    >
                      <option value="">All Types</option>
                      <option value="house">House</option>
                      <option value="apartment">Apartment</option>
                      <option value="condo">Condo</option>
                      <option value="townhouse">Townhouse</option>
                      <option value="land">Land</option>
                      <option value="commercial">Commercial</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-black">City</label>
                    <select
                      value={localFilters.city || ''}
                      onChange={(e) => handleFilterChange('city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-black"
                    >
                      <option value="">All Cities</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-black">Bedrooms</label>
                    <select
                      value={localFilters.bedrooms || ''}
                      onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-black"
                    >
                      <option value="">Any</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                      <option value="5">5+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-black">Min Price</label>
                    <input
                      type="number"
                      value={localFilters.minPrice || ''}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      placeholder="Min"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-black">Max Price</label>
                    <input
                      type="number"
                      value={localFilters.maxPrice || ''}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      placeholder="Max"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-black"
                    />
                  </div>

                  <div className="flex items-end gap-2">
                    <button
                      onClick={applyFilters}
                      className="flex-1 px-4 py-2 bg-black text-white rounded-full hover:bg-black/90 transition-colors"
                    >
                      Apply Filters
                    </button>
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            {properties.data.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {properties.data.map((property, index) => (
                    <Link
                      href={`/listings/${property.slug}`}
                      key={property.id}
                      ref={(el) => {
                        cardRefs.current[index] = el
                      }}
                      className={`group cursor-pointer transition-all duration-700 ${
                        visibleCards.includes(index)
                          ? 'opacity-100 translate-y-0'
                          : 'opacity-0 translate-y-10'
                      }`}
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      <motion.div
                        className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500"
                        whileHover={{ y: -5 }}
                      >
                        <div className="relative overflow-hidden aspect-[4/3]">
                          {property.mainImage ? (
                            <motion.img
                              src={property.mainImage}
                              alt={property.title}
                              className="w-full h-full object-cover"
                              whileHover={{ scale: 1.1 }}
                              transition={{ duration: 0.7 }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                              <span className="text-slate-400">No Image</span>
                            </div>
                          )}
                          <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-full shadow-lg">
                            <p className="text-lg font-bold text-black">{formatPrice(property.price)}</p>
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-2xl font-bold text-black mb-2 capitalize group-hover:text-gray-700 transition-colors">
                            {property.title}
                          </h3>
                          <div className="flex items-center gap-2 text-gray-600 mb-4">
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm">{property.address || 'Premium Location'}</span>
                          </div>
                          <div className="flex items-center gap-6 text-sm text-gray-700">
                            {property.bedrooms && (
                              <div className="flex items-center gap-2">
                                <Bed className="h-5 w-5" />
                                <span className="font-medium">{property.bedrooms} Beds</span>
                              </div>
                            )}
                            {property.bathrooms && (
                              <div className="flex items-center gap-2">
                                <Bath className="h-5 w-5" />
                                <span className="font-medium">{property.bathrooms} Baths</span>
                              </div>
                            )}
                            {property.squareFeet && (
                              <div className="flex items-center gap-2">
                                <Maximize className="h-5 w-5" />
                                <span className="font-medium">
                                  {property.squareFeet.toLocaleString('en-US')} sq.ft
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {properties.meta.lastPage > 1 && (
                  <div className="flex justify-center gap-2 mt-12">
                    {Array.from({ length: properties.meta.lastPage }, (_, i) => i + 1).map((page) => (
                      <Link
                        key={page}
                        href={`/listings?page=${page}`}
                        className={`px-4 py-2 rounded-full transition-colors ${
                          page === properties.meta.currentPage
                            ? 'bg-black text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {page}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg mb-4">No properties found matching your criteria.</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-black text-white rounded-full hover:bg-black/90 transition-colors"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}
