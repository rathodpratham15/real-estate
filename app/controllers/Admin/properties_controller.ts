import type { HttpContext } from '@adonisjs/core/http'
import Property from '#models/property'
import Contact from '#models/contact'
import app from '@adonisjs/core/services/app'
import { mkdir } from 'fs/promises'

export default class PropertiesController {
    private parseBoolean(value: any, fallback = false): boolean {
        if (value === undefined || value === null || value === '') return fallback
        if (typeof value === 'boolean') return value
        if (typeof value === 'number') return value === 1
        if (typeof value === 'string') {
            const normalized = value.toLowerCase().trim()
            return ['true', '1', 'yes', 'on'].includes(normalized)
        }
        return fallback
    }

    /**
     * List all properties (admin view)
     */
  async index({ inertia, request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = 15

    const properties = await Property.query()
      .preload('user')
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    // Get count of new inquiries for notification badge
    const newInquiriesCount = await Contact.query().where('status', 'new').count('* as total')

    return inertia.render('admin/properties/index', {
      properties,
      newInquiriesCount: Number(newInquiriesCount[0].$extras.total),
    })
  }

    /**
     * Show create property form
     */
    async create({ inertia }: HttpContext) {
        return inertia.render('admin/properties/create')
    }

    /**
     * Store new property
     */
    async store({ request, response, session, auth }: HttpContext) {
        const user = await (auth as any).use('web').authenticate()

        // Handle file uploads
        const uploadsDir = app.publicPath('uploads')
        await mkdir(uploadsDir, { recursive: true })

        let mainImagePath = request.input('mainImage', null)
        const mainImageFile = request.file('mainImage')
        if (mainImageFile) {
            const fileName = `${Date.now()}-${mainImageFile.clientName}`
            await mainImageFile.move(uploadsDir, { name: fileName })
            mainImagePath = `/uploads/${fileName}`
        }

        const imageFiles = request.files('images[]', {})
        const uploadedImages: string[] = []
        for (const imageFile of imageFiles) {
            if (imageFile.isValid) {
                const fileName = `${Date.now()}-${imageFile.clientName}`
                await imageFile.move(uploadsDir, { name: fileName })
                uploadedImages.push(`/uploads/${fileName}`)
            }
        }

        const videoFiles = request.files('videos[]', {})
        const uploadedVideos: string[] = []
        for (const videoFile of videoFiles) {
            if (videoFile.isValid) {
                const fileName = `${Date.now()}-${videoFile.clientName}`
                await videoFile.move(uploadsDir, { name: fileName })
                uploadedVideos.push(`/uploads/${fileName}`)
            }
        }

        const data = request.only([
            'title',
            'description',
            'address',
            'city',
            'state',
            'zipCode',
            'country',
            'latitude',
            'longitude',
            'price',
            'propertyType',
            'propertyTypeOther',
            'bedrooms',
            'bathrooms',
            'squareFeet',
            'yearBuilt',
            'status',
            'featured',
            'rating',
            'isPopular',
            'images',
            'videos',
            'features',
        ])

        // Combine uploaded images with URL images
        const allImages = [...uploadedImages, ...(Array.isArray(data.images) ? data.images.filter((img: string) => !img.startsWith('data:')) : [])]
        const allVideos = [...uploadedVideos, ...(Array.isArray(data.videos) ? data.videos.filter((vid: string) => !vid.startsWith('data:')) : [])]

        // Generate slug from title
        const slug = data.title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '')
        let uniqueSlug = slug
        let counter = 1

        // Ensure slug is unique
        while (await Property.findBy('slug', uniqueSlug)) {
            uniqueSlug = `${slug}-${counter}`
            counter++
        }

        const property = await Property.create({
            title: data.title,
            description: data.description || null,
            address: data.address,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode,
            country: data.country,
            latitude: data.latitude ? parseFloat(data.latitude) : null,
            longitude: data.longitude ? parseFloat(data.longitude) : null,
            price: parseFloat(data.price),
            propertyType: data.propertyType,
            propertyTypeOther: data.propertyTypeOther || null,
            bedrooms: data.bedrooms ? parseInt(data.bedrooms) : null,
            bathrooms: data.bathrooms ? parseFloat(data.bathrooms) : null,
            squareFeet: data.squareFeet ? parseInt(data.squareFeet) : null,
            yearBuilt: data.yearBuilt ? parseInt(data.yearBuilt) : null,
            status: data.status,
            featured: this.parseBoolean(data.featured, false),
            rating: data.rating ? parseFloat(data.rating) : null,
            isPopular: this.parseBoolean(data.isPopular, false),
            mainImage: mainImagePath,
            images: allImages,
            videos: allVideos,
            features: typeof data.features === 'string' ? JSON.parse(data.features) : data.features || null,
            slug: uniqueSlug,
            userId: user.id,
        })

        session.flash('success', 'Property created successfully!')
        return response.redirect(`/admin/properties/${property.id}/edit`)
    }

    /**
     * Show edit property form
     */
    async edit({ params, inertia }: HttpContext) {
        const property = await Property.findOrFail(params.id)

        return inertia.render('admin/properties/edit', {
            property,
        })
    }

    /**
     * Update property
     */
    async update({ params, request, response, session }: HttpContext) {
        const property = await Property.findOrFail(params.id)

        // Handle file uploads
        const uploadsDir = app.publicPath('uploads')
        await mkdir(uploadsDir, { recursive: true })

        let mainImagePath = request.input('mainImage', property.mainImage)
        const mainImageFile = request.file('mainImage')
        if (mainImageFile) {
            const fileName = `${Date.now()}-${mainImageFile.clientName}`
            await mainImageFile.move(uploadsDir, { name: fileName })
            mainImagePath = `/uploads/${fileName}`
        }

        const imageFiles = request.files('images[]', {})
        const uploadedImages: string[] = []
        for (const imageFile of imageFiles) {
            if (imageFile.isValid) {
                const fileName = `${Date.now()}-${imageFile.clientName}`
                await imageFile.move(uploadsDir, { name: fileName })
                uploadedImages.push(`/uploads/${fileName}`)
            }
        }

        const videoFiles = request.files('videos[]', {})
        const uploadedVideos: string[] = []
        for (const videoFile of videoFiles) {
            if (videoFile.isValid) {
                const fileName = `${Date.now()}-${videoFile.clientName}`
                await videoFile.move(uploadsDir, { name: fileName })
                uploadedVideos.push(`/uploads/${fileName}`)
            }
        }

        const data = request.only([
            'title',
            'description',
            'address',
            'city',
            'state',
            'zipCode',
            'country',
            'latitude',
            'longitude',
            'price',
            'propertyType',
            'propertyTypeOther',
            'bedrooms',
            'bathrooms',
            'squareFeet',
            'yearBuilt',
            'status',
            'featured',
            'rating',
            'isPopular',
            'images',
            'videos',
            'features',
        ])

        // Combine uploaded images/videos with URL images/videos
        const allImages = [...uploadedImages, ...(Array.isArray(data.images) ? data.images.filter((img: string) => !img.startsWith('data:')) : [])]
        const allVideos = [...uploadedVideos, ...(Array.isArray(data.videos) ? data.videos.filter((vid: string) => !vid.startsWith('data:')) : [])]

        // Update slug if title changed
        if (data.title && data.title !== property.title) {
            const slug = data.title
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '-')
                .replace(/^-+|-+$/g, '')
            let uniqueSlug = slug
            let counter = 1

            while (await Property.query().where('slug', uniqueSlug).where('id', '!=', property.id).first()) {
                uniqueSlug = `${slug}-${counter}`
                counter++
            }
            data.slug = uniqueSlug
        }

        property.merge({
            title: data.title,
            description: data.description || null,
            address: data.address,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode,
            country: data.country,
            latitude: data.latitude ? parseFloat(data.latitude) : null,
            longitude: data.longitude ? parseFloat(data.longitude) : null,
            price: parseFloat(data.price),
            propertyType: data.propertyType,
            propertyTypeOther: data.propertyTypeOther || null,
            bedrooms: data.bedrooms ? parseInt(data.bedrooms) : null,
            bathrooms: data.bathrooms ? parseFloat(data.bathrooms) : null,
            squareFeet: data.squareFeet ? parseInt(data.squareFeet) : null,
            yearBuilt: data.yearBuilt ? parseInt(data.yearBuilt) : null,
            status: data.status,
            featured: this.parseBoolean(data.featured, property.featured),
            rating: data.rating ? parseFloat(data.rating) : null,
            isPopular: this.parseBoolean(data.isPopular, property.isPopular),
            mainImage: mainImagePath,
            images: allImages.length > 0 ? allImages : (data.images || property.images),
            videos: allVideos.length > 0 ? allVideos : (data.videos || property.videos),
            features: typeof data.features === 'string' ? JSON.parse(data.features) : data.features || property.features,
            slug: data.slug || property.slug,
        })
        await property.save()

        session.flash('success', 'Property updated successfully!')
        return response.redirect('/admin/properties')
    }

    /**
     * Delete property
     */
    async destroy({ params, response, session }: HttpContext) {
        const property = await Property.findOrFail(params.id)
        await property.delete()

        session.flash('success', 'Property deleted successfully!')
        return response.redirect('/admin/properties')
    }
}
