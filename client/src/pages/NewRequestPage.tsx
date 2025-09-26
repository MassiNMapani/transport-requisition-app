import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import RequestForm from '../components/RequestForm';
import { createTravelRequest } from '../api/requests';
import type { CreateRequestPayload } from '../api/requests';
import { useAuth } from '../context/AuthContext';

const NewRequestPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: (payload: CreateRequestPayload) => {
      if (!token) throw new Error('You must be signed in');
      return createTravelRequest(token, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myRequests'] });
      queryClient.invalidateQueries({ queryKey: ['pendingApprovals'] });
      navigate('/');
    },
  });

  const handleSubmit = async (payload: CreateRequestPayload) => {
    await mutateAsync(payload);
  };

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>New Travel Request</h1>
          <p className="muted">Complete the form below to request business travel.</p>
        </div>
      </header>

      {error instanceof Error && <p className="error-text">{error.message}</p>}

      <RequestForm onSubmit={handleSubmit} loading={isPending} />
    </div>
  );
};

export default NewRequestPage;
