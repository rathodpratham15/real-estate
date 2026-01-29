import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { properties } from '../data/mockData';
import { Bed, Bath, Maximize, MapPin, ArrowLeft, Calendar, Home, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const found = properties.find(p => p.id === parseInt(id));
    setProperty(found);
    setTimeout(() => setIsVisible(true), 100);
  }, [id]);

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Property not found</h2>
          <Link to="/listings" className="text-blue-600 hover:underline">Back to Listings</Link>
        </div>
      </div>
    );
  }

  const propertyDetails = {
    description: `Welcome to ${property.name}, a stunning luxury property that epitomizes modern elegance and sophisticated living. This exceptional home features ${property.bedrooms} spacious bedrooms and ${property.bathrooms} beautifully appointed bathrooms across ${property.sqft} of meticulously designed living space.`,
    highlights: [
      'Gourmet kitchen with premium appliances',
      'Master suite with spa-like bathroom',
      'Open-concept living and dining areas',
      'Smart home technology integration',
      'Private outdoor spaces with landscaping',
      'Energy-efficient systems throughout'
    ],
    location: 'Premium Neighborhood, Prime Location',
    yearBuilt: '2023',
    propertyType: 'Luxury Residence',
    parking: '2-car garage'
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <button 
            onClick={() => navigate('/listings')}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-6"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Listings</span>
          </button>
        </div>

        <div className={`max-w-7xl mx-auto px-6 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
            <div className="lg:col-span-2 rounded-3xl overflow-hidden shadow-xl">
              <img 
                src={property.image}
                alt={property.name}
                className="w-full h-[500px] object-cover"
              />
            </div>
            <div className="grid grid-rows-2 gap-4">
              <div className="rounded-3xl overflow-hidden shadow-xl">
                <img 
                  src={property.image}
                  alt={`${property.name} view 2`}
                  className="w-full h-full object-cover"
                  style={{ filter: 'brightness(0.9)' }}
                />
              </div>
              <div className="rounded-3xl overflow-hidden shadow-xl">
                <img 
                  src={property.image}
                  alt={`${property.name} view 3`}
                  className="w-full h-full object-cover"
                  style={{ filter: 'brightness(1.1)' }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className={`transition-all duration-1000 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                <div className="mb-8">
                  <h1 className="text-5xl font-bold text-black mb-4 capitalize">{property.name}</h1>
                  <div className="flex items-center gap-2 text-gray-600 mb-6">
                    <MapPin className="h-5 w-5" />
                    <span className="text-lg">{propertyDetails.location}</span>
                  </div>
                  <p className="text-4xl font-bold" style={{ color: '#A8D5E2' }}>{property.price}</p>
                </div>

                <div className="flex items-center gap-8 py-6 border-y border-gray-200 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full" style={{ backgroundColor: '#A8D5E2' }}>
                      <Bed className="h-6 w-6 text-black" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-black">{property.bedrooms}</p>
                      <p className="text-sm text-gray-600">Bedrooms</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full" style={{ backgroundColor: '#A8D5E2' }}>
                      <Bath className="h-6 w-6 text-black" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-black">{property.bathrooms}</p>
                      <p className="text-sm text-gray-600">Bathrooms</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full" style={{ backgroundColor: '#A8D5E2' }}>
                      <Maximize className="h-6 w-6 text-black" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-black">{property.sqft}</p>
                      <p className="text-sm text-gray-600">Square Feet</p>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-black mb-4">About This Property</h2>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {propertyDetails.description}
                  </p>
                </div>

                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-black mb-6">Property Highlights</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {propertyDetails.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                        <Sparkles className="h-5 w-5 mt-1" style={{ color: '#A8D5E2' }} />
                        <p className="text-gray-700">{highlight}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-black mb-6">Property Details</h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex items-center gap-3">
                      <Home className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Property Type</p>
                        <p className="font-semibold text-black">{propertyDetails.propertyType}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Year Built</p>
                        <p className="font-semibold text-black">{propertyDetails.yearBuilt}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Parking</p>
                        <p className="font-semibold text-black">{propertyDetails.parking}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className={`sticky top-24 bg-gray-50 rounded-3xl p-8 shadow-lg transition-all duration-1000 delay-400 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                <h3 className="text-2xl font-bold text-black mb-6">Interested in this property?</h3>
                <div className="space-y-4 mb-6">
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors"
                  />
                  <input 
                    type="email" 
                    placeholder="Your Email" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors"
                  />
                  <input 
                    type="tel" 
                    placeholder="Your Phone" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors"
                  />
                  <textarea 
                    placeholder="Message" 
                    rows="4"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors resize-none"
                  />
                </div>
                <Button className="w-full py-6 text-base rounded-xl" style={{ backgroundColor: '#A8D5E2', color: '#1a1a1a' }}>
                  Request Information
                </Button>
                <p className="text-xs text-gray-600 text-center mt-4">
                  Our team will contact you within 24 hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PropertyDetail;