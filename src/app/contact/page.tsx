'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, ChevronDown, Send } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubjectOpen, setIsSubjectOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const subjects = [
    'General Inquiry',
    'Feature Request',
    'Pricing Question',
    'Technical Support',
    'Partnership',
    'Demo Request',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }, 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left Column - Contact Form */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#1E293B] mb-4">
              Get in touch
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              We're here to help. Whether you have questions about features, pricing, or need a demo, chat with our event experts.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-primary-green focus:outline-none transition-colors text-[#1E293B]"
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-primary-green focus:outline-none transition-colors text-[#1E293B]"
                  required
                />
              </div>

              {/* Subject Dropdown */}
              <div className="relative">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsSubjectOpen(!isSubjectOpen)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-primary-green focus:outline-none transition-colors text-left flex items-center justify-between text-[#1E293B] bg-white"
                  >
                    <span className={formData.subject ? 'text-[#1E293B]' : 'text-gray-400'}>
                      {formData.subject || 'Select a topic'}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isSubjectOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isSubjectOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setIsSubjectOpen(false)}
                      />
                      <div className="absolute z-20 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg overflow-hidden">
                        {subjects.map((subject) => (
                          <button
                            key={subject}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, subject });
                              setIsSubjectOpen(false);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors text-[#1E293B]"
                          >
                            {subject}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <input
                  type="hidden"
                  name="subject"
                  value={formData.subject}
                  required
                />
              </div>

              {/* Message Textarea */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us how we can help..."
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-primary-green focus:outline-none transition-colors resize-none text-[#1E293B]"
                  required
                />
              </div>

              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  Message sent successfully! We'll get back to you soon.
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-green hover:bg-primary-green-dark text-white px-6 py-3 text-lg font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  'Sending...'
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Right Column - Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-[#1E293B] mb-8">
              Contact Information
            </h2>

            <div className="space-y-8">
              {/* Email */}
              <div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary-green/10 p-3 rounded-lg flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary-green" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email us</p>
                    <p className="font-semibold text-[#1E293B] mb-1">support@eventhub.com</p>
                    <p className="text-gray-600">sales@eventhub.com</p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary-green/10 p-3 rounded-lg flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary-green" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Call us</p>
                    <p className="font-semibold text-[#1E293B] mb-1">+1 (555) 000-0000</p>
                    <p className="text-gray-600">Mon-Fri from 8am to 5pm</p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary-green/10 p-3 rounded-lg flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary-green" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Visit us</p>
                    <p className="font-semibold text-[#1E293B] mb-1">123 Event St, Tech Park</p>
                    <p className="text-gray-600">San Francisco, CA 94107</p>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="mt-8">
                <div className="w-full h-64 bg-gray-200 rounded-lg border-2 border-gray-300 flex items-center justify-center relative overflow-hidden">
                  {/* Map-like pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-gray-400 rounded-full"></div>
                    {/* Grid lines */}
                    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#9CA3AF" strokeWidth="1"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                  </div>
                  {/* Location Pin */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="bg-primary-green p-3 rounded-full shadow-lg mb-2">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm font-medium text-gray-700 bg-white px-3 py-1 rounded shadow">HQ Location</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

