import { Link, NavLink } from 'react-router-dom';

// En-tête + barre d'onglets basse (navigation mobile-first).
const TABS = [
  { to: '/', icon: 'bx-home-alt', label: 'Accueil', end: true },
  { to: '/commander', icon: 'bx-plus-circle', label: 'Commander' },
  { to: '/historique', icon: 'bx-time-five', label: 'Historique' },
  { to: '/profil', icon: 'bx-user', label: 'Profil' },
];

function AppNav() {
  return (
    <>
      <header className="app-header">
        <Link to="/" className="brand">
          <i className="bx bxs-flame"></i>
          <span>GazExpress</span>
        </Link>
        <Link to="/support" className="header-support" aria-label="Support">
          <i className="bx bx-support"></i>
        </Link>
      </header>

      <nav className="tab-bar">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}
          >
            <i className={`bx ${tab.icon}`}></i>
            <span>{tab.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}

export default AppNav;
