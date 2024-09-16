import React, { useState, useEffect } from 'react';
import { FaCloudRain, FaSun, FaCloud, FaSnowflake } from 'react-icons/fa'; 
import axios from 'axios';
import './WeatherApp.css';
import ClearSky from './../assets/clear.jpg';
import Snow from '../assets/snow.jpg';
import Rain from './../assets/rain.jpg';
import Clouds from '../assets/cloudy.jpg';
import Haze from "../assets/haze.jpg"
import { LuHaze } from "react-icons/lu";
const API_KEY = "c5d69756b52c8fc6e911369872bcc261";

const weatherChange = {
  "Clear": ClearSky,
  "Rain": Rain,
  "Snow": Snow,
  "Clouds": Clouds,
  "Haze": Haze
};


const weatherIcons = {
  "Clear": <FaSun style={{ color: 'yellow', marginLeft: '10px' }} />,
  "Rain": <FaCloudRain style={{ color: 'blue', marginLeft: '10px' }} />,
  "Snow": <FaSnowflake style={{ color: 'lightblue', marginLeft: '10px' }} />,
  "Clouds": <FaCloud style={{ color: 'red', marginLeft: '10px' }} />,
  "Haze": <LuHaze style={{ color: 'green', marginLeft: '10px' }} />
};

const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    // Fetch current location and time
    const fetchLocationAndTime = () => {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });
        setCurrentDateTime(new Date().toLocaleString());
      });
    };

    fetchLocationAndTime();
    
   
    const timer = setInterval(() => {
      setCurrentDateTime(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchWeather = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
      setWeatherData(response.data);
      setError("");
    } catch (err) {
      setError('City not found');
      setWeatherData(null);
    }
  };

  function getBackGroundWeather(weather) {
    return weatherChange[weather] || weatherChange['default'];
  }

  return (
    <div className='weather-app' style={{
      backgroundImage: `url(${getBackGroundWeather(weatherData?.weather[0].main)})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div className="header-info">
        {currentLocation && (
          <div className="current-location">
            <p>Latitude: {currentLocation.latitude.toFixed(2)}</p>
            <p>Longitude: {currentLocation.longitude.toFixed(2)}</p>
          </div>
        )}
        <div className="current-time">
          <p>Date & Time: {currentDateTime}</p>
        </div>
      </div>

      <div>
        <h1>Weather App</h1>
        <form onSubmit={fetchWeather}>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            name="city"
            placeholder="Enter city name"
          />
          <button type="submit" className="btn">Get Weather</button>
        </form>
        {error && <p className="error">{error}</p>}
        
        {weatherData && (
          <div className="weather-result mt-5">
            <h2>
              {weatherData.name}
              {/* Display corresponding weather icon */}
              {weatherIcons[weatherData.weather[0].main]}
            </h2>
            <div className="weather-info">
              <p>Temperature: {weatherData.main.temp}°C</p>
              <p>Weather: {weatherData.weather[0].description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;
