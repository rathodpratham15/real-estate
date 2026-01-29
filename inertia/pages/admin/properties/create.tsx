import { Head, Link, useForm, usePage } from '@inertiajs/react'
import type { Agent } from '@/lib/real-estate-types'
import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface CreatePropertyProps {
  agents: Agent[]
}

export default function CreateProperty({ agents }: CreatePropertyProps) {
  const { flash } = usePage().props as any
  const { data, setData, post, processing, errors } = useForm({
    title: '',
    description: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    price: '',
    propertyType: 'house' as const,
    bedrooms: '',
    bathrooms: '',
    squareFeet: '',
    yearBuilt: '',
    status: 'for_sale' as const,
    featured: false,
    mainImage: '',
    images: [] as string[],
    agentId: '',
    features: {} as Record<string, any>,
  })

  const [imageInput, setImageInput] = useState('')

  const addImage = () => {
    if (imageInput.trim()) {
      setData('images', [...data.images, imageInput.trim()])
      setImageInput('')
    }
  }

  const removeImage = (index: number) => {
    setData('images', data.images.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post('/admin/properties')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title="Create Property - Admin" />

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/properties"
              className="p-2 text-gray-600 hover:text-black transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-black">Create Property</h1>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {flash?.success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-sm text-green-600">{flash.success}</p>
          </div>
        )}
        {flash?.error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600">{flash.error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm p-8 space-y-8">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-bold text-black mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={data.title}
                  onChange={(e) => setData('title', e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors"
                  placeholder="Luxury Modern Home"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors resize-none"
                  placeholder="Property description..."
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type *
                </label>
                <select
                  value={data.propertyType}
                  onChange={(e) => setData('propertyType', e.target.value as any)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors"
                >
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="condo">Condo</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="land">Land</option>
                  <option value="commercial">Commercial</option>
                </select>
                {errors.propertyType && <p className="mt-1 text-sm text-red-600">{errors.propertyType}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  value={data.status}
                  onChange={(e) => setData('status', e.target.value as any)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors"
                >
                  <option value="for_sale">For Sale</option>
                  <option value="sold">Sold</option>
                  <option value="pending">Pending</option>
                  <option value="off_market">Off Market</option>
                </select>
                {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  value={data.price}
                  onChange={(e) => setData('price', e.target.value)}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors"
                  placeholder="500000"
                />
                {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.featured}
                    onChange={(e) => setData('featured', e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700">Featured Property</span>
                </label>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h2 className="text-xl font-bold text-black mb-6">Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  value={data.address}
                  onChange={(e) => setData('address', e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors"
                  placeholder="123 Main Street"
                />
                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={data.city}
                  onChange={(e) => setData('city', e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors"
                  placeholder="New York"
                />
                {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  value={data.state}
                  onChange={(e) => setData('state', e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors"
                  placeholder="NY"
                />
                {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  value={data.zipCode}
                  onChange={(e) => setData('zipCode', e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors"
                  placeholder="10001"
                />
                {errors.zipCode && <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <input
                  type="text"
                  value={data.country}
                  onChange={(e) => setData('country', e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors"
                  placeholder="US"
                />
                {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div>
            <h2 className="text-xl font-bold text-black mb-6">Property Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms
                </label>
                <input
                  type="number"
                  value={data.bedrooms}
                  onChange={(e) => setData('bedrooms', e.target.value)}
                  min="0"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors"
                  placeholder="3"
                />
                {errors.bedrooms && <p className="mt-1 text-sm text-red-600">{errors.bedrooms}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bathrooms
                </label>
                <input
                  type="number"
                  value={data.bathrooms}
                  onChange={(e) => setData('bathrooms', e.target.value)}
                  min="0"
                  step="0.5"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors"
                  placeholder="2.5"
                />
                {errors.bathrooms && <p className="mt-1 text-sm text-red-600">{errors.bathrooms}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Square Feet
                </label>
                <input
                  type="number"
                  value={data.squareFeet}
                  onChange={(e) => setData('squareFeet', e.target.value)}
                  min="0"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors"
                  placeholder="2500"
                />
                {errors.squareFeet && <p className="mt-1 text-sm text-red-600">{errors.squareFeet}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year Built
                </label>
                <input
                  type="number"
                  value={data.yearBuilt}
                  onChange={(e) => setData('yearBuilt', e.target.value)}
                  min="1800"
                  max={new Date().getFullYear()}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors"
                  placeholder="2020"
                />
                {errors.yearBuilt && <p className="mt-1 text-sm text-red-600">{errors.yearBuilt}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agent
                </label>
                <select
                  value={data.agentId}
                  onChange={(e) => setData('agentId', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors"
                >
                  <option value="">Select an agent</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.firstName} {agent.lastName}
                    </option>
                  ))}
                </select>
                {errors.agentId && <p className="mt-1 text-sm text-red-600">{errors.agentId}</p>}
              </div>
            </div>
          </div>

          {/* Images */}
          <div>
            <h2 className="text-xl font-bold text-black mb-6">Images</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Image URL
                </label>
                <input
                  type="url"
                  value={data.mainImage}
                  onChange={(e) => setData('mainImage', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors"
                  placeholder="https://example.com/image.jpg"
                />
                {errors.mainImage && <p className="mt-1 text-sm text-red-600">{errors.mainImage}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Images
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors"
                    placeholder="https://example.com/image.jpg"
                  />
                  <Button
                    type="button"
                    onClick={addImage}
                    className="px-6 rounded-xl"
                    style={{ backgroundColor: '#A8D5E2', color: '#1a1a1a' }}
                  >
                    Add
                  </Button>
                </div>
                {data.images.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {data.images.map((image, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <span className="flex-1 text-sm text-gray-700 truncate">{image}</span>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t">
            <Link
              href="/admin/properties"
              className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <Button
              type="submit"
              disabled={processing}
              className="px-6 py-3 rounded-xl disabled:opacity-50"
              style={{ backgroundColor: '#A8D5E2', color: '#1a1a1a' }}
            >
              <Save className="h-4 w-4 mr-2" />
              {processing ? 'Creating...' : 'Create Property'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
