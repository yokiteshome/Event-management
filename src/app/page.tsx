import Link from 'next/link';
import { Calendar, QrCode, ArrowRight, Phone, Layout, Users, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import HeroSection from '@/components/HeroSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-white -mt-16">
      <HeroSection />

      <section id="features" className="bg-white py-20 px-6" aria-labelledby="features-heading">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 id="features-heading" className="text-4xl md:text-5xl font-bold text-[#1E293B] mb-4">
              Powerful Features to Elevate Your Events
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to create memorable and successful events, all in one place.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <article className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
              <div className="bg-primary-green w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <Layout className="w-7 h-7 text-white" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-[#1E293B] mb-3">Event Site Builder</h3>
              <p className="text-gray-600 leading-relaxed">
                Create beautiful, custom-branded event pages with our intuitive drag-and-drop builder. No coding required.
              </p>
            </article>

            <article className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
              <div className="bg-primary-green w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <QrCode className="w-7 h-7 text-white" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-[#1E293B] mb-3">QR Code Ticketing</h3>
              <p className="text-gray-600 leading-relaxed">
                Implement a seamless and secure digital check-in process with unique QR codes for every attendee.
              </p>
            </article>

            <article className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
              <div className="bg-primary-green w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle2 className="w-7 h-7 text-white" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-[#1E293B] mb-3">Admin Approval System</h3>
              <p className="text-gray-600 leading-relaxed">
                Maintain full control over your guest list by reviewing and approving attendee registrations before granting access.
              </p>
            </article>

            <article className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
              <div className="bg-primary-green w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-white" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-[#1E293B] mb-3">Attendee Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Effortlessly track, communicate with, and manage all your attendees from a single, centralized dashboard.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 px-6" aria-labelledby="about-heading">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 id="about-heading" className="text-4xl md:text-5xl font-bold text-[#1E293B] leading-tight">
                We Tackle The Most Challenging Event Management
              </h2>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                Excellence in event management begins with efficient organization, transparent processes, and innovative technology that serves the people. We have an insatiable curiosity about transformative trends challenging the status quo.
              </p>
              
              <div className="flex items-start gap-4 pt-4">
                <div className="bg-primary-green p-3 rounded-lg">
                  <Phone className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#1E293B]">012345678</p>
                  <p className="text-gray-600">Call Us Anytime</p>
                </div>
              </div>
              
              <Link href="/register">
                <Button 
                  className="bg-primary-green text-white hover:bg-primary-green-dark px-8 py-4 text-lg font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 w-fit"
                  aria-label="Get free estimate"
                >
                  Get Free Estimate
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </Button>
              </Link>
            </div>

            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[500px] h-[500px] rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-900/20 via-purple-900/20 to-green-900/20"></div>
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="relative z-10 text-center">
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 mb-4 shadow-lg">
                      <Calendar className="w-16 h-16 text-primary-green mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-[#1E293B] mb-2">EventHub</h3>
                      <p className="text-gray-600">Professional Event Management</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute inset-0">
                  {[
                    { left: '5%', top: '10%' },
                    { left: '15%', top: '30%' },
                    { left: '25%', top: '5%' },
                    { left: '35%', top: '50%' },
                    { left: '45%', top: '20%' },
                    { left: '55%', top: '40%' },
                    { left: '65%', top: '15%' },
                    { left: '75%', top: '35%' },
                    { left: '85%', top: '25%' },
                    { left: '95%', top: '45%' },
                    { left: '10%', top: '60%' },
                    { left: '20%', top: '80%' },
                    { left: '30%', top: '70%' },
                    { left: '40%', top: '90%' },
                    { left: '50%', top: '65%' },
                    { left: '60%', top: '85%' },
                    { left: '70%', top: '75%' },
                    { left: '80%', top: '95%' },
                    { left: '90%', top: '55%' },
                    { left: '12%', top: '45%' },
                  ].map((pos, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-40"
                      style={{
                        left: pos.left,
                        top: pos.top,
                      }}
                    />
                  ))}
                </div>
                
                <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg z-20">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-5 h-5 text-black" />
                    <span className="text-2xl font-bold text-[#1E293B]">300+</span>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">Active Events</p>
                  <div className="flex gap-1 mt-2">
                    <div className="w-2 h-2 bg-primary-green rounded-full"></div>
                    <div className="w-2 h-2 bg-primary-green rounded-full"></div>
                    <div className="w-2 h-2 bg-primary-green rounded-full"></div>
                  </div>
                </div>
                
                <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg z-20">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-primary-green" />
                    <span className="text-2xl font-bold text-[#1E293B]">5000+</span>
                  </div>
                  <p className="text-sm text-gray-600 font-medium mb-2">Successful Events</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Live Monitoring</span>
                    <div className="flex gap-1">
                      <div className="w-1 h-4 bg-green-500 rounded"></div>
                      <div className="w-1 h-6 bg-green-500 rounded"></div>
                      <div className="w-1 h-3 bg-green-500 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
