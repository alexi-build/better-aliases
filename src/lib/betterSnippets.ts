import { getPreferenceValues } from "@raycast/api";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { dirname } from "path";
import type { Preferences, BetterAliasesConfig, BetterAliasItem } from "../types";

export function getBetterSnippetsPath(): string {
  const preferences = getPreferenceValues<Preferences>();

  // Use preference path if set, otherwise default to ~/.config/better-aliases/better-snippets.json
  if (preferences.betterSnippetsConfigPath) {
    return preferences.betterSnippetsConfigPath;
  }

  const homeDir = process.env.HOME || process.env.USERPROFILE || "";
  return `${homeDir}/.config/better-aliases/better-snippets.json`;
}

export function loadBetterSnippets(): BetterAliasesConfig {
  const configPath = getBetterSnippetsPath();

  if (!existsSync(configPath)) {
    return {};
  }

  try {
    const configContent = readFileSync(configPath, "utf8");
    return JSON.parse(configContent) as BetterAliasesConfig;
  } catch (error) {
    console.error("Error reading Better Snippets config:", error);
    return {};
  }
}

export function saveBetterSnippets(config: BetterAliasesConfig): void {
  const configPath = getBetterSnippetsPath();

  // Ensure directory exists
  const dir = dirname(configPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  try {
    const configContent = JSON.stringify(config, null, 2);
    writeFileSync(configPath, configContent, "utf8");
  } catch (error) {
    console.error("Error saving Better Snippets config:", error);
    throw new Error(`Failed to save Better Snippets: ${error}`);
  }
}

export function addBetterSnippet(alias: string, item: BetterAliasItem): void {
  const config = loadBetterSnippets();

  if (config[alias]) {
    throw new Error(`Better Snippet "${alias}" already exists`);
  }

  config[alias] = item;
  saveBetterSnippets(config);
}

export function removeBetterSnippet(alias: string): void {
  const config = loadBetterSnippets();

  if (!config[alias]) {
    throw new Error(`Better Snippet "${alias}" not found`);
  }

  delete config[alias];
  saveBetterSnippets(config);
}

export function updateBetterSnippet(alias: string, item: BetterAliasItem): void {
  const config = loadBetterSnippets();

  if (!config[alias]) {
    throw new Error(`Better Snippet "${alias}" not found`);
  }

  config[alias] = item;
  saveBetterSnippets(config);
}
