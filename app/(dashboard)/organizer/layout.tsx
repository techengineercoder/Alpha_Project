export default function OrganizerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-amber-600">Organizer Portal</h2>
      <div className="bg-white rounded-lg shadow p-6">
        {children}
      </div>
    </div>
  );
}
