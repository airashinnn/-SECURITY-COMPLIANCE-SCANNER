import { chip, sevKey } from '../components/chips.jsx';
import { useApp } from '../context/AppContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const STATUSES = ['Open', 'In progress', 'Resolved'];

export default function Remediation() {
  const { findings: allFindings, apps, org, updateFindingStatus } = useApp();
  const orgAppIds = new Set(apps.filter(a => a.org === org).map(a => a.id));
  const findings = allFindings.filter(f => orgAppIds.has(f.appId));
  const toast = useToast();

  function handleChange(id, status) {
    updateFindingStatus(id, status);
    toast(`${id} marked ${status.toLowerCase()}`);
  }

  return (
    <div className="card tblcard">
      <div className="tblwrap">
        <table className="tbl">
          <thead>
            <tr><th>Finding</th><th>Severity</th><th>Owner</th><th>Due</th><th>Status</th></tr>
          </thead>
          <tbody>
            {findings.map(f => (
              <tr key={f.id}>
                <td className="lead" data-label="Finding">
                  {f.title}<br />
                  <span className="muted" style={{ fontWeight: 400, fontSize: 13 }}>{f.id} · {f.app}</span>
                </td>
                <td data-label="Severity">{chip(f.sev, sevKey(f.sev))}</td>
                <td data-label="Owner">{f.owner}</td>
                <td data-label="Due">{f.due}</td>
                <td data-label="Status">
                  <select className="sel sel--sm" aria-label={`Status for ${f.id}`} value={f.status} onChange={e => handleChange(f.id, e.target.value)}>
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
