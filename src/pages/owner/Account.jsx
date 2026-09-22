import { useNavigate } from 'react-router-dom';
import Icon from '../../components/Icon.jsx';
import { useApp } from '../../context/AppContext.jsx';

export default function Account() {
  const { user, org, signOut } = useApp();
  const navigate = useNavigate();
  const u = user || { name: 'User', email: '', role: 'Owner' };
  const initials = u.name.split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <section className="card acct">
      <div className="head-row">
        <div className="avatar" aria-hidden="true">{initials}</div>
        <h2>{u.name}</h2>
      </div>
      <dl>
        <div><dt>Email</dt><dd>{u.email}</dd></div>
        <div><dt>Role</dt><dd>{u.role}</dd></div>
        <div><dt>Organization</dt><dd>{org}</dd></div>
      </dl>
      <button className="btn btn--block" onClick={() => { signOut(); navigate('/'); }}>
        <Icon name="logout" size={20} /> Sign out
      </button>
    </section>
  );
}
