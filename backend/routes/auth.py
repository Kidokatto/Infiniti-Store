from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from sqlalchemy.orm import Session
from database import SessionLocal
from models.auth import User
from schemas.auth import UserResponse, UserLogin
from utils.security import hash_password, verify_password, create_access_token, get_current_user
from schemas.auth import PhoneNumberUpdate

import shutil
import os

router = APIRouter(prefix="/auth")

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    
    token = create_access_token({"sub": str(db_user.id)})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/profile")
async def get_profile(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "profile_picture": current_user.profile_picture,
        "cover_photo": current_user.cover_photo,
        "city": current_user.city,
        "phone_number": current_user.phone_number,  # <--- Agrega esta línea

    }

@router.post("/register", response_model=UserResponse)
async def register(
    username: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    city: str = Form(...),
    phone_number: str = Form(None),  # <-- Agregado aquí
    profile_picture: UploadFile = File(...),
    cover_photo: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if db.query(User).filter(User.username == username).first():
        raise HTTPException(status_code=400, detail="El usuario ya se encuentra en uso")
    
    profile_filename = f"profile_{username}_{profile_picture.filename}"
    cover_filename = f"cover_{username}_{cover_photo.filename}"

    profile_picture_path = os.path.join(UPLOAD_DIR, profile_filename)
    cover_photo_path = os.path.join(UPLOAD_DIR, cover_filename)

    with open(profile_picture_path, "wb") as buffer:
        shutil.copyfileobj(profile_picture.file, buffer)
    with open(cover_photo_path, "wb") as buffer:
        shutil.copyfileobj(cover_photo.file, buffer)

    new_user = User(
        username=username,
        email=email,
        password=hash_password(password),
        city=city,
        phone_number=phone_number,  # <-- Guardar aquí también
        profile_picture=profile_filename,
        cover_photo=cover_filename
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

@router.get("/user/{user_id}")
async def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "profile_picture": user.profile_picture,
        "cover_photo": user.cover_photo,
        "city": user.city,
    }


@router.put("/phone-number")
async def update_phone_number(
    data: PhoneNumberUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    current_user.phone_number = data.phone_number
    db.commit()
    db.refresh(current_user)
    return {"message": "Número de teléfono actualizado correctamente", "phone_number": current_user.phone_number}