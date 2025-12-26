import { Action, ActionPanel, Form, getPreferenceValues, popToRoot, showToast, Toast } from "@raycast/api";
import { showFailureToast, useForm } from "@raycast/utils";
import { addBetterSnippet } from "./lib/betterSnippets";
import { validateSnippet } from "./lib/snippetUtils";
import type { Preferences } from "./types";

interface CreateSnippetFormValues {
  alias: string;
  body: string;
  label?: string;
}

export default function Command() {
  const preferences = getPreferenceValues<Preferences>();
  const separator = preferences.randomizedSnippetSeparator || ";;";

  const { handleSubmit, itemProps } = useForm<CreateSnippetFormValues>({
    onSubmit: async (values) => {
      try {
        addBetterSnippet(values.alias, {
          value: values.body,
          label: values.label || values.alias,
        });
        await showToast(Toast.Style.Success, "Snippet created", values.alias);
        popToRoot();
      } catch (error) {
        await showFailureToast(error, { title: "Failed to create snippet" });
      }
    },
    validation: {
      alias: (value) => {
        if (!value?.trim()) return "Alias is required";
      },
      body: (value) => {
        if (!value) return "Body is required";
        const validation = validateSnippet(value, separator);
        if (!validation.isValid) return validation.error;
      },
    },
  });

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Create Snippet" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.Description text="Create a snippet with optional randomization. Use a separator to create multiple variations that will be randomly selected when triggered." />
      <Form.TextField
        title="Alias"
        placeholder="Enter alias name (e.g., ',hey')"
        info="The key you'll type with the snippet prefix to trigger this snippet"
        {...itemProps.alias}
      />
      <Form.TextArea
        title="Body"
        placeholder={`Hello everyone! (single snippet) or Hello!${separator}Hey!${separator}Hello team! (multiple variations)`}
        info={`For multiple variations, separate each with "${separator}". When triggered, one will be randomly selected.`}
        {...itemProps.body}
      />
      <Form.TextField
        title="Label (optional)"
        placeholder="Enter label"
        info="Optional friendly name shown in search results"
        {...itemProps.label}
      />
      <Form.Description
        text={`💡 Tip: Use the snippet prefix "${preferences.snippetPrefix || ","}" before the name when searching to trigger text insertion mode.`}
      />
    </Form>
  );
}
