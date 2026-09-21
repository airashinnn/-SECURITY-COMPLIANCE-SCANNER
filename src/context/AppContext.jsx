import { createContext, useContext, useMemo, useState } from 'react';
import { INITIAL_APPS, INITIAL_FINDINGS, INITIAL_MEMBERS, INITIAL_ORGS, INITIAL_PENDING } from '../data/sampleData.js';

const AppContext = createContext(null);

const store = {
  get() {
    try { return JSON.parse(sessionStorage.getItem('scs.user') || 'null'); } catch { return null; }
  },
  set(v) {
    try { v ? sessionStorage.setItem('scs.user', JSON.stringify(v)) : sessionStorage.removeItem('scs.user'); } catch { /* storage unavailable */ }
  }
};

export function AppProvider({ children }) {
  const [user, setUserState] = useState(() => store.get());
  const [orgs, setOrgs] = useState(INITIAL_ORGS);
  const [org, setOrg] = useState(INITIAL_ORGS[0]);
  const [apps, setApps] = useState(INITIAL_APPS);
  const [findings, setFindings] = useState(INITIAL_FINDINGS);
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [pending, setPending] = useState(INITIAL_PENDING);

  const setUser = user => {
    setUserState(user);
    store.set(user);
  };

  const signOut = () => setUser(null);

  const addApp = app => {
    // TODO(backend): POST /applications.
    setApps(prev => [...prev, { status: 'Pending', score: null, assessed: null, framework: '—', ...app }]);
  };

  const updateFindingStatus = (id, status) => {
    // TODO(backend): PATCH /findings/:id { status }
    setFindings(prev => prev.map(f => (f.id === id ? { ...f, status } : f)));
  };

  const approveMember = index => {
    // TODO(backend): POST /members/pending/:id/approve.
    const m = pending[index];
    if (!m) return null;
    setPending(prev => prev.filter((_, i) => i !== index));
    setMembers(prev => [...prev, { name: m.name, email: m.email, role: 'Member', joined: 'Sep 19, 2026' }]);
    return m;
  };

  const declineMember = index => {
    // TODO(backend): POST /members/pending/:id/decline.
    const m = pending[index];
    if (!m) return null;
    setPending(prev => prev.filter((_, i) => i !== index));
    return m;
  };

  const createOrganization = name => {
    setOrgs(prev => [name, ...prev]);
    setOrg(name);
  };

  const value = useMemo(() => ({
    user, setUser, signOut,
    orgs, org, setOrg, createOrganization,
    apps, addApp,
    findings, updateFindingStatus,
    members, pending, approveMember, declineMember
  }), [user, orgs, org, apps, findings, members, pending]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
