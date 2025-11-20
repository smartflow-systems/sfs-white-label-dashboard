import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ==================== TENANTS (AGENCIES) ====================
export const tenants = pgTable("tenants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),

  // Basic Info
  name: text("name").notNull(),
  subdomain: text("subdomain").notNull().unique(),
  customDomain: text("custom_domain"),

  // Branding
  logo: text("logo"),
  primaryColor: text("primary_color").default("#FFD700"), // SFS Gold default
  secondaryColor: text("secondary_color").default("#3B2F2F"), // SFS Brown default
  accentColor: text("accent_color").default("#0D0D0D"), // SFS Black default

  // Business Info
  companyEmail: text("company_email"),
  companyPhone: text("company_phone"),
  companyAddress: text("company_address"),

  // Billing
  subscriptionTier: text("subscription_tier").notNull().default("free"), // free, starter, pro, enterprise
  subscriptionStatus: text("subscription_status").notNull().default("trial"), // trial, active, past_due, canceled
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),

  // Limits based on tier
  maxUsers: integer("max_users").default(3), // Free: 3, Starter: 10, Pro: 50, Enterprise: unlimited
  maxClients: integer("max_clients").default(10), // Free: 10, Starter: 50, Pro: 500, Enterprise: unlimited
  maxStorageGB: integer("max_storage_gb").default(1), // Free: 1GB, Starter: 10GB, Pro: 100GB, Enterprise: unlimited

  // Features enabled (JSON for flexibility)
  enabledFeatures: jsonb("enabled_features").$type<string[]>().default(sql`'["dashboard", "basic_analytics"]'`),

  // Settings
  settings: jsonb("settings").$type<Record<string, any>>().default(sql`'{}'`),

  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastLoginAt: timestamp("last_login_at"),

  // Status
  isActive: boolean("is_active").default(true),
  isSuspended: boolean("is_suspended").default(false),
  suspensionReason: text("suspension_reason"),
});

// ==================== USERS ====================
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),

  // Tenant relationship - EVERY user belongs to a tenant
  tenantId: varchar("tenant_id").notNull().references(() => tenants.id, { onDelete: 'cascade' }),

  // Auth
  username: text("username").notNull(),
  email: text("email").notNull(),
  password: text("password").notNull(),

  // Profile
  firstName: text("first_name"),
  lastName: text("last_name"),
  avatar: text("avatar"),

  // Role within their tenant
  role: text("role").notNull().default("member"), // owner, admin, member, viewer

  // Permissions
  permissions: jsonb("permissions").$type<string[]>().default(sql`'["read"]'`),

  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastLoginAt: timestamp("last_login_at"),

  // Status
  isActive: boolean("is_active").default(true),
  emailVerified: boolean("email_verified").default(false),
  verificationToken: text("verification_token"),
});

// ==================== CLIENTS (Tenant's customers) ====================
export const clients = pgTable("clients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),

  // Tenant relationship - clients belong to a tenant (agency)
  tenantId: varchar("tenant_id").notNull().references(() => tenants.id, { onDelete: 'cascade' }),

  // Client Info
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  company: text("company"),

  // Status
  status: text("status").notNull().default("active"), // active, inactive, churned

  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),

  // Custom fields (tenant can define their own)
  customFields: jsonb("custom_fields").$type<Record<string, any>>().default(sql`'{}'`),
});

// ==================== API CONNECTIONS ====================
export const apiConnections = pgTable("api_connections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),

  // Tenant scoped
  tenantId: varchar("tenant_id").notNull().references(() => tenants.id, { onDelete: 'cascade' }),

  // Connection Info
  serviceName: text("service_name").notNull(), // stripe, github, openai, etc.
  status: text("status").notNull().default("disconnected"), // connected, disconnected, error

  // API Keys (encrypted in production!)
  apiKey: text("api_key"),
  apiSecret: text("api_secret"),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),

  // Metrics
  lastSync: timestamp("last_sync"),
  requestCount: integer("request_count").default(0),
  avgLatency: integer("avg_latency").default(0),
  errorCount: integer("error_count").default(0),

  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ==================== DASHBOARD WIDGETS ====================
export const dashboardWidgets = pgTable("dashboard_widgets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),

  // Tenant scoped
  tenantId: varchar("tenant_id").notNull().references(() => tenants.id, { onDelete: 'cascade' }),

  // Widget Config
  title: text("title").notNull(),
  type: text("type").notNull(), // chart, metric, table, etc.
  position: integer("position").notNull(),
  config: jsonb("config").$type<Record<string, any>>().default(sql`'{}'`),

  // Status
  enabled: boolean("enabled").default(true),

  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ==================== SUBSCRIPTION PLANS ====================
export const subscriptionPlans = pgTable("subscription_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),

  // Plan Details
  name: text("name").notNull(), // Free, Starter, Pro, Enterprise
  slug: text("slug").notNull().unique(), // free, starter, pro, enterprise
  description: text("description"),

  // Pricing
  priceMonthly: integer("price_monthly").notNull(), // in cents (e.g., 2900 = $29.00)
  priceYearly: integer("price_yearly"), // optional annual pricing

  // Stripe
  stripePriceIdMonthly: text("stripe_price_id_monthly"),
  stripePriceIdYearly: text("stripe_price_id_yearly"),

  // Limits
  maxUsers: integer("max_users").notNull(),
  maxClients: integer("max_clients").notNull(),
  maxStorageGB: integer("max_storage_gb").notNull(),

  // Features
  features: jsonb("features").$type<string[]>().default(sql`'[]'`),

  // Status
  isActive: boolean("is_active").default(true),
  isPublic: boolean("is_public").default(true), // show on pricing page

  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ==================== ACTIVITY LOGS ====================
export const activityLogs = pgTable("activity_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),

  // Tenant scoped
  tenantId: varchar("tenant_id").notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'set null' }),

  // Activity
  action: text("action").notNull(), // user.created, client.updated, etc.
  resource: text("resource").notNull(), // user, client, connection, etc.
  resourceId: text("resource_id"),

  // Details
  details: jsonb("details").$type<Record<string, any>>().default(sql`'{}'`),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),

  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ==================== ZOD SCHEMAS ====================
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertTenantSchema = createInsertSchema(tenants).omit({ id: true, createdAt: true, updatedAt: true });
export const insertClientSchema = createInsertSchema(clients).omit({ id: true, createdAt: true, updatedAt: true });
export const insertApiConnectionSchema = createInsertSchema(apiConnections).omit({ id: true, createdAt: true, updatedAt: true });
export const insertDashboardWidgetSchema = createInsertSchema(dashboardWidgets).omit({ id: true, createdAt: true, updatedAt: true });
export const insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlans).omit({ id: true, createdAt: true });
export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({ id: true, createdAt: true });

// ==================== TYPES ====================
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Tenant = typeof tenants.$inferSelect;
export type InsertTenant = z.infer<typeof insertTenantSchema>;

export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;

export type ApiConnection = typeof apiConnections.$inferSelect;
export type InsertApiConnection = z.infer<typeof insertApiConnectionSchema>;

export type DashboardWidget = typeof dashboardWidgets.$inferSelect;
export type InsertDashboardWidget = z.infer<typeof insertDashboardWidgetSchema>;

export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertSubscriptionPlan = z.infer<typeof insertSubscriptionPlanSchema>;

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
