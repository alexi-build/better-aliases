import { Action, ActionPanel, List } from "@raycast/api";
import { KEYBOARD_SHORTCUTS } from "../lib/constants";
import { formatAlias } from "../lib/formatAlias";
import { createOpenAction } from "../lib/openAlias";
import { getRandomizedValue } from "../lib/snippetUtils";
import type { BetterAliasItem, Preferences } from "../types";

interface AliasListItemProps {
  alias: string;
  item: BetterAliasItem;
  preferences: Preferences;
  searchText: string;
  onSelect: () => void;
}

export function AliasListItem({ alias, item, preferences, searchText, onSelect }: AliasListItemProps) {
  const snippetPrefix = preferences.snippetPrefix?.trim();
  const isSnippetTriggered = snippetPrefix && alias.startsWith(snippetPrefix);
  const isSnippetOnly = item.snippetOnly || isSnippetTriggered;

  const displayAlias = formatAlias(alias, !!preferences.showFullAlias, searchText);
  const originalAlias = isSnippetTriggered ? alias.slice(snippetPrefix.length) : alias;

  return (
    <List.Item
      title={displayAlias}
      subtitle={item.label || item.value}
      accessories={preferences.hideAccessories ? undefined : [{ text: item.value }]}
      actions={
        <ActionPanel>
          {isSnippetOnly ? (
            <>
              <Action.Paste
                title="Insert Text"
                content={getRandomizedValue(item.value, preferences.randomizedSnippetSeparator)}
                onPaste={onSelect}
              />
              <Action.CopyToClipboard
                title="Copy Value"
                content={item.value}
                onCopy={onSelect}
                shortcut={KEYBOARD_SHORTCUTS.COPY_VALUE}
              />
              <Action.CopyToClipboard
                title="Copy Alias"
                content={originalAlias}
                shortcut={KEYBOARD_SHORTCUTS.COPY_ALIAS}
                onCopy={onSelect}
              />
            </>
          ) : (
            <>
              {createOpenAction(item.value, "Open", KEYBOARD_SHORTCUTS.OPEN)}
              <Action.CopyToClipboard
                title="Copy Alias"
                content={alias}
                shortcut={KEYBOARD_SHORTCUTS.COPY_ALIAS}
                onCopy={onSelect}
              />
              <Action.CopyToClipboard
                title="Copy Value"
                content={item.value}
                shortcut={KEYBOARD_SHORTCUTS.COPY_VALUE}
                onCopy={onSelect}
              />
            </>
          )}
        </ActionPanel>
      }
    />
  );
}
