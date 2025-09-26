import { apiRequest } from './client';
import type { TravelRequest } from '../types';

export interface CreateRequestPayload {
  description: string;
  destination: string;
  purposeOfTravel: string;
  travelStartDate: string;
  travelEndDate: string;
  modeOfTravel: string;
  travelers: Array<{
    name: string;
    numberOfDays: number;
    perDiemRate: number;
    total: number;
  }>;
  vehicleRequired: boolean;
  accommodationRequired: boolean;
  otherRequirements?: string;
  programFee?: number;
}

export const createTravelRequest = (token: string, payload: CreateRequestPayload) =>
  apiRequest<TravelRequest>('/requests', {
    method: 'POST',
    body: JSON.stringify(payload),
    token,
  });

export const fetchMyRequests = (token: string) =>
  apiRequest<TravelRequest[]>('/requests', {
    method: 'GET',
    token,
  });

export const fetchPendingApprovals = (token: string) =>
  apiRequest<TravelRequest[]>('/approvals/pending', {
    method: 'GET',
    token,
  });

export const submitApprovalDecision = (
  token: string,
  id: string,
  decision: 'APPROVE' | 'REJECT',
  comments?: string
) =>
  apiRequest<TravelRequest>(`/approvals/${id}/decision`, {
    method: 'POST',
    body: JSON.stringify({ decision, comments }),
    token,
  });
