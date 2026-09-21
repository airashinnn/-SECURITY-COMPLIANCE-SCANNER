import { useState } from 'react';
import Icon from '../components/Icon.jsx';
import { useApp } from '../context/AppContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function Members() {
  const { members, pending, approveMember, declineMember } = useApp();
  const toast = useToast();
  const [tab, setTab] = useState('current');
  const cur = tab === 'current';

  function approve(i) {
    const m = approveMember(i);
    if (m) toast(`${m.name} joined the organization`);
  }
  function decline(i) {
    const m = declineMember(i);
    if (m) toast(`Request from ${m.name} declined`);
  }

  return (
    <>
      <div className="tabs" role="tablist" aria-label="Members">
        <button className="tab-btn" role="tab" id="t-cur" aria-selected={cur} aria-controls="mpanel" onClick={() => setTab('current')}>
          <Icon name="members" size={22} />Current Members
        </button>
        <button className="tab-btn" role="tab" id="t-pen" aria-selected={!cur} aria-controls="mpanel" onClick={() => setTab('pending')}>
          <Icon name="userplus" size={22} />Pending Members
        </button>
      </div>
      <div className="stats stats--two">
        <div className="card stat"><h2>Current members</h2><p>{members.length}</p></div>
        <div className="card stat"><h2>Pending requests</h2><p>{pending.length}</p></div>
      </div>
      <div className="card tblcard" id="mpanel" role="tabpanel" aria-labelledby={cur ? 't-cur' : 't-pen'}>
        {cur ? (
          members.length ? (
            <div className="tblwrap">
              <table className="tbl">
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
                <tbody>
                  {members.map(m => (
                    <tr key={m.email}>
                      <td className="lead" data-label="Name">{m.name}</td>
                      <td data-label="Email">{m.email}</td>
                      <td data-label="Role">{m.role}</td>
                      <td data-label="Joined">{m.joined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p className="empty">No members yet.</p>
        ) : (
          pending.length ? (
            <div className="tblwrap">
              <table className="tbl">
                <thead><tr><th>Name</th><th>Email</th><th>Requested</th><th>Actions</th></tr></thead>
                <tbody>
                  {pending.map((m, i) => (
                    <tr key={m.email}>
                      <td className="lead" data-label="Name">{m.name}</td>
                      <td data-label="Email">{m.email}</td>
                      <td data-label="Requested">{m.requested}</td>
                      <td data-label="Actions">
                        <span style={{ display: 'inline-flex', gap: 8 }}>
                          <button className="btn btn--sm" aria-label={`Approve ${m.name}`} onClick={() => approve(i)}>Approve</button>
                          <button className="btn btn--sm btn--dark-outline" aria-label={`Decline ${m.name}`} onClick={() => decline(i)}>Decline</button>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p className="empty">No pending requests. New join requests will show up here.</p>
        )}
      </div>
    </>
  );
}
