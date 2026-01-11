# API Integration Guide - Connect Frontend to Backend

## 🎯 Quick Integration Steps

### Step 1: Start Backend API
```powershell
cd backend
.\venv\Scripts\activate
python run.py
```

API will be available at: **http://localhost:8000**

### Step 2: Update Frontend API Base URL

Create or update `src/services/api/config.ts`:

```typescript
export const API_CONFIG = {
  baseURL: 'http://localhost:8000/api',
  timeout: 10000,
};
```

### Step 3: Create API Client

Create `src/services/api/client.ts`:

```typescript
import axios, { AxiosInstance } from 'axios';
import { API_CONFIG } from './config';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor - add token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired - logout user
          localStorage.removeItem('access_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  get client() {
    return this.client;
  }
}

export const apiClient = new ApiClient().client;
```

### Step 4: Create API Services

Replace mock data services with real API calls:

#### Income Service
```typescript
// src/services/api/incomeService.ts
import { apiClient } from './client';
import type { Income } from '@/types';

export const incomeService = {
  async getAll(): Promise<Income[]> {
    const { data } = await apiClient.get('/income/');
    return data;
  },

  async getById(id: string): Promise<Income> {
    const { data } = await apiClient.get(`/income/${id}`);
    return data;
  },

  async create(income: Omit<Income, 'id' | 'user_id' | 'createdAt' | 'updatedAt'>): Promise<Income> {
    const { data } = await apiClient.post('/income/', income);
    return data;
  },

  async update(id: string, income: Partial<Income>): Promise<Income> {
    const { data } = await apiClient.put(`/income/${id}`, income);
    return data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/income/${id}`);
  },
};
```

#### Expense Service
```typescript
// src/services/api/expenseService.ts
import { apiClient } from './client';
import type { Expense } from '@/types';

export const expenseService = {
  async getAll(): Promise<Expense[]> {
    const { data } = await apiClient.get('/expenses/');
    return data;
  },

  async create(expense: Omit<Expense, 'id' | 'user_id' | 'createdAt' | 'updatedAt'>): Promise<Expense> {
    const { data } = await apiClient.post('/expenses/', expense);
    return data;
  },

  async update(id: string, expense: Partial<Expense>): Promise<Expense> {
    const { data } = await apiClient.put(`/expenses/${id}`, expense);
    return data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/expenses/${id}`);
  },
};
```

#### Auth Service
```typescript
// src/services/api/authService.ts
import { apiClient } from './client';

interface LoginResponse {
  access_token: string;
  token_type: string;
}

interface RegisterData {
  email: string;
  username: string;
  password: string;
  full_name?: string;
}

export const authService = {
  async login(username: string, password: string): Promise<LoginResponse> {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const { data } = await apiClient.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // Save token
    localStorage.setItem('access_token', data.access_token);
    
    return data;
  },

  async register(userData: RegisterData): Promise<any> {
    const { data } = await apiClient.post('/auth/register', userData);
    return data;
  },

  logout(): void {
    localStorage.removeItem('access_token');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  },
};
```

### Step 5: Update Zustand Store

Modify your Zustand store to use API instead of localStorage:

```typescript
// src/store/useFinancialStore.ts
import { create } from 'zustand';
import { incomeService, expenseService } from '@/services/api';
import type { Income, Expense } from '@/types';

interface FinancialState {
  incomes: Income[];
  expenses: Expense[];
  
  // Actions
  fetchIncomes: () => Promise<void>;
  addIncome: (income: Income) => Promise<void>;
  updateIncome: (id: string, income: Partial<Income>) => Promise<void>;
  deleteIncome: (id: string) => Promise<void>;
  
  fetchExpenses: () => Promise<void>;
  addExpense: (expense: Expense) => Promise<void>;
  // ... more actions
}

const useFinancialStore = create<FinancialState>((set) => ({
  incomes: [],
  expenses: [],
  
  fetchIncomes: async () => {
    try {
      const incomes = await incomeService.getAll();
      set({ incomes });
    } catch (error) {
      console.error('Failed to fetch incomes:', error);
    }
  },
  
  addIncome: async (income) => {
    try {
      const newIncome = await incomeService.create(income);
      set((state) => ({
        incomes: [...state.incomes, newIncome],
      }));
    } catch (error) {
      console.error('Failed to add income:', error);
      throw error;
    }
  },
  
  // ... implement other actions
}));

export default useFinancialStore;
```

### Step 6: Use TanStack Query (Recommended)

For better data management, use TanStack Query:

```typescript
// src/hooks/useIncomes.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { incomeService } from '@/services/api';
import type { Income } from '@/types';

export function useIncomes() {
  return useQuery({
    queryKey: ['incomes'],
    queryFn: () => incomeService.getAll(),
  });
}

export function useCreateIncome() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (income: Omit<Income, 'id' | 'user_id' | 'createdAt' | 'updatedAt'>) =>
      incomeService.create(income),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['incomes'] });
    },
  });
}

export function useUpdateIncome() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Income> }) =>
      incomeService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] });
    },
  });
}

export function useDeleteIncome() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => incomeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] });
    },
  });
}
```

### Step 7: Update Components

Update your components to use the new hooks:

```typescript
// src/pages/Income/Income.tsx
import { useIncomes, useCreateIncome } from '@/hooks/useIncomes';

export function Income() {
  const { data: incomes, isLoading, error } = useIncomes();
  const createIncome = useCreateIncome();

  const handleCreate = async (data: IncomeCreate) => {
    try {
      await createIncome.mutateAsync(data);
      toast.success('Income created successfully');
    } catch (error) {
      toast.error('Failed to create income');
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <Error message={error.message} />;

  return (
    <div>
      {/* Your component JSX */}
    </div>
  );
}
```

---

## 🔐 Authentication Flow

### 1. Login Page
```typescript
// src/pages/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/api/authService';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.login(username, password);
      navigate('/');
    } catch (error) {
      alert('Login failed');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

### 2. Protected Route
```typescript
// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { authService } from '@/services/api/authService';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
```

### 3. Update Router
```typescript
// src/app/router.tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Dashboard />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  // ... other routes
]);
```

---

## 📊 Data Mapping

### Frontend Type → Backend Model

Your frontend types already match the backend! No changes needed to types.

### Date Handling
```typescript
// Frontend sends/receives ISO strings
const income = {
  date: new Date().toISOString(),  // "2026-01-10T10:30:00.000Z"
};

