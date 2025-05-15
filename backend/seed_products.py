from sqlalchemy.orm import Session
from database import SessionLocal
from models.product import Product
from models.auth import User
from faker import Faker
import random

fake = Faker()

categories = ['Electrónica', 'Ropa', 'Hogar', 'Juguetes', 'Libros']
brands = ['Samsung', 'Nike', 'Apple', 'Sony', 'Adidas', 'LEGO']

def seed_products(n=20):
    db: Session = SessionLocal()
    
    users = db.query(User).all()
    
    if not users:
        print("No hay usuarios en la base de datos para asignar productos")
        return
    
    for _ in range(n):
        user = random.choice(users)
        
        product = Product(
            name=fake.unique.word().capitalize(),
            description=fake.text(max_nb_chars=100),
            price=round(random.uniform(10.0, 500.0), 2),
            stock=random.randint(1, 100),
            category=random.choice(categories),
            brand=random.choice(brands),
            image_url="https://via.placeholder.com/300", 
            is_active=True,
            user_id=user.id  
        )
        db.add(product)

    db.commit()
    db.close()
    print(f"✅ Se insertaron {n} productos correctamente.")

if __name__ == "__main__":
    seed_products()