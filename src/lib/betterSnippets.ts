import { createAliasStore } from "./createAliasStore";

const store = createAliasStore("betterSnippetsConfigPath", "better-snippets.json");

export const getBetterSnippetsPath = store.getPath;
export const loadBetterSnippets = store.load;
export const saveBetterSnippets = store.save;
export const addBetterSnippet = store.add;
export const deleteBetterSnippet = store.delete;
export const updateBetterSnippet = store.update;
