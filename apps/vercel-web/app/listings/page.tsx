import Footer from '@/components/footer'
import Navbar from '@/components/navbar'
import PropertyCard from '@/components/property-card'
import { properties } from '@/lib/mock-data'

export default function ListingsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-2 text-4xl font-bold text-black">All Listings</h1>
          <p className="mb-8 text-gray-600">This page now renders directly from Next.js for Vercel compatibility.</p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
