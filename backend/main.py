from fastapi import FastAPI
from database import Base, engine
from routes import auth, product, chat
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn

app = FastAPI()

# Montar carpeta de archivos estáticos
app.mount("/static", StaticFiles(directory="uploads"), name="static")
app.mount("/product-images", StaticFiles(directory="product_images"), name="product-images")


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Ajusta si usas otro puerto para Vite
    allow_credentials=True,
    allow_methods=["*"],
            allow_headers=["*"],
        )

app.include_router(auth.router)
app.include_router(product.router)
app.include_router(chat.router)  # Incluir la ruta de chat

Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
