import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import TransactionForm from './pages/TransactionForm';
import Report from './pages/Report';
import Support from './pages/Support';
import AdminDashboard from './pages/admin/AdminDashboard';
import './index.css';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/auth" />;
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/add-transaction" element={<PrivateRoute><TransactionForm /></PrivateRoute>} />
            <Route path="/report" element={<PrivateRoute><Report /></PrivateRoute>} />
            <Route path="/support" element={<PrivateRoute><Support /></PrivateRoute>} />
            <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
          </Routes>
        </div>
        <footer style={{ textAlign: 'center', padding: '1.25rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          &copy; 2026 cholonghoa.com
        </footer>
      </div>
    </Router>
  );
}

export default App;
