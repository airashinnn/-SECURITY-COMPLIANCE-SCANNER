import { useState } from 'react';
import { Link } from 'react-router-dom';
import { statusChip } from '../../components/chips.jsx';
import { useApp } from '../../context/AppContext.jsx';

const STATUS_FILTERS = ['All', 'Pending', 'Authorized', 'Rejected', 'Revoked'];

export default function ApplicationManagementAdmin() {
  const { apps } = useApp();
  const [tab, setTab] = useState('queue');
  const [status, setStatus] = useState('All');
  const isQueue = tab === 'queue';

  const queue = apps.filter(a => a.status === 'Pending').sort((a, b) => (a.registeredDate > b.registeredDate ? 1 : -1));
  const overview = apps.filter(a => status === 'All' || a.status === status);

  return (
    <>
      <div className="tabs" role="tablist" aria-label="Application management">
        <button className="tab-btn" role="tab" aria-selected={isQueue} onClick={() => setTab('queue')}>Authorization Queue{queue.length ? ` (${queue.length})` : ''}</button>
        <button className="tab-btn" role="tab" aria-selected={!isQueue} onClick={() => setTab('overview')}>Application Overview</button>
      </div>

      {isQueue ? (
        <div className="card tblcard">
          {queue.length ? (
            <div className="tblwrap">
              <table className="tbl">
                <thead><tr><th>Application</th><th>Target URL</th><th>Organization</th><th>Registered by</th><th>Requested</th><th>Actions</th></tr></thead>
                <tbody>
                  {queue.map(a => (
                    <tr key={a.id}>
                      <td className="lead" data-label="Application">{a.name}</td>
                      <td data-label="Target URL" className="target-url">{a.url}</td>
                      <td data-label="Organization">{a.org}</td>
                      <td data-label="Registered by">{a.registeredBy}</td>
                      <td data-label="Requested">{a.registeredDate}</td>
                      <td data-label="Actions"><Link className="btn btn--sm" to={`/admin/applications/review/${a.id}`}>Review</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p className="empty">Nothing waiting on authorization. New registrations will show up here.</p>}
        </div>
      ) : (
        <>
          <div className="toolbar">
            <label className="sr" htmlFor="appstatus">Filter by status</label>
            <select id="appstatus" className="sel" value={status} onChange={e => setStatus(e.target.value)}>
              {STATUS_FILTERS.map(s => <option key={s} value={s}>{s === 'All' ? 'All statuses' : s}</option>)}
            </select>
          </div>
          <div className="card tblcard">
            {overview.length ? (
              <div className="tblwrap">
                <table className="tbl">
                  <thead><tr><th>Application</th><th>Organization</th><th>Status</th><th>Score</th><th>Actions</th></tr></thead>
                  <tbody>
                    {overview.map(a => (
                      <tr key={a.id}>
                        <td className="lead" data-label="Application">{a.name}</td>
                        <td data-label="Organization">{a.org}</td>
                        <td data-label="Status">{statusChip(a.status)}</td>
                        <td data-label="Score">{a.score != null ? `${a.score}/100` : '—'}</td>
                        <td data-label="Actions"><Link className="btn btn--sm btn--dark-outline" to={`/admin/applications/overview/${a.id}`}>View</Link></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p className="empty">No applications match this filter.</p>}
          </div>
        </>
      )}
    </>
  );
}
