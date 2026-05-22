import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/navbar";
import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Background Image Container */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/image/BG.png"
          alt="Authentication Background"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Gradient Overlay for depth and readability */}
        {/* <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-black/80" /> */}
        {/* <div className="absolute inset-0 backdrop-blur-[2px]" /> */}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow flex items-center justify-center pt-32 pb-20 px-4">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}
