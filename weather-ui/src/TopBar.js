import React, { useState } from 'react';

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

  return (
    <div className="top-bar">
      <input
        type="number"
        name="lon"
        placeholder="Longitude"
        onChange={handleInputChange}
      />
      <input
        type="number"
        name="lat"
        placeholder="Latitude"
        onChange={handleInputChange}
      />
      <button onClick={handleFetchAndStore}>Fetch & Store Data</button>
      <button onClick={handleGetWeather}>Get Data</button>
      <button onClick={handleDeleteWeather}>Delete Data</button>
    </div>
  );
}

export default TopBar;
