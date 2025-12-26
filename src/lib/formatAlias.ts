export function formatAlias(alias: string, showFullAlias: boolean = false, searchText: string = ""): string {
  const formattedAlias = alias.replace(/enter/g, "↵");

  if (showFullAlias) {
    return formattedAlias;
  }

  if (!searchText.trim()) {
    return formattedAlias;
  }

  // Remove searchText from the beginning if it matches
  if (formattedAlias.startsWith(searchText)) {
    return formattedAlias.slice(searchText.length);
  }

  return formattedAlias;
}
