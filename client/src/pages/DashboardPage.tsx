import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import RequestsTable from '../components/RequestsTable';
import PendingApprovalsTable from '../components/PendingApprovalsTable';
import {
  fetchMyRequests,
  fetchPendingApprovals,
  submitApprovalDecision,
} from '../api/requests';
import { useAuth } from '../context/AuthContext';
import { roleLabels } from '../utils/format';

const DashboardPage = () => {
  const { token, user } = useAuth();
  const queryClient = useQueryClient();
  const isApprover = Boolean(user && user.role !== 'REQUESTOR');

  const {
    data: myRequests = [],
    isLoading: loadingMyRequests,
    error: myRequestError,
  } = useQuery({
    queryKey: ['myRequests'],
    queryFn: () => fetchMyRequests(token ?? ''),
    enabled: Boolean(token),
  });

  const {
    data: approvals = [],
    isLoading: loadingApprovals,
    error: approvalsError,
  } = useQuery({
    queryKey: ['pendingApprovals'],
    queryFn: () => fetchPendingApprovals(token ?? ''),
    enabled: Boolean(token) && isApprover,
  });

  const approvalMutation = useMutation({
    mutationFn: async ({ id, decision }: { id: string; decision: 'APPROVE' | 'REJECT' }) => {
      if (!token) {
        throw new Error('You must be signed in');
      }
      return submitApprovalDecision(token, id, decision);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myRequests'] });
      queryClient.invalidateQueries({ queryKey: ['pendingApprovals'] });
    },
  });

  const approvalError =
    approvalMutation.error instanceof Error ? approvalMutation.error.message : null;
  const busyId = (approvalMutation.variables as { id: string } | undefined)?.id ?? null;

  const handleDecision = async (id: string, decision: 'APPROVE' | 'REJECT') => {
    try {
      await approvalMutation.mutateAsync({ id, decision });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Dashboard</h1>
          {user && <p className="muted">Logged in as {user.name} ({roleLabels[user.role]})</p>}
        </div>
        <Link className="primary" to="/requests/new">
          New Request
        </Link>
      </header>

      <section>
        <h2>My Requests</h2>
        <RequestsTable
          requests={myRequests}
          loading={loadingMyRequests}
          error={myRequestError instanceof Error ? myRequestError.message : null}
        />
      </section>

      {isApprover && (
        <section>
          <h2>Approvals Pending</h2>
          {approvalError && <p className="error-text">{approvalError}</p>}
          <PendingApprovalsTable
            approvals={approvals}
            loading={loadingApprovals || approvalMutation.isPending}
            error={approvalsError instanceof Error ? approvalsError.message : null}
            onDecision={handleDecision}
            busyId={busyId}
          />
        </section>
      )}
    </div>
  );
};

export default DashboardPage;
