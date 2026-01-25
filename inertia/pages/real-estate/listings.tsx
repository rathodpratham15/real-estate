import { Head, Link, router } from '@inertiajs/react'
import type { Property } from '@/lib/real-estate-types'
import PropertyCard from '@/components/property-card'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Search, Filter } from 'lucide-react'
import { useState } from 'react'

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
  const [showFilters, setShowFilters] = useState(false)
  const [localFilters, setLocalFilters] = useState(filters)

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

  return (
    <>
      <Head title="Listings - Realest" />
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-1 py-8 md:py-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Find Your Dream Home</h1>
              <p className="text-slate-600">
                {properties.meta.total} properties available
              </p>
            </div>

            {/* Filters */}
            <div className="mb-8">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </button>

              {showFilters && (
                <div className="mt-4 p-6 bg-slate-50 rounded-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Property Type</label>
                    <select
                      value={localFilters.propertyType || ''}
                      onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md"
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
                    <label className="block text-sm font-medium mb-2">City</label>
                    <select
                      value={localFilters.city || ''}
                      onChange={(e) => handleFilterChange('city', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md"
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
                    <label className="block text-sm font-medium mb-2">Bedrooms</label>
                    <select
                      value={localFilters.bedrooms || ''}
                      onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md"
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
                    <label className="block text-sm font-medium mb-2">Min Price</label>
                    <input
                      type="number"
                      value={localFilters.minPrice || ''}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      placeholder="Min"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Max Price</label>
                    <input
                      type="number"
                      value={localFilters.maxPrice || ''}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      placeholder="Max"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md"
                    />
                  </div>

                  <div className="flex items-end gap-2">
                    <button
                      onClick={applyFilters}
                      className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors"
                    >
                      Apply Filters
                    </button>
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Properties Grid */}
            {properties.data.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {properties.data.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>

                {/* Pagination */}
                {properties.meta.lastPage > 1 && (
                  <div className="flex justify-center gap-2">
                    {Array.from({ length: properties.meta.lastPage }, (_, i) => i + 1).map((page) => (
                      <Link
                        key={page}
                        href={`/listings?page=${page}`}
                        className={`px-4 py-2 rounded-md ${
                          page === properties.meta.currentPage
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        } transition-colors`}
                      >
                        {page}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-600 text-lg">No properties found matching your criteria.</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-slate-900 hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  )
}
