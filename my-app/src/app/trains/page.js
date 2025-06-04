export default function TrainsPage({ searchParams }) {
  const id = searchParams.id ?? "";
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-green-700 mb-2">Train Info</h1>
      <p>You selected Train ID: <strong>{id}</strong></p>
      {/* Add more train details later */}
    </div>
  );
}
