const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Browsers throw a raw `TypeError: Failed to fetch` when a network request
// cannot be made at all (server down, CORS block, offline). Map that to a
// clear, human-friendly message so we never surface raw network errors to users.
const FRIENDLY_NETWORK_ERROR =
  "Unable to connect to the server. Please try again.";

function toFriendlyError(err: unknown): Error {
  if (err instanceof TypeError || err instanceof Error && err.name === "AbortError") {
    return new Error(FRIENDLY_NETWORK_ERROR);
  }
  return err instanceof Error ? err : new Error("Something went wrong. Please try again.");
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  picture?: string | null;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

// Flag to prevent repeated probes of an unavailable backend within a session.
let backendProbed = false;
let backendUp = false;

export async function isBackendAvailable(): Promise<boolean> {
  if (backendProbed) return backendUp;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(`${API_URL}/api/health`, { signal: controller.signal });
    clearTimeout(timer);
    backendUp = res.ok;
  } catch {
    backendUp = false;
  }
  backendProbed = true;
  return backendUp;
}

async function post(path: string, body: unknown): Promise<AuthResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/auth${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    throw toFriendlyError(err);
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Authentication failed.");
  }
  return data as AuthResponse;
}

export async function googleSignIn(credential: string): Promise<AuthResponse> {
  return post("/google", { token: credential });
}

export async function fetchMe(token: string): Promise<AuthUser> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    throw toFriendlyError(err);
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Could not load account.");
  }
  return data.user as AuthUser;
}

export function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem("portfolioUser");
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function getStoredToken(): string | null {
  return localStorage.getItem("authToken");
}

export function storeAuth(user: AuthUser, token: string) {
  localStorage.setItem("portfolioUser", JSON.stringify(user));
  localStorage.setItem("authToken", token);
}

export function clearAuth() {
  localStorage.removeItem("portfolioUser");
  localStorage.removeItem("authToken");
}
