import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/icon/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-[#0b0c10] overflow-hidden">
      {/* Left side Image - Hidden on mobile, takes half screen on lg */}
      <div className="hidden lg:block lg:w-1/2 relative h-screen">
        <Image
          src="/auth.png"
          alt="Authentication Background"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-[#0b0c10]/90 pointer-events-none" />
      </div>

      {/* Right side Content - Full width on mobile, half screen on lg */}
      <div className="w-full lg:w-1/2 flex flex-col h-screen relative bg-[#0b0c10] overflow-y-auto">
        {/* Header with Logo */}
        {/* <div className="absolute top-0 left-0 w-full p-6 flex justify-start z-20">
          <Link href="/" className="transition-opacity hover:opacity-80">
            <Logo />
          </Link>
        </div> */}

        {/* Form Container */}
        <main className="flex-grow flex flex-col items-center justify-center py-20 px-4 sm:px-8 lg:px-12 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
