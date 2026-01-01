import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# 1. .env file load karein
load_dotenv()

# 2. Neon URL (Jo aap .env mein likhengi)
DATABASE_URL = os.getenv("DATABASE_URL")

# 3. Engine aur Session setup
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 4. Database connect karne ka rasta
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()