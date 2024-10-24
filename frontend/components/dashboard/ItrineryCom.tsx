"use client";
import React, { useState, useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import {
    MapPin,
    Navigation,
    Utensils,
    Hotel,
    X,
    Car,
    Footprints,
    Bus,
} from "lucide-react";

// Define Location type
interface Location {
    id: string;
    name: string;
    type: "home" | "transport" | "restaurant" | "hotel" | "attraction";
    coordinates: {
        lat: number;
        lng: number;
    };
    address: string;
    description?: string;
}

interface TravelMapProps {
    locations: Location[]; // Accept locations as a prop
}

// Define DirectionsInfo type
interface DirectionsInfo {
    distance: string;
    duration: string;
    mode: google.maps.TravelMode;
}

const TravelMap: React.FC<TravelMapProps> = ({ locations }) => {
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(
        null
    );
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [markers, setMarkers] = useState<{ [key: string]: google.maps.Marker }>(
        {}
    );
    const [directionsRenderer, setDirectionsRenderer] =
        useState<google.maps.DirectionsRenderer | null>(null);
    const [directions, setDirections] = useState<DirectionsInfo | null>(null);
    const [travelMode, setTravelMode] = useState<google.maps.TravelMode | null>(
        null
    );

    // Retrieve current location from localStorage
    const currentLocation = JSON.parse(localStorage.getItem("currentLocation") || "{}");
    const currentLat = currentLocation.lat;
    const currentLng = currentLocation.lng;

    // Push current location to locations array
    if (currentLat && currentLng) {
     //push if current location is not in the locations array
        if (!locations.find((location) => location.coordinates.lat === currentLat && location.coordinates.lng === currentLng)) {
            locations.push({
                id: "0",
                name: "My Location",
                type: "home",
                coordinates: { lat: currentLat, lng: currentLng },
                address: "Current Address",
            });
        }
        
    }

 

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        version: "weekly",
        libraries: ["places"],
      });

      try {
        const google = await loader.load();
        const mapElement = document.getElementById("map");

        if (mapElement) {
          const mapInstance = new google.maps.Map(mapElement, {
            center: locations[0].coordinates,
            zoom: 13,
          });

          const directionsRendererInstance = new google.maps.DirectionsRenderer(
            {
              map: mapInstance,
              suppressMarkers: true, // We'll manage our own markers
            }
          );

          setMap(mapInstance);
          setDirectionsRenderer(directionsRendererInstance);

          // Create markers for each location
          const newMarkers: { [key: string]: google.maps.Marker } = {};

          locations.forEach((location) => {
            const marker = new google.maps.Marker({
              position: location.coordinates,
              map: mapInstance,
              title: location.name,
            });

            marker.addListener("click", () => {
              setSelectedLocation(location);
            });

            newMarkers[location.id] = marker;
          });

          setMarkers(newMarkers);

          // Fit bounds to show all markers
          const bounds = new google.maps.LatLngBounds();
          locations.forEach((location) => {
            bounds.extend(location.coordinates);
          });
          mapInstance.fitBounds(bounds);
        }
      } catch (error) {
        console.error("Error loading map:", error);
      }
    };

    initMap();
  }, [locations]);

  const getDirections = async (destination: Location) => {
    if (!map || !selectedLocation) return;

    const directionsService = new google.maps.DirectionsService();

    try {
      const result = await directionsService.route({
        origin: selectedLocation.coordinates,
        destination: destination.coordinates,
        travelMode: travelMode!,
      });

      if (directionsRenderer && result.routes[0]) {
        directionsRenderer.setDirections(result);

        // Update directions info
        const route = result.routes[0].legs[0];
        setDirections({
          distance: route.distance?.text || "",
          duration: route.duration?.text || "",
          mode: travelMode!,
        });

        // Hide markers along the route
        Object.values(markers).forEach((marker) => {
          marker.setVisible(false);
        });

        // Show only origin and destination markers
        markers[selectedLocation.id]?.setVisible(true);
        markers[destination.id]?.setVisible(true);
      }
    } catch (error) {
      console.error("Error getting directions:", error);
    }
  };

  const clearDirections = () => {
    if (directionsRenderer) {
      directionsRenderer.setDirections({
        routes: [],
        request: {
          origin: "",
          destination: "",
          travelMode: travelMode!,
        },
      });
      setDirections(null);

      // Show all markers again
      Object.values(markers).forEach((marker) => {
        marker.setVisible(true);
      });
    }
  };

  const getTravelModeIcon = (mode: google.maps.TravelMode): JSX.Element => {
    switch (mode) {
      case google.maps.TravelMode.DRIVING:
        return <Car className="w-5 h-5" />;
      case google.maps.TravelMode.WALKING:
        return <Footprints className="w-5 h-5" />;
      case google.maps.TravelMode.TRANSIT:
        return <Bus className="w-5 h-5" />;
      default:
        return <Car className="w-5 h-5" />;
    }
  };

  const getIconForType = (type: Location["type"]): JSX.Element => {
    switch (type) {
      case "transport":
        return <Navigation className="w-5 h-5" />;
      case "restaurant":
        return <Utensils className="w-5 h-5" />;
      case "hotel":
        return <Hotel className="w-5 h-5" />;
      default:
        return <MapPin className="w-5 h-5" />;
    }
  };

  const getColorForType = (type: Location["type"]): string => {
    switch (type) {
      case "transport":
        return "bg-blue-500";
      case "restaurant":
        return "bg-orange-500";
      case "hotel":
        return "bg-purple-500";
      default:
        return "bg-red-500";
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Location List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Locations</h2>
          {locations
            .sort((a, b) => parseInt(a.id) - parseInt(b.id))
            .map((location) => (
              <div
                key={location.id}
                className={`p-4 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors
                  ${
                    selectedLocation?.id === location.id
                      ? "border-blue-500 bg-blue-50"
                      : ""
                  }`}
                onClick={() => {
                setSelectedLocation(location);
                map?.panTo(location.coordinates);
                map?.setZoom(15);
                clearDirections();
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg ${getColorForType(
                    location.type
                  )} text-slate-800`}
                >
                  {getIconForType(location.type)}
                </div>
                <div>
                  <h3 className="font-medium text-slate-800">{location.name}</h3>
                  <p className="text-sm text-gray-600">{location.address}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Map Container */}
        <div className="lg:col-span-2">
          <div id="map" className="w-full h-[600px] rounded-lg shadow-md" />

          {/* Selected Location Details */}
          {selectedLocation && (
            <div className="mt-4 p-4 bg-white rounded-lg border">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg ${getColorForType(
                      selectedLocation.type
                    )} text-gray-700`}
                  >
                    {getIconForType(selectedLocation.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-teal-700">
                      {selectedLocation.name}
                    </h3>
                    <p className="text-gray-600">{selectedLocation.address}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {selectedLocation.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedLocation(null);
                    clearDirections();
                  }}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Directions Controls */}
              <div className="mt-4 space-y-4">
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setTravelMode(google.maps.TravelMode.DRIVING)
                    }
                    className={`p-2 rounded ${
                      travelMode === google.maps.TravelMode.DRIVING
                         ? "bg-gray-700 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    <Car className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setTravelMode(google.maps.TravelMode.WALKING)
                    }
                    className={`p-2 rounded ${
                      travelMode === google.maps.TravelMode.WALKING
                       ? "bg-gray-700 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    <Footprints className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setTravelMode(google.maps.TravelMode.TRANSIT)
                    }
                    className={`p-2 rounded ${
                      travelMode === google.maps.TravelMode.TRANSIT
                        ? "bg-gray-700 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    <Bus className="w-5 h-5" />
                  </button>
                </div>

                {directions && (
                  <div className="text-sm text-gray-600">
                    <p>Distance: {directions.distance}</p>
                    <p>Duration: {directions.duration}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4">
                  {locations
                    .filter((loc) => loc.id !== selectedLocation.id)
                    .map((location) => (
                      <button
                        key={location.id}
                        onClick={() => getDirections(location)}
                        className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors"
                      >
                        Get Directions to {location.name}
                      </button>
                    ))}
                  {directions && (
                    <button
                      onClick={clearDirections}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Clear Directions
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TravelMap;

 // Sample locations - replace with your data
  /*
  const locations: Location[] = [
    {
      id: "1",
      name: "My Location",
      type: "home",
      coordinates: { lat: 52.47677170000001, lng: -1.903438 },
      address: "123 Main St, New York, NY",
     
    },
    {
        id: "2",
        name: "Central Station",
        type: "transport",
        coordinates: { lat:  52.47547679999999, lng: -1.9003098 },
        address: "123 Main St, New York, NY",
        description: "Main transportation hub",
      },
   
  ];
  "use client";
import React, { useState, useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import {
  MapPin,
  Navigation,
  Utensils,
  Hotel,
  X,
  Car,
  Footprints,
  Bus,
} from "lucide-react";

// Define Location type
interface Location {
  id: string;
  name: string;
  type: "home" | "transport" | "restaurant" | "hotel" | "attraction";
  coordinates: {
    lat: number;
    lng: number;
  };
  address: string;
  description?: string;
}

interface TravelMapProps {
  locations: Location[]; // Accept locations as a prop
}

// Define DirectionsInfo type
interface DirectionsInfo {
  distance: string;
  duration: string;
  mode: google.maps.TravelMode;
}

const TravelMap: React.FC<TravelMapProps> = ({locations})=> {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<{ [key: string]: google.maps.Marker }>(
    {}
  );
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer | null>(null);
  const [directions, setDirections] = useState<DirectionsInfo | null>(null);
  const [travelMode, setTravelMode] = useState<google.maps.TravelMode | null>(
    null
  );
  //console.log(locations);
//retrive current location from  localStorage.setItem("currentLocation", JSON.stringify(geolocation.coordinates));
    const currentLocation = JSON.parse(localStorage.getItem("currentLocation") || "{}");
    const currentLat = currentLocation.lat;
    const currentLng = currentLocation.lng;

 

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        version: "weekly",
        libraries: ["places"],
      });

      try {
        const google = await loader.load();
        const mapElement = document.getElementById("map");

        if (mapElement) {
          const mapInstance = new google.maps.Map(mapElement, {
            center: locations[0].coordinates,
            zoom: 13,
          });

          const directionsRendererInstance = new google.maps.DirectionsRenderer(
            {
              map: mapInstance,
              suppressMarkers: true, // We'll manage our own markers
            }
          );

          setMap(mapInstance);
          setDirectionsRenderer(directionsRendererInstance);

          // Create markers for each location
          const newMarkers: { [key: string]: google.maps.Marker } = {};

          locations.forEach((location) => {
            const marker = new google.maps.Marker({
              position: location.coordinates,
              map: mapInstance,
              title: location.name,
            });

            marker.addListener("click", () => {
              setSelectedLocation(location);
            });

            newMarkers[location.id] = marker;
          });

          setMarkers(newMarkers);

          // Fit bounds to show all markers
          const bounds = new google.maps.LatLngBounds();
          locations.forEach((location) => {
            bounds.extend(location.coordinates);
          });
          mapInstance.fitBounds(bounds);
        }
      } catch (error) {
        console.error("Error loading map:", error);
      }
    };

    initMap();
  }, [locations]);

  const getDirections = async (destination: Location) => {
    if (!map || !selectedLocation) return;

    const directionsService = new google.maps.DirectionsService();

    try {
      const result = await directionsService.route({
        origin: selectedLocation.coordinates,
        destination: destination.coordinates,
        travelMode: travelMode!,
      });

      if (directionsRenderer && result.routes[0]) {
        directionsRenderer.setDirections(result);

        // Update directions info
        const route = result.routes[0].legs[0];
        setDirections({
          distance: route.distance?.text || "",
          duration: route.duration?.text || "",
          mode: travelMode!,
        });

        // Hide markers along the route
        Object.values(markers).forEach((marker) => {
          marker.setVisible(false);
        });

        // Show only origin and destination markers
        markers[selectedLocation.id]?.setVisible(true);
        markers[destination.id]?.setVisible(true);
      }
    } catch (error) {
      console.error("Error getting directions:", error);
    }
  };

  const clearDirections = () => {
    if (directionsRenderer) {
      directionsRenderer.setDirections({
        routes: [],
        request: {
          origin: "",
          destination: "",
          travelMode: travelMode!,
        },
      });
      setDirections(null);

      // Show all markers again
      Object.values(markers).forEach((marker) => {
        marker.setVisible(true);
      });
    }
  };

  const getTravelModeIcon = (mode: google.maps.TravelMode): JSX.Element => {
    switch (mode) {
      case google.maps.TravelMode.DRIVING:
        return <Car className="w-5 h-5" />;
      case google.maps.TravelMode.WALKING:
        return <Footprints className="w-5 h-5" />;
      case google.maps.TravelMode.TRANSIT:
        return <Bus className="w-5 h-5" />;
      default:
        return <Car className="w-5 h-5" />;
    }
  };

  const getIconForType = (type: Location["type"]): JSX.Element => {
    switch (type) {
      case "transport":
        return <Navigation className="w-5 h-5" />;
      case "restaurant":
        return <Utensils className="w-5 h-5" />;
      case "hotel":
        return <Hotel className="w-5 h-5" />;
      default:
        return <MapPin className="w-5 h-5" />;
    }
  };

  const getColorForType = (type: Location["type"]): string => {
    switch (type) {
      case "transport":
        return "bg-blue-500";
      case "restaurant":
        return "bg-orange-500";
      case "hotel":
        return "bg-purple-500";
      default:
        return "bg-red-500";
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <h1 className="text-2xl font-bold mb-6">Travel Itinerary</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Locations</h2>
          {locations.map((location) => (
            <div
              key={location.id}
              className={`p-4 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors
                ${
                  selectedLocation?.id === location.id
                    ? "border-blue-500 bg-blue-50"
                    : ""
                }`}
              onClick={() => {
                setSelectedLocation(location);
                map?.panTo(location.coordinates);
                map?.setZoom(15);
                clearDirections();
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg ${getColorForType(
                    location.type
                  )} text-white`}
                >
                  {getIconForType(location.type)}
                </div>
                <div>
                  <h3 className="font-medium">{location.name}</h3>
                  <p className="text-sm text-gray-600">{location.address}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

   
        <div className="lg:col-span-2">
          <div id="map" className="w-full h-[600px] rounded-lg shadow-md" />

        
          {selectedLocation && (
            <div className="mt-4 p-4 bg-white rounded-lg border">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg ${getColorForType(
                      selectedLocation.type
                    )} text-white`}
                  >
                    {getIconForType(selectedLocation.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {selectedLocation.name}
                    </h3>
                    <p className="text-gray-600">{selectedLocation.address}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {selectedLocation.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedLocation(null);
                    clearDirections();
                  }}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

      
              <div className="mt-4 space-y-4">
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setTravelMode(google.maps.TravelMode.DRIVING)
                    }
                    className={`p-2 rounded ${
                      travelMode === google.maps.TravelMode.DRIVING
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    <Car className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setTravelMode(google.maps.TravelMode.WALKING)
                    }
                    className={`p-2 rounded ${
                      travelMode === google.maps.TravelMode.WALKING
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    <Footprints className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setTravelMode(google.maps.TravelMode.TRANSIT)
                    }
                    className={`p-2 rounded ${
                      travelMode === google.maps.TravelMode.TRANSIT
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    <Bus className="w-5 h-5" />
                  </button>
                </div>

                {directions && (
                  <div className="text-sm text-gray-600">
                    <p>Distance: {directions.distance}</p>
                    <p>Duration: {directions.duration}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  {locations
                    .filter((loc) => loc.id !== selectedLocation.id)
                    .map((location) => (
                      <button
                        key={location.id}
                        onClick={() => getDirections(location)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Get Directions to {location.name}
                      </button>
                    ))}
                  {directions && (
                    <button
                      onClick={clearDirections}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Clear Directions
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TravelMap;
  */
