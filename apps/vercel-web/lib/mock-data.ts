import type { Property } from '@/lib/types'

export const properties: Property[] = [
  {
    id: 1,
    title: 'Sea View Penthouse',
    slug: 'sea-view-penthouse',
    description:
      'Premium penthouse with panoramic sea views, private terrace, and modern interiors in a prime location.',
    address: 'Bandra West',
    city: 'Mumbai',
    price: 54000000,
    bedrooms: 4,
    bathrooms: 4,
    squareFeet: 4200,
    mainImage: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1600&auto=format&fit=crop',
    featured: true
  },
  {
    id: 2,
    title: 'Modern Family Villa',
    slug: 'modern-family-villa',
    description:
      'Spacious villa with private garden, large living areas, and excellent connectivity for families.',
    address: 'Powai',
    city: 'Mumbai',
    price: 32000000,
    bedrooms: 5,
    bathrooms: 4,
    squareFeet: 5100,
    mainImage: 'https://images.unsplash.com/photo-1613977257365-aaae5a9817ff?w=1600&auto=format&fit=crop',
    featured: true
  },
  {
    id: 3,
    title: 'City Center Apartment',
    slug: 'city-center-apartment',
    description:
      'Well-designed apartment in the city core with premium amenities and quick access to business hubs.',
    address: 'Lower Parel',
    city: 'Mumbai',
    price: 18000000,
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1850,
    mainImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&auto=format&fit=crop'
  }
]

export const getPropertyBySlug = (slug: string) => properties.find((property) => property.slug === slug)
