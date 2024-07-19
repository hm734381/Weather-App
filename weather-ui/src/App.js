import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import TopBar from './TopBar';
import WeatherDisplay from './WeatherDisplay';
import './index.css';
import KeycloakService from './KeycloakService';


const FETCH_AND_STORE_URL = 'http://0.0.0.0:8000/weather/';
const GET_WEATHER_URL = 'http://0.0.0.0:8000/get_weather';
const DELETE_WEATHER_URL = 'http://0.0.0.0:8000/delete_weather';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [errorMessage, setErrorMessage]  = useState(null);
  const [infoMessage, setInfoMessage] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      KeycloakService.initKeycloak(() => {
        setIsAuthenticated(true);
      });
    }
  }, [isAuthenticated]);

  const resetfields = () => {
    setErrorMessage(null);
    setInfoMessage(null);
    setWeatherData(null);
  }

  const handleFetchAndStore = async (lon, lat) => {
    
    resetfields();

    try {
      const response = await axios.post(FETCH_AND_STORE_URL, { lon, lat });
      setWeatherData(response.data.weather_data);
      setInfoMessage(response.data.message)
      
    } catch (error) {
      setErrorMessage(error.response.data.detail); 
  };
  };

  const handleGetWeather = async (lon, lat) => {
    
    resetfields();

    try {
      const response = await axios.get(`${GET_WEATHER_URL}?lon=${lon}&lat=${lat}`);
      setWeatherData(response.data);
      setInfoMessage(null);
    } catch (error) {
      setErrorMessage(error.response.data.detail); 
  };
  };

  const handleDeleteWeather = async (lon, lat) => {

    resetfields();

    try {
      setInfoMessage(null);
      const response  = await axios.delete(`${DELETE_WEATHER_URL}?lon=${lon}&lat=${lat}`);
      setInfoMessage(response.data);
    } catch (error) {
      setErrorMessage(error.response.data.detail); 
    }
  };




  if (!isAuthenticated) {
    return <div>Login Required</div>;  // Display login required message
  }
  else {
  return (
    <div className="App min-h-screen bg-gray-100 py-8 px-4">
      <TopBar
        onFetchAndStore={handleFetchAndStore}
        onGetWeather={handleGetWeather}
        onDeleteWeather={handleDeleteWeather}
      />
      {weatherData && <WeatherDisplay weatherData={weatherData} />}
      {errorMessage&& <p className='error-message text-red-500'>{errorMessage}</p>}
      {infoMessage && <p className="info-message text-green-500">{infoMessage}</p>}
    </div>
  ); };
}


export default App; 
