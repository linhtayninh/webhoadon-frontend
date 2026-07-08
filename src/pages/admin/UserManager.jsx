import { useState, useEffect } from 'react';
import { Trash2, Edit2, Plus, UserPlus } from 'lucide-react';
import api from '../../services/api';

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    email: '', password: '', role: 'USER', businessName: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/admin/users/${editingId}`, formData);
        alert('Cập nhật thành công');
      } else {
        await api.post('/admin/users', formData);
        alert('Tạo người dùng thành công');
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ email: '', password: '', role: 'USER', businessName: '' });
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.error || 'Lỗi thao tác');
    }
  };

  const handleEdit = (u) => {
    setEditingId(u.id);
    setFormData({ email: u.email, password: '', role: u.role, businessName: u.businessName || '' });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Chắc chắn xóa người dùng này cùng toàn bộ giao dịch của họ?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (error) {
      alert('Lỗi khi xóa');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 style={{ fontSize: '1.1rem' }}>Danh sách Người dùng</h3>
        <button 
          onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ email: '', password: '', role: 'USER', businessName: '' }); }}
          className="btn btn-primary"
          style={{ width: 'auto', padding: '0.5rem 1rem' }}
        >
          {showForm ? 'Đóng' : <><UserPlus size={18} style={{ marginRight: '8px' }}/> Thêm mới</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: 'var(--bg)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
          <div className="input-group">
            <label>Email</label>
            <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required disabled={!!editingId} />
          </div>
          <div className="input-group">
            <label>Mật khẩu {editingId && '(Để trống nếu không muốn đổi)'}</label>
            <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required={!editingId} />
          </div>
          <div className="input-group">
            <label>Tên Cá nhân/Hộ kinh doanh</label>
            <input type="text" value={formData.businessName} onChange={e => setFormData({...formData, businessName: e.target.value})} />
          </div>
          <div className="input-group">
            <label>Quyền hạn</label>
            <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
              <option value="USER">Người dùng (USER)</option>
              <option value="ADMIN">Quản trị viên (ADMIN)</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">{editingId ? 'Cập nhật' : 'Tạo mới'}</button>
        </form>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)' }}>
              <th style={{ padding: '0.75rem 0.5rem' }}>Email</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Quyền</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Giao dịch</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.75rem 0.5rem' }}>
                  <div style={{ fontWeight: '600' }}>{u.email}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.businessName}</div>
                </td>
                <td style={{ padding: '0.75rem 0.5rem' }}>
                  <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', background: u.role === 'ADMIN' ? 'var(--danger)' : 'var(--border)', color: u.role === 'ADMIN' ? 'white' : 'var(--text-main)' }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: '0.75rem 0.5rem' }}>{u._count?.transactions}</td>
                <td style={{ padding: '0.75rem 0.5rem' }}>
                  <button onClick={() => handleEdit(u)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', marginRight: '0.5rem' }}><Edit2 size={18}/></button>
                  <button onClick={() => handleDelete(u.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
