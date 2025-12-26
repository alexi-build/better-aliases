import { Action, ActionPanel, Clipboard, getPreferenceValues, Icon, List, open, showToast, Toast } from "@raycast/api";
import { useEffect, useMemo, useState } from "react";
import { formatAlias } from "./lib/formatAlias";
import { getAllAliasesConfig } from "./lib/getAllAliasesConfig";
import { createOpenAction, getOpenTarget } from "./lib/openAlias";
import type { BetterAliasesConfig, BetterAliasItem, ExpandAliasPreferences } from "./types";

function getRandomizedValue(value: string, separator?: string): string {
  if (!separator?.trim()) {
    return value;
  }

  const options = value.split(separator);
  if (options.length <= 1) {
    return value;
  }

  const randomIndex = Math.floor(Math.random() * options.length);
  return options[randomIndex].trim();
}

export default function Command() {
  const [aliases, setAliases] = useState<BetterAliasesConfig>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const preferences = getPreferenceValues<ExpandAliasPreferences>();

  useEffect(() => {
    try {
      const config = getAllAliasesConfig();
      setAliases(config);
    } catch (error) {
      console.error("Error loading aliases:", error);
      showToast({
        style: Toast.Style.Failure,
        title: "Error loading aliases",
        message: String(error),
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const filteredAliasEntries = useMemo(() => {
    const entries = Object.entries(aliases);

    if (!searchText.trim()) {
      return entries;
    }

    const snippetPrefix = preferences.snippetPrefix?.trim();
    let searchQuery = searchText;
    let isSnippetMode = false;

    // Check if search text starts with snippet prefix
    if (snippetPrefix && searchText.startsWith(snippetPrefix)) {
      isSnippetMode = true;
      searchQuery = searchText.slice(snippetPrefix.length);
    }

    // Only show aliases that start with the search query (after removing prefix if present)
    return entries
      .filter(([alias]) => {
        return alias.startsWith(searchQuery);
      })
      .map(
        ([alias, aliasItem]) =>
          [
            // Add prefix to displayed alias if in snippet mode
            isSnippetMode ? snippetPrefix + alias : alias,
            aliasItem,
          ] as [string, BetterAliasItem],
      );
  }, [aliases, searchText, preferences.snippetPrefix]);

  // Auto-trigger when only 1 filtered item is left
  useEffect(() => {
    if (filteredAliasEntries.length === 1 && searchText.trim()) {
      const [, aliasItem] = filteredAliasEntries[0];
      const snippetPrefix = preferences.snippetPrefix?.trim();
      const isSnippetMode = snippetPrefix && searchText.startsWith(snippetPrefix);

      if (isSnippetMode) {
        // Get randomized value if separator is configured
        const valueToInsert = getRandomizedValue(aliasItem.value, preferences.randomizedSnippetSeparator);

        // Insert text into frontmost application
        Clipboard.paste(valueToInsert)
          .then(() => {
            // Reset search text after successful paste
            setSearchText("");
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
        // Get the target to open with path expansion handled
        const targetToOpen = getOpenTarget(aliasItem.value);

        // Open the value using the default application
        open(targetToOpen)
          .then(() => {
            // Reset search text after successful open
            setSearchText("");
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
  }, [filteredAliasEntries, searchText, preferences.snippetPrefix]);

  const totalAliases = Object.keys(aliases).length;

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder={
        isLoading ? "" : `Search alias keys... (${totalAliases} ${totalAliases === 1 ? "alias" : "aliases"})`
      }
      onSearchTextChange={setSearchText}
      searchText={searchText}
    >
      {filteredAliasEntries.length === 0 && !isLoading ? (
        <List.EmptyView
          icon={searchText ? Icon.MagnifyingGlass : Icon.ExclamationMark}
          title={searchText ? "No Results Found" : "No Aliases Found"}
          description={
            searchText
              ? `No aliases found matching "${searchText}"`
              : "Make sure you have set the Leader Key config path in preferences"
          }
        />
      ) : (
        filteredAliasEntries.map(([alias, aliasItem]) => (
          <List.Item
            key={alias}
            title={formatAlias(alias, preferences.showFullAlias, searchText)}
            subtitle={aliasItem.label || aliasItem.value}
            accessories={
              preferences.hideAccessories
                ? undefined
                : [
                    {
                      text: aliasItem.value,
                    },
                  ]
            }
            actions={
              <ActionPanel>
                {(() => {
                  const snippetPrefix = preferences.snippetPrefix?.trim();
                  const isSnippetMode = snippetPrefix && alias.startsWith(snippetPrefix);
                  const originalAlias = isSnippetMode ? alias.slice(snippetPrefix.length) : alias;

                  if (isSnippetMode) {
                    const valueToInsert = getRandomizedValue(aliasItem.value, preferences.randomizedSnippetSeparator);
                    return (
                      <>
                        <Action.CopyToClipboard title="Copy Value" content={aliasItem.value} />
                        <Action.Paste
                          title="Insert Text"
                          content={valueToInsert}
                          shortcut={{ modifiers: ["cmd"], key: "v" }}
                        />
                        <Action.CopyToClipboard
                          title="Copy Alias"
                          content={originalAlias}
                          shortcut={{ modifiers: ["cmd"], key: "c" }}
                        />
                      </>
                    );
                  } else {
                    return (
                      <>
                        {createOpenAction(aliasItem.value, "Open", {
                          modifiers: ["cmd"],
                          key: "o",
                        } as const)}
                        <Action.CopyToClipboard
                          title="Copy Alias"
                          content={alias}
                          shortcut={{ modifiers: ["cmd"], key: "c" }}
                        />
                        <Action.CopyToClipboard
                          title="Copy Value"
                          content={aliasItem.value}
                          shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
                        />
                      </>
                    );
                  }
                })()}
              </ActionPanel>
            }
          />
        ))
      )}
    </List>
  );
}
