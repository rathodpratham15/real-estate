/**
 * WhatsApp utility functions
 */

/**
 * Format phone number for WhatsApp (remove spaces, dashes, etc.)
 */
export function formatWhatsAppNumber(phone: string): string {
  // Remove all non-digit characters except +
  return phone.replace(/[^\d+]/g, '')
}

/**
 * Create WhatsApp click-to-chat URL
 * @param phoneNumber - Phone number with country code (e.g., +919876543210)
 * @param message - Pre-filled message
 */
export function createWhatsAppLink(phoneNumber: string, message: string): string {
  const formattedNumber = formatWhatsAppNumber(phoneNumber)
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${formattedNumber}?text=${encodedMessage}`
}

/**
 * Open WhatsApp chat in new window/tab
 */
export function openWhatsApp(phoneNumber: string, message: string): void {
  const url = createWhatsAppLink(phoneNumber, message)
  window.open(url, '_blank', 'noopener,noreferrer')
}
