from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    username: str
    email: str
    password: str


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

    class Config:
        from_attributes = True