import { Head, Link, router, usePage } from '@inertiajs/react'
import { Plus, Edit, Trash2, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Testimonial {
  id: number
  clientName: string
  clientPhoto: string | null
  content: string
  rating: number | null
  propertyType: string | null
  propertyId: number | null
  property?: {
    id: number
    title: string
    slug: string
  } | null
  featured: boolean
  order: number
  createdAt: string
}

interface TestimonialsIndexProps {
  testimonials: {
    data: Testimonial[]
    meta: {
      currentPage: number
      lastPage: number
      total: number
    }
  }
}

export default function TestimonialsIndex({ testimonials }: TestimonialsIndexProps) {
  const { flash } = usePage().props as any

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      router.delete(`/admin/testimonials/${id}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title="Testimonials - Admin" />

      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-black">Testimonials</h1>
          <div className="flex items-center gap-4">
            <Link href="/admin/properties" className="px-4 py-2 text-gray-600 hover:text-black transition-colors">
              Properties
            </Link>
            <Link href="/admin/contacts" className="px-4 py-2 text-gray-600 hover:text-black transition-colors">
              Contacts
            </Link>
            <Link
              href="/admin/testimonials/create"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white font-medium transition-colors"
              style={{ backgroundColor: '#A8D5E2', color: '#1a1a1a' }}
            >
              <Plus className="h-5 w-5" />
              Add Testimonial
            </Link>
            <form method="POST" action="/admin/logout" className="inline">
              <Button type="submit" variant="outline" className="rounded-xl">
                Logout
              </Button>
            </form>
          </div>
        </div>
      </header>

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
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Client</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Testimonial</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Property</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Rating</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Featured</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Order</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {testimonials.data.map((testimonial) => (
                  <tr key={testimonial.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {testimonial.clientPhoto ? (
                          <img
                            src={testimonial.clientPhoto}
                            alt={testimonial.clientName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
                            {testimonial.clientName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-black">{testimonial.clientName}</p>
                          <p className="text-xs text-gray-500">{testimonial.propertyType || 'General'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700 max-w-lg truncate">{testimonial.content}</p>
                    </td>
                    <td className="px-6 py-4">
                      {testimonial.property ? (
                        <Link
                          href={`/listings/${testimonial.property.slug}`}
                          target="_blank"
                          className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {testimonial.property.title}
                        </Link>
                      ) : (
                        <span className="text-sm text-gray-400">Not linked</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {testimonial.rating ? (
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-sm text-black font-medium">{testimonial.rating}/5</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          testimonial.featured ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {testimonial.featured ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{testimonial.order}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/testimonials/${testimonial.id}/edit`}
                          className="p-2 text-gray-600 hover:text-black transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(testimonial.id)}
                          className="p-2 text-red-600 hover:text-red-800 transition-colors"
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

          {testimonials.meta.lastPage > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-600">Total testimonials: {testimonials.meta.total}</p>
              <div className="flex gap-2">
                {Array.from({ length: testimonials.meta.lastPage }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => router.get('/admin/testimonials', { page })}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      page === testimonials.meta.currentPage
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
