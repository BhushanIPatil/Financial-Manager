# Financial Manager - Project Structure

## 📂 Complete Project Organization

```
Financial Manager/
│
├── backend/                          # Python FastAPI Backend
│   ├── app/
│   │   ├── api/                     # API routes
│   │   │   ├── routes/              # Individual route modules
│   │   │   │   ├── auth.py
│   │   │   │   ├── family_members.py
│   │   │   │   ├── inter_family_loans.py
│   │   │   │   ├── income.py
│   │   │   │   ├── expense.py
│   │   │   │   ├── investment.py
│   │   │   │   ├── credit_card.py
│   │   │   │   ├── loan.py
│   │   │   │   ├── asset.py
│   │   │   │   ├── liability.py
│   │   │   │   └── settings.py
│   │   │   ├── api.py              # Main API router
│   │   │   └── deps.py             # Dependencies
│   │   │
│   │   ├── core/                   # Core configuration
│   │   │   ├── config.py           # App settings
│   │   │   ├── database.py         # Database setup
│   │   │   └── security.py         # Security utilities
│   │   │
│   │   ├── crud/                   # CRUD operations
│   │   │   ├── base.py
│   │   │   ├── family_member.py
│   │   │   ├── inter_family_loan.py
│   │   │   └── crud_user.py
│   │   │
│   │   ├── models/                 # SQLAlchemy models
│   │   │   ├── user.py
│   │   │   ├── family_member.py
│   │   │   ├── inter_family_loan.py
│   │   │   ├── income.py
│   │   │   ├── expense.py
│   │   │   ├── investment.py
│   │   │   ├── credit_card.py
│   │   │   ├── loan.py
│   │   │   ├── asset.py
│   │   │   ├── liability.py
│   │   │   └── settings.py
│   │   │
│   │   ├── schemas/                # Pydantic schemas
│   │   │   ├── user.py
│   │   │   ├── family_member.py
│   │   │   ├── inter_family_loan.py
│   │   │   ├── income.py
│   │   │   ├── expense.py
│   │   │   ├── investment.py
│   │   │   ├── credit_card.py
│   │   │   ├── loan.py
│   │   │   ├── asset.py
│   │   │   ├── liability.py
│   │   │   └── settings.py
│   │   │
│   │   └── main.py                 # FastAPI app entry point
│   │
│   ├── .env                        # Environment variables
│   ├── requirements.txt            # Python dependencies
│   ├── run.py                      # Server startup script
│   ├── init_db.py                  # Database initialization
│   ├── create_database.py          # Database creation script
│   ├── README.md                   # Backend documentation
│   ├── SETUP_GUIDE.md             # Backend setup guide
│   └── API_INTEGRATION_GUIDE.md   # API documentation
│
├── webapp/                         # React TypeScript Frontend
│   ├── src/
│   │   ├── app/                   # App configuration
│   │   │   ├── router.tsx         # React Router
│   │   │   └── providers.tsx      # Context providers
│   │   │
│   │   ├── components/
│   │   │   ├── ui/                # shadcn/ui components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── label.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── tabs.tsx
│   │   │   │   └── switch.tsx
│   │   │   │
│   │   │   ├── common/            # Reusable components
│   │   │   │   ├── StatCard.tsx
│   │   │   │   ├── AlertCard.tsx
│   │   │   │   ├── PageHeader.tsx
│   │   │   │   └── EmptyState.tsx
│   │   │   │
│   │   │   ├── charts/            # Chart components
│   │   │   │   ├── AreaChartCard.tsx
│   │   │   │   ├── PieChartCard.tsx
│   │   │   │   └── BarChartCard.tsx
│   │   │   │
│   │   │   └── layout/            # Layout components
│   │   │       ├── AppLayout.tsx
│   │   │       ├── Sidebar.tsx
│   │   │       └── Header.tsx
│   │   │
│   │   ├── pages/                 # Page components
│   │   │   ├── Dashboard/
│   │   │   │   └── Dashboard.tsx
│   │   │   ├── FamilyMembers/
│   │   │   │   └── FamilyMembersPage.tsx
│   │   │   ├── InterFamilyLoans/
│   │   │   │   └── InterFamilyLoansPage.tsx
│   │   │   ├── Income/
│   │   │   │   └── Income.tsx
│   │   │   ├── Expenses/
│   │   │   │   └── Expenses.tsx
│   │   │   ├── Investments/
│   │   │   │   └── Investments.tsx
│   │   │   ├── CreditCards/
│   │   │   │   └── CreditCards.tsx
│   │   │   ├── NetWorth/
│   │   │   │   └── NetWorth.tsx
│   │   │   └── Settings/
│   │   │       └── Settings.tsx
│   │   │
│   │   ├── store/                 # State management
│   │   │   └── useFinancialStore.ts
│   │   │
│   │   ├── types/                 # TypeScript types
│   │   │   └── index.ts
│   │   │
│   │   ├── services/              # Business logic
│   │   │   ├── calculations.ts
│   │   │   └── mockData.ts
│   │   │
│   │   ├── engine/                # Recommendation engine
│   │   │   └── recommendationsEngine.ts
│   │   │
│   │   ├── utils/                 # Utilities
│   │   │   └── storage.ts
│   │   │
│   │   ├── constants/             # App constants
│   │   │   └── index.ts
│   │   │
│   │   ├── lib/                   # Library utilities
│   │   │   └── utils.ts
│   │   │
│   │   ├── styles/                # Global styles
│   │   │   └── index.css
│   │   │
│   │   ├── App.tsx                # Root component
│   │   ├── main.tsx               # App entry point
│   │   └── vite-env.d.ts          # Vite types
│   │
│   ├── index.html                 # HTML entry point
│   ├── package.json               # Dependencies
│   ├── package-lock.json          # Dependency lock
│   ├── vite.config.ts             # Vite configuration
│   ├── tailwind.config.js         # Tailwind CSS config
│   ├── postcss.config.js          # PostCSS config
│   ├── tsconfig.json              # TypeScript config
│   ├── tsconfig.node.json         # TS config for Node
│   ├── .eslintrc.cjs              # ESLint config
│   ├── .prettierrc                # Prettier config
│   ├── .gitignore                 # Git ignore
│   └── README.md                  # Frontend documentation
│
├── Documentation/                  # Project documentation
│   ├── README.md                  # Main project README
│   ├── SETUP_GUIDE.md            # Setup instructions
│   ├── FEATURES.md               # Feature documentation
│   ├── QUICK_START.md            # Quick start guide
│   ├── FAMILY_FINANCIAL_MANAGEMENT_GUIDE.md  # Family features guide
│   ├── BACKEND_COMPLETE.md       # Backend completion docs
│   └── PROJECT_STRUCTURE.md      # This file
│
└── .gitignore                     # Root git ignore

```

