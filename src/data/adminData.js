// TODO(backend): System Administrator data — replace with platform-wide API calls.
export const INITIAL_ORGANIZATIONS = [
  { name: 'Acme Corporations', type: 'Company', memberCount: 4, applicationCount: 4, createdDate: 'Jan 12, 2026', status: 'Active' },
  { name: 'Northwind Health', type: 'Non-profit', memberCount: 6, applicationCount: 1, createdDate: 'Mar 3, 2026', status: 'Active' },
  { name: 'Globex Retail', type: 'Company', memberCount: 2, applicationCount: 1, createdDate: 'Jun 30, 2026', status: 'Suspended' }
];

export const INITIAL_USERS = [
  { name: 'Maria Santos', email: 'maria@acme.example', role: 'Owner', organization: 'Acme Corporations', joined: 'Jan 12, 2026', status: 'Active' },
  { name: 'Juan Dela Cruz', email: 'juan@acme.example', role: 'Security analyst', organization: 'Acme Corporations', joined: 'Feb 3, 2026', status: 'Active' },
  { name: 'Angela Reyes', email: 'angela@acme.example', role: 'Developer', organization: 'Acme Corporations', joined: 'Mar 21, 2026', status: 'Active' },
  { name: 'Paolo Garcia', email: 'paolo@acme.example', role: 'Auditor', organization: 'Acme Corporations', joined: 'Jun 9, 2026', status: 'Active' },
  { name: 'Dr. Elena Cruz', email: 'elena@northwindhealth.example', role: 'Owner', organization: 'Northwind Health', joined: 'Mar 3, 2026', status: 'Active' },
  { name: 'Marco Villanueva', email: 'marco@globexretail.example', role: 'Owner', organization: 'Globex Retail', joined: 'Jun 30, 2026', status: 'Suspended' }
];

export const INITIAL_AUDIT_LOG = [
  { id: 'LOG-1042', timestamp: 'Sep 20, 2026 · 9:14 AM', actor: 'Dr. Elena Cruz', action: 'Registered application', target: 'Patient Portal', details: 'Northwind Health' },
  { id: 'LOG-1041', timestamp: 'Sep 19, 2026 · 4:02 PM', actor: 'Paolo Garcia', action: 'Registered application', target: 'HR Suite', details: 'Acme Corporations' },
  { id: 'LOG-1038', timestamp: 'Sep 18, 2026 · 11:47 AM', actor: 'System', action: 'Completed assessment', target: 'AS-2033 · Payments API', details: 'Full Assessment · score 84/100' },
  { id: 'LOG-1035', timestamp: 'Sep 14, 2026 · 2:30 PM', actor: 'System', action: 'Completed assessment', target: 'AS-2031 · Customer Portal', details: 'Full Assessment · score 96/100' },
  { id: 'LOG-1029', timestamp: 'Sep 12, 2026 · 10:05 AM', actor: 'Angela Reyes', action: 'Marked finding resolved', target: 'F-098 · Payments API', details: 'Outdated OpenSSL library' },
  { id: 'LOG-1021', timestamp: 'Jun 30, 2026 · 3:18 PM', actor: 'System Administrator', action: 'Suspended organization', target: 'Globex Retail', details: 'Reason: billing dispute under review' },
  { id: 'LOG-1014', timestamp: 'Aug 2, 2026 · 9:00 AM', actor: 'Maria Santos', action: 'Registered application', target: 'Customer Portal', details: 'Acme Corporations' },
  { id: 'LOG-1002', timestamp: 'Jan 12, 2026 · 8:00 AM', actor: 'Maria Santos', action: 'Created organization', target: 'Acme Corporations', details: 'Organization code ACME-2026 generated' }
];

export const INITIAL_SYSTEM_HEALTH = {
  serviceStatus: 'Degraded',
  queueDepth: 2,
  avgScanDurationMinutes: 6,
  failureRate24h: 17,
  modules: [
    { name: 'Security Configuration', status: 'Healthy' },
    { name: 'Session Security', status: 'Healthy' },
    { name: 'Transport Security', status: 'Healthy' },
    { name: 'Access Control', status: 'Healthy' },
    { name: 'Data Exposure', status: 'Healthy' },
    { name: 'Injection', status: 'Degraded' }
  ]
};
