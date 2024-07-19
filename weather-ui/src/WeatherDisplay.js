import React from 'react';
import './index.css';


function WeatherDisplay({ weatherData }) {
  if (!weatherData) return null;

  const { latitude, longitude, temperature, humidity, weather_description } = weatherData;

  return (
    <div className="weather-display bg-white shadow-md rounded-md p-4">
      <h2 className="text-xl font-semibold mb-2">Weather Data</h2>
      <p className="mb-1">Latitude: {latitude}</p>
      <p className="mb-1">Longitude: {longitude}</p>
      <p className="mb-1">Temperature: {temperature != null ? temperature.toFixed(2) : 'N/A'}&deg;C</p>
      <p className="mb-1">Humidity: {humidity}%</p>
      <p className="mb-1">Description: {weather_description}</p>
    </div>
  );
}

export default WeatherDisplay;
