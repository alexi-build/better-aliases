import { showFailureToast, useCachedPromise } from "@raycast/utils";
import { getAllAliasesConfig } from "../lib/getAllAliasesConfig";

export function useAliases() {
  const result = useCachedPromise(async () => getAllAliasesConfig(), [], {
    keepPreviousData: true,
    onError: (error) => {
      showFailureToast(error, { title: "Failed to load aliases" });
    },
  });

  return result;
}
