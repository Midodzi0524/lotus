import { SectorKey, SectorMeta } from '../types/index.ts';

export const SECTORS: Record<SectorKey, SectorMeta> = {
  fintech: {
    key: 'fintech',
    label: 'Fintech & Finance',
    color: '#A0674B', // Terracotta
    description: 'Payments, lending, neobanks, BaaS, insurtech, wealthtech, regtech, crypto and digital assets, embedded finance',
  },
  ai_software: {
    key: 'ai_software',
    label: 'AI & Software',
    color: '#7C7A8C', // Dusty mauve-gray
    description: 'AI agents, developer tools, enterprise SaaS, cybersecurity, infrastructure, data pipelines',
  },
  health_bio: {
    key: 'health_bio',
    label: 'Health & Biotech',
    color: '#B07A86', // Dusty rose
    description: 'Digital health, clinical AI, diagnostic hardware, medtech, biotech, longevity therapeutics',
  },
  climate_energy: {
    key: 'climate_energy',
    label: 'Climate & Energy',
    color: '#7E8B6A', // Sage
    description: 'Clean energy, carbon accounting, grid storage, agritech, circular supply chains, industrial decarbonization',
  },
  consumer_retail: {
    key: 'consumer_retail',
    label: 'Consumer & Retail',
    color: '#C29A5B', // Camel
    description: 'E-commerce infra, social commerce, food innovation, sustainable lifestyle, creator tools',
  },
  mobility_industrial: {
    key: 'mobility_industrial',
    label: 'Mobility & Industrial',
    color: '#6F8794', // Dusty blue-gray
    description: 'Autonomous systems, logistics, robotics, EV infrastructure, aerospace, precision manufacturing',
  },
  work_education: {
    key: 'work_education',
    label: 'Work & Education',
    color: '#9A8466', // Khaki
    description: 'Workplace productivity, adaptive learning, talent matching, HR tech, collaborative tools',
  },
  society_gov: {
    key: 'society_gov',
    label: 'Society & GovTech',
    color: '#8A7B72', // Taupe
    description: 'Civic infrastructure, municipal tech, proptech, compliance verification, public benefit ventures',
  },
};

export const SECTOR_KEYS: SectorKey[] = [
  'fintech',
  'ai_software',
  'health_bio',
  'climate_energy',
  'consumer_retail',
  'mobility_industrial',
  'work_education',
  'society_gov',
];
