export const camelize = (line: string) => {
  return line.replaceAll(/-(\w)/g, (_, s: string) => s.toUpperCase());
};
