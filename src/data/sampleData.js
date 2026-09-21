// TODO(backend): replace this sample data with real API calls (apps, assessments, findings, members, orgs).
export const INITIAL_ORGS = ['Acme Corporations', 'Northwind Health'];

export const INITIAL_APPS = [
  {
    id: 'app-1', name: 'Customer Portal', url: 'https://portal.acme.example', type: 'Web app', org: 'Acme Corporations',
    status: 'Authorized', score: 96, assessed: 'Sep 14, 2026', framework: 'OWASP ASVS Level 2',
    registeredBy: 'Maria Santos', registeredDate: 'Aug 2, 2026'
  },
  {
    id: 'app-2', name: 'Payments API', url: 'https://api.acme.example/payments', type: 'API', org: 'Acme Corporations',
    status: 'Authorized', score: 84, assessed: 'Sep 18, 2026', framework: 'PCI DSS 4.0',
    registeredBy: 'Juan Dela Cruz', registeredDate: 'Aug 10, 2026'
  },
  {
    id: 'app-3', name: 'Mobile Banking', url: 'https://m.acme.example', type: 'Mobile app', org: 'Acme Corporations',
    status: 'Authorized', score: 89, assessed: 'Sep 8, 2026', framework: 'OWASP MASVS',
    registeredBy: 'Angela Reyes', registeredDate: 'Jul 28, 2026'
  },
  {
    id: 'app-4', name: 'HR Suite', url: 'https://hr.acme.example', type: 'Web app', org: 'Acme Corporations',
    status: 'Pending', score: null, assessed: null, framework: '—',
    registeredBy: 'Paolo Garcia', registeredDate: 'Sep 19, 2026'
  },
  {
    id: 'app-5', name: 'Patient Portal', url: 'https://portal.northwindhealth.example', type: 'Web app', org: 'Northwind Health',
    status: 'Pending', score: null, assessed: null, framework: '—',
    registeredBy: 'Dr. Elena Cruz', registeredDate: 'Sep 20, 2026'
  }
];

export const INITIAL_ASSESSMENTS = [
  { id: 'AS-2018', appId: 'app-1', profile: 'Standard Scan', date: 'Aug 20, 2026', status: 'Completed', checksExecuted: 16, score: 90 },
  { id: 'AS-2031', appId: 'app-1', profile: 'Full Assessment', date: 'Sep 14, 2026', status: 'Completed', checksExecuted: 20, score: 96 },
  { id: 'AS-2011', appId: 'app-2', profile: 'Quick Scan', date: 'Aug 15, 2026', status: 'Failed', checksExecuted: 4, score: null },
  { id: 'AS-2029', appId: 'app-2', profile: 'Standard Scan', date: 'Sep 11, 2026', status: 'Completed', checksExecuted: 16, score: 91 },
  { id: 'AS-2033', appId: 'app-2', profile: 'Full Assessment', date: 'Sep 18, 2026', status: 'Completed', checksExecuted: 20, score: 84 },
  { id: 'AS-2027', appId: 'app-3', profile: 'Full Assessment', date: 'Sep 8, 2026', status: 'Completed', checksExecuted: 20, score: 89 }
];

