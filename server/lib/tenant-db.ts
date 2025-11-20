import { eq, and } from 'drizzle-orm';
import { db } from '../storage';
import {
  users,
  clients,
  apiConnections,
  dashboardWidgets,
  activityLogs,
  type User,
  type Client,
  type ApiConnection,
  type DashboardWidget,
  type ActivityLog,
  type InsertUser,
  type InsertClient,
  type InsertApiConnection,
  type InsertDashboardWidget,
  type InsertActivityLog,
} from '../../shared/schema';

/**
 * Tenant-Scoped Database Access Layer
 *
 * All database operations are automatically scoped to the tenant.
 * This prevents data leakage between tenants.
 */

export class TenantDatabase {
  constructor(private tenantId: string) {}

  // ==================== USERS ====================

  async getUsers(): Promise<User[]> {
    return db
      .select()
      .from(users)
      .where(eq(users.tenantId, this.tenantId));
  }

  async getUserById(userId: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(and(eq(users.id, userId), eq(users.tenantId, this.tenantId)))
      .limit(1);

    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(and(eq(users.email, email), eq(users.tenantId, this.tenantId)))
      .limit(1);

    return user;
  }

  async createUser(data: Omit<InsertUser, 'tenantId'>): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({ ...data, tenantId: this.tenantId })
      .returning();

