import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { properties } from '../data/mockData';
import { Bed, Bath, Maximize, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

const Listings = () => {
  const [visibleCards, setVisibleCards] = useState([]);
  const cardRefs = useRef([]);

  useEffect(() => {
    const observers = cardRefs.current.map((ref, index) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleCards((prev) => [...new Set([...prev, index])]);
            }
          });
        },
        { threshold: 0.1 }
      );

      if (ref) observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4" style={{ backgroundColor: '#A8D5E2', color: '#1a1a1a' }}>
              Listings
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-black">
              Find homes that perfectly<br />match your lifestyle
            </h2>
          </div>
          <Link to="/listings">
            <Button className="bg-black text-white hover:bg-black/90 rounded-full px-6 py-3 hidden md:flex items-center">
              View all
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property, index) => (
            <Link
              to={`/property/${property.id}`}
              key={property.id}
              ref={(el) => (cardRefs.current[index] = el)}
              className={`group cursor-pointer transition-all duration-700 ${
                visibleCards.includes(index)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative overflow-hidden rounded-3xl mb-4 aspect-[4/3]">
                <img 
                  src={property.image} 
                  alt={property.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="px-2">
                <h3 className="text-xl font-semibold text-black mb-2 capitalize">{property.name}</h3>
                <p className="text-2xl font-bold text-black mb-3">{property.price}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Bed className="h-4 w-4" />
                    <span>{property.bedrooms}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="h-4 w-4" />
                    <span>{property.bathrooms}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Maximize className="h-4 w-4" />
                    <span>{property.sqft}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Listings;