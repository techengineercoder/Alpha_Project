import { DashboardNavbar } from "@/components/layout/navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#00A5E5]/30">
      {/* Navbar at the top */}
      <DashboardNavbar />

      {/* Main Content Area */}
      <div className="pt-32 pb-12 px-4 md:px-8 lg:px-12">
        <div className="mx-auto max-w-[1400px] min-h-[853px]">
          {children}
        </div>
      </div>

      {/* Background Decorative Elements */}
      {/* <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#00A5E5]/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#00A5E5]/5 blur-[120px] rounded-full"></div>
      </div> */}
    </div>
  );
}
