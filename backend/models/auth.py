from sqlalchemy import Column, Integer, String
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    profile_picture = Column(String(255), nullable=True)  # Ruta o nombre del archivo de la foto de perfil
    cover_photo = Column(String(255), nullable=True)  # Ruta o nombre del archivo de la foto de portada
    city = Column(String(100), nullable=True)  # Ciudad en la que vive el usuario
