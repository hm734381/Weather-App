import React, { useState } from 'react';
import './index.css';
import KeycloakService from './KeycloakService';


function TopBar({ onFetchAndStore, onGetWeather, onDeleteWeather }) {
  const [lon, setLon] = useState(null); // State variable for longitude
  const [lat, setLat] = useState(null); // State variable for latitude

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'lon') {
      setLon(value);
    } else if (name === 'lat') {
      setLat(value);
    }
  };

  const handleFetchAndStore = async () => {
    if (!lon || !lat) {
      alert('Please enter both latitude and longitude values.');
      return;
    }
    onFetchAndStore(lon, lat); // Call parent function with values
  };

  const handleGetWeather = async () => {
    if (!lon || !lat) {
      alert('Please enter both latitude and longitude values.');
      return;
    }
    onGetWeather(lon, lat); // Call parent function with values
  };

  const handleDeleteWeather = async () => {
    if (!lon || !lat) {
      alert('Please enter both latitude and longitude values.');
      return;
    }
    onDeleteWeather(lon, lat); // Call parent function with values
  };

  const handleLogout = () => {
    KeycloakService.doLogout();
  };
  return (
    <div className="top-bar flex items-center justify-center space-x-4">
      <input
        type="number"
        name="lon"
        placeholder="Longitude"
        onChange={handleInputChange}
        className="border border-gray-300 rounded-md px-2 py-1"
      />
      <input
        type="number"
        name="lat"
        placeholder="Latitude"
        onChange={handleInputChange}
        className="border border-gray-300 rounded-md px-2 py-1"
      />
      <button onClick={handleFetchAndStore} className="bg-green-500 text-white px-4 py-2 rounded-md">Fetch & Store Data</button>
      <button onClick={handleGetWeather} className="bg-gray-800 text-white px-4 py-2 rounded-md">Get Data</button>
      <button onClick={handleDeleteWeather} className="bg-orange-500 text-white px-4 py-2 rounded-md">Delete Data</button>
      <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700">Logout</button>
    </div>
  );
}

export default TopBar;
