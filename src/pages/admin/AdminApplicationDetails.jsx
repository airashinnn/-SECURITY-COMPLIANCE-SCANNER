import { useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { statusChip } from '../../components/chips.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import IconBadge from '../../components/IconBadge.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export default function AdminApplicationDetails() {
  const { appId } = useParams();
  const navigate = useNavigate();
  const { apps, revokeAuthorization } = useApp();
  const toast = useToast();
  const revokeRef = useRef(null);
  const app = apps.find(a => a.id === appId);

  if (!app) return <p className="empty">Application not found.</p>;

  function confirmRevoke() {
    revokeAuthorization(app.id);
    toast(`${app.name}'s authorization was revoked`);
  }

  return (
    <>
      <button type="button" className="link back-link" onClick={() => navigate('/admin/applications')}>← Back to Application Management</button>
      <div className="card app-detail">
        <div className="app-detail__head">
          <div className="app-detail__title">
            <IconBadge name="apps" />
            <div>
              <h2>{app.name}</h2>
              <p className="muted">{app.url}</p>
            </div>
          </div>
          {statusChip(app.status)}
        </div>
        <dl className="detail-grid">
          <div><dt>Application type</dt><dd>{app.type}</dd></div>
          <div><dt>Organization</dt><dd>{app.org}</dd></div>
          <div><dt>Registered by</dt><dd>{app.registeredBy}</dd></div>
          <div><dt>Registration date</dt><dd>{app.registeredDate}</dd></div>
          <div><dt>Last assessment</dt><dd>{app.assessed || '—'}</dd></div>
          <div><dt>Security score</dt><dd>{app.score != null ? `${app.score}/100` : '—'}</dd></div>
        </dl>
        {app.status === 'Authorized' && (
          <div className="actions row" style={{ justifyContent: 'flex-start' }}>
            <button type="button" className="btn btn--danger" onClick={() => revokeRef.current?.open()}>Remove authorization</button>
          </div>
        )}
      </div>

      <ConfirmDialog
        ref={revokeRef}
        title="Remove this application's authorization?"
        message={`${app.name} will no longer be available for scanning until re-authorized.`}
        confirmLabel="Remove authorization"
        danger
        onConfirm={confirmRevoke}
      />
    </>
  );
}
