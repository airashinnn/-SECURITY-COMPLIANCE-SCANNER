import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import { chip } from '../../components/chips.jsx';
import CategoryBars from '../../components/CategoryBars.jsx';
import ScoreMeter from '../../components/ScoreMeter.jsx';

const SEVERITIES = [
  { label: 'Critical', varName: '--crit' },
  { label: 'High', varName: '--high' },
  { label: 'Medium', varName: '--med' },
  { label: 'Low', varName: '--low' }
];

export default function Overview() {
  const { apps: allApps, findings: allFindings, org } = useApp();
  const apps = allApps.filter(x => x.org === org);
  const appIds = new Set(apps.map(x => x.id));
  const findings = allFindings.filter(f => appIds.has(f.appId));
  const auth = apps.filter(x => x.status === 'Authorized').length;
  const pend = apps.filter(x => x.status === 'Pending').length;
  const scored = apps.filter(x => x.score != null);
  const avgScore = scored.length ? Math.round(scored.reduce((s, x) => s + x.score, 0) / scored.length) : null;
  const open = findings.filter(f => f.status !== 'Resolved');
  const recent = apps.filter(x => x.assessed).slice(0, 3);
  const severityData = SEVERITIES.map(s => ({ ...s, value: open.filter(f => f.sev === s.label).length }));

  const Stat = ({ label, value, accent }) => (
    <div className="card stat" style={accent ? { borderTop: `3px solid var(${accent})` } : undefined}>
      <h2>{label}</h2><p>{value}</p>
    </div>
  );

  return (
    <>
      <div className="stats">
        <Stat label="Applications" value={apps.length} />
        <Stat label="Authorized applications" value={auth} accent="--ok" />
        <Stat label="Pending applications" value={pend} accent="--warn" />
        <div className="card stat stat--meter">
          <h2>Security Score</h2>
          <ScoreMeter score={avgScore} size={88} label="average security score" />
        </div>
      </div>
      <div className="lower">
        <section className="card" aria-labelledby="h-recent">
          <h2 id="h-recent">Recent Assessment</h2>
          {recent.length ? (
            <ul className="mini">
              {recent.map(x => (
                <li key={x.name}>
                  <div><b>{x.name}</b><span className="muted">{x.framework} · {x.assessed}</span></div>
                  {chip(x.score + '/100', x.score >= 90 ? 'ok' : 'warn')}
                </li>
              ))}
            </ul>
          ) : <p className="muted">No assessments yet. Authorize an application to start.</p>}
        </section>
        <section className="card" aria-labelledby="h-open">
          <h2 id="h-open">Open Findings</h2>
          <p className="big">{open.length}</p>
          <p className="muted">need attention</p>
          <Link className="more" to="/app/findings">View findings</Link>
        </section>
        <section className="card" aria-labelledby="h-sev">
          <h2 id="h-sev">Findings by Severity</h2>
          <div style={{ marginTop: 16 }}>
            <CategoryBars data={severityData} />
          </div>
        </section>
      </div>
    </>
  );
}
