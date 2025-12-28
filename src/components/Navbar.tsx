'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Bell, User, X, Check } from 'lucide-react';
import Image from 'next/image';
import Button from './ui/Button';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<'client' | 'attendee' | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/auth/login');
  };

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

  const isAuthPage = pathname?.startsWith('/auth');
  const isPublicPage = pathname?.startsWith('/events/') && !pathname?.startsWith('/dashboard');
  const isEventsPage = pathname === '/events';
  const isLoginPage = pathname === '/auth/login';
  const isRegisterPage = pathname === '/register';
  const isContactPage = pathname === '/contact';
  const isFeaturesPage = pathname === '/features';
  const isPricingPage = pathname === '/pricing';
  const isDashboardPage = pathname?.startsWith('/dashboard');
  const isAdminPage = pathname?.startsWith('/admin');
  const isHomePage = pathname === '/';

  const RegisterModal = () => {
    if (!isRegisterModalOpen) return null;

    const handleEnter = () => {
      if (selectedType === 'client') {
        router.push('/register');
      } else if (selectedType === 'attendee') {
        router.push('/events');
      }
      setIsRegisterModalOpen(false);
      setSelectedType(null);
    };

    return (
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
            onClick={handleEnter}
            disabled={!selectedType}
            className="w-full bg-primary-green text-white hover:bg-primary-green-dark px-6 py-3 text-base font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enter
          </Button>
        </div>
      </div>
    );
  };

  if (isLoginPage) {
    return (
      <>
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white" role="navigation" aria-label="Main navigation">
          <div className="w-full px-6 py-4 shadow-sm">
            <div className="flex justify-end items-center gap-6">
              <Link href="/register" className="text-gray-700 hover:text-black transition-colors font-medium">
                Don't have an account? <span className="text-black font-semibold">Register</span>
              </Link>
              <Link href="/" className="text-gray-700 hover:text-black transition-colors font-medium">
                Back to Homepage
              </Link>
            </div>
          </div>
        </nav>
        <RegisterModal />
      </>
    );
  }

  if (isRegisterPage) {
    return (
      <>
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white" role="navigation" aria-label="Main navigation">
          <div className="w-full px-6 py-4">
            <div className="flex justify-end items-center gap-6">
              <Link href="/auth/login" className="text-gray-700 hover:text-black transition-colors font-medium">
                Already have an account? <span className="text-black font-semibold">Login</span>
              </Link>
              <Link href="/" className="text-gray-700 hover:text-black transition-colors font-medium">
                Back to Homepage
              </Link>
            </div>
          </div>
        </nav>
        <RegisterModal />
      </>
    );
  }

  if (isEventsPage) {
    return (
      <>
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm" role="navigation" aria-label="Main navigation">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <Link 
                href="/" 
                className="flex items-center gap-3 text-2xl font-bold hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 focus:ring-offset-white rounded"
                aria-label="EventHub Home"
              >
                <Image 
                  src="/logo.png" 
                  alt="EventHub Logo" 
                  width={48} 
                  height={48} 
                  className="h-12 w-auto"
                />
                <span className="text-[#1E293B] font-semibold">EventHub</span>
              </Link>
              <div className="flex items-center gap-8">
                <Link href="/events" className="text-primary-green font-semibold transition-colors">
                  Events
                </Link>
                <Link href="/dashboard/tickets" className="text-[#1E293B] hover:text-black transition-colors font-medium">
                  My Tickets
                </Link>
                <Link href="/auth/login">
                  <Button 
                    className="bg-white text-[#1E293B] hover:bg-gray-50 px-6 py-2 text-base font-semibold rounded-lg border border-gray-200 transition-all duration-200"
                    aria-label="Login"
                  >
                    Login
                  </Button>
                </Link>
                <Button 
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="bg-primary-green text-white hover:bg-primary-green-dark px-6 py-2 text-base font-semibold rounded-lg transition-all duration-200"
                  aria-label="Register"
                >
                  Register
                </Button>
              </div>
            </div>
          </div>
        </nav>
        <RegisterModal />
      </>
    );
  }

  if (isContactPage) {
    return (
      <>
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm" role="navigation" aria-label="Main navigation">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <Link 
                href="/" 
                className="flex items-center gap-3 text-2xl font-bold hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 focus:ring-offset-white rounded"
                aria-label="EventHub Home"
              >
                <Image 
                  src="/logo.png" 
                  alt="EventHub Logo" 
                  width={48} 
                  height={48} 
                  className="h-12 w-auto"
                />
                <span className="text-[#1E293B] font-semibold">EventHub</span>
              </Link>
              <div className="flex items-center gap-8">
                <Link href="/features" className="text-[#1E293B] hover:text-black transition-colors font-medium">Features</Link>
                <Link href="/pricing" className="text-[#1E293B] hover:text-black transition-colors font-medium">Pricing</Link>
                <Link 
                  href="/contact" 
                  className="text-primary-green font-semibold transition-colors"
                >
                  Contact
                </Link>
                <Link href="/auth/login">
                  <Button 
                    className="bg-white text-[#1E293B] hover:bg-gray-50 px-6 py-2 text-base font-semibold rounded-lg border border-gray-200 transition-all duration-200"
                    aria-label="Login"
                  >
                    Login
                  </Button>
                </Link>
                <Button 
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="bg-primary-green text-white hover:bg-primary-green-dark px-6 py-2 text-base font-semibold rounded-lg transition-all duration-200"
                  aria-label="Register"
                >
                  Register
                </Button>
              </div>
            </div>
          </div>
        </nav>
        <RegisterModal />
      </>
    );
  }

  if (isFeaturesPage) {
    return (
      <>
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm" role="navigation" aria-label="Main navigation">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <Link 
                href="/" 
                className="flex items-center gap-3 text-2xl font-bold hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 focus:ring-offset-white rounded"
                aria-label="EventHub Home"
              >
                <Image 
                  src="/logo.png" 
                  alt="EventHub Logo" 
                  width={48} 
                  height={48} 
                  className="h-12 w-auto"
                />
                <span className="text-[#1E293B] font-semibold">EventHub</span>
              </Link>
              <div className="flex items-center gap-8">
                <Link href="/features" className="text-primary-green font-semibold transition-colors">Features</Link>
                <Link href="/pricing" className="text-[#1E293B] hover:text-black transition-colors font-medium">Pricing</Link>
                <Link 
                  href="/contact" 
                  className="text-[#1E293B] hover:text-black transition-colors font-medium"
                >
                  Contact
                </Link>
                <Link href="/auth/login">
                  <Button 
                    className="bg-white text-[#1E293B] hover:bg-gray-50 px-6 py-2 text-base font-semibold rounded-lg border border-gray-200 transition-all duration-200"
                    aria-label="Login"
                  >
                    Login
                  </Button>
                </Link>
                <Button 
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="bg-primary-green text-white hover:bg-primary-green-dark px-6 py-2 text-base font-semibold rounded-lg transition-all duration-200"
                  aria-label="Register"
                >
                  Register
                </Button>
              </div>
            </div>
          </div>
        </nav>
        <RegisterModal />
      </>
    );
  }

  if (isPricingPage) {
    return (
      <>
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm" role="navigation" aria-label="Main navigation">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <Link 
                href="/" 
                className="flex items-center gap-3 text-2xl font-bold hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 focus:ring-offset-white rounded"
                aria-label="EventHub Home"
              >
                <Image 
                  src="/logo.png" 
                  alt="EventHub Logo" 
                  width={48} 
                  height={48} 
                  className="h-12 w-auto"
                />
                <span className="text-[#1E293B] font-semibold">EventHub</span>
              </Link>
              <div className="flex items-center gap-8">
                <Link href="/features" className="text-[#1E293B] hover:text-black transition-colors font-medium">Features</Link>
                <Link href="/pricing" className="text-primary-green font-semibold transition-colors">Pricing</Link>
                <Link 
                  href="/contact" 
                  className="text-[#1E293B] hover:text-black transition-colors font-medium"
                >
                  Contact
                </Link>
                <Link href="/auth/login">
                  <Button 
                    className="bg-white text-[#1E293B] hover:bg-gray-50 px-6 py-2 text-base font-semibold rounded-lg border border-gray-200 transition-all duration-200"
                    aria-label="Login"
                  >
                    Login
                  </Button>
                </Link>
                <Button 
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="bg-primary-green text-white hover:bg-primary-green-dark px-6 py-2 text-base font-semibold rounded-lg transition-all duration-200"
                  aria-label="Register"
                >
                  Register
                </Button>
              </div>
            </div>
          </div>
        </nav>
        <RegisterModal />
      </>
    );
  }

  if (isAuthPage || isPublicPage) {
    return (
      <>
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm" role="navigation" aria-label="Main navigation">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <Link 
                href="/" 
                className="flex items-center gap-3 text-2xl font-bold hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 focus:ring-offset-white rounded"
                aria-label="EventHub Home"
              >
                <Image 
                  src="/logo.png" 
                  alt="EventHub Logo" 
                  width={48} 
                  height={48} 
                  className="h-12 w-auto"
                />
                <span className="text-[#1E293B] font-semibold">EventHub</span>
              </Link>
              <div className="flex items-center gap-6">
                <Link href="/" className="text-[#1E293B] hover:text-black transition-colors font-medium">
                  Homepage
                </Link>
                <Link href="/auth/login" className="text-[#1E293B] hover:text-black transition-colors font-medium">
                  Log In
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <RegisterModal />
      </>
    );
  }

  if (isHomePage) {
    return (
      <>
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/50 backdrop-blur-sm text-gray-900 shadow-sm" role="navigation" aria-label="Main navigation">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <Link 
                href="/" 
                className="flex items-center gap-3 text-2xl font-bold hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 focus:ring-offset-white rounded"
                aria-label="EventHub Home"
              >
                <Image 
                  src="/logo.png" 
                  alt="EventHub Logo" 
                  width={48} 
                  height={48} 
                  className="h-12 w-auto"
                />
                <span className="text-[#1E293B] font-semibold">EventHub</span>
              </Link>
              <div className="flex items-center gap-8">
                <Link href="/features" className={`transition-colors font-medium ${isFeaturesPage ? 'text-primary-green' : 'text-[#1E293B] hover:text-black'}`}>Features</Link>
                <Link href="/pricing" className="text-[#1E293B] hover:text-black transition-colors font-medium">Pricing</Link>
                <Link 
                  href="/contact" 
                  className={`transition-colors font-medium ${isContactPage ? 'text-primary-green' : 'text-[#1E293B] hover:text-black'}`}
                >
                  Contact
                </Link>
                <Link href="/events" className="text-[#1E293B] hover:text-black transition-colors font-medium">Upcoming Events</Link>
                <Link href="/auth/login">
                  <Button 
                    className="bg-white text-[#1E293B] hover:bg-gray-50 px-6 py-2 text-base font-semibold rounded-lg border border-gray-200 transition-all duration-200"
                    aria-label="Login"
                  >
                    Login
                  </Button>
                </Link>
                <Button 
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="bg-primary-green text-white hover:bg-primary-green-dark px-6 py-2 text-base font-semibold rounded-lg transition-all duration-200"
                  aria-label="Register"
                >
                  Register
                </Button>
              </div>
            </div>
          </div>
        </nav>
        <RegisterModal />
      </>
    );
  }

  // Hide navbar on dashboard and admin pages (they have their own navigation or don't need it)
  if (isDashboardPage || isAdminPage) {
    return <RegisterModal />;
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-primary-green text-black shadow-md border-b border-primary-green-dark" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link 
              href="/" 
              className="flex items-center gap-3 text-2xl font-bold hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-primary-green rounded"
              aria-label="EventHub Home"
            >
              <Image 
                src="/logo.png" 
                alt="EventHub Logo" 
                width={56} 
                height={56} 
                className="w-14 h-14 object-contain"
                style={{ background: 'transparent' }}
              />
              <span className="font-['Playfair_Display']">EventHub</span>
            </Link>

            <div className="flex items-center gap-4">
              <Button 
                onClick={handleLogout}
                className="bg-white/20 border border-white/30 text-black hover:bg-white/30 flex items-center gap-2 font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-primary-green"
                size="sm"
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <RegisterModal />
    </>
  );
}
