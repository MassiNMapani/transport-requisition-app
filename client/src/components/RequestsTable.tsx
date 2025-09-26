import type { TravelRequest } from '../types';
import { formatDate } from '../utils/format';
import { nextApproverLabel, statusClass } from '../utils/requestHelpers';

interface Props {
  requests: TravelRequest[];
  loading?: boolean;
  error?: string | null;
}

const RequestsTable = ({ requests, loading, error }: Props) => {
  if (loading) {
    return <p className="muted">Loading your requests…</p>;
  }
  if (error) {
    return <p className="error-text">{error}</p>;
  }
  if (!requests.length) {
    return <p className="muted">No travel requests yet. Create one to get started.</p>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Number</th>
            <th>Description</th>
            <th>Travel Dates</th>
            <th>Approver</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request._id}>
              <td>{request.requestNumber}</td>
              <td>{request.description}</td>
              <td>
                {formatDate(request.travelStartDate)} – {formatDate(request.travelEndDate)}
              </td>
              <td>{nextApproverLabel(request)}</td>
              <td>
                <span className={`status-badge ${statusClass(request.status)}`}>
                  {request.status.replace(/_/g, ' ')}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestsTable;
