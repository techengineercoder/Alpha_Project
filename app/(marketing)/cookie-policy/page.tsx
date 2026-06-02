import React from "react";
import { Cookie, Settings, Info } from "lucide-react";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-[#0E0E13] text-white pt-32 pb-24 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#7C5CFF]/10 text-[#7C5CFF] mb-6">
            <Cookie className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Cookie Policy</h1>
          <p className="text-[#A1A1AA] text-lg">Last updated: June 2026</p>
        </div>

        <div className="bg-[#111116] border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-[#A1A1AA] leading-relaxed mb-8">
              This Cookie Policy explains how GetAvails uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
            </p>

            <div className="space-y-12">
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Info className="w-6 h-6 text-[#7C5CFF]" />
                  <h2 className="text-2xl font-semibold m-0 text-white">What are cookies?</h2>
                </div>
                <p className="text-[#A1A1AA] leading-relaxed">
                  Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
                </p>
                <p className="text-[#A1A1AA] leading-relaxed mt-4">
                  Cookies set by the website owner (in this case, GetAvails) are called "first-party cookies". Cookies set by parties other than the website owner are called "third-party cookies". Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., like advertising, interactive content, and analytics).
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-white">Why do we use cookies?</h2>
                <p className="text-[#A1A1AA] leading-relaxed">
                  We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our websites to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our properties.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                    <h3 className="text-white font-semibold mb-2">Essential Cookies</h3>
                    <p className="text-sm text-[#A1A1AA]">Required for the platform to function properly, including user authentication and secure payments.</p>
                  </div>
                  <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                    <h3 className="text-white font-semibold mb-2">Analytics Cookies</h3>
                    <p className="text-sm text-[#A1A1AA]">Help us understand how visitors interact with our website by collecting and reporting information anonymously.</p>
                  </div>
                  <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                    <h3 className="text-white font-semibold mb-2">Preference Cookies</h3>
                    <p className="text-sm text-[#A1A1AA]">Enable the website to remember information that changes the way the website behaves or looks, like your preferred language.</p>
                  </div>
                  <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                    <h3 className="text-white font-semibold mb-2">Marketing Cookies</h3>
                    <p className="text-sm text-[#A1A1AA]">Used to track visitors across websites to display relevant and engaging advertisements.</p>
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Settings className="w-6 h-6 text-[#7C5CFF]" />
                  <h2 className="text-2xl font-semibold m-0 text-white">How can I control cookies?</h2>
                </div>
                <p className="text-[#A1A1AA] leading-relaxed">
                  You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Manager. The Cookie Consent Manager allows you to select which categories of cookies you accept or reject. Essential cookies cannot be rejected as they are strictly necessary to provide you with services.
                </p>
                <p className="text-[#A1A1AA] leading-relaxed mt-4">
                  You can also set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.
                </p>
              </section>
            </div>

            <div className="mt-16 p-6 bg-[#7C5CFF]/5 border border-[#7C5CFF]/20 rounded-2xl">
              <h3 className="text-xl font-semibold text-white mb-2">Manage Preferences</h3>
              <p className="text-[#A1A1AA] mb-4">
                You can update your cookie preferences at any time by clicking the button below.
              </p>
              <button className="px-6 py-2 bg-[#7C5CFF] hover:bg-[#6A4BE5] text-white rounded-xl font-medium transition-colors">
                Cookie Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
