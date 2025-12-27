import { getPreferenceValues, Icon, List } from "@raycast/api";
import { useMemo, useState } from "react";
import { AliasListItem } from "./components/AliasListItem";
import { useAliases, useAliasesWithFrecency } from "./hooks";
import { fuzzySearchAliases } from "./lib/fuzzySearch";
import type { Preferences } from "./types";

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
            preferences={{ ...preferences, showFullAlias: false }}
            searchText={searchText}
            onSelect={() => visitItem([alias, aliasItem])}
          />
        ))
      )}
    </List>
  );
}
