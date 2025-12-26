import { Action, type Keyboard } from "@raycast/api";
import React from "react";
import { expandPath, extractPathFromOpenCommand, isOpenCommand } from "./expandPath";

/**
 * Creates the appropriate Raycast Action for opening an alias value
 * Handles URLs, "open" commands, and regular paths with environment variable expansion
 * @param value - The alias value to open
 * @param title - The title for the action (default: "Open")
 * @param shortcut - The keyboard shortcut for the action
 * @returns A Raycast Action component
 */
export function createOpenAction(
  value: string,
  title: string = "Open",
  shortcut?: Keyboard.Shortcut,
): React.ReactElement {
  // Handle different types of values
  if (value.includes("://")) {
    // URLs - use Action.Open
    return React.createElement(Action.Open, {
      target: value,
      title: title,
      shortcut: shortcut,
    });
  } else if (isOpenCommand(value)) {
    // "open" commands - extract and expand the path
    const pathFromCommand = extractPathFromOpenCommand(value);
    const expandedPath = expandPath(pathFromCommand);
    return React.createElement(Action.OpenWith, {
      path: expandedPath,
      title: "Open with",
      shortcut: shortcut,
    });
  } else {
    // Regular paths - expand environment variables
    const expandedPath = expandPath(value);
    return React.createElement(Action.OpenWith, {
      path: expandedPath,
      title: "Open with",
      shortcut: shortcut,
    });
  }
}

/**
 * Gets the target path/URL for opening an alias value
 * Handles path expansion for "open" commands and regular paths
 * @param value - The alias value
 * @returns The target path/URL to open
 */
export function getOpenTarget(value: string): string {
  if (value.includes("://")) {
    // URLs - return as-is
    return value;
  } else if (isOpenCommand(value)) {
    // "open" commands - extract path and expand it
    const pathFromCommand = extractPathFromOpenCommand(value);
    return expandPath(pathFromCommand);
  } else {
    // Regular paths - expand environment variables
    return expandPath(value);
  }
}
