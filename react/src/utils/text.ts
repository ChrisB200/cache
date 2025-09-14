export const formatInstitutionName = (name: string) => {
  if (name.includes("(UK)")) {
    return name.split("(UK)")[0].trim();
  }
  return name;
};

export const upperFirstChar = (text: string) => {
  if (text.length <= 0) return text;

  const firstLetter = text.substring(0, 1);
  const rest = text.substring(1);
  const combined = `${firstLetter.toUpperCase()}${rest}`;

  return combined;
};
