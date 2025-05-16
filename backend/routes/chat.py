from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict
from models.mensaje import Message
from database import SessionLocal
from datetime import datetime

router = APIRouter()
connections: Dict[int, WebSocket] = {}  # Mapea user_id -> conexión

@router.websocket("/ws/chat/{user_id}")
async def websocket_chat(websocket: WebSocket, user_id: int):
    await websocket.accept()
    connections[user_id] = websocket
    try:
        while True:
            data = await websocket.receive_json()
            receiver_id = data["receiver_id"]
            message = data["message"]

            # Guardar mensaje en la BD
            db = SessionLocal()
            msg = Message(
                sender_id=user_id,
                receiver_id=receiver_id,
                content=message,
                timestamp=datetime.utcnow()
            )
            db.add(msg)
            db.commit()
            db.close()

            # Enviar mensaje al destinatario si está conectado
            if receiver_id in connections:
                await connections[receiver_id].send_json({
                    "sender_id": user_id,
                    "message": message
                })
    except WebSocketDisconnect:
        connections.pop(user_id)
