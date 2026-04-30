import mail from '@adonisjs/mail/services/main'
import env from '#start/env'
import User from '#models/user'
import app from '@adonisjs/core/services/app'

export default class NotificationService {
  /**
   * Get admin email address
   */
  private static async getAdminEmail(): Promise<string | null> {
    const adminEmail = env.get('ADMIN_EMAIL')
    if (adminEmail) {
      return adminEmail
    }
    
    // Fallback: get admin email from database
    const admin = await User.query().where('role', 'admin').where('is_active', true).first()
    return admin?.email || null
  }

  /**
   * Get base URL for email links
   */
  private static getBaseUrl(): string {
    const host = env.get('HOST', 'localhost')
    const port = env.get('PORT', 3333)
    return `http://${host}:${port}`
  }

  /**
   * Send email notification to admin when a new contact inquiry is received
   */
  static async notifyAdminNewContact(contactData: {
    name: string
    email: string
    phone: string | null
    subject: string | null
    message: string
  }) {
    try {
      const adminEmail = await this.getAdminEmail()
      if (!adminEmail) {
        console.warn('No admin email found to send notification email')
        return
      }
      
      await mail.send((message) => {
        message
          .to(adminEmail)
          .subject(`New Contact Inquiry: ${contactData.subject || 'No Subject'}`)
          .htmlView('emails/new_contact', {
            contact: contactData,
            baseUrl: this.getBaseUrl(),
          })
      })
    } catch (error) {
      console.error('Failed to send admin notification email:', error)
      // Don't throw - email failure shouldn't break the contact submission
    }
  }

  /**
   * Send email notification to admin when a new property inquiry is received
   */
  static async notifyAdminPropertyInquiry(inquiryData: {
    name: string
    email: string
    phone: string | null
    propertyTitle: string
    propertyAddress: string
    propertyPrice: number
    message: string
  }) {
    try {
      const adminEmail = await this.getAdminEmail()
      if (!adminEmail) {
        console.warn('No admin email found to send notification email')
        return
      }
      
      await mail.send((message) => {
        message
          .to(adminEmail)
          .subject(`New Property Inquiry: ${inquiryData.propertyTitle}`)
          .htmlView('emails/property_inquiry', {
            inquiry: inquiryData,
            baseUrl: this.getBaseUrl(),
          })
      })
    } catch (error) {
      console.error('Failed to send admin notification email:', error)
      // Don't throw - email failure shouldn't break the inquiry submission
    }
  }
}
