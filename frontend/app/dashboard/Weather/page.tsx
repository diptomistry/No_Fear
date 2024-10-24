import TravelMap from "@/components/dashboard/ItrineryCom";

export default function MapPage() {
  return (
    <div className="min-h-screen w-full">
      <nav className="h-16 border-b px-4 flex items-center">
        <h1 className="text-xl font-semibold">Travel Itinerary Map</h1>
      </nav>
      <TravelMap />
    </div>
  );
}