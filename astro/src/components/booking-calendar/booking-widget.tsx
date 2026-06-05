import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import type { CalcomBookingResponse } from '../../types/booking';

type BookingStep = 'calendar' | 'form' | 'success' | 'reschedule' | 'cancelled';

export interface ServiceOption {
  id: string;
  name: string;
  eventTypeId: string;
  duration?: number;
  description?: string;
}

interface BookingWidgetProps {
  eventTypeId?: string;
  services?: ServiceOption[];
  initialServiceId?: string;
  eventLength?: number;
  title?: string;
  description?: string;
  showHeader?: boolean;
}

const BookingWidget: React.FC<BookingWidgetProps> = ({
  eventTypeId,
  services,
  initialServiceId,
  eventLength = 30,
  title = 'Schedule Your Car Detailing',
  description,
  showHeader = false,
}) => {
  const [currentStep, setCurrentStep] = useState<BookingStep>('calendar');
  const [selectedService, setSelectedService] = useState<ServiceOption | null>(
    (initialServiceId && services?.find((s) => s.id === initialServiceId)) ||
      services?.[0] ||
      null
  );
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [booking, setBooking] = useState<CalcomBookingResponse | null>(null);
  const [userTimezone, setUserTimezone] = useState<string>('');

  useEffect(() => {
    const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setUserTimezone(browserTimezone);
  }, []);

  const handleServiceChange = (service: ServiceOption) => {
    setSelectedService(service);
  };

  const handleSlotSelect = (slot: string) => {
    setSelectedSlot(slot);
    setCurrentStep('form');
  };

  const handleBookingSuccess = (bookingData: CalcomBookingResponse) => {
    setBooking(bookingData);
    setCurrentStep('success');
  };

  const handleBackToCalendar = () => {
    setSelectedSlot(null);
    setCurrentStep('calendar');
  };

  const handleNewBooking = () => {
    setSelectedSlot(null);
    setBooking(null);
    setCurrentStep('calendar');
  };

  const handleReschedule = () => {
    setCurrentStep('reschedule');
  };

  const handleCancel = () => {
    if (!booking?.uid) return;
    // Cancel logic would go here
  };

  const handleFormSubmit = async (formData: FormData) => {
    if (!selectedSlot) return;

    const bookingData = {
      eventTypeId: selectedService?.eventTypeId || eventTypeId,
      start: selectedSlot,
      attendee: {
        name: formData.get('name'),
        email: formData.get('email'),
        timeZone: userTimezone,
      },
    };

    try {
      const response = await fetch('/api/booking-calendar/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) throw new Error('Failed to create booking');

      const result = await response.json();
      const bookingResult = result.data || result;
      handleBookingSuccess(bookingResult);
    } catch (error) {
      console.error('Booking error:', error);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      {currentStep === 'calendar' && (
        <div className="bg-card rounded-2xl border border-border shadow p-4 sm:p-6">
          <div className="mb-6">
            {showHeader && (
              <div className="mb-6">
                <h2 className="text-xl font-bold font-heading">{title}</h2>
                {description && (
                  <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                )}
              </div>
            )}
            {services && services.length > 0 && (
              <div className="mb-4">
                <label className="text-sm font-medium mb-2 block">Select Package</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => handleServiceChange(service)}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        selectedService?.id === service.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="font-medium text-sm">{service.name}</div>
                      <div className="text-xs text-muted-foreground">{service.duration} min</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="text-center py-8 text-muted-foreground">
            <p>Calendar component loading...</p>
            <p className="text-sm mt-2">Select a date and time slot</p>
          </div>
        </div>
      )}

      {currentStep === 'form' && selectedSlot && (
        <div className="bg-card rounded-2xl border border-border shadow p-4 sm:p-6">
          <button onClick={handleBackToCalendar} className="flex items-center gap-2 mb-4 text-sm text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" /> Back
          </button>
          <h2 className="text-xl font-bold mb-6">Complete Your Booking</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleFormSubmit(formData);
          }} className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1">Name</label>
              <input name="name" required className="w-full border border-input rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Email</label>
              <input name="email" type="email" required className="w-full border border-input rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Phone</label>
              <input name="phone" type="tel" required className="w-full border border-input rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Notes (optional)</label>
              <textarea name="notes" className="w-full border border-input rounded-md px-3 py-2 min-h-[80px]" />
            </div>
            <Button type="submit" className="w-full" size="lg">Confirm Booking</Button>
          </form>
        </div>
      )}

      {currentStep === 'success' && booking && (
        <div className="bg-card rounded-2xl border border-border shadow-xl p-6 text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-green-500/10 p-4">
              <svg className="h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Appointment Confirmed!</h2>
          <p className="text-muted-foreground mb-6">Check your email for confirmation details.</p>
          <div className="space-y-3">
            <Button onClick={handleNewBooking} className="w-full" size="lg">Book Another</Button>
          </div>
        </div>
      )}

      {currentStep === 'cancelled' && (
        <div className="bg-card rounded-2xl border border-border shadow-xl p-6 text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-red-500/10 p-4">
              <X className="h-12 w-12 text-red-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Appointment Cancelled</h2>
          <p className="text-muted-foreground mb-6">Your appointment has been cancelled.</p>
          <Button onClick={handleNewBooking} className="w-full">Book Another Appointment</Button>
        </div>
      )}
    </div>
  );
};

export default BookingWidget;