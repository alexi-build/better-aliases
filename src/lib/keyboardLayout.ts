import type { LeaderKeyAction } from "../types/leader-key";

export const KEYBOARD_ROWS = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "\\"],
  ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "↑", " "],
  [" ", " ", " ", " ", "Space", " ", " ", " ", " ", "←", "↓", "→"],
];

export function getCurrentLevelActions(actions: LeaderKeyAction[] | undefined, path: string): LeaderKeyAction[] {
  if (!actions) return [];

  let currentActions = actions;

  for (const char of path) {
    const action = currentActions.find((a) => a.key.toLowerCase() === char.toLowerCase());
    if (!action || action.type !== "group" || !action.actions) return [];
    currentActions = action.actions;
  }

  return currentActions;
}

export function getTakenKeys(actions: LeaderKeyAction[]): Set<string> {
  const takenKeys = new Set<string>();
  actions.forEach((action) => takenKeys.add(action.key.toLowerCase()));
  return takenKeys;
}

export function generateKeyboardMarkdown(takenKeys: Set<string>): string {
  let markdown = "";

  KEYBOARD_ROWS.forEach((row, rowIndex) => {
    let rowStr = "|";

    row.forEach((key) => {
      if (!key || key === " ") {
        rowStr += "     |";
        return;
      }

      const isTaken = takenKeys.has(key.toLowerCase());
      const keyDisplay = key === "Space" ? (isTaken ? "**⎵**" : "⎵") : isTaken ? `**${key}** ` : `${key.padEnd(2)} `;

      rowStr += ` ${keyDisplay} |`;
    });

    markdown += rowStr + "\n";

    if (rowIndex === 0) {
      const separatorRow = "|" + row.map((key) => (key === "Space" ? "⎵" : "----")).join("|") + "|";
      markdown += separatorRow + "\n";
    }
  });

  return markdown;
}
