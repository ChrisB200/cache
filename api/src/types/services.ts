import { Workplace } from "./db";
import { TimeString } from "./dates";

export interface ValidateSetupCredentials {
  workplace?: Workplace;
  open?: TimeString;
  close?: TimeString;
  fgp_username?: string;
  fgp_password?: string;
  sd_username?: string;
  sd_password?: string;
}

export interface SetupCredentials {
  workplace: Workplace;
  open: TimeString;
  close: TimeString;
  fgp_username: string;
  fgp_password: string;
  sd_username: string;
  sd_password: string;
}
