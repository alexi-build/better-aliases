import { Action, ActionPanel, Form, popToRoot, showToast, Toast } from "@raycast/api";
import { useForm, showFailureToast } from "@raycast/utils";
import { addBetterAlias } from "./lib/betterAliases";

interface CreateAliasFormValues {
  alias: string;
  value: string;
  label?: string;
  snippetOnlyMode: boolean;
}

export default function Command() {
  const { handleSubmit, itemProps } = useForm<CreateAliasFormValues>({
    onSubmit: async (values) => {
      try {
        addBetterAlias(values.alias, {
          value: values.value,
          label: values.label || values.alias,
        });
        await showToast(Toast.Style.Success, "Alias created", values.alias);
        popToRoot();
      } catch (error) {
        await showFailureToast(error, { title: "Failed to create alias" });
      }
    },
    validation: {
      alias: (value) => {
        if (!value?.trim()) return "Alias is required";
        if (!/^[a-z0-9-_.]+$/i.test(value)) return "Only letters, numbers, dashes, underscores, and dots allowed";
      },
      value: (value) => {
        if (!value?.trim()) return "Value is required";
      },
    },
  });

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Create Alias" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.Description text="Create a new Better Alias for a quicklink or snippet." />
      <Form.TextField
        title="Alias"
        placeholder="Enter alias name (e.g., 'gh')"
        info="The shorthand you'll type to trigger this alias"
        {...itemProps.alias}
      />
      <Form.TextArea
        title="Value"
        placeholder="Enter URL, file path, or text content"
        info="What should happen when this alias is triggered"
        {...itemProps.value}
      />
      <Form.TextField
        title="Label (optional)"
        placeholder="Enter display name"
        info="Optional friendly name shown in search results"
        {...itemProps.label}
      />
      <Form.Checkbox
        label="Text insertion only (disables opening URLs/files)"
        title="Snippet Only Mode"
        {...itemProps.snippetOnlyMode}
      />
    </Form>
  );
}
