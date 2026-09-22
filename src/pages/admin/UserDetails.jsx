import { useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { chip } from '../../components/chips.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import IconBadge from '../../components/IconBadge.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export default function UserDetails() {
  const { email } = useParams();
  const navigate = useNavigate();
  const { users, suspendUserAccount, reactivateUserAccount } = useApp();
  const toast = useToast();
  const confirmRef = useRef(null);
  const user = users.find(u => u.email === decodeURIComponent(email));

  if (!user) return <p className="empty">User not found.</p>;

  const isActive = user.status === 'Active';

  function confirm() {
    if (isActive) {
      suspendUserAccount(user.email);
      toast(`${user.name}'s account was suspended`);
    } else {
      reactivateUserAccount(user.email);
      toast(`${user.name}'s account was reactivated`);
    }
  }

  return (
    <>
      <button type="button" className="link back-link" onClick={() => navigate('/admin/users')}>← Back to User Management</button>
      <div className="card app-detail">
        <div className="app-detail__head">
          <div className="app-detail__title">
            <IconBadge name="account" />
            <div>
              <h2>{user.name}</h2>
              <p className="muted">{user.email}</p>
            </div>
          </div>
          {chip(user.status, isActive ? 'ok' : 'danger')}
        </div>
        <dl className="detail-grid">
          <div><dt>Role</dt><dd>{user.role}</dd></div>
          <div><dt>Organization</dt><dd>{user.organization}</dd></div>
          <div><dt>Joined</dt><dd>{user.joined}</dd></div>
        </dl>
        <div className="actions row" style={{ justifyContent: 'flex-start' }}>
          <button type="button" className={`btn${isActive ? ' btn--danger' : ''}`} onClick={() => confirmRef.current?.open()}>
            {isActive ? 'Suspend Account' : 'Reactivate Account'}
          </button>
        </div>
      </div>

      <ConfirmDialog
        ref={confirmRef}
        title={isActive ? 'Suspend this account?' : 'Reactivate this account?'}
        message={isActive
          ? `${user.name} will immediately lose access to Security Compliance System until reactivated.`
          : `${user.name} will regain access to Security Compliance System immediately.`}
        confirmLabel={isActive ? 'Suspend Account' : 'Reactivate Account'}
        danger={isActive}
        onConfirm={confirm}
      />
    </>
  );
}
