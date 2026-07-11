import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Save, Upload, Loader2, ChevronLeft, ChevronRight, Trash2, Edit2, X } from 'lucide-react';

export default function TransactionForm() {
  const [formData, setFormData] = useState({ amount: '', description: '', date: new Date().toISOString().split('T')[0] });
  const [isScanning, setIsScanning] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const itemsPerPage = 5;
  const fileInputRef = useRef(null);

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/transactions');
      setTransactions(res.data);
    } catch (error) {
      console.error('Failed to fetch transactions');
    }
  };

  const fetchSuggestions = async () => {
    try {
      const res = await api.get('/transactions/descriptions');
      setSuggestions(res.data);
    } catch (error) {
      console.error('Failed to fetch suggestions');
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchSuggestions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/transactions/${editingId}`, formData);
        alert('Đã cập nhật giao dịch!');
      } else {
        await api.post('/transactions', formData);
        alert('Đã lưu giao dịch!');
      }
      setFormData(prev => ({ ...prev, amount: '', description: '' }));
      setEditingId(null);
      fetchTransactions();
      fetchSuggestions();
      if (!editingId) setCurrentPage(1);
    } catch (error) {
      alert(editingId ? 'Lỗi cập nhật giao dịch' : 'Lỗi lưu giao dịch');
    }
  };

  const handleEdit = (tx) => {
    setEditingId(tx.id);
    setFormData({
      amount: tx.amount,
      description: tx.description,
      date: new Date(tx.date).toISOString().split('T')[0]
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(prev => ({ ...prev, amount: '', description: '' }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa giao dịch này?')) return;
    try {
      await api.delete(`/transactions/${id}`);
      if (editingId === id) cancelEdit();
      await fetchTransactions();
      const newTotalPages = Math.ceil((transactions.length - 1) / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    } catch (error) {
      alert('Lỗi khi xóa giao dịch');
    }
  };

  const handleScan = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const scanData = new FormData();
    scanData.append('image', file);

    setIsScanning(true);
    try {
      const res = await api.post('/transactions/scan-invoice', scanData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const { amount, description, date } = res.data;
      
      setFormData(prev => ({
        ...prev,
        amount: amount || prev.amount,
        description: description || prev.description,
        date: date || prev.date
      }));
      
      alert('AI đã quét thành công!');
    } catch (error) {
      alert(error.response?.data?.error || 'Lỗi quét ảnh bằng AI');
    } finally {
      setIsScanning(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const currentTransactions = transactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="animate-fade-in" style={{ padding: '1.5rem', paddingBottom: '5rem' }}>
      <div className="flex items-center mb-4">
        <Link to="/" style={{ color: 'var(--text-main)', marginRight: '1rem' }}><ArrowLeft /></Link>
        <h2 style={{ fontSize: '1.25rem' }}>{editingId ? 'Sửa Giao Dịch' : 'Nhập Doanh Thu Mới'}</h2>
      </div>

      {!editingId && (
        <div className="card mb-4 text-center" style={{ background: 'var(--bg)', borderStyle: 'dashed' }}>
          <input 
            type="file" 
            accept="image/jpeg, image/png" 
            style={{ display: 'none' }} 
            ref={fileInputRef}
            onChange={handleScan}
          />
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => fileInputRef.current.click()}
            disabled={isScanning}
          >
            {isScanning ? (
              <><Loader2 className="animate-spin" size={20} style={{ marginRight: '8px' }} /> AI đang phân tích...</>
            ) : (
              <><Upload size={20} style={{ marginRight: '8px', color: 'var(--primary)' }} /> Tải ảnh hóa đơn lên (AI)</>
            )}
          </button>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Hỗ trợ bóc tách Số tiền, Diễn giải từ ảnh
          </p>
        </div>
      )}

      <div className="card mb-6" style={editingId ? { border: '2px solid var(--primary)' } : {}}>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Số tiền (VNĐ)</label>
            <input 
              type="number" 
              value={formData.amount} 
              onChange={e => setFormData({...formData, amount: e.target.value})} 
              required 
              placeholder="Ví dụ: 500000"
              style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', transition: 'all 0.3s' }}
            />
          </div>
          
          <div className="input-group">
            <label>Diễn giải</label>
            <input 
              type="text" 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              required 
              placeholder="Bán hàng..."
              list="desc-suggestions"
              autoComplete="off"
            />
            <datalist id="desc-suggestions">
              {suggestions.map((desc, idx) => (
                <option key={idx} value={desc} />
              ))}
            </datalist>
          </div>

          <div className="input-group">
            <label>Ngày</label>
            <input 
              type="date" 
              value={formData.date} 
              onChange={e => setFormData({...formData, date: e.target.value})} 
              required 
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              <Save size={20} style={{ marginRight: '8px' }} />
              {editingId ? 'Cập nhật' : 'Lưu Giao Dịch'}
            </button>
            {editingId && (
              <button type="button" className="btn btn-secondary" onClick={cancelEdit} style={{ flex: 0.5 }}>
                <X size={20} style={{ marginRight: '8px' }} />
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>

      {transactions.length > 0 && (
        <div className="card animate-fade-in" style={{ padding: '1rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Giao dịch vừa nhập</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {currentTransactions.map((tx) => (
              <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', background: editingId === tx.id ? 'var(--bg)' : 'transparent', padding: editingId === tx.id ? '0.5rem' : '0 0 0.5rem 0', borderRadius: '4px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{tx.description}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(tx.date).toLocaleDateString('vi-VN')}</div>
                </div>
                <div style={{ fontWeight: 'bold', color: 'var(--primary)', marginRight: '1rem' }}>
                  +{tx.amount.toLocaleString('vi-VN')} đ
                </div>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <button 
                    onClick={() => handleEdit(tx)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: '0.25rem' }}
                    title="Sửa giao dịch này"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(tx.id)}
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.25rem' }}
                    title="Xóa giao dịch này"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1.5rem', gap: '1rem' }}>
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                style={{ padding: '0.25rem', background: 'transparent', border: 'none', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
              >
                <ChevronLeft size={24} color="var(--primary)" />
              </button>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Trang {currentPage} / {totalPages}</span>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                style={{ padding: '0.25rem', background: 'transparent', border: 'none', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}
              >
                <ChevronRight size={24} color="var(--primary)" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
