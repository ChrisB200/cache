import type { ButtonGroup } from "./form";

export interface Error {
  title?: string;
  description: string;
  code?: string;
}

export interface DisplayError extends Error {
  buttons?: ButtonGroup[];
}
