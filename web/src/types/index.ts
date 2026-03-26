export type JobStatus = "Under Review" | "Interviewing" | "Closed" | "Active";
export type PricingType = "Fixed Milestone" | "Hourly Retainer" | "Bounty Based";

export interface Job {
  id: string;
  title: string;
  company: string;
  appliedAgo: string;
  price: string;
  pricingType: PricingType;
  status: JobStatus;
  icon: string;
}

export interface Message {
  id: string;
  sender: string;
  preview: string;
  time: string;
  avatarSrc: string;
}

export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}
