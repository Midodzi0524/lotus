import { SectorKey } from '../src/types/index.ts';

export interface RawItem {
  id: string;
  sourceKey: string;
  sourceName: string;
  title: string;
  url: string;
  publishedAt: string;
  excerpt: string;
  author?: string;
  imageCandidates: { url: string; width?: number; height?: number }[];
  fetchedAt: string;
  extra?: Record<string, unknown>;
}

export interface DeduplicatedItem {
  id: string;
  primaryTitle: string;
  entityName: string;
  sourceLinks: { name: string; url: string; publishedAt?: string }[];
  excerpts: string[];
  imageCandidates: { url: string }[];
  firstSeenAt: string;
}

export interface ClassifiedItem {
  id: string;
  entityName: string;
  sector: SectorKey;
  tags: string[];
  facts: {
    fundingAmount?: string;
    round?: string;
    leadInvestors?: string[];
    valuation?: string;
    location?: string;
    founded?: string;
    businessModel?: string;
    targetCustomer?: string;
    traction?: string;
  };
  bankRelevance: 'none' | 'low' | 'medium' | 'high';
  confidence: number;
}
