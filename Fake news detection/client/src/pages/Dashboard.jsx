import { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/analyze/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <div className="p-8 text-center">Loading dashboard...</div>;

  const pieData = [
    { name: 'Fake', value: stats.fakeCount, color: '#ef4444' },
    { name: 'Real', value: stats.realCount, color: '#22c55e' }
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-darkCard p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="text-gray-500 text-sm font-medium mb-1">Total Analyzed</div>
          <div className="text-3xl font-bold">{stats.total}</div>
        </div>
        <div className="bg-white dark:bg-darkCard p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="text-gray-500 text-sm font-medium mb-1">Fake Detected</div>
          <div className="text-3xl font-bold text-red-500">{stats.fakeCount}</div>
        </div>
        <div className="bg-white dark:bg-darkCard p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="text-gray-500 text-sm font-medium mb-1">Real Detected</div>
          <div className="text-3xl font-bold text-green-500">{stats.realCount}</div>
        </div>
        <div className="bg-white dark:bg-darkCard p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="text-gray-500 text-sm font-medium mb-1">Recent (7d)</div>
          <div className="text-3xl font-bold text-primary">
            {stats.recentActivity.reduce((acc, curr) => acc + curr.count, 0)}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-darkCard p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="font-bold mb-6">Fake vs Real Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-darkCard p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="font-bold mb-6">Activity (Last 7 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.recentActivity.reverse()}>
                <XAxis dataKey="date" tick={{fontSize: 12}} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
