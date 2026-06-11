import React from "react";
import { Shield, Lock, Eye } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0E0E13] text-white pt-32 pb-24 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#00A5E5]/10 text-[#7C5CFF] mb-6">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-[#A1A1AA] text-lg">Last updated: June 2026</p>
        </div>

        <div className="bg-[#111116] border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-[#A1A1AA] leading-relaxed mb-8">
              At GetAvails, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our marketplace platform to connect artists and event organizers.
            </p>

            <div className="space-y-12">
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="w-6 h-6 text-[#7C5CFF]" />
                  <h2 className="text-2xl font-semibold m-0 text-white">1. Information We Collect</h2>
                </div>
                <p className="text-[#A1A1AA] leading-relaxed">
                  We may collect personal identification information from Users in a variety of ways, including, but not limited to, when Users visit our site, register on the site, place an order, fill out a form, and in connection with other activities, services, features, or resources we make available on our Site.
                </p>
                <ul className="list-disc pl-5 mt-4 text-[#A1A1AA] space-y-2">
                  <li>Name, email address, and phone number</li>
                  <li>Billing and payment information</li>
                  <li>Event details and artist preferences</li>
                  <li>Profile information including photos and biographies</li>
                </ul>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="w-6 h-6 text-[#7C5CFF]" />
                  <h2 className="text-2xl font-semibold m-0 text-white">2. How We Use Your Data</h2>
                </div>
                <p className="text-[#A1A1AA] leading-relaxed">
                  GetAvails uses the collected information for various purposes:
                </p>
                <ul className="list-disc pl-5 mt-4 text-[#A1A1AA] space-y-2">
                  <li>To provide and maintain our Service</li>
                  <li>To process transactions and send related information</li>
                  <li>To notify you about changes to our Service</li>
                  <li>To provide customer support</li>
                  <li>To monitor the usage of our Service</li>
                  <li>To detect, prevent and address technical issues</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-white">3. Data Security</h2>
                <p className="text-[#A1A1AA] leading-relaxed">
                  The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security. We implement a variety of security measures when a user places an order enters, submits, or accesses their information to maintain the safety of your personal information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-white">4. Sharing Your Information</h2>
                <p className="text-[#A1A1AA] leading-relaxed">
                  We do not sell, trade, or rent Users' personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates, and advertisers for the purposes outlined above.
                </p>
              </section>
            </div>

            <div className="mt-16 p-6 bg-[#00A5E5]/5 border border-[#7C5CFF]/20 rounded-2xl">
              <h3 className="text-xl font-semibold text-white mb-2">Questions regarding our policy?</h3>
              <p className="text-[#A1A1AA]">
                If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us at <a href="mailto:privacy@getavails.com" className="text-[#7C5CFF] hover:underline">privacy@getavails.com</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
