import express from 'express';
import { db } from '../storage';
import { clients, type InsertClient } from '../../shared/schema';
import { eq, and, desc } from 'drizzle-orm';
import { requireTenant } from '../middleware/tenant';
import { createTenantDb } from '../lib/tenant-db';

const router = express.Router();

// All client routes require tenant context
router.use(requireTenant);

/**
 * GET /api/clients
 * Get all clients for the current tenant
 */
router.get('/', async (req, res) => {
  try {
    const tenantClients = await db
      .select()
      .from(clients)
      .where(eq(clients.tenantId, req.tenantId!))
      .orderBy(desc(clients.createdAt));

    res.json(tenantClients);
  } catch (error: any) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/clients/:id
 * Get a specific client by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [client] = await db
      .select()
      .from(clients)
      .where(and(eq(clients.id, id), eq(clients.tenantId, req.tenantId!)))
      .limit(1);

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json(client);
  } catch (error: any) {
    console.error('Error fetching client:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/clients
 * Create a new client
 */
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, company, status, customFields } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    // Check client limit based on subscription tier
    const tenantDb = createTenantDb(req.tenantId!);
    const clientCount = await tenantDb.countClients();

    // Get tenant limits
    const [tenant] = await db
      .select()
      .from(require('../../shared/schema').tenants)
      .where(eq(require('../../shared/schema').tenants.id, req.tenantId!))
      .limit(1);

    if (tenant.maxClients && clientCount >= tenant.maxClients) {
      return res.status(403).json({
        error: 'Client limit reached',
        message: `Your current plan allows ${tenant.maxClients} clients. Please upgrade to add more.`,
        current: clientCount,
        max: tenant.maxClients,
      });
    }

    // Create client
    const [newClient] = await db
      .insert(clients)
      .values({
        tenantId: req.tenantId!,
        name,
        email: email || null,
        phone: phone || null,
        company: company || null,
        status: status || 'active',
        customFields: customFields || {},
      } as InsertClient)
      .returning();

    // Log activity
    await tenantDb.logActivity({
      action: 'client.created',
      resource: 'client',
      resourceId: newClient.id,
      details: { name },
    });

    res.status(201).json(newClient);
  } catch (error: any) {
    console.error('Error creating client:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PATCH /api/clients/:id
 * Update a client
 */
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, company, status, customFields } = req.body;

    // Check if client exists and belongs to tenant
    const [existing] = await db
      .select()
      .from(clients)
      .where(and(eq(clients.id, id), eq(clients.tenantId, req.tenantId!)))
      .limit(1);

    if (!existing) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // Build update object
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email || null;
    if (phone !== undefined) updateData.phone = phone || null;
    if (company !== undefined) updateData.company = company || null;
    if (status !== undefined) updateData.status = status;
    if (customFields !== undefined) updateData.customFields = customFields;

    // Update client
    const [updated] = await db
      .update(clients)
      .set(updateData)
      .where(and(eq(clients.id, id), eq(clients.tenantId, req.tenantId!)))
      .returning();

    // Log activity
    const tenantDb = createTenantDb(req.tenantId!);
    await tenantDb.logActivity({
      action: 'client.updated',
      resource: 'client',
      resourceId: id,
      details: { fields: Object.keys(updateData) },
    });

    res.json(updated);
  } catch (error: any) {
    console.error('Error updating client:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/clients/:id
 * Delete a client
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if client exists and belongs to tenant
    const [existing] = await db
      .select()
      .from(clients)
      .where(and(eq(clients.id, id), eq(clients.tenantId, req.tenantId!)))
      .limit(1);

    if (!existing) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // Delete client
    await db
      .delete(clients)
      .where(and(eq(clients.id, id), eq(clients.tenantId, req.tenantId!)));

    // Log activity
    const tenantDb = createTenantDb(req.tenantId!);
    await tenantDb.logActivity({
      action: 'client.deleted',
      resource: 'client',
      resourceId: id,
      details: { name: existing.name },
    });

    res.json({ success: true, message: 'Client deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/clients/stats/summary
 * Get client statistics
 */
router.get('/stats/summary', async (req, res) => {
  try {
    const tenantDb = createTenantDb(req.tenantId!);
    const allClients = await db
      .select()
      .from(clients)
      .where(eq(clients.tenantId, req.tenantId!));

    const stats = {
      total: allClients.length,
      active: allClients.filter((c) => c.status === 'active').length,
      inactive: allClients.filter((c) => c.status === 'inactive').length,
      churned: allClients.filter((c) => c.status === 'churned').length,
    };

    res.json(stats);
  } catch (error: any) {
    console.error('Error fetching client stats:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
