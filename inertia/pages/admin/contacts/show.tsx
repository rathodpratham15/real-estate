import { Head, Link, router } from '@inertiajs/react'
import { ArrowLeft, Mail, Phone, Calendar, User, CheckCircle2, Archive, MessageSquare, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Contact {
  id: number
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  adminResponse: string | null
  status: 'new' | 'read' | 'replied' | 'archived'
  createdAt: string
  updatedAt: string
}

interface ContactShowProps {
  contact: Contact
}

export default function ContactShow({ contact }: ContactShowProps) {
  const handleStatusUpdate = (newStatus: string) => {
    router.put(`/admin/contacts/${contact.id}/status`, { status: newStatus }, { preserveScroll: true })
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this contact?')) {
      router.delete(`/admin/contacts/${contact.id}`)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      new: 'bg-blue-100 text-blue-800',
      read: 'bg-gray-100 text-gray-800',
      replied: 'bg-green-100 text-green-800',
      archived: 'bg-yellow-100 text-yellow-800',
    }
    return styles[status as keyof typeof styles] || styles.read
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title={`Contact from ${contact.name} - Admin`} />

      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/contacts"
              className="p-2 text-gray-600 hover:text-black transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-black">Contact Details</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between border-b pb-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-8 w-8 text-gray-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-black">{contact.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <a href={`mailto:${contact.email}`} className="text-gray-600 hover:text-black">
                    {contact.email}
                  </a>
                </div>
                {contact.phone && (
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <a href={`tel:${contact.phone}`} className="text-gray-600 hover:text-black">
                      {contact.phone}
                    </a>
                  </div>
                )}
              </div>
            </div>
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium capitalize ${getStatusBadge(
                contact.status
              )}`}
            >
              {contact.status === 'new' && <Mail className="h-4 w-4" />}
              {contact.status === 'read' && <MessageSquare className="h-4 w-4" />}
              {contact.status === 'replied' && <CheckCircle2 className="h-4 w-4" />}
              {contact.status === 'archived' && <Archive className="h-4 w-4" />}
              {contact.status}
            </span>
          </div>

          {/* Subject */}
          {contact.subject && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Subject</h3>
              <p className="text-lg text-gray-900">{contact.subject}</p>
            </div>
          )}

          {/* Message */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Message</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-900 whitespace-pre-wrap">{contact.message}</p>
            </div>
          </div>

          {/* Admin Response */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Admin Response</h3>
            <textarea
              id="adminResponse"
              rows={6}
              defaultValue={contact.adminResponse || ''}
              onBlur={(e) => {
                const newResponse = e.target.value.trim()
                router.put(`/admin/contacts/${contact.id}/status`, {
                  status: contact.status,
                  adminResponse: newResponse || null,
                }, { preserveScroll: true })
              }}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors resize-none"
              placeholder="Add your response here. This will be visible to the user in their dashboard."
            />
            <p className="mt-2 text-xs text-gray-500">
              Changes are saved automatically when you click outside the text area.
            </p>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Received</h3>
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="h-4 w-4" />
                {new Date(contact.createdAt).toLocaleString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Last Updated</h3>
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="h-4 w-4" />
                {new Date(contact.updatedAt).toLocaleString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t">
            <div className="flex gap-3">
              {contact.status !== 'replied' && (
                <Button
                  onClick={() => handleStatusUpdate('replied')}
                  className="px-6 py-3 rounded-xl"
                  style={{ backgroundColor: '#10b981', color: '#ffffff' }}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Mark as Replied
                </Button>
              )}
              {contact.status !== 'archived' && (
                <Button
                  onClick={() => handleStatusUpdate('archived')}
                  className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </Button>
              )}
            </div>
            <Button
              onClick={handleDelete}
              className="px-6 py-3 rounded-xl border border-red-300 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="pt-6 border-t">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Quick Actions</h3>
            <div className="flex gap-3">
              <a
                href={`mailto:${contact.email}?subject=Re: ${contact.subject || 'Your Inquiry'}`}
                className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Reply via Email
              </a>
              {contact.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Call
                </a>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
