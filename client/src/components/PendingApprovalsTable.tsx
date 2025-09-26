import type { TravelRequest } from '../types';
import { formatDate, roleLabels } from '../utils/format';

const roleLabel = (role: string | undefined) => (role ? roleLabels[role as keyof typeof roleLabels] ?? role : '—');

const getCurrentRole = (item: TravelRequest) => {
  if (typeof item.currentApprovalIndex === 'number' && item.currentApprovalIndex >= 0) {
    const current = item.approvals[item.currentApprovalIndex];
    if (current) {
      return current.role;
    }
  }
  const last = item.approvals[item.approvals.length - 1];
  return last?.role;
};

interface Props {
  approvals: TravelRequest[];
  loading?: boolean;
  error?: string | null;
  onDecision?: (id: string, decision: 'APPROVE' | 'REJECT') => void;
  busyId?: string | null;
}

const PendingApprovalsTable = ({ approvals, loading, error, onDecision, busyId }: Props) => {
  if (loading) {
    return <p className="muted">Loading approvals…</p>;
  }
  if (error) {
    return <p className="error-text">{error}</p>;
  }
  if (!approvals.length) {
    return <p className="muted">No approvals pending right now.</p>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Number</th>
            <th>Requestor</th>
            <th>Travel Dates</th>
            <th>Current Step</th>
            {onDecision && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {approvals.map((item) => (
            <tr key={item._id}>
              <td>{item.requestNumber}</td>
              <td>{item.requesterName}</td>
              <td>
                {formatDate(item.travelStartDate)} – {formatDate(item.travelEndDate)}
              </td>
              <td>{roleLabel(getCurrentRole(item))}</td>
              {onDecision && (
                <td className="actions">
                  <button
                    className="secondary"
                    disabled={busyId === item._id}
                    onClick={() => onDecision(item._id, 'REJECT')}
                  >
                    Reject
                  </button>
                  <button
                    className="primary"
                    disabled={busyId === item._id}
                    onClick={() => onDecision(item._id, 'APPROVE')}
                  >
                    Approve
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PendingApprovalsTable;
