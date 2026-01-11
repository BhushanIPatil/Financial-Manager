# 🏦 Financial Manager - Family Financial Management System

A comprehensive, production-ready **multi-user family financial management system** with a modern React frontend and robust Python FastAPI backend.

---

## ✨ Features

### 👨‍👩‍👧‍👦 Family Management
- **Family Members** - Manage entire family with relationships (self, spouse, parent, child, sibling, etc.)
- **Inter-Family Loans** - Track loans between family members with interest rates and due dates
- **Member Statistics** - View income, expenses, and net contribution per member
- **Loan Payments** - Record payments and track outstanding amounts

### 💰 Financial Tracking
- **Dashboard** - Comprehensive overview of all financial data
- **Income Management** - Track income by source and family member
- **Expense Management** - Categorize and track expenses by member
- **Investments** - Monitor portfolio with real-time returns
- **Credit Cards** - Track balances, limits, and payments
- **Loans** - Manage external loans with EMI tracking
- **Net Worth** - Calculate and visualize net worth over time

### 🤖 Smart Features
- **AI Recommendations** - Rule-based financial guidance engine
- **Analytics & Charts** - Beautiful visualizations with Recharts
- **Responsive Design** - Works seamlessly on all devices
- **Type-Safe** - Full TypeScript coverage for reliability
- **Real-Time Updates** - Instant UI updates with optimistic updates

---

## 🏗️ Project Structure

```
Financial Manager/
├── backend/                 # Python FastAPI Backend
│   ├── app/                # Application code
│   │   ├── api/           # API routes
│   │   ├── core/          # Configuration
│   │   ├── crud/          # Database operations
│   │   ├── models/        # SQLAlchemy models
│   │   └── schemas/       # Pydantic schemas
│   ├── .env               # Environment variables
│   ├── requirements.txt   # Python dependencies
│   └── README.md         # Backend documentation
│
├── webapp/                 # React TypeScript Frontend
│   ├── src/               # Source code
│   │   ├── app/          # App configuration
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── store/        # State management
│   │   ├── types/        # TypeScript types
│   │   └── services/     # Business logic
│   ├── package.json      # Dependencies
│   └── README.md        # Frontend documentation
│
└── Documentation/         # Project documentation
```

---

## 🚀 Quick Start

### Prerequisites
- **Backend**: Python 3.11+, SQL Server
- **Frontend**: Node.js 18+, npm

### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
pip install -r requirements.txt

# Configure database (.env file)
# DB_SERVER=localhost\SQLEXPRESS
# DB_NAME=FinancialManagerDB
# SECRET_KEY=your-secret-key

# Create database
python create_database.py

# Initialize tables
python init_db.py

# Start server (port 8000)
python run.py
```

**Backend will be running at:** http://localhost:8000  
**API Docs:** http://localhost:8000/docs

### 2. Frontend Setup

```bash
# Navigate to webapp
cd webapp

# Install dependencies
npm install

# Start development server (port 5173)
npm run dev
```

**Frontend will be running at:** http://localhost:5173

---

## 🎯 Usage Example

### Managing Family Finances

**Step 1: Add Family Members**
1. Go to "Family Members" page
2. Add yourself, brother, parents, etc.
3. Set relationships and contact info

**Step 2: Track Family Loans**
1. Go to "Family Loans" page
2. Create a loan: Brother borrows ₹50,000 from you
3. Set interest rate and due date
4. Record payments as they're made

**Step 3: Track Income & Expenses**
1. Add income and associate with family member
2. Add expenses and track who paid
3. View individual contributions on Dashboard

**Step 4: Financial Overview**
1. Dashboard shows total family income/expenses
2. Each member's statistics visible on Family Members page
3. Track loans, payments, and outstanding amounts

---

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL ORM
- **Pydantic** - Data validation
- **SQL Server** - Database (localhost\SQLEXPRESS)
- **JWT** - Authentication
- **Rich** - Beautiful console output

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Zustand** - State management
- **TanStack Query** - Data fetching
- **Recharts** - Charts
- **Lucide React** - Icons

---

## 📊 Database Schema

### Tables (11 total)
- **users** - User authentication & profiles
- **family_members** - Family member information
- **inter_family_loans** - Loans between family members
- **incomes** - Income tracking (with member link)
- **expenses** - Expense management (with member link)
- **investments** - Investment portfolio
- **credit_cards** - Credit card tracking
- **loans** - External loan management
- **assets** - Asset tracking
- **liabilities** - Liability tracking
- **user_settings** - User preferences

---

## 🔌 API Endpoints

### Family Management
- `GET/POST /api/family-members` - Manage family members
- `GET /api/family-members/{id}/stats` - Get member statistics
- `GET/POST /api/inter-family-loans` - Manage family loans
- `POST /api/inter-family-loans/{id}/payment` - Record payment

### Financial Tracking
- `GET/POST /api/income` - Income management
- `GET/POST /api/expenses` - Expense management
- `GET/POST /api/investments` - Investment tracking
- `GET/POST /api/credit-cards` - Credit card management
- `GET/POST /api/loans` - External loan tracking
- `GET/POST /api/assets` - Asset management
- `GET/POST /api/liabilities` - Liability tracking

### User Management
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET/PUT /api/settings` - User settings

