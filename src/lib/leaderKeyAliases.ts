import { getPreferenceValues } from "@raycast/api";
import { readFileSync, existsSync } from "fs";
import type { Preferences, LeaderKeyConfig, LeaderKeyAction, BetterAliasesConfig } from "../types";

export function getLeaderKeyConfig(): LeaderKeyConfig | null {
  const preferences = getPreferenceValues<Preferences>();

  if (!preferences.leaderKeyConfigPath) {
    return null;
  }

  if (!existsSync(preferences.leaderKeyConfigPath)) {
    console.warn(`Leader Key config file not found at: ${preferences.leaderKeyConfigPath}`);
    return null;
  }

  try {
    const configContent = readFileSync(preferences.leaderKeyConfigPath, "utf8");
    return JSON.parse(configContent) as LeaderKeyConfig;
  } catch (error) {
    console.error("Error reading Leader Key config:", error);
    return null;
  }
}

function traverseActions(actions: LeaderKeyAction[], currentPath: string = ""): BetterAliasesConfig {
  const config: BetterAliasesConfig = {};

  for (const action of actions) {
    const fullPath = currentPath + action.key;

    if (action.type === "group" && action.actions) {
      // Recursively traverse nested actions
      const nestedConfig = traverseActions(action.actions, fullPath);
      Object.assign(config, nestedConfig);
    } else if (action.value) {
      // Add leaf action to config with value and label
      config[fullPath] = {
        value: action.value,
        label: action.label,
      };
    }
  }

  return config;
}

export function convertLeaderKeyConfigToAliases(leaderKeyConfig: LeaderKeyConfig): BetterAliasesConfig {
  return traverseActions(leaderKeyConfig.actions);
}

export function getLeaderKeyAliases(): BetterAliasesConfig {
  const leaderKeyConfig = getLeaderKeyConfig();

  if (!leaderKeyConfig) {
    return {};
  }

  return convertLeaderKeyConfigToAliases(leaderKeyConfig);
}
