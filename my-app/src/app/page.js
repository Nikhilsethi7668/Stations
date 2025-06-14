import FadePage from "./components/FadePage";
import MetroDashboard from "./components/MetroDashboard";


export const metadata = {
  title: "Home – Metro Journey Planner",
  description: "Select your source and destination metro stations and find matching trains instantly.",
};


export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <MetroDashboard />
    </main>
  );
}
