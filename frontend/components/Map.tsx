// "use client";

// import React, { useEffect, useState } from "react";
// import { GoogleMap, Marker, DirectionsRenderer, InfoWindow, useLoadScript } from "@react-google-maps/api";

// interface Location {
//     lat: number;
//     lng: number;
//     label?: string;
//     info?: string; // Additional info for the location
// }

// interface MapProps {
//     locations: Location[]; // Array of itinerary locations
//     zoom?: number;         // Optional zoom level
//     center?: Location;     // Optional default center point
// }

// const Map: React.FC<MapProps> = ({ locations, zoom = 12, center }) => {
//     const { isLoaded } = useLoadScript({
//         googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
//     });

//     const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
//     const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

//     useEffect(() => {
//         if (locations.length > 1) {
//             const directionsService = new google.maps.DirectionsService();
//             directionsService.route(
//                 {
//                     origin: locations[0], // Start at the first location
//                     destination: locations[locations.length - 1], // End at the last location
//                     waypoints: locations.slice(1, -1).map((location) => ({
//                         location: { lat: location.lat, lng: location.lng },
//                         stopover: true,
//                     })),
//                     travelMode: google.maps.TravelMode.DRIVING,
//                 },
//                 (result, status) => {
//                     if (status === google.maps.DirectionsStatus.OK) {
//                         setDirections(result);
//                     } else {
//                         console.error(`error fetching directions: ${status}`);
//                     }
//                 }
//             );
//         }
//     }, [locations]);

//     if (!isLoaded) {
//         return <div>Loading Map...</div>;
//     }

//     return (
//         <div className="w-full h-[500px] relative shadow-lg rounded-lg overflow-hidden">
//             <GoogleMap
//                 zoom={zoom}
//                 center={center || locations[0]}
//                 mapContainerClassName="w-full h-full"
//             >
//                 {locations.map((location, index) => (
//                     <Marker
//                         key={index}
//                         position={{ lat: location.lat, lng: location.lng }}
//                         label={location.label}
//                         onClick={() => setSelectedLocation(location)}
//                     />
//                 ))}

//                 {selectedLocation && (
//                     <InfoWindow
//                         position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
//                         onCloseClick={() => setSelectedLocation(null)}
//                     >
//                         <div>
//                             <h2>{selectedLocation.label}</h2>
//                             <p>{selectedLocation.info}</p>
//                         </div>
//                     </InfoWindow>
//                 )}

//                 {directions && <DirectionsRenderer directions={directions} />}
//             </GoogleMap>
//         </div>
//     );
// };

// export default Map;
// components/Map.tsx
// components/Map.tsx
import React, { useEffect, useRef } from "react";

interface MapProps {
  locations: { lat: number; lng: number; name: string }[];
}

const Map: React.FC<MapProps> = ({ locations }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure google object exists before using it
    if (!mapRef.current || !window.google || locations.length === 0) return;

    const map = new google.maps.Map(mapRef.current, {
      center: { lat: locations[0].lat, lng: locations[0].lng },
      zoom: 13,
    });

    locations.forEach((location) => {
      new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map,
        title: location.name,
      });
    });
  }, [locations]);

  return <div ref={mapRef} style={{ height: "500px", width: "100%" }} />;
};

export default Map;
