import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { sevKey, statusChip, chip } from '../components/chips.jsx';

const SEVERITIES = ['Critical', 'High', 'Medium', 'Low'];

export default function Overview() {
  const { apps: allApps, findings: allFindings, org } = useApp();
  const apps = allApps.filter(x => x.org === org);
  const appIds = new Set(apps.map(x => x.id));
  const findings = allFindings.filter(f => appIds.has(f.appId));
  const auth = apps.filter(x => x.status === 'Authorized').length;
  const pend = apps.filter(x => x.status === 'Pending').length;
  const scored = apps.filter(x => x.score != null);
  const score = scored.length ? Math.round(scored.reduce((s, x) => s + x.score, 0) / scored.length) + '/100' : '—';
  const open = findings.filter(f => f.status !== 'Resolved');
  const recent = apps.filter(x => x.assessed).slice(0, 3);
  const sevs = SEVERITIES.map(s => [s, open.filter(f => f.sev === s).length]);
  const max = Math.max(1, ...sevs.map(x => x[1]));

  const Stat = ({ label, value }) => (
    <div className="card stat"><h2>{label}</h2><p>{value}</p></div>
  );

  return (
    <>
      <div className="stats">
        <Stat label="Applications" value={apps.length} />
        <Stat label="Authorized applications" value={auth} />
        <Stat label="Pending applications" value={pend} />
        <Stat label="Security Score" value={score} />
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
          <ul className="sev" style={{ marginTop: 8 }}>
            {sevs.map(([s, c]) => (
              <li key={s}>
                <span>{s}</span>
                <div className="bar" aria-hidden="true"><i className={sevKey(s)} style={{ width: `${(c / max) * 100}%` }} /></div>
                <b>{c}</b>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
