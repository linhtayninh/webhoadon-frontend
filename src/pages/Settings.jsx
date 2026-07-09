import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, Shield, User } from 'lucide-react';
import api from '../services/api';

export default function Settings() {
  const [profile, setProfile] = useState({
    businessName: '', taxCode: '', address: '', businessLocation: '', businessType: ''
  });
  const [passwords, setPasswords] = useState({
    oldPassword: '', newPassword: '', confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data) {
        setProfile({
          businessName: res.data.businessName || '',
          taxCode: res.data.taxCode || '',
          address: res.data.address || '',
          businessLocation: res.data.businessLocation || '',
          businessType: res.data.businessType || ''
        });
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin:', error);
    }
  };

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    if (passwords.newPassword && passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ text: 'Mật khẩu mới và xác nhận không khớp!', type: 'error' });
      setIsLoading(false);
      return;
    }

    try {
      const payload = { ...profile };
      if (passwords.newPassword) {
        payload.oldPassword = passwords.oldPassword;
        payload.newPassword = passwords.newPassword;
      }

      await api.put('/auth/settings', payload);
      setMessage({ text: 'Lưu thay đổi thành công!', type: 'success' });
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' }); // Xoá form password sau khi đổi thành công
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.error || 'Có lỗi xảy ra khi lưu', 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '1.5rem', paddingBottom: '3rem' }}>
      <div className="flex items-center mb-6">
        <Link to="/" style={{ color: 'var(--text-main)', marginRight: '1rem' }}><ArrowLeft /></Link>
        <h2 style={{ fontSize: '1.25rem' }}>Cài đặt Tài khoản</h2>
      </div>

      {message.text && (
        <div style={{
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          backgroundColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          color: message.type === 'success' ? 'var(--secondary)' : 'var(--danger)',
          border: `1px solid ${message.type === 'success' ? 'var(--secondary)' : 'var(--danger)'}`
        }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="card mb-6">
          <h3 className="flex items-center" style={{ marginBottom: '1.5rem', color: 'var(--primary)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            <User size={20} style={{ marginRight: '8px' }} />
            Thông tin Hồ sơ
          </h3>
          
          <div className="input-group">
            <label>Tên Cá nhân/Hộ kinh doanh</label>
            <input type="text" name="businessName" required value={profile.businessName} onChange={handleProfileChange} />
          </div>
          
          <div className="input-group">
            <label>Mã số thuế</label>
            <input type="text" name="taxCode" required value={profile.taxCode} onChange={handleProfileChange} />
          </div>
          
          <div className="input-group">
            <label>Địa chỉ</label>
            <input type="text" name="address" required value={profile.address} onChange={handleProfileChange} />
          </div>
          
          <div className="input-group">
            <label>Địa điểm kinh doanh</label>
            <input type="text" name="businessLocation" required value={profile.businessLocation} onChange={handleProfileChange} />
          </div>
          
          <div className="input-group">
            <label>Ngành nghề</label>
            <select name="businessType" required value={profile.businessType} onChange={handleProfileChange}>
              <option value="">Chọn ngành nghề...</option>
              <option value="Phân phối, cung cấp hàng hóa">Phân phối, cung cấp hàng hóa</option>
              <option value="Dịch vụ, xây dựng">Dịch vụ, xây dựng</option>
              <option value="Sản xuất, vận tải, dịch vụ có gắn với hàng hóa">Sản xuất, vận tải, dịch vụ có gắn với hàng hóa</option>
              <option value="Hoạt động kinh doanh khác">Hoạt động kinh doanh khác</option>
            </select>
          </div>
        </div>

        <div className="card mb-6">
          <h3 className="flex items-center" style={{ marginBottom: '1.5rem', color: 'var(--danger)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            <Shield size={20} style={{ marginRight: '8px' }} />
            Bảo mật & Mật khẩu
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Để trống nếu bạn không muốn thay đổi mật khẩu.
          </p>

          <div className="input-group">
            <label>Mật khẩu cũ (nếu có)</label>
            <input type="password" name="oldPassword" value={passwords.oldPassword} onChange={handlePasswordChange} placeholder="Nhập mật khẩu hiện tại" />
          </div>
          
          <div className="input-group">
            <label>Mật khẩu mới</label>
            <input type="password" name="newPassword" value={passwords.newPassword} onChange={handlePasswordChange} placeholder="Nhập mật khẩu mới" />
          </div>

          <div className="input-group">
            <label>Xác nhận mật khẩu mới</label>
            <input type="password" name="confirmPassword" value={passwords.confirmPassword} onChange={handlePasswordChange} placeholder="Nhập lại mật khẩu mới" />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Save size={20} style={{ marginRight: '8px' }} />
          {isLoading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
        </button>
      </form>
    </div>
  );
}
