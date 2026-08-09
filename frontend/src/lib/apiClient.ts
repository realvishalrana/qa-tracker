import type { ApiResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  formData?: FormData;
  query?: Record<string, string | number | undefined | null>;
};

function buildUrl(path: string, query?: RequestOptions['query']) {
  const url = new URL(path.startsWith('http') ? path : `${API_URL}${path}`);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
}

function formatErrorMessage(error?: { message: string; details?: unknown }) {
  if (!error) return 'Request failed';
  const details = error.details as
    | { fieldErrors?: Record<string, string[]>; formErrors?: string[] }
    | undefined;
  if (details?.fieldErrors) {
    const fields = Object.entries(details.fieldErrors)
      .flatMap(([field, msgs]) => (msgs || []).map((m) => `${field}: ${m}`))
      .join('. ');
    if (fields) return `${error.message}. ${fields}`;
  }
  return error.message;
}

export async function apiClient<T>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const headers: HeadersInit = {};
  let body: BodyInit | undefined;

  if (options.formData) {
    body = options.formData;
  } else if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(options.body);
  }

  const res = await fetch(buildUrl(path, options.query), {
    method: options.method || (options.body || options.formData ? 'POST' : 'GET'),
    headers,
    body,
    credentials: 'include',
  });

  if (res.status === 401 && typeof window !== 'undefined' && !path.includes('/auth/login')) {
    if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
      window.location.href = '/login';
    }
  }

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('text/csv')) {
    const text = await res.text();
    if (!res.ok) throw new ApiError('Export failed', res.status);
    return { success: true, data: text as T };
  }

  const json = (await res.json()) as ApiResponse<T>;
  if (!res.ok || json.success === false) {
    throw new ApiError(formatErrorMessage(json.error), res.status, json.error?.details);
  }
  return json;
}
