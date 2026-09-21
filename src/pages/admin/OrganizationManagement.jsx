import { Link } from 'react-router-dom';
import { chip } from '../../components/chips.jsx';
import { useApp } from '../../context/AppContext.jsx';

export default function OrganizationManagement() {
  const { organizations } = useApp();

  return (
    <div className="card tblcard">
      <div className="tblwrap">
        <table className="tbl">
          <thead><tr><th>Name</th><th>Type</th><th>Members</th><th>Applications</th><th>Created</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {organizations.map(o => (
              <tr key={o.name}>
                <td className="lead" data-label="Name">{o.name}</td>
                <td data-label="Type">{o.type}</td>
                <td data-label="Members">{o.memberCount}</td>
                <td data-label="Applications">{o.applicationCount}</td>
                <td data-label="Created">{o.createdDate}</td>
                <td data-label="Status">{chip(o.status, o.status === 'Active' ? 'ok' : 'crit')}</td>
                <td data-label="Actions">
                  <Link className="btn btn--sm btn--dark-outline" to={`/admin/organizations/${encodeURIComponent(o.name)}`}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
