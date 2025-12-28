'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, X, Check } from 'lucide-react';
import Button from '@/components/ui/Button';

const galleryImages = [
  '/gallery/event1.jpg',
  '/gallery/event2.jpg',
  '/gallery/event3.jpg',
];

export default function HeroSection() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<'client' | 'attendee' | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % galleryImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsRegisterModalOpen(false);
      }
    };

    if (isRegisterModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isRegisterModalOpen]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume auto-play after manual navigation
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? galleryImages.length - 1 : prevIndex - 1
    );
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % galleryImages.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section className="relative min-h-screen flex flex-col lg:flex-row items-stretch overflow-hidden">
      {/* Left Section - Text Content */}
      <div className="w-full lg:w-[40%] bg-white flex items-center px-6 lg:px-12 py-12 lg:py-20 z-10 min-h lg:min-h-screen pt-24 lg:pt-20">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1E293B] mb-6 leading-tight">
            Build, Customize & Manage Events Easily
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
            Our platform simplifies the entire event lifecycle for organizers, from creating beautiful event pages to managing attendees and ticketing seamlessly.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={() => setIsRegisterModalOpen(true)}
              className="bg-primary-green text-white hover:bg-primary-green-dark px-8 py-4 text-lg font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              aria-label="Register"
            >
              Register
            </Button>
            <Link href="#features">
              <Button 
                className="bg-white text-[#1E293B] hover:bg-gray-50 px-8 py-4 text-lg font-semibold rounded-lg border-2 border-gray-300 transition-all duration-200"
                aria-label="Learn more about EventHub"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Right Section - Image Carousel */}
      <div className="w-full lg:w-[60%] relative h-full lg:h-screen ">
        {/* Image Container */}
        <div className="relative w-full h-full overflow-hidden">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={image}
                alt={`Event ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-black/20"></div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
          <button
            onClick={goToPrevious}
            className="bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {galleryImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div 
            ref={modalRef}
            className="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full mx-4 relative"
          >
            <button
              onClick={() => {
                setIsRegisterModalOpen(false);
                setSelectedType(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#1E293B] mb-2">Register as</h2>
              <p className="text-gray-600">choose a plan</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Client Card */}
              <div
                onClick={() => setSelectedType('client')}
                className={`relative p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  selectedType === 'client'
                    ? 'border-primary-green bg-primary-green/5'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                {selectedType === 'client' && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-primary-green rounded-full p-1">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-[#1E293B] mb-2">CLIENT</h3>
                </div>
              </div>

              {/* Attendee Card */}
              <div
                onClick={() => setSelectedType('attendee')}
                className={`relative p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  selectedType === 'attendee'
                    ? 'border-primary-green bg-primary-green/5'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                {selectedType === 'attendee' && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-primary-green rounded-full p-1">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-[#1E293B] mb-2">ATTENDEE</h3>
                </div>
              </div>
            </div>

            <Button
              onClick={() => {
                if (selectedType === 'client') {
                  router.push('/register');
                } else if (selectedType === 'attendee') {
                  router.push('/events');
                }
                setIsRegisterModalOpen(false);
                setSelectedType(null);
              }}
              disabled={!selectedType}
              className="w-full bg-primary-green text-white hover:bg-primary-green-dark px-6 py-3 text-base font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Enter
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}

