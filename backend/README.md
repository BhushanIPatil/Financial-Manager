# Financial Manager - FastAPI Backend

Production-ready FastAPI backend for the Financial Manager application with SQL Server integration.

## 🚀 Features

- **FastAPI** - Modern, fast web framework
- **SQL Server** - Production database with SQLAlchemy ORM
- **JWT Authentication** - Secure token-based auth
- **Pydantic Validation** - Request/response validation
- **CORS Enabled** - Ready for frontend integration
- **RESTful API** - Complete CRUD operations
- **Auto Documentation** - Swagger UI & ReDoc

## 📦 Installation

### Prerequisites

- Python 3.9+
- SQL Server (localhost\SQLEXPRESS or any SQL Server instance)
- ODBC Driver 17 for SQL Server

### Install ODBC Driver (if not installed)

**Windows:**
Download from [Microsoft](https://docs.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server)

**Linux:**
```bash
curl https://packages.microsoft.com/keys/microsoft.asc | sudo apt-key add -
curl https://packages.microsoft.com/config/ubuntu/$(lsb_release -rs)/prod.list | sudo tee /etc/apt/sources.list.d/mssql-release.list
sudo apt-get update
sudo ACCEPT_EULA=Y apt-get install -y msodbcsql17
```

### Setup

1. **Create Virtual Environment**
```bash
cd backend
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Linux/Mac)
source venv/bin/activate
```

2. **Install Dependencies**
```bash
pip install -r requirements.txt
```

3. **Configure Environment**
```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env with your SQL Server details
# Default: localhost\SQLEXPRESS with Windows Authentication
```

4. **Initialize Database**
```bash
python init_db.py
```

This will create the database and all tables automatically.

## 🏃 Running the Application

### Development Server
```bash
# Using run.py
python run.py

# Or using uvicorn directly
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📚 API Documentation

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepassword",
  "full_name": "John Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/x-www-form-urlencoded

username=johndoe&password=securepassword
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### Using Protected Endpoints

All other endpoints require authentication. Include the token in the Authorization header:

```http
Authorization: Bearer {your_access_token}
```

### Income Endpoints

- `GET /api/income/` - Get all incomes
- `GET /api/income/{id}` - Get specific income
- `POST /api/income/` - Create income
- `PUT /api/income/{id}` - Update income
- `DELETE /api/income/{id}` - Delete income

### Expense Endpoints

- `GET /api/expenses/` - Get all expenses
- `GET /api/expenses/{id}` - Get specific expense
- `POST /api/expenses/` - Create expense
- `PUT /api/expenses/{id}` - Update expense
- `DELETE /api/expenses/{id}` - Delete expense

### Investment Endpoints

- `GET /api/investments/` - Get all investments
- `GET /api/investments/{id}` - Get specific investment
- `POST /api/investments/` - Create investment
- `PUT /api/investments/{id}` - Update investment
- `DELETE /api/investments/{id}` - Delete investment

### Credit Card Endpoints

- `GET /api/credit-cards/` - Get all credit cards
- `GET /api/credit-cards/{id}` - Get specific card
- `POST /api/credit-cards/` - Create credit card
- `PUT /api/credit-cards/{id}` - Update credit card
- `DELETE /api/credit-cards/{id}` - Delete credit card

### Loan Endpoints

- `GET /api/loans/` - Get all loans
- `GET /api/loans/{id}` - Get specific loan
- `POST /api/loans/` - Create loan
- `PUT /api/loans/{id}` - Update loan
- `DELETE /api/loans/{id}` - Delete loan

### Asset Endpoints

- `GET /api/assets/` - Get all assets
- `GET /api/assets/{id}` - Get specific asset
- `POST /api/assets/` - Create asset
- `PUT /api/assets/{id}` - Update asset
- `DELETE /api/assets/{id}` - Delete asset

### Liability Endpoints

- `GET /api/liabilities/` - Get all liabilities
- `GET /api/liabilities/{id}` - Get specific liability
- `POST /api/liabilities/` - Create liability
- `PUT /api/liabilities/{id}` - Update liability
- `DELETE /api/liabilities/{id}` - Delete liability

### Settings Endpoints

- `GET /api/settings/` - Get user settings
- `PUT /api/settings/` - Update user settings

## 🗄️ Database Schema

### Users
- id, email, username, hashed_password
- full_name, is_active, is_superuser
- created_at, updated_at

### Incomes
- user_id, source, amount, category
- is_recurring, recurrence, date
- description

### Expenses
- user_id, title, amount, category
- is_fixed, is_recurring, recurrence
- date, description, tags

### Investments
- user_id, name, type
- invested_amount, current_value, quantity
- purchase_date, notes

### Credit Cards
- user_id, name, bank_name
- outstanding_balance, credit_limit
- interest_rate, due_date
- minimum_payment, is_active

### Loans
- user_id, name, lender, type
- principal_amount, outstanding_balance
- interest_rate, emi_amount
- start_date, end_date

### Assets
- user_id, name, type, value, date

### Liabilities
- user_id, name, type, amount, date

### User Settings
- user_id, currency, locale, theme
- monthly_budget, emergency_fund_goal
- credit_card_strategy
- notification preferences

## 🔒 Security

- **Password Hashing**: Bcrypt
- **JWT Tokens**: HS256 algorithm
- **Token Expiry**: 30 minutes (configurable)
- **CORS**: Configured for frontend origins
- **SQL Injection**: Protected by SQLAlchemy ORM
- **Input Validation**: Pydantic schemas

## 🧪 Testing

Visit the Swagger UI at http://localhost:8000/docs to test all endpoints interactively.

## 📝 Environment Variables

```env
# Database
DB_SERVER=localhost\SQLEXPRESS
DB_NAME=FinancialManagerDB
DB_TRUSTED_CONNECTION=yes

# API
API_HOST=0.0.0.0
API_PORT=8000
API_RELOAD=True

# Security
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
CORS_ORIGINS=["http://localhost:5173"]

# Application
APP_NAME=Financial Manager API
APP_VERSION=1.0.0
DEBUG=True
```

## 🚀 Production Deployment

1. **Update .env for production**
   - Set `DEBUG=False`
   - Use strong `SECRET_KEY`
   - Configure production database
   - Set appropriate CORS origins

2. **Use Production ASGI Server**
```bash
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

3. **Enable HTTPS**
   - Use reverse proxy (Nginx/Apache)
   - Configure SSL certificates

## 📦 Project Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── routes/          # API endpoints
│   │   │   ├── auth.py
│   │   │   ├── income.py
│   │   │   ├── expense.py
│   │   │   └── ...
│   │   ├── api.py          # Router aggregation
│   │   └── deps.py         # Dependencies
│   ├── core/
│   │   ├── config.py       # Configuration
│   │   ├── database.py     # Database setup
│   │   └── security.py     # Auth utilities
│   ├── crud/
│   │   ├── base.py         # Base CRUD
│   │   └── crud_user.py    # User CRUD
│   ├── models/             # SQLAlchemy models
│   │   ├── user.py
│   │   ├── income.py
│   │   └── ...
│   ├── schemas/            # Pydantic schemas
│   │   ├── user.py
│   │   ├── income.py
│   │   └── ...
│   └── main.py             # FastAPI app
├── .env                    # Environment variables
├── .env.example            # Environment template
├── requirements.txt        # Python dependencies
├── init_db.py             # Database initialization
├── run.py                 # Run script
└── README.md              # This file
```

## 🛠️ Troubleshooting

### Database Connection Issues

1. **Check SQL Server is running**
```powershell
# Windows
Get-Service MSSQL*
```

2. **Verify ODBC Driver**
```python
import pyodbc
print(pyodbc.drivers())  # Should show "ODBC Driver 17 for SQL Server"
```

3. **Test Connection**
```python
python -c "from app.core.database import engine; engine.connect()"
```

### Common Errors

**"Can't open lib 'ODBC Driver 17 for SQL Server'"**
- Install ODBC Driver 17 for SQL Server

**"Login failed for user"**
- Check DB_USERNAME and DB_PASSWORD in .env
- Or use Windows Authentication (DB_TRUSTED_CONNECTION=yes)

**"Database does not exist"**
- Run `python init_db.py` to create database

## 📞 Support

For issues or questions:
1. Check the Swagger docs at `/docs`
2. Review error messages in console
3. Check database logs
4. Verify environment configuration

---

**Built with ❤️ using FastAPI, SQLAlchemy, and SQL Server**
