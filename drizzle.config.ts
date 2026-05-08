import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  tablesFilter: [
    "tenants",
    "users",
    "clients",
    "api_connections",
    "dashboard_widgets",
    "subscription_plans",
    "referrals",
    "referral_commissions",
    "usage_records",
    "invoices",
    "activity_logs",
  ],
});
