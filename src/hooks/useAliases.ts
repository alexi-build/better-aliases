import { useCachedPromise, showFailureToast } from "@raycast/utils";
import { getAllAliasesConfig } from "../lib/getAllAliasesConfig";

export function useAliases() {
  const result = useCachedPromise(
    async () => {
      try {
        return getAllAliasesConfig();
      } catch (error) {
        await showFailureToast(error, { title: "Failed to load aliases" });
        return {};
      }
    },
    [],
    { keepPreviousData: true },
  );

  return {
    ...result,
    invalidate: result.revalidate,
  };
}