## 🎯 Key Directories

### Backend (`/backend`)
- **Purpose**: Python FastAPI REST API server
- **Port**: 8000
- **Database**: SQL Server (localhost\SQLEXPRESS)
- **Key Tech**: FastAPI, SQLAlchemy, Pydantic, JWT Auth

### WebApp (`/webapp`)
- **Purpose**: React TypeScript frontend application
- **Port**: 5173 (dev), 5000 (preview)
- **Key Tech**: React 18, TypeScript, Vite, Tailwind CSS, Zustand

## 🚀 Running the Application

### Backend
```bash
# Navigate to backend
cd backend

# Install dependencies
pip install -r requirements.txt

# Create database
python create_database.py

# Initialize tables
python init_db.py

# Start server
python run.py
```

### Frontend
```bash
# Navigate to webapp
cd webapp

# Install dependencies
npm install

# Start dev server
npm run dev
```

## 📊 Database

**Server**: localhost\SQLEXPRESS  
**Database**: FinancialManagerDB  
**Tables**: 11 tables
- users
- family_members
- inter_family_loans
- incomes
- expenses
- investments
- credit_cards
- loans
- assets
- liabilities
- user_settings

## 🔗 API Endpoints

**Base URL**: http://localhost:8000/api

**Docs**: http://localhost:8000/docs

### Main Endpoints
- `/auth` - Authentication
- `/family-members` - Family member management
- `/inter-family-loans` - Inter-family loan tracking
- `/income` - Income tracking
- `/expenses` - Expense management
- `/investments` - Investment portfolio
- `/credit-cards` - Credit card tracking
- `/loans` - External loan management
- `/assets` - Asset tracking
- `/liabilities` - Liability tracking
- `/settings` - User settings

## 📦 Dependencies

### Backend
- fastapi - Web framework
- sqlalchemy - ORM
- pyodbc - SQL Server driver
- pydantic - Data validation
- python-jose - JWT tokens
- passlib - Password hashing
- rich - Console formatting

### Frontend
- react - UI library
- typescript - Type safety
- vite - Build tool
- tailwindcss - CSS framework
- zustand - State management
- @tanstack/react-query - Data fetching
- recharts - Charts
- lucide-react - Icons
- date-fns - Date utilities
- zod - Schema validation

## 🎨 Design System

### Colors
- Primary: Blue (#3b82f6)
- Success: Green (#10b981)
- Warning: Yellow/Orange
- Danger: Red (#ef4444)
- Muted: Gray

### Typography
- Font Family: Nunito (Google Fonts)
- Font Weights: 300-900

### Components
- shadcn/ui component library
- Tailwind CSS utilities
- Custom chart components
- Responsive layouts

## 🔐 Security

### Backend
- JWT authentication
- Password hashing (bcrypt)
- CORS configuration
- SQL injection prevention (ORM)
- Input validation (Pydantic)

### Frontend
- Type-safe with TypeScript
- XSS prevention
- Secure localStorage usage
- Environment variable protection

## 🌐 Deployment

### Backend
- Can be deployed to any Python hosting service
- Requires SQL Server database
- Configure environment variables

### Frontend
- Build with `npm run build`
- Deploy `dist` folder to any static host
- Configure API URL via environment variables

## 📚 Documentation Files

1. **README.md** - Main project overview
2. **SETUP_GUIDE.md** - Complete setup instructions
3. **FEATURES.md** - Feature documentation
4. **FAMILY_FINANCIAL_MANAGEMENT_GUIDE.md** - Family features guide
5. **PROJECT_STRUCTURE.md** - This file
6. **backend/README.md** - Backend-specific docs
7. **webapp/README.md** - Frontend-specific docs

## 🎯 Development Workflow

1. **Backend First**: Start backend server (port 8000)
2. **Frontend Second**: Start frontend dev server (port 5173)
3. **Database**: Ensure SQL Server is running
4. **Testing**: Use API docs at /docs for testing
5. **Building**: Build frontend before deployment

---

**This structure promotes:**
- ✅ Clear separation of concerns
- ✅ Easy maintenance and scaling
- ✅ Independent deployment of frontend/backend
- ✅ Professional project organization
- ✅ Team collaboration
