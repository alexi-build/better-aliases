export function getRandomizedValue(value: string, separator?: string): string {
  if (!separator?.trim()) return value;

  const options = value.split(separator);
  if (options.length <= 1) return value;

  const randomIndex = Math.floor(Math.random() * options.length);
  return options[randomIndex].trim();
}

export function parseSnippetOptions(body: string, separator: string): string[] {
  return body
    .split(separator)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export interface SnippetValidation {
  isValid: boolean;
  error?: string;
  options: string[];
}

export function validateSnippet(body: string, separator: string): SnippetValidation {
  const usesSeparator = body.includes(separator);

  if (!usesSeparator) {
    if (!body.trim()) {
      return { isValid: false, error: "Please provide snippet content", options: [] };
    }
    return { isValid: true, options: [body.trim()] };
  }

  const options = parseSnippetOptions(body, separator);
  if (options.length < 2) {
    return {
      isValid: false,
      error: `When using "${separator}" separator, please provide at least 2 snippets`,
      options: [],
    };
  }

  return { isValid: true, options };
}
