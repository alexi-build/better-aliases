import { Icon, List } from "@raycast/api";
import { useMemo, useState } from "react";
import { useLeaderKeyConfig } from "./hooks";
import { getCurrentLevelActions, getTakenKeys, generateKeyboardMarkdown } from "./lib/keyboardLayout";

export default function Command() {
  const { data: config, isLoading } = useLeaderKeyConfig();
  const [searchText, setSearchText] = useState("");

  const { currentLevelActions, markdown } = useMemo(() => {
    if (!config?.actions) {
      return {
        currentLevelActions: [],
        markdown: "# Leader Key Keyboard Layout\n\nNo leader key configuration found.",
      };
    }

    const actions = getCurrentLevelActions(config.actions, searchText);
    const takenKeys = getTakenKeys(actions);
    const md = generateKeyboardMarkdown(takenKeys);

    return { currentLevelActions: actions, markdown: md };
  }, [config, searchText]);

  return (
    <List
      isLoading={isLoading}
      isShowingDetail
      searchBarPlaceholder="Search leader key actions..."
      onSearchTextChange={setSearchText}
      searchText={searchText}
    >
      {!config ? (
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
          detail={<List.Item.Detail markdown={markdown} />}
        />
      )}
    </List>
  );
}
