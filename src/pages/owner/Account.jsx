import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/Icon.jsx';
import { chip } from '../../components/chips.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export default function Account() {
  const { user, org, orgCodes, signOut } = useApp();
  const navigate = useNavigate();
  const toast = useToast();
  const [copied, setCopied] = useState(false);
  const u = user || { name: 'User', email: '', role: 'Owner' };
  const initials = u.name.split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const orgCode = Object.entries(orgCodes).find(([, name]) => name === org)?.[0];

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(orgCode);
      setCopied(true);
      toast('Organization code copied');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast('Couldn’t copy — copy it manually instead.');
    }
  }

  return (
    <section className="card acct">
      <div className="head-row">
        <div className="avatar" aria-hidden="true">{initials}</div>
        <div>
          <h2>{u.name}</h2>
          {chip(u.role, 'info')}
        </div>
      </div>
      <dl>
        <div><dt>Email</dt><dd>{u.email}</dd></div>
        <div><dt>Organization</dt><dd>{org}</dd></div>
      </dl>
      {u.role === 'Owner' && orgCode && (
        <div className="acct__orgcode">
          <p className="hint" style={{ marginTop: 0 }}>Share this code so developers and security testers can request to join {org}.</p>
          <div className="acct__orgcode-row">
            <span className="org-code org-code--inline">{orgCode}</span>
            <button type="button" className="btn btn--sm btn--ghost" onClick={copyCode}>
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      )}
      <button className="btn btn--block" onClick={() => { signOut(); navigate('/'); }}>
        <Icon name="logout" size={20} /> Sign out
      </button>
    </section>
  );
}
