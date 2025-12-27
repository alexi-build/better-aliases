import type { Keyboard } from "@raycast/api";

export const KEYBOARD_SHORTCUTS = {
  COPY_ALIAS: { modifiers: ["cmd"], key: "c" } as Keyboard.Shortcut,
  COPY_VALUE: { modifiers: ["cmd", "shift"], key: "c" } as Keyboard.Shortcut,
  OPEN: { modifiers: ["cmd"], key: "o" } as Keyboard.Shortcut,
};
