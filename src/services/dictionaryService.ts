/**
 * dictionaryService.ts
 * Calls the free Dictionary API (https://api.dictionaryapi.dev).
 * No API key required — it's completely free and public.
 *
 * Full implementation in Phase 5.
 * Stub exported so TypeScript compiles.
 */

import axios from 'axios';
import { DictionaryEntry } from '../types';

const BASE_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en';

// We share one axios instance so interceptors and base config are centralised
export const dictionaryClient = axios.create({ baseURL: BASE_URL, timeout: 10_000 });

/**
 * Look up a word.
 * Returns an array because a word can have multiple entries (e.g. "bass" — fish vs. music).
 * Throws if the word is not found (API returns 404).
 */
export async function lookupWord(word: string): Promise<DictionaryEntry[]> {
  const { data } = await dictionaryClient.get<DictionaryEntry[]>(`/${encodeURIComponent(word.trim())}`);
  return data;
}
