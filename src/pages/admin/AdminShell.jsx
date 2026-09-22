import { useEffect, useRef } from 'react';
import { Navigate, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../../components/Icon.jsx';
import Logo from '../../components/Logo.jsx';
import { ADMIN_PAGES, ADMIN_SIDE } from '../../data/icons.js';
import { useApp } from '../../context/AppContext.jsx';

export default function AdminShell() {
  const { user, isAdmin, signOut } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const contentRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    contentRef.current?.focus({ preventScroll: true });
  }, [location.pathname]);

  if (!user) return <Navigate to="/signin" replace />;
  if (!isAdmin) return <Navigate to="/app/overview" replace />;

  const page = location.pathname.split('/')[2];
  const activePage = ADMIN_PAGES[page] ? page : 'overview';
  const title = ADMIN_PAGES[activePage][0];

  return (
    <div className="shell">
      <aside className="side">
        <NavLink className="side__brand" to="/admin/overview" aria-label="SCS admin home">
          <Logo /><span>SCS</span>
        </NavLink>
        <nav aria-label="Primary">
          {ADMIN_SIDE.map(p => (
            <NavLink key={p} className="navlink" to={`/admin/${p}`}>
              <Icon name={ADMIN_PAGES[p][1]} />
              <span>{ADMIN_PAGES[p][0]}</span>
            </NavLink>
          ))}
        </nav>
        <div className="side__foot">
          <button type="button" className="navlink" style={{ justifyContent: 'center' }} onClick={() => { signOut(); navigate('/'); }}>
            <Icon name="logout" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      <div className="main">
        <button className="skip" onClick={() => contentRef.current?.focus()}>Skip to content</button>
        <header className="top">
          <h1 id="page-title" tabIndex={-1}>{title}</h1>
          <span className="admin-badge">System Administrator</span>
        </header>
        <label className="sr" htmlFor="admin-mobile-nav">Navigate admin dashboard</label>
        <select id="admin-mobile-nav" className="sel admin-mobile-nav" value={activePage} onChange={e => navigate(`/admin/${e.target.value}`)}>
          {ADMIN_SIDE.map(p => <option key={p} value={p}>{ADMIN_PAGES[p][0]}</option>)}
        </select>
        <div className="content" id="view" ref={contentRef} tabIndex={-1}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
