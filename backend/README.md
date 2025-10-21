# Python FastAPI Backend with Firebase Auth and SQL Database

This is the backend service for the React frontend application. It uses FastAPI for the API endpoints, Firebase Admin for authentication verification, and SQLAlchemy with PostgreSQL for data storage.

## Setup Instructions

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Set up your environment variables in a .env file:
```env
DATABASE_URL=postgresql://user:password@localhost/dbname
FIREBASE_CREDENTIALS_PATH=path/to/your/firebase-credentials.json
```

3. Initialize the database:
```bash
alembic init alembic
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

4. Run the development server:
```bash
uvicorn app.main:app --reload
```

## API Endpoints

### User Management
- POST /api/users - Create a new user
- GET /api/users/me - Get current user information
- PUT /api/users/me - Update current user information

### Authentication
- All endpoints require a valid Firebase ID token in the Authorization header
- Token format: Bearer <firebase_id_token>

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── auth.py
│   ├── database.py
│   ├── models.py
│   └── schemas.py
├── alembic/
│   └── versions/
├── alembic.ini
└── requirements.txt
```