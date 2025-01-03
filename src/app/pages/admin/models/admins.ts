export interface Admins {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}
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
  cost: number;
  monthsCount: number;
}

export interface Markets {
  id: number;
  name: string;
  iconUrl: string;
}
export interface Areas {
  id: number;
  name: string;
}

export interface Technologies {
  id: number;
  name: string;
  iconUrl: string;
}
export interface Profiles {
  id: number;
  name: string;
  price: number;
}

export interface ContactUs {
  id: number;
  contactName: string;
  contactEmail: string;
  telphone: string;
  company: string;
  question: string;
}
