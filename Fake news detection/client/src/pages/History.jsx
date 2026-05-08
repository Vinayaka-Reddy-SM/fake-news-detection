import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchHistory();
  }, [filter]);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      let url = 'http://localhost:5000/api/analyze/history?limit=50';
      if (filter !== 'ALL') url += `&label=${filter}`;
      
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(res.data.data);
    } catch (err) {
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/analyze/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(history.filter(h => h._id !== id));
      toast.success('Deleted successfully');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Analysis History</h1>
        <select 
          className="input-field w-auto py-2"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="ALL">All Results</option>
          <option value="FAKE">Fake News Only</option>
          <option value="REAL">Real News Only</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : history.length === 0 ? (
        <div className="text-center py-20 text-gray-500 dark:text-gray-400 bg-white dark:bg-darkCard rounded-xl border border-gray-100 dark:border-gray-800">
          No history found. Go analyze some articles!
        </div>
      ) : (
        <div className="bg-white dark:bg-darkCard rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="p-4 font-medium text-gray-500 dark:text-gray-400">Date</th>
                  <th className="p-4 font-medium text-gray-500 dark:text-gray-400 w-1/2">Snippet</th>
                  <th className="p-4 font-medium text-gray-500 dark:text-gray-400">Label</th>
                  <th className="p-4 font-medium text-gray-500 dark:text-gray-400">Confidence</th>
                  <th className="p-4 font-medium text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {history.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="p-4 text-sm whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                      {item.inputText.substring(0, 100)}...
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.label === 'FAKE' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                      }`}>
                        {item.label}
                      </span>
                    </td>
                    <td className="p-4 font-medium">
                      {(item.confidence * 100).toFixed(1)}%
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => handleDelete(item._id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
