import { useNavigate, useParams } from 'react-router-dom';
import { chip, sevKey, statusChip } from '../../components/chips.jsx';
import IconBadge from '../../components/IconBadge.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

const STATUSES = ['Open', 'In progress', 'Resolved'];

export default function FindingDetails() {
  const { findingId } = useParams();
  const navigate = useNavigate();
  const { findings, updateFindingStatus } = useApp();
  const toast = useToast();
  const finding = findings.find(f => f.id === findingId);

  if (!finding) return <p className="empty">Finding not found.</p>;

  function handleChange(e) {
    updateFindingStatus(finding.id, e.target.value);
    toast(`${finding.id} marked ${e.target.value.toLowerCase()}`);
  }

  return (
    <>
      <button type="button" className="link back-link" onClick={() => navigate(-1)}>← Back</button>
      <div className="card app-detail">
        <div className="app-detail__head">
          <div className="app-detail__title">
            <IconBadge name="findings" tintVar={`--${sevKey(finding.sev)}`} />
            <div>
              <h2>{finding.title}</h2>
              <p className="muted">{finding.id} · {finding.app} · {finding.category}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {chip(finding.sev, sevKey(finding.sev))}
            {statusChip(finding.status)}
          </div>
        </div>

        <h3 className="sect">Description</h3>
        <p>{finding.description}</p>

        <h3 className="sect">Evidence</h3>
        <p className="evidence">{finding.evidence}</p>

        <h3 className="sect">Remediation steps</h3>
        <ol className="remediation-steps">
          {finding.remediation.map((step, i) => <li key={i}>{step}</li>)}
        </ol>

        <div className="field" style={{ maxWidth: 260, marginTop: 24 }}>
          <label htmlFor="finding-status">Status</label>
          <select id="finding-status" value={finding.status} onChange={handleChange}>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>
    </>
  );
}
