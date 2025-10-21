# Parcel Delivery Application

A modern web application for parcel delivery services with real-time tracking and route optimization.

## System Requirements

- Node.js (v18 or higher)
- Python (v3.8 or higher)
- MySQL (v8.0 or higher)
- npm (comes with Node.js)

## Project Structure

```
MY_PROJECT/
├── backend/         # FastAPI backend
└── frontend/        # React frontend (Vite)
```

## Setup Instructions

### 1. Database Setup

1. Install MySQL if you haven't already
2. Log in to MySQL as root
3. Create the database and user:

```sql
mysql -u root -p
```

Then run:
```sql
CREATE DATABASE delivery_db;
CREATE USER 'delivery_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON delivery_db.* TO 'delivery_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a Python virtual environment:
```bash
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Unix or MacOS:
source .venv/bin/activate
```

3. Install the required Python packages:
```bash
pip install fastapi uvicorn[standard] sqlalchemy mysqlclient
```

4. Set up the environment variables (create a .env file in the backend directory):
```
DATABASE_URL=mysql://delivery_user:your_password@localhost/delivery_db
```

5. Initialize the database:
```bash
python -m alembic upgrade head
```

6. Run the backend server:
```bash
uvicorn app.main:app --reload
```

The backend will be running at `http://localhost:8000`

### 3. Frontend Setup

1. Navigate to the project root directory:
```bash
cd ..  # if you're in the backend directory
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The frontend will be running at `http://localhost:5173`

## Available Scripts

In the project directory, you can run:

### Frontend

- `npm run dev` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm run preview` - Previews the production build

### Backend

- `uvicorn app.main:app --reload` - Runs the backend server with hot reload
- `alembic upgrade head` - Updates database to latest migration
- `alembic revision --autogenerate -m "message"` - Creates new database migration

## API Documentation

Once the backend is running, you can access:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Features

- User authentication
- Real-time delivery tracking
- Route optimization using OSRM
- Distance and time calculations
- Interactive booking interface
- Responsive design

## Troubleshooting

### Common Issues

1. Database Connection Error
   - Verify MySQL is running
   - Check credentials in .env file
   - Ensure database and user are created correctly

2. Node.js/npm Issues
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall: 
     ```bash
     rm -rf node_modules
     npm install
     ```

3. Python/Backend Issues
   - Verify virtual environment is activated
   - Ensure all dependencies are installed
   - Check for correct Python version

### Getting Help

If you encounter any issues:
1. Check the error messages in the console
2. Review the logs in both frontend and backend
3. Verify all environment variables are set correctly
4. Ensure all required services (MySQL, etc.) are running

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
