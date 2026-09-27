import { Router, type IRouter } from "express";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db, contactMessagesTable, repairRequestsTable } from "@workspace/db";
import {
  CreateContactMessageBody,
  CreateContactMessageResponse,
  CreateRepairRequestBody,
  CreateRepairRequestResponse,
  DeleteRepairRequestParams,
  GetRepairRequestParams,
  GetRepairRequestResponse,
  ListContactMessagesResponse,
  ListRepairRequestsQueryParams,
  ListRepairRequestsResponse,
  UpdateRepairRequestBody,
  UpdateRepairRequestParams,
  UpdateRepairRequestResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const toRepairRequestResponse = (row: typeof repairRequestsTable.$inferSelect) =>
  ({
    ...row,
    email: row.email ?? null,
    deviceModel: row.deviceModel ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }) as const;

const toContactMessageResponse = (
  row: typeof contactMessagesTable.$inferSelect,
) =>
  ({
    ...row,
    phone: row.phone ?? null,
    email: row.email ?? null,
    createdAt: row.createdAt.toISOString(),
  }) as const;

router.get("/repair-requests", async (req, res): Promise<void> => {
  const query = ListRepairRequestsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const filters = [];
  if (query.data.status) {
    filters.push(eq(repairRequestsTable.status, query.data.status));
  }
  if (query.data.search) {
    const term = `%${query.data.search}%`;
    filters.push(
      or(
        ilike(repairRequestsTable.customerName, term),
        ilike(repairRequestsTable.phone, term),
        ilike(repairRequestsTable.deviceType, term),
        ilike(repairRequestsTable.service, term),
      ),
    );
  }

  const rows = await db
    .select()
    .from(repairRequestsTable)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(desc(repairRequestsTable.createdAt));

  res.json(ListRepairRequestsResponse.parse(rows.map(toRepairRequestResponse)));
});

router.post("/repair-requests", async (req, res): Promise<void> => {
  const parsed = CreateRepairRequestBody.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db
  .insert(repairRequestsTable)
  .values({
    customerName: parsed.data.customerName.trim(),
    phone: parsed.data.phone.trim(),
    email: parsed.data.email ?? null,
    deviceType: parsed.data.deviceType.trim(),
    deviceModel: parsed.data.deviceModel?.trim() || null,
    service: parsed.data.service.trim(),
    problemDescription: parsed.data.problemDescription.trim(),
    status: "Pending",
  })
  .returning();

res
  .status(201)
  .json(CreateRepairRequestResponse.parse(toRepairRequestResponse(row)));
});

router.get("/repair-requests/:id", async (req, res): Promise<void> => {
  const params = GetRepairRequestParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db
    .select()
    .from(repairRequestsTable)
    .where(eq(repairRequestsTable.id, params.data.id));
  if (!row) {
    res.status(404).json({ error: "Repair request not found" });
    return;
  }
  res.json(GetRepairRequestResponse.parse(toRepairRequestResponse(row)));
});

router.patch("/repair-requests/:id", async (req, res): Promise<void> => {
  const params = UpdateRepairRequestParams.safeParse(req.params);
  const body = UpdateRepairRequestBody.safeParse(req.body);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [row] = await db
    .update(repairRequestsTable)
    .set({ status: body.data.status, updatedAt: new Date() })
    .where(eq(repairRequestsTable.id, params.data.id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Repair request not found" });
    return;
  }
  res.json(UpdateRepairRequestResponse.parse(toRepairRequestResponse(row)));
});

router.delete("/repair-requests/:id", async (req, res): Promise<void> => {
  const params = DeleteRepairRequestParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await db
    .delete(repairRequestsTable)
    .where(eq(repairRequestsTable.id, params.data.id))
    .returning({ id: repairRequestsTable.id });
  if (!row) {
    res.status(404).json({ error: "Repair request not found" });
    return;
  }
  res.sendStatus(204);
});

router.get("/contact", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(contactMessagesTable)
    .orderBy(desc(contactMessagesTable.createdAt));
  res.json(ListContactMessagesResponse.parse(rows.map(toContactMessageResponse)));
});

router.post("/contact", async (req, res): Promise<void> => {
  const parsed = CreateContactMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db
    .insert(contactMessagesTable)
    .values({
      name: parsed.data.name.trim(),
      phone: parsed.data.phone?.trim() || null,
      email: parsed.data.email ?? null,
      message: parsed.data.message.trim(),
      status: "Unread",
    })
    .returning();
  res.status(201).json(CreateContactMessageResponse.parse(toContactMessageResponse(row)));
});

router.get("/operations/summary", async (_req, res): Promise<void> => {
  const [repairTotals] = await db
    .select({
      total: sql<number>`count(*)::int`,
      pending: sql<number>`count(*) filter (where ${repairRequestsTable.status} = 'Pending')::int`,
      contacted: sql<number>`count(*) filter (where ${repairRequestsTable.status} = 'Contacted')::int`,
      inProgress: sql<number>`count(*) filter (where ${repairRequestsTable.status} = 'In Progress')::int`,
      completed: sql<number>`count(*) filter (where ${repairRequestsTable.status} = 'Completed')::int`,
    })
    .from(repairRequestsTable);
  const [messageTotals] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(contactMessagesTable);

  res.json({
    totalRepairRequests: repairTotals?.total ?? 0,
    pending: repairTotals?.pending ?? 0,
    contacted: repairTotals?.contacted ?? 0,
    inProgress: repairTotals?.inProgress ?? 0,
    completed: repairTotals?.completed ?? 0,
    totalMessages: messageTotals?.total ?? 0,
  });
});

export default router;