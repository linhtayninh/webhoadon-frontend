import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner';
import './index.css';

const Auth = lazy(() => import('./pages/Auth'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const TransactionForm = lazy(() => import('./pages/TransactionForm'));
const Report = lazy(() => import('./pages/Report'));
const Support = lazy(() => import('./pages/Support'));
const Lookup = lazy(() => import('./pages/Lookup'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const UpdateProfile = lazy(() => import('./pages/UpdateProfile'));
const Settings = lazy(() => import('./pages/Settings'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/auth" />;
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <div style={{ flex: 1 }}>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/update-profile" element={<UpdateProfile />} />
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/add-transaction" element={<PrivateRoute><TransactionForm /></PrivateRoute>} />
              <Route path="/report" element={<PrivateRoute><Report /></PrivateRoute>} />
              <Route path="/support" element={<PrivateRoute><Support /></PrivateRoute>} />
              <Route path="/lookup" element={<Lookup />} />
              <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
              <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            </Routes>
          </Suspense>
        </div>
        <footer style={{ textAlign: 'center', padding: '1.25rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          &copy; 2026 Lạc Hồng Online - webhoadon.vn
        </footer>
      </div>
    </Router>
  );
}

export default App;
