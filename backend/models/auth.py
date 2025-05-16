from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    profile_picture = Column(String(255), nullable=True)
    cover_photo = Column(String(255), nullable=True)
    city = Column(String(100), nullable=True)
    products = relationship("Product", back_populates="user")
    phone_number = Column(String(20), nullable=True)