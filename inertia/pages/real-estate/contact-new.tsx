import { Head } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import Navbar from '@/components/navbar-new'
import Footer from '@/components/footer-new'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

export default function ContactPage() {
    const [isVisible, setIsVisible] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    })
    const { toast } = useToast()

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.scrollTo(0, 0)
        }
        setTimeout(() => setIsVisible(true), 100)
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target as unknown as { name: string; value: string }
        setFormData({
            ...formData,
            [target.name]: target.value,
        })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        toast({
            title: 'Message Sent!',
            description: "We'll get back to you within 24 hours.",
        })
        setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: '',
        })
    }

    const contactInfo = [
        {
            icon: MapPin,
            title: 'Visit Us',
            details: ['123 Real Estate Boulevard', 'Suite 400', 'City, State 12345'],
        },
        {
            icon: Phone,
            title: 'Call Us',
            details: ['+1 (555) 123-4567', '+1 (555) 987-6543'],
        },
        {
            icon: Mail,
            title: 'Email Us',
            details: ['info@realest.com', 'support@realest.com'],
        },
        {
            icon: Clock,
            title: 'Business Hours',
            details: ['Monday - Friday: 9AM - 6PM', 'Saturday: 10AM - 4PM', 'Sunday: Closed'],
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
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors"
                                            placeholder="+1 (555) 123-4567"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Subject *
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors"
                                        placeholder="How can we help?"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={6}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors resize-none"
                                        placeholder="Tell us more about what you're looking for..."
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full py-6 text-base rounded-xl"
                                    style={{ backgroundColor: '#A8D5E2', color: '#1a1a1a' }}
                                >
                                    Send Message
                                </Button>
                            </form>
                        </div>

                        <div
                            className={`transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                                }`}
                        >
                            <div className="bg-gray-50 rounded-3xl overflow-hidden h-full min-h-[600px]">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30596073366!2d-74.25986548248684!3d40.69714941932609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
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
