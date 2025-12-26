import { Icon, List } from "@raycast/api";
import { useState } from "react";
import { getLeaderKeyConfig } from "./lib/leaderKeyAliases";
import type { LeaderKeyAction } from "./types/leader-key";

export default function Command() {
  const [searchText, setSearchText] = useState("");
  const leaderKeyConfig = getLeaderKeyConfig();

  // Function to get current level actions based on search path
  const getCurrentLevelActions = (path: string): LeaderKeyAction[] => {
    if (!leaderKeyConfig?.actions) return [];

    let currentActions = leaderKeyConfig.actions;

    // Navigate through the path
    for (const char of path) {
      const action = currentActions.find((a) => a.key.toLowerCase() === char.toLowerCase());
      if (action && action.type === "group" && action.actions) {
        currentActions = action.actions;
      } else {
        return []; // Path doesn't exist or leads to a leaf
      }
    }

    return currentActions;
  };

  // Get current level actions and available keys
  const currentLevelActions = getCurrentLevelActions(searchText);
  const takenKeys = new Set<string>();

  currentLevelActions.forEach((action: LeaderKeyAction) => {
    takenKeys.add(action.key.toLowerCase());
  });

  // Define keyboard layout
  const keyboardRows = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "\\"],
    ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "↑", " "],
    [" ", " ", " ", " ", "Space", " ", " ", " ", " ", "←", "↓", "→"],
  ];

  // Generate keyboard layout markdown
  const generateKeyboardMarkdown = () => {
    if (!leaderKeyConfig) {
      return "# Leader Key Keyboard Layout\n\nNo leader key configuration found. Please configure a leader key config path in preferences.";
    }

    let markdown = "";

    keyboardRows.forEach((row, rowIndex) => {
      let rowStr = "|";

      row.forEach((key) => {
        if (!key || key === " ") {
          rowStr += "     |"; // Empty cell
          return;
        }

        const isTaken = takenKeys.has(key.toLowerCase());

        let keyDisplay;
        if (key === "Space") {
          keyDisplay = isTaken ? "**⎵**" : "⎵";
        } else {
          keyDisplay = isTaken ? `**${key}** ` : `${key.padEnd(2)} `;
        }

        rowStr += ` ${keyDisplay} |`;
      });

      markdown += rowStr + "\n";

      // Add separator row after the first row (required for markdown table)
      if (rowIndex === 0) {
        const separatorRow = "|" + row.map((key) => (key === "Space" ? "⎵" : "----")).join("|") + "|";
        markdown += separatorRow + "\n";
      }
    });

    return markdown;
  };

  return (
    <List
      isShowingDetail
      searchBarPlaceholder="Search leader key actions..."
      onSearchTextChange={setSearchText}
      searchText={searchText}
    >
      {!leaderKeyConfig ? (
        <List.EmptyView
          icon={Icon.ExclamationMark}
          title="No Leader Key Configuration"
          description="Please configure a leader key config path in preferences"
        />
      ) : (
        <List.Item
          title=""
          subtitle={`${currentLevelActions.length} characters taken`}
          icon={Icon.Keyboard}
          detail={<List.Item.Detail markdown={generateKeyboardMarkdown()} />}
        />
      )}
    </List>
  );
}
