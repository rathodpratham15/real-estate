import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-black px-6 py-14 text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-8 md:grid-cols-3">
        <div>
          <h3 className="mb-3 text-2xl font-bold">Realest</h3>
          <p className="text-sm text-gray-300">Luxury real estate listings now running on a Vercel-native Next.js app.</p>
        </div>
        <div>
          <h4 className="mb-3 font-semibold">Explore</h4>
          <div className="flex flex-col gap-2 text-sm text-gray-300">
            <Link href="/">Home</Link>
            <Link href="/listings">Listings</Link>
            <Link href="/about">About</Link>
          </div>
        </div>
        <div>
          <h4 className="mb-3 font-semibold">Contact</h4>
          <p className="text-sm text-gray-300">Reach out for a demo migration of admin/auth/API flows next.</p>
        </div>
      </div>
    </footer>
  )
}
