from database import Base
from sqlalchemy import Column, Integer, String, Boolean

# Ye hamara table ka structure hai
class Todo(Base):
    __tablename__ = "todos" # Database mein table ka naam

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String) # <--- YE WALI LINE ADD KAREIN
    is_completed = Column(Boolean, default=False)