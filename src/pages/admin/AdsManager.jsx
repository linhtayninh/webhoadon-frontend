import { useState, useEffect } from 'react';
import { Trash2, Edit2, Plus, Image } from 'lucide-react';
import api from '../../services/api';

export default function AdsManager() {
  const [ads, setAds] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    imageUrl: '', link: '', isActive: true
  });

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const res = await api.get('/ads');
      setAds(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/ads/${editingId}`, formData);
        alert('Cập nhật thành công');
      } else {
        await api.post('/ads', formData);
        alert('Thêm quảng cáo thành công');
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ imageUrl: '', link: '', isActive: true });
      fetchAds();
    } catch (error) {
      alert(error.response?.data?.error || 'Lỗi thao tác');
    }
  };

  const handleEdit = (ad) => {
    setEditingId(ad.id);
    setFormData({ imageUrl: ad.imageUrl, link: ad.link || '', isActive: ad.isActive });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Chắc chắn xóa quảng cáo này?')) return;
    try {
      await api.delete(`/ads/${id}`);
      fetchAds();
    } catch (error) {
      alert('Lỗi khi xóa');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 style={{ fontSize: '1.1rem' }}>Danh sách Quảng cáo</h3>
        <button 
          onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ imageUrl: '', link: '', isActive: true }); }}
          className="btn btn-primary"
          style={{ width: 'auto', padding: '0.5rem 1rem' }}
        >
          {showForm ? 'Đóng' : <><Plus size={18} style={{ marginRight: '8px' }}/> Thêm Ads</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: 'var(--bg)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
          <div className="input-group">
            <label>Đường dẫn Ảnh (URL)</label>
            <input type="url" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} required placeholder="https://..." />
          </div>
          <div className="input-group">
            <label>Link đích (Khi click vào)</label>
            <input type="url" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} placeholder="https://..." />
          </div>
          <div className="input-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input 
              type="checkbox" 
              checked={formData.isActive} 
              onChange={e => setFormData({...formData, isActive: e.target.checked})} 
              style={{ width: 'auto' }}
              id="isActive"
            />
            <label htmlFor="isActive" style={{ marginBottom: 0 }}>Đang kích hoạt (Hiển thị trên web)</label>
          </div>
          <button type="submit" className="btn btn-primary">{editingId ? 'Cập nhật' : 'Thêm mới'}</button>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {ads.length === 0 && <div className="text-center" style={{ color: 'var(--text-muted)' }}>Chưa có quảng cáo nào</div>}
        {ads.map(ad => (
          <div key={ad.id} style={{ display: 'flex', gap: '1rem', padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px', alignItems: 'center' }}>
            <div style={{ width: '80px', height: '80px', background: 'var(--bg)', borderRadius: '4px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {ad.imageUrl ? <img src={ad.imageUrl} alt="Ad" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Image size={24} color="var(--text-muted)" />}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <a href={ad.link} target="_blank" rel="noreferrer">{ad.link || 'Không có link'}</a>
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', background: ad.isActive ? 'var(--secondary)' : 'var(--border)', color: ad.isActive ? 'white' : 'var(--text-main)' }}>
                  {ad.isActive ? 'Đang bật' : 'Đã tắt'}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button onClick={() => handleEdit(ad)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}><Edit2 size={18}/></button>
              <button onClick={() => handleDelete(ad.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}><Trash2 size={18}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
