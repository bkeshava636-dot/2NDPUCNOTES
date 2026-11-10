import { apiFetch, buildApiUrl } from "./api";
import { getAdminToken } from "./utils";

export interface KcetSubject {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  iconName: string;
  gradient: string;
  isVisible: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface KcetCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  iconName: string;
  isVisible: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface KcetMaterial {
  id: number;
  subject: string;
  category: string;
  title: string;
  description: string | null;
  chapter: string | null;
  year: number | null;
  pdfUrl: string;
  fileSizeKb: number | null;
  pageCount: number | null;
  downloadCount: number;
  isFeatured: boolean;
  isVisible: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface KcetContribution {
  id: number;
  subject: string;
  category: string;
  title: string;
  chapter: string | null;
  year: number | null;
  description: string | null;
  fileUrl: string;
  contributorName: string | null;
  contributorContact: string | null;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface KcetAdminStats {
  totalMaterials: number;
  totalSubjects: number;
  totalCategories: number;
  totalDownloads: number;
  pendingContributions: number;
  recentMaterials: KcetMaterial[];
}

export interface KcetDownloadAudit {
  id: number;
  materialId: number;
  materialTitle: string;
  subject: string;
  category: string;
  ipAddress: string | null;
  deviceInfo: string | null;
  downloadedAt: string;
}

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!res.ok) {
    try {
      const err = JSON.parse(text);
      throw new Error(err.error || err.detail || `HTTP ${res.status}`);
    } catch {
      throw new Error(`HTTP ${res.status}`);
    }
  }
  return JSON.parse(text) as T;
}

// ── Public KCET API ─────────────────────────────────────────────────────────

export async function fetchKcetStats(): Promise<{
  totalMaterials: number;
  totalSubjects: number;
  totalCategories: number;
  totalDownloads: number;
}> {
  const res = await fetch(buildApiUrl("/api/kcet/stats"));
  return parseJson(res);
}

export async function fetchKcetSubjects(): Promise<KcetSubject[]> {
  const res = await fetch(buildApiUrl("/api/kcet/subjects"));
  return parseJson(res);
}

export async function fetchKcetCategories(): Promise<KcetCategory[]> {
  const res = await fetch(buildApiUrl("/api/kcet/categories"));
  return parseJson(res);
}

export async function fetchKcetMaterials(filters?: {
  subject?: string;
  category?: string;
  chapter?: string;
  year?: string;
  search?: string;
  featured?: boolean;
}): Promise<KcetMaterial[]> {
  const params = new URLSearchParams();
  if (filters?.subject && filters.subject !== "all") params.set("subject", filters.subject);
  if (filters?.category && filters.category !== "all") params.set("category", filters.category);
  if (filters?.chapter && filters.chapter !== "all") params.set("chapter", filters.chapter);
  if (filters?.year && filters.year !== "all") params.set("year", filters.year);
  if (filters?.search?.trim()) params.set("search", filters.search.trim());
  if (filters?.featured) params.set("featured", "true");
  const qs = params.toString();
  const res = await fetch(buildApiUrl(`/api/kcet/materials${qs ? `?${qs}` : ""}`));
  return parseJson(res);
}

export async function fetchKcetMaterial(id: number): Promise<KcetMaterial> {
  const res = await fetch(buildApiUrl(`/api/kcet/materials/${id}`));
  return parseJson(res);
}

export function getKcetViewUrl(id: number): string {
  return buildApiUrl(`/api/kcet/materials/${id}/view`);
}

export function getKcetDownloadUrl(id: number): string {
  return buildApiUrl(`/api/kcet/materials/${id}/download`);
}

export async function submitKcetContribution(formData: FormData): Promise<KcetContribution> {
  const res = await fetch(buildApiUrl("/api/kcet/contribute"), {
    method: "POST",
    body: formData,
  });
  return parseJson(res);
}

// ── Admin KCET API (Uses Shared Admin Token) ────────────────────────────────

export async function fetchKcetAdminStats(): Promise<KcetAdminStats> {
  const res = await apiFetch("/api/admin/kcet/stats");
  return parseJson(res);
}

export async function fetchAdminKcetSubjects(): Promise<KcetSubject[]> {
  const res = await apiFetch("/api/admin/kcet/subjects");
  return parseJson(res);
}

export async function createKcetSubject(data: Partial<KcetSubject>): Promise<KcetSubject> {
  const res = await apiFetch("/api/admin/kcet/subjects", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return parseJson(res);
}

export async function updateKcetSubject(id: number, data: Partial<KcetSubject>): Promise<KcetSubject> {
  const res = await apiFetch(`/api/admin/kcet/subjects/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return parseJson(res);
}

export async function deleteKcetSubject(id: number): Promise<void> {
  const res = await apiFetch(`/api/admin/kcet/subjects/${id}`, { method: "DELETE" });
  await parseJson(res);
}

export async function reorderKcetSubjects(orderedIds: number[]): Promise<void> {
  const res = await apiFetch("/api/admin/kcet/subjects/reorder", {
    method: "POST",
    body: JSON.stringify({ orderedIds }),
  });
  await parseJson(res);
}

export async function fetchAdminKcetCategories(): Promise<KcetCategory[]> {
  const res = await apiFetch("/api/admin/kcet/categories");
  return parseJson(res);
}

export async function createKcetCategory(data: Partial<KcetCategory>): Promise<KcetCategory> {
  const res = await apiFetch("/api/admin/kcet/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return parseJson(res);
}

export async function updateKcetCategory(id: number, data: Partial<KcetCategory>): Promise<KcetCategory> {
  const res = await apiFetch(`/api/admin/kcet/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return parseJson(res);
}

export async function deleteKcetCategory(id: number): Promise<void> {
  const res = await apiFetch(`/api/admin/kcet/categories/${id}`, { method: "DELETE" });
  await parseJson(res);
}

export async function reorderKcetCategories(orderedIds: number[]): Promise<void> {
  const res = await apiFetch("/api/admin/kcet/categories/reorder", {
    method: "POST",
    body: JSON.stringify({ orderedIds }),
  });
  await parseJson(res);
}

export async function fetchAdminKcetMaterials(): Promise<KcetMaterial[]> {
  const res = await apiFetch("/api/admin/kcet/materials");
  return parseJson(res);
}

export async function createKcetMaterial(data: Partial<KcetMaterial>): Promise<KcetMaterial> {
  const res = await apiFetch("/api/admin/kcet/materials", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return parseJson(res);
}

export async function updateKcetMaterial(id: number, data: Partial<KcetMaterial>): Promise<KcetMaterial> {
  const res = await apiFetch(`/api/admin/kcet/materials/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return parseJson(res);
}

export async function deleteKcetMaterial(id: number): Promise<void> {
  const res = await apiFetch(`/api/admin/kcet/materials/${id}`, { method: "DELETE" });
  await parseJson(res);
}

export async function reorderKcetMaterials(orderedIds: number[]): Promise<void> {
  const res = await apiFetch("/api/admin/kcet/materials/reorder", {
    method: "POST",
    body: JSON.stringify({ orderedIds }),
  });
  await parseJson(res);
}

export async function uploadKcetPdf(file: File): Promise<{ key: string; sizeKb: number }> {
  const token = getAdminToken();
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(buildApiUrl("/api/admin/kcet/upload/pdf"), {
    method: "POST",
    headers: token ? { "x-admin-token": token } : {},
    body: fd,
  });
  return parseJson(res);
}

export async function fetchAdminKcetContributions(): Promise<KcetContribution[]> {
  const res = await apiFetch("/api/admin/kcet/contributions");
  return parseJson(res);
}

export async function moderateKcetContribution(
  id: number,
  action: "approve" | "reject" | "pending"
): Promise<{ contribution: KcetContribution; publishedMaterial?: KcetMaterial }> {
  const res = await apiFetch(`/api/admin/kcet/contributions/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ action }),
  });
  return parseJson(res);
}

export async function deleteKcetContribution(id: number): Promise<void> {
  const res = await apiFetch(`/api/admin/kcet/contributions/${id}`, { method: "DELETE" });
  await parseJson(res);
}

export async function fetchAdminKcetDownloads(): Promise<KcetDownloadAudit[]> {
  const res = await apiFetch("/api/admin/kcet/downloads");
  return parseJson(res);
}