**Complete API Documentation:** http://localhost:8000/docs

---

## 🎨 Design Features

### Modern UI
- ✨ **Nunito Font** - Clean, professional typography
- 🎨 **Color-Coded Status** - Visual indicators for loan status
- 📊 **Interactive Charts** - Real-time data visualization
- 🎯 **Responsive Layout** - Mobile-first design
- ⚡ **Fast Performance** - Optimized React components

### User Experience
- Intuitive navigation with sidebar
- Quick actions and shortcuts
- Real-time statistics
- Confirmation dialogs for destructive actions
- Empty states with helpful messages
- Loading states and error handling

---

## 📚 Documentation

### Main Guides
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Detailed setup instructions
- **[FEATURES.md](FEATURES.md)** - Complete feature documentation
- **[FAMILY_FINANCIAL_MANAGEMENT_GUIDE.md](FAMILY_FINANCIAL_MANAGEMENT_GUIDE.md)** - Family features guide
- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Project organization

### Component Docs
- **[backend/README.md](backend/README.md)** - Backend documentation
- **[webapp/README.md](webapp/README.md)** - Frontend documentation
- **[backend/API_INTEGRATION_GUIDE.md](backend/API_INTEGRATION_GUIDE.md)** - API integration

---

## 🔐 Security

### Backend Security
- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ SQL injection prevention (ORM)
- ✅ Input validation (Pydantic)
- ✅ CORS configuration
- ✅ User-scoped data access

### Frontend Security
- ✅ Type-safe with TypeScript strict mode
- ✅ XSS prevention
- ✅ Secure localStorage usage
- ✅ Environment variable protection

---

## 🌐 Deployment

### Backend Deployment
1. Install dependencies: `pip install -r requirements.txt`
2. Configure environment variables
3. Set up SQL Server database
4. Run migrations: `python init_db.py`
5. Start with production server (e.g., Gunicorn)

### Frontend Deployment
1. Build production bundle: `npm run build`
2. Deploy `dist` folder to static hosting (Vercel, Netlify, etc.)
3. Configure API URL environment variable

---

## 📱 Screenshots & Features

### Dashboard
- Total family income and expenses
- Net worth tracking
- Recent transactions
- Financial recommendations

### Family Members
- Grid view of all family members
- Individual financial statistics
- Add/Edit/Delete operations
- Relationship badges

### Family Loans
- Loan list with status indicators
- Payment tracking
- Overdue alerts
- Summary statistics

---

## 🎓 Development

### Backend Development
```bash
cd backend
python run.py  # Auto-reload enabled
```

### Frontend Development
```bash
cd webapp
npm run dev  # Hot module replacement
```

### Building for Production
```bash
# Backend - no build needed, just deploy .py files

# Frontend
cd webapp
npm run build  # Output in dist/
```

---

## 🐛 Known Issues & Solutions

### Issue: SQL Server Cascade Constraints
**Solution**: Inter-family loans use `ON DELETE NO ACTION` to avoid multiple cascade paths.

### Issue: PowerShell Command Syntax
**Solution**: Use `;` instead of `&&` to chain commands in PowerShell.

---

## 🤝 Contributing

1. Follow existing code style
2. Use TypeScript strict mode
3. Add proper type definitions
4. Write clean, maintainable code
5. Test thoroughly before committing

---

## 📄 License

Private project for personal/family use.

---

## 🎉 Credits

**Built with:**
- React & TypeScript
- FastAPI & SQLAlchemy
- Tailwind CSS & shadcn/ui
- SQL Server
- Rich library for beautiful console output
- Nunito font by Vernon Adams

---

## 💡 Support

For detailed documentation, see:
- Backend: `backend/README.md`
- Frontend: `webapp/README.md`
- API Docs: http://localhost:8000/docs

---

## 🚦 Status

✅ **Backend**: Complete and running  
✅ **Frontend**: Complete and running  
✅ **Database**: Initialized with all tables  
✅ **Family Features**: Fully implemented  
✅ **Documentation**: Comprehensive guides available

---

**Happy Family Financial Management! 🎊**

Track your family's finances with confidence and clarity.
