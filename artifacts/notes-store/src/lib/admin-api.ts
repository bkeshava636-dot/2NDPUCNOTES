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

async function safeParseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!res.ok) {
    if (text.trim().startsWith("<")) {
      throw new Error(`Server returned HTTP ${res.status} HTML error page. Check backend API URL configuration.`);
    }
    try {
      const errObj = JSON.parse(text);
      throw new Error(errObj.detail || errObj.error || `HTTP ${res.status}`);
    } catch {
      throw new Error(`Server request failed (HTTP ${res.status})`);
    }
  }

  if (text.trim().startsWith("<")) {
    throw new Error(`Received HTML instead of JSON. Ensure backend server is reachable at configured API URL.`);
  }

  try {
    return JSON.parse(text) as T;
  } catch (err: any) {
    throw new Error(`Invalid JSON response: ${err.message || String(err)}`);
  }
}

export async function fetchAdminStats(): Promise<AdminStatsResponse> {
  const res = await apiFetch("/api/admin/stats");
  return safeParseJson<AdminStatsResponse>(res);
}

export async function fetchAdminCustomers(page = 1, search = ""): Promise<AdminCustomersResponse> {
  const params = new URLSearchParams({ page: String(page), limit: "20" });
  if (search.trim()) params.append("search", search.trim());
  const res = await apiFetch(`/api/admin/customers?${params.toString()}`);
  return safeParseJson<AdminCustomersResponse>(res);
}

export async function fetchAdminDownloads(page = 1, search = ""): Promise<AdminDownloadsResponse> {
  const params = new URLSearchParams({ page: String(page), limit: "20" });
  if (search.trim()) params.append("search", search.trim());
  const res = await apiFetch(`/api/admin/downloads?${params.toString()}`);
  return safeParseJson<AdminDownloadsResponse>(res);
}

export async function updateCardOfficialLink(id: number, officialSourceUrl: string, isOfficial?: boolean) {
  const payload: any = { officialSourceUrl };
  if (typeof isOfficial === "boolean") {
    payload.isOfficial = isOfficial;
  }
  const res = await apiFetch(`/api/admin/cards/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return safeParseJson<any>(res);
}

export async function updateSectionOfficialLink(id: number, officialSourceUrl: string) {
  const res = await apiFetch(`/api/admin/sections/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ officialSourceUrl }),
  });
  return safeParseJson<any>(res);
}
