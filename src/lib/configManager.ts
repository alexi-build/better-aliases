import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname } from "path";

export interface ConfigManager<T> {
  load: () => T;
  save: (data: T) => void;
  getPath: () => string;
}

export interface ConfigManagerOptions<T> {
  getConfigPath: () => string;
  defaultValue: T;
  validate?: (value: unknown) => value is T;
}

export function createConfigManager<T>(options: ConfigManagerOptions<T>): ConfigManager<T> {
  const { getConfigPath, defaultValue, validate } = options;

  return {
    getPath: getConfigPath,

    load(): T {
      const configPath = getConfigPath();
      if (!existsSync(configPath)) return defaultValue;

      const content = readFileSync(configPath, "utf8");
      const parsed = JSON.parse(content);

      if (validate && !validate(parsed)) {
        throw new Error(`Invalid config format at ${configPath}`);
      }

      return parsed as T;
    },

    save(data: T): void {
      const configPath = getConfigPath();
      const dir = dirname(configPath);

      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }

      writeFileSync(configPath, JSON.stringify(data, null, 2), "utf8");
    },
  };
}
