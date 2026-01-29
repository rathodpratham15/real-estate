import { Head, Link, router, usePage } from '@inertiajs/react'
import type { Property } from '@/lib/real-estate-types'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useForm } from '@inertiajs/react'
import { useEffect } from 'react'

interface PropertiesIndexProps {
  properties: {
    data: Property[]
    meta: {
      currentPage: number
      lastPage: number
      perPage: number
      total: number
    }
  }
}

export default function PropertiesIndex({ properties }: PropertiesIndexProps) {
  const { delete: deleteProperty, processing } = useForm()
  const { flash } = usePage().props as any

  useEffect(() => {
    if (flash?.success) {
      // Success message is handled by the page reload
    }
  }, [flash])

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this property?')) {
      deleteProperty(`/admin/properties/${id}`, {
        preserveScroll: true,
      })
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title="Properties - Admin" />

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-black">Properties</h1>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/properties/create"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white font-medium transition-colors"
              style={{ backgroundColor: '#A8D5E2', color: '#1a1a1a' }}
            >
              <Plus className="h-5 w-5" />
              Add Property
            </Link>
            <form method="POST" action="/admin/logout" className="inline">
              <Button type="submit" variant="outline" className="rounded-xl">
                Logout
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {flash?.success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-sm text-green-600">{flash.success}</p>
          </div>
        )}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Property</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Location</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Featured</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {properties.data.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {property.mainImage ? (
                          <img
                            src={property.mainImage}
                            alt={property.title}
                            className="w-16 h-16 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No Image</span>
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-black">{property.title}</p>
                          <p className="text-sm text-gray-600 capitalize">{property.propertyType}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700">{property.city}, {property.state}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-black">{formatPrice(property.price)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${
                          property.status === 'for_sale'
                            ? 'bg-green-100 text-green-800'
                            : property.status === 'sold'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {property.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {property.featured ? (
                        <span className="text-sm text-gray-700">Yes</span>
                      ) : (
                        <span className="text-sm text-gray-400">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/listings/${property.slug}`}
                          target="_blank"
                          className="p-2 text-gray-600 hover:text-black transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/properties/${property.id}/edit`}
                          className="p-2 text-gray-600 hover:text-black transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(property.id)}
                          disabled={processing}
                          className="p-2 text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {properties.meta.lastPage > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {properties.data.length} of {properties.meta.total} properties
              </p>
              <div className="flex gap-2">
                {Array.from({ length: properties.meta.lastPage }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => router.get('/admin/properties', { page })}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      page === properties.meta.currentPage
                        ? 'bg-[#A8D5E2] text-black'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
