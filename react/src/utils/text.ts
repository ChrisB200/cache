export const formatInstitutionName = (name: string) => {
  if (name.includes("(UK)")) {
    return name.split("(UK)")[0].trim();
  }
  return name;
};
