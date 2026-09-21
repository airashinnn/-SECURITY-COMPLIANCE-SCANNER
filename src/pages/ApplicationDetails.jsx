import { Link, useNavigate, useParams } from 'react-router-dom';
import { statusChip } from '../components/chips.jsx';
import { useApp } from '../context/AppContext.jsx';

export default function ApplicationDetails() {
  const { appId } = useParams();
  const navigate = useNavigate();
  const { apps, findings } = useApp();
  const app = apps.find(a => a.id === appId);

  if (!app) {
    return (
      <div className="card">
        <p className="empty">Application not found.</p>
        <Link className="btn btn--ghost" to="/app/applications">Back to Applications</Link>
      </div>
    );
  }

  const isAuthorized = app.status === 'Authorized';
  const openCount = findings.filter(f => f.appId === app.id && f.status !== 'Resolved').length;

  return (
    <>
      <button type="button" className="link back-link" onClick={() => navigate('/app/applications')}>← Back to Applications</button>
      <div className="card app-detail">
        <div className="app-detail__head">
          <div>
            <h2>{app.name}</h2>
            <p className="muted">{app.url}</p>
          </div>
          {statusChip(app.status)}
        </div>
        <dl className="detail-grid">
          <div><dt>Application type</dt><dd>{app.type}</dd></div>
          <div><dt>Standard</dt><dd>{app.framework}</dd></div>
          <div><dt>Registered by</dt><dd>{app.registeredBy}</dd></div>
          <div><dt>Registration date</dt><dd>{app.registeredDate}</dd></div>
          <div><dt>Last assessment</dt><dd>{app.assessed || '—'}</dd></div>
          <div><dt>Security score</dt><dd>{app.score != null ? `${app.score}/100` : '—'}</dd></div>
        </dl>

        {!isAuthorized && (
          <p className="empty" style={{ textAlign: 'left', padding: '16px 0' }}>
            {app.status === 'Pending' && 'Waiting for authorization from a system administrator before it can be scanned.'}
            {app.status === 'Rejected' && `This application's registration was rejected.${app.rejectionReason ? ` Reason: ${app.rejectionReason}` : ''}`}
            {app.status === 'Revoked' && 'This application’s authorization has been revoked. Contact your system administrator.'}
          </p>
        )}

        <div className="actions row" style={{ justifyContent: 'flex-start', flexWrap: 'wrap' }}>
          <Link className="btn" aria-disabled={!isAuthorized} to={isAuthorized ? `/app/applications/${app.id}/scan` : '#'} onClick={e => { if (!isAuthorized) e.preventDefault(); }}>
            Scan Application
          </Link>
          <Link className="btn btn--ghost" aria-disabled={!isAuthorized} to={isAuthorized ? `/app/applications/${app.id}/assessments` : '#'} onClick={e => { if (!isAuthorized) e.preventDefault(); }}>
            View Assessments
          </Link>
          <Link className="btn btn--ghost" aria-disabled={!isAuthorized} to={isAuthorized ? `/app/findings?app=${encodeURIComponent(app.name)}` : '#'} onClick={e => { if (!isAuthorized) e.preventDefault(); }}>
            View Findings{isAuthorized && openCount > 0 ? ` (${openCount})` : ''}
          </Link>
        </div>
      </div>
    </>
  );
}
