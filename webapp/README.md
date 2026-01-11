# Financial Manager - Frontend Web Application

A modern, production-ready React + TypeScript frontend for the Family Financial Manager system.

## 🚀 Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development with strict mode
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components
- **Zustand** - Lightweight state management
- **TanStack Query** - Data fetching and caching
- **Recharts** - Beautiful charts and graphs
- **Lucide React** - Modern icon library
- **date-fns** - Date manipulation
- **Zod** - Schema validation

## 📁 Project Structure

```
webapp/
├── src/
│   ├── app/                    # App configuration
│   │   ├── router.tsx         # React Router setup
│   │   └── providers.tsx      # Context providers
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── common/            # Reusable components
│   │   ├── charts/            # Chart components
│   │   └── layout/            # Layout components
│   ├── pages/                 # Page components
│   │   ├── Dashboard/
│   │   ├── FamilyMembers/    # Family member management
│   │   ├── InterFamilyLoans/ # Inter-family loans
│   │   ├── Income/
│   │   ├── Expenses/
│   │   ├── Investments/
│   │   ├── CreditCards/
│   │   ├── NetWorth/
│   │   └── Settings/
│   ├── store/                 # Zustand store
│   ├── types/                 # TypeScript types
│   ├── utils/                 # Utility functions
│   ├── services/              # Business logic
│   ├── constants/             # App constants
│   ├── engine/                # Recommendation engine
│   └── styles/                # Global styles
├── index.html                 # HTML entry point
├── package.json               # Dependencies
├── vite.config.ts            # Vite configuration
├── tailwind.config.js        # Tailwind configuration
└── tsconfig.json             # TypeScript configuration
```

## 🛠️ Installation

### Prerequisites
- Node.js 18+ and npm

### Install Dependencies
```bash
cd webapp
npm install
```

## 🚀 Development

### Start Development Server
```bash
npm run dev
```

The app will be available at: **http://localhost:5173**

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Lint Code
```bash
npm run lint
```

## 🎨 Features

### Family Management
- **Family Members** - Add, edit, and manage family members
- **Inter-Family Loans** - Track loans between family members
- **Member Statistics** - View income, expenses, and contributions per member

### Financial Tracking
- **Dashboard** - Overview of all financial data
- **Income** - Track income sources with family member association
- **Expenses** - Manage expenses with category and member tracking
- **Investments** - Monitor investment portfolio
- **Credit Cards** - Track credit card balances and payments
- **Net Worth** - Calculate and track net worth over time

### Smart Features
- **AI Recommendations** - Rule-based financial guidance
- **Charts & Analytics** - Visual representation of financial data
- **Responsive Design** - Works on all devices
- **Dark Mode Ready** - Theme support infrastructure
- **Type-Safe** - Full TypeScript coverage

## 🔗 API Integration

The frontend connects to the FastAPI backend at:
- **Development**: http://localhost:8000
- **Production**: Configure via environment variables

### Environment Variables
Create a `.env` file:
```env
VITE_API_URL=http://localhost:8000
```

## 📦 Key Dependencies

### Core
- `react@18.2.0` - UI library
- `react-dom@18.2.0` - React DOM renderer
- `typescript@5.3.3` - Type safety

### Routing & State
- `react-router-dom@6.21.1` - Client-side routing
- `zustand@4.4.7` - State management
- `@tanstack/react-query@5.17.0` - Server state management

### UI & Styling
- `tailwindcss@3.4.0` - Utility CSS
- `@radix-ui/*` - Accessible UI primitives
- `lucide-react@0.303.0` - Icons
- `recharts@2.10.3` - Charts

### Utilities
- `date-fns@3.0.6` - Date utilities
- `zod@3.22.4` - Schema validation
- `clsx@2.0.0` - Conditional classnames

## 🎯 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🌈 Styling

### Tailwind CSS
Configured with custom colors, fonts (Nunito), and shadcn/ui theme variables.

### Global Styles
Located in `src/styles/index.css`

### Font
Uses **Nunito** from Google Fonts for a modern, clean look.

## 🔐 Type Safety

Full TypeScript strict mode enabled with:
- Strict null checks
- No implicit any
- Strict function types
- Path aliases (`@/` for `src/`)

## 📱 Responsive Design

Built mobile-first with breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1400px

## 🧪 Code Quality

### ESLint
Configured with React and TypeScript best practices.

### Prettier
Consistent code formatting (configured via `.prettierrc`).

## 📊 State Management

### Local State (Zustand)
- Family members
- Inter-family loans
- Income & expenses
- Investments
- Credit cards & loans
- Assets & liabilities
- User settings

### Persistence
State is persisted to localStorage automatically.

## 🚦 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open browser:**
   Navigate to http://localhost:5173

4. **Start building!**

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Vite Guide](https://vitejs.dev/guide)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)

## 🤝 Contributing

1. Follow the existing code style
2. Use TypeScript strict mode
3. Add proper type definitions
4. Write clean, readable code
5. Test your changes thoroughly

## 📄 License

Part of the Financial Manager application.

---

**Built with ❤️ using React, TypeScript, and modern web technologies**
