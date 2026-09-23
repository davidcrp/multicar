import {
  boolean,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const cars = pgTable(
  'cars',
  {
    id: serial('id').primaryKey(),
    slug: varchar('slug', { length: 120 }).notNull().unique(),
    marca: varchar('marca', { length: 60 }).notNull(),
    modelo: varchar('modelo', { length: 60 }).notNull(),
    versao: varchar('versao', { length: 160 }).notNull().default(''),
    cor: varchar('cor', { length: 20 }).notNull(),
    preco: integer('preco').notNull(),
    fipe: integer('fipe'),
    media: integer('media'),
    anoFabricacao: integer('ano_fabricacao').notNull(),
    anoModelo: integer('ano_modelo').notNull(),
    km: integer('km').notNull(),
    cambio: varchar('cambio', { length: 30 }).notNull(),
    carroceria: varchar('carroceria', { length: 30 }).notNull(),
    combustivel: varchar('combustivel', { length: 30 }).notNull(),
    finalPlaca: integer('final_placa'),
    aceitaTroca: boolean('aceita_troca').notNull().default(false),
    unicoDono: boolean('unico_dono').notNull().default(false),
    ipvaPago: boolean('ipva_pago').notNull().default(false),
    licenciado: boolean('licenciado').notNull().default(false),
    revisoes: boolean('revisoes').notNull().default(false),
    itens: text('itens').array().notNull().default([]),
    descricao: text('descricao').notNull().default(''),
    fotos: text('fotos').array().notNull().default([]),
    ativo: boolean('ativo').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('cars_ativo_idx').on(t.ativo)],
);

export const leads = pgTable(
  'leads',
  {
    id: serial('id').primaryKey(),
    carId: integer('car_id').references(() => cars.id, { onDelete: 'set null' }),
    carNome: varchar('car_nome', { length: 200 }),
    nome: varchar('nome', { length: 100 }).notNull(),
    email: varchar('email', { length: 160 }).notNull(),
    telefone: varchar('telefone', { length: 30 }).notNull(),
    mensagem: text('mensagem').notNull(),
    aceitaOfertas: boolean('aceita_ofertas').notNull().default(false),
    lido: boolean('lido').notNull().default(false),
    ipHash: varchar('ip_hash', { length: 64 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('leads_ip_created_idx').on(t.ipHash, t.createdAt)],
);

// Tentativas de login — usado para bloquear força bruta.
export const loginAttempts = pgTable(
  'login_attempts',
  {
    id: serial('id').primaryKey(),
    ipHash: varchar('ip_hash', { length: 64 }).notNull(),
    success: boolean('success').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('login_ip_created_idx').on(t.ipHash, t.createdAt)],
);

export type Car = typeof cars.$inferSelect;
export type NewCar = typeof cars.$inferInsert;
export type Lead = typeof leads.$inferSelect;
