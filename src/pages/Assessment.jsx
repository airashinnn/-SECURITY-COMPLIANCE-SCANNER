import { chip } from '../components/chips.jsx';
import { useApp } from '../context/AppContext.jsx';

export default function Assessment() {
  const { apps } = useApp();
  return (
    <div className="card tblcard">
      <div className="tblwrap">
        <table className="tbl">
          <thead>
            <tr><th>Application</th><th>Standard</th><th>Status</th><th>Score</th><th>Last assessed</th></tr>
          </thead>
          <tbody>
            {apps.map(x => (
              <tr key={x.name}>
                <td className="lead" data-label="Application">{x.name}</td>
                <td data-label="Standard">{x.framework}</td>
                <td data-label="Status">{x.score != null ? chip('Completed', 'ok') : chip('Not started', 'info')}</td>
                <td data-label="Score">{x.score != null ? `${x.score}/100` : '—'}</td>
                <td data-label="Last assessed">{x.assessed || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
