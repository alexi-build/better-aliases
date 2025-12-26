import type { BetterAliasesConfig, BetterAliasItem } from "../types";

export type AliasEntry = [string, BetterAliasItem];

export interface FilterOptions {
  searchText: string;
  snippetPrefix?: string;
}

export interface FilterResult {
  entries: AliasEntry[];
  isSnippetMode: boolean;
  searchQuery: string;
}

export function filterAliases(aliases: BetterAliasesConfig, options: FilterOptions): FilterResult {
  const { searchText, snippetPrefix } = options;
  const entries = Object.entries(aliases);

  if (!searchText.trim()) {
    return { entries, isSnippetMode: false, searchQuery: "" };
  }

  const trimmedPrefix = snippetPrefix?.trim();
  const isSnippetMode = Boolean(trimmedPrefix && searchText.startsWith(trimmedPrefix));
  const searchQuery = isSnippetMode ? searchText.slice(trimmedPrefix?.length) : searchText;

  const filtered = entries.filter(([alias]) => alias.startsWith(searchQuery));

  const mapped: AliasEntry[] = isSnippetMode
    ? filtered.map(([alias, item]) => [trimmedPrefix + alias, item])
    : filtered;

  return { entries: mapped, isSnippetMode, searchQuery };
}
