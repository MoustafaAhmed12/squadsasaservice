export interface Orders {
  id: number;
  contactName: string;
  contactEmail: string;
  telephone: string;
  company: string;
}

export interface Order {
  question: string;
  area: string;
  market: string;
  technology: string;
  profiles: { jobTitle: string; quantity: number }[];
}
