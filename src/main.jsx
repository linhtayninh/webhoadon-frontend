import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { GoogleOAuthProvider } from '@react-oauth/google';

// Lấy từ file .env hoặc để tạm chuỗi rỗng nếu chưa có
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'BẠN-CẦN-ĐIỀN-CLIENT-ID-VÀO-ĐÂY';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
