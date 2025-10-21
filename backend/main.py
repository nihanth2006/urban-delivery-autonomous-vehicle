from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from pydantic import BaseModel
import uvicorn

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React app's address
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class UserCreate(BaseModel):
    email: str
    firebase_uid: str
    full_name: str
    phone_number: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    phone_number: str
    firebase_uid: str

# Security
security = HTTPBearer()

# Routes
@app.get("/")
async def root():
    return {"message": "API is running"}

@app.post("/api/users", response_model=UserResponse)
async def create_user(user: UserCreate, credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        # Here you would normally verify the Firebase token
        # and store the user in your database
        
        # For now, we'll just return the user data
        return {
            "id": 1,  # This would normally be from your database
            "email": user.email,
            "full_name": user.full_name,
            "phone_number": user.phone_number,
            "firebase_uid": user.firebase_uid
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/users/{user_id}")
async def get_user(user_id: str, credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        # Here you would normally fetch the user from your database
        # For now, we'll return mock data
        return {
            "id": 1,
            "email": "user@example.com",
            "full_name": "Test User",
            "phone_number": "1234567890",
            "firebase_uid": user_id
        }
    except Exception as e:
        raise HTTPException(status_code=404, detail="User not found")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)