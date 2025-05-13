from fastapi import APIRouter, Depends, HTTPException, Query, Form, File, UploadFile
import os
from sqlalchemy.orm import Session
import uuid
from sqlalchemy import or_, and_
from typing import Optional
import math
from database import SessionLocal
from models.product import Product
from schemas.product import (
    ProductCreate, 
    ProductUpdate, 
    ProductResponse, 
    ProductListResponse,
    ProductFilters
)

router = APIRouter(prefix="/products", tags=["products"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=ProductListResponse)
def get_products(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    brand: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    in_stock: Optional[bool] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Product).filter(Product.is_active == True)
    
    if search:
        search_filter = or_(
            Product.name.ilike(f"%{search}%"),
            Product.description.ilike(f"%{search}%"),
            Product.category.ilike(f"%{search}%"),
            Product.brand.ilike(f"%{search}%")
        )
        query = query.filter(search_filter)
    
    if category:
        query = query.filter(Product.category == category)
    
    if brand:
        query = query.filter(Product.brand == brand)
    
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    
    if in_stock is not None:
        if in_stock:
            query = query.filter(Product.stock > 0)
        else:
            query = query.filter(Product.stock == 0)
    
    total = query.count()
    
    skip = (page - 1) * limit
    products = query.offset(skip).limit(limit).all()
    
    pages = math.ceil(total / limit)
    
    return ProductListResponse(
        products=products,
        total=total,
        page=page,
        pages=pages
    )

@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Product.category).distinct().all()
    return [cat[0] for cat in categories if cat[0]]

@router.get("/brands")
def get_brands(db: Session = Depends(get_db)):
    brands = db.query(Product.brand).distinct().all()
    return [brand[0] for brand in brands if brand[0]]

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.post("/", response_model=ProductResponse)
def create_product(
    name: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    stock: int = Form(...),
    category: str = Form(...),
    brand: str = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Crear carpeta si no existe
    image_dir = "product_images"
    os.makedirs(image_dir, exist_ok=True)

    # Generar nombre de archivo único
    ext = os.path.splitext(image.filename)[-1]
    unique_filename = f"{uuid.uuid4().hex}{ext}"

    # Guardar imagen
    image_path = os.path.join(image_dir, unique_filename)
    with open(image_path, "wb") as buffer:
        buffer.write(image.file.read())

    # Construir URL accesible públicamente
    image_url = f"/product-images/{unique_filename}"

    # Crear producto en DB
    db_product = Product(
        name=name,
        description=description,
        price=price,
        stock=stock,
        category=category,
        brand=brand,
        image_url=image_url
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product
@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product: ProductUpdate,
    db: Session = Depends(get_db)
):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = product.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_product, field, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product

@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db_product.is_active = False 
    db.commit()
    return {"message": "Product deleted successfully"}