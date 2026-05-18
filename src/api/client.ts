import { ENV } from "@/config/env";

export type ApiListResponse<T> = T[] | { content?: T[] };

export function toApiList<T>(data: ApiListResponse<T>): T[] {
  return Array.isArray(data) ? data : data.content ?? [];
}

export async function apiFetch<T = unknown>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${ENV.API_URL}${path}`, init);

  if (!response.ok) {
    throw new Error("API error");
  }

  return response.json() as Promise<T>;
}
