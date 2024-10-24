"use client";

import { useState } from "react";
import AuthButton from "@/components/auth/AuthButton";
import { Card } from "@/components/dashboard/Card";
import { CardHeader } from "@/components/dashboard/CardHeader";
import { CardTitle } from "@/components/dashboard/CardTitle";
import { CardDescription } from "@/components/dashboard/CardDescription";
import { CardContent } from "@/components/dashboard/CardContent";
import WeatherForecast from "@/components/dashboard/WeatherNotifications";
import BudgetCalculatorCard from "@/components/dashboard/CalculatorCard";
import TravelBudgetCalculator from "@/components/dashboard/calculator";
import CustomModal from "@/components/CustomModal";

import {
  Plane,
  Utensils,
  Hotel,
  DollarSign,
  Sun,
  CloudRain,
  Image,
} from "lucide-react";

interface TripDetailsProps {
  title: string;
  duration: string;
  budget: number;
  departureDate: string;
  departureTime: string;
  hotel: string;
  mealsIncluded: string;
}

const TripDetails: React.FC<TripDetailsProps> = ({
  title = "Trip to Saint Martin",
  duration = "3 days, 2 nights",
  budget = 500,
  departureDate = "October 26, 2024",
  departureTime = "8:00 AM",
  hotel = "Blue Marine Resort",
  mealsIncluded = "3 meals per day included",
}) => {
  return (
    <div className="container mx-auto p-4 ">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Trip Details Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>
              {duration} | Budget: ${budget}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Plane className="h-6 w-6 text-blue-500 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-500">Departure</p>
                  <p className="text-sm text-gray-500">
                    {departureDate} - {departureTime}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Hotel className="h-6 w-6 text-blue-500 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-500">Accommodation</p>
                  <p className="text-sm text-gray-500">{hotel}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Utensils className="h-6 w-6 text-blue-500 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-500">Meals</p>
                  <p className="text-sm text-gray-500">{mealsIncluded}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
            <CardDescription>Total Budget: ${budget}</CardDescription>
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
};

export default TripDetails;
/*
 
      */
