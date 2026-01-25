import React, { useRef, useEffect, useState } from 'react'
import type { Testimonial } from '@/lib/real-estate-types'

interface TestimonialsProps {
  testimonials: Testimonial[]
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let animationFrameId: number
    let scrollPosition = 0

    const scroll = () => {
      if (!isPaused) {
        scrollPosition += 0.5
        if (scrollPosition >= scrollContainer.scrollWidth / 2) {
          scrollPosition = 0
        }
        scrollContainer.scrollLeft = scrollPosition
      }
      animationFrameId = requestAnimationFrame(scroll)
    }

    animationFrameId = requestAnimationFrame(scroll)

    return () => cancelAnimationFrame(animationFrameId)
  }, [isPaused])

  const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials]

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto mb-12">
        <div
          className={`text-center transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span
            className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4"
            style={{ backgroundColor: '#A8D5E2', color: '#1a1a1a' }}
          >
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-black">
            In our clients' words, real estate done right
          </h2>
          <p className="text-lg text-gray-600 mt-4">
            What our clients say about the quality, service, and results we deliver.
          </p>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {duplicatedTestimonials.map((testimonial, index) => (
          <div
            key={`${testimonial.id}-${index}`}
            className="flex-shrink-0 w-80 bg-gray-50 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              &ldquo;{testimonial.content}&rdquo;
            </p>
            <div className="flex items-center gap-4">
              {testimonial.clientPhoto ? (
                <img
                  src={testimonial.clientPhoto}
                  alt={testimonial.clientName}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {testimonial.clientName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <p className="font-semibold text-black">{testimonial.clientName}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
