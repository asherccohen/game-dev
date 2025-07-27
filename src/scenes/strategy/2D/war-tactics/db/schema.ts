import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const units = sqliteTable('units', {
  id: text('id').primaryKey(),
  type: text('type').notNull(),
  name: text('name').notNull(),
  position: text('position').notNull(),
  morale: integer('morale').notNull(),
  supplies: integer('supplies').notNull(),
  readiness: integer('readiness').notNull(),
  initiative: integer('initiative').notNull(),
  status: text('status').notNull(),
});

export const terrain = sqliteTable('terrain', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type').notNull(),
  cover: integer('cover').notNull(),
});

export const terrainConnections = sqliteTable('terrain_connections', {
  id: text('id').primaryKey(),
  fromId: text('from_id')
    .notNull()
    .references(() => terrain.id),
  toId: text('to_id')
    .notNull()
    .references(() => terrain.id),
});

export const gameState = sqliteTable('game_state', {
  id: text('id').primaryKey(),
  time: text('time').notNull(),
  weather: text('weather').notNull(),
  visibility: text('visibility').notNull(),
  communications: text('communications').notNull(),
});
