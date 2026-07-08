import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { PlusCircle, FileText, LogOut, HelpCircle } from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [data, setData] = useState({ totalRevenue: 0, percentage: 0 });
  const [ads, setAds] = useState([]);
  const [userRole, setUserRole] = useState('USER');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
    fetchAds();
    fetchUserRole();
  }, []);

  const fetchUserRole = async () => {
    try {
      const res = await api.get('/auth/me');
      setUserRole(res.data.role);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAds = async () => {
    try {
      const res = await api.get('/ads/active');
      setAds(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/transactions/dashboard');
      setData(res.data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/auth');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
  };

  const chartData = {
    labels: ['Đã thu', 'Còn lại đến mốc nộp thuế'],
    datasets: [
      {
        data: [data.percentage, 100 - data.percentage],
        backgroundColor: [
          data.percentage >= 100 ? '#ef4444' : '#10b981',
          '#e2e8f0'
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="animate-fade-in" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="flex justify-between items-center mb-4">
        <h2 style={{ fontSize: '1.25rem' }}>Tổng quan doanh thu</h2>
        <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>
          <LogOut size={24} />
        </button>
      </div>

      <div className="card text-center mb-4">
        <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Doanh thu năm nay</h3>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: data.percentage >= 100 ? 'var(--danger)' : 'var(--primary)' }}>
          {data.totalRevenue.toLocaleString('vi-VN')} đ
        </div>
        
        <div style={{ width: '200px', height: '200px', margin: '1.5rem auto', position: 'relative' }}>
          <Doughnut data={chartData} options={{ cutout: '75%', plugins: { legend: { display: false } } }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontWeight: 'bold', fontSize: '1.5rem' }}>
            {data.percentage.toFixed(1)}%
          </div>
        </div>
        
        {data.percentage >= 100 ? (
          <div style={{ color: 'var(--danger)', fontWeight: 'bold' }}>Bạn đã vượt mốc chịu thuế (1 tỷ)!</div>
        ) : (
          <div style={{ color: 'var(--secondary)', fontSize: '0.875rem' }}>Còn {(1000000000 - data.totalRevenue).toLocaleString('vi-VN')} đ nữa đến mốc nộp thuế.</div>
        )}
      </div>

      {ads.length > 0 && (
        <div className="mb-4 animate-fade-in" style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <a href={ads[0].link || '#'} target="_blank" rel="noreferrer">
            <img src={ads[0].imageUrl} alt="Advertisement" style={{ width: '100%', display: 'block', objectFit: 'cover', maxHeight: '120px' }} />
          </a>
        </div>
      )}

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/add-transaction" className="btn btn-primary" style={{ flex: 1, textDecoration: 'none' }}>
            <PlusCircle size={20} style={{ marginRight: '8px' }} />
            Nhập thu
          </Link>
          <Link to="/report" className="btn btn-secondary" style={{ flex: 1, textDecoration: 'none' }}>
            <FileText size={20} style={{ marginRight: '8px' }} />
            Báo cáo
          </Link>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/support" className="btn" style={{ flex: 1, textDecoration: 'none', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-main)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <HelpCircle size={20} style={{ marginRight: '8px' }} />
            Hỗ trợ
          </Link>
          {userRole === 'ADMIN' && (
            <Link to="/admin" className="btn" style={{ flex: 1, textDecoration: 'none', background: 'var(--danger)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              Trang Quản trị
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
