'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { QrCode, Shield, Users, X, Globe, Mail, Check } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function FeaturesPage() {
  const router = useRouter();
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<'client' | 'attendee' | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1E293B] mb-6 text-center">
            Powerful Tools for Modern Event Hosts
          </h1>
          <p className="text-lg md:text-xl text-gray-600 text-center max-w-3xl mx-auto leading-relaxed">
            Everything you need to register, manage, and analyze your events efficiently. Streamline operations from start to finish.
          </p>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E293B] mb-4">
              Core Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore the comprehensive suite of tools designed to make event management seamless, professional, and scalable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* QR Code Ticketing Card */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
              {/* Image Placeholder */}
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <QrCode className="w-16 h-16 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Image Placeholder</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary-green/10 p-2 rounded-lg">
                    <QrCode className="w-6 h-6 text-primary-green" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1E293B]">QR Code Ticketing</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Generate unique, secure QR codes for every attendee. Enable instant, contactless check-ins at your venue entrance.
                </p>
              </div>
            </div>

            {/* Admin Approval System Card */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
              {/* Image Placeholder */}
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Shield className="w-16 h-16 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Image Placeholder</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary-green/10 p-2 rounded-lg">
                    <Shield className="w-6 h-6 text-primary-green" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1E293B]">Admin Approval System</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Maintain full control over your guest list. Review detailed attendee profiles and approve registrations manually before tickets are issued.
                </p>
              </div>
            </div>

            {/* Attendee Management Card - Centered on bottom row */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow md:col-span-2 md:max-w-md md:mx-auto">
              {/* Image Placeholder */}
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Users className="w-16 h-16 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Image Placeholder</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary-green/10 p-2 rounded-lg">
                    <Users className="w-6 h-6 text-primary-green" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1E293B]">Attendee Management</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Track registrations, ticket sales, and check-in status in real-time. Export data and gain insights from a centralized dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E293B] mb-4">
            Ready to host your next event?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of event owners using our platform to create memorable experiences.
          </p>
          <Button
            onClick={() => setIsRegisterModalOpen(true)}
            className="bg-primary-green text-white hover:bg-primary-green-dark px-8 py-4 text-lg font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 mx-auto"
            aria-label="Get Started"
          >
            Get Started Free
          </Button>
        </div>
      </section>
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
    </div>
  );
}

