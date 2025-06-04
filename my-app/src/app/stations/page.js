export default function StationsPage({ searchParams }) {
  const name = searchParams.name ?? "";
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-2">Station Info</h1>
      <p>You selected: <strong>{name}</strong></p>
      {/* Add more detailed info here later */}
    </div>
  );
}
