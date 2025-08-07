import { STORAGE_URL } from "@/config/constants";

export const getImage = (url: string | null | undefined) => {
  return `${STORAGE_URL}institutions/${url}`;
};
