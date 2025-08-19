import { Workplace } from "./db";
import { TimeString } from "./dates";

export interface ValidateSetupCredentials {
  workplace?: Workplace;
  open?: TimeString;
  close?: TimeString;
  fgpUsername?: string;
  fgpPassword?: string;
  sdUsername?: string;
  sdPassword?: string;
}

export interface SetupCredentials {
  workplace: Workplace;
  open: TimeString;
  close: TimeString;
  fgpUsername: string;
  fgpPassword: string;
  sdUsername: string;
  sdPassword: string;
}
