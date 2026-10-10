import { apiFetch } from "./api";

export interface AdminStatsResponse {
  totalRevenuePaise: number;
  totalOrders: number;
  totalCards: number;
  totalSections: number;
  totalCustomers: number;
  totalDownloads?: number;
  recentOrders: Array<{
    id: string;
    cardId: number;
    cardTitle: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string | null;
    amountPaise: number;
    status: string;
    razorpayOrderId: string;
    paidAt: string | null;
    createdAt: string;
  }>;
}

export interface AdminCustomer {
  id: number;
  fullName: string;
  phone: string;
  email: string | null;
  createdAt: string;
  paidOrdersCount: number;
  totalSpentPaise: number;
}

export interface AdminCustomersResponse {
  customers: AdminCustomer[];
  total: number;
  page: number;
  limit: number;
}

export interface AdminDownload {
  id: number;
  orderId: string;
  cardId: number;
  cardTitle: string;
  customerName: string;
  customerPhone: string;
  downloadedAt: string;
  ipAddress: string | null;
  deviceInfo: string | null;
}

export interface AdminDownloadsResponse {
  downloads: AdminDownload[];
  total: number;
  page: number;
  limit: number;
}

export async function fetchAdminStats(): Promise<AdminStatsResponse> {
  const res = await apiFetch("/api/admin/stats");
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.detail || errorBody.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function fetchAdminCustomers(page = 1, search = ""): Promise<AdminCustomersResponse> {
  const params = new URLSearchParams({ page: String(page), limit: "20" });
  if (search.trim()) params.append("search", search.trim());
  const res = await apiFetch(`/api/admin/customers?${params.toString()}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function fetchAdminDownloads(page = 1, search = ""): Promise<AdminDownloadsResponse> {
  const params = new URLSearchParams({ page: String(page), limit: "20" });
  if (search.trim()) params.append("search", search.trim());
  const res = await apiFetch(`/api/admin/downloads?${params.toString()}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function updateCardOfficialLink(id: number, officialSourceUrl: string, isOfficial?: boolean) {
  const payload: any = { officialSourceUrl };
  if (typeof isOfficial === "boolean") {
    payload.isOfficial = isOfficial;
  }
  const res = await apiFetch(`/api/admin/cards/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Failed to update resource link (HTTP ${res.status})`);
  }
  return res.json();
}

export async function updateSectionOfficialLink(id: number, officialSourceUrl: string) {
  const res = await apiFetch(`/api/admin/sections/${id}`, {
    method: "PUT",
    body: JSON.stringify({ officialSourceUrl }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Failed to update section link (HTTP ${res.status})`);
  }
  return res.json();
}
