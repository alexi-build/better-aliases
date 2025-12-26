import { Action, ActionPanel, getPreferenceValues, Icon, List, showToast, Toast } from "@raycast/api";
import Fuse from "fuse.js";
import { useEffect, useMemo, useState } from "react";
import { formatAlias } from "./lib/formatAlias";
import { getAllAliasesConfig } from "./lib/getAllAliasesConfig";
import { createOpenAction } from "./lib/openAlias";
import type { BetterAliasesConfig, Preferences } from "./types";

export default function Command() {
  const [aliases, setAliases] = useState<BetterAliasesConfig>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const preferences = getPreferenceValues<Preferences>();

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

    // Create searchable items for fuzzy search
    const searchableItems = entries.map(([alias, aliasItem]) => ({
      alias,
      aliasItem,
      searchContent: `${alias} ${aliasItem.label || ""} ${aliasItem.value}`.toLowerCase(),
    }));

    // Configure Fuse.js for fuzzy search
    const fuse = new Fuse(searchableItems, {
      keys: [
        { name: "alias", weight: 0.4 },
        { name: "aliasItem.label", weight: 0.3 },
        { name: "aliasItem.value", weight: 0.3 },
      ],
      threshold: 0.4, // Lower = more strict, higher = more fuzzy
      ignoreLocation: true,
      includeScore: true,
    });

    const results = fuse.search(searchText);
    return results.map(
      (result) => [result.item.alias, result.item.aliasItem] as [string, typeof result.item.aliasItem],
    );
  }, [aliases, searchText]);

  const totalAliases = Object.keys(aliases).length;

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder={
        isLoading ? "" : `Search aliases and values... (${totalAliases} ${totalAliases === 1 ? "alias" : "aliases"})`
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
            // icon={
            //   aliasItem.value.startsWith("raycast://") ? Icon.RaycastLogoNeg : aliasItem.value.startsWith("http") ? Icon.Globe : Icon.Finder
            // }
            title={formatAlias(alias, searchText)}
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
                {createOpenAction(aliasItem.value, "Open", {
                  modifiers: ["cmd"],
                  key: "o",
                } as const)}
              </ActionPanel>
            }
          />
        ))
      )}
    </List>
  );
}
