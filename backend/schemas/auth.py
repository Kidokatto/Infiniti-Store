from pydantic import BaseModel

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

    class Config:
        orm_mode = True
