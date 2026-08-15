// Set this to your deployed Vercel backend URL, e.g. "https://avash-portfolio-api.vercel.app"
export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include", // sends/receives the admin session cookie
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);
  return data;
}

export const api = {
  // Auth
  loginWithGoogle: (idToken) => request("/api/auth/login", { method: "POST", body: JSON.stringify({ idToken }) }),
  session: () => request("/api/auth/session"),
  logout: () => request("/api/auth/logout", { method: "POST" }),

  // Projects
  listProjects: (segment) => request(`/api/projects${segment ? `?segment=${segment}` : ""}`),
  getProject: (id) => request(`/api/projects/${id}`),
  createProject: (project) => request("/api/projects", { method: "POST", body: JSON.stringify(project) }),
  updateProject: (id, patch) => request(`/api/projects/${id}`, { method: "PUT", body: JSON.stringify(patch) }),
  deleteProject: (id) => request(`/api/projects/${id}`, { method: "DELETE" }),

  // Drive
  listDriveFiles: (folderId) => request(`/api/drive/list${folderId ? `?folderId=${folderId}` : ""}`),
  connectDriveUrl: () => `${API_BASE}/api/drive/connect`,

  // Settings (profile: name, photo, contact, socials, stats)
  getSettings: () => request("/api/settings"),
  updateSettings: (patch) => request("/api/settings", { method: "PUT", body: JSON.stringify(patch) }),
};
