import React from 'react'
import { Card } from "@/components/dashboard/Card";
import { CardHeader } from "@/components/dashboard/CardHeader";
import { CardTitle } from "@/components/dashboard/CardTitle";
import { CardDescription } from "@/components/dashboard/CardDescription";
import { CardContent } from "@/components/dashboard/CardContent";
import {
    Plane,
    Utensils,
    Hotel,
    DollarSign,
    Sun,
    CloudRain,
    Image,
  } from "lucide-react";

const page = () => {
  return (
    <div> <Card className="col-span-2">
    <CardHeader>
      <CardTitle>Trip to Saint Martin</CardTitle>
      <CardDescription>
        3 days, 2 nights | Budget: $500
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Plane className="h-6 w-6 text-blue-500" />
          <div>
            <p className="font-semibold">Departure</p>
            <p className="text-sm text-gray-500">
              October 26, 2024 - 8:00 AM
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Hotel className="h-6 w-6 text-blue-500" />
          <div>
            <p className="font-semibold">Accommodation</p>
            <p className="text-sm text-gray-500">
              Blue Marine Resort
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Utensils className="h-6 w-6 text-blue-500" />
          <div>
            <p className="font-semibold">Meals</p>
            <p className="text-sm text-gray-500">
              3 meals per day included
            </p>
          </div>
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
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className="bg-gray-100 aspect-square rounded-md flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    <Image className="h-8 w-8 text-gray-400" />
                  </div>
                ))}
              </div>
              <button className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                Upload Photos
              </button>
            </div>
          </CardContent>
        </Card>
  </div>
  )
}

export default page