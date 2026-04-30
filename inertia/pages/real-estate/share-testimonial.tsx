import { useState, type FormEvent } from 'react'
import { Head, Link, useForm, usePage } from '@inertiajs/react'
import Navbar from '@/components/navbar-new'
import Footer from '@/components/footer-new'
import { Button } from '@/components/ui/button'

interface PropertyOption {
  id: number
  title: string
  slug: string
}

interface ShareTestimonialPageProps {
  properties: PropertyOption[]
  selectedPropertyId?: number | null
}

export default function ShareTestimonialPage({ properties, selectedPropertyId = null }: ShareTestimonialPageProps) {
  const { flash } = usePage().props as any
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const { data, setData, post, processing, errors, reset } = useForm({
    clientName: '',
    clientPhoto: null as File | null,
    content: '',
    rating: '',
    propertyId: selectedPropertyId ? String(selectedPropertyId) : '',
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    post('/testimonials/share', {
      forceFormData: true,
      onSuccess: () => {
        reset('content', 'rating', 'clientPhoto')
        setPhotoPreview(null)
      },
    })
  }

  const setPhotoFile = (file: File | null) => {
    setData('clientPhoto', file)
    setPhotoPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return file ? URL.createObjectURL(file) : null
    })
  }

  return (
    <div className="min-h-screen bg-white">
      <Head title="Share Testimonial - Realest" />
      <Navbar />

      <main
        className="pt-28 pb-16 px-6"
        style={{ background: 'linear-gradient(180deg, #A8D5E2 0%, #ffffff 100%)' }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span
              className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4"
              style={{ backgroundColor: '#ffffff', color: '#1a1a1a' }}
            >
              Share Your Experience
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">Add Your Testimonial</h1>
            <p className="text-lg text-gray-700">
              Tell us about your real estate journey with Realest. Your feedback helps others make confident
              decisions.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8">
            {flash?.success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-sm text-green-700">{flash.success}</p>
              </div>
            )}
            {flash?.error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-700">{flash.error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Photo (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  capture="user"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null
                    setPhotoFile(file)
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white"
                />
                <p className="mt-1 text-xs text-gray-500">
                  You can upload from device or open camera on supported mobile browsers.
                </p>
                {photoPreview && (
                  <div className="mt-3 flex items-center gap-3">
                    <img loading="lazy" decoding="async"
                      src={photoPreview}
                      alt="Selected preview"
                      className="h-16 w-16 rounded-full object-cover border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoFile(null)
                      }}
                      className="text-sm text-gray-600 hover:text-black transition-colors"
                    >
                      Remove photo
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Testimonial</label>
                <textarea
                  value={data.content}
                  onChange={(e) => setData('content', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 min-h-[140px]"
                  required
                />
                {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating (optional)</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property (optional)</label>
                  <select
                    value={data.propertyId}
                    onChange={(e) => setData('propertyId', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white"
                  >
                    <option value="">General testimonial</option>
                    {properties.map((property) => (
                      <option key={property.id} value={property.id}>
                        {property.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 pt-2">
                <Link href="/" className="text-sm text-gray-600 hover:text-black transition-colors">
                  Back to Home
                </Link>
                <Button
                  type="submit"
                  disabled={processing}
                  className="px-6 py-3 rounded-xl"
                  style={{ backgroundColor: '#A8D5E2', color: '#1a1a1a' }}
                >
                  {processing ? 'Submitting...' : 'Submit Testimonial'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
