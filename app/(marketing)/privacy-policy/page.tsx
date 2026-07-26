"use client";

import React from "react";
import { Shield, Lock, Eye, Loader2 } from "lucide-react";
import { useGetAllTermsQuery } from "@/redux/feature/termsSlice";

export default function PrivacyPolicyPage() {
  const { data: termsData, isLoading } = useGetAllTermsQuery(undefined);
  const matchedTerm = termsData?.results?.find((item: any) => item.slug === "privacy-policy");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0E0E13] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#00A5E5]" />
      </div>
    );
  }

  if (matchedTerm && matchedTerm.is_published) {
    return (
      <div className="min-h-screen bg-[#0E0E13] text-white pt-32 pb-24 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#00A5E5]/10 text-[#7C5CFF] mb-6">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              {matchedTerm.title}
            </h1>
            <p className="text-[#A1A1AA] text-lg">
              Last updated: {new Date(matchedTerm.updated_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </p>
          </div>

          <div className="bg-[#111116] border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl">
            <style dangerouslySetInnerHTML={{ __html: `
              .html-content h1 { font-size: 2.25rem !important; font-weight: 800 !important; margin-top: 2rem !important; margin-bottom: 1rem !important; color: #ffffff !important; line-height: 1.2 !important; }
              .html-content h2 { font-size: 1.75rem !important; font-weight: 700 !important; margin-top: 1.75rem !important; margin-bottom: 0.875rem !important; color: #ffffff !important; line-height: 1.3 !important; }
              .html-content h3 { font-size: 1.375rem !important; font-weight: 600 !important; margin-top: 1.5rem !important; margin-bottom: 0.75rem !important; color: #ffffff !important; }
              .html-content p { margin-top: 1rem !important; margin-bottom: 1rem !important; line-height: 1.75 !important; color: #A1A1AA !important; }
              .html-content ul { list-style-type: disc !important; padding-left: 1.5rem !important; margin-top: 1rem !important; margin-bottom: 1rem !important; color: #A1A1AA !important; }
              .html-content ol { list-style-type: decimal !important; padding-left: 1.5rem !important; margin-top: 1rem !important; margin-bottom: 1rem !important; color: #A1A1AA !important; }
              .html-content li { margin-top: 0.5rem !important; margin-bottom: 0.5rem !important; line-height: 1.625 !important; }
              .html-content a { color: #00A5E5 !important; text-decoration: underline !important; transition: color 0.2s !important; }
              .html-content a:hover { color: #00E5FF !important; }
              .html-content blockquote { border-left: 4px solid #7C5CFF !important; padding-left: 1.25rem !important; font-style: italic !important; color: #71717A !important; margin: 1.5rem 0 !important; }
              .html-content strong { color: #ffffff !important; font-weight: 600 !important; }
              .html-content hr { border-color: rgba(255, 255, 255, 0.1) !important; margin: 2rem 0 !important; }
            `}} />
            <div 
              className="html-content max-w-none" 
              dangerouslySetInnerHTML={{ __html: matchedTerm.content }} 
            />
          </div>
        </div>
      </div>
    );
  }

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
