from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    stock: int
    category: str
    brand: Optional[str] = None
    image_url: Optional[str] = None
    user_id: Optional[int] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    category: Optional[str] = None
    brand: Optional[str] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None

class ProductResponse(ProductBase):
    id: int
    created_at: datetime
    is_active: bool
    user_id: int
    user_id: Optional[int] = None  # <-- Importante que sea opcional si en la DB puede ser NULL

    class Config:
        from_attributes = True

class ProductFilters(BaseModel):
    search: Optional[str] = None
    category: Optional[str] = None
    brand: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    in_stock: Optional[bool] = None
    user_id: Optional[int] = None
    
class ProductListResponse(BaseModel):
    products: list[ProductResponse]
    total: int
    page: int
    pages: int

class Config:
    orm_mode = True
    