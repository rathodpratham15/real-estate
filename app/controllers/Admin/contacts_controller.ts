import type { HttpContext } from '@adonisjs/core/http'
import Contact from '#models/contact'

export default class ContactsController {
  async index({ inertia, request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = 20
    const status = request.input('status', null)

    const query = Contact.query().orderBy('created_at', 'desc')

    if (status) {
      query.where('status', status)
    }

    const contacts = await query.paginate(page, limit)

    // Get counts for status badges
    const newCount = await Contact.query().where('status', 'new').count('* as total')
    const readCount = await Contact.query().where('status', 'read').count('* as total')
    const repliedCount = await Contact.query().where('status', 'replied').count('* as total')
    const archivedCount = await Contact.query().where('status', 'archived').count('* as total')

    return inertia.render('admin/contacts/index', {
      contacts,
      filters: {
        status,
      },
      counts: {
        new: Number(newCount[0].$extras.total),
        read: Number(readCount[0].$extras.total),
        replied: Number(repliedCount[0].$extras.total),
        archived: Number(archivedCount[0].$extras.total),
        total: contacts.getMeta().total,
      },
    })
  }

  async show({ params, inertia }: HttpContext) {
    const contact = await Contact.findOrFail(params.id)

    // Mark as read if it's new
    if (contact.status === 'new') {
      contact.status = 'read'
      await contact.save()
    }

    return inertia.render('admin/contacts/show', {
      contact,
    })
  }

  async updateStatus({ params, request, response, session }: HttpContext) {
    const contact = await Contact.findOrFail(params.id)
    const { status, adminResponse } = request.only(['status', 'adminResponse'])

    contact.status = status
    if (adminResponse !== undefined) {
      contact.adminResponse = adminResponse || null
    }
    await contact.save()

    session.flash('success', 'Contact updated successfully!')
    return response.redirect().back()
  }

  async destroy({ params, response, session }: HttpContext) {
    const contact = await Contact.findOrFail(params.id)
    await contact.delete()

    session.flash('success', 'Contact deleted successfully!')
    return response.redirect('/admin/contacts')
  }
}
