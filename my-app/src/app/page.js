import MetroDashboard from "./components/MetroDashboard";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-700">Metro Journey Planner</h1>
      <MetroDashboard />
    </main>
  );
}
