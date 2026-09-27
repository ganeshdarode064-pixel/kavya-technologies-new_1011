import { createInsertSchema } from "drizzle-zod";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const repairRequestsTable = pgTable("repair_requests", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  deviceType: text("device_type").notNull(),
  deviceModel: text("device_model"),
  service: text("service").notNull(),
  problemDescription: text("problem_description").notNull(),
  status: text("status").notNull().default("Pending"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const insertRepairRequestSchema = createInsertSchema(
  repairRequestsTable,
).omit({ id: true, createdAt: true, updatedAt: true });

export type InsertRepairRequest = z.infer<typeof insertRepairRequestSchema>;
export type RepairRequest = typeof repairRequestsTable.$inferSelect;