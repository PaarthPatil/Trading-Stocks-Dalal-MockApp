# 🎨 Stock Simulation Platform - Frontend

React-based frontend with Vite, Tailwind CSS, and Socket.io for real-time updates.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/react-18.2-blue)
![Vite](https://img.shields.io/badge/vite-5.0-purple)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Pages](#pages)
- [Components](#components)
- [Services](#services)
- [Real-Time Features](#real-time-features)
- [Styling](#styling)
- [Build & Deployment](#build--deployment)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

### User Interface

- ✅ **Modern Design** - Clean, professional UI with Tailwind CSS
- ✅ **Responsive Layout** - Works on desktop, tablet, and mobile
- ✅ **Real-Time Updates** - Live stock prices via Socket.io
- ✅ **Interactive Charts** - Portfolio visualization with Recharts
- ✅ **Protected Routes** - Authentication enforcement
- ✅ **Admin Dashboard** - Complete admin panel
- ✅ **Dark Mode Ready** - Easy to add dark theme
- ✅ **Accessible** - Semantic HTML, ARIA labels

### Pages

1. **Home** - Landing page with features
2. **Login** - User authentication
3. **Signup** - User registration
4. **Dashboard** - Stock trading interface (real-time)
5. **Portfolio** - Holdings and P/L tracking
6. **Teams** - Team listings
7. **Leaderboard** - Rankings
8. **Admin** - System controls

### Components

- **Navbar** - Responsive navigation
- **Card** - Reusable card component
- **LoadingSpinner** - Loading indicators
- **ProtectedRoute** - Auth guard
- **AdminRoute** - Admin-only routes

---

## 🛠️ Tech Stack

### Core

- **React** ^18.2.0
- **React Router DOM** ^6.20.1
- **Vite** ^5.0.8 (build tool)

### Styling

- **Tailwind CSS** ^3.4.0
- **PostCSS** ^8.4.32
- **Autoprefixer** ^10.4.16

### Data & API

- **Axios** ^1.6.2 (HTTP client)
- **Socket.io Client** ^4.6.0 (real-time)

### Visualization

- **Recharts** ^2.10.3 (charts)

### Development

- **@vitejs/plugin-react** ^4.2.1
- **@types/react** ^18.2.43
- **@types/react-dom** ^18.2.17

---

## 📦 Installation

### 1. Navigate to Frontend

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start Development Server

```bash
npm run dev
```

App runs on `http://localhost:5173`

---

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` | Yes |

### Vite Configuration

File: `vite.config.js`

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
})
```

### Tailwind Configuration

File: `tailwind.config.js`

Customize colors, fonts, and breakpoints here.

Default theme includes:
- Primary color: Blue (#3B82F6)
- Success: Green
- Warning: Yellow/Orange
- Error: Red

---

## 🚀 Usage

### Development

```bash
npm run dev
```

Runs on `http://localhost:5173` with hot reload.

### Build for Production

```bash
npm run build
```

Output in `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

### Available Scripts

```json
{
  "dev": "vite",              // Development server
  "build": "vite build",      // Production build
  "preview": "vite preview"   // Preview build
}
```

---

## 📁 Project Structure

```
frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── components/          # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── Card.jsx
│   │   └── LoadingSpinner.jsx
│   ├── contexts/            # React contexts
│   │   └── AuthContext.jsx
│   ├── pages/               # App pages
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Portfolio.jsx
│   │   ├── Teams.jsx
│   │   ├── Leaderboard.jsx
│   │   └── Admin.jsx
│   ├── services/            # API services
│   │   ├── api.js           # Axios instance
│   │   ├── socket.js        # Socket.io client
│   │   └── index.js         # Service exports
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── .env                     # Environment variables
├── .env.example             # Template
├── package.json             # Dependencies
├── tailwind.config.js       # Tailwind config
├── postcss.config.js        # PostCSS config
└── vite.config.js           # Vite config
```

---

## 📄 Pages

### 1. Home (`/`)

Landing page with:
- Hero section
- Feature highlights
- Call-to-action buttons
- Responsive design

### 2. Login (`/login`)

Authentication form:
- Email/password inputs
- Form validation
- Error handling
- Remember me option

### 3. Signup (`/signup`)

Registration form:
- Name, email, password
- Password confirmation
- Team selection dropdown
- Validation rules

### 4. Dashboard (`/dashboard`) ⚡

Main trading interface:
- Stock grid with cards
- Real-time price updates
- Buy/Sell buttons
- Trade modal
- Price change indicators

**Real-Time Features:**
- Listens to `stock_update` events
- Updates prices automatically
- Shows green/red change indicators

### 5. Portfolio (`/portfolio`)

Personal portfolio view:
- Summary cards (Value, Balance, Total)
- Holdings table with P/L
- Pie chart (asset allocation)
- Individual stock performance

### 6. Teams (`/teams`)

Team listings:
- All teams grid
- Team portfolios
- Member counts
- Join team button

### 7. Leaderboard (`/leaderboard`)

Rankings page:
- Top performers list
- Portfolio values
- Medal icons (🥇🥈🥉)
- Rank numbers

### 8. Admin (`/admin`) 👑

Admin dashboard (admin only):
- **Dashboard Tab**: Stats, trading status, quick actions
- **Stocks Tab**: Price management, update controls
- **Users Tab**: User directory, balances
- **Transactions Tab**: Real-time trade feed
- **Actions Tab**: Admin audit trail

**Features:**
- Tab-based navigation
- Modals for actions
- Real-time data refresh
- Market event triggers

---

## 🧩 Components

### Navbar

Responsive navigation bar:
- Logo and branding
- Navigation links
- Auth-aware (shows/hides based on login)
- Mobile hamburger menu
- Admin link (admin users only)

### Card

Reusable container:
- Optional title
- Consistent padding/shadow
- Flexible content area
- Responsive design

### LoadingSpinner

Loading indicator:
- Three sizes (sm, md, lg)
- Centered layout
- Customizable color
- Used during async operations

---

## 🔌 Services

### API Service Layer

Location: `src/services/index.js`

#### authService
```javascript
await authService.login(email, password);
await authService.signup(name, email, password, teamId);
authService.logout();
```

#### stockService
```javascript
const stocks = await stockService.getAll();
const stock = await stockService.getById(id);
```

#### tradeService
```javascript
await tradeService.buy(stockId, quantity);
await tradeService.sell(stockId, quantity);
```

#### portfolioService
```javascript
const portfolio = await portfolioService.getUser(userId);
```

#### teamService
```javascript
const teams = await teamService.getAll();
await teamService.join(teamId);
```

#### transactionService
```javascript
const transactions = await transactionService.getUser(userId);
```

#### adminService
```javascript
const users = await adminService.getUsers();
await adminService.updateStockPrice(id, price);
await adminService.freezeTrading(true);
await adminService.triggerMarketEvent('bull_market', 10, stocks);
```

### Socket Service

Location: `src/services/socket.js`

#### Connection
```javascript
// Connect with JWT token
socketService.connect(token);

// Check connection status
socketService.isConnected();
```

#### Event Listeners
```javascript
// Register listener
socketService.on('stock_update', (data) => {
  console.log('Price updated:', data);
});

// Remove listener
socketService.off('stock_update', callback);

// Disconnect
socketService.disconnect();
```

#### Events Handled
- `stock_update` - Live price changes
- `trade_executed` - Trade notifications
- `leaderboard_update` - Ranking changes
- `portfolio_update` - Portfolio changes
- `market_event` - Market broadcasts

---

## ⚡ Real-Time Features

### Socket.io Integration

The app uses Socket.io for real-time updates.

#### Connection Flow

1. User logs in
2. JWT token stored in localStorage
3. Socket service connects with token
4. Server verifies token
5. Client joins user room
6. Events start flowing

#### Automatic Updates

**Dashboard:**
- Listens for `stock_update`
- Updates stock prices in real-time
- Visual indicators (green/red)

**Portfolio:**
- Ready for `portfolio_update`
- Auto-refreshes holdings value

**Leaderboard:**
- Ready for `leaderboard_update`
- Updates rankings automatically

### Example Usage

```javascript
import socketService from './services/socket';

// In component useEffect
useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    socketService.connect(token);
  }
  
  // Listen for stock updates
  socketService.on('stock_update', handleStockUpdate);
  
  return () => {
    socketService.off('stock_update', handleStockUpdate);
  };
}, []);
```

---

## 🎨 Styling

### Tailwind CSS

Utility-first CSS framework.

Example:
```jsx
<div className="max-w-7xl mx-auto px-4 py-8">
  <h1 className="text-3xl font-bold text-gray-900">
    Dashboard
  </h1>
</div>
```

### Color Scheme

**Primary Colors:**
- Blue: `bg-blue-600`, `text-blue-600`
- Green: `bg-green-600`, `text-green-600`
- Red: `bg-red-600`, `text-red-600`
- Gray: `bg-gray-100`, `text-gray-600`

**Status Colors:**
- Success: Green
- Warning: Yellow/Orange
- Error: Red
- Info: Blue

### Responsive Design

Breakpoints:
- `sm:` ≥ 640px
- `md:` ≥ 768px
- `lg:` ≥ 1024px
- `xl:` ≥ 1280px
- `2xl:` ≥ 1536px

Example:
```jsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <!-- Responsive grid -->
</div>
```

---

## 🏗️ Build & Deployment

### Development Build

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

Creates optimized bundle in `dist/`.

### Deploy to Hosting

#### Option 1: Netlify

1. Build: `npm run build`
2. Drag `dist/` to Netlify drop
3. Or connect GitHub repo

#### Option 2: Vercel

1. Install Vercel CLI
2. Run `vercel` in project
3. Follow prompts

#### Option 3: Manual Deployment

1. Build: `npm run build`
2. Upload `dist/` contents to web server
3. Configure server for SPA routing

#### Option 4: Docker

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 80
CMD ["npx", "serve", "dist"]
```

### Environment Variables for Production

Update `.env`:

```env
VITE_API_URL=https://api.yourdomain.com/api
```

Rebuild after changing env vars.

---

## 🧪 Testing

### Run Tests (if configured)

```bash
npm test
```

### Manual Testing Checklist

- [ ] Home page loads
- [ ] Login works
- [ ] Signup creates user
- [ ] Dashboard shows stocks
- [ ] Buy order executes
- [ ] Sell order executes
- [ ] Portfolio displays correctly
- [ ] Charts render properly
- [ ] Real-time updates work
- [ ] Admin panel accessible
- [ ] Mobile responsive works
- [ ] Navigation works

---

## 🔧 Troubleshooting

### Cannot Connect to Backend

**Problem:** Network error or CORS issue

**Solutions:**
1. Verify backend is running
2. Check `VITE_API_URL` in `.env`
3. Ensure CORS configured in backend
4. Check browser console for errors

### Socket.io Not Connecting

**Problem:** WebSocket connection fails

**Solutions:**
1. Verify backend Socket.io initialized
2. Check JWT token validity
3. Look for connection errors in console
4. Ensure both servers running

### Blank Page After Build

**Problem:** White screen

**Solutions:**
1. Check browser console for errors
2. Verify base URL configuration
3. Check asset paths
4. Clear browser cache

### Component Not Rendering

**Problem:** Component missing

**Solutions:**
1. Check import paths
2. Verify component exported correctly
3. Look for JSX syntax errors
4. Check console for errors

### Styles Not Applying

**Problem:** Tailwind classes not working

**Solutions:**
1. Verify Tailwind installed
2. Check `tailwind.config.js` content paths
3. Ensure `@tailwind` directives in CSS
4. Restart dev server

---

## 📞 Support

### Documentation

- [Main README](../README.md)
- [Backend README](../backend/README.md)
- [API Documentation](../API_DOCS.md)

### Common Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Preview build
npm run preview

# Install dependencies
npm install
```

---

**Built with ❤️ using React, Vite, Tailwind CSS, and Socket.io**
