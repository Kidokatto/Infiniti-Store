from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models.product import Product
from faker import Faker
import random

# Crea una instancia de Faker para generar datos falsos
fake = Faker()

# Categorías y marcas de ejemplo
categories = ['Electrónica', 'Ropa', 'Hogar', 'Juguetes', 'Libros']
brands = ['Samsung', 'Nike', 'Apple', 'Sony', 'Adidas', 'LEGO']

def seed_products(n=20):
    db: Session = SessionLocal()
    for _ in range(n):
        product = Product(
            name=fake.unique.word().capitalize(),
            description=fake.text(max_nb_chars=100),
            price=round(random.uniform(10.0, 500.0), 2),
            stock=random.randint(1, 100),
            category=random.choice(categories),
            brand=random.choice(brands),
            image_url="https://via.placeholder.com/300",  # URL temporal
            is_active=True
        )
        db.add(product)

    db.commit()
    db.close()
    print(f"✅ Se insertaron {n} productos correctamente.")

if __name__ == "__main__":
    seed_products()
