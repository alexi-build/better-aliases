import type { BetterAliasesConfig, BetterAliasItem } from "../types";
import type { LeaderKeyAction, LeaderKeyConfig } from "../types/leader-key";

export function isBetterAliasItem(value: unknown): value is BetterAliasItem {
  return (
    typeof value === "object" &&
    value !== null &&
    "value" in value &&
    typeof (value as BetterAliasItem).value === "string"
  );
}

export function isBetterAliasesConfig(value: unknown): value is BetterAliasesConfig {
  if (typeof value !== "object" || value === null) return false;

  return Object.values(value).every(isBetterAliasItem);
}

export function isLeaderKeyAction(value: unknown): value is LeaderKeyAction {
  return typeof value === "object" && value !== null && "key" in value && "type" in value;
}

export function isGroupAction(action: LeaderKeyAction): action is LeaderKeyAction & { actions: LeaderKeyAction[] } {
  return action.type === "group" && Array.isArray(action.actions);
}

export function isLeaderKeyConfig(value: unknown): value is LeaderKeyConfig {
  if (typeof value !== "object" || value === null) return false;
  const config = value as LeaderKeyConfig;
  if (!("actions" in config) || !Array.isArray(config.actions)) return false;

  return config.actions.every(isLeaderKeyAction);
}
