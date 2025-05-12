from pydantic import BaseModel
from typing import Optional

# Para el registro
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

# Para el login
class UserLogin(BaseModel):
    username: str
    password: str

# Para la respuesta del perfil
class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    profile_picture: Optional[str] = None  # Ruta de la foto de perfil
    cover_photo: Optional[str] = None  # Ruta de la foto de portada
    city: Optional[str] = None  # Ciudad

    class Config:
        orm_mode = True
