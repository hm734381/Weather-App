import React from 'react';

function WeatherDisplay({ weatherData }) {
  if (!weatherData) return null;

  const { latitude, longitude, temperature, humidity, weather_description } = weatherData;

  return (
    <div className="weather-display">
      <h2>Weather Data</h2>
      <p>Latitude: {latitude}</p>
      <p>Longitude: {longitude}</p>
      <p>Temperature: {temperature != null ? temperature.toFixed(2) : 'N/A'}&deg;C</p>  {/* Format temperature to 2 decimal places */}
      <p>Humidity: {humidity}%</p>
      <p>Description: {weather_description}</p>
    </div>
  );
}

export default WeatherDisplay;
