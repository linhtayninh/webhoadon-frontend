import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import api from '../services/api';
import { LogIn, UserPlus } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '', password: '', taxCode: '', businessName: '', address: '', businessLocation: '', businessType: ''
  });
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await api.post('/auth/google', { credential: credentialResponse.credential });
      
      if (res.data.status === 'profile_incomplete') {
        navigate('/update-profile', { state: { userId: res.data.userId } });
      } else {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        window.location.href = '/';
      }
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.error || error.message || 'Lỗi đăng nhập Google'));
    }
  };

  const handleGoogleError = () => {
    console.log('Google Login Failed');
    alert('Đăng nhập Google thất bại');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isForgotPassword) {
        const res = await api.post('/auth/reset-password-mst', {
          email: formData.email,
          taxCode: formData.taxCode,
          newPassword: formData.password
        });
        alert(res.data.message);
        setIsForgotPassword(false);
        setIsLogin(true);
      } else if (isLogin) {
        const res = await api.post('/auth/login', { email: formData.email, password: formData.password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        window.location.href = '/';
      } else {
        await api.post('/auth/register', formData);
        setIsLogin(true);
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Có lỗi xảy ra');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem' }}>
      <div className="text-center mb-4">
        <h1 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
          Sổ tay Cá nhân, Hộ kinh doanh
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>3 Phút Mỗi Ngày, Cả Năm Không Lo Phạt</p>
      </div>

      <div className="card">
        <h2 className="mb-4 text-center">
          {isForgotPassword ? 'Khôi Phục Mật Khẩu' : isLogin ? 'Đăng Nhập' : 'Đăng Ký'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input type="email" name="email" required onChange={handleChange} value={formData.email} />
          </div>

          {isForgotPassword && (
            <div className="input-group">
              <label>Mã số thuế (Để xác minh)</label>
              <input type="text" name="taxCode" required onChange={handleChange} value={formData.taxCode} />
            </div>
          )}

          <div className="input-group">
            <label>{isForgotPassword ? 'Mật khẩu mới' : 'Mật khẩu'}</label>
            <input type="password" name="password" required onChange={handleChange} value={formData.password} />
          </div>
          
          {!isLogin && !isForgotPassword && (
            <>
              <div className="input-group">
                <label>Tên Cá nhân/Hộ kinh doanh</label>
                <input type="text" name="businessName" required onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Mã số thuế</label>
                <input type="text" name="taxCode" required onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Địa chỉ</label>
                <input type="text" name="address" required onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Địa điểm kinh doanh</label>
                <input type="text" name="businessLocation" required onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Ngành nghề</label>
                <select name="businessType" onChange={handleChange}>
                  <option value="">Chọn ngành nghề...</option>
                  <option value="Phân phối, cung cấp hàng hóa">Phân phối, cung cấp hàng hóa</option>
                  <option value="Dịch vụ, xây dựng">Dịch vụ, xây dựng</option>
                  <option value="Sản xuất, vận tải, dịch vụ có gắn với hàng hóa">Sản xuất, vận tải, dịch vụ có gắn với hàng hóa</option>
                  <option value="Hoạt động kinh doanh khác">Hoạt động kinh doanh khác</option>
                </select>
              </div>
            </>
          )}

          {isLogin && !isForgotPassword && (
            <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
              <button 
                type="button" 
                onClick={() => setIsForgotPassword(true)}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.875rem' }}
              >
                Quên mật khẩu?
              </button>
            </div>
          )}

          <button type="submit" className="btn btn-primary mt-4">
            {isForgotPassword ? 'Đổi Mật Khẩu Mới' : isLogin ? <><LogIn size={18} style={{ marginRight: '8px' }} /> Đăng Nhập</> : <><UserPlus size={18} style={{ marginRight: '8px' }} /> Đăng Ký</>}
          </button>
        </form>

        {!isForgotPassword && (
          <div className="mt-4" style={{ display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              width="100%"
            />
          </div>
        )}

        <div className="text-center mt-4">
          <button className="btn btn-secondary" onClick={() => {
            if (isForgotPassword) {
              setIsForgotPassword(false);
              setIsLogin(true);
            } else {
              setIsLogin(!isLogin);
            }
          }}>
            {isForgotPassword 
              ? 'Quay lại Đăng nhập' 
              : isLogin 
                ? 'Chưa có tài khoản? Đăng ký ngay' 
                : 'Đã có tài khoản? Đăng nhập'}
          </button>
        </div>
      </div>
    </div>
  );
}
