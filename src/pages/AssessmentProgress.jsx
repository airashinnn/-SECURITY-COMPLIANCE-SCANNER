import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const DURATION_MS = 4000;

export default function AssessmentProgress() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const { assessments, apps, completeScan, cancelScan } = useApp();
  const toast = useToast();
  const [percent, setPercent] = useState(0);
  const cancelledRef = useRef(false);

  const assessment = assessments.find(a => a.id === assessmentId);
  const app = assessment && apps.find(a => a.id === assessment.appId);

  useEffect(() => {
    if (!assessment || assessment.status !== 'Running') return undefined;
    const start = Date.now();
    const tick = setInterval(() => {
      const pct = Math.min(100, Math.round(((Date.now() - start) / DURATION_MS) * 100));
      setPercent(pct);
      if (pct >= 100) {
        clearInterval(tick);
        if (!cancelledRef.current) {
          completeScan(assessmentId);
          toast('Assessment completed');
        }
      }
    }, 150);
    return () => clearInterval(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessmentId]);

  if (!assessment) return <p className="empty">Assessment not found.</p>;

  function cancel() {
    cancelledRef.current = true;
    cancelScan(assessmentId);
    toast('Assessment cancelled');
    navigate(app ? `/app/applications/${app.id}` : '/app/applications');
  }

  if (assessment.status === 'Completed') {
    return (
      <div className="card progress-card">
        <h2>Assessment completed</h2>
        <p className="muted">{assessment.profile} on {app?.name}</p>
        <button type="button" className="btn" onClick={() => navigate(`/app/assessments/${assessment.id}`)}>View results</button>
      </div>
    );
  }

  if (assessment.status === 'Cancelled') {
    return (
      <div className="card progress-card">
        <h2>Assessment cancelled</h2>
        <button type="button" className="btn btn--ghost" onClick={() => navigate(app ? `/app/applications/${app.id}` : '/app/applications')}>Back</button>
      </div>
    );
  }

  return (
    <div className="card progress-card">
      <h2>Running {assessment.profile}</h2>
      <p className="muted">{app?.name} · {app?.url}</p>
      <div className="bar bar--lg" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <i style={{ width: `${percent}%` }} />
      </div>
      <p className="progress-pct">{percent}%</p>
      <p className="muted">Executing {assessment.checksExecuted} checks…</p>
      <button type="button" className="btn btn--ghost" onClick={cancel}>Cancel scan</button>
    </div>
  );
}
