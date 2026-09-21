import { createContext, useContext, useMemo, useState } from 'react';
import {
  INITIAL_APPS, INITIAL_ASSESSMENTS, INITIAL_FINDINGS, INITIAL_MEMBERS,
  INITIAL_ORGS, INITIAL_PENDING, ORG_CODES
} from '../data/sampleData.js';
import { INITIAL_AUDIT_LOG, INITIAL_ORGANIZATIONS, INITIAL_SYSTEM_HEALTH, INITIAL_USERS } from '../data/adminData.js';
import { SCAN_PROFILES } from '../data/scanProfiles.js';

const AppContext = createContext(null);
const TODAY = 'Sep 21, 2026';

const store = {
  get() {
    try { return JSON.parse(sessionStorage.getItem('scs.user') || 'null'); } catch { return null; }
  },
  set(v) {
    try { v ? sessionStorage.setItem('scs.user', JSON.stringify(v)) : sessionStorage.removeItem('scs.user'); } catch { /* storage unavailable */ }
  }
};

const idCounters = {};
const nextId = prefix => `${prefix}-${(idCounters[prefix] = (idCounters[prefix] || 5000) + 1)}`;

export function AppProvider({ children }) {
  const [user, setUserState] = useState(() => store.get());
  const [orgs, setOrgs] = useState(INITIAL_ORGS);
  const [org, setOrg] = useState(INITIAL_ORGS[0]);
  const [apps, setApps] = useState(INITIAL_APPS);
  const [assessments, setAssessments] = useState(INITIAL_ASSESSMENTS);
  const [findings, setFindings] = useState(INITIAL_FINDINGS);
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [pending, setPending] = useState(INITIAL_PENDING);

  const [organizations, setOrganizations] = useState(INITIAL_ORGANIZATIONS);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [auditLog, setAuditLog] = useState(INITIAL_AUDIT_LOG);
  const [systemHealth] = useState(INITIAL_SYSTEM_HEALTH);

  const setUser = nextUser => {
    setUserState(nextUser);
    store.set(nextUser);
  };
  const signOut = () => setUser(null);
  const isAdmin = user?.role === 'Admin';

  const logAudit = (action, target, details) => {
    setAuditLog(prev => [{ id: nextId('LOG'), timestamp: 'Just now', actor: user?.name || 'System', action, target, details }, ...prev]);
  };

  // --- Applications -------------------------------------------------
  const addApp = app => {
    // TODO(backend): POST /applications.
    const created = {
      id: nextId('app'), org, status: 'Pending', score: null, assessed: null, framework: '—',
      url: app.url || '', registeredBy: user?.name || 'Unknown', registeredDate: TODAY,
      ...app
    };
    setApps(prev => [...prev, created]);
    logAudit('Registered application', created.name, org);
    return created;
  };

  const approveApplication = id => {
    // TODO(backend): POST /admin/applications/:id/approve.
    const app = apps.find(a => a.id === id);
    setApps(prev => prev.map(a => (a.id === id ? { ...a, status: 'Authorized' } : a)));
    if (app) logAudit('Approved application', app.name, app.org);
  };

  const rejectApplication = (id, reason) => {
    // TODO(backend): POST /admin/applications/:id/reject { reason }.
    const app = apps.find(a => a.id === id);
    setApps(prev => prev.map(a => (a.id === id ? { ...a, status: 'Rejected', rejectionReason: reason } : a)));
    if (app) logAudit('Rejected application', app.name, reason);
  };

  const revokeAuthorization = id => {
    // TODO(backend): POST /admin/applications/:id/revoke.
    const app = apps.find(a => a.id === id);
    setApps(prev => prev.map(a => (a.id === id ? { ...a, status: 'Revoked' } : a)));
    if (app) logAudit('Revoked authorization', app.name, app.org);
  };

  // --- Assessments / scanning ---------------------------------------
  const startScan = (appId, profileId, customCheckIds) => {
    // TODO(backend): POST /applications/:id/assessments { profile, checks }.
    const app = apps.find(a => a.id === appId);
    const profile = SCAN_PROFILES.find(p => p.id === profileId);
    const checkCount = profileId === 'custom' ? (customCheckIds?.length || 0) : profile.checks.length;
    const assessment = {
      id: nextId('AS'), appId, profile: profile.name, date: TODAY, status: 'Running',
      checksExecuted: checkCount, score: null
    };
    setAssessments(prev => [assessment, ...prev]);
    logAudit('Started assessment', app?.name || appId, profile.name);
    return assessment;
  };

  const completeScan = assessmentId => {
    const running = assessments.find(a => a.id === assessmentId && a.status === 'Running');
    if (!running) return;
    const score = 92;
    setAssessments(prev => prev.map(a => (a.id === assessmentId ? { ...a, status: 'Completed', score } : a)));
    setApps(prev => prev.map(app => (app.id === running.appId ? { ...app, score, assessed: running.date } : app)));
    logAudit('Completed assessment', assessmentId, `${running.profile} · score ${score}/100`);
  };

  const cancelScan = assessmentId => {
    // TODO(backend): POST /assessments/:id/cancel.
    setAssessments(prev => prev.map(a => (a.id === assessmentId ? { ...a, status: 'Cancelled' } : a)));
    logAudit('Cancelled assessment', assessmentId, '');
  };

  // --- Findings -------------------------------------------------------
  const updateFindingStatus = (id, status) => {
    // TODO(backend): PATCH /findings/:id { status }
    setFindings(prev => prev.map(f => (f.id === id ? { ...f, status } : f)));
  };

  // --- Org members ------------------------------------------------------
  const approveMember = index => {
    // TODO(backend): POST /members/pending/:id/approve.
    const m = pending[index];
    if (!m) return null;
    setPending(prev => prev.filter((_, i) => i !== index));
    setMembers(prev => [...prev, { name: m.name, email: m.email, role: 'Member', joined: TODAY }]);
    return m;
  };

  const declineMember = index => {
    // TODO(backend): POST /members/pending/:id/decline.
    const m = pending[index];
    if (!m) return null;
    setPending(prev => prev.filter((_, i) => i !== index));
    return m;
  };

  const removeMember = index => {
    // TODO(backend): DELETE /members/:id.
    const m = members[index];
    if (!m) return null;
    setMembers(prev => prev.filter((_, i) => i !== index));
    return m;
  };

  const createOrganization = name => {
    setOrgs(prev => [name, ...prev]);
    setOrg(name);
  };

  // --- Admin: organizations -------------------------------------------
  const suspendOrganization = name => {
    // TODO(backend): POST /admin/organizations/:id/suspend.
    setOrganizations(prev => prev.map(o => (o.name === name ? { ...o, status: 'Suspended' } : o)));
    logAudit('Suspended organization', name, '');
  };
  const reactivateOrganization = name => {
    // TODO(backend): POST /admin/organizations/:id/reactivate.
    setOrganizations(prev => prev.map(o => (o.name === name ? { ...o, status: 'Active' } : o)));
    logAudit('Reactivated organization', name, '');
  };

  // --- Admin: users -----------------------------------------------------
  const suspendUserAccount = email => {
    // TODO(backend): POST /admin/users/:id/suspend.
    setUsers(prev => prev.map(u => (u.email === email ? { ...u, status: 'Suspended' } : u)));
    logAudit('Suspended user', email, '');
  };
  const reactivateUserAccount = email => {
    // TODO(backend): POST /admin/users/:id/reactivate.
    setUsers(prev => prev.map(u => (u.email === email ? { ...u, status: 'Active' } : u)));
    logAudit('Reactivated user', email, '');
  };

  const value = useMemo(() => ({
    user, setUser, signOut, isAdmin,
    orgs, org, setOrg, createOrganization,
    apps, addApp, approveApplication, rejectApplication, revokeAuthorization,
    assessments, startScan, completeScan, cancelScan,
    findings, updateFindingStatus,
    members, pending, approveMember, declineMember, removeMember,
    organizations, users, auditLog, systemHealth,
    suspendOrganization, reactivateOrganization, suspendUserAccount, reactivateUserAccount, logAudit,
    ORG_CODES
  }), [
    user, isAdmin, orgs, org, apps, assessments, findings, members, pending,
    organizations, users, auditLog, systemHealth
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
