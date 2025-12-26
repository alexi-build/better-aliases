import { getPreferenceValues } from "@raycast/api";
import type { BetterAliasesConfig, BetterAliasItem, Preferences } from "../types";
import { createConfigManager } from "./configManager";
import { isBetterAliasesConfig } from "./typeGuards";

export function getBetterSnippetsPath(): string {
  const preferences = getPreferenceValues<Preferences>();
  if (preferences.betterSnippetsConfigPath) return preferences.betterSnippetsConfigPath;

  const homeDir = process.env.HOME || process.env.USERPROFILE || "";
  return `${homeDir}/.config/better-aliases/better-snippets.json`;
}

const snippetManager = createConfigManager<BetterAliasesConfig>({
  getConfigPath: getBetterSnippetsPath,
  defaultValue: {},
  validate: isBetterAliasesConfig,
});

export const loadBetterSnippets = snippetManager.load;
export const saveBetterSnippets = snippetManager.save;

export function addBetterSnippet(alias: string, item: BetterAliasItem): void {
  const config = loadBetterSnippets();
  if (config[alias]) throw new Error(`Better Snippet "${alias}" already exists`);

  config[alias] = item;
  saveBetterSnippets(config);
}

export function deleteBetterSnippet(alias: string): void {
  const config = loadBetterSnippets();
  if (!config[alias]) throw new Error(`Better Snippet "${alias}" does not exist`);

  delete config[alias];
  saveBetterSnippets(config);
}

export function updateBetterSnippet(alias: string, item: BetterAliasItem): void {
  const config = loadBetterSnippets();
  config[alias] = item;
  saveBetterSnippets(config);
}
