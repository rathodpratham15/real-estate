import Footer from '@/components/footer'
import Navbar from '@/components/navbar'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="mb-4 text-4xl font-bold text-black">Contact</h1>
        <p className="text-gray-700 leading-7">
          Contact form migration comes in the API phase. For now this route confirms your Next.js app routing works correctly
          on Vercel and avoids platform 404s.
        </p>
      </main>
      <Footer />
    </div>
  )
}
