import { createAliasStore } from "./createAliasStore";

const store = createAliasStore("betterAliasesConfigPath", "better-aliases.json");

export const getBetterAliasesPath = store.getPath;
export const loadBetterAliases = store.load;
export const saveBetterAliases = store.save;
export const addBetterAlias = store.add;
export const deleteBetterAlias = store.delete;
export const updateBetterAlias = store.update;
