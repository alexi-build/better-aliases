import Fuse, { type IFuseOptions } from "fuse.js";
import type { BetterAliasesConfig, BetterAliasItem } from "../types";
import type { AliasEntry } from "./aliasFiltering";

interface SearchableItem {
  alias: string;
  aliasItem: BetterAliasItem;
}

const FUSE_OPTIONS: IFuseOptions<SearchableItem> = {
  keys: [
    { name: "alias", weight: 0.4 },
    { name: "aliasItem.label", weight: 0.3 },
    { name: "aliasItem.value", weight: 0.3 },
  ],
  threshold: 0.4,
  ignoreLocation: true,
  includeScore: true,
};

let fuseCache: {
  aliases: BetterAliasesConfig;
  fuse: Fuse<SearchableItem>;
} | null = null;

export function fuzzySearchAliases(aliases: BetterAliasesConfig, searchText: string): AliasEntry[] {
  const entries = Object.entries(aliases);
  if (!searchText.trim()) return entries;

  if (!fuseCache || fuseCache.aliases !== aliases) {
    const searchableItems: SearchableItem[] = entries.map(([alias, aliasItem]) => ({
      alias,
      aliasItem,
    }));
    fuseCache = { aliases, fuse: new Fuse(searchableItems, FUSE_OPTIONS) };
  }

  return fuseCache.fuse.search(searchText).map((r) => [r.item.alias, r.item.aliasItem]);
}

export function clearFuseCache(): void {
  fuseCache = null;
}
