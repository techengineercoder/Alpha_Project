import { Banner } from '@/components/home/banner';
import { Talent } from '@/components/home/Talent';
import { HowItWorks } from '@/components/home/HowItWorks';
import { Testimonials } from '@/components/home/Testimonials';
import { CTA } from '@/components/home/CTA';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-black">
      <Banner />
      <Talent />
      <HowItWorks />
      <Testimonials />
      <CTA />
    </main>
  );
}