import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import TopBar from './TopBar';
import WeatherDisplay from './WeatherDisplay';


const FETCH_AND_STORE_URL = 'http://0.0.0.0:8000/weather/';
const GET_WEATHER_URL = 'http://0.0.0.0:8000/get_weather';
const DELETE_WEATHER_URL = 'http://0.0.0.0:8000/delete_weather';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [infoMessage, setInfoMessage] = useState(null);

  const handleFetchAndStore = async (lon, lat) => {
    try {
      const response = await axios.post(FETCH_AND_STORE_URL, { lon, lat });
      console.log(response.data); 
      setWeatherData(response.data.weather_data);
      setErrorMessage(response.data.message); // Clear any previous errors
    } catch (error) {
      setErrorMessage(error.message); // Handle errors
    }
  };

  const handleGetWeather = async (lon, lat) => {
    try {
      const response = await axios.get(`${GET_WEATHER_URL}?lon=${lon}&lat=${lat}`);
      setWeatherData(response.data);
      setErrorMessage(null); // Clear any previous errors
    } catch (error) {
      setErrorMessage(error.message); // Handle errors
    }
  };

  const handleDeleteWeather = async (lon, lat) => {
    try {
      await axios.delete(`${DELETE_WEATHER_URL}?lon=${lon}&lat=${lat}`);
      setWeatherData(null); // Clear displayed data
      setErrorMessage(null); // Clear any previous errors
    } catch (error) {
      setErrorMessage(error.message); // Handle errors
    }
  };

  return (
    <div className="App">
      <TopBar
        onFetchAndStore={handleFetchAndStore}
        onGetWeather={handleGetWeather}
        onDeleteWeather={handleDeleteWeather}
      />
      {weatherData && <WeatherDisplay weatherData={weatherData} />}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
}

export default App; 
