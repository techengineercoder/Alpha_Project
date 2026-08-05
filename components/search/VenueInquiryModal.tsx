"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Mail, Phone, Clock, Check, MapPin, DollarSign, Type, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useAddInquiryMutation } from '@/redux/feature/dashboardApi/inquirieSlice';

interface VenueInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  venueName: string;
  venueId: string | number;
  initialDate?: Date | null;
  receiverEmail?: string;
}

export function VenueInquiryModal({ isOpen, onClose, venueName, venueId, initialDate, receiverEmail }: VenueInquiryModalProps) {
  const [step, setStep] = useState<1 | 2>(1);

  const [addInquiry, { isLoading: addInquiryLoading }] = useAddInquiryMutation();

  const [formData, setFormData] = useState({
    title: '',
    event_date: '',
    event_time: '',
    expected_attendance: '',
    budget: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    notes: '',
    receiver_email: ''
  });

  // Populate event_date when modal opens and initialDate is provided
  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        event_date: initialDate ? new Date(initialDate.getTime() - initialDate.getTimezoneOffset() * 60000).toISOString().split('T')[0] : '',
        receiver_email: receiverEmail || ''
      }));
    }
  }, [isOpen, initialDate, receiverEmail]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const dateObj = new Date(`${formData.event_date}T${formData.event_time}`);
      const start_date_time = isNaN(dateObj.getTime()) ? new Date().toISOString() : dateObj.toISOString();

      const payload = {
        receiver_email: formData.receiver_email,
        event_title: formData.title,
        start_date_time,
        expected_attendance: parseInt(formData.expected_attendance, 10) || 0,
        budget: formData.budget,
        full_name: formData.contact_name,
        email: formData.contact_email,
        phone_number: formData.contact_phone,
        additional_notes: formData.notes || ''
      };

      await addInquiry(payload).unwrap();

      setStep(2);
      toast.success("Inquiry submitted successfully!");
    } catch (error: any) {
      const errorData = error?.data?.error;
      let errorMessage = "Failed to submit inquiry. Please try again.";

      if (errorData?.details) {
        const firstErrorKey = Object.keys(errorData.details)[0];
        const firstErrorValue = errorData.details[firstErrorKey];
        const errorText = Array.isArray(firstErrorValue) ? firstErrorValue[0] : firstErrorValue;
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
        expected_attendance: '',
        budget: '',
        contact_name: '',
        contact_email: '',
        contact_phone: '',
        notes: '',
        receiver_email: ''
      });
    }, 300); // Reset after closing animation
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetAndClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className={`w-full bg-[#121218] border border-white/10 rounded-[20px] shadow-2xl pointer-events-auto overflow-hidden flex flex-col max-h-[90vh] transition-all duration-300 ${step === 2 ? 'max-w-md' : 'max-w-2xl'}`}
            >
              {/* Header */}
              {step === 1 && (
                <div className="flex items-center justify-between p-6 border-b border-white/5 shrink-0">
                  <h2 className="text-xl font-bold text-white font-sans">
                    Inquire about {venueName}
                  </h2>
                  <button
                    onClick={resetAndClose}
                    className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Body */}
              <div className={`overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${step === 2 ? 'p-0' : 'p-6'}`}>
                {step === 1 ? (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                    {/* Event Info Group */}
                    <div className="flex flex-col gap-4">
                      <h3 className="text-sm font-semibold text-white tracking-wide border-b border-white/5 pb-1">Event Information</h3>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs text-[#A1A1AA] font-medium">Event Title</label>
                        <div className="relative">
                          <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
                          <input
                            required
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            type="text"
                            placeholder="e.g. Corporate Gala, Concert, Birthday Bash"
                            className="w-full bg-[#1C1C28] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-[#00A5E5]/50 transition-colors"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs text-[#A1A1AA] font-medium">Receiver Email (Venue Coordinator)</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
                          <input
                            required
                            name="receiver_email"
                            value={formData.receiver_email}
                            onChange={handleChange}
                            type="email"
                            placeholder="venue@example.com"
                            className="w-full bg-[#1C1C28] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-[#00A5E5]/50 transition-colors"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-xs text-[#A1A1AA] font-medium">Date</label>
                          <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
                            <input
                              required
                              name="event_date"
                              value={formData.event_date}
                              onChange={handleChange}
                              type="date"
                              className="w-full bg-[#1C1C28] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-[#00A5E5]/50 transition-colors [color-scheme:dark]"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs text-[#A1A1AA] font-medium">Start Time</label>
                          <div className="relative">
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
                            <input
                              required
                              name="event_time"
                              value={formData.event_time}
                              onChange={handleChange}
                              type="time"
                              className="w-full bg-[#1C1C28] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-[#00A5E5]/50 transition-colors [color-scheme:dark]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Attendance and Budget */}
                    <div className="flex flex-col gap-4">
                      <h3 className="text-sm font-semibold text-white tracking-wide border-b border-white/5 pb-1">Attendance & Budget</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-xs text-[#A1A1AA] font-medium">Expected Attendance</label>
                          <div className="relative">
                            <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
                            <input
                              required
                              name="expected_attendance"
                              value={formData.expected_attendance}
                              onChange={handleChange}
                              type="number"
                              min="1"
                              placeholder="e.g. 150"
                              className="w-full bg-[#1C1C28] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-[#00A5E5]/50 transition-colors"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs text-[#A1A1AA] font-medium">Budget ($)</label>
                          <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
                            <input
                              required
                              name="budget"
                              value={formData.budget}
                              onChange={handleChange}
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="5000.00"
                              className="w-full bg-[#1C1C28] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-[#00A5E5]/50 transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact Info Group */}
                    <div className="flex flex-col gap-4">
                      <h3 className="text-sm font-semibold text-white tracking-wide border-b border-white/5 pb-1">Contact Information</h3>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs text-[#A1A1AA] font-medium">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
                          <input
                            required
                            name="contact_name"
                            value={formData.contact_name}
                            onChange={handleChange}
                            type="text"
                            placeholder="Your Name"
                            className="w-full bg-[#1C1C28] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-[#00A5E5]/50 transition-colors"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-xs text-[#A1A1AA] font-medium">Email Address</label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
                            <input
                              required
                              name="contact_email"
                              value={formData.contact_email}
                              onChange={handleChange}
                              type="email"
                              placeholder="name@example.com"
                              className="w-full bg-[#1C1C28] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-[#00A5E5]/50 transition-colors"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs text-[#A1A1AA] font-medium">Phone Number</label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
                            <input
                              required
                              name="contact_phone"
                              value={formData.contact_phone}
                              onChange={handleChange}
                              type="tel"
                              placeholder="+1 555-0100"
                              className="w-full bg-[#1C1C28] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-[#00A5E5]/50 transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Info Group */}
                    <div className="flex flex-col gap-2">
                      <h3 className="text-sm font-semibold text-white tracking-wide border-b border-white/5 pb-1">Additional Information</h3>
                      <label className="text-xs text-[#A1A1AA] font-medium">Additional Notes</label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Detail any technical requirements, catering requests, or general queries here..."
                        className="w-full bg-[#1C1C28] border border-white/5 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-[#00A5E5]/50 resize-none transition-colors"
                      />
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex items-center justify-between gap-4 pt-4 shrink-0">
                      <button
                        type="button"
                        onClick={resetAndClose}
                        disabled={addInquiryLoading}
                        className="flex-1 py-3.5 rounded-xl bg-[#22222E] border border-white/5 text-white text-sm font-medium hover:bg-[#2A2A35] transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={addInquiryLoading}
                        className="flex-1 py-3.5 rounded-xl bg-[#00A5E5] text-white text-sm font-medium hover:bg-[#00A5E5]/90 transition-colors disabled:opacity-50 flex items-center justify-center cursor-pointer shadow-[0_4px_16px_rgba(0,165,229,0.25)]"
                      >
                        {addInquiryLoading ? 'Sending Inquiry...' : 'Submit Inquiry'}
                      </button>
                    </div>

                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-center p-8 pt-10 pb-8 relative"
                  >
                    {/* Standalone Absolute Close Button for Success Screen */}
                    <button
                      onClick={resetAndClose}
                      className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    {/* Compact Animated Success Icon with Neon Glow */}
                    <div className="w-14 h-14 rounded-full border border-[#00A5E5]/30 flex items-center justify-center mb-4 bg-[#00A5E5]/10 text-[#00A5E5] relative shadow-[0_0_20px_rgba(0,165,229,0.2)]">
                      <div className="absolute inset-0 rounded-full animate-ping bg-[#00A5E5]/5 opacity-75" />
                      <Check className="w-6 h-6" />
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Inquiry Submitted!</h2>
                    <p className="text-[#A1A1AA] text-sm mb-8 max-w-sm leading-relaxed">
                      Sent successfully to <span className="text-white font-semibold">{venueName}</span>. The coordinator will review your request shortly.
                    </p>

                    <div className="w-full max-w-xs flex justify-center">
                      <button
                        onClick={resetAndClose}
                        className="w-full py-3.5 rounded-xl bg-[#00A5E5] text-white text-sm font-medium hover:bg-[#00A5E5]/90 transition-colors cursor-pointer shadow-[0_4px_16px_rgba(0,165,229,0.25)]"
                      >
                        Dismiss
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
