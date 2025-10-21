from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os
import urllib.parse

load_dotenv()

# URL encode the password to handle special characters
password = urllib.parse.quote_plus("suhana2005")
SQLALCHEMY_DATABASE_URL = f"mysql://root:{password}@localhost:3306/myproject_db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()