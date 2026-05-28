import { ENV } from "@/config/env";

export type PageResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
};

export type ApiListResponse<T> = T[] | { content?: T[] };

export function toApiList<T>(data: ApiListResponse<T>): T[] {
  return Array.isArray(data) ? data : (data.content ?? []);
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${ENV.API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    let message = "API error";

    try {
      const errorData = await response.json();
      message = errorData.message ?? message;
    } catch {}

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

type EmptyToNull<T extends object> = {
  [K in keyof T]: T[K] extends "" | undefined ? null : T[K] | null;
};

export function emptyToNull<T extends object>(obj?: T): EmptyToNull<T> | undefined {
  if (!obj) return undefined;

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      value === "" || value === undefined ? null : value,
    ]),
  ) as EmptyToNull<T>;
}