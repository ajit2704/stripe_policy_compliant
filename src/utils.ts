export const sanitizeText = (text: string): string => {
    return text
      .replace(/\\n/g, ' ')       // Replace newline escape sequences with a space
      .replace(/\\"/g, '"')       // Replace escaped double quotes with normal double quotes
      .replace(/\\'/g, "'")       // Replace escaped single quotes with normal single quotes
      .replace(/\\/g, '')         // Remove any other backslashes
      .replace(/\s+/g, ' ')       // Replace multiple spaces with a single space
      .trim();                    // Remove leading and trailing whitespace
  };
  