import { showFailureToast, useCachedPromise } from "@raycast/utils";
import { loadBetterSnippets } from "../lib/betterSnippets";

export function useSnippets() {
  const result = useCachedPromise(async () => loadBetterSnippets(), [], {
    keepPreviousData: true,
    onError: (error) => {
      showFailureToast(error, { title: "Failed to load snippets" });
    },
  });

  return result;
}
