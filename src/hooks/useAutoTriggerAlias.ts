import { Clipboard, closeMainWindow, open } from "@raycast/api";
import { showFailureToast } from "@raycast/utils";
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
            closeMainWindow();
            setSearchText("");
            visitItem(entry);
          })
          .catch((error) => {
            showFailureToast(error, { title: "Error pasting value" });
          });
      } else {
        const targetToOpen = getOpenTarget(aliasItem.value);
        open(targetToOpen)
          .then(() => {
            // closeMainWindow should not be called here, it will close the entire application
            setSearchText("");
            visitItem(entry);
          })
          .catch((error) => {
            showFailureToast(error, { title: "Error opening value" });
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
