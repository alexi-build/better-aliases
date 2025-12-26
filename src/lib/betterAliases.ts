import { getPreferenceValues } from "@raycast/api";
import type { BetterAliasesConfig, BetterAliasItem, Preferences } from "../types";
import { createConfigManager } from "./configManager";
import { isBetterAliasesConfig } from "./typeGuards";

export function getBetterAliasesPath(): string {
  const preferences = getPreferenceValues<Preferences>();
  if (preferences.betterAliasesConfigPath) return preferences.betterAliasesConfigPath;

  const homeDir = process.env.HOME || process.env.USERPROFILE || "";
  return `${homeDir}/.config/better-aliases/better-aliases.json`;
}

const aliasManager = createConfigManager<BetterAliasesConfig>({
  getConfigPath: getBetterAliasesPath,
  defaultValue: {},
  validate: isBetterAliasesConfig,
});

export const loadBetterAliases = aliasManager.load;
export const saveBetterAliases = aliasManager.save;

export function addBetterAlias(alias: string, item: BetterAliasItem): void {
  const config = loadBetterAliases();
  if (config[alias]) throw new Error(`Better Alias "${alias}" already exists`);

  config[alias] = item;
  saveBetterAliases(config);
}

export function deleteBetterAlias(alias: string): void {
  const config = loadBetterAliases();
  if (!config[alias]) throw new Error(`Better Alias "${alias}" does not exist`);

  delete config[alias];
  saveBetterAliases(config);
}

export function updateBetterAlias(alias: string, item: BetterAliasItem): void {
  const config = loadBetterAliases();
  config[alias] = item;
  saveBetterAliases(config);
}