    return user;
  }

  async updateUser(userId: string, data: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...data, tenantId: this.tenantId }) // Ensure tenant can't be changed
      .where(and(eq(users.id, userId), eq(users.tenantId, this.tenantId)))
      .returning();

    return user;
  }

  async deleteUser(userId: string): Promise<boolean> {
    const result = await db
      .delete(users)
      .where(and(eq(users.id, userId), eq(users.tenantId, this.tenantId)));

    return result.rowCount !== null && result.rowCount > 0;
  }

  async countUsers(): Promise<number> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.tenantId, this.tenantId));

    return result.length;
  }

  // ==================== CLIENTS ====================

  async getClients(): Promise<Client[]> {
    return db
      .select()
      .from(clients)
      .where(eq(clients.tenantId, this.tenantId));
  }

  async getClientById(clientId: string): Promise<Client | undefined> {
    const [client] = await db
      .select()
      .from(clients)
      .where(and(eq(clients.id, clientId), eq(clients.tenantId, this.tenantId)))
      .limit(1);

    return client;
  }

  async createClient(data: Omit<InsertClient, 'tenantId'>): Promise<Client> {
    const [client] = await db
      .insert(clients)
      .values({ ...data, tenantId: this.tenantId })
      .returning();

    return client;
  }

  async updateClient(clientId: string, data: Partial<InsertClient>): Promise<Client | undefined> {
    const [client] = await db
      .update(clients)
      .set({ ...data, tenantId: this.tenantId })
      .where(and(eq(clients.id, clientId), eq(clients.tenantId, this.tenantId)))
      .returning();

    return client;
  }

  async deleteClient(clientId: string): Promise<boolean> {
    const result = await db
      .delete(clients)
      .where(and(eq(clients.id, clientId), eq(clients.tenantId, this.tenantId)));

    return result.rowCount !== null && result.rowCount > 0;
  }

  async countClients(): Promise<number> {
    const result = await db
      .select()
      .from(clients)
      .where(eq(clients.tenantId, this.tenantId));

    return result.length;
  }

  // ==================== API CONNECTIONS ====================

  async getApiConnections(): Promise<ApiConnection[]> {
    return db
      .select()
      .from(apiConnections)
      .where(eq(apiConnections.tenantId, this.tenantId));
  }

  async getApiConnectionById(connectionId: string): Promise<ApiConnection | undefined> {
    const [connection] = await db
      .select()
      .from(apiConnections)
      .where(
        and(
          eq(apiConnections.id, connectionId),
          eq(apiConnections.tenantId, this.tenantId)
        )
      )
      .limit(1);

    return connection;
  }

  async getApiConnectionByService(serviceName: string): Promise<ApiConnection | undefined> {
    const [connection] = await db
      .select()
      .from(apiConnections)
      .where(
        and(
          eq(apiConnections.serviceName, serviceName),
          eq(apiConnections.tenantId, this.tenantId)
        )
      )
      .limit(1);

    return connection;
  }

  async createApiConnection(
    data: Omit<InsertApiConnection, 'tenantId'>
  ): Promise<ApiConnection> {
    const [connection] = await db
      .insert(apiConnections)
      .values({ ...data, tenantId: this.tenantId })
      .returning();

    return connection;
  }

  async updateApiConnection(
    connectionId: string,
    data: Partial<InsertApiConnection>
  ): Promise<ApiConnection | undefined> {
    const [connection] = await db
      .update(apiConnections)
      .set({ ...data, tenantId: this.tenantId })
      .where(
        and(
          eq(apiConnections.id, connectionId),
          eq(apiConnections.tenantId, this.tenantId)
        )
      )
      .returning();

    return connection;
  }

  async deleteApiConnection(connectionId: string): Promise<boolean> {
    const result = await db
      .delete(apiConnections)
      .where(
        and(
          eq(apiConnections.id, connectionId),
          eq(apiConnections.tenantId, this.tenantId)
        )
      );

    return result.rowCount !== null && result.rowCount > 0;
  }

  // ==================== DASHBOARD WIDGETS ====================

  async getWidgets(): Promise<DashboardWidget[]> {
    return db
      .select()
      .from(dashboardWidgets)
      .where(eq(dashboardWidgets.tenantId, this.tenantId));
  }

  async getWidgetById(widgetId: string): Promise<DashboardWidget | undefined> {
    const [widget] = await db
      .select()
      .from(dashboardWidgets)
      .where(
        and(
          eq(dashboardWidgets.id, widgetId),
          eq(dashboardWidgets.tenantId, this.tenantId)
        )
      )
      .limit(1);

    return widget;
  }

  async createWidget(
    data: Omit<InsertDashboardWidget, 'tenantId'>
  ): Promise<DashboardWidget> {
    const [widget] = await db
      .insert(dashboardWidgets)
      .values({ ...data, tenantId: this.tenantId })
      .returning();

    return widget;
  }

  async updateWidget(
    widgetId: string,
    data: Partial<InsertDashboardWidget>
  ): Promise<DashboardWidget | undefined> {
    const [widget] = await db
      .update(dashboardWidgets)
      .set({ ...data, tenantId: this.tenantId })
      .where(
        and(
          eq(dashboardWidgets.id, widgetId),
          eq(dashboardWidgets.tenantId, this.tenantId)
        )
      )
      .returning();

    return widget;
  }

  async deleteWidget(widgetId: string): Promise<boolean> {
    const result = await db
      .delete(dashboardWidgets)
      .where(
        and(
          eq(dashboardWidgets.id, widgetId),
          eq(dashboardWidgets.tenantId, this.tenantId)
        )
      );

    return result.rowCount !== null && result.rowCount > 0;
  }

  // ==================== ACTIVITY LOGS ====================

  async logActivity(
    data: Omit<InsertActivityLog, 'tenantId'>
  ): Promise<ActivityLog> {
    const [log] = await db
      .insert(activityLogs)
      .values({ ...data, tenantId: this.tenantId })
      .returning();

    return log;
  }

  async getActivityLogs(limit = 100): Promise<ActivityLog[]> {
    return db
      .select()
      .from(activityLogs)
      .where(eq(activityLogs.tenantId, this.tenantId))
      .limit(limit)
      .orderBy(activityLogs.createdAt);
  }

  async getActivityLogsByUser(userId: string, limit = 50): Promise<ActivityLog[]> {
    return db
      .select()
      .from(activityLogs)
      .where(
        and(
          eq(activityLogs.tenantId, this.tenantId),
          eq(activityLogs.userId, userId)
        )
      )
      .limit(limit)
      .orderBy(activityLogs.createdAt);
  }
}

/**
 * Helper function to create a tenant-scoped database instance
 */
export function createTenantDb(tenantId: string): TenantDatabase {
  return new TenantDatabase(tenantId);
}
