import { Head, useForm } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import Navbar from '@/components/navbar-new'
import Footer from '@/components/footer-new'
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import type { Agent } from '@/lib/real-estate-types'
import { createWhatsAppLink } from '@/lib/whatsapp'

interface ContactPageProps {
    agents: Agent[]
    whatsappNumber?: string
}

export default function ContactPage({ agents, whatsappNumber = '+919876543210' }: ContactPageProps) {
    const [isVisible, setIsVisible] = useState(false)
    const { toast } = useToast()
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        agentId: '',
    })

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.scrollTo(0, 0)
            const params = new URLSearchParams(window.location.search)
            const intent = params.get('intent')

            if (intent === 'sell') {
                setData('subject', 'I want to sell my property')
                setData(
                    'message',
                    "Hi Realest team, I want to list my property for sale. Please contact me with the next steps, required documents, and estimated timeline."
                )
            }
        }
        setTimeout(() => setIsVisible(true), 100)
    }, [setData])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        post('/contact', {
            onSuccess: () => {
                toast({
                    title: 'Message Sent!',
                    description: "We'll get back to you within 24 hours.",
                })
                reset()
            },
            onError: () => {
                toast({
                    title: 'Error',
                    description: 'There was an error sending your message. Please try again.',
                })
            },
        })
    }

    const contactInfo = [
        {
            icon: MapPin,
            title: 'Visit Us',
            details: ['Shop No.3', 'Shree Ganesh Real Estate Consultants', 'Below Casa Pieadade Building', 'Opposite Shiv Sena Shaka', 'Charai, Thane West, 400601'],
        },
        {
            icon: Phone,
            title: 'Call Us',
            details: ['+91 9820145764'],
        },
        {
            icon: Mail,
            title: 'Email Us',
            details: ['shreeganes909@gmail.com', 'shreeganes009@rediffmail.com'],
        },
        {
            icon: Clock,
            title: 'Business Hours',
            details: ['Monday - Sunday: 11AM - 8PM'],
        },
    ]

    return (
        <div className="min-h-screen bg-white">
            <Head title="Contact Us - Realest" />
            <Navbar />

            <div
                className="pt-24 pb-16 px-6"
                style={{
                    background: 'linear-gradient(180deg, #A8D5E2 0%, #ffffff 100%)',
                }}
            >
                <div className="max-w-7xl mx-auto">
                    <div
                        className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                            }`}
                    >
                        <span
                            className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4"
                            style={{ backgroundColor: '#ffffff', color: '#1a1a1a' }}
                        >
                            Contact Us
                        </span>
                        <h1 className="text-5xl md:text-6xl font-bold text-black mb-4">
                            Let's Start a Conversation
                        </h1>
                        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                            Have questions? We're here to help. Reach out to us and we'll respond as soon as possible.
                        </p>
                    </div>
                </div>
            </div>

            <section className="py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {contactInfo.map((info, index) => {
                            const Icon = info.icon
                            return (
                                <div
                                    key={index}
                                    className={`p-6 bg-gray-50 rounded-3xl hover:shadow-lg transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                        }`}
                                    style={{ transitionDelay: `${index * 100}ms` }}
                                >
                                    <div
                                        className="inline-flex p-3 rounded-full mb-4"
                                        style={{ backgroundColor: '#A8D5E2' }}
                                    >
                                        <Icon className="h-6 w-6 text-black" />
                                    </div>
                                    <h3 className="text-xl font-bold text-black mb-3">{info.title}</h3>
                                    {info.details.map((detail, idx) => (
                                        <p key={idx} className="text-gray-600 text-sm">
                                            {detail}
                                        </p>
                                    ))}
                                </div>
                            )
                        })}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div
                            className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                                }`}
                        >
                            <h2 className="text-4xl font-bold text-black mb-6">Send Us a Message</h2>
                            <p className="text-gray-600 mb-8">
                                Fill out the form below and our team will get back to you within 24 hours.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors"
                                        placeholder="Deepak Rathod"
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors"
                                            placeholder="shreeganes909@gmail.com"
                                        />
                                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors"
                                            placeholder="+91 9820145764"
                                        />
                                        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Subject *
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={data.subject}
                                        onChange={(e) => setData('subject', e.target.value)}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors"
                                        placeholder="How can we help?"
                                    />
                                    {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        name="message"
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        required
                                        rows={6}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors resize-none"
                                        placeholder="Tell us more about what you're looking for..."
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
                                        {processing ? 'Sending...' : 'Send Message'}
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            const message = `Hi! ${data.subject ? `Subject: ${data.subject}\n\n` : ''}${data.message || 'I would like to get in touch with you.'}`
                                            window.open(createWhatsAppLink(whatsappNumber, message), '_blank', 'noopener,noreferrer')
                                        }}
                                        className="px-6 py-6 text-base rounded-xl"
                                        style={{ backgroundColor: '#25D366', color: '#ffffff' }}
                                    >
                                        <MessageCircle className="h-5 w-5" />
                                    </Button>
                                </div>
                            </form>
                        </div>

                        <div
                            className={`transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                                }`}
                        >
                            <div className="bg-gray-50 rounded-3xl overflow-hidden h-full min-h-[600px]">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3767.9626860883714!2d72.97209297545855!3d19.19683204816771!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b923445f6d2f%3A0xb38dbacbdf3bc1aa!2sCasa%20Piedade%2C%20Opp.%20Shivsena%20Shakha%2C%20Charai%2C%20Thane%20West%2C%20Thane%2C%20Maharashtra%20400601%2C%20India!5e0!3m2!1sen!2sus!4v1735378472484!5m2!1sen!2sus"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen={true}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Office Location"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
