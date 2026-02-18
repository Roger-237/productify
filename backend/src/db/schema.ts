import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';


export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  imageUrl: text('image_url'),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});


export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  content: text("content").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});


// 🔴 Les relations définissent comment les tables sont connectées entre elles. Cela permet à l'API de requête de Drizzle
// 🔴 de joindre automatiquement les données liées lors de l'utilisation de with: { relationName: true }

// 🔴 Relations Utilisateurs : Un utilisateur peut avoir plusieurs produits et plusieurs commentaires
// 🔴 many() signifie qu'un utilisateur peut avoir plusieurs enregistrements liés

export const usersRelations = relations(users, ({ many }) => ({
  products: many(products), // 🔴 Un utilisateur → plusieurs produits
  comments: many(comments), // 🔴 Un utilisateur → plusieurs commentaires
}));

// Relations Produits : un produit appartient à un utilisateur et peut avoir plusieurs commentaires
// one() signifie un seul enregistrement lié, many() signifie plusieurs enregistrements liés

export const productsRelations = relations(products, ({ one, many }) => ({
  comments: many(comments),
  // fields = la colonne de clé étrangère dans CETTE table (products.userId)
  // references = la colonne de clé primaire dans la TABLE LIÉE (users.id)
  user: one(users, { fields: [products.userId], references: [users.id] }), // un produit → un utilisateur
}));


// Relations Commentaires : Un commentaire appartient à un utilisateur et un produit
export const commentsRelations = relations(comments, ({ one }) => ({
  // comments.userId est la clé étrangère, users.id est la clé primaire
  user: one(users, { fields: [comments.userId], references: [users.id] }), // Un commentaire → un utilisateur
  // comments.productId est la clé étrangère, products.id est la clé primaire
  product: one(products, { fields: [comments.productId], references: [products.id] }), // Un commentaire → un produit
}));

// Inférence de type
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;


