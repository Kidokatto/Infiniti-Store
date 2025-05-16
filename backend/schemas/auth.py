from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    phone_number: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    profile_picture: Optional[str] = None 
    cover_photo: Optional[str] = None
    city: Optional[str] = None 
    phone_number: Optional[str] = None  # <-- Agrega esto


    class Config:
        orm_mode = True

class PhoneNumberUpdate(BaseModel):
    phone_number: str
