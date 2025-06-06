export type PaymentMethod = {
  bank_code: string;
  channel: Channel;
  provider: string;
  account_number: string;
  account_name: string;
};

export enum PaymentIssuer {
  bank_account = "bank_account",
  mobile_money = "mobile_money",
}

export enum Channel {
  BANK = "BANK",
  MOBILE_MONEY = "MOBILE_MONEY",
}

export type AccountPayload = Pick<
  PaymentMethod,
  "account_number" | "bank_code"
>;
