# 🚀 Quick Start Guide - Financial Manager

## ⚡ One-Click Start

### Windows Users
Double-click **`START_SERVERS.bat`** to start both backend and frontend automatically!

---

## 📋 Manual Start (Step by Step)

### Step 1: Start Backend API

**Option A - Using PowerShell:**
```powershell
cd backend
python run.py
```

**Option B - Using Command Prompt:**
```cmd
cd backend
python run.py
```

**Backend will be available at:**
- API: http://localhost:8000
- Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

---

### Step 2: Start Frontend WebApp

**Open a NEW terminal window**

**Option A - Using PowerShell:**
```powershell
cd webapp
npm run dev
```

**Option B - Using Command Prompt:**
```cmd
cd webapp
npm run dev
```

**Frontend will be available at:**
- App: http://localhost:5173

---

## 🎯 Access the Application

Once both servers are running:

1. **Open your browser**
2. **Navigate to**: http://localhost:5173
3. **Start managing your family finances!**

---

## 🔍 Verify Everything is Running

### Check Backend
Visit: http://localhost:8000/docs
- You should see the interactive API documentation

### Check Frontend
Visit: http://localhost:5173
- You should see the Financial Manager dashboard

---

## 🛑 Stop Servers

### Stop Backend
In the backend terminal:
- Press `Ctrl + C`
- Or close the terminal window

### Stop Frontend
In the frontend terminal:
- Press `Ctrl + C`
- Or close the terminal window

---

## 🔧 First Time Setup

If this is your first time running the project:

### Backend Setup
```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Create database
python create_database.py

# Initialize tables
python init_db.py

# Start server
python run.py
```

### Frontend Setup
```bash
cd webapp

# Install Node dependencies
npm install

# Start dev server
npm run dev
```

---

## 📁 Project Structure

```
Financial Manager/
├── backend/           # Python FastAPI Backend
│   └── python run.py  # Start backend server
│
├── webapp/            # React Frontend
│   └── npm run dev    # Start frontend server
│
└── START_SERVERS.bat  # One-click start (Windows)
```

---

## ⚙️ Configuration

### Backend Configuration
Edit `backend/.env`:
```env
DB_SERVER=localhost\SQLEXPRESS
DB_NAME=FinancialManagerDB
SECRET_KEY=your-secret-key
API_PORT=8000
CORS_ORIGINS="http://localhost:5173,http://localhost:3000"
```

### Frontend Configuration
No configuration needed for development!

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: `ModuleNotFoundError`
```bash
cd backend
pip install -r requirements.txt
```

**Problem**: Database connection error
1. Ensure SQL Server is running
2. Check `backend/.env` configuration
3. Run `python create_database.py`

**Problem**: Port 8000 already in use
- Stop other applications using port 8000
- Or change `API_PORT` in `.env`

### Frontend Issues

**Problem**: `npm: command not found`
- Install Node.js from https://nodejs.org

**Problem**: Dependencies not found
```bash
cd webapp
npm install
```

**Problem**: Port 5173 already in use
- Stop other Vite servers
- Vite will auto-increment to 5174, 5175, etc.

---

## 📚 Next Steps

After starting the servers:

1. **Add Family Members**
   - Go to "Family Members" page
   - Add yourself, family members

2. **Track Finances**
   - Add income and expenses
   - Associate with family members

3. **Manage Family Loans**
   - Go to "Family Loans" page
   - Track loans between family members

4. **View Dashboard**
   - See consolidated family finances
   - Check recommendations

---

## 🎓 Documentation

- **Main README**: `README.md`
- **Backend Guide**: `backend/README.md`
- **Frontend Guide**: `webapp/README.md`
- **Family Features**: `FAMILY_FINANCIAL_MANAGEMENT_GUIDE.md`
- **Project Structure**: `PROJECT_STRUCTURE.md`

---

## 💡 Tips

✅ **Always start backend first**, then frontend  
✅ **Keep both terminals open** while using the app  
✅ **Use API docs** at `/docs` for testing API directly  
✅ **Check browser console** for frontend errors  
✅ **Check terminal output** for backend errors  

---

## 🎉 You're Ready!

Both servers should now be running:
- ✅ Backend API at http://localhost:8000
- ✅ Frontend App at http://localhost:5173

**Start managing your family finances! 🏦**
