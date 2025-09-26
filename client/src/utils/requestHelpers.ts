import type { TravelRequest } from '../types';
import { roleLabels } from './format';

export const nextApproverLabel = (request: TravelRequest) => {
  const { currentApprovalIndex, approvals } = request;
  if (typeof currentApprovalIndex === 'number' && currentApprovalIndex >= 0) {
    const step = approvals[currentApprovalIndex];
    if (step) {
      return roleLabels[step.role] ?? step.role;
    }
  }
  for (let index = approvals.length - 1; index >= 0; index -= 1) {
    const entry = approvals[index];
    if (entry && entry.status !== 'PENDING') {
      return roleLabels[entry.role] ?? entry.role;
    }
  }
  return '—';
};

export const statusClass = (status: string) => {
  if (status.includes('REJECTED')) return 'rejected';
  if (status.includes('APPROVED')) return 'approved';
  return 'pending';
};
