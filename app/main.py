from fastapi import FastAPI, Depends, HTTPException
from database import WeatherData, save_weather_data, get_weather_data, delete_weather_data, SessionLocal, init_database
from typing import Optional
from pydantic import BaseModel
import requests
from starlette.middleware.cors import CORSMiddleware
from fastapi_keycloak import FastAPIKeycloak


app = FastAPI()

origins = ["http://localhost:3000", "http://0.0.0.0:3000"]  

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

keycloak = FastAPIKeycloak(
    server_url="http://localhost:8080/auth/",
    client_id="fastapi-backend",
    client_secret="Vheu3D9tjTW4cZXZHIJ1EvSxN3eougJY",
    realm="Weather-MICROSERVICE",
    callback_uri="http://localhost:8000/callback"
)

app.add_middleware(keycloak.middleware)


#Weather API Integration
API_KEY = '4d397e3ecffad1653b7c7f5fb2b2f1d3'
BASE_URL =  "https://api.openweathermap.org/data/2.5/weather"

def fetch_weather_data(lon, lat, exclude="minutely,hourly"): 
    url = f"{BASE_URL}?lat={lat}&lon={lon}&exclude={exclude}&appid={API_KEY}"

    reponse = requests.get(url)
    return reponse.json()

#Initialize database
init_database()



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
    existing_data = get_weather_data(db, data.lon, data.lat)
    if existing_data:
        raise HTTPException(status_code=400, detail='Weather data already exists')
    
    weather_api_data = fetch_weather_data(data.lat, data.lon)
    if not weather_api_data or "main" not in weather_api_data or "weather" not in weather_api_data:
        raise HTTPException(status_code=404, detail='Trouble fetching weather Data')

    weather_data_db = WeatherData(
        latitude=data.lat,
        longitude=data.lon,
        temperature=weather_api_data["main"]["temp"]- 273.0,
        humidity=weather_api_data["main"]["humidity"],
        weather_description=weather_api_data["weather"][0]["description"]
    )
    Result = save_weather_data(db, weather_data_db)
    
    if Result:
        weather_response = WeatherResposne(
            latitude=weather_data_db.latitude,
            longitude=weather_data_db.longitude,
            temperature=weather_data_db.temperature,
            humidity=weather_data_db.humidity,
            weather_description=weather_data_db.weather_description
        )
        return {
            "message": "Weather data stored successfully",
            "weather_data": weather_response.dict()
        }
    


@app.get('/get_weather', response_model=WeatherResposne)
def get_weather(lon: float, lat: float, db: SessionLocal() = Depends(get_db)):
    stored_weather_data = get_weather_data(db, lon, lat)
    if stored_weather_data is None:
        raise HTTPException(status_code=404, detail="Weather data was not found")
    

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

 