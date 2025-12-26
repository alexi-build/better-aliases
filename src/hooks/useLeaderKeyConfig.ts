import { useCachedPromise, showFailureToast } from "@raycast/utils";
import { getLeaderKeyConfig } from "../lib/leaderKeyAliases";

export function useLeaderKeyConfig() {
  const result = useCachedPromise(
    async () => {
      try {
        return getLeaderKeyConfig();
      } catch (error) {
        await showFailureToast(error, { title: "Failed to load leader key config" });
        return null;
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
