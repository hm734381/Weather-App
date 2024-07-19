from sqlalchemy import create_engine, Column, Integer, Float, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import logging


# DAtaBase Setup
DATABASE_URL = "postgresql://postgres:postgres@postgresdb/weather_db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

#Logging Configuration
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


def init_database():
    Base.metadata.create_all(bind=engine)

#PostgreSQL Integration
class WeatherData(Base):
    __tablename__ =  'weather_data'
    id = Column(Integer, primary_key=True)
    longitude = Column(Float)
    latitude = Column(Float)
    temperature = Column(Float)
    humidity = Column(Integer)
    weather_description = Column(String)


def save_weather_data(db, weather_data: WeatherData):    
    try:
        db.add(weather_data)
        db.commit()
        logger.info(f"Weather data saved successfully for lat={weather_data.latitude}, lon={weather_data.longitude}")
        return True
    except Exception as e:
        logger.error(f"Failed to save weather data for lat={weather_data.latitude}, lon={weather_data.longitude}: {str(e)}")
        raise
    finally:
        db.close()


def get_weather_data(db, lon: float, lat: float):
    query = db.query(WeatherData).filter(WeatherData.longitude == lon, WeatherData.latitude == lat)
    logger.info(f"Executing query: {str(query)}")
    result = query.first()
    if result:
        logger.info(f"Weather data found for lat={lat}, lon={lon}: {result}")
    else:
        logger.info(f"No weather data found for lat={lat}, lon={lon}")
    return result


def delete_weather_data(db, lon: float, lat: float):
    query = db.query(WeatherData).filter(WeatherData.longitude == lon, WeatherData.latitude == lat)
    record = query.first()
    if record:
        try:
            db.delete(record)
            db.commit()
            logger.info(f"Weather data deleted successfully for lat={lat}, lon={lon}")
            return True
        except Exception as e:
            logger.error(f"Failed to delete weather data for lat={lat}, lon={lon}: {str(e)}")
            raise
        finally:
            db.close()
    else:
        logger.info(f"No weather data found for lat={lat}, lon={lon}")
        return False