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
    // Giả lập tra cứu từ hệ thống Lạc Hồng (webhoadon.vn)
    setTimeout(() => {
      setResult({
        invoiceNo: '0008899',
        date: new Date().toLocaleDateString('vi-VN'),
        seller: 'CÔNG TY CP GIẢI PHÁP CÔNG NGHỆ LẠC HỒNG',
        amount: 5250000,
        status: 'Hợp lệ - Đã ký số'
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div className="flex items-center mb-6">
        <Link to="/" style={{ color: 'var(--text-main)', marginRight: '1rem' }}>
          <ArrowLeft size={24} />
        </Link>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Tra cứu Hóa đơn LHO</h2>
      </div>

      <div className="card mb-6">
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Nhập thông tin tra cứu từ hệ thống <strong>webhoadon.vn</strong> để kiểm tra dữ liệu gốc.
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
            <label>Mã tra cứu hóa đơn</label>
            <input
              type="text"
              value={lookupCode}
              onChange={e => setLookupCode(e.target.value)}
              placeholder="Nhập mã 12 ký tự..."
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Đang truy vấn...' : (
              <><Search size={20} style={{ marginRight: '8px' }} /> Tra cứu ngay</>
            )}
          </button>
        </form>
      </div>

      {result && (
        <div className="card animate-fade-in" style={{ border: '2px solid var(--secondary)', background: 'rgba(16, 185, 129, 0.1)' }}>
          <div className="flex items-center mb-4" style={{ color: 'var(--secondary)' }}>
            <ShieldCheck size={24} style={{ marginRight: '8px' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Hóa đơn hợp lệ</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.95rem' }}>
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-muted)' }}>Số hóa đơn:</span>
              <span style={{ fontWeight: '600' }}>{result.invoiceNo}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-muted)' }}>Người bán:</span>
              <span style={{ textAlign: 'right', maxWidth: '60%' }}>{result.seller}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-muted)' }}>Tổng thanh toán:</span>
              <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{result.amount.toLocaleString('vi-VN')} đ</span>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-secondary" style={{ flex: 1, fontSize: '0.85rem' }}>
              <Download size={16} style={{ marginRight: '6px' }} /> Tải PDF
            </button>
            <button className="btn btn-secondary" style={{ flex: 1, fontSize: '0.85rem' }}>
              <FileText size={16} style={{ marginRight: '6px' }} /> Bản XML
            </button>
          </div>
        </div>
      )}

      <div style={{ marginTop: 'auto', textAlign: 'center', padding: '2rem 0' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          Giải pháp Hóa đơn điện tử Lạc Hồng Online
        </p>
      </div>
    </div>
  );
}
