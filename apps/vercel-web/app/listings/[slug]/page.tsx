import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Bed, Bath, Maximize, MapPin } from 'lucide-react'
import Footer from '@/components/footer'
import Navbar from '@/components/navbar'
import { getPropertyBySlug } from '@/lib/mock-data'

const formatPrice = (price: number) => `₹${Math.floor(price).toLocaleString('en-IN')}`

export default async function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const property = getPropertyBySlug(slug)

  if (!property) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <Link href="/listings" className="mb-6 inline-block text-sm text-gray-600 hover:text-black">
            ← Back to listings
          </Link>

          <div className="grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-6 aspect-[16/9] overflow-hidden rounded-3xl bg-gray-100">
                {property.mainImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={property.mainImage} alt={property.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400">No image available</div>
                )}
              </div>
              <h1 className="mb-2 text-4xl font-bold text-black">{property.title}</h1>
              <p className="mb-4 inline-flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                {property.address}, {property.city}
              </p>
              <p className="mb-6 text-3xl font-bold text-black">{formatPrice(property.price)}</p>
              <p className="leading-7 text-gray-700">{property.description}</p>
            </div>

            <aside className="h-fit rounded-3xl border border-gray-200 bg-gray-50 p-6">
              <h2 className="mb-4 text-xl font-semibold text-black">Property Summary</h2>
              <div className="space-y-3 text-sm text-gray-700">
                {property.bedrooms && (
                  <p className="inline-flex items-center gap-2"><Bed className="h-4 w-4" /> {property.bedrooms} bedrooms</p>
                )}
                {property.bathrooms && (
                  <p className="inline-flex items-center gap-2"><Bath className="h-4 w-4" /> {property.bathrooms} bathrooms</p>
                )}
                {property.squareFeet && (
                  <p className="inline-flex items-center gap-2"><Maximize className="h-4 w-4" /> {property.squareFeet.toLocaleString('en-US')} sq.ft</p>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
