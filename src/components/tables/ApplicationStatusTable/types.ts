import type { ReactNode } from "react";

export type DetailItem = {
  label: string;
  value: string | string[];
};

export type ChipItem = {
  icon: ReactNode;
  label: string;
  sx?: object;
};

export type SectionLink = {
  label: string;
  href: string;
  icon?: ReactNode;
};

export type SectionItem = {
  icon: ReactNode;
  title: string;
  description?: string;
  confidence?: number | string;
  price?: string;
  chips?: ChipItem[];
  details?: DetailItem[];
  downloadUrl?: string;
  links?: SectionLink[];
  propertyEstimateValue?: number;
};

export type Section = {
  id: string;
  title: string;
  items: SectionItem[];
};

export interface AiSummary {
  verdict: string;
  reason: string;
  score: number;
}

export interface ApplicationStatusTableProps {
  data: any;
}