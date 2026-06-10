import { Banner } from '@/components/home/banner';
import { Talent } from '@/components/home/Talent';
import { HowItWorks } from '@/components/home/HowItWorks';
import { Testimonials } from '@/components/home/Testimonials';
import { CTA } from '@/components/home/CTA';
import { Journey } from '@/components/home/Journey';
import { Roles } from '@/components/home/Roles';
import { Blog } from '@/components/home/Blog';
import { Contact } from '@/components/home/Contact';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-black">
      <Banner />
      <Talent />
      <Journey />
      <Roles />
      {/* <HowItWorks /> */}
      <Testimonials />
      <Blog />
      <Contact />
      <CTA />
    </main>
  );
}