import React, { useEffect, useRef, useState } from 'react'
import { Link } from '@inertiajs/react'
import { ArrowRight } from 'lucide-react'
import { Button } from './ui/button'

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false)
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #A8D5E2 0%, #B8E0ED 100%)',
      }}
    >
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-20 pb-32">
        <h1
          className={`text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight leading-tight transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          Discover the perfect<br />place to call home
        </h1>
        <p
          className={`text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          Your trusted real estate agency for luxury homes, offering exquisite properties.
        </p>
        <Link href="/listings">
          <Button
            className={`bg-white text-black hover:bg-white/90 px-8 py-6 text-base rounded-full shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 delay-400 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            Work with us
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>

      <div
        className={`absolute bottom-0 left-0 right-0 h-2/3 transition-all duration-1200 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}
      >
        <div className="relative w-full h-full flex items-end justify-center">
          <img
            src="https://framerusercontent.com/images/0xRyovYW1MyJtHWWrMvJemqp6E.png?width=2666&height=1325"
            alt="Modern architecture"
            className="w-auto max-w-4xl h-auto object-contain rounded-t-[80px] shadow-2xl"
            style={{ maxHeight: '60vh' }}
          />
        </div>
      </div>
    </section>
  )
}
