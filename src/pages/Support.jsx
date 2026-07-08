import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle } from 'lucide-react';

export default function Support() {
  const [feedback, setFeedback] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSendFeedback = (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    
    // Simulate sending feedback
    setIsSent(true);
    setFeedback('');
    
    setTimeout(() => {
      setIsSent(false);
    }, 3000);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '1.5rem', paddingBottom: '3rem' }}>
      <div className="flex items-center mb-6">
        <Link to="/" style={{ color: 'var(--text-main)', marginRight: '1rem' }}><ArrowLeft /></Link>
        <h2 style={{ fontSize: '1.25rem' }}>Trung Tâm Hỗ Trợ</h2>
      </div>

      <div className="card mb-4" style={{ borderLeft: '4px solid var(--primary)' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Hoàn toàn miễn phí</h3>
        <p style={{ fontSize: '0.9rem', lineHeight: '1.5', color: 'var(--text-main)' }}>
          Phần mềm "Thuế Hộ Kinh Doanh" cam kết cung cấp dịch vụ <strong>MIỄN PHÍ HOÀN TOÀN</strong> và vĩnh viễn cho mọi cá nhân, hộ kinh doanh. Sứ mệnh của chúng tôi là giúp bạn tiết kiệm thời gian, công sức trong việc kê khai doanh thu, xóa bỏ nỗi lo bị phạt thuế.
        </p>
      </div>

      <div className="card mb-4">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Hướng dẫn sử dụng</h3>
        <ul style={{ fontSize: '0.9rem', lineHeight: '1.6', paddingLeft: '1.2rem', color: 'var(--text-main)' }}>
          <li><strong>Nhập doanh thu:</strong> Bấm nút "Nhập thu" tại trang chủ. Bạn có thể nhập tay số tiền hoặc tải lên ảnh hóa đơn để AI tự động trích xuất thông tin.</li>
          <li><strong>Theo dõi tiến độ:</strong> Biểu đồ trang chủ cho biết tổng doanh thu và khoảng cách đến mốc nộp thuế (1 tỷ đồng/năm).</li>
          <li><strong>Xuất báo cáo:</strong> Bấm nút "Báo cáo", chọn tháng năm cần xuất. Hệ thống sẽ tự động tải về máy file Excel theo chuẩn Mẫu số S1a-HKD của Bộ Tài Chính.</li>
        </ul>
      </div>

      <div className="card mb-4">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Quy định sử dụng</h3>
        <ul style={{ fontSize: '0.9rem', lineHeight: '1.6', paddingLeft: '1.2rem', color: 'var(--text-main)' }}>
          <li>Người dùng tự chịu trách nhiệm về tính chính xác của các con số nhập vào hệ thống.</li>
          <li>Hệ thống lưu trữ dữ liệu đám mây an toàn, chúng tôi cam kết tuyệt đối không chia sẻ thông tin tài chính của bạn cho bất kỳ bên thứ 3 nào.</li>
          <li>Phần mềm hoạt động như một công cụ sổ tay cá nhân hỗ trợ quản lý nội bộ. Việc kê khai thuế chính thức vẫn cần thực hiện trên cổng thông tin của Tổng Cục Thuế.</li>
        </ul>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Gửi phản ánh / Góp ý</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Nếu bạn gặp lỗi hoặc có ý tưởng muốn phần mềm cải tiến thêm, hãy nhắn cho chúng tôi nhé!
        </p>
        <form onSubmit={handleSendFeedback}>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Nhập nội dung góp ý của bạn..."
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              marginBottom: '1rem',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
            required
          />
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            disabled={isSent}
          >
            {isSent ? (
              <><CheckCircle size={18} style={{ marginRight: '8px' }} /> Đã gửi thành công!</>
            ) : (
              <><Send size={18} style={{ marginRight: '8px' }} /> Gửi phản ánh</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
