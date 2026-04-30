import type { FormEvent } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import { Button } from '@/components/ui/button'

interface Testimonial {
  id: number
  clientName: string
  clientPhoto: string | null
  content: string
  rating: number | null
  propertyType: string | null
  propertyId: number | null
  featured: boolean
  order: number
}

interface PropertyOption {
  id: number
  title: string
  slug: string
}

interface EditTestimonialProps {
  testimonial: Testimonial
  properties: PropertyOption[]
}

export default function EditTestimonial({ testimonial, properties }: EditTestimonialProps) {
  const { data, setData, put, processing, errors } = useForm({
    clientName: testimonial.clientName || '',
    clientPhoto: testimonial.clientPhoto || '',
    content: testimonial.content || '',
    rating: testimonial.rating ? String(testimonial.rating) : '',
    propertyId: testimonial.propertyId ? String(testimonial.propertyId) : '',
    featured: testimonial.featured,
    order: String(testimonial.order ?? 0),
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    put(`/admin/testimonials/${testimonial.id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title="Edit Testimonial - Admin" />

      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-black">Edit Testimonial</h1>
          <Link href="/admin/testimonials" className="text-gray-600 hover:text-black transition-colors">
            Back to Testimonials
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
            <input
              type="text"
              value={data.clientName}
              onChange={(e) => setData('clientName', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300"
              required
            />
            {errors.clientName && <p className="mt-1 text-sm text-red-600">{errors.clientName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Client Photo URL (optional)</label>
            <input
              type="url"
              value={data.clientPhoto}
              onChange={(e) => setData('clientPhoto', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Testimonial</label>
            <textarea
              value={data.content}
              onChange={(e) => setData('content', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 min-h-[140px]"
              required
            />
            {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={data.rating}
                onChange={(e) => setData('rating', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Linked Property (optional)</label>
              <select
                value={data.propertyId}
                onChange={(e) => setData('propertyId', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white"
              >
                <option value="">Not linked</option>
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
              <input
                type="number"
                value={data.order}
                onChange={(e) => setData('order', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300"
              />
            </div>
          </div>

          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={data.featured}
              onChange={(e) => setData('featured', e.target.checked)}
              className="h-4 w-4"
            />
            <span className="text-sm text-gray-700">Mark as featured</span>
          </label>

          <div className="flex justify-end gap-3">
            <Link
              href="/admin/testimonials"
              className="px-5 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <Button
              type="submit"
              disabled={processing}
              className="px-6 py-3 rounded-xl"
              style={{ backgroundColor: '#A8D5E2', color: '#1a1a1a' }}
            >
              {processing ? 'Saving...' : 'Update Testimonial'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
