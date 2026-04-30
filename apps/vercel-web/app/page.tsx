import Link from 'next/link'
import Footer from '@/components/footer'
import Navbar from '@/components/navbar'
import PropertyCard from '@/components/property-card'
import { properties } from '@/lib/mock-data'

const featured = properties.filter((property) => property.featured)

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <section className="bg-gradient-to-b from-sky-100 to-white px-6 py-20">
          <div className="mx-auto max-w-7xl text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-wide text-gray-600">Now on Next.js</p>
            <h1 className="mb-4 text-5xl font-bold text-black">Discover the perfect place to call home</h1>
            <p className="mx-auto mb-8 max-w-2xl text-gray-700">
              This is Phase 1 of your Vercel migration: homepage, listings, and property detail routes are now running in a
              Vercel-native app.
            </p>
            <Link href="/listings" className="inline-flex rounded-full bg-black px-6 py-3 text-sm font-medium text-white">
              Explore Listings
            </Link>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-black">Featured Properties</h2>
                <p className="text-sm text-gray-600">Sourced from local migration seed data</p>
              </div>
              <Link href="/listings" className="text-sm font-medium text-gray-700 hover:text-black">
                View all
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featured.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
