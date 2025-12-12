import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
  decimal,
  json,
} from "drizzle-orm/mysql-core";

/**
 * Puzzle themes/categories
 */
export const puzzleThemes = mysqlTable("puzzle_themes", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  icon: varchar("icon", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PuzzleTheme = typeof puzzleThemes.$inferSelect;
export type InsertPuzzleTheme = typeof puzzleThemes.$inferInsert;

/**
 * Chess puzzles database
 */
export const puzzles = mysqlTable("puzzles", {
  id: int("id").autoincrement().primaryKey(),
  fen: text("fen").notNull(), // Starting position
  moves: text("moves").notNull(), // JSON array of moves
  solution: text("solution").notNull(), // Correct move sequence
  difficulty: mysqlEnum("difficulty", ["beginner", "intermediate", "advanced", "expert"]).default(
    "intermediate"
  ),
  rating: int("rating"), // Puzzle rating/ELO
  themeId: int("themeId").references(() => puzzleThemes.id),
  description: text("description"),
  source: varchar("source", { length: 100 }), // e.g., "lichess", "custom"
  sourceId: varchar("sourceId", { length: 100 }), // External puzzle ID
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Puzzle = typeof puzzles.$inferSelect;
export type InsertPuzzle = typeof puzzles.$inferInsert;

/**
 * User puzzle attempts/statistics
 */
export const userPuzzleAttempts = mysqlTable("user_puzzle_attempts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  puzzleId: int("puzzleId").notNull().references(() => puzzles.id),
  solved: boolean("solved").default(false),
  attempts: int("attempts").default(1),
  timeSpent: int("timeSpent"), // milliseconds
  accuracy: decimal("accuracy", { precision: 5, scale: 2 }), // 0-100
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserPuzzleAttempt = typeof userPuzzleAttempts.$inferSelect;
export type InsertUserPuzzleAttempt = typeof userPuzzleAttempts.$inferInsert;

/**
 * Opening book database for Stockfish
 */
export const openingBooks = mysqlTable("opening_books", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  fileUrl: text("fileUrl").notNull(), // S3 URL to book file
  fileSize: int("fileSize"), // bytes
  format: mysqlEnum("format", ["polyglot", "ctg", "bin"]).default("polyglot"),
  moves: int("moves"), // Number of positions in book
  uploadedBy: int("uploadedBy"), // User ID
  isPublic: boolean("isPublic").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type OpeningBook = typeof openingBooks.$inferSelect;
export type InsertOpeningBook = typeof openingBooks.$inferInsert;

/**
 * Chess.com integration data
 */
export const chesscomProfiles = mysqlTable("chesscom_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  chesscomUsername: varchar("chesscomUsername", { length: 100 }).notNull().unique(),
  chesscomUrl: text("chesscomUrl"),
  blitzRating: int("blitzRating"),
  rapidRating: int("rapidRating"),
  bulletRating: int("bulletRating"),
  dailyRating: int("dailyRating"),
  avatar: text("avatar"),
  lastSyncedAt: timestamp("lastSyncedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ChesscomProfile = typeof chesscomProfiles.$inferSelect;
export type InsertChesscomProfile = typeof chesscomProfiles.$inferInsert;

/**
 * Imported games from Chess.com
 */
export const importedGames = mysqlTable("imported_games", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  chesscomGameId: varchar("chesscomGameId", { length: 100 }).notNull(),
  pgn: text("pgn").notNull(),
  fen: text("fen"),
  moves: text("moves").notNull(), // JSON array
  whiteUsername: varchar("whiteUsername", { length: 100 }),
  blackUsername: varchar("blackUsername", { length: 100 }),
  result: mysqlEnum("result", ["win", "loss", "draw"]),
  timeControl: varchar("timeControl", { length: 50 }),
  playedAt: timestamp("playedAt"),
  analyzed: boolean("analyzed").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ImportedGame = typeof importedGames.$inferSelect;
export type InsertImportedGame = typeof importedGames.$inferInsert;
