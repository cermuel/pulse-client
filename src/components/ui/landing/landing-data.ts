import type { IconType } from "react-icons";
import {
  FaBoltLightning,
  FaChartLine,
  FaGithub,
  FaKey,
  FaPlay,
  FaRegEnvelope,
  FaTableCellsLarge,
  FaTriangleExclamation,
} from "react-icons/fa6";

export type Feature = {
  number: string;
  title: string;
  description: string;
  icon: IconType;
};

export type Step = {
  number: string;
  title: string;
  description: string;
};

export type PricingPlan = {
  name: string;
  price: string;
  period: string;
  cta: string;
  featured: boolean;
  features: string[];
};

export const heroPrimaryIcon = FaPlay;
export const ctaPrimaryIcon = FaGithub;
export const alertIcon = FaTriangleExclamation;

export const navLinks = [
  ["Features", "#features"],
  ["How it works", "#how"],
  ["Pricing", "#pricing"],
] as const;

export const footerLinks = [
  ["Docs", "#"],
  ["GitHub", "#"],
  ["Status", "#"],
  ["Privacy", "#"],
] as const;

export const features: Feature[] = [
  {
    number: "01",
    title: "Real-time pings",
    description:
      "Every endpoint checked on your schedule, with response time, status code, body match, and logs captured in one place.",
    icon: FaBoltLightning,
  },
  {
    number: "02",
    title: "Flair incidents",
    description:
      "When a pulse goes down, Pulse opens a full incident timeline so your team sees every check, alert, and recovery event.",
    icon: FaTriangleExclamation,
  },
  {
    number: "03",
    title: "Instant alerts",
    description:
      "Email, Slack, and Discord notifications fire the moment something breaks and close the loop when it comes back online.",
    icon: FaRegEnvelope,
  },
  {
    number: "04",
    title: "Public status pages",
    description:
      "Share a clean status surface with your users using memorable public identifiers instead of ugly generated links.",
    icon: FaTableCellsLarge,
  },
  {
    number: "05",
    title: "Uptime analytics",
    description:
      "Track uptime over time, compare response trends, and dig into history with charts that make incident patterns obvious.",
    icon: FaChartLine,
  },
  {
    number: "06",
    title: "One-click OAuth",
    description:
      "Sign in with GitHub or Google and go from first visit to active monitoring in under a minute.",
    icon: FaKey,
  },
];

export const steps: Step[] = [
  {
    number: "01",
    title: "Connect your account",
    description:
      "Sign in with GitHub. No forms, no passwords, and your workspace is ready immediately.",
  },
  {
    number: "02",
    title: "Add a pulse",
    description:
      "Drop in a URL, set the interval, and choose the expected response in a few quick clicks.",
  },
  {
    number: "03",
    title: "We ping it",
    description:
      "Pulse checks your endpoint on schedule, measures response time, and stores every result.",
  },
  {
    number: "04",
    title: "Get alerted instantly",
    description:
      "If something breaks, you hear first and a Flair incident opens automatically for the timeline.",
  },
];

export const pricingPlans: PricingPlan[] = [
  {
    name: "Free",
    price: "0",
    period: "forever",
    cta: "Start free",
    featured: false,
    features: [
      "10 pulses",
      "5-minute check interval",
      "Email alerts",
      "7-day ping history",
      "Public status pages",
      "GitHub & Google login",
    ],
  },
  {
    name: "Pro",
    price: "12",
    period: "per month",
    cta: "Get Pro",
    featured: true,
    features: [
      "Unlimited pulses",
      "1-minute check interval",
      "Email + Slack + Discord alerts",
      "90-day ping history",
      "Custom public IDs",
      "Flair incident reports",
    ],
  },
  {
    name: "Team",
    price: "39",
    period: "per month",
    cta: "Start trial",
    featured: false,
    features: [
      "Everything in Pro",
      "5 team members",
      "30-second check interval",
      "Unlimited ping history",
      "Priority support",
      "Custom domain status pages",
    ],
  },
];

export const stats = [
  { value: "99.9%", label: "Avg uptime tracked" },
  { value: "<30s", label: "Alert delivery time" },
  { value: "1min", label: "Minimum interval" },
  { value: "∞", label: "Log history" },
];

export const marqueeItems = [
  "HTTP monitoring",
  "Real-time alerts",
  "Incident tracking",
  "Public status pages",
  "Response time charts",
  "Uptime percentage",
  "Email alerts",
  "Flair incident system",
  "GitHub OAuth",
];

export const uptimeHeights = [
  10, 16, 24, 34, 22, 12, 30, 38, 14, 28, 40, 18, 26, 36, 20, 12, 32, 42, 24,
  16, 30, 38, 18, 26, 12, 34, 22, 14, 28, 40, 20, 10, 36, 24, 18, 32, 44, 26,
  12, 30, 38, 16, 24, 34, 20, 14, 28, 42, 22, 10, 36, 26, 18, 30, 40, 24, 12,
  34, 20, 16, 28, 38, 22, 14, 32, 44, 24, 18, 30, 42,
];

export const uptimeStates = [
  1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 2, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 2, 1,
  1, 0, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 2, 1, 1, 1, 0, 1, 1,
  1, 1, 2, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 2,
];

export const metricSnapshots = [
  { uptime: "99.98%", response: "142ms", flairs: "0", status: "Operational" },
  { uptime: "99.99%", response: "142ms", flairs: "0", status: "Operational" },
  { uptime: "99.99%", response: "138ms", flairs: "0", status: "Operational" },
  { uptime: "99.99%", response: "138ms", flairs: "1", status: "Operational" },
  {
    uptime: "99.99%",
    response: "138ms",
    flairs: "1",
    status: "Investigating",
  },
  {
    uptime: "99.97%",
    response: "138ms",
    flairs: "1",
    status: "Investigating",
  },
  {
    uptime: "99.97%",
    response: "151ms",
    flairs: "1",
    status: "Investigating",
  },
  {
    uptime: "99.97%",
    response: "151ms",
    flairs: "2",
    status: "Investigating",
  },
  { uptime: "99.97%", response: "151ms", flairs: "2", status: "Down" },
  { uptime: "99.96%", response: "151ms", flairs: "2", status: "Down" },
  { uptime: "99.96%", response: "164ms", flairs: "2", status: "Down" },
  { uptime: "99.96%", response: "164ms", flairs: "2", status: "Investigating" },
  { uptime: "99.96%", response: "145ms", flairs: "2", status: "Investigating" },
  { uptime: "99.96%", response: "145ms", flairs: "1", status: "Investigating" },
  { uptime: "99.98%", response: "145ms", flairs: "1", status: "Resolved" },
  { uptime: "99.98%", response: "145ms", flairs: "0", status: "Resolved" },
  { uptime: "99.98%", response: "136ms", flairs: "0", status: "Resolved" },
  { uptime: "99.98%", response: "136ms", flairs: "0", status: "Operational" },
  { uptime: "99.99%", response: "136ms", flairs: "0", status: "Operational" },
  { uptime: "99.99%", response: "132ms", flairs: "0", status: "Operational" },
  { uptime: "99.99%", response: "132ms", flairs: "1", status: "Operational" },
  { uptime: "99.99%", response: "132ms", flairs: "0", status: "Operational" },
];
