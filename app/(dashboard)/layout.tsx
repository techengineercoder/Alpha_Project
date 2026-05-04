export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 font-bold text-lg">
          Dashboard
        </div>
        <nav className="p-4 space-y-2">
          {/* This would be dynamically rendered based on the user role */}
          <div className="text-sm font-medium text-gray-500 mb-2">Role Navigation</div>
          <a href="#" className="block px-3 py-2 rounded-md bg-indigo-50 text-indigo-700 font-medium">Home</a>
          <a href="#" className="block px-3 py-2 rounded-md hover:bg-gray-50 text-gray-700 font-medium">Settings</a>
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <h2 className="text-xl font-semibold text-gray-800">Overview</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">John Doe</span>
            <div className="w-8 h-8 bg-indigo-600 rounded-full"></div>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
