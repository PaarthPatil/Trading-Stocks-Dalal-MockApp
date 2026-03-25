import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { stockService, tradeService } from '../services';
import { useAuth } from '../contexts/AuthContext';
import socketService from '../services/socket';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Dashboard() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tradeModal, setTradeModal] = useState({ open: false, stock: null, type: 'buy' });
  const [quantity, setQuantity] = useState(1);
  const [tradeLoading, setTradeLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadStocks();
    
    // Set up real-time listeners
    const token = localStorage.getItem('token');
    if (token) {
      socketService.connect(token);
    }
    
    // Listen for stock updates
    socketService.on('stock_update', handleStockUpdate);
    
    return () => {
      socketService.off('stock_update', handleStockUpdate);
    };
  }, [isAuthenticated, navigate]);

  const loadStocks = async () => {
    try {
      setLoading(true);
      const result = await stockService.getAll();
      setStocks(result.data.stocks);
      setError(null);
    } catch (err) {
      setError('Failed to load stocks');
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = (stock) => {
    setTradeModal({ open: true, stock, type: 'buy' });
    setQuantity(1);
  };

  const handleSell = (stock) => {
    setTradeModal({ open: true, stock, type: 'sell' });
    setQuantity(1);
  };

  const executeTrade = async () => {
    try {
      setTradeLoading(true);
      if (tradeModal.type === 'buy') {
        await tradeService.buy(tradeModal.stock.id, parseInt(quantity));
      } else {
        await tradeService.sell(tradeModal.stock.id, parseInt(quantity));
      }
      setTradeModal({ open: false, stock: null, type: 'buy' });
      loadStocks(); // Refresh data
    } catch (err) {
      alert(err.response?.data?.error || 'Trade failed');
    } finally {
      setTradeLoading(false);
    }
  };

  const handleStockUpdate = (data) => {
    // Update the stock in the list with new price
    setStocks(prevStocks => 
      prevStocks.map(stock => 
        stock.id === data.id 
          ? { ...stock, currentPrice: data.currentPrice, priceChange: data.priceChange }
          : stock
      )
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Market Dashboard</h1>
        <p className="text-gray-600 mt-2">View and trade available stocks</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stocks.map((stock) => (
          <Card key={stock.id} className="hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{stock.name}</h3>
                <p className="text-sm text-gray-500">{stock.symbol}</p>
              </div>
              <span className={`text-sm font-semibold px-2 py-1 rounded ${
                stock.currentPrice >= stock.initialPrice
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {stock.currentPrice >= stock.initialPrice ? '+' : ''}
                {((stock.currentPrice - stock.initialPrice) / stock.initialPrice * 100).toFixed(2)}%
              </span>
            </div>

            <div className="mb-4">
              <p className="text-3xl font-bold text-gray-900">${stock.currentPrice.toFixed(2)}</p>
              <p className="text-sm text-gray-500">Initial: ${stock.initialPrice.toFixed(2)}</p>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleBuy(stock)}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                Buy
              </button>
              <button
                onClick={() => handleSell(stock)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                Sell
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Trade Modal */}
      {tradeModal.open && tradeModal.stock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">
              {tradeModal.type === 'buy' ? 'Buy' : 'Sell'} {tradeModal.stock.name}
            </h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600">
                Total: <span className="font-bold text-lg">
                  ${(quantity * tradeModal.stock.currentPrice).toFixed(2)}
                </span>
              </p>
              <p className="text-sm text-gray-500">
                Price per share: ${tradeModal.stock.currentPrice.toFixed(2)}
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={executeTrade}
                disabled={tradeLoading}
                className={`flex-1 ${
                  tradeModal.type === 'buy' 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-red-500 hover:bg-red-600'
                } text-white px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50`}
              >
                {tradeLoading ? 'Processing...' : 'Confirm'}
              </button>
              <button
                onClick={() => setTradeModal({ open: false, stock: null, type: 'buy' })}
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
