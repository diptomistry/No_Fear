"use client";
import React, { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";

const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY as string;
const units = "imperial";
const temperatureSymbol = units === "imperial" ? "°F" : "°C";

// Fixed dates for the tour
const tourDates = [
  
  "2024-12-30",
  "2024-12-3",
  "2024-12-04",
  "2024-12-03",
];

interface WeatherData {
  time_epoch: number;
  temp_f: number;
  temp_c: number;
  condition: {
    text: string;
    icon: string;
  };
}

interface ForecastDay {
  date: string;
  day: {
    maxtemp_f: number;
    maxtemp_c: number;
    mintemp_f: number;
    mintemp_c: number;
    condition: {
      text: string;
      icon: string;
    };
    daily_chance_of_rain: number;
    avghumidity: number;
    maxwind_mph: number;
  };
  hour: WeatherData[];
}

interface WeatherResponse {
  location: {
    name: string;
  };
  forecast: {
    forecastday: ForecastDay[];
  };
}

const isBadWeather = (day: ForecastDay) => {
  // Define conditions that make weather unsuitable for touring
  return (
    day.day.daily_chance_of_rain > 50 ||
    day.day.maxwind_mph > 20 ||
    day.day.condition.text.toLowerCase().includes("rain") ||
    day.day.condition.text.toLowerCase().includes("storm") ||
    day.day.condition.text.toLowerCase().includes("snow")
  );
};

const WeatherForecast: React.FC = () => {
  const [weatherData, setWeatherData] = useState<ForecastDay[]>([]);
  const [cityName, setCityName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    setError("");
    setLoading(true);

    const lat = 37.7749;
    const lon = -122.4194;

    try {
      const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=8`;

      const response = await fetch(apiUrl);
      const data: WeatherResponse = await response.json();

      if (data?.forecast?.forecastday.length) {
        setWeatherData(data.forecast.forecastday);
        setCityName(data.location.name);
      } else {
        setError("Weather data not found for the location.");
      }
    } catch (err) {
      setError("Error fetching weather data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen  flex items-center justify-center ">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
      </div>
    );
  }

  const hasBadWeatherDays = weatherData.some((day) => isBadWeather(day));

  return (
    <div className="min-h-screen  p-4 md:p-8  ">
      <div className="max-w-6xl mx-auto">
        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700  py-3 rounded relative">
            {error}
          </div>
        ) : (
          <>
            <h2 className="text-2xl md:text-4xl font-bold text-stone-800 mb-4 text-center">
              Tour Weather Forecast - {cityName}
            </h2>

            {hasBadWeatherDays && (
              <div className="mb-6 bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-r">
                <div className="flex items-center">
                  <AlertCircle className="h-6 w-6 text-yellow-500 mr-2" />
                  <p className="text-yellow-700 font-medium">
                    Weather conditions might not be ideal for touring on some
                    days. Please check the daily forecasts below.
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
              {weatherData.map((day, index) => {
                const isUnfavorable = isBadWeather(day);
                return (
                  <div
                    key={index}
                    className={`bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 transition-transform duration-300 hover:transform hover:scale-105 
                      ${isUnfavorable ? "border-2 border-yellow-500" : ""}`}
                  >
                    <div className="flex flex-col items-center">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {formatDate(tourDates[index])}
                      </h3>
                      <img
                        src={day.day.condition.icon}
                        alt="Weather Icon"
                        className="w-16 h-16 object-contain mb-4"
                      />
                      <p className="text-3xl font-bold text-gray-900 mb-2">
                        {Math.round(day.day.maxtemp_f)}
                        {temperatureSymbol}
                      </p>
                      <p className="text-gray-600 mb-2">
                        Low: {Math.round(day.day.mintemp_f)}
                        {temperatureSymbol}
                      </p>
                      <p className="text-gray-700 text-center font-medium mb-2">
                        {day.day.condition.text}
                      </p>
                      <div className="w-full space-y-1 text-sm text-gray-600">
                        <p>Rain Chance: {day.day.daily_chance_of_rain}%</p>
                        <p>Humidity: {day.day.avghumidity}%</p>
                        <p>Wind: {day.day.maxwind_mph} mph</p>
                      </div>
                      {isUnfavorable && (
                        <div className="mt-4 text-yellow-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          <span className="text-sm">Not ideal for touring</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherForecast;
