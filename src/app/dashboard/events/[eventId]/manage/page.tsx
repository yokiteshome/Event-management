'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Calendar, Upload, X, Save } from 'lucide-react';
import Button from '@/components/ui/Button';

interface Event {
  _id: string;
  name: string;
  description?: string;
  date: string;
  startDate?: string;
  endDate?: string;
  location: string;
  capacity: number;
  bannerImage?: string;
  status?: 'ACTIVE' | 'CLOSED' | 'CANCELLED';
}

export default function ManageEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: '',
    capacity: 1000,
    status: 'ACTIVE' as 'ACTIVE' | 'CLOSED' | 'CANCELLED',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [bannerImage, setBannerImage] = useState<File | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${eventId}`);
        if (res.status === 403) {
          router.push('/auth/login');
          return;
        }
        if (!res.ok) {
          throw new Error('Failed to fetch event');
        }
        const data = await res.json();
        const eventData = data.event;
        setEvent(eventData);

        // Format dates for form inputs
        const startDate = eventData.startDate ? new Date(eventData.startDate) : null;
        const endDate = eventData.endDate ? new Date(eventData.endDate) : null;
        const mainDate = new Date(eventData.date);

        setFormData({
          name: eventData.name || '',
          description: eventData.description || '',
          startDate: startDate ? startDate.toISOString().split('T')[0] : mainDate.toISOString().split('T')[0],
          startTime: startDate ? startDate.toTimeString().slice(0, 5) : '',
          endDate: endDate ? endDate.toISOString().split('T')[0] : '',
          endTime: endDate ? endDate.toTimeString().slice(0, 5) : '',
          location: eventData.location || '',
          capacity: eventData.capacity || 1000,
          status: eventData.status || 'ACTIVE',
        });

        if (eventData.bannerImage) {
          setImagePreview(eventData.bannerImage);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load event');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setBannerImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      // Combine date and time for start and end
      const startDateTime = formData.startDate && formData.startTime 
        ? new Date(`${formData.startDate}T${formData.startTime}`).toISOString()
        : formData.startDate 
        ? new Date(formData.startDate).toISOString()
        : undefined;
      
      const endDateTime = formData.endDate && formData.endTime 
        ? new Date(`${formData.endDate}T${formData.endTime}`).toISOString()
        : formData.endDate 
        ? new Date(formData.endDate).toISOString()
        : undefined;

      // Use start date as the main date for backward compatibility
      const date = startDateTime || formData.startDate;

      // Convert banner image to base64 if a new file was selected
      let bannerImageBase64: string | undefined;
      if (bannerImage) {
        const reader = new FileReader();
        bannerImageBase64 = await new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(bannerImage);
        });
      } else if (imagePreview && imagePreview.startsWith('data:')) {
        // Keep existing image if no new file was selected
        bannerImageBase64 = imagePreview;
      }

      const updatePayload: any = {
        name: formData.name,
        description: formData.description,
        date: date,
        startDate: startDateTime,
        endDate: endDateTime,
        location: formData.location,
        capacity: formData.capacity,
        status: formData.status,
      };

      if (bannerImageBase64 !== undefined) {
        updatePayload.bannerImage = bannerImageBase64;
      }

      const res = await fetch(`/api/events/${eventId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update event');
      }

      setSuccess('Event updated successfully!');
      setTimeout(() => {
        router.push('/dashboard/events');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to update event');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading event...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl text-red-600">Event not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Manage Event</h1>
          <p className="text-gray-600 text-lg">
            Edit your event details, upload a banner, or close the event.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Status */}
          <div>
            <label htmlFor="event-status" className="block text-sm font-medium text-gray-700 mb-2">
              Event Status
            </label>
            <select
              id="event-status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'ACTIVE' | 'CLOSED' | 'CANCELLED' })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-black focus:outline-none transition-colors"
            >
              <option value="ACTIVE">Active</option>
              <option value="CLOSED">Closed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <p className="mt-1 text-sm text-gray-500">
              {formData.status === 'CLOSED' && 'Event is closed and no longer accepting registrations.'}
              {formData.status === 'CANCELLED' && 'Event has been cancelled.'}
              {formData.status === 'ACTIVE' && 'Event is active and accepting registrations.'}
            </p>
          </div>

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

          {/* Capacity */}
          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
              Capacity
            </label>
            <input
              id="capacity"
              type="number"
              min="1"
              placeholder="Maximum number of attendees"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1000 })}
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
              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-black transition-colors relative"
              onClick={() => document.getElementById('banner-image-input')?.click()}
            >
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Banner preview" className="max-h-64 mx-auto rounded-lg" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage();
                    }}
                    className="mt-4 text-sm text-gray-600 hover:text-black flex items-center gap-2 mx-auto"
                  >
                    <X className="w-4 h-4" />
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

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              type="button"
              onClick={() => router.push('/dashboard/events')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-primary-green hover:bg-primary-green-dark text-white flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

