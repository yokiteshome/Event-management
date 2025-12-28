'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Upload } from 'lucide-react';

export default function CreateEventPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: '',
    bannerImage: null as File | null,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, bannerImage: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Combine date and time for start and end
      const startDateTime = formData.startDate && formData.startTime 
        ? new Date(`${formData.startDate}T${formData.startTime}`).toISOString()
        : formData.startDate 
        ? new Date(formData.startDate).toISOString()
        : '';
      
      const endDateTime = formData.endDate && formData.endTime 
        ? new Date(`${formData.endDate}T${formData.endTime}`).toISOString()
        : formData.endDate 
        ? new Date(formData.endDate).toISOString()
        : '';

      // Use start date as the main date for backward compatibility
      const date = startDateTime || formData.startDate;

      const res = await fetch('/api/events/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          date: date,
          startDate: startDateTime,
          endDate: endDateTime,
          location: formData.location,
          capacity: 1000, // Default capacity, can be made a field later
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create event');
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Create a New Event</h1>
          <p className="text-gray-600 text-lg">
            Start by filling out the basic details. You can customize the look and feel in the next step.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Title */}
          <div>
            <label htmlFor="event-title" className="block text-sm font-medium text-gray-700 mb-2">
              Event Title
            </label>
            <input
              id="event-title"
              type="text"
              placeholder="Enter the name of your event"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-black focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Event Description */}
          <div>
            <label htmlFor="event-description" className="block text-sm font-medium text-gray-700 mb-2">
              Event Description
            </label>
            <textarea
              id="event-description"
              placeholder="Tell your attendees about the event"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-black focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Start Date & Time and End Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="start-date-time" className="block text-sm font-medium text-gray-700 mb-2">
                Start Date & Time
              </label>
              <div className="relative">
                <input
                  id="start-date-time"
                  type="datetime-local"
                  value={formData.startDate && formData.startTime ? `${formData.startDate}T${formData.startTime}` : formData.startDate}
                  onChange={(e) => {
                    const [date, time] = e.target.value.split('T');
                    setFormData({ ...formData, startDate: date || '', startTime: time || '' });
                  }}
                  className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 focus:border-black focus:outline-none transition-colors"
                  required
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label htmlFor="end-date-time" className="block text-sm font-medium text-gray-700 mb-2">
                End Date & Time
              </label>
              <div className="relative">
                <input
                  id="end-date-time"
                  type="datetime-local"
                  value={formData.endDate && formData.endTime ? `${formData.endDate}T${formData.endTime}` : formData.endDate}
                  onChange={(e) => {
                    const [date, time] = e.target.value.split('T');
                    setFormData({ ...formData, endDate: date || '', endTime: time || '' });
                  }}
                  className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 focus:border-black focus:outline-none transition-colors"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Venue / Location */}
          <div>
            <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-2">
              Venue / Location
            </label>
            <input
              id="venue"
              type="text"
              placeholder="e.g., Grand Hyatt Hotel or Online"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-black focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Event Banner Image */}
          <div>
            <label htmlFor="banner-image" className="block text-sm font-medium text-gray-700 mb-2">
              Event Banner Image
            </label>
            <div
              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-black transition-colors"
              onClick={() => document.getElementById('banner-image-input')?.click()}
            >
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Banner preview" className="max-h-64 mx-auto rounded-lg" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImagePreview(null);
                      setFormData({ ...formData, bannerImage: null });
                    }}
                    className="mt-4 text-sm text-gray-600 hover:text-black"
                  >
                    Remove image
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="w-12 h-12 text-black mx-auto mb-4" />
                  <p className="text-black font-medium mb-1">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">PNG, JPG or GIF (Recommended 1200x600px)</p>
                </div>
              )}
              <input
                id="banner-image-input"
                type="file"
                accept="image/png,image/jpeg,image/gif"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-green hover:bg-primary-green-dark text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
