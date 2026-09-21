// TODO(backend): replace this sample data with real API calls (apps, findings, members, orgs).
export const INITIAL_ORGS = ['Acme Corporations', 'Northwind Health'];

export const INITIAL_APPS = [
  { name: 'Customer Portal', type: 'Web app', status: 'Authorized', score: 96, assessed: 'Sep 14, 2026', framework: 'OWASP ASVS Level 2' },
  { name: 'Payments API', type: 'API', status: 'Authorized', score: 91, assessed: 'Sep 11, 2026', framework: 'PCI DSS 4.0' },
  { name: 'Mobile Banking', type: 'Mobile app', status: 'Authorized', score: 89, assessed: 'Sep 8, 2026', framework: 'OWASP MASVS' },
  { name: 'HR Suite', type: 'Web app', status: 'Pending', score: null, assessed: null, framework: '—' }
];

export const INITIAL_FINDINGS = [
  { id: 'F-101', title: 'TLS 1.0 is still enabled on a legacy endpoint', app: 'Payments API', sev: 'High', status: 'In progress', owner: 'Juan Dela Cruz', due: 'Sep 26, 2026' },
  { id: 'F-102', title: 'Session tokens are not rotated after sign-in', app: 'Customer Portal', sev: 'Medium', status: 'Open', owner: 'Angela Reyes', due: 'Oct 3, 2026' },
  { id: 'F-103', title: 'Error responses expose stack traces', app: 'Mobile Banking', sev: 'Medium', status: 'Open', owner: 'Angela Reyes', due: 'Oct 3, 2026' },
  { id: 'F-104', title: 'Content-Security-Policy header is missing', app: 'Customer Portal', sev: 'Low', status: 'Open', owner: 'Paolo Garcia', due: 'Oct 17, 2026' },
  { id: 'F-098', title: 'Outdated OpenSSL library', app: 'Payments API', sev: 'Critical', status: 'Resolved', owner: 'Juan Dela Cruz', due: 'Sep 12, 2026' }
];

export const INITIAL_MEMBERS = [
  { name: 'Maria Santos', email: 'maria@acme.example', role: 'Owner', joined: 'Jan 12, 2026' },
  { name: 'Juan Dela Cruz', email: 'juan@acme.example', role: 'Security analyst', joined: 'Feb 3, 2026' },
  { name: 'Angela Reyes', email: 'angela@acme.example', role: 'Developer', joined: 'Mar 21, 2026' },
  { name: 'Paolo Garcia', email: 'paolo@acme.example', role: 'Auditor', joined: 'Jun 9, 2026' }
];

export const INITIAL_PENDING = [
  { name: 'Rico Mendoza', email: 'rico@acme.example', requested: 'Sep 17, 2026' },
  { name: 'Liza Ramos', email: 'liza@acme.example', requested: 'Sep 18, 2026' }
];

// TODO(backend): GET /organizations/lookup?code=... (replaces ORG_CODES).
export const ORG_CODES = { 'ACME-2026': 'Acme Corporations', 'NWH-2026': 'Northwind Health' };
