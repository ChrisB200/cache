import { Workplace } from "./db";
import { TimeString } from "./dates";

export interface ValidateSetupCredentials {
  workplace?: Workplace;
  rate?: number;
  open?: TimeString;
  close?: TimeString;
  fgpUsername?: string;
  fgpPassword?: string;
  sdUsername?: string;
  sdPassword?: string;
}

export interface SetupCredentials {
  workplace: Workplace;
  rate: number;
  open: TimeString;
  close: TimeString;
  fgpUsername: string;
  fgpPassword: string;
  sdUsername: string;
  sdPassword: string;
}
