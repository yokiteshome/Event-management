'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, Upload } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: '',
    ownerFullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    companyDocument: null as File | null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('companyName', formData.companyName);
      formDataToSend.append('ownerFullName', formData.ownerFullName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phoneNumber', formData.phoneNumber);
      formDataToSend.append('password', formData.password);
      if (formData.companyDocument) {
        formDataToSend.append('companyDocument', formData.companyDocument);
      }

      const res = await fetch('/api/auth/register-owner', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf' || file.type.includes('word') || file.type.includes('image')) {
        setFormData({ ...formData, companyDocument: file });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, companyDocument: e.target.files[0] });
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white flex border border-black">
        <div className="hidden lg:block lg:w-[45%] relative overflow-hidden">
          <Image 
            src="/login.register.jpg" 
            alt="Event Platform" 
            fill
            className="object-cover"
            priority
          />
          {/* Logo overlay */}
          <div className="absolute top-8 left-8 flex items-center gap-3 z-10">
            <Image 
              src="/logo.png" 
              alt="EventPlatform Logo" 
              width={48} 
              height={48} 
              className="h-12 w-auto"
            />
            <span className="text-white text-xl font-semibold">EventPlatform</span>
          </div>
        </div>
        <div className="w-full lg:w-[55%] bg-white flex items-center justify-center px-6">
          <div className="bg-white p-8 text-center max-w-md">
            <div className="bg-primary-green/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-primary-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-black mb-4">Registration Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your account is pending admin approval. You'll be redirected to login...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex border border-black">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-[45%] relative overflow-hidden">
        <Image 
          src="/login.register.jpg" 
          alt="Event Platform" 
          fill
          className="object-cover"
          priority
        />
        {/* Logo overlay */}
        <div className="absolute top-8 left-8 flex items-center gap-3 z-10">
          <Image 
            src="/logo.png" 
            alt="EventPlatform Logo" 
            width={48} 
            height={48} 
            className="h-12 w-auto"
          />
          <span className="text-white text-xl font-semibold">EventPlatform</span>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-[55%] bg-white flex flex-col">
        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <h1 className="text-4xl font-bold text-black mb-8 text-center">Register Your Company</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  placeholder="Enter your company name"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-primary-green focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="ownerFullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Owner Full Name
                </label>
                <input
                  type="text"
                  id="ownerFullName"
                  placeholder="Enter your full name"
                  value={formData.ownerFullName}
                  onChange={(e) => setFormData({ ...formData, ownerFullName: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-primary-green focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-primary-green focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  placeholder="Enter your phone number"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-primary-green focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 pr-10 rounded-lg border-2 border-gray-300 focus:border-primary-green focus:outline-none transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Company Document
                </label>
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive ? 'border-primary-green bg-gray-50' : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <input
                    type="file"
                    id="companyDocument"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="companyDocument" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-700 mx-auto mb-3" />
                    <p className="text-sm text-gray-700 mb-1">
                      <span className="text-black font-medium cursor-pointer hover:underline underline">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF, DOCX, or JPG (max. 5MB)</p>
                    {formData.companyDocument && (
                      <p className="text-sm text-gray-600 mt-2">{formData.companyDocument.name}</p>
                    )}
                  </label>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-green hover:bg-primary-green-dark text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Registration'}
              </button>
            </form>

            <p className="mt-6 text-sm text-gray-500 text-center">
              Your account will be reviewed by an admin. Approval will be sent via SMS or email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

