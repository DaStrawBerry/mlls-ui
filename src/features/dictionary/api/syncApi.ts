import { apiFetch } from "@/api/client";

export type DictionarySyncResult = {
  syncedAt?: string;
  message?: string;
};

export async function syncDictionary(): Promise<DictionarySyncResult> {
  return apiFetch<DictionarySyncResult>("/api/dictionary/sync", {
    method: "POST",
  });
}