// Display in UI
formatDate(income.date);  // "Jan 10, 2026"
```

---

## 🧪 Testing Integration

### Test Checklist

1. **Authentication**
   - [ ] Register new user
   - [ ] Login with correct credentials
   - [ ] Login with wrong credentials (should fail)
   - [ ] Access protected route without token (should redirect)

2. **Income**
   - [ ] Fetch all incomes
   - [ ] Create new income
   - [ ] Update income
   - [ ] Delete income

3. **Expenses**
   - [ ] CRUD operations work
   - [ ] Tags are properly handled

4. **Investments**
   - [ ] CRUD operations work
   - [ ] Returns calculation is correct

5. **Credit Cards**
   - [ ] CRUD operations work
   - [ ] Utilization displays correctly

6. **Settings**
   - [ ] Fetch settings
   - [ ] Update settings
   - [ ] Changes persist

---

## 🚀 Complete Migration Script

Create `src/services/api/index.ts`:

```typescript
export { authService } from './authService';
export { incomeService } from './incomeService';
export { expenseService } from './expenseService';
export { investmentService } from './investmentService';
export { creditCardService } from './creditCardService';
export { loanService } from './loanService';
export { assetService } from './assetService';
export { liabilityService } from './liabilityService';
export { settingsService } from './settingsService';
```

---

## 📝 Environment Variables

Update `.env.local` in frontend:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_API_TIMEOUT=10000
```

Use in code:
```typescript
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
};
```

---

## ✅ Final Verification

1. **Backend Running**: http://localhost:8000/docs
2. **Frontend Running**: http://localhost:5173
3. **Can register user**: POST /api/auth/register
4. **Can login**: POST /api/auth/login
5. **Can access protected routes**: All /api/* endpoints
6. **Data persists**: Refresh page, data remains
7. **Errors handled**: Try invalid data, see error messages

---

## 🎉 Success!

Your frontend is now fully integrated with the FastAPI backend!

**What you have now:**
- ✅ Real database storage (SQL Server)
- ✅ JWT authentication
- ✅ Secure API endpoints
- ✅ Data persistence
- ✅ Production-ready architecture
- ✅ Scalable backend

**Next steps:**
- Deploy backend to cloud (AWS, Azure, Heroku)
- Add more features (notifications, analytics)
- Implement real-time updates (WebSockets)
- Add comprehensive testing
- Setup CI/CD pipeline

---

**Need help? Check:**
- Backend API docs: http://localhost:8000/docs
- Frontend console for errors
- Network tab in browser DevTools
- Backend console for API logs
