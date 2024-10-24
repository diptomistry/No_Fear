"use client";
import React, { useState } from 'react';
import { Calendar, Search, Users, Edit2, Plus } from 'lucide-react';
import { Card } from '@/components/dashboard/Card';
import { CardContent } from '@/components/dashboard/CardContent';

interface Location {
  name: string;
  distance: string;
  image: string;
  source: string;
  description: string;
}

interface Attraction {
  title: string;
  image: string;
  rating: string;
  source: 'Tripadvisor' | 'Wanderlog';
}

const TravelPlanner = () => {
  const [destination, setDestination] = useState('');
  const [attractions, setAttractions] = useState<Attraction[]>([]);

  return (
    <div className="max-w-full">
      {/* Header Section */}
      <div className="relative h-[300px] overflow-hidden">
        <img 
          src="/api/placeholder/1200/300"
          alt="Destination cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h1 className="text-3xl font-bold mb-4">Trip to {destination || 'Your Destination'}</h1>
              
              {/* Trip Planning Controls */}
              <div className="flex gap-4 items-center">
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                  <Calendar size={20} />
                  Add trip dates
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                  <Users size={20} />
                  Add travelers
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Explore Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Explore</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-coral-500 text-white rounded-full hover:bg-coral-600">
            <Search size={18} />
            Browse all
          </button>
        </div>

        {/* Attractions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Things Card */}
          <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="relative h-48">
              <img 
                src="/api/placeholder/400/200"
                alt="Top attractions"
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent >
              <h3 className="text-xl font-semibold mb-2">Top things to do</h3>
              <p className="text-gray-600 mb-2">Tripadvisor Top 20</p>
              <div className="flex items-center gap-2">
                <img 
                  src="/api/placeholder/24/24"
                  alt="Tripadvisor"
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm text-gray-600">Tripadvisor</span>
              </div>
            </CardContent>
          </Card>

          {/* Hotel Search Card */}
          <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="relative h-48">
              <img 
                src="/api/placeholder/400/200"
                alt="Hotel room"
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent >
              <h3 className="text-xl font-semibold mb-2">Search hotels with transparent pricing</h3>
              <p className="text-gray-600 mb-2">Unlike most sites, we don't sort based on commissions</p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-coral-500 flex items-center justify-center">
                  <Search size={14} className="text-white" />
                </div>
                <span className="text-sm text-gray-600">Wanderlog</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Edit Button */}
        <button className="fixed bottom-6 right-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50">
          <Edit2 size={20} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default TravelPlanner;