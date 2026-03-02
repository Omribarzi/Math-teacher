const API_BASE = import.meta.env.VITE_API_URL || '';

function getToken(): string | null {
  return localStorage.getItem('math-token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }

  return res.json();
}

// Auth
export interface AuthResponse {
  token: string;
  user: { id: number; username: string; name: string; role: string; avatarId: string };
}

export function login(username: string, password: string) {
  return request<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export function register(data: {
  username: string;
  password: string;
  name: string;
  avatarId: string;
  role: string;
}) {
  return request<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// State sync
export interface AppState {
  player?: Record<string, unknown>;
  progress?: Record<string, unknown>;
  settings?: Record<string, unknown>;
}

export function loadState() {
  return request<AppState>('/api/state');
}

export function saveState(state: AppState) {
  return request<{ ok: boolean }>('/api/state', {
    method: 'PUT',
    body: JSON.stringify(state),
  });
}

// Admin
export interface KidInfo {
  id: number;
  username: string;
  name: string;
  avatar_id: string;
  created_at: string;
  player: Record<string, unknown> | null;
  progress: Record<string, unknown> | null;
}

export function listKids() {
  return request<KidInfo[]>('/api/admin/kids');
}

export function createKid(data: {
  username: string;
  password: string;
  name: string;
  avatarId: string;
}) {
  return request<{ id: number; username: string; name: string }>('/api/admin/kids', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
