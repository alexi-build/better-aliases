import { Action, ActionPanel, Form, getPreferenceValues, showToast, Toast } from "@raycast/api";
import { addBetterSnippet } from "./lib/betterSnippets";
import type { Preferences } from "./types";
import type { CreateBetterSnippetFormData } from "./types/form";

export default function Command() {
  const preferences = getPreferenceValues<Preferences>();
  const separator = preferences.randomizedSnippetSeparator || ";;";

  function handleSubmit(values: CreateBetterSnippetFormData) {
    try {
      // Check if separator is being used
      const usesSeparator = values.body.includes(separator);
      let snippetOptions: string[] = [];

      if (usesSeparator) {
        // Split and validate snippets when separator is used
        snippetOptions = values.body
          .split(separator)
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 0);

        if (snippetOptions.length < 2) {
          showToast({
            style: Toast.Style.Failure,
            title: "Not Enough Snippets",
            message: `When using "${separator}" separator, please provide at least 2 snippets`,
          });
          return;
        }
      } else {
        // Single snippet without separator
        if (!values.body.trim()) {
          showToast({
            style: Toast.Style.Failure,
            title: "Empty Snippet",
            message: "Please provide snippet content",
          });
          return;
        }
        snippetOptions = [values.body.trim()];
      }

      addBetterSnippet(values.alias, {
        value: values.body,
        label: values.label || values.alias,
      });

      showToast({
        style: Toast.Style.Success,
        title: "Snippet Created",
        message:
          snippetOptions.length > 1
            ? `Snippet "${values.alias}" with ${snippetOptions.length} variations saved successfully`
            : `Snippet "${values.alias}" saved successfully`,
      });
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to Create Randomized Snippet",
        message: String(error),
      });
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.Description text="Create a snippet with optional randomization. Use a separator to create multiple variations that will be randomly selected when triggered, or create a single snippet without a separator." />
      <Form.TextField
        id="alias"
        title="Alias"
        placeholder="Enter alias name (e.g., ',hey')"
        info="The key you'll type with the snippet prefix to trigger this snippet"
      />
      <Form.TextArea
        id="body"
        title="Body"
        placeholder={`Hello everyone! (single snippet) or Hello!${separator}Hey!${separator}Hello everyone${separator}Hello team! (multiple variations)`}
        info={`For multiple variations, separate each with "${separator}". When triggered, one will be randomly selected. For a single snippet, just enter the text without separators.`}
      />
      <Form.TextField
        id="label"
        title="Label (optional)"
        placeholder="Enter label"
        info="Optional friendly name shown in search results"
      />
      <Form.Description
        text={`💡 Tip: Use the snippet prefix "${preferences.snippetPrefix || ","}" before the name when searching to trigger text insertion mode.`}
      />
    </Form>
  );
}
