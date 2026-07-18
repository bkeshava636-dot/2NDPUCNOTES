import { getAdminToken } from "./utils";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getAdminToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["x-admin-token"] = token;
  const res = await fetch(path, { ...options, headers });
  return res;
}
