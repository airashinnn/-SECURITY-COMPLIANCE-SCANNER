import { Link, useNavigate, useParams } from 'react-router-dom';
import { chip } from '../../components/chips.jsx';
import { useApp } from '../../context/AppContext.jsx';

const STATUS_TONE = { Completed: 'ok', Running: 'warn', Failed: 'danger', Cancelled: 'info' };

export default function AssessmentHistory() {
  const { appId } = useParams();
  const navigate = useNavigate();
  const { apps, assessments } = useApp();
  const app = apps.find(a => a.id === appId);
  if (!app) return <p className="empty">Application not found.</p>;

  const history = assessments.filter(a => a.appId === appId).sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <>
      <button type="button" className="link back-link" onClick={() => navigate(`/app/applications/${app.id}`)}>← Back to {app.name}</button>
      <div className="card tblcard">
        {history.length ? (
          <div className="tblwrap">
            <table className="tbl">
              <thead><tr><th>Assessment</th><th>Profile</th><th>Date</th><th>Status</th><th>Score</th></tr></thead>
              <tbody>
                {history.map(a => (
                  <tr key={a.id}>
                    <td className="lead" data-label="Assessment"><Link to={`/app/assessments/${a.id}`}>{a.id}</Link></td>
                    <td data-label="Profile">{a.profile}</td>
                    <td data-label="Date">{a.date}</td>
                    <td data-label="Status">{chip(a.status, STATUS_TONE[a.status])}</td>
                    <td data-label="Score">{a.score != null ? `${a.score}/100` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="empty">No assessments yet for this application.</p>}
      </div>
    </>
  );
}
