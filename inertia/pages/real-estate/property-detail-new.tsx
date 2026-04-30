import { Head, Link, useForm, usePage, router } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import type { Property, Testimonial } from '@/lib/real-estate-types'
import Navbar from '@/components/navbar-new'
import Footer from '@/components/footer-new'
import { Bed, Bath, Maximize, MapPin, ArrowLeft, Calendar, Home, Sparkles, CheckCircle2, MessageCircle, Heart, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { createWhatsAppLink } from '@/lib/whatsapp'

interface PropertyDetailPageProps {
    property: Property
    similarProperties?: Property[]
    propertyTestimonials?: Testimonial[]
    whatsappNumber?: string
}

export default function PropertyDetail({
    property,
    similarProperties = [],
    propertyTestimonials = [],
    whatsappNumber = '+919876543210',
}: PropertyDetailPageProps) {
    const [isVisible, setIsVisible] = useState(false)
    const [isFavorited, setIsFavorited] = useState(false)
    const [favoriteLoading, setFavoriteLoading] = useState(false)
    const { toast } = useToast()
    const { auth } = usePage().props as any
    const user = auth?.user
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        subject: `Inquiry about ${property.title}`,
        message: `I'm interested in learning more about ${property.title} located at ${property.address}.`,
        agentId: property.agentId?.toString() || '',
    })

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.scrollTo(0, 0)
        }
        setTimeout(() => setIsVisible(true), 100)
        // Pre-fill form with property information
        setData({
            name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : '',
            email: user?.email || '',
            phone: '',
            subject: `Inquiry about ${property.title}`,
            message: `I'm interested in learning more about ${property.title} located at ${property.address}.`,
        })

        // Check favorite status if user is logged in
        if (user) {
            checkFavoriteStatus()
        }
    }, [property, user])

    if (!property) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Property not found</h2>
                    <Link href="/listings" className="text-blue-600 hover:underline">
                        Back to Listings
                    </Link>
                </div>
            </div>
        )
    }

    // Extract highlights from features.highlights if available, otherwise use defaults
    const defaultHighlights = [
        'Gourmet kitchen with premium appliances',
        'Master suite with spa-like bathroom',
        'Open-concept living and dining areas',
        'Smart home technology integration',
        'Private outdoor spaces with landscaping',
        'Energy-efficient systems throughout',
    ]

    const highlights =
        property.features?.highlights && Array.isArray(property.features.highlights) && property.features.highlights.length > 0
            ? property.features.highlights
            : defaultHighlights

    // Extract property details from features (excluding highlights)
    const propertyDetailsFromFeatures = property.features
        ? Object.fromEntries(
            Object.entries(property.features).filter(([key]) => key !== 'highlights')
        )
        : {}

    const propertyDetails = {
        description:
            property.description ||
            `Welcome to ${property.title}, a stunning luxury property that epitomizes modern elegance and sophisticated living. This exceptional home features ${property.bedrooms || 'multiple'} spacious bedrooms and ${property.bathrooms || 'multiple'} beautifully appointed bathrooms across ${property.squareFeet ? property.squareFeet.toLocaleString() : 'generous'} square feet of meticulously designed living space.`,
        highlights,
        location: property.address || 'Premium Neighborhood, Prime Location',
        yearBuilt: property.yearBuilt?.toString() || '2023',
        propertyType: property.propertyType === 'other' && property.propertyTypeOther
            ? property.propertyTypeOther
            : property.propertyType || 'Luxury Residence',
        // Include all property details from features
        ...propertyDetailsFromFeatures,
    }

    const checkFavoriteStatus = async () => {
        if (!user) return
        try {
            const response = await fetch(`/properties/${property.id}/favorite-status`)
            const data = await response.json()
            setIsFavorited(data.favorited)
        } catch (error) {
            console.error('Failed to check favorite status:', error)
        }
    }

    const handleToggleFavorite = async () => {
        if (!user) {
            toast({
                title: 'Please Login',
                description: 'You need to be logged in to save properties.',
                variant: 'destructive',
            })
            router.visit('/login')
            return
        }

        setFavoriteLoading(true)
        try {
            const response = await fetch(`/properties/${property.id}/favorite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const data = await response.json()
            setIsFavorited(data.favorited)
            toast({
                title: data.favorited ? 'Property Saved' : 'Property Removed',
                description: data.favorited
                    ? 'This property has been added to your favorites.'
                    : 'This property has been removed from your favorites.',
            })
        } catch (error) {
            console.error('Failed to toggle favorite:', error)
            toast({
                title: 'Error',
                description: 'Failed to update favorite status.',
                variant: 'destructive',
            })
        } finally {
            setFavoriteLoading(false)
        }
    }

    const formatPrice = (price: number) => {
        const priceStr = Math.floor(price).toString()
        if (priceStr.length <= 3) return `₹${priceStr}`
        // Format: ₹27,00,000 (Indian numbering system)
        const formatted = priceStr.replace(/\B(?=(\d{2})+(?!\d))/g, ',')
        return `₹${formatted}`
    }

    return (
        <div className="min-h-screen bg-white">
            <Head title={`${property.title} - Realest`} />
            <Navbar />

            <div className="pt-20">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <Link
                        href="/listings"
                        className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-6"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span>Back to Listings</span>
                    </Link>
                </div>

                <div
                    className={`max-w-7xl mx-auto px-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
                        <div className="lg:col-span-2 rounded-3xl overflow-hidden shadow-xl">
                            {property.mainImage ? (
                                <img loading="lazy" decoding="async"
                                    src={property.mainImage}
                                    alt={property.title}
                                    className="w-full h-[500px] object-cover"
                                />
                            ) : (
                                <div className="w-full h-[500px] bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                                    <span className="text-slate-400">No Image</span>
                                </div>
                            )}
                        </div>
                        <div className="grid grid-rows-2 gap-4">
                            <div className="rounded-3xl overflow-hidden shadow-xl">
                                {property.mainImage ? (
                                    <img loading="lazy" decoding="async"
                                        src={property.mainImage}
                                        alt={`${property.title} view 2`}
                                        className="w-full h-full object-cover"
                                        style={{ filter: 'brightness(0.9)' }}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300" />
                                )}
                            </div>
                            <div className="rounded-3xl overflow-hidden shadow-xl">
                                {property.mainImage ? (
                                    <img loading="lazy" decoding="async"
                                        src={property.mainImage}
                                        alt={`${property.title} view 3`}
                                        className="w-full h-full object-cover"
                                        style={{ filter: 'brightness(1.1)' }}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2">
                            <div
                                className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                    }`}
                            >
                                <div className="mb-8">
                                    <div className="flex items-start justify-between mb-4">
                                        <h1 className="text-5xl font-bold text-black capitalize flex-1">{property.title}</h1>
                                        {user && (
                                            <button
                                                onClick={handleToggleFavorite}
                                                disabled={favoriteLoading}
                                                className={`ml-4 p-3 rounded-xl transition-all ${
                                                    isFavorited
                                                        ? 'bg-red-50 text-red-600'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                                title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                                            >
                                                <Heart className={`h-6 w-6 ${isFavorited ? 'fill-current' : ''}`} />
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600 mb-6">
                                        <MapPin className="h-5 w-5" />
                                        <span className="text-lg">{propertyDetails.location}</span>
                                    </div>
                                    <div className="flex items-center gap-3 mb-4">
                                        {property.overallRating && (
                                            <span className="inline-flex items-center gap-1 text-amber-600 font-semibold">
                                                <Star className="h-4 w-4 fill-current" />
                                                {property.overallRating.toFixed(1)} / 5
                                                {property.ratingCount ? ` (${property.ratingCount})` : ''}
                                            </span>
                                        )}
                                        {property.isPopular && (
                                            <span className="inline-flex items-center rounded-full bg-rose-100 text-rose-700 px-3 py-1 text-xs font-semibold">
                                                Popular Property
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-4xl font-bold" style={{ color: '#A8D5E2' }}>
                                        {formatPrice(property.price)}
                                    </p>
                                </div>

                                <div className="flex items-center gap-8 py-6 border-y border-gray-200 mb-8">
                                    {property.bedrooms && (
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 rounded-full" style={{ backgroundColor: '#A8D5E2' }}>
                                                <Bed className="h-6 w-6 text-black" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-black">{property.bedrooms}</p>
                                                <p className="text-sm text-gray-600">Bedrooms</p>
                                            </div>
                                        </div>
                                    )}
                                    {property.bathrooms && (
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 rounded-full" style={{ backgroundColor: '#A8D5E2' }}>
                                                <Bath className="h-6 w-6 text-black" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-black">{property.bathrooms}</p>
                                                <p className="text-sm text-gray-600">Bathrooms</p>
                                            </div>
                                        </div>
                                    )}
                                    {property.squareFeet && (
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 rounded-full" style={{ backgroundColor: '#A8D5E2' }}>
                                                <Maximize className="h-6 w-6 text-black" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-black">
                                                    {property.squareFeet.toLocaleString('en-US')} sq.ft
                                                </p>
                                                <p className="text-sm text-gray-600">Square Feet</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="mb-8">
                                    <h2 className="text-3xl font-bold text-black mb-4">About This Property</h2>
                                    <p className="text-gray-700 text-lg leading-relaxed">{propertyDetails.description}</p>
                                </div>

                                <div className="mb-8">
                                    <div className="flex items-center justify-between gap-4 mb-6">
                                        <h2 className="text-3xl font-bold text-black">Property Comments</h2>
                                        <Link
                                            href={`/testimonials/share?propertyId=${property.id}`}
                                            className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium"
                                            style={{ backgroundColor: '#A8D5E2', color: '#1a1a1a' }}
                                        >
                                            Write a comment
                                        </Link>
                                    </div>

                                    {propertyTestimonials.length > 0 ? (
                                        <div className="space-y-4">
                                            {propertyTestimonials.map((testimonial) => (
                                                <div key={testimonial.id} className="bg-gray-50 rounded-2xl p-5">
                                                    <p className="text-gray-700 leading-relaxed mb-3">
                                                        &ldquo;{testimonial.content}&rdquo;
                                                    </p>
                                                    <div className="flex items-center justify-between gap-3">
                                                        <p className="text-sm font-semibold text-black">{testimonial.clientName}</p>
                                                        {testimonial.rating && (
                                                            <p className="text-sm text-amber-600 font-medium">
                                                                {testimonial.rating}/5
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-gray-50 rounded-2xl p-6">
                                            <p className="text-gray-600">
                                                No comments for this property yet. Be the first to share your experience.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="mb-8">
                                    <h2 className="text-3xl font-bold text-black mb-6">Property Highlights</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {propertyDetails.highlights.map((highlight, index) => (
                                            <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                                                <Sparkles className="h-5 w-5 mt-1" style={{ color: '#A8D5E2' }} />
                                                <p className="text-gray-700">{highlight}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <h2 className="text-3xl font-bold text-black mb-6">Property Details</h2>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="flex items-center gap-3">
                                            <Home className="h-5 w-5 text-gray-600" />
                                            <div>
                                                <p className="text-sm text-gray-600">Property Type</p>
                                                <p className="font-semibold text-black">{propertyDetails.propertyType}</p>
                                            </div>
                                        </div>
                                        {property.yearBuilt && (
                                            <div className="flex items-center gap-3">
                                                <Calendar className="h-5 w-5 text-gray-600" />
                                                <div>
                                                    <p className="text-sm text-gray-600">Year Built</p>
                                                    <p className="font-semibold text-black">{propertyDetails.yearBuilt}</p>
                                                </div>
                                            </div>
                                        )}
                                        {/* Display OC and CC if available */}
                                        {(propertyDetailsFromFeatures.hasOC || propertyDetailsFromFeatures.hasCC) && (
                                            <>
                                                {propertyDetailsFromFeatures.hasOC && (
                                                    <div className="flex items-center gap-3">
                                                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                                                        <div>
                                                            <p className="text-sm text-gray-600">OC</p>
                                                            <p className="font-semibold text-green-600">Available</p>
                                                        </div>
                                                    </div>
                                                )}
                                                {propertyDetailsFromFeatures.hasCC && (
                                                    <div className="flex items-center gap-3">
                                                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                                                        <div>
                                                            <p className="text-sm text-gray-600">CC</p>
                                                            <p className="font-semibold text-green-600">Available</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                        {/* Display all other property details from features (excluding OC/CC) */}
                                        {Object.entries(propertyDetailsFromFeatures)
                                            .filter(([key]) => key !== 'hasOC' && key !== 'hasCC')
                                            .map(([key, value]) => (
                                                <div key={key} className="flex items-center gap-3">
                                                    <MapPin className="h-5 w-5 text-gray-600" />
                                                    <div>
                                                        <p className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                                        <p className="font-semibold text-black">{String(value)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div
                                className={`sticky top-24 bg-gray-50 rounded-3xl p-8 shadow-lg transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                    }`}
                            >
                                <h3 className="text-2xl font-bold text-black mb-6">Interested in this property?</h3>
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault()
                                        post('/contact', {
                                            onSuccess: () => {
                                                toast({
                                                    title: 'Message Sent!',
                                                    description: "We'll get back to you within 24 hours.",
                                                })
                                                reset('name', 'email', 'phone')
                                                // Keep subject and message pre-filled
                                                setData('subject', `Inquiry about ${property.title}`)
                                                setData(
                                                    'message',
                                                    `I'm interested in learning more about ${property.title} located at ${property.address}.`
                                                )
                                            },
                                            onError: () => {
                                                toast({
                                                    title: 'Error',
                                                    description: 'There was an error sending your message. Please try again.',
                                                })
                                            },
                                        })
                                    }}
                                    className="space-y-4 mb-6"
                                >
                                    <div>
                                        <input
                                            type="text"
                                            name="name"
                                            value={data.name}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('name', e.target.value)}
                                            placeholder="Your Name"
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors"
                                        />
                                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <input
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('email', e.target.value)}
                                            placeholder="Your Email"
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors"
                                        />
                                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                    </div>
                                    <div>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={data.phone}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('phone', e.target.value)}
                                            placeholder="Your Phone"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors"
                                        />
                                        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                                    </div>
                                    <div>
                                        <textarea
                                            name="message"
                                            value={data.message}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('message', e.target.value)}
                                            placeholder="Message"
                                            rows={4}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors resize-none"
                                        />
                                        {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
                                    </div>
                                    <div className="flex gap-3">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="flex-1 py-6 text-base rounded-xl disabled:opacity-50"
                                            style={{ backgroundColor: '#A8D5E2', color: '#1a1a1a' }}
                                        >
                                            {processing ? 'Sending...' : 'Request Information'}
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                const message = `Hi! I'm interested in ${property.title} located at ${property.address}. Price: ₹${property.price.toLocaleString('en-IN')}. Can you provide more details?`
                                                window.open(createWhatsAppLink(whatsappNumber, message), '_blank', 'noopener,noreferrer')
                                            }}
                                            className="px-6 py-6 text-base rounded-xl"
                                            style={{ backgroundColor: '#25D366', color: '#ffffff' }}
                                        >
                                            <MessageCircle className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </form>
                                <p className="text-xs text-gray-600 text-center mt-4">
                                    Our team will contact you within 24 hours
                                </p>
                                <p className="text-xs text-gray-500 text-center mt-2">
                                    Or chat with us on WhatsApp
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
