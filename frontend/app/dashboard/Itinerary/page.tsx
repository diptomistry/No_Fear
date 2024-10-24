"use client";
import React, { useEffect, useState } from "react";
interface TransportOption {
  type: string;
  details: string;
  cost: number;
}

interface AccommodationOption {
  name: string;
  location: string;
  cost: number;
  photo: string; // URL to the accommodation photo
}

interface TripResponse {
  transportOptions: TransportOption[];
  accommodationOptions: AccommodationOption[];
}

const Page = () => {
  const [response, setResponse] = useState<TripResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/trip/generate/public`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              destination: "coxs bazar",
              userLat: "23.7266878",
              userLang: "90.3880214",
              tripDuration: 4,
              budgetPreference: "Budget",
            }),
          }
        );
        const data = await res.json();
        console.log(data);
        setResponse(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-5">Trip Information</h1>
      {response ? (
        <div className="space-y-5">
          <div className="bg-gray-100 p-5 rounded-md shadow-md">
            <h2 className="text-2xl font-semibold mb-3 text-gray-700">
              Transport Options
            </h2>
            {response.transportOptions &&
            response.transportOptions.length > 0 ? (
              <ul className="list-disc list-inside">
                {response.transportOptions.map((option, index) => (
                  <li key={index} className="mb-2 text-gray-700">
                    <strong>{option.type}</strong>: {option.details} (Price:{" "}
                    {option.cost} BDT)
                  </li>
                ))}
              </ul>
            ) : (
              <p>No transport options available.</p>
            )}
          </div>

          <div className="bg-gray-100 p-5 rounded-md shadow-md">
            <h2 className="text-2xl font-semibold mb-3 text-gray-800">
              Accommodation Options
            </h2>
            {response.accommodationOptions &&
            response.accommodationOptions.length > 0 ? (
              <div className="space-y-4">
                {response.accommodationOptions.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 border border-gray-200 rounded-md shadow-sm"
                  >
                    <img
                      src={option.photo}
                      alt={option.name}
                      className="w-32 h-32 object-cover rounded-md mr-4"
                    />
                    <div>
                      <strong className="text-lg text-gray-800">
                        {option.name}
                      </strong>
                      <p className="text-gray-800">{option.location}</p>
                      <p className="text-gray-800">Price: {option.cost} BDT</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No accommodation options available.</p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-lg">Loading...</p>
      )}
    </div>
  );
};

export default Page;