export const INITIAL_FINDINGS = [
  {
    id: 'F-101', assessmentId: 'AS-2033', appId: 'app-2', app: 'Payments API', category: 'Transport Security',
    title: 'TLS 1.0 is still enabled on a legacy endpoint', sev: 'High', status: 'In progress', owner: 'Juan Dela Cruz', due: 'Sep 26, 2026',
    description: 'The legacy /v1/webhooks endpoint negotiates TLS 1.0 and TLS 1.1, both of which are deprecated and vulnerable to known downgrade and padding-oracle attacks.',
    evidence: 'openssl s_client -connect api.acme.example:443 -tls1 succeeded and completed a full handshake.',
    remediation: [
      'Disable TLS 1.0 and TLS 1.1 in the load balancer / web server TLS configuration.',
      'Restrict supported cipher suites to TLS 1.2+ with forward secrecy.',
      'Re-run the Transport Security checks to confirm only TLS 1.2/1.3 are negotiable.'
    ]
  },
  {
    id: 'F-102', assessmentId: 'AS-2031', appId: 'app-1', app: 'Customer Portal', category: 'Session Security',
    title: 'Session tokens are not rotated after sign-in', sev: 'Medium', status: 'Open', owner: 'Angela Reyes', due: 'Oct 3, 2026',
    description: 'The session identifier issued before authentication is reused after a successful login, allowing session fixation if an attacker can set the pre-auth cookie.',
    evidence: 'The Set-Cookie value for sid before and after POST /login is identical across three separate test accounts.',
    remediation: [
      'Issue a new session identifier immediately after successful authentication.',
      'Invalidate the pre-authentication session server-side once it has been superseded.',
      'Add a regression test asserting the session ID changes across the login boundary.'
    ]
  },
  {
    id: 'F-103', assessmentId: 'AS-2027', appId: 'app-3', app: 'Mobile Banking', category: 'Data Exposure',
    title: 'Error responses expose stack traces', sev: 'Medium', status: 'Open', owner: 'Angela Reyes', due: 'Oct 3, 2026',
    description: 'Unhandled exceptions on the /api/transfer endpoint return a full stack trace, including internal file paths and the framework version in use.',
    evidence: 'POST /api/transfer with a malformed body returns HTTP 500 with a body containing "at com.acme.banking.TransferService.process".',
    remediation: [
      'Return a generic error body for 5xx responses in production.',
      'Log the full stack trace server-side only, keyed by a correlation ID returned to the client.',
      'Add a contract test that fails the build if a stack trace leaks into an API response.'
    ]
  },
  {
    id: 'F-104', assessmentId: 'AS-2031', appId: 'app-1', app: 'Customer Portal', category: 'Security Configuration',
    title: 'Content-Security-Policy header is missing', sev: 'Low', status: 'Open', owner: 'Paolo Garcia', due: 'Oct 17, 2026',
    description: 'No Content-Security-Policy header is present on any tested page, leaving the application without a defense-in-depth control against injected scripts.',
    evidence: 'Response headers for GET / do not include a content-security-policy entry.',
    remediation: [
      'Define a baseline CSP (script-src, style-src, img-src, connect-src) covering current asset origins.',
      'Deploy the policy in Content-Security-Policy-Report-Only first and review violation reports.',
      'Promote to an enforced Content-Security-Policy header once reports are clean.'
    ]
  },
  {
    id: 'F-098', assessmentId: 'AS-2011', appId: 'app-2', app: 'Payments API', category: 'Transport Security',
    title: 'Outdated OpenSSL library', sev: 'Critical', status: 'Resolved', owner: 'Juan Dela Cruz', due: 'Sep 12, 2026',
    description: 'The API gateway shipped with an OpenSSL build affected by a known remote code execution advisory.',
    evidence: 'Banner grab reported OpenSSL/1.1.1k, matched against the vendor advisory list.',
    remediation: [
      'Upgrade the base image to a patched OpenSSL release.',
      'Rebuild and redeploy all services sharing the affected base image.',
      'Re-scan to confirm the version banner no longer matches a known-vulnerable build.'
    ]
  },
  {
    id: 'F-105', assessmentId: 'AS-2033', appId: 'app-2', app: 'Payments API', category: 'Injection',
    title: 'Error-based SQL injection in transaction search', sev: 'Critical', status: 'Open', owner: 'Juan Dela Cruz', due: 'Sep 25, 2026',
    description: 'The `reference` parameter on /v1/transactions/search is concatenated directly into a SQL query. A malformed value returns a database error containing table and column names.',
    evidence: "GET /v1/transactions/search?reference=' returns HTTP 500 with a Postgres syntax error disclosing the transactions table schema.",
    remediation: [
      'Replace the dynamic query with a parameterized statement or an ORM query builder.',
      'Return a generic 400 response for malformed search input instead of the raw database error.',
      'Add a regression test with SQL metacharacters in the `reference` parameter to the API test suite.'
    ]
  }
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
