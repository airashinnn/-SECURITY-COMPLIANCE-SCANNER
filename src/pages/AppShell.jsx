import { createContext, useContext, useEffect, useRef } from 'react';
import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import Logo from '../components/Logo.jsx';
import OrgSwitcher from '../components/OrgSwitcher.jsx';
import AddAppDialog from '../components/AddAppDialog.jsx';
import MoreSheet from '../components/MoreSheet.jsx';
import { MORE, PAGES, SIDE, TAB } from '../data/icons.js';
import { useApp } from '../context/AppContext.jsx';

const AddAppDialogContext = createContext(() => {});
export const useOpenAddAppDialog = () => useContext(AddAppDialogContext);

export default function AppShell() {
  const { user } = useApp();
  const location = useLocation();
  const dialogRef = useRef(null);
  const sheetRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    contentRef.current?.focus({ preventScroll: true });
  }, [location.pathname]);

  if (!user) return <Navigate to="/signin" replace />;

  const page = location.pathname.split('/')[2];
  const activePage = PAGES[page] ? page : 'overview';
  const title = PAGES[activePage][0];
  const isMoreActive = MORE.includes(activePage);
  const openAddApp = () => dialogRef.current?.open();

  return (
    <AddAppDialogContext.Provider value={openAddApp}>
      <div className="shell">
        <aside className="side">
          <NavLink className="side__brand" to="/app/overview" aria-label="SCS home">
            <Logo /><span>SCS</span>
          </NavLink>
          <nav aria-label="Primary">
            {SIDE.map(p => (
              <NavLink key={p} className="navlink" to={`/app/${p}`}>
                <Icon name={PAGES[p][1]} />
                <span>{PAGES[p][0]}</span>
              </NavLink>
            ))}
          </nav>
          <div className="side__foot">
            <NavLink className="navlink" to="/app/account" style={{ justifyContent: 'center' }}>
              <Icon name="account" />
              <span>Account</span>
            </NavLink>
          </div>
        </aside>

        <div className="main">
          <button className="skip" onClick={() => contentRef.current?.focus()}>Skip to content</button>
          <header className="top">
            <h1 id="page-title" tabIndex={-1}>{title}</h1>
            <OrgSwitcher />
          </header>
          <div className="content" id="view" ref={contentRef} tabIndex={-1}>
            <Outlet />
          </div>
        </div>

        <nav className="tabbar" aria-label="Primary">
          {TAB.map(([p, label]) => (
            <NavLink key={p} to={`/app/${p}`}>
              <Icon name={PAGES[p][1]} />
              <span>{label}</span>
            </NavLink>
          ))}
          <button type="button" aria-haspopup="dialog" aria-current={isMoreActive ? 'page' : undefined} onClick={() => sheetRef.current?.open()}>
            <Icon name="more" />
            <span>More</span>
          </button>
        </nav>

        <AddAppDialog ref={dialogRef} />
        <MoreSheet ref={sheetRef} />
      </div>
    </AddAppDialogContext.Provider>
  );
}
