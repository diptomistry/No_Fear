'use client'
import { Card } from '@/components/dashboard/Card';
import { CardContent } from '@/components/dashboard/CardContent';
import { CardDescription } from '@/components/dashboard/CardDescription';
import { CardHeader } from '@/components/dashboard/CardHeader';
import { CardTitle } from '@/components/dashboard/CardTitle';
import WeatherForecast from '@/components/dashboard/WeatherNotifications';
import { CloudRain, Hotel, Plane, Sun, Utensils } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const page = () => {

    const {id } = useParams();

    const [data, setData] = useState(null);
    const [itinerary, setItinerary] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }

            try {
                const response = await fetch(`http://localhost:3000/api/trip/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const result = await response.json();
                console.log(result);
                
                setData(result.trip);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        const fetchItienary = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }

            try {
                const response = await fetch(`http://localhost:3000/api/trip/${id}/itinerary`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const result = await response.json();
                console.log(result);
                
                setItinerary(result);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
        fetchItienary();    
    },[]);
  return (
    <div className="container mx-auto p-4 ">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Trip Details Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{data?.destination}</CardTitle>
            <CardDescription>
              {data?.duration} | Budget: ${data?.budget}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Plane className="h-6 w-6 text-blue-500 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-500">Departure</p>
                  <p className="text-sm text-gray-500">
                    {data?.departureDate} - {data?.departureTime}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Hotel className="h-6 w-6 text-blue-500 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-500">Accommodation</p>
                  <p className="text-sm text-gray-500">{data?.hotel}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Utensils className="h-6 w-6 text-blue-500 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-500">Meals</p>
                  <p className="text-sm text-gray-500">{data?.mealsIncluded}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {itinerary && <Card className='text-black'>
            <CardHeader>
                Itinerary
            </CardHeader>
            <CardContent>
                {itinerary?.data.map((item) => (
                    <div className='text-black' key={item.id}>
                        <p className='text-black'>{item.itineraryDetails.activity}</p>
                        {/* <p className='text-black'>{item.itineraryDetails.location}</p> */}
                    </div>
                ))}
            </CardContent>
        </Card>}

        {/* Weather Card */}
        <Card>
          <CardHeader>
            <CardTitle>Weather Forecast</CardTitle>
            <CardDescription>Saint Martin, Next 3 Days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Oct 26</span>
                <div className="flex items-center">
                  <Sun className="h-6 w-6 text-yellow-500 mr-2" />
                  <span>28°C</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Oct 27</span>
                <div className="flex items-center">
                  <Sun className="h-6 w-6 text-yellow-500 mr-2" />
                  <span>29°C</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Oct 28</span>
                <div className="flex items-center">
                  <CloudRain className="h-6 w-6 text-gray-500 mr-2" />
                  <span>26°C</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget Overview Card */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Overview</CardTitle>
            <CardDescription>Total Budget: ${data?.budget}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Transportation</span>
                <span className="font-semibold text-gray-500">$150</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Accommodation</span>
                <span className="font-semibold text-gray-500">$200</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Food & Drinks</span>
                <span className="font-semibold text-gray-500">$100</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Activities</span>
                <span className="font-semibold text-gray-500">$50</span>
              </div>
            </div>
          </CardContent>
        </Card>

        
      </div>
      <div>
      <WeatherForecast />
      </div>
    </div>
  );
}

export default page