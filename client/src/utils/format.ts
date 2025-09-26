import type { UserRole } from '../types';

export const roleLabels: Record<UserRole, string> = {
  REQUESTOR: 'Requestor',
  HEAD_OF_DEPARTMENT: 'Head of Department',
  HEAD_HR_ADMIN: 'Head HR & Admin',
  CHIEF_EXECUTIVE_OFFICER: 'Chief Executive Officer',
  CHAIRMAN: 'Chairman',
};

export const formatCurrency = (value: number | undefined) => {
  if (typeof value !== 'number') return '—';
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(value);
};

export const formatDate = (value: string | Date | undefined) => {
  if (!value) return '—';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString();
};
