import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

export default function UpdateProfile() {
  const [formData, setFormData] = useState({
    businessName: '', taxCode: '', address: '', businessLocation: '', businessType: '', password: ''
  });
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;

  // Nếu không có userId truyền qua state thì quay lại trang đăng nhập
  if (!userId) {
    navigate('/auth');
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/update-profile', { ...formData, userId });
      // Thành công, lưu token và chuyển hướng
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location.href = '/';
    } catch (error) {
      alert(error.response?.data?.error || 'Có lỗi xảy ra khi cập nhật thông tin');
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem' }}>
      <div className="text-center mb-4">
        <h1 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
          Hoàn tất hồ sơ
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Vui lòng cung cấp thêm thông tin để sử dụng dịch vụ</p>
      </div>

      <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Tên Cá nhân/Hộ kinh doanh</label>
            <input type="text" name="businessName" required onChange={handleChange} value={formData.businessName} />
          </div>
          <div className="input-group">
            <label>Mã số thuế</label>
            <input type="text" name="taxCode" required onChange={handleChange} value={formData.taxCode} />
          </div>
          <div className="input-group">
            <label>Địa chỉ</label>
            <input type="text" name="address" required onChange={handleChange} value={formData.address} />
          </div>
          <div className="input-group">
            <label>Địa điểm kinh doanh</label>
            <input type="text" name="businessLocation" required onChange={handleChange} value={formData.businessLocation} />
          </div>
          <div className="input-group">
            <label>Ngành nghề</label>
            <select name="businessType" onChange={handleChange} required value={formData.businessType}>
              <option value="">Chọn ngành nghề...</option>
              <option value="Phân phối, cung cấp hàng hóa">Phân phối, cung cấp hàng hóa</option>
              <option value="Dịch vụ, xây dựng">Dịch vụ, xây dựng</option>
              <option value="Sản xuất, vận tải, dịch vụ có gắn với hàng hóa">Sản xuất, vận tải, dịch vụ có gắn với hàng hóa</option>
              <option value="Hoạt động kinh doanh khác">Hoạt động kinh doanh khác</option>
            </select>
          </div>
          
          <div className="input-group" style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
            <label>Tạo Mật khẩu dự phòng (Không bắt buộc)</label>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Nếu tạo mật khẩu, sau này bạn có thể đăng nhập bằng Mật khẩu thay vì dùng Google.
            </p>
            <input type="password" name="password" placeholder="Nhập mật khẩu (nếu muốn)" onChange={handleChange} value={formData.password} />
          </div>

          <button type="submit" className="btn btn-primary mt-4" style={{ width: '100%' }}>
            Lưu thông tin và Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}
