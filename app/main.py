from fastapi import FastAPI, Depends, HTTPException
from database import WeatherData, save_weather_data, get_weather_data, delete_weather_data, SessionLocal, init_database
from typing import Optional
from pydantic import BaseModel
import requests


#Weather API Integration
API_KEY = '4d397e3ecffad1653b7c7f5fb2b2f1d3'
BASE_URL =  "https://api.openweathermap.org/data/2.5/weather"

def fetch_weather_data(lon, lat, exclude="minutely,hourly"): 
    url = f"{BASE_URL}?lat={lat}&lon={lon}&exclude={exclude}&appid={API_KEY}"

    reponse = requests.get(url)
    return reponse.json()

#Initialize database
init_database()

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

#Pydantic Model for the request and reponse 
class WeatherRequest(BaseModel):
    lon: float
    lat: float

class WeatherResposne(BaseModel):
    latitude: float
    longitude: float
    temperature: float
    humidity: float
    weather_description: str


# FastAPI Endpoints

@app.post('/weather/')
def fetch_and_store_weather(data:WeatherRequest, db:SessionLocal() = Depends(get_db)):
    weather_api_data = fetch_weather_data(data.lat, data.lon)
    if not weather_api_data or "main" not in weather_api_data or "weather" not in weather_api_data:
        raise HTTPException(status_code=404, detail='Weather data not found')

    weather_data_db = WeatherData(
        latitude=data.lat,
        longitude=data.lon,
        temperature=weather_api_data["main"]["temp"]- 273.0,
        humidity=weather_api_data["main"]["humidity"],
        weather_description=weather_api_data["weather"][0]["description"]
    )
    Result = save_weather_data(db, weather_data_db)
    
    if Result:
       return {"message": "Weather data stored successfully"}
    raise HTTPException(status_code=400, detail='Weather data already exists')

@app.get('/get_weather', response_model=WeatherResposne)
def get_weather(lon: float, lat: float, db: SessionLocal() = Depends(get_db)):
    stored_weather_data = get_weather_data(db, lon, lat)
    if stored_weather_data is None:
        raise HTTPException(status_code=404, detail="Weather data not found")
    

    weather_response = WeatherResposne(
        latitude=stored_weather_data.latitude,
        longitude=stored_weather_data.longitude,
        temperature=stored_weather_data.temperature,
        humidity=stored_weather_data.humidity,
        weather_description=stored_weather_data.weather_description
    )
    
    
    return weather_response.dict()

@app.delete('/delete_weather')
def delete_weather(lon: float, lat: float, db:SessionLocal() = Depends(get_db)):
    deleted = delete_weather_data(db, lon, lat)
    if deleted is False:
        raise HTTPException(status_code=404, detail="Weather data not found")
    else:
        return ('Succesfully deleted')

