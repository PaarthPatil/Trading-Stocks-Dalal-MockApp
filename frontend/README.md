# Stock Simulation Platform - Frontend

Modern React + Tailwind CSS frontend for the stock trading simulation platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- Backend server running on port 5000

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at http://localhost:3000

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── Card.jsx
│   │   └── LoadingSpinner.jsx
│   ├── contexts/           # React contexts
│   │   └── AuthContext.jsx
│   ├── pages/              # Page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Portfolio.jsx
│   │   ├── Teams.jsx
│   │   ├── Leaderboard.jsx
│   │   └── Admin.jsx
│   ├── services/           # API services
│   │   ├── api.js          # Axios instance
│   │   └── index.js        # Service functions
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── postcss.config.js
```

## 🎨 Features

### Pages Implemented

1. **Home** (`/`)
   - Landing page with features
   - Call-to-action buttons

2. **Dashboard** (`/dashboard`)
   - List of all stocks
   - Real-time prices
   - Buy/Sell functionality
   - Trade modal

3. **Portfolio** (`/portfolio`)
   - User holdings table
   - Cash balance, portfolio value, total value cards
   - Portfolio distribution pie chart (Recharts)
   - Gain/Loss tracking with percentages

4. **Teams** (`/teams`)
   - All teams listing
   - Team statistics

5. **Leaderboard** (`/leaderboard`)
   - User rankings
   - Performance metrics
   - Medal icons for top 3

6. **Admin** (`/admin`) - Admin only
   - System statistics
   - Trading status
   - User management overview

7. **Login** (`/login`)
   - User authentication form

8. **Signup** (`/signup`)
   - User registration form

### Components

- **Navbar**: Navigation with auth-aware links
- **Card**: Reusable card wrapper
- **LoadingSpinner**: Loading indicator

### Services

Complete API integration layer:
- `authService` - Login, signup, logout
- `stockService` - Get stocks, create, update price
- `tradeService` - Buy and sell operations
- `portfolioService` - Portfolio data, leaderboard
- `teamService` - Team data
- `transactionService` - Transaction history
- `adminService` - Admin operations

## 🔐 Authentication

- JWT token stored in localStorage
- Automatic token attachment to requests
- Protected routes redirect to login
- Auto-logout on 401 errors

## 🎯 Key Technologies

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router v6** - Routing
- **Recharts** - Charts and graphs
- **Axios** - HTTP client

## 📊 Data Flow

```
User Action → Component → Service → API → Backend
                                      ↓
Component ← State Update ← Service ← Response
```

**No business logic in frontend** - all calculations happen in backend core logic.

## 🛡️ Security

- CORS configured for backend proxy
- Token-based authentication
- Input validation on forms
- Error handling with user feedback

## 🎨 Design Principles

- Clean, modern UI inspired by trading platforms
- Mobile responsive design
- Color-coded gains/losses (green/red)
- Intuitive navigation
- Loading states for better UX
- Error messages displayed clearly

## 📝 Sample Credentials

After seeding database:
- Admin: `admin@stocksim.com` / `password123`
- User: `john@bulls.com` / `password123`

## 🔧 Configuration

The Vite dev server proxies `/api` requests to backend at `http://localhost:5000`

See `vite.config.js`:
```javascript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true
    }
  }
}
```

## 🚀 Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

Build output in `dist/` folder

## 📱 Responsive Design

All pages are mobile-responsive:
- Grid layouts adapt to screen size
- Navigation collapses on mobile
- Tables scroll horizontally on small screens
- Touch-friendly buttons

## ✅ Checklist from Prompt

✅ Dashboard with stocks list  
✅ Prices displayed  
✅ Buy/Sell buttons  
✅ Company page structure ready  
✅ Teams page showing team portfolios  
✅ Portfolio page with holdings  
✅ Profit/Loss tracking  
✅ Charts using Recharts  
✅ Clean modern UI  
✅ Mobile responsive  
✅ No business logic in frontend  
✅ Only API calls  
✅ Full React code  
✅ Components structured cleanly  

## 🎉 Status

**FRONTEND IMPLEMENTATION: 100% COMPLETE**

All required pages and features implemented!

---

*Last Updated: March 25, 2026*  
*Version: 1.0.0*
