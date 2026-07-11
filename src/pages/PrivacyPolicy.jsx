import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="animate-fade-in" style={{ padding: '1.5rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
      <div className="flex items-center mb-6">
        <Link to="/" style={{ color: 'var(--text-main)', marginRight: '1rem' }}><ArrowLeft /></Link>
        <h2 style={{ fontSize: '1.25rem' }}>Chính sách bảo mật</h2>
      </div>

      <div className="card">
        <h3 className="mb-4">Chính Sách Bảo Mật (Privacy Policy)</h3>
        <p className="mb-4" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Cập nhật lần cuối: Tháng 7 năm 2026</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem', color: 'var(--text-main)' }}>
          <p>
            Ứng dụng <strong>Sổ tay Cá nhân, Hộ kinh doanh</strong> (gọi tắt là "Ứng dụng") cam kết bảo vệ quyền riêng tư và dữ liệu cá nhân của bạn. 
            Chính sách này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ thông tin của bạn khi sử dụng ứng dụng.
          </p>

          <h4 style={{ marginTop: '1rem', color: 'var(--primary)' }}>1. Thu thập thông tin</h4>
          <p>
            Để cung cấp tính năng quản lý thuế và hóa đơn, chúng tôi thu thập các thông tin sau khi bạn đăng ký và sử dụng:
          </p>
          <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
            <li><strong>Thông tin tài khoản:</strong> Địa chỉ Email, Họ và tên (Tên Hộ kinh doanh).</li>
            <li><strong>Thông tin định danh:</strong> Mã số thuế (MST), Địa chỉ, Ngành nghề kinh doanh.</li>
            <li><strong>Dữ liệu giao dịch:</strong> Thông tin số tiền, ngày tháng, nội dung giao dịch và hình ảnh hóa đơn mà bạn tải lên (nếu có).</li>
          </ul>

          <h4 style={{ marginTop: '1rem', color: 'var(--primary)' }}>2. Mục đích sử dụng thông tin</h4>
          <p>Dữ liệu của bạn được sử dụng vào các mục đích sau:</p>
          <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
            <li>Tạo, quản lý tài khoản và xác thực người dùng.</li>
            <li>Xuất các báo cáo thuế (Mẫu S1a-HKD) tự động với thông tin của chính bạn.</li>
            <li>Lưu trữ lịch sử giao dịch kinh doanh để bạn quản lý sổ sách.</li>
            <li>Phân tích ảnh hóa đơn bằng công nghệ AI (chỉ thực hiện theo yêu cầu của bạn, ảnh không được dùng để huấn luyện AI công cộng).</li>
          </ul>

          <h4 style={{ marginTop: '1rem', color: 'var(--primary)' }}>3. Chia sẻ thông tin</h4>
          <p>
            Chúng tôi <strong>KHÔNG</strong> bán, trao đổi hoặc cho thuê thông tin nhận dạng cá nhân của người dùng cho bên thứ ba. 
            Dữ liệu của bạn chỉ được lưu trữ trên hệ thống máy chủ bảo mật của chúng tôi và chỉ có bạn mới có quyền truy cập, trích xuất dữ liệu của mình.
          </p>

          <h4 style={{ marginTop: '1rem', color: 'var(--primary)' }}>4. Bảo mật dữ liệu</h4>
          <p>
            Mật khẩu của bạn được mã hóa an toàn (Hashing) trước khi lưu vào cơ sở dữ liệu. 
            Các luồng dữ liệu truyền tải giữa ứng dụng và máy chủ đều được mã hóa bằng giao thức HTTPS/SSL.
          </p>

          <h4 style={{ marginTop: '1rem', color: 'var(--primary)' }}>5. Quyền của người dùng</h4>
          <p>
            Bạn có quyền xem, chỉnh sửa thông tin cá nhân (trong mục Cài đặt). 
            Bạn cũng có quyền yêu cầu xóa toàn bộ dữ liệu giao dịch và tài khoản của mình khỏi hệ thống của chúng tôi bất cứ lúc nào.
          </p>

          <h4 style={{ marginTop: '1rem', color: 'var(--primary)' }}>6. Liên hệ</h4>
          <p>
            Nếu bạn có bất kỳ câu hỏi nào về Chính sách bảo mật này, vui lòng liên hệ với chúng tôi qua chức năng "Hỗ trợ Zalo" trong ứng dụng.
          </p>
        </div>
      </div>
    </div>
  );
}
