export type NavTab = "home" | "growth-tracking" | "ai-scan" | "nutrition-plan" | "child-profile" | "child-history" | "poshan-ai";

export interface ChildProfile {
  name: string;
  parentNames: string;
  accountType: string;
  gender: "boy" | "girl";
  ageYears: number;
  ageMonths: number;
  avatarUrl: string;
  status: string;
  statusDescription: string;
}

export interface VitalRecord {
  weight: number;
  height: number;
  muac: number;
  date: string;
  bmi?: number;
  percentile?: string;
}

export interface HistoryRecord extends VitalRecord {
  id: string;
  recordedAt: string;
  ageYears: number;
  ageMonths: number;
  healthStatus: string;
  source: "Growth tracking" | "AI scan";
}

export interface MealItem {
  id: string;
  mealType: "Breakfast" | "Lunch" | "Afternoon Snack" | "Dinner";
  time: string;
  title: string;
  icon: string;
  tags: { label: string; icon: string; bgClass: string; textClass: string }[];
}

export interface GrowthScanResult {
  status: string;
  statusHeading: string;
  timestamp: string;
  weight: number;
  height: number;
  muac: number;
  explanation: string;
}
