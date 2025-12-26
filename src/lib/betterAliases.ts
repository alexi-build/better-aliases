import { getPreferenceValues } from "@raycast/api";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { dirname } from "path";
import type { Preferences, BetterAliasesConfig, BetterAliasItem } from "../types";

export function getBetterAliasesPath(): string {
  const preferences = getPreferenceValues<Preferences>();

  // Use preference path if set, otherwise default to ~/.config/better-aliases/better-aliases.json
  if (preferences.betterAliasesConfigPath) {
    return preferences.betterAliasesConfigPath;
  }

  const homeDir = process.env.HOME || process.env.USERPROFILE || "";
  return `${homeDir}/.config/better-aliases/better-aliases.json`;
}

export function loadBetterAliases(): BetterAliasesConfig {
  const configPath = getBetterAliasesPath();

  if (!existsSync(configPath)) {
    return {};
  }

  try {
    const configContent = readFileSync(configPath, "utf8");
    return JSON.parse(configContent) as BetterAliasesConfig;
  } catch (error) {
    console.error("Error reading Better Aliases config:", error);
    return {};
  }
}

export function saveBetterAliases(config: BetterAliasesConfig): void {
  const configPath = getBetterAliasesPath();

  // Ensure directory exists
  const dir = dirname(configPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  try {
    const configContent = JSON.stringify(config, null, 2);
    writeFileSync(configPath, configContent, "utf8");
  } catch (error) {
    console.error("Error saving Better Aliases config:", error);
    throw new Error(`Failed to save Better Aliases: ${error}`);
  }
}

export function addBetterAlias(alias: string, item: BetterAliasItem): void {
  const config = loadBetterAliases();

  if (config[alias]) {
    throw new Error(`Better Alias "${alias}" already exists`);
  }

  config[alias] = item;
  saveBetterAliases(config);
}

export function removeBetterAlias(alias: string): void {
  const config = loadBetterAliases();

  if (!config[alias]) {
    throw new Error(`Better Alias "${alias}" not found`);
  }

  delete config[alias];
  saveBetterAliases(config);
}

export function updateBetterAlias(alias: string, item: BetterAliasItem): void {
  const config = loadBetterAliases();

  if (!config[alias]) {
    throw new Error(`Better Alias "${alias}" not found`);
  }

  config[alias] = item;
  saveBetterAliases(config);
}
