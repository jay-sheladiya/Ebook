import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import { Loader2, Activity, CheckCircle, AlertCircle } from 'lucide-react';

const ActivityLog = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axiosInstance.get('/api/features/activities', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setLogs(res.data);
      } catch {
        alert('Failed to load activities.');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchLogs();
  }, [user]);

  // Helper to choose icons based on action
  const getIcon = (action) => {
    if (action.toLowerCase().includes('created'))
      return <CheckCircle className="text-green-500 w-5 h-5" />;
    if (action.toLowerCase().includes('deleted'))
      return <AlertCircle className="text-red-500 w-5 h-5" />;
    return <Activity className="text-blue-500 w-5 h-5" />;
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-lg mt-6 border border-gray-200">
      <h3 className="font-bold text-lg mb-3 text-gray-800">📜 Activity Log</h3>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin text-blue-500 w-6 h-6" />
          <span className="ml-2 text-gray-600">Loading activities...</span>
        </div>
      ) : logs.length === 0 ? (
        <p className="text-gray-500 text-sm text-center">No recent activities.</p>
      ) : (
        <div className="max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {logs.map((log) => (
            <div
              key={log._id}
              className="flex items-center gap-3 p-3 mb-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
            >
              {getIcon(log.action)}
              <div>
                <p className="text-sm text-gray-800">
                  <span className="font-medium">{log.user?.name || 'You'}</span> {log.action}
                </p>
                {log.createdAt && (
                  <p className="text-xs text-gray-500">
                    {new Date(log.createdAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityLog;
