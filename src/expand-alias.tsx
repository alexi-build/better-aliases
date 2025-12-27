import { Action, ActionPanel, getPreferenceValues, Icon, List } from "@raycast/api";
import { useMemo, useState } from "react";
import { useAliases, useAliasesWithFrecency, useAutoTriggerAlias } from "./hooks";
import { filterAliases } from "./lib/aliasFiltering";
import { formatAlias } from "./lib/formatAlias";
import { createOpenAction } from "./lib/openAlias";
import { getRandomizedValue } from "./lib/snippetUtils";
import type { BetterAliasItem, ExpandAliasPreferences } from "./types";

export default function Command() {
  const preferences = getPreferenceValues<ExpandAliasPreferences>();
  const { data: aliases = {}, isLoading } = useAliases();
  const [searchText, setSearchText] = useState("");

  const filterResult = useMemo(
    () =>
      filterAliases(aliases, {
        searchText,
        snippetPrefix: preferences.snippetPrefix,
      }),
    [aliases, searchText, preferences.snippetPrefix],
  );

  const { sortedEntries, visitItem } = useAliasesWithFrecency(filterResult.entries);

  useAutoTriggerAlias(sortedEntries, searchText, setSearchText, visitItem, preferences);

  const totalAliases = Object.keys(aliases).length;

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder={`Search alias keys... (${totalAliases} ${totalAliases === 1 ? "alias" : "aliases"})`}
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
  preferences: ExpandAliasPreferences;
  searchText: string;
  onSelect: () => void;
}) {
  const snippetPrefix = preferences.snippetPrefix?.trim();
  const isSnippetMode = snippetPrefix && alias.startsWith(snippetPrefix);
  const originalAlias = isSnippetMode ? alias.slice(snippetPrefix.length) : alias;

  return (
    <List.Item
      title={formatAlias(alias, preferences.showFullAlias, searchText)}
      subtitle={item.label || item.value}
      accessories={preferences.hideAccessories ? undefined : [{ text: item.value }]}
      actions={
        <ActionPanel>
          {isSnippetMode ? (
            <>
              <Action.Paste
                title="Insert Text"
                content={getRandomizedValue(item.value, preferences.randomizedSnippetSeparator)}
                onPaste={onSelect}
              />
              <Action.CopyToClipboard title="Copy Value" content={item.value} onCopy={onSelect} />
              <Action.CopyToClipboard
                title="Copy Alias"
                content={originalAlias}
                shortcut={{ modifiers: ["cmd"], key: "c" }}
                onCopy={onSelect}
              />
            </>
          ) : (
            <>
              {createOpenAction(item.value, "Open")}
              <Action.CopyToClipboard
                title="Copy Alias"
                content={alias}
                shortcut={{ modifiers: ["cmd"], key: "c" }}
                onCopy={onSelect}
              />
              <Action.CopyToClipboard
                title="Copy Value"
                content={item.value}
                shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
                onCopy={onSelect}
              />
            </>
          )}
        </ActionPanel>
      }
    />
  );
}
