import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import api from '../services/api';

export default function Report() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [isDownloading, setIsDownloading] = useState(false);

  const fetchReport = async () => {
    const response = await api.get(`/report/export-s1a?month=${month}&year=${year}`, {
      responseType: 'blob'
    });
    return response.data;
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const blob = await fetchReport();
      const filename = `S1a_BaoCao_${month}_${year}.xlsx`;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Lỗi tải file: ' + error.message);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    setIsDownloading(true);
    try {
      const blob = await fetchReport();
      const filename = `S1a_BaoCao_${month}_${year}.xlsx`;
      const file = new File([blob], filename, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      const downloadFallback = () => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      };

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: `Báo cáo thuế tháng ${month}/${year}`,
            text: `Gửi bạn Báo cáo thuế (Mẫu S1a-HKD) tháng ${month} năm ${year}.`
          });
        } catch (shareError) {
          // Ignore AbortError (user cancelled share). For other errors (like Permission denied), fallback to download
          if (shareError.name !== 'AbortError') {
            downloadFallback();
          }
        }
      } else {
        // If sharing files is not supported (e.g. desktop Chrome), fallback to download
        downloadFallback();
      }
    } catch (error) {
      alert('Lỗi: ' + error.message);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '1.5rem' }}>
      <div className="flex items-center mb-4">
        <Link to="/" style={{ color: 'var(--text-main)', marginRight: '1rem' }}><ArrowLeft /></Link>
        <h2 style={{ fontSize: '1.25rem' }}>Báo Cáo Thuế</h2>
      </div>

      <div className="card text-center">
        <h3 className="mb-4">Xuất Mẫu S1a-HKD</h3>
        
        <div className="flex justify-between" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
            <label>Tháng</label>
            <input type="number" min="1" max="12" value={month} onChange={e => setMonth(e.target.value)} />
          </div>
          <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
            <label>Năm</label>
            <input type="number" min="2020" max="2100" value={year} onChange={e => setYear(e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button 
            onClick={handleShare} 
            className="btn btn-primary" 
            disabled={isDownloading}
          >
            <Share2 size={20} style={{ marginRight: '8px' }} />
            {isDownloading ? 'Đang xử lý...' : 'Chia sẻ (Zalo, Mail...)'}
          </button>

          <button 
            onClick={handleDownload} 
            className="btn btn-secondary" 
            disabled={isDownloading}
          >
            <Download size={20} style={{ marginRight: '8px' }} />
            Tải File Excel về máy
          </button>
        </div>
      </div>
    </div>
  );
}
