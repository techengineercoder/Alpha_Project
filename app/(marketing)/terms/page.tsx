import React from "react";
import { FileText, CheckCircle, AlertCircle } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#0E0E13] text-white pt-32 pb-24 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#00A5E5]/10 text-[#7C5CFF] mb-6">
            <FileText className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Terms of Service</h1>
          <p className="text-[#A1A1AA] text-lg">Effective Date: June 2026</p>
        </div>

        <div className="bg-[#111116] border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-[#A1A1AA] leading-relaxed mb-8">
              Welcome to GetAvails. These Terms of Service ("Terms") govern your use of our website, platform, and services. By accessing or using our platform, you agree to be bound by these Terms and our Privacy Policy.
            </p>

            <div className="space-y-12">
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-[#7C5CFF]" />
                  <h2 className="text-2xl font-semibold m-0 text-white">1. Acceptance of Terms</h2>
                </div>
                <p className="text-[#A1A1AA] leading-relaxed">
                  By creating an account or using the GetAvails platform, you confirm that you are at least 18 years old and capable of forming a binding contract. If you are using the platform on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-[#7C5CFF]" />
                  <h2 className="text-2xl font-semibold m-0 text-white">2. Platform Rules & Guidelines</h2>
                </div>
                <p className="text-[#A1A1AA] leading-relaxed">
                  GetAvails serves as a marketplace connecting artists and clients. Users agree to:
                </p>
                <ul className="list-disc pl-5 mt-4 text-[#A1A1AA] space-y-2">
                  <li>Provide accurate, current, and complete information during registration.</li>
                  <li>Maintain the security of their password and identification.</li>
                  <li>Be fully responsible for all use of their account and any actions taking place using their account.</li>
                  <li>Not use the platform for any illegal or unauthorized purpose.</li>
                  <li>Not attempt to bypass our booking system or payment processing to transact directly outside the platform.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-white">3. Payments and Fees</h2>
                <p className="text-[#A1A1AA] leading-relaxed">
                  Clients agree to pay all applicable fees for bookings made through the platform. Artists agree that GetAvails will deduct a platform fee from their booking payouts as detailed in our fee schedule. All payments are processed securely through our third-party payment providers.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-white">4. Cancellations and Refunds</h2>
                <p className="text-[#A1A1AA] leading-relaxed">
                  Cancellation policies are determined by the individual artist and agreed upon at the time of booking. GetAvails will facilitate refunds in accordance with the artist's stated cancellation policy. In the event of a dispute, our support team will mediate to reach a fair resolution.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-white">5. Intellectual Property</h2>
                <p className="text-[#A1A1AA] leading-relaxed">
                  The service and its original content, features, and functionality are and will remain the exclusive property of GetAvails and its licensors. You may not use our brand, logo, or designs without prior written consent.
                </p>
              </section>
            </div>

            <div className="mt-16 p-6 bg-[#00A5E5]/5 border border-[#7C5CFF]/20 rounded-2xl">
              <h3 className="text-xl font-semibold text-white mb-2">Need to report a violation?</h3>
              <p className="text-[#A1A1AA]">
                If you believe another user is violating these terms, please contact our trust and safety team at <a href="mailto:legal@getavails.com" className="text-[#7C5CFF] hover:underline">legal@getavails.com</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
