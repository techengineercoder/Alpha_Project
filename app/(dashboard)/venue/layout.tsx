export default function VenueLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-rose-600">Venue Portal</h2>
      <div className="bg-white rounded-lg shadow p-6">
        {children}
      </div>
    </div>
  );
}
