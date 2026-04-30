import Link from 'next/link'
import type { Property } from '@/lib/types'

const formatPrice = (price: number) => `₹${Math.floor(price).toLocaleString('en-IN')}`

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <Link
      href={`/listings/${property.slug}`}
      className="group block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="aspect-[4/3] bg-gray-100">
        {property.mainImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={property.mainImage} alt={property.title} className="h-full w-full object-cover transition group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">No Image</div>
        )}
      </div>
      <div className="p-5">
        <h3 className="mb-1 text-lg font-semibold text-black">{property.title}</h3>
        <p className="mb-2 text-sm text-gray-600">
          {property.address}, {property.city}
        </p>
        <p className="text-xl font-bold text-black">{formatPrice(property.price)}</p>
      </div>
    </Link>
  )
}
