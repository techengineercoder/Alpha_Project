export default function TalentBuyerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Talent Buyer Portal</h2>
      <div className="bg-white rounded-lg shadow p-6">
        {children}
      </div>
    </div>
  );
}
