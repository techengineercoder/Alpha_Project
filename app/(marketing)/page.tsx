import { Banner } from '@/components/home/banner';
import { Talent } from '@/components/home/Talent';
import { HowItWorks } from '@/components/home/HowItWorks';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-black">
      <Banner />
      <Talent />
      <HowItWorks />
    </main>
  );
}
