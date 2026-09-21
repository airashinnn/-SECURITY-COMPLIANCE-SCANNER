import { Link, useNavigate, useParams } from 'react-router-dom';
import { chip, sevKey, statusChip } from '../components/chips.jsx';
import { useApp } from '../context/AppContext.jsx';

const STATUS_TONE = { Completed: 'ok', Running: 'warn', Failed: 'crit', Cancelled: 'info' };
const SEVERITIES = ['Critical', 'High', 'Medium', 'Low'];

export default function AssessmentDetails() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const { assessments, apps, findings, isAdmin } = useApp();
  const assessment = assessments.find(a => a.id === assessmentId);
  const app = assessment && apps.find(a => a.id === assessment.appId);
  const relatedFindings = findings.filter(f => f.assessmentId === assessmentId);
  const backPath = isAdmin ? '/admin/assessments' : (app ? `/app/applications/${app.id}/assessments` : '/app/applications');
  const findingLinkBase = isAdmin ? null : '/app/findings';

  if (!assessment) return <p className="empty">Assessment not found.</p>;

  function downloadReport() {
    const report = {
      assessmentId: assessment.id,
      application: app?.name,
      targetUrl: app?.url,
      profile: assessment.profile,
      date: assessment.date,
      status: assessment.status,
      checksExecuted: assessment.checksExecuted,
      securityScore: assessment.score,
      findings: relatedFindings.map(f => ({ id: f.id, title: f.title, severity: f.sev, status: f.status, category: f.category }))
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${assessment.id}-report.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <button type="button" className="link back-link" onClick={() => navigate(backPath)}>← Back</button>
      <div className="card app-detail">
        <div className="app-detail__head">
          <div>
            <h2>{assessment.id}</h2>
            <p className="muted">{app?.name} · {app?.url}</p>
          </div>
          {chip(assessment.status, STATUS_TONE[assessment.status])}
        </div>
        <dl className="detail-grid">
          <div><dt>Application</dt><dd>{app?.name || '—'}</dd></div>
          <div><dt>Target URL</dt><dd>{app?.url || '—'}</dd></div>
          <div><dt>Assessment profile</dt><dd>{assessment.profile}</dd></div>
          <div><dt>Assessment date</dt><dd>{assessment.date}</dd></div>
          <div><dt>Checks executed</dt><dd>{assessment.checksExecuted}</dd></div>
          <div><dt>Security score</dt><dd>{assessment.score != null ? `${assessment.score}/100` : '—'}</dd></div>
        </dl>
      </div>

      <section className="card" style={{ marginTop: 24 }}>
        <h2>Findings summary</h2>
        {relatedFindings.length ? (
          <>
            <div className="stats stats--two" style={{ marginTop: 16 }}>
              {SEVERITIES.map(s => (
                <div className="card stat" key={s}><h2>{s}</h2><p>{relatedFindings.filter(f => f.sev === s).length}</p></div>
              ))}
            </div>
            <ul className="mini" style={{ marginTop: 16 }}>
              {relatedFindings.map(f => (
                <li key={f.id}>
                  <div>
                    {findingLinkBase ? <Link to={`${findingLinkBase}/${f.id}`}><b>{f.title}</b></Link> : <b>{f.title}</b>}
                    <span className="muted">{f.id} · {f.category}</span>
                  </div>
                  {chip(f.sev, sevKey(f.sev))}
                </li>
              ))}
            </ul>
          </>
        ) : <p className="muted" style={{ marginTop: 12 }}>No findings were recorded for this assessment.</p>}
        <button type="button" className="btn btn--block" style={{ marginTop: 24 }} onClick={downloadReport}>Download Assessment Report</button>
      </section>
    </>
  );
}
