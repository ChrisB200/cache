import type { Workplace } from "@/types/user";

export interface StoreFormValues {
  workplace: Workplace;
  rate: number;
  open: string;
  close: string;
}

export interface FGPFormValues {
  fgp_username: string;
  fgp_password: string;
}

export interface SDFormValues {
  sd_username: string;
  sd_password: string;
}

export type AccountProfile = StoreFormValues & FGPFormValues & SDFormValues;
