import React, { useState, useEffect } from 'react'
import { Link, usePage } from '@inertiajs/react'
import { User, LogOut, LogIn } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [currentPath, setCurrentPath] = useState('')
  const { auth } = usePage().props as any
  const user = auth?.user

  useEffect(() => {
    setCurrentPath(window.location.pathname)
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold transition-colors duration-300" style={{ color: '#1a1a1a' }}>
          Realest
        </Link>
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className={`nav-link text-sm font-medium transition-all duration-300 hover:opacity-70 ${
              currentPath === '/' ? 'font-bold' : ''
            }`}
            style={{ color: '#1a1a1a' }}
          >
            Home
          </Link>
          <Link
            href="/listings"
            className={`nav-link text-sm font-medium transition-all duration-300 hover:opacity-70 ${
              currentPath.startsWith('/listings') ? 'font-bold' : ''
            }`}
            style={{ color: '#1a1a1a' }}
          >
            Listings
          </Link>
          <Link
            href="/about"
            className={`nav-link text-sm font-medium transition-all duration-300 hover:opacity-70 ${
              currentPath.startsWith('/about') ? 'font-bold' : ''
            }`}
            style={{ color: '#1a1a1a' }}
          >
            About
          </Link>
          <Link
            href="/contact"
            className={`nav-link text-sm font-medium transition-all duration-300 hover:opacity-70 ${
              currentPath.startsWith('/contact') ? 'font-bold' : ''
            }`}
            style={{ color: '#1a1a1a' }}
          >
            Contact
          </Link>
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-sm font-medium transition-all duration-300 hover:opacity-70"
                style={{ color: '#1a1a1a' }}
              >
                <User className="h-4 w-4" />
                {user.firstName}
              </Link>
              <form method="POST" action="/logout" className="inline">
                <button
                  type="submit"
                  className="flex items-center gap-2 text-sm font-medium transition-all duration-300 hover:opacity-70"
                  style={{ color: '#1a1a1a' }}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="flex items-center gap-2 text-sm font-medium transition-all duration-300 hover:opacity-70"
                style={{ color: '#1a1a1a' }}
              >
                <LogIn className="h-4 w-4" />
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
