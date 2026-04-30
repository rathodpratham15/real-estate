import Link from 'next/link'

const links = [
  { href: '/', label: 'Home' },
  { href: '/listings', label: 'Listings' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' }
]

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/70 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
        <Link href="/" className="text-2xl font-bold text-black">
          Realest
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-gray-700">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-black transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
