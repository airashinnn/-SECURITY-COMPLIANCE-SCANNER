import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SCAN_PROFILES, ALL_CHECKS } from '../../data/scanProfiles.js';
import { useApp } from '../../context/AppContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export default function ScanConfiguration() {
  const { appId } = useParams();
  const navigate = useNavigate();
  const { apps, startScan } = useApp();
  const toast = useToast();
  const app = apps.find(a => a.id === appId);
  const [profileId, setProfileId] = useState(null);
  const [customChecks, setCustomChecks] = useState([]);
  const [confirming, setConfirming] = useState(null);

  if (!app) return <p className="empty">Application not found.</p>;

  const profile = SCAN_PROFILES.find(p => p.id === profileId);

  function choose(id) {
    setProfileId(id);
    if (id !== 'custom') setConfirming(id);
  }

  function toggleCheck(checkId) {
    setCustomChecks(prev => prev.includes(checkId) ? prev.filter(c => c !== checkId) : [...prev, checkId]);
  }

  function launch(id, checks) {
    const assessment = startScan(app.id, id, checks);
    toast('Scan started');
    navigate(`/app/assessments/${assessment.id}/progress`);
  }

  const groupedChecks = ALL_CHECKS.reduce((acc, c) => {
    (acc[c.category] ||= []).push(c);
    return acc;
  }, {});

  if (profileId === 'custom') {
    return (
      <>
        <button type="button" className="link back-link" onClick={() => setProfileId(null)}>← Back to scan profiles</button>
        <div className="card scan-config">
          <h2>Custom Scan — {app.name}</h2>
          <p className="muted">{app.url}</p>
          <p style={{ margin: '12px 0 20px' }}>Select the individual checks to execute.</p>
          {Object.entries(groupedChecks).map(([category, checks]) => (
            <div key={category} className="check-group">
              <h3 className="sect">{category}</h3>
              {checks.map(c => (
                <label className="check checklist-item" key={c.id}>
                  <input type="checkbox" checked={customChecks.includes(c.id)} onChange={() => toggleCheck(c.id)} />
                  <span>{c.id} — {c.label}</span>
                </label>
              ))}
            </div>
          ))}
          <div className="actions row">
            <button type="button" className="btn btn--ghost" onClick={() => setProfileId(null)}>Cancel</button>
            <button type="button" className="btn" disabled={!customChecks.length} onClick={() => launch('custom', customChecks)}>
              Run custom scan ({customChecks.length})
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <button type="button" className="link back-link" onClick={() => navigate(`/app/applications/${app.id}`)}>← Back to {app.name}</button>
      <div className="card scan-config">
        <h2>Scan Application</h2>
        <dl className="detail-grid" style={{ marginBottom: 24 }}>
          <div><dt>Application name</dt><dd>{app.name}</dd></div>
          <div><dt>Website / Domain</dt><dd>{app.url}</dd></div>
        </dl>
        <h3 className="sect">Assessment profile</h3>
        <div className="profile-grid">
          {SCAN_PROFILES.map(p => (
            <button type="button" key={p.id} className="card profile-card" onClick={() => choose(p.id)}>
              <h4>{p.name}</h4>
              <p className="muted">{p.purpose}</p>
              <p className="meta">{p.id === 'custom' ? 'Choose your own checks' : `${p.checks.length} checks`}</p>
            </button>
          ))}
        </div>
      </div>

      {confirming && profile && (
        <div className="modal-backdrop" role="presentation" onClick={() => setConfirming(null)}>
          <div className="card confirm-modal" role="dialog" aria-modal="true" aria-labelledby="scan-confirm-title" onClick={e => e.stopPropagation()}>
            <h2 id="scan-confirm-title">Confirm {profile.name}</h2>
            <dl className="detail-grid">
              <div><dt>Application</dt><dd>{app.name}</dd></div>
              <div><dt>Target</dt><dd>{app.url}</dd></div>
              <div><dt>Profile</dt><dd>{profile.name}</dd></div>
              <div><dt>Checks</dt><dd>{profile.checks.length}</dd></div>
            </dl>
            <p className="muted">{profile.purpose}</p>
            <div className="actions row">
              <button type="button" className="btn btn--ghost" onClick={() => setConfirming(null)}>Cancel</button>
              <button type="button" className="btn" onClick={() => launch(profile.id)}>Start scan</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
