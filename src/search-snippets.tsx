import { getPreferenceValues, Icon, List } from "@raycast/api";
import { useMemo, useState } from "react";
import { AliasListItem } from "./components/AliasListItem";
import { useSnippets, useAliasesWithFrecency } from "./hooks";
import { fuzzySearchAliases } from "./lib/fuzzySearch";
import type { Preferences } from "./types";

export default function Command() {
  const { data: snippets = {}, isLoading } = useSnippets();
  const [searchText, setSearchText] = useState("");
  const preferences = getPreferenceValues<Preferences>();

  const searchResults = useMemo(() => fuzzySearchAliases(snippets, searchText), [snippets, searchText]);

  const { sortedEntries, visitItem } = useAliasesWithFrecency(searchResults);

  const totalSnippets = Object.keys(snippets).length;

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder={`Search snippets and values... (${totalSnippets} ${totalSnippets === 1 ? "snippet" : "snippets"})`}
      onSearchTextChange={setSearchText}
      searchText={searchText}
    >
      {sortedEntries.length === 0 ? (
        <List.EmptyView
          icon={searchText ? Icon.MagnifyingGlass : Icon.ExclamationMark}
          title={searchText ? "No Results Found" : "No Snippets Found"}
          description={
            searchText
              ? `No snippets found matching "${searchText}"`
              : "Make sure you have added some snippets in Create Snippet command"
          }
        />
      ) : (
        sortedEntries.map(([alias, snippetItem]) => (
          <AliasListItem
            key={alias}
            alias={alias}
            item={snippetItem}
            preferences={{ ...preferences, showFullAlias: true }}
            searchText={searchText}
            onSelect={() => visitItem([alias, snippetItem])}
          />
        ))
      )}
    </List>
  );
}
