import { Routes, Route, Navigate } from 'react-router-dom';
import PartnerLogin from './pages/PartnerLogin.jsx';
import PartnerPortal from './pages/PartnerPortal.jsx';

/**
 * The partner dashboard on its own, at partner.smiraclub.com: hotels, villas
 * and other partners sign in and see only their own listings, bookings and
 * payouts. It is the same portal the admin panel served at /partner, lifted
 * out so partners never load the staff panel at all.
 *
 * /partner and /partner/login still work, for links already sent out.
 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PartnerPortal />} />
      <Route path="/login" element={<PartnerLogin />} />
      <Route path="/partner" element={<Navigate to="/" replace />} />
      <Route path="/partner/login" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
