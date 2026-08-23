import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, integer, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const items = pgTable("items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  quantity: integer("quantity").notNull().default(0),
  flow: real("flow").notNull(),
  description: text("description"),
  power: real("power"),
  weight: real("weight"),
  speed: real("speed"),
  displayOrder: integer("display_order").notNull().default(0),
});

export const insertItemSchema = createInsertSchema(items).omit({
  id: true,
  displayOrder: true,
});

export const updateItemSchema = insertItemSchema;

export type InsertItem = z.infer<typeof insertItemSchema>;
export type UpdateItem = z.infer<typeof updateItemSchema>;
export type Item = typeof items.$inferSelect;

export const sales = pgTable("sales", {
  id: serial("id").primaryKey(),
  itemId: integer("item_id").notNull(),
  itemName: text("item_name").notNull(),
  quantitySold: integer("quantity_sold").notNull(),
  flow: real("flow").notNull(),
  description: text("description"),
  power: real("power"),
  weight: real("weight"),
  speed: real("speed"),
  saleDate: timestamp("sale_date").notNull().defaultNow(),
});

export const insertSaleSchema = createInsertSchema(sales).omit({
  id: true,
  saleDate: true,
});

export type InsertSale = z.infer<typeof insertSaleSchema>;
export type Sale = typeof sales.$inferSelect;
