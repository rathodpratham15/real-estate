import type { DateTime } from 'luxon'

export interface Property {
  id: number
  title: string
  slug: string
  description: string | null
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  latitude: number | null
  longitude: number | null
  price: number
  propertyType: 'house' | 'shop' | 'godown' | 'land' | 'commercial' | 'other'
  propertyTypeOther?: string | null
  bedrooms: number | null
  bathrooms: number | null
  squareFeet: number | null
  yearBuilt: number | null
  status: 'for_sale' | 'rental'
  featured: boolean
  rating: number | null
  isPopular: boolean
  overallRating?: number | null
  ratingCount?: number
  distanceKm?: number | null
  mainImage: string | null
  images: string[]
  agentId: number | null
  agent?: Agent
  features: Record<string, any> | null
  createdAt: DateTime
  updatedAt: DateTime
}

export interface Agent {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string | null
  bio: string | null
  photo: string | null
  licenseNumber: string | null
  yearsOfExperience: number | null
  specialties: string[]
  socialLinks: Record<string, string> | null
  isActive: boolean
  createdAt: DateTime
  updatedAt: DateTime
}

export interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string | null
  content: string
  featuredImage: string | null
  category: string | null
  authorId: number | null
  author?: Agent
  tags: string[]
  published: boolean
  publishedAt: DateTime | null
  createdAt: DateTime
  updatedAt: DateTime
}

export interface Testimonial {
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
  createdAt: DateTime
  updatedAt: DateTime
}
