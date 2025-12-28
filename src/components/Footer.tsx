'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

function CurrentYear() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return <span suppressHydrationWarning>{year || new Date().getFullYear()}</span>;
}

export default function Footer() {
  return (
    <footer className="py-16 mt-auto" style={{ backgroundColor: '#90cf8e' }} role="contentinfo">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* EventHub Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image 
                src="/logo.png" 
                alt="EventHub Logo" 
                width={48} 
                height={48} 
                className="h-12 w-auto"
              />
              <span className="text-xl font-bold text-black">EventHub</span>
            </div>
            <p className="text-sm text-gray-800 leading-relaxed mb-4">
              Simplifying event management for professionals worldwide.
            </p>
            <div className="flex items-center gap-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-800 hover:text-black transition-colors duration-200"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-800 hover:text-black transition-colors duration-200"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-black font-bold mb-6 text-base">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link 
                  href="#about" 
                  className="text-gray-800 hover:text-black transition-colors duration-200"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  href="#careers" 
                  className="text-gray-800 hover:text-black transition-colors duration-200"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link 
                  href="#blog" 
                  className="text-gray-800 hover:text-black transition-colors duration-200"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link 
                  href="#press" 
                  className="text-gray-800 hover:text-black transition-colors duration-200"
                >
                  Press
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-black font-bold mb-6 text-base">Support</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link 
                  href="#help" 
                  className="text-gray-800 hover:text-black transition-colors duration-200"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link 
                  href="#terms" 
                  className="text-gray-800 hover:text-black transition-colors duration-200"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  href="#privacy" 
                  className="text-gray-800 hover:text-black transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="#cookies" 
                  className="text-gray-800 hover:text-black transition-colors duration-200"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-black font-bold mb-6 text-base">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="text-gray-800">
                123 Event St, Tech Park
              </li>
              <li className="text-gray-800">
                San Francisco, CA 94107
              </li>
              <li>
                <a 
                  href="mailto:support@eventhub.com" 
                  className="text-gray-800 hover:text-black transition-colors duration-200"
                >
                  support@eventhub.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-300 pt-8">
          <p className="text-sm text-gray-800 text-center">
            © <CurrentYear /> EventHub Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
