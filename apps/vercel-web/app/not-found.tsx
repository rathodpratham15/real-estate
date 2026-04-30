import Link from 'next/link'
import Footer from '@/components/footer'
import Navbar from '@/components/navbar'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center">
        <p className="mb-2 text-sm uppercase tracking-wide text-gray-500">404</p>
        <h1 className="mb-4 text-4xl font-bold text-black">Page not found</h1>
        <p className="mb-8 text-gray-600">The page you requested does not exist in the migrated Next.js app.</p>
        <Link href="/" className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white">
          Go Home
        </Link>
      </main>
      <Footer />
    </div>
  )
}
