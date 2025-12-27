import { Clipboard, open, showToast, Toast } from "@raycast/api";
import { useEffect } from "react";
import { getOpenTarget } from "../lib/openAlias";
import { getRandomizedValue } from "../lib/snippetUtils";
import type { BetterAliasItem, ExpandAliasPreferences } from "../types";

export function useAutoTriggerAlias(
  sortedEntries: [string, BetterAliasItem][],
  searchText: string,
  setSearchText: (text: string) => void,
  visitItem: (entry: [string, BetterAliasItem]) => void,
  preferences: ExpandAliasPreferences,
) {
  useEffect(() => {
    if (sortedEntries.length === 1 && searchText.trim()) {
      const entry = sortedEntries[0];
      const [, aliasItem] = entry;
      const snippetPrefix = preferences.snippetPrefix?.trim();
      const isSnippetMode = !!(snippetPrefix && searchText.startsWith(snippetPrefix));

      if (isSnippetMode) {
        const valueToInsert = getRandomizedValue(aliasItem.value, preferences.randomizedSnippetSeparator);
        Clipboard.paste(valueToInsert)
          .then(() => {
            setSearchText("");
            visitItem(entry);
          })
          .catch((error) => {
            console.error("Error pasting value:", error);
            showToast({
              style: Toast.Style.Failure,
              title: "Error pasting value",
              message: String(error),
            });
          });
      } else {
        const targetToOpen = getOpenTarget(aliasItem.value);
        open(targetToOpen)
          .then(() => {
            setSearchText("");
            visitItem(entry);
          })
          .catch((error) => {
            console.error("Error opening value:", error);
            showToast({
              style: Toast.Style.Failure,
              title: "Error opening value",
              message: String(error),
            });
          });
      }
    }
  }, [
    sortedEntries,
    searchText,
    preferences.snippetPrefix,
    preferences.randomizedSnippetSeparator,
    visitItem,
    setSearchText,
  ]);
}
