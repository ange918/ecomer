import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import RequireAuth from './components/RequireAuth';
import RequireAdmin from './components/RequireAdmin';
import AppNav from './components/AppNav';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Inscription from './pages/Inscription';
import Admin from './pages/Admin';
import Home from './pages/Home';
import NewOrder from './pages/NewOrder';
import Tracking from './pages/Tracking';
import History from './pages/History';
import Profile from './pages/Profile';
import Support from './pages/Support';
import './styles.css';

// Layout des écrans authentifiés : barre de navigation + contenu.
function AppLayout() {
  return (
    <RequireAuth>
      <div className="app-shell">
        <AppNav />
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </RequireAuth>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route
          path="/akonde"
          element={
            <RequireAdmin>
              <Admin />
            </RequireAdmin>
          }
        />
        <Route element={<AppLayout />}>
          <Route path="/app" element={<Home />} />
          <Route path="/commander" element={<NewOrder />} />
          <Route path="/suivi/:id" element={<Tracking />} />
          <Route path="/historique" element={<History />} />
          <Route path="/profil" element={<Profile />} />
          <Route path="/support" element={<Support />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
