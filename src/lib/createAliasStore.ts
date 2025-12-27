import { getPreferenceValues } from "@raycast/api";
import { homedir } from "os";
import type { BetterAliasesConfig, BetterAliasItem, Preferences } from "../types";
import { createConfigManager } from "./configManager";
import { isBetterAliasesConfig } from "./typeGuards";

export function createAliasStore(configKey: keyof Preferences, defaultFilename: string) {
  const getPath = () => {
    const preferences = getPreferenceValues<Preferences>();
    const prefValue = preferences[configKey];
    if (typeof prefValue === "string" && prefValue.trim()) {
      return prefValue;
    }

    return `${homedir()}/.config/better-aliases/${defaultFilename}`;
  };

  const manager = createConfigManager<BetterAliasesConfig>({
    getConfigPath: getPath,
    defaultValue: {},
    validate: isBetterAliasesConfig,
  });

  return {
    load: manager.load,
    save: manager.save,
    getPath: manager.getPath,
    add: (alias: string, item: BetterAliasItem) => {
      const config = manager.load();
      if (config[alias]) throw new Error(`"${alias}" already exists`);
      config[alias] = item;
      manager.save(config);
    },
    delete: (alias: string) => {
      const config = manager.load();
      if (!config[alias]) throw new Error(`"${alias}" does not exist`);
      delete config[alias];
      manager.save(config);
    },
    update: (alias: string, item: BetterAliasItem) => {
      const config = manager.load();
      config[alias] = item;
      manager.save(config);
    },
  };
}
