import { Head, Link, router } from '@inertiajs/react'
import { useState } from 'react'
import { Mail, Phone, Calendar, User, Filter, Trash2, Eye, CheckCircle2, Archive, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Contact {
  id: number
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  status: 'new' | 'read' | 'replied' | 'archived'
  createdAt: string
  updatedAt: string
}

interface ContactsIndexProps {
  contacts: {
    data: Contact[]
    meta: {
      currentPage: number
      lastPage: number
      perPage: number
      total: number
    }
  }
  filters: {
    status: string | null
  }
  counts: {
    new: number
    read: number
    replied: number
    archived: number
    total: number
  }
}

export default function ContactsIndex({ contacts, filters, counts }: ContactsIndexProps) {
  const [statusFilter, setStatusFilter] = useState(filters.status || '')

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status)
    router.get('/admin/contacts', { status: status || null }, { preserveState: true })
  }

  const handleStatusUpdate = (contactId: number, newStatus: string) => {
    router.put(`/admin/contacts/${contactId}/status`, { status: newStatus }, { preserveScroll: true })
  }

  const handleDelete = (contactId: number) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      router.delete(`/admin/contacts/${contactId}`)
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <Mail className="h-4 w-4" />
      case 'read':
        return <Eye className="h-4 w-4" />
      case 'replied':
        return <MessageSquare className="h-4 w-4" />
      case 'archived':
        return <Archive className="h-4 w-4" />
      default:
        return <Mail className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title="Contacts - Admin" />

      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-black">Contact Inquiries</h1>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/properties"
              className="px-4 py-2 text-gray-600 hover:text-black transition-colors"
            >
              Properties
            </Link>
            <Link
              href="/admin/testimonials"
              className="px-4 py-2 text-gray-600 hover:text-black transition-colors"
            >
              Testimonials
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Status Filter Tabs */}
        <div className="mb-6 flex gap-4 overflow-x-auto pb-2">
          <button
            onClick={() => handleStatusFilter('')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              statusFilter === ''
                ? 'bg-black text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All ({counts.total})
          </button>
          <button
            onClick={() => handleStatusFilter('new')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
              statusFilter === 'new'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Mail className="h-4 w-4" />
            New ({counts.new})
          </button>
          <button
            onClick={() => handleStatusFilter('read')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
              statusFilter === 'read'
                ? 'bg-gray-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Eye className="h-4 w-4" />
            Read ({counts.read})
          </button>
          <button
            onClick={() => handleStatusFilter('replied')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
              statusFilter === 'replied'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            Replied ({counts.replied})
          </button>
          <button
            onClick={() => handleStatusFilter('archived')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
              statusFilter === 'archived'
                ? 'bg-yellow-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Archive className="h-4 w-4" />
            Archived ({counts.archived})
          </button>
        </div>

        {/* Contacts List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {contacts.data.length === 0 ? (
            <div className="p-12 text-center">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No contacts found</p>
              <p className="text-gray-500 text-sm mt-2">
                {statusFilter ? `No contacts with status "${statusFilter}"` : 'No contacts yet'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Message Preview
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contacts.data.map((contact) => (
                    <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                            <div className="text-sm text-gray-500">{contact.email}</div>
                            {contact.phone && (
                              <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                <Phone className="h-3 w-3" />
                                {contact.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {contact.subject || <span className="text-gray-400 italic">No subject</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-md truncate">{contact.message}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(
                            contact.status
                          )}`}
                        >
                          {getStatusIcon(contact.status)}
                          {contact.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(contact.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/contacts/${contact.id}`}
                            className="p-2 text-gray-600 hover:text-black transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          {contact.status !== 'replied' && (
                            <button
                              onClick={() => handleStatusUpdate(contact.id, 'replied')}
                              className="p-2 text-green-600 hover:text-green-800 transition-colors"
                              title="Mark as Replied"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                          )}
                          {contact.status !== 'archived' && (
                            <button
                              onClick={() => handleStatusUpdate(contact.id, 'archived')}
                              className="p-2 text-yellow-600 hover:text-yellow-800 transition-colors"
                              title="Archive"
                            >
                              <Archive className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(contact.id)}
                            className="p-2 text-red-600 hover:text-red-800 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {contacts.meta.lastPage > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {contacts.meta.perPage * (contacts.meta.currentPage - 1) + 1} to{' '}
              {Math.min(contacts.meta.perPage * contacts.meta.currentPage, contacts.meta.total)} of{' '}
              {contacts.meta.total} contacts
            </div>
            <div className="flex gap-2">
              {contacts.meta.currentPage > 1 && (
                <Link
                  href={`/admin/contacts?page=${contacts.meta.currentPage - 1}${statusFilter ? `&status=${statusFilter}` : ''}`}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Previous
                </Link>
              )}
              {contacts.meta.currentPage < contacts.meta.lastPage && (
                <Link
                  href={`/admin/contacts?page=${contacts.meta.currentPage + 1}${statusFilter ? `&status=${statusFilter}` : ''}`}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
