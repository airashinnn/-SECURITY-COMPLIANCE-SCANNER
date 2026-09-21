import { useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export default function AuthorizationReview() {
  const { appId } = useParams();
  const navigate = useNavigate();
  const { apps, approveApplication, rejectApplication } = useApp();
  const toast = useToast();
  const approveRef = useRef(null);
  const rejectRef = useRef(null);
  const app = apps.find(a => a.id === appId);

  if (!app) return <p className="empty">Application not found.</p>;

  function confirmApprove() {
    approveApplication(app.id);
    toast(`${app.name} was authorized`);
    navigate('/admin/applications');
  }

  function confirmReject(_, reason) {
    rejectApplication(app.id, reason);
    toast(`${app.name}'s registration was rejected`);
    navigate('/admin/applications');
  }

  return (
    <>
      <button type="button" className="link back-link" onClick={() => navigate('/admin/applications')}>← Back to Authorization Queue</button>
      <div className="card app-detail">
        <h2>Authorization Review</h2>
        <dl className="detail-grid">
          <div><dt>Application</dt><dd>{app.name}</dd></div>
          <div className="target-url-row"><dt>Target URL</dt><dd className="target-url">{app.url}</dd></div>
          <div><dt>Application type</dt><dd>{app.type}</dd></div>
          <div><dt>Organization</dt><dd>{app.org}</dd></div>
          <div><dt>Registered by</dt><dd>{app.registeredBy}</dd></div>
          <div><dt>Date requested</dt><dd>{app.registeredDate}</dd></div>
        </dl>
        <div className="actions row" style={{ justifyContent: 'flex-start' }}>
          <button type="button" className="btn btn--danger" onClick={() => rejectRef.current?.open()}>Reject</button>
          <button type="button" className="btn" onClick={() => approveRef.current?.open()}>Approve</button>
        </div>
      </div>

      <ConfirmDialog
        ref={approveRef}
        title="Approve this application?"
        message={`${app.name} will be authorized and available for scanning immediately.`}
        confirmLabel="Approve"
        onConfirm={confirmApprove}
      />
      <ConfirmDialog
        ref={rejectRef}
        title="Reject this application?"
        message={`Explain why ${app.name}'s registration is being rejected. This is shared with the organization.`}
        confirmLabel="Reject"
        danger
        requireReason
        reasonLabel="Reason for rejection"
        onConfirm={confirmReject}
      />
    </>
  );
}
