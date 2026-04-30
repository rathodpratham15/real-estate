export interface Property {
  id: number
  title: string
  slug: string
  description: string
  address: string
  city: string
  price: number
  bedrooms: number | null
  bathrooms: number | null
  squareFeet: number | null
  mainImage: string | null
  featured?: boolean
}
