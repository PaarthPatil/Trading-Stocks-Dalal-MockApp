import { useState, useEffect } from 'react';
import { adminService, stockService } from '../services';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceModal, setPriceModal] = useState({ open: false, stock: null, price: '' });
  const [eventModal, setEventModal] = useState({ open: false, eventType: '', impactPercent: 0 });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, stocksRes, usersRes, transactionsRes, actionsRes] = await Promise.all([
        adminService.getSystemStatus(),
        adminService.getStocks(),
        adminService.getUsers(),
        adminService.getTransactions(),
        adminService.getActions(50)
      ]);

      setStats(statsRes.data);
      setStocks(stocksRes.data.stocks);
      setUsers(usersRes.data.users);
      setTransactions(transactionsRes.data.transactions.slice(0, 20));
      setActions(actionsRes.data.actions);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePrice = async () => {
    try {
      await adminService.updateStockPrice(priceModal.stock.id, parseFloat(priceModal.price));
      setPriceModal({ open: false, stock: null, price: '' });
      loadDashboardData();
      alert('Price updated successfully!');
    } catch (err) {
      alert('Failed to update price: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  const handleTriggerEvent = async () => {
    try {
      const affectedStocks = stocks.map(s => ({ id: s.id }));
      await adminService.triggerMarketEvent(
        eventModal.eventType,
        eventModal.impactPercent,
        affectedStocks
      );
      setEventModal({ open: false, eventType: '', impactPercent: 0 });
      loadDashboardData();
      alert(`Market event "${eventModal.eventType}" triggered!`);
    } catch (err) {
      alert('Failed to trigger event: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  const handleToggleTrading = async () => {
    try {
      await adminService.freezeTrading(!stats.tradingFrozen);
      loadDashboardData();
    } catch (err) {
      alert('Failed to update trading status');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="large" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Control and monitor the entire system</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['dashboard', 'stocks', 'users', 'transactions', 'actions'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium capitalize`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Total Users</p>
                <p className="text-4xl font-bold text-primary-600">{stats?.stats.totalUsers}</p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Total Stocks</p>
                <p className="text-4xl font-bold text-green-600">{stats?.stats.totalStocks}</p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Total Transactions</p>
                <p className="text-4xl font-bold text-purple-600">{stats?.stats.totalTransactions}</p>
              </div>
            </Card>
          </div>

          {/* Trading Status */}
          <Card title="Trading Control">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">
                  Trading is currently {stats?.tradingFrozen ? 'FROZEN' : 'ACTIVE'}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {stats?.tradingFrozen ? 'All trading operations are paused' : 'Users can freely trade stocks'}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-4 py-2 rounded-full font-semibold ${
                  stats?.tradingFrozen 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {stats?.tradingFrozen ? '❄️ Frozen' : '✅ Active'}
                </span>
                <button
                  onClick={handleToggleTrading}
                  className={`px-6 py-2 rounded-md font-medium transition-colors ${
                    stats?.tradingFrozen
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  {stats?.tradingFrozen ? 'Unfreeze Trading' : 'Freeze Trading'}
                </button>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card title="Quick Actions">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setEventModal({ open: true, eventType: '', impactPercent: 0 })}
                className="p-4 bg-primary-50 hover:bg-primary-100 border border-primary-200 rounded-lg text-left transition-colors"
              >
                <h3 className="font-semibold text-primary-900 mb-1">📢 Trigger Market Event</h3>
                <p className="text-sm text-primary-700">Apply market-wide price changes</p>
              </button>
              <button
                onClick={() => setActiveTab('stocks')}
                className="p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg text-left transition-colors"
              >
                <h3 className="font-semibold text-green-900 mb-1">📊 Manage Stocks</h3>
                <p className="text-sm text-green-700">Update stock prices manually</p>
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Stocks Tab */}
      {activeTab === 'stocks' && (
        <Card title="Stock Management">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Symbol</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Initial Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Change</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stocks.map((stock) => (
                  <tr key={stock.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap font-semibold">{stock.symbol}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{stock.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap font-bold">${stock.currentPrice.toFixed(2)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">${stock.initialPrice.toFixed(2)}</td>
                    <td className={`px-4 py-3 whitespace-nowrap font-medium ${
                      stock.currentPrice >= stock.initialPrice ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stock.currentPrice >= stock.initialPrice ? '+' : ''}
                      {((stock.currentPrice - stock.initialPrice) / stock.initialPrice * 100).toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => setPriceModal({ open: true, stock, price: stock.currentPrice.toString() })}
                        className="text-primary-600 hover:text-primary-900 font-medium"
                      >
                        Update Price
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <Card title="User Management">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap font-medium">{user.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{user.email}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{user.teamName || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap font-semibold">${user.balance.toLocaleString()}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {user.isAdmin ? (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">Admin</span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">User</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <Card title="Recent Transactions">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">{tx.userName}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{tx.stockSymbol}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        tx.type === 'BUY' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{tx.quantity}</td>
                    <td className="px-4 py-3 whitespace-nowrap">${tx.price.toFixed(2)}</td>
                    <td className="px-4 py-3 whitespace-nowrap font-semibold">${tx.totalAmount.toFixed(2)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {new Date(tx.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Actions Tab */}
      {activeTab === 'actions' && (
        <Card title="Admin Action Logs">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admin</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {actions.map((action) => (
                  <tr key={action.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap font-medium">{action.adminName}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        {action.actionType}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-700">{action.description}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {new Date(action.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Price Update Modal */}
      {priceModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Update Stock Price</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Price for {priceModal.stock.name}
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={priceModal.price}
                onChange={(e) => setPriceModal({ ...priceModal, price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleUpdatePrice}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                Update
              </button>
              <button
                onClick={() => setPriceModal({ open: false, stock: null, price: '' })}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Market Event Modal */}
      {eventModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Trigger Market Event</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Type
                </label>
                <select
                  value={eventModal.eventType}
                  onChange={(e) => setEventModal({ ...eventModal, eventType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select event...</option>
                  <option value="bull_market">🚀 Bull Market (+10%)</option>
                  <option value="bear_market">🐻 Bear Market (-10%)</option>
                  <option value="market_crash">💥 Market Crash (-25%)</option>
                  <option value="market_boom">🎉 Market Boom (+25%)</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              {eventModal.eventType === 'custom' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Impact Percentage (%)
                  </label>
                  <input
                    type="number"
                    value={eventModal.impactPercent}
                    onChange={(e) => setEventModal({ ...eventModal, impactPercent: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., 15 or -15"
                  />
                </div>
              )}
            </div>
            <div className="mt-6 flex space-x-3">
              <button
                onClick={handleTriggerEvent}
                disabled={!eventModal.eventType}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
              >
                Trigger Event
              </button>
              <button
                onClick={() => setEventModal({ open: false, eventType: '', impactPercent: 0 })}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
