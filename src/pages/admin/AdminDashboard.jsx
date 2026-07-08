import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, MonitorPlay, Download } from 'lucide-react';
import api from '../../services/api';
import UserManager from './UserManager';
import AdsManager from './AdsManager';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin
    const checkAdmin = async () => {
      try {
        const res = await api.get('/auth/me');
        if (res.data.role !== 'ADMIN') {
          navigate('/');
        }
      } catch (error) {
        navigate('/');
      }
    };
    checkAdmin();
  }, [navigate]);

  const handleBackup = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/admin/backup', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Lỗi backup');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Không thể sao lưu dữ liệu');
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
      <div className="flex items-center mb-6">
        <Link to="/" style={{ color: 'var(--text-main)', marginRight: '1rem' }}><ArrowLeft /></Link>
        <h2 style={{ fontSize: '1.25rem' }}>Trang Quản Trị (Admin)</h2>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        <button 
          onClick={() => setActiveTab('users')} 
          className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ flex: 1, whiteSpace: 'nowrap' }}
        >
          <Users size={18} style={{ marginRight: '8px' }} /> User
        </button>
        <button 
          onClick={() => setActiveTab('ads')} 
          className={`btn ${activeTab === 'ads' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ flex: 1, whiteSpace: 'nowrap' }}
        >
          <MonitorPlay size={18} style={{ marginRight: '8px' }} /> Quảng cáo
        </button>
        <button 
          onClick={handleBackup} 
          className="btn btn-secondary"
          style={{ flex: 1, whiteSpace: 'nowrap', borderColor: 'var(--secondary)', color: 'var(--secondary)' }}
        >
          <Download size={18} style={{ marginRight: '8px' }} /> Backup
        </button>
      </div>

      <div className="card">
        {activeTab === 'users' && <UserManager />}
        {activeTab === 'ads' && <AdsManager />}
      </div>
    </div>
  );
}
