import { z } from 'zod';

export type SectorKey =
  | 'fintech'
  | 'ai_software'
  | 'health_bio'
  | 'climate_energy'
  | 'consumer_retail'
  | 'mobility_industrial'
  | 'work_education'
  | 'society_gov';

export interface SectorMeta {
  key: SectorKey;
  label: string;
  color: string;
  description: string;
}

export interface KeyFacts {
  fundingAmount?: string;
  round?: string;
  stage?: string;
  leadInvestors?: string[];
  valuation?: string;
  location?: string;
  founded?: string;
  founders?: string[];
  businessModel?: string;
  targetCustomer?: string;
  traction?: string;
}

export interface SignalScoreBreakdown {
  novelty: number; // 0-100 (30%)
  significance: number; // 0-100 (25%)
  crossSourceMentions: number; // 0-100 (20%)
  traction: number; // 0-100 (15%)
  relevanceToFinancialServices: number; // 0-100 (10%)
  totalScore: number; // weighted sum 0-100
  rationale: string;
}

export interface SourceReference {
  name: string;
  url: string;
  publishedAt?: string;
}

export interface Item {
  id: string;
  sector: SectorKey;
  headline: string; // max 12 words
  teaser: string; // max 20 words
  whatItIs: string; // max 25 words
  whyItMatters: string; // max 30 words
  keyFacts?: KeyFacts;
  bankAngle?: string; // max 25 words
  imageUrl?: string;
  imageCredit?: string;
  imageAlt?: string;
  sources: SourceReference[];
  signalScore: SignalScoreBreakdown;
  entityName: string;
  entitySlug?: string;
  tags: string[];
  glossaryTerms?: string[];
  longSummary?: string; // in-depth briefing, markdown (## headings, - bullets)
  summaryMinutes?: number;
  correctedDate?: string;
  correctionNote?: string;
}

export interface Spotlight {
  entityName: string;
  entitySlug?: string;
  sector: SectorKey;
  imageUrl?: string;
  imageCredit?: string;
  imageAlt?: string;
  pitch: string; // 2 sentences
  problem: string;
  product: string;
  customer: string;
  businessModel: string;
  funding: string;
  competition: string;
  risks: string;
  whatToWatch: string;
  sources: SourceReference[];
  signalScore: SignalScoreBreakdown;
}

export interface FundingEvent {
  id: string;
  company: string;
  companySlug?: string;
  round: string;
  amount: string;
  sector: SectorKey;
  leadInvestors?: string[];
  location?: string;
  date: string;
  sourceUrl: string;
}

export interface BankLensBullet {
  type: 'opportunity' | 'threat' | 'partnership' | 'regulatory';
  headline: string; // one-line
  explanation: string; // short explanation
  relatedItemId?: string;
  ideaSpark?: string[]; // 3 short brainstorm ideas
}

export interface QuickLink {
  title: string;
  url: string;
  source: string;
  sector: SectorKey;
}

export interface SourceStatusItem {
  sourceKey: string;
  name: string;
  status: 'ok' | 'partial' | 'error' | 'not_available_today';
  itemsCount: number;
  lastFetchedAt: string;
  notes?: string;
}

export interface DeepDive {
  title: string;
  weekEnding: string;
  summary: string;
  topStories: { title: string; takeaway: string; linkId?: string }[];
  trendAnalysis: {
    trendName: string;
    description: string;
    implication: string;
  };
  bankProductIdeas: string[];
}

export interface Edition {
  schemaVersion: 1;
  date: string; // YYYY-MM-DD
  number: number;
  status: 'published' | 'partial';
  isDemo?: boolean;
  todayInOneSentence: string; // max 25 words
  readingMinutes: {
    browse: number; // e.g. 2
    read: number; // e.g. 10
  };
  stats: {
    companies: number;
    sectors: number;
    fundingTotalUsd: string | null;
    sourcesOk: number;
    sourcesTotal: number;
  };
  topThree: Item[];
  spotlight: Spotlight;
  sectors: Record<SectorKey, Item[]>;
  funding: FundingEvent[];
  rising: Item[];
  africa?: Item[];
  ghana?: Item[];
  bankLens: BankLensBullet[];
  quickLinks: QuickLink[];
  weeklyDeepDive?: DeepDive;
  sourceStatus: SourceStatusItem[];
  promptVersion: string;
  modelInfo: string;
  corrections?: {
    itemId: string;
    date: string;
    note: string;
  }[];
}

export interface CompanyProfile {
  name: string;
  slug: string;
  sector: SectorKey;
  description: string;
  founded?: string;
  location?: string;
  website?: string;
  logoUrl?: string;
  totalFunding?: string;
  latestRound?: string;
  mentions: {
    editionDate: string;
    headline: string;
    itemId: string;
  }[];
  fundingEvents: FundingEvent[];
  sources: SourceReference[];
}

export interface TrendItem {
  slug: string;
  name: string;
  description: string;
  sector: SectorKey;
  firstSeen: string;
  mentionsCount: number;
  trajectory: 'rising' | 'surging' | 'steady';
  whyItMatters: string;
  relatedCompanies: string[];
}

export interface GlossaryItem {
  term: string;
  definition: string;
  sector?: SectorKey;
  firstSeenDate?: string;
}

// Zod Schema Validation
export const KeyFactsSchema = z.object({
  fundingAmount: z.string().optional(),
  round: z.string().optional(),
  stage: z.string().optional(),
  leadInvestors: z.array(z.string()).optional(),
  valuation: z.string().optional(),
  location: z.string().optional(),
  founded: z.string().optional(),
  founders: z.array(z.string()).optional(),
  businessModel: z.string().optional(),
  targetCustomer: z.string().optional(),
  traction: z.string().optional(),
}).optional();

export const ItemSchema = z.object({
  id: z.string(),
  sector: z.enum([
    'fintech',
    'ai_software',
    'health_bio',
    'climate_energy',
    'consumer_retail',
    'mobility_industrial',
    'work_education',
    'society_gov',
  ]),
  headline: z.string().refine(val => val.split(/\s+/).length <= 15, {
    message: 'Headline must be under 15 words',
  }),
  teaser: z.string().refine(val => val.split(/\s+/).length <= 25, {
    message: 'Teaser must be under 25 words',
  }),
  whatItIs: z.string(),
  whyItMatters: z.string(),
  keyFacts: KeyFactsSchema,
  bankAngle: z.string().optional(),
  imageUrl: z.string().optional(),
  imageCredit: z.string().optional(),
  imageAlt: z.string().optional(),
  sources: z.array(
    z.object({
      name: z.string(),
      url: z.string(),
      publishedAt: z.string().optional(),
    })
  ).min(1),
  signalScore: z.object({
    novelty: z.number().min(0).max(100),
    significance: z.number().min(0).max(100),
    crossSourceMentions: z.number().min(0).max(100),
    traction: z.number().min(0).max(100),
    relevanceToFinancialServices: z.number().min(0).max(100),
    totalScore: z.number().min(0).max(100),
    rationale: z.string(),
  }),
  entityName: z.string(),
  entitySlug: z.string().optional(),
  tags: z.array(z.string()),
  glossaryTerms: z.array(z.string()).optional(),
});
