import { Head, Link, useForm, usePage } from '@inertiajs/react'
import type { Property } from '@/lib/real-estate-types'
import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'

interface EditPropertyProps {
    property: Property
}

export default function EditProperty({ property }: EditPropertyProps) {
    const { flash } = usePage().props as any
    const { data, setData, put, processing, errors } = useForm({
        title: property.title || '',
        description: property.description || '',
        address: property.address || '',
        city: property.city || '',
        state: property.state || '',
        zipCode: property.zipCode || '',
        country: property.country || 'IN',
        latitude: property.latitude?.toString() || '',
        longitude: property.longitude?.toString() || '',
        price: property.price?.toString() || '',
        propertyType: property.propertyType || 'house',
        propertyTypeOther: property.propertyTypeOther || '',
        bedrooms: property.bedrooms?.toString() || '',
        bathrooms: property.bathrooms?.toString() || '',
        squareFeet: property.squareFeet?.toString() || '',
        yearBuilt: property.yearBuilt?.toString() || '',
        status: property.status || 'for_sale',
        featured: property.featured || false,
        rating: property.rating?.toString() || '',
        isPopular: property.isPopular || false,
        mainImage: property.mainImage || '',
        images: property.images || [],
        videos: property.videos || [],
        highlights: (property.features?.highlights as string[]) || [],
        propertyDetails: Object.fromEntries(
            Object.entries(property.features || {}).filter(([key]) => key !== 'highlights' && key !== 'hasOC' && key !== 'hasCC')
        ) as Record<string, string>,
        hasOC: (property.features as any)?.hasOC || false,
        hasCC: (property.features as any)?.hasCC || false,
    })

    const [imageInput, setImageInput] = useState('')
    const [imageFiles, setImageFiles] = useState<File[]>([])
    const [videoFiles, setVideoFiles] = useState<File[]>([])
    const [mainImageFile, setMainImageFile] = useState<File | null>(null)
    const [highlightInput, setHighlightInput] = useState('')
    const [detailKey, setDetailKey] = useState('')
    const [detailValue, setDetailValue] = useState('')

    const addImage = () => {
        if (imageInput.trim()) {
            setData('images', [...data.images, imageInput.trim()])
            setImageInput('')
        }
    }

    const removeImage = (index: number) => {
        setData('images', data.images.filter((_, i) => i !== index))
        if (index < imageFiles.length) {
            setImageFiles(imageFiles.filter((_, i) => i !== index))
        }
    }

    const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length > 0) {
            setImageFiles([...imageFiles, ...files])
            files.forEach((file) => {
                const reader = new FileReader()
                reader.onloadend = () => {
                    if (reader.result) {
                        setData('images', [...data.images, reader.result as string])
                    }
                }
                reader.readAsDataURL(file)
            })
        }
    }

    const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setMainImageFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                if (reader.result) {
                    setData('mainImage', reader.result as string)
                }
            }
            reader.readAsDataURL(file)
        }
    }

    const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length > 0) {
            setVideoFiles([...videoFiles, ...files])
            files.forEach((file) => {
                const reader = new FileReader()
                reader.onloadend = () => {
                    if (reader.result) {
                        setData('videos', [...(data.videos || []), reader.result as string])
                    }
                }
                reader.readAsDataURL(file)
            })
        }
    }

    const removeVideo = (index: number) => {
        setData('videos', data.videos.filter((_, i) => i !== index))
        if (index < videoFiles.length) {
            setVideoFiles(videoFiles.filter((_, i) => i !== index))
        }
    }

    const addHighlight = () => {
        if (highlightInput.trim()) {
            setData('highlights', [...data.highlights, highlightInput.trim()])
            setHighlightInput('')
        }
    }

    const removeHighlight = (index: number) => {
        setData('highlights', data.highlights.filter((_, i) => i !== index))
    }

    const addPropertyDetail = () => {
        if (detailKey.trim() && detailValue.trim()) {
            setData('propertyDetails', {
                ...data.propertyDetails,
                [detailKey.trim()]: detailValue.trim(),
            })
            setDetailKey('')
            setDetailValue('')
        }
    }

    const removePropertyDetail = (key: string) => {
        const newDetails = { ...data.propertyDetails }
        delete newDetails[key]
        setData('propertyDetails', newDetails)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const form = e.currentTarget as HTMLFormElement
        if (!form.checkValidity()) {
            form.reportValidity()
            alert('Please fill all required fields before submitting.')
            return
        }

        // Create FormData for file uploads
        const formData = new FormData()

        // Add files if uploaded
        if (mainImageFile) {
            formData.append('mainImage', mainImageFile)
        } else if (data.mainImage && !data.mainImage.startsWith('data:')) {
            formData.append('mainImage', data.mainImage)
        }

        // Add image files
        imageFiles.forEach((file) => {
            formData.append('images[]', file)
        })

        // Add image URLs (filter out data URLs which are just previews)
        data.images.forEach((img) => {
            if (!img.startsWith('data:')) {
                formData.append('images[]', img)
            }
        })

        // Add video files
        videoFiles.forEach((file) => {
            formData.append('videos[]', file)
        });

        // Add video URLs (filter out data URLs which are just previews)
        (data.videos || []).forEach((vid) => {
            if (!vid.startsWith('data:')) {
                formData.append('videos[]', vid)
            }
        })

        // Combine highlights, propertyDetails, and certificates into features
        const features = {
            highlights: data.highlights,
            ...data.propertyDetails,
            hasOC: data.hasOC,
            hasCC: data.hasCC,
        }

        // Add all other form fields
        formData.append('title', data.title)
        formData.append('description', data.description || '')
        formData.append('address', data.address)
        formData.append('city', data.city)
        formData.append('state', data.state)
        formData.append('zipCode', data.zipCode)
        formData.append('country', data.country)
        if (data.latitude) formData.append('latitude', data.latitude)
        if (data.longitude) formData.append('longitude', data.longitude)
        formData.append('price', data.price)
        formData.append('propertyType', data.propertyType)
        if (data.propertyTypeOther) {
            formData.append('propertyTypeOther', data.propertyTypeOther)
        }
        if (data.bedrooms) formData.append('bedrooms', data.bedrooms)
        if (data.bathrooms) formData.append('bathrooms', data.bathrooms)
        if (data.squareFeet) formData.append('squareFeet', data.squareFeet)
        if (data.yearBuilt) formData.append('yearBuilt', data.yearBuilt)
        formData.append('status', data.status)
        formData.append('featured', data.featured ? 'true' : 'false')
        if (data.rating) formData.append('rating', data.rating)
        formData.append('isPopular', data.isPopular ? 'true' : 'false')
        formData.append('features', JSON.stringify(features))

        // Submit with FormData
        put(`/admin/properties/${property.id}`, {
            data: formData,
            forceFormData: true,
            onError: (formErrors) => {
                const firstError = Object.values(formErrors)[0]
                alert(firstError || 'Please fix the highlighted errors and try again.')
            },
        })
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title={`Edit ${property.title} - Admin`} />

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
                        <h1 className="text-2xl font-bold text-black">Edit Property</h1>
                    </div>
                </div>
            </header>

            {/* Form - Same as create form */}
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
                                    <option value="shop">Shop</option>
                                    <option value="godown">Godown</option>
                                    <option value="land">Land</option>
                                    <option value="commercial">Commercial</option>
                                    <option value="other">Other</option>
                                </select>
                                {errors.propertyType && <p className="mt-1 text-sm text-red-600">{errors.propertyType}</p>}
                            </div>

                            {data.propertyType === 'other' && (
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Specify Property Type *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.propertyTypeOther}
                                        onChange={(e) => setData('propertyTypeOther', e.target.value)}
                                        required={data.propertyType === 'other'}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors"
                                        placeholder="e.g., Warehouse, Factory, etc."
                                    />
                                    {errors.propertyTypeOther && <p className="mt-1 text-sm text-red-600">{errors.propertyTypeOther}</p>}
                                </div>
                            )}

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
                                    <option value="rental">Rental</option>
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
                                />
                                {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Manual Rating (0-5, optional)
                                </label>
                                <input
                                    type="number"
                                    value={data.rating}
                                    onChange={(e) => setData('rating', e.target.value)}
                                    min="0"
                                    max="5"
                                    step="0.1"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors"
                                    placeholder="e.g. 4.6"
                                />
                                {errors.rating && <p className="mt-1 text-sm text-red-600">{errors.rating}</p>}
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

                            <div>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.isPopular}
                                        onChange={(e) => setData('isPopular', e.target.checked)}
                                        className="w-5 h-5 rounded border-gray-300"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Mark as Popular</span>
                                </label>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.hasOC}
                                        onChange={(e) => setData('hasOC', e.target.checked)}
                                        className="w-5 h-5 rounded border-gray-300"
                                    />
                                    <span className="text-sm font-medium text-gray-700">OC (Occupation Certificate)</span>
                                </label>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.hasCC}
                                        onChange={(e) => setData('hasCC', e.target.checked)}
                                        className="w-5 h-5 rounded border-gray-300"
                                    />
                                    <span className="text-sm font-medium text-gray-700">CC (Completion Certificate)</span>
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
                                />
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
                                />
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
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Pincode *
                                </label>
                                <input
                                    type="text"
                                    value={data.zipCode}
                                    onChange={(e) => setData('zipCode', e.target.value)}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors"
                                />
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
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Latitude (optional)
                                </label>
                                <input
                                    type="number"
                                    value={data.latitude}
                                    onChange={(e) => setData('latitude', e.target.value)}
                                    step="0.000001"
                                    min="-90"
                                    max="90"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors"
                                    placeholder="19.076090"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Longitude (optional)
                                </label>
                                <input
                                    type="number"
                                    value={data.longitude}
                                    onChange={(e) => setData('longitude', e.target.value)}
                                    step="0.000001"
                                    min="-180"
                                    max="180"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors"
                                    placeholder="72.877426"
                                />
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
                                />
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
                                />
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
                                />
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
                                />
                            </div>
                        </div>
                    </div>

                    {/* Media - Images & Videos */}
                    <div>
                        <h2 className="text-xl font-bold text-black mb-6">Media</h2>
                        <div className="space-y-6">
                            {/* Main Image */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Main Image
                                </label>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">Upload File</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleMainImageUpload}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors"
                                        />
                                    </div>
                                    <div className="text-sm text-gray-500">OR</div>
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">Image URL</label>
                                        <input
                                            type="url"
                                            value={data.mainImage}
                                            onChange={(e) => setData('mainImage', e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors"
                                            placeholder="https://example.com/image.jpg"
                                        />
                                    </div>
                                    {data.mainImage && (
                                        <div className="mt-2">
                                            <img src={data.mainImage} alt="Main image preview" className="h-32 w-auto rounded-lg object-cover" />
                                        </div>
                                    )}
                                </div>
                                {errors.mainImage && <p className="mt-1 text-sm text-red-600">{errors.mainImage}</p>}
                            </div>

                            {/* Additional Images */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Additional Images
                                </label>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">Upload Files</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageFileUpload}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors"
                                        />
                                    </div>
                                    <div className="text-sm text-gray-500">OR</div>
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
                                            Add URL
                                        </Button>
                                    </div>
                                    {data.images.length > 0 && (
                                        <div className="mt-4 space-y-2">
                                            {data.images.map((image, index) => (
                                                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                                    {image.startsWith('data:') || image.startsWith('http') || image.startsWith('/') ? (
                                                        <img src={image} alt={`Preview ${index}`} className="h-16 w-16 rounded object-cover" />
                                                    ) : null}
                                                    <span className="flex-1 text-sm text-gray-700 truncate">{image.length > 50 ? image.substring(0, 50) + '...' : image}</span>
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

                            {/* Videos */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Videos
                                </label>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">Upload Video Files</label>
                                        <input
                                            type="file"
                                            accept="video/*"
                                            multiple
                                            onChange={handleVideoFileUpload}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Supported formats: MP4, WebM, MOV</p>
                                    </div>
                                    {(data.videos || []).length > 0 && (
                                        <div className="mt-4 space-y-2">
                                            {data.videos.map((video, index) => (
                                                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                                    {video.startsWith('data:') || video.startsWith('/') ? (
                                                        <video src={video} className="h-16 w-16 rounded object-cover" controls={false} />
                                                    ) : null}
                                                    <span className="flex-1 text-sm text-gray-700 truncate">
                                                        {videoFiles[index]?.name || (video.length > 50 ? video.substring(0, 50) + '...' : video)}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeVideo(index)}
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
                    </div>

                    {/* Property Highlights */}
                    <div>
                        <h2 className="text-xl font-bold text-black mb-6">Property Highlights</h2>
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={highlightInput}
                                    onChange={(e) => setHighlightInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
                                    className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors"
                                    placeholder="e.g., Gourmet kitchen with premium appliances"
                                />
                                <Button
                                    type="button"
                                    onClick={addHighlight}
                                    className="px-6 rounded-xl"
                                    style={{ backgroundColor: '#A8D5E2', color: '#1a1a1a' }}
                                >
                                    Add
                                </Button>
                            </div>
                            {data.highlights.length > 0 && (
                                <div className="space-y-2">
                                    {data.highlights.map((highlight, index) => (
                                        <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                            <span className="flex-1 text-sm text-gray-700">{highlight}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeHighlight(index)}
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

                    {/* Property Details */}
                    <div>
                        <h2 className="text-xl font-bold text-black mb-6">Property Details</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="text"
                                    value={detailKey}
                                    onChange={(e) => setDetailKey(e.target.value)}
                                    className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors"
                                    placeholder="e.g., Parking"
                                />
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={detailValue}
                                        onChange={(e) => setDetailValue(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPropertyDetail())}
                                        className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors"
                                        placeholder="e.g., 2-car garage"
                                    />
                                    <Button
                                        type="button"
                                        onClick={addPropertyDetail}
                                        className="px-6 rounded-xl"
                                        style={{ backgroundColor: '#A8D5E2', color: '#1a1a1a' }}
                                    >
                                        Add
                                    </Button>
                                </div>
                            </div>
                            {Object.keys(data.propertyDetails).length > 0 && (
                                <div className="space-y-2">
                                    {Object.entries(data.propertyDetails).map(([key, value]) => (
                                        <div key={key} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                            <span className="font-medium text-gray-700 w-32">{key}:</span>
                                            <span className="flex-1 text-sm text-gray-700">{value}</span>
                                            <button
                                                type="button"
                                                onClick={() => removePropertyDetail(key)}
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
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </main>
        </div>
    )
}
