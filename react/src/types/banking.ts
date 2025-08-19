export interface BankInstitution {
  id: string;
  logoUrl?: string;
  name: string;
}

export interface BankAccount {
  id: string;
  name: string;
  nickname?: string;
  type: string;
  subtype: string;
  institution: BankInstitution;
  balance: number;
  position: number;
  expired: boolean;
  accessToken: string;
}
