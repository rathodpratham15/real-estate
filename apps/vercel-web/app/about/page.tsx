import Footer from '@/components/footer'
import Navbar from '@/components/navbar'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="mb-4 text-4xl font-bold text-black">About Realest</h1>
        <p className="text-gray-700 leading-7">
          This route is migrated to Next.js as part of your Vercel-first restructure. In the next phase we can port the
          complete content from the Adonis/Inertia version and connect it to live data.
        </p>
      </main>
      <Footer />
    </div>
  )
}
