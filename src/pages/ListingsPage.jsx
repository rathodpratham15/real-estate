import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { properties } from '../data/mockData';
import { Bed, Bath, Maximize, MapPin } from 'lucide-react';

const ListingsPage = () => {
  const [visibleCards, setVisibleCards] = useState([]);
  const cardRefs = useRef([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-24 pb-16 px-6" style={{
        background: 'linear-gradient(180deg, #A8D5E2 0%, #ffffff 100%)'
      }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4" style={{ backgroundColor: '#ffffff', color: '#1a1a1a' }}>
              All Listings
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-black mb-4">
              Explore Our Properties
            </h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Discover your dream home from our curated collection of luxury properties
            </p>
          </div>
        </div>
      </div>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                <div className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500">
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <img 
                      src={property.image} 
                      alt={property.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-full shadow-lg">
                      <p className="text-lg font-bold text-black">{property.price}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-black mb-2 capitalize group-hover:text-gray-700 transition-colors">
                      {property.name}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">Premium Location</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <Bed className="h-5 w-5" />
                        <span className="font-medium">{property.bedrooms} Beds</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bath className="h-5 w-5" />
                        <span className="font-medium">{property.bathrooms} Baths</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Maximize className="h-5 w-5" />
                        <span className="font-medium">{property.sqft}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ListingsPage;