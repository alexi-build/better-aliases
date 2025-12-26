import { Action, ActionPanel, Form, showToast, Toast } from "@raycast/api";
import { addBetterAlias } from "./lib/betterAliases";
import type { CreateBetterAliasFormData } from "./types/form";

export default function Command() {
  function handleSubmit(values: CreateBetterAliasFormData) {
    try {
      addBetterAlias(values.alias, {
        value: values.value,
        label: values.label || values.alias,
      });

      showToast({
        style: Toast.Style.Success,
        title: "Better Alias Created",
        message: `Alias "${values.alias}" saved successfully`,
      });
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to Create Better Alias",
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
      <Form.Description text="Create a new Better Alias for a quicklink or snippet." />
      <Form.TextField
        id="name"
        title="Alias Name"
        placeholder="Enter alias name (e.g., 'gh')"
        info="The key you'll type to trigger this alias"
      />
      <Form.TextArea
        id="body"
        title="Alias Body"
        placeholder="Enter URL, file path, or text content"
        info="What should happen when this alias is triggered"
      />
      <Form.TextField
        id="label"
        title="Display Label (optional)"
        placeholder="Enter display name"
        info="Optional friendly name shown in search results"
      />
      <Form.Checkbox
        id="snippetOnlyMode"
        title="Snippet Only Mode"
        label="Text insertion only (disables opening URLs/files)"
        storeValue
      />
      {/* <Form.Dropdown id="dropdown" title="Dropdown">
        <Form.Dropdown.Item value="dropdown-item" title="Dropdown Item" />
      </Form.Dropdown> */}
      {/* <Form.TagPicker id="tokeneditor" title="Tag picker">
        <Form.TagPicker.Item value="tagpicker-item" title="Tag Picker Item" />
      </Form.TagPicker> */}
    </Form>
  );
}
