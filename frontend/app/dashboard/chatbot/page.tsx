"use client"

import { useState } from "react"
import AuthButton from "@/components/auth/AuthButton"
import { Card } from "@/components/dashboard/Card"
import { CardHeader } from "@/components/dashboard/CardHeader"
import { CardTitle } from "@/components/dashboard/CardTitle"
import { CardDescription } from "@/components/dashboard/CardDescription"
import { CardContent } from "@/components/dashboard/CardContent"

import { Plane, Utensils, Hotel, DollarSign, Sun, CloudRain, Image } from "lucide-react"

export default function TravelPlannerDashboard() {
  return (
    <div className="bg-white  mt-3 mb-3 rounded-2xl shadow-md w-full ">
    <div className="flex flex-col  bg-gray-100  ">
   

     
      <div className="flex-1 overflow-x-hidden overflow-y-auto p-6  bg-gray-100 ">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Trip Summary Card */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Trip to Saint Martin</CardTitle>
              <CardDescription>3 days, 2 nights | Budget: $500</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Plane className="h-6 w-6 text-blue-500" />
                  <div>
                    <p className="font-semibold">Departure</p>
                    <p className="text-sm text-gray-500">October 26, 2024 - 8:00 AM</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Hotel className="h-6 w-6 text-blue-500" />
                  <div>
                    <p className="font-semibold">Accommodation</p>
                    <p className="text-sm text-gray-500">Blue Marine Resort</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Utensils className="h-6 w-6 text-blue-500" />
                  <div>
                    <p className="font-semibold">Meals</p>
                    <p className="text-sm text-gray-500">3 meals per day included</p>
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
                  <span>Oct 26</span>
                  <div className="flex items-center">
                    <Sun className="h-6 w-6 text-yellow-500 mr-2" />
                    <span>28°C</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Oct 27</span>
                  <div className="flex items-center">
                    <Sun className="h-6 w-6 text-yellow-500 mr-2" />
                    <span>29°C</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Oct 28</span>
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
              <CardDescription>Total Budget: $500</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Transportation</span>
                  <span className="font-semibold">$150</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Accommodation</span>
                  <span className="font-semibold">$200</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Food & Drinks</span>
                  <span className="font-semibold">$100</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Activities</span>
                  <span className="font-semibold">$50</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Photo Upload Card */}
          <Card>
            <CardHeader>
              <CardTitle>Photo Upload</CardTitle>
              <CardDescription>Share your memories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-200 aspect-square rounded-md flex items-center justify-center">
                    <Image className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="bg-gray-200 aspect-square rounded-md flex items-center justify-center">
                    <Image className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="bg-gray-200 aspect-square rounded-md flex items-center justify-center">
                    <Image className="h-8 w-8 text-gray-400" />
                  </div>
                </div>
               <AuthButton buttonText="Upload Photos" />
              </div>
            </CardContent>
          </Card>
        </div>
       
      </div>
    </div>
    </div>
  )
}
