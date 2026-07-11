// Типы сущностей MVP по MASTER_PRD §4, §6.
// Все значения могут быть null — это означает «нет данных» (П-3, FM-32).

export type Segment = "international" | "russian"; // FM-39
export type Network = "visa" | "mastercard"; // FM-78
export type KycStatus = "yes" | "no" | "partial"; // FM-20
export type FundingMethod = "sbp" | "crypto" | "usdt" | "transfer"; // FM-19

export interface PayableService {
  id: string;
  name: string;
}

export interface Tariff {
  // FM-45
  name: string;
  price: string | null;
  conditions: string | null;
}

export interface ReviewStats {
  // FM-27, FM-31, FM-32
  score: number | null; // null => «Нет оценок»
  count: number; // 0 допустимо
}

export interface CardService {
  slug: string;
  name: string;
  // FM-15..21
  issuePrice: string | null;
  maintenancePrice: string | null;
  fundingFee: string | null;
  fundingFeeTooltip: string | null; // FM-18
  fundingMethods: FundingMethod[] | null;
  kyc: KycStatus | null;
  validity: string | null;
  // FM-23..25
  payableServices: PayableService[];
  // FM-27, 31, 32
  reviews: ReviewStats;
  segment: Segment; // FM-39
  // Д-15
  country: string;
  network: Network;
  // К4..К6
  description: string;
  pros: string[];
  cons: string[];
  verdict: string;
  tariffs: Tariff[];
  issueSteps: string[];
  affiliateUrl: string; // FM-34
}