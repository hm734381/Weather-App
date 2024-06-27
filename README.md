# Weather Microservice

This project is a FastAPI-based weather microservice that integrates with the OpenWeatherMap API to fetch and store weather data in a PostgreSQL database. It provides endpoints to fetch, store, retrieve, and delete weather data based on geographical coordinates.

## Features

- Fetch current weather data from the OpenWeatherMap API
- Store weather data in a PostgreSQL database
- Retrieve stored weather data
- Delete weather data

## Requirements

- Docker
- Docker Compose

## Setup

### 1. Clone the Repository

git clone https://github.com/hm734381/Weather-Microservice.git
cd Weather-Microservice

**2. Run with Docker Compose**
Ensure Docker and Docker Compose are installed on your system. Then, run:

docker-compose up --build

This command will start both the FastAPI application and the PostgreSQL database.

**API Endpoints**
Fetch and Store Weather Data
Endpoint: POST /weather/
Request Body:

{
  "lon": 123.45,
  "lat": 67.89
}

Response:

{
  "message": "Weather data stored successfully"
}

Get Weather Data
Endpoint: GET /get_weather
Query Parameters: lon (float), lat (float)
Response:

{
  "latitude": 67.89,
  "longitude": 123.45,
  "temperature": 20.5,
  "humidity": 80,
  "weather_description": "clear sky"
}

Delete Weather Data
Endpoint: DELETE /delete_weather
Query Parameters: lon (float), lat (float)
Response:

{
  "message": "Successfully deleted"
}

**Project Structure**

.
├── app
│   ├── main.py             # Main application file
│   ├── database.py         # Database setup and functions
│   ├── Dockerfile          # Dockerfile for the FastAPI application
│   ├── requirements.txt    # Python dependencies
│   └── ...
├── docker-compose.yml      # Docker Compose configuration
└── README.md               # Project documentation

**Configuration**

Environment Variables
The following environment variables need to be configured (these are set in the docker-compose.yml):

POSTGRES_USER: PostgreSQL username
POSTGRES_PASSWORD: PostgreSQL password
POSTGRES_DB: PostgreSQL database name
OpenWeatherMap API Key
Replace the placeholder API key in main.py with your own API key from OpenWeatherMap:

python
Copy code
API_KEY = 'your_openweathermap_api_key'

**Running Tests**

To be added.

**Contributing**

Contributions are welcome! Please open an issue or submit a pull request.

**License**

This project is licensed under the MIT License.


This updated `README.md` focuses on setting up and running the project using Docker and Docker Compose, which handles the installation of dependencies automatically.
