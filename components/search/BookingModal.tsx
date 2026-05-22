"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Mail, Phone, Clock, Check, MapPin, DollarSign, Type } from 'lucide-react';
import { useCreateBookingMutation } from '@/redux/feature/artistApi/bookingSlice';
import { toast } from 'sonner';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  artistName: string;
  artistId: string | number;
  initialDate?: Date | null;
}

export function BookingModal({ isOpen, onClose, artistName, artistId, initialDate }: BookingModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [createBooking, { isLoading }] = useCreateBookingMutation();

  const [formData, setFormData] = useState({
    title: '',
    event_date: '',
    event_time: '',
    venue_name: '',
    address: '',
    budget: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    notes: ''
  });

  // Effect to populate event_date when modal opens and initialDate is provided
  React.useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        event_date: initialDate ? new Date(initialDate.getTime() - initialDate.getTimezoneOffset() * 60000).toISOString().split('T')[0] : ''
      }));
    }
  }, [isOpen, initialDate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const budgetAmount = parseFloat(formData.budget) || 0;
      const amount_cents = Math.round(budgetAmount * 100);

      // Ensure artist_id is sent as a valid integer by stripping non-numeric characters (e.g. for sg_perf_ IDs)
      // const numericArtistId = parseInt(String(artistId).replace(/\D/g, ''), 10);
      const numericArtistId = artistId;

      const payload = {
        artist_id: numericArtistId,
        title: formData.title,
        event_date: formData.event_date,
        event_time: formData.event_time,
        venue_name: formData.venue_name,
        address: formData.address,
        amount_cents: amount_cents,
        budget_min_cents: amount_cents, // Sending identical min/max bounds based on offer
        budget_max_cents: amount_cents,
        contact_name: formData.contact_name,
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone,
        notes: formData.notes
      };

      await createBooking(payload).unwrap();
      setStep(2);
      toast.success("Booking request sent successfully!");
    } catch (error: any) {
      // Robust error parsing for the nested backend error structure
      const errorData = error?.data?.error;
      let errorMessage = "Failed to submit booking request.";

      if (errorData?.details) {
        // Extract the specific field error
        const firstErrorKey = Object.keys(errorData.details)[0];
        const firstErrorValue = errorData.details[firstErrorKey];
        const errorText = Array.isArray(firstErrorValue) ? firstErrorValue[0] : firstErrorValue;

        // If the key is just 'detail', show the message directly, otherwise show field: message
        errorMessage = firstErrorKey === 'detail' ? errorText : `${firstErrorKey}: ${errorText}`;
      } else if (errorData?.message) {
        errorMessage = errorData.message;
      } else if (typeof error?.data?.message === 'string') {
        errorMessage = error.data.message;
      }

      toast.error(errorMessage);
    }
  };

  const resetAndClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setFormData({
        title: '',
        event_date: '',
        event_time: '',
        venue_name: '',
        address: '',
        budget: '',
        contact_name: '',
        contact_email: '',
        contact_phone: '',
        notes: ''
      });
    }, 300); // Reset after animation
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetAndClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-2xl bg-[#121218] border border-white/10 rounded-[20px] shadow-2xl pointer-events-auto overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/5 shrink-0">
                <h2 className="text-xl font-bold text-white">
                  {step === 1 ? `Book ${artistName}` : ''}
                </h2>
                <button
                  onClick={resetAndClose}
                  className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center text-[#A1A1AA] hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {step === 1 ? (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                    {/* Event Info Group */}
                    <div className="flex flex-col gap-4">
                      <h3 className="text-sm font-medium text-white">Event Information</h3>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs text-[#A1A1AA]">Event Title</label>
                        <div className="relative">
                          <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
                          <input required name="title" value={formData.title} onChange={handleChange} type="text" placeholder="e.g. Summer Music Festival" className="w-full bg-[#1C1C28] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-[#7C5CFF]/50" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-xs text-[#A1A1AA]">Date</label>
                          <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
                            <input required name="event_date" value={formData.event_date} onChange={handleChange} type="date" className="w-full bg-[#1C1C28] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-[#7C5CFF]/50 [color-scheme:dark]" />
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs text-[#A1A1AA]">Time</label>
                          <div className="relative">
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
                            <input required name="event_time" value={formData.event_time} onChange={handleChange} type="time" className="w-full bg-[#1C1C28] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-[#7C5CFF]/50 [color-scheme:dark]" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Venue Group */}
                    <div className="flex flex-col gap-4">
                      <h3 className="text-sm font-medium text-white">Venue Details</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-xs text-[#A1A1AA]">Venue Name</label>
                          <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
                            <input required name="venue_name" value={formData.venue_name} onChange={handleChange} type="text" placeholder="Central Park Arena" className="w-full bg-[#1C1C28] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-[#7C5CFF]/50" />
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs text-[#A1A1AA]">Address</label>
                          <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
                            <input required name="address" value={formData.address} onChange={handleChange} type="text" placeholder="Central Park, NYC" className="w-full bg-[#1C1C28] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-[#7C5CFF]/50" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact Info Group */}
                    <div className="flex flex-col gap-4">
                      <h3 className="text-sm font-medium text-white">Contact Information</h3>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs text-[#A1A1AA]">Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
                          <input required name="contact_name" value={formData.contact_name} onChange={handleChange} type="text" placeholder="Kirito Kazuto" className="w-full bg-[#1C1C28] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-[#7C5CFF]/50" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-xs text-[#A1A1AA]">Email</label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
                            <input required name="contact_email" value={formData.contact_email} onChange={handleChange} type="email" placeholder="kirito@example.com" className="w-full bg-[#1C1C28] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-[#7C5CFF]/50" />
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs text-[#A1A1AA]">Phone</label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
                            <input required name="contact_phone" value={formData.contact_phone} onChange={handleChange} type="tel" placeholder="+1 555-0100" className="w-full bg-[#1C1C28] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-[#7C5CFF]/50" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Budget Group */}
                    <div className="flex flex-col gap-2">
                      <h3 className="text-sm font-medium text-white">Budget</h3>
                      <label className="text-xs text-[#A1A1AA]">Offer Amount ($)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
                        <input required name="budget" value={formData.budget} onChange={handleChange} type="number" min="0" step="0.01" placeholder="5000.00" className="w-full bg-[#1C1C28] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-[#7C5CFF]/50" />
                      </div>
                    </div>

                    {/* Additional Info Group */}
                    <div className="flex flex-col gap-2">
                      <h3 className="text-sm font-medium text-white">Additional Information</h3>
                      <label className="text-xs text-[#A1A1AA]">Additional Notes</label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Outdoor stage, please bring own monitors..."
                        className="w-full bg-[#1C1C28] border border-white/5 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-[#7C5CFF]/50 resize-none"
                      />
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex items-center justify-between gap-4 pt-4 shrink-0">
                      <button
                        type="button"
                        onClick={resetAndClose}
                        disabled={isLoading}
                        className="flex-1 py-3.5 rounded-xl bg-[#22222E] border border-white/5 text-white text-sm font-medium hover:bg-[#2A2A35] transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 py-3.5 rounded-xl border-white/10 bg-gradient-to-r from-[#7C5CFF] to-[#9D7CFF] text-white text-sm font-medium hover:bg-[#6A4BE5] transition-colors disabled:opacity-50 flex items-center justify-center"
                      >
                        {isLoading ? 'Sending...' : 'Submit Booking Request'}
                      </button>
                    </div>

                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-center py-8"
                  >
                    <div className="w-16 h-16 rounded-full border-2 border-[#7C5CFF] flex items-center justify-center mb-6 bg-[#7C5CFF]/10">
                      <Check className="w-8 h-8 text-[#7C5CFF]" />
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-4">Booking Request Sent!</h2>
                    <p className="text-[#A1A1AA] text-base mb-12 max-w-md">
                      Your booking request has been sent to {artistName}. They will review your details and get back to you within 24 hours.
                    </p>

                    <h3 className="text-lg font-bold text-white mb-6">Next Steps</h3>

                    <div className="flex flex-col gap-6 w-full max-w-sm mb-12">
                      <div className="flex items-start gap-4 text-left">
                        <div className="w-8 h-8 rounded-full bg-[#1C1C28] border border-white/10 flex items-center justify-center text-white font-medium shrink-0">1</div>
                        <div>
                          <h4 className="text-white font-medium mb-1">Artist Review</h4>
                          <p className="text-sm text-[#A1A1AA]">The artist will review your request and availability</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 text-left">
                        <div className="w-8 h-8 rounded-full bg-[#1C1C28] border border-white/10 flex items-center justify-center text-white font-medium shrink-0">2</div>
                        <div>
                          <h4 className="text-white font-medium mb-1">Receive Response</h4>
                          <p className="text-sm text-[#A1A1AA]">You&apos;ll receive a response via email and messages</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 text-left">
                        <div className="w-8 h-8 rounded-full bg-[#1C1C28] border border-white/10 flex items-center justify-center text-white font-medium shrink-0">3</div>
                        <div>
                          <h4 className="text-white font-medium mb-1">Finalize Details</h4>
                          <p className="text-sm text-[#A1A1AA]">Discuss final details and confirm the booking</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex w-full items-center justify-center gap-4">
                      <button
                        onClick={resetAndClose}
                        className="flex-1 max-w-[200px] px-6 py-3.5 rounded-xl border border-white/10 text-white text-sm font-medium hover:bg-white/5 transition-colors"
                      >
                        View Messages
                      </button>
                      <button
                        onClick={resetAndClose}
                        className="flex-1 max-w-[200px] px-6 py-3.5 rounded-xl border-white/10 bg-gradient-to-r from-[#7C5CFF] to-[#9D7CFF] text-white text-sm font-medium hover:bg-[#6A4BE5] transition-colors shadow-lg shadow-[#7C5CFF]/20"
                      >
                        Go to Dashboard
                      </button>
                    </div>

                  </motion.div>
                )}
              </div>

            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
