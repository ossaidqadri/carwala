'use client';

import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { BookingForm } from './booking-form/booking-form';
import { BookingSuccess } from './booking-success';
import { Button } from '@/components/ui/button';
import type {
  CalcomBookingResponse,
  RescheduleRequest,
  CancelRequest,
} from '@/types/booking';
import { Calendar } from './calendar';
import { CancelConfirmationModal } from './modals/cancel-confirmation-modal';
import { RescheduleConfirmationModal } from './modals/reschedule-confirmation-modal';
import { ErrorModal } from './modals/error-modal';

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
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [cancelCountdown, setCancelCountdown] = useState(5);
  const [isRescheduled, setIsRescheduled] = useState(false);
  const [pendingRescheduleSlot, setPendingRescheduleSlot] = useState<
    string | null
  >(null);
  const [isConfirmingReschedule, setIsConfirmingReschedule] = useState(false);
  const [isCancellingMeeting, setIsCancellingMeeting] = useState(false);

  const activeEventTypeId = selectedService?.eventTypeId || eventTypeId || '';
  const activeEventLength = selectedService?.duration || eventLength;

  const widgetRef = useRef<HTMLDivElement>(null);
  const hasUserInteracted = useRef(false);

  useEffect(() => {
    const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setUserTimezone(browserTimezone);
  }, []);

  useEffect(() => {
    if (hasUserInteracted.current && widgetRef.current) {
      setTimeout(() => {
        if (widgetRef.current) {
          const headerHeight = 175;
          const margin = 20;
          const targetPosition =
            widgetRef.current.offsetTop - headerHeight - margin;

          window.scrollTo({
            top: Math.max(0, targetPosition),
            behavior: 'smooth',
          });
        }
      }, 100);
    }
  }, [currentStep]);

  useEffect(() => {
    if (currentStep === 'cancelled') {
      const interval = setInterval(() => {
        setCancelCountdown((prev) => {
          if (prev <= 1) {
            setCurrentStep('calendar');
            setBooking(null);
            setSelectedSlot(null);
            return 5;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setCancelCountdown(5);
    }
  }, [currentStep]);

  const handleServiceChange = (service: ServiceOption) => {
    setSelectedService(service);
  };

  const handleSlotSelect = (slot: string) => {
    hasUserInteracted.current = true;
    setSelectedSlot(slot);
    setCurrentStep('form');
  };

  const handleBookingSuccess = (bookingData: CalcomBookingResponse) => {
    hasUserInteracted.current = true;
    setBooking(bookingData);
    setIsRescheduled(false);
    setCurrentStep('success');
  };

  const handleBackToCalendar = () => {
    hasUserInteracted.current = true;
    setSelectedSlot(null);
    setCurrentStep('calendar');
  };

  const handleNewBooking = () => {
    setSelectedSlot(null);
    setBooking(null);
    setIsRescheduled(false);
    setCurrentStep('calendar');
  };

  const handleReschedule = () => {
    hasUserInteracted.current = true;
    setCurrentStep('reschedule');
  };

  const handleCancel = () => {
    if (!booking?.uid) return;
    setShowCancelDialog(true);
  };

  const confirmCancel = async () => {
    if (!booking?.uid) return;

    setIsCancellingMeeting(true);

    try {
      const cancelData: CancelRequest = {
        bookingUid: booking.uid,
        cancellationReason: 'Cancelled by user',
      };

      const response = await fetch('/api/booking-calendar/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cancelData),
      });

      if (!response.ok) throw new Error('Failed to cancel booking');

      hasUserInteracted.current = true;
      setShowCancelDialog(false);
      setCurrentStep('cancelled');
    } catch (error) {
      console.error('Cancel error:', error);
      setShowCancelDialog(false);
      setErrorMessage(
        'Failed to cancel the meeting. Please use the cancellation link in your booking confirmation email to cancel this meeting.'
      );
      setShowErrorDialog(true);
    } finally {
      setIsCancellingMeeting(false);
    }
  };

  const handleRescheduleSlotSelect = (slot: string) => {
    setPendingRescheduleSlot(slot);
    setShowRescheduleDialog(true);
  };

  const confirmReschedule = async () => {
    if (!booking?.uid || !pendingRescheduleSlot) return;

    setIsConfirmingReschedule(true);

    try {
      const rescheduleData: RescheduleRequest = {
        bookingUid: booking.uid,
        start: pendingRescheduleSlot,
        reschedulingReason: 'User requested reschedule',
      };

      const response = await fetch('/api/booking-calendar/reschedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rescheduleData),
      });

      if (!response.ok) throw new Error('Failed to reschedule booking');

      const result = await response.json();
      const updatedBooking = result.data || result;
      hasUserInteracted.current = true;
      setBooking(updatedBooking);
      setIsRescheduled(true);
      setShowRescheduleDialog(false);
      setPendingRescheduleSlot(null);
      setCurrentStep('success');
    } catch (error) {
      console.error('Reschedule error:', error);
      setShowRescheduleDialog(false);
      setPendingRescheduleSlot(null);
      setErrorMessage(
        'Failed to reschedule the meeting. Please use the rescheduling link in your booking confirmation email to reschedule this meeting.'
      );
      setShowErrorDialog(true);
    } finally {
      setIsConfirmingReschedule(false);
    }
  };

  return (
    <div ref={widgetRef} className="mx-auto w-full max-w-3xl">
      {currentStep === 'calendar' && (
        <Calendar
          eventTypeId={activeEventTypeId}
          onSlotSelect={handleSlotSelect}
          title={title}
          description={description}
          showHeader={showHeader}
          userTimezone={userTimezone}
          onTimezoneChange={setUserTimezone}
          services={services}
          onServiceChange={handleServiceChange}
          initialServiceId={selectedService?.id}
        />
      )}

      {currentStep === 'form' && selectedSlot && (
        <BookingForm
          selectedSlot={selectedSlot}
          eventTypeId={activeEventTypeId}
          eventLength={activeEventLength}
          userTimezone={userTimezone}
          onSuccess={handleBookingSuccess}
          onBack={handleBackToCalendar}
        />
      )}

      {currentStep === 'reschedule' && booking && (
        <Calendar
          eventTypeId={activeEventTypeId}
          onSlotSelect={handleRescheduleSlotSelect}
          title="Reschedule Appointment"
          description="Please select a new time for your car detailing appointment."
          showHeader={true}
          userTimezone={userTimezone}
          onTimezoneChange={setUserTimezone}
        />
      )}

      {currentStep === 'success' && booking && (
        <BookingSuccess
          booking={booking}
          userTimezone={userTimezone}
          onReschedule={handleReschedule}
          onCancel={handleCancel}
          onNewBooking={handleNewBooking}
          isRescheduled={isRescheduled}
        />
      )}

      {currentStep === 'cancelled' && (
        <div className="bg-card rounded-2xl border border-border shadow-xl">
          <div className="p-6 text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-red-500/10 p-4">
                <X className="h-12 w-12 text-red-400" />
              </div>
            </div>
            <h2 className="mb-2 text-2xl font-bold text-foreground">
              Appointment Cancelled
            </h2>
            <p className="mb-6 text-muted-foreground">
              Your appointment has been successfully cancelled.
            </p>
            <p className="mb-6 text-sm text-muted-foreground">
              Returning to calendar in {cancelCountdown} seconds...
            </p>
            <Button onClick={handleNewBooking} className="w-full max-w-sm">
              Book Another Appointment
            </Button>
          </div>
        </div>
      )}

      <CancelConfirmationModal
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={confirmCancel}
        isLoading={isCancellingMeeting}
      />

      <RescheduleConfirmationModal
        isOpen={showRescheduleDialog}
        onClose={() => {
          setShowRescheduleDialog(false);
          setPendingRescheduleSlot(null);
        }}
        onConfirm={confirmReschedule}
        isLoading={isConfirmingReschedule}
        booking={booking}
        newSlot={pendingRescheduleSlot}
        userTimezone={userTimezone}
      />

      <ErrorModal
        isOpen={showErrorDialog}
        onClose={() => setShowErrorDialog(false)}
        errorMessage={errorMessage}
      />
    </div>
  );
};

export default BookingWidget;
