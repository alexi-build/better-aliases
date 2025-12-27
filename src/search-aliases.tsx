import { Action, ActionPanel, getPreferenceValues, Icon, List } from "@raycast/api";
import { useMemo, useState } from "react";
import { useAliases, useAliasesWithFrecency } from "./hooks";
import { formatAlias } from "./lib/formatAlias";
import { fuzzySearchAliases } from "./lib/fuzzySearch";
import { createOpenAction } from "./lib/openAlias";
import type { BetterAliasItem, Preferences } from "./types";

export default function Command() {
  const { data: aliases = {}, isLoading } = useAliases();
  const [searchText, setSearchText] = useState("");
  const preferences = getPreferenceValues<Preferences>();

  const searchResults = useMemo(() => fuzzySearchAliases(aliases, searchText), [aliases, searchText]);

  const { sortedEntries, visitItem } = useAliasesWithFrecency(searchResults);

  const totalAliases = Object.keys(aliases).length;

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder={`Search aliases and values... (${totalAliases} ${totalAliases === 1 ? "alias" : "aliases"})`}
      onSearchTextChange={setSearchText}
      searchText={searchText}
    >
      {sortedEntries.length === 0 ? (
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
        sortedEntries.map(([alias, aliasItem]) => (
          <AliasListItem
            key={alias}
            alias={alias}
            item={aliasItem}
            preferences={preferences}
            searchText={searchText}
            onSelect={() => visitItem([alias, aliasItem])}
          />
        ))
      )}
    </List>
  );
}

function AliasListItem({
  alias,
  item,
  preferences,
  searchText,
  onSelect,
}: {
  alias: string;
  item: BetterAliasItem;
  preferences: Preferences;
  searchText: string;
  onSelect: () => void;
}) {
  return (
    <List.Item
      title={formatAlias(alias, false, searchText)}
      subtitle={item.label || item.value}
      accessories={preferences.hideAccessories ? undefined : [{ text: item.value }]}
      actions={
        <ActionPanel>
          <Action.CopyToClipboard title="Copy Alias" content={alias} onCopy={onSelect} />
          <Action.CopyToClipboard
            title="Copy Value"
            content={item.value}
            shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
            onCopy={onSelect}
          />
          {createOpenAction(item.value, "Open", {
            modifiers: ["cmd"],
            key: "o",
          } as const)}
        </ActionPanel>
      }
    />
  );
}
