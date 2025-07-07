// Fichier complet : src/App.jsx

import { Routes, Route } from 'react-router-dom';

// Layouts
import SignupLayout from './layouts/SignupLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Browse from './pages/Browse';
import Watch from './pages/Watch'; 
import PaymentStatus from './pages/PaymentStatus';
import ProtectedRoute from './components/ProtectedRoute';
import SeriesPage from './pages/SeriesPage';
import MoviesPage from './pages/MoviesPage';

// Composants des étapes d'inscription
import SignupStep1 from './pages/Signup/SignupStep1';
import SignupStep2 from './pages/Signup/SignupStep2';
import SignupStep3 from './pages/Signup/SignupStep3';

function App() {
  return (
    <Routes>
      {/* Routes publiques simples */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Routes d'inscription */}
      <Route element={<SignupLayout />}>
        <Route path="/signup" element={<SignupStep1 />} />
        <Route path="/signup/planform" element={<ProtectedRoute><SignupStep2 /></ProtectedRoute>} />
        <Route path="/signup/payment" element={<ProtectedRoute><SignupStep3 /></ProtectedRoute>} />
      </Route>
      
      <Route path="/payment-status" element={<ProtectedRoute><PaymentStatus /></ProtectedRoute>} />
      <Route path="/series" element={<ProtectedRoute><SeriesPage /></ProtectedRoute>} />
      <Route path="/movies" element={<ProtectedRoute><MoviesPage /></ProtectedRoute>} />

      {/* Routes protégées après connexion */}
      <Route path="/browse" element={<ProtectedRoute><Browse /></ProtectedRoute>} />

      {/* NOUVELLE ROUTE POUR LE LECTEUR VIDÉO */}
      <Route path="/watch/:contentId" element={<ProtectedRoute><Watch /></ProtectedRoute>} />

    </Routes>
  );
}

export default App;