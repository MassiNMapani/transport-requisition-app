export interface RequestOptions extends RequestInit {
  token?: string;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api';

export const apiRequest = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (options.token) {
    headers.set('Authorization', `Bearer ${options.token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const message = await safeParseError(response);
    throw new Error(message || 'Request failed');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};

const safeParseError = async (response: Response): Promise<string | undefined> => {
  try {
    const body = await response.json();
    if (body && typeof body.message === 'string') {
      return body.message;
    }
    return response.statusText;
  } catch {
    return response.statusText;
  }
};
