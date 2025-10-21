# Quick Start Guide

This guide will help you get the Parcel Delivery Application up and running quickly.

## Quick Setup (Windows)

1. **Clone the repository**
```powershell
git clone [your-repo-url]
cd MY_PROJECT
```

2. **Set up MySQL**
```powershell
# Start MySQL if not running
net start mysql

# Create database (using your MySQL password)
mysql -u root -p
```
In MySQL prompt:
```sql
CREATE DATABASE delivery_db;
CREATE USER 'delivery_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON delivery_db.* TO 'delivery_user'@'localhost';
FLUSH PRIVILEGES;
exit;
```

3. **Backend Setup**
```powershell
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv .venv
.venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn[standard] sqlalchemy mysqlclient

# Create .env file
echo "DATABASE_URL=mysql://delivery_user:your_password@localhost/delivery_db" > .env

# Initialize database
python -m alembic upgrade head

# Start backend server
uvicorn app.main:app --reload
```

4. **Frontend Setup** (in a new terminal)
```powershell
# Navigate to project root
cd ..

# Install dependencies
npm install

# Start development server
npm run dev
```

## Verifying Installation

1. Backend API should be running at: http://localhost:8000
2. Frontend should be running at: http://localhost:5173
3. API documentation available at: http://localhost:8000/docs

## Common Quick Fixes

### Backend Issues
```powershell
# Reinstall dependencies
pip uninstall -r requirements.txt -y
pip install -r requirements.txt

# Reset database
mysql -u root -p delivery_db < backend/init_db.sql
```

### Frontend Issues
```powershell
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules
npm install
```

## Next Steps

1. Check the main README.md for detailed documentation
2. Explore the API documentation at /docs
3. Review the codebase structure in both frontend and backend directories

For detailed setup instructions and troubleshooting, refer to the main README.md file.