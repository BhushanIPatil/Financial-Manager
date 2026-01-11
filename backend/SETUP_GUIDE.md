# FastAPI Backend - Complete Setup Guide

## 🎯 Quick Start (5 Minutes)

### Step 1: Prerequisites Check
```powershell
# Check Python version (need 3.9+)
python --version

# Check if SQL Server is running
Get-Service MSSQL*

# Check ODBC Driver
python -c "import pyodbc; print(pyodbc.drivers())"
```

### Step 2: Setup Virtual Environment
```powershell
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\activate

# You should see (venv) in your prompt
```

### Step 3: Install Dependencies
```powershell
pip install -r requirements.txt
```

This will install:
- FastAPI & Uvicorn
- SQLAlchemy & PyODBC
- JWT & Security libraries
- Pydantic validation
- All other dependencies

### Step 4: Configure Database
The `.env` file is already configured for `localhost\SQLEXPRESS` with Windows Authentication.

**If you need SQL Server Authentication:**
Edit `.env` and change:
```env
DB_TRUSTED_CONNECTION=no
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### Step 5: Initialize Database
```powershell
python init_db.py
```

This creates:
- Database: `FinancialManagerDB`
- All 9 tables (users, incomes, expenses, etc.)

### Step 6: Run the API
```powershell
python run.py
```

The API will start at:
- **Main API**: http://localhost:8000
- **Swagger Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 📊 Testing the API

### Method 1: Using Swagger UI (Recommended)
1. Open http://localhost:8000/docs
2. Click "Try it out" on any endpoint
3. Fill in the request body
4. Click "Execute"

### Method 2: Using curl

**1. Register a user:**
```bash
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123",
    "full_name": "Test User"
  }'
```

**2. Login:**
```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser&password=password123"
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**3. Use the token for protected endpoints:**
```bash
curl -X GET "http://localhost:8000/api/income/" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Method 3: Using Postman

1. Import the API collection (or create requests manually)
2. Set base URL: `http://localhost:8000`
3. For protected routes, add Header:
   - Key: `Authorization`
   - Value: `Bearer YOUR_ACCESS_TOKEN`

---

## 🔗 Connecting to Frontend

### Update Frontend API Configuration

In your React frontend, create an API service file:

```typescript
// src/services/api/client.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

### Replace Mock Data Services

```typescript
// Before (Mock):
const incomes = MOCK_INCOME;

// After (Real API):
const { data } = await apiClient.get('/income/');
const incomes = data;
```

### Example: Income Service

```typescript
// src/services/api/incomeService.ts
import apiClient from './client';
import type { Income } from '@/types';

export const incomeService = {
  getAll: () => apiClient.get<Income[]>('/income/'),
  
  getById: (id: string) => apiClient.get<Income>(`/income/${id}`),
  
  create: (data: Omit<Income, 'id' | 'user_id' | 'created_at' | 'updated_at'>) =>
    apiClient.post<Income>('/income/', data),
  
  update: (id: string, data: Partial<Income>) =>
    apiClient.put<Income>(`/income/${id}`, data),
  
  delete: (id: string) => apiClient.delete(`/income/${id}`),
};
```

---

## 🛠️ Database Management

### View Database
```sql
-- Connect to SQL Server Management Studio (SSMS)
-- Server: localhost\SQLEXPRESS
-- Database: FinancialManagerDB

-- View all tables
SELECT * FROM INFORMATION_SCHEMA.TABLES

-- View users
SELECT * FROM users

-- View incomes
SELECT * FROM incomes
```

### Reset Database
```powershell
# Drop all tables and recreate
python
>>> from app.core.database import drop_db, init_db
>>> drop_db()  # ⚠️ WARNING: Deletes all data
>>> init_db()  # Creates fresh tables
```

### Backup Database
```sql
BACKUP DATABASE FinancialManagerDB
TO DISK = 'C:\Backup\FinancialManagerDB.bak'
```

---

## 🔒 Security Configuration

### Change Secret Key (IMPORTANT for production)
```powershell
# Generate new secret key
python -c "import secrets; print(secrets.token_hex(32))"

# Update .env file
SECRET_KEY=your_new_generated_key
```

### Configure CORS for Production
In `.env`:
```env
CORS_ORIGINS=["https://yourdomain.com","https://www.yourdomain.com"]
```

---

## 📝 API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login (returns JWT token)

### Income (Protected)
- `GET /api/income/` - List all incomes
- `GET /api/income/{id}` - Get one income
- `POST /api/income/` - Create income
- `PUT /api/income/{id}` - Update income
- `DELETE /api/income/{id}` - Delete income

### Expenses (Protected)
- Same pattern as Income: GET, POST, PUT, DELETE
- Endpoint: `/api/expenses/`

### Investments (Protected)
- Same pattern: GET, POST, PUT, DELETE
- Endpoint: `/api/investments/`

### Credit Cards (Protected)
- Same pattern: GET, POST, PUT, DELETE
- Endpoint: `/api/credit-cards/`

### Loans (Protected)
- Same pattern: GET, POST, PUT, DELETE
- Endpoint: `/api/loans/`

### Assets (Protected)
- Same pattern: GET, POST, PUT, DELETE
- Endpoint: `/api/assets/`

### Liabilities (Protected)
- Same pattern: GET, POST, PUT, DELETE
- Endpoint: `/api/liabilities/`

### Settings (Protected)
- `GET /api/settings/` - Get user settings
- `PUT /api/settings/` - Update settings

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to database"

**Solution 1: Check SQL Server is running**
```powershell
Get-Service MSSQL*
# If stopped:
Start-Service MSSQL$SQLEXPRESS
```

**Solution 2: Check connection string**
```powershell
# Test connection
python -c "from app.core.database import engine; print(engine.url); engine.connect()"
```

### Issue: "ODBC Driver not found"

**Download and install:**
https://docs.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server

Then verify:
```python
import pyodbc
print(pyodbc.drivers())
```

### Issue: "Login failed"

**If using Windows Authentication:**
Ensure `.env` has:
```env
DB_TRUSTED_CONNECTION=yes
```

**If using SQL Authentication:**
```env
DB_TRUSTED_CONNECTION=no
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### Issue: "Module not found"

**Reinstall dependencies:**
```powershell
pip install --force-reinstall -r requirements.txt
```

### Issue: "Port 8000 already in use"

**Change port in .env:**
```env
API_PORT=8001
```

Or kill the process:
```powershell
# Find process
netstat -ano | findstr :8000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

---

## 🚀 Production Deployment

### 1. Update Environment Variables
```env
DEBUG=False
API_RELOAD=False
SECRET_KEY=<strong-secret-key>
CORS_ORIGINS=["https://yourdomain.com"]
```

### 2. Use Production Server
```powershell
pip install gunicorn

gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### 3. Setup Reverse Proxy (Nginx)
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 4. Enable HTTPS
```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d api.yourdomain.com
```

---

## 📊 Performance Optimization

### Database Indexing
Already configured on:
- User email & username
- All user_id foreign keys

### Connection Pooling
Adjust in `database.py` if needed:
```python
engine = create_engine(
    settings.database_url,
    pool_size=20,
    max_overflow=40
)
```

### Caching
Add Redis for caching:
```bash
pip install redis

# In code:
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
```

---

## ✅ Verification Checklist

- [ ] Python 3.9+ installed
- [ ] SQL Server running
- [ ] ODBC Driver 17 installed
- [ ] Virtual environment created
- [ ] Dependencies installed
- [ ] Database initialized
- [ ] API running on port 8000
- [ ] Swagger docs accessible
- [ ] Can register a user
- [ ] Can login and get token
- [ ] Can access protected endpoints

---

## 📞 Need Help?

1. Check the Swagger docs: http://localhost:8000/docs
2. Review error messages in console
3. Check database with SSMS
4. Verify .env configuration

---

**🎉 You're all set! The backend is ready to integrate with your React frontend.**
