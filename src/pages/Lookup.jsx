import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, FileText, ArrowLeft, Download, ShieldCheck } from 'lucide-react';

export default function Lookup() {
  const [lookupCode, setLookupCode] = useState('');
  const [taxCode, setTaxCode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLookup = (e) => {
    e.preventDefault();
    setLoading(true);
    // Giả lập gọi API từ hệ thống Lạc Hồng (lho.vn)
    setTimeout(() => {
      setResult({
        invoiceNo: '0004567',
        date: new Date().toLocaleDateString('vi-VN'),
        buyer: 'Khách hàng LHO',
        amount: 2500000,
        status: 'Đã xác thực pháp lý'
      });
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '1.5rem' }}>
      <div className="flex items-center mb-6">
        <Link to="/" style={{ color: 'var(--text-main)', marginRight: '1rem' }}><ArrowLeft /></Link>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Tra cứu hóa đơn LHO</h2>
      </div>

      <div className="card mb-6" style={{ background: '#fff', border: '1px solid #e0e0e0' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Nhập thông tin hóa đơn từ lho.vn để kiểm tra tính hợp lệ và tải về bản gốc.
        </p>
        <form onSubmit={handleLookup}>
          <div className="input-group">
            <label>Mã số thuế bên bán</label>
            <input
              type="text"
              value={taxCode}
              onChange={e => setTaxCode(e.target.value)}
              placeholder="MST doanh nghiệp..."
              required
            />
          </div>
          <div className="input-group">
            <label>Mã nhận hóa đơn</label>
            <input
              type="text"
              value={lookupCode}
              onChange={e => setLookupCode(e.target.value)}
              placeholder="Nhập mã 12 ký tự..."
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ background: '#0056b3' }}>
            {loading ? 'Đang xác thực...' : (
              <><Search size={20} style={{ marginRight: '8px' }} /> Kiểm tra hóa đơn</>
            )}
          </button>
        </form>
      </div>

      {result && (
        <div className="card animate-fade-in" style={{ border: '2px solid #28a745', background: '#f8fff9' }}>
          <div className="flex items-center mb-4" style={{ color: '#28a745' }}>
            <ShieldCheck size={24} style={{ marginRight: '8px' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Kết quả xác thực</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.95rem' }}>
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-muted)' }}>Số hóa đơn:</span>
              <span style={{ fontWeight: '600' }}>{result.invoiceNo}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-muted)' }}>Người mua:</span>
              <span>{result.buyer}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-muted)' }}>Tổng thanh toán:</span>
              <span style={{ fontWeight: 'bold', color: '#0056b3' }}>{result.amount.toLocaleString('vi-VN')} đ</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-muted)' }}>Trạng thái:</span>
              <span style={{ color: '#28a745', fontWeight: 'bold' }}>{result.status}</span>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-secondary" style={{ flex: 1, fontSize: '0.85rem', borderColor: '#0056b3', color: '#0056b3' }}>
              <Download size={16} style={{ marginRight: '6px' }} /> Bản PDF
            </button>
            <button className="btn btn-secondary" style={{ flex: 1, fontSize: '0.85rem', borderColor: '#0056b3', color: '#0056b3' }}>
              <FileText size={16} style={{ marginRight: '6px' }} /> Bản XML
            </button>
          </div>
        </div>
      )}

      <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
          Dịch vụ Hóa đơn điện tử Lạc Hồng Online (lho.vn)
        </p>
      </div>
    </div>
  );
}
