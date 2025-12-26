import { getLeaderKeyAliases } from "./leaderKeyAliases";
import { loadBetterAliases } from "./betterAliases";
import { loadBetterSnippets } from "./betterSnippets";
import type { BetterAliasesConfig } from "../types";

export function getAllAliasesConfig(): BetterAliasesConfig {
  const leaderKeyAliases = getLeaderKeyAliases();
  const betterAliases = loadBetterAliases();
  const betterSnippets = loadBetterSnippets();

  // Better Aliases and Better Snippets override Leader Key aliases if same name
  // Better Snippets override Better Aliases if same name
  return { ...leaderKeyAliases, ...betterAliases, ...betterSnippets };
}
