import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
  decimal,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

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
  fen: text("fen").notNull(),
  moves: text("moves").notNull(),
  solution: text("solution").notNull(),
  difficulty: mysqlEnum("difficulty", ["beginner", "intermediate", "advanced", "expert"]).default(
    "intermediate"
  ),
  rating: int("rating"),
  themeId: int("themeId").references(() => puzzleThemes.id),
  description: text("description"),
  source: varchar("source", { length: 100 }),
  sourceId: varchar("sourceId", { length: 100 }),
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
  timeSpent: int("timeSpent"),
  accuracy: decimal("accuracy", { precision: 5, scale: 2 }),
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
  fileUrl: text("fileUrl").notNull(),
  fileSize: int("fileSize"),
  format: mysqlEnum("format", ["polyglot", "ctg", "bin"]).default("polyglot"),
  moves: int("moves"),
  uploadedBy: int("uploadedBy"),
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
  moves: text("moves").notNull(),
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

/**
 * User appearance and preferences
 */
export const userSettings = mysqlTable("user_settings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  boardTheme: varchar("board_theme", { length: 50 }).default("green").notNull(),
  pieceSet: varchar("piece_set", { length: 50 }).default("classic").notNull(),
  language: varchar("language", { length: 10 }).default("en").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type UserSettings = typeof userSettings.$inferSelect;
export type InsertUserSettings = typeof userSettings.$inferInsert;

/**
 * Chess games played by users
 */
export const games = mysqlTable("games", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  opponentType: mysqlEnum("opponent_type", ["bot", "coach"]).notNull(),
  opponentName: varchar("opponent_name", { length: 100 }).notNull(),
  opponentRating: int("opponent_rating"),
  playerColor: mysqlEnum("player_color", ["white", "black"]).notNull(),
  result: mysqlEnum("result", ["win", "loss", "draw", "ongoing"]).default("ongoing").notNull(),
  pgn: text("pgn").notNull(),
  fen: text("fen").notNull(),
  moves: text("moves").notNull(), // JSON array of moves
  startedAt: timestamp("started_at").defaultNow().notNull(),
  endedAt: timestamp("ended_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Game = typeof games.$inferSelect;
export type InsertGame = typeof games.$inferInsert;

/**
 * Post-game analysis with move evaluations
 */
export const gameAnalysis = mysqlTable("game_analysis", {
  id: int("id").autoincrement().primaryKey(),
  gameId: int("game_id").notNull().references(() => games.id, { onDelete: "cascade" }),
  moveNumber: int("move_number").notNull(),
  move: varchar("move", { length: 20 }).notNull(),
  evaluation: int("evaluation"), // Centipawn score
  marker: mysqlEnum("marker", ["brilliant", "excellent", "good", "book", "inaccuracy", "mistake", "blunder"]),
  bestMove: varchar("best_move", { length: 20 }),
  comment: text("comment"), // AI-generated comment
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type GameAnalysis = typeof gameAnalysis.$inferSelect;
export type InsertGameAnalysis = typeof gameAnalysis.$inferInsert;

/**
 * Coach chat history for interactive coaching sessions
 */
export const coachChats = mysqlTable("coach_chats", {
  id: int("id").autoincrement().primaryKey(),
  gameId: int("game_id").notNull().references(() => games.id, { onDelete: "cascade" }),
  role: mysqlEnum("role", ["user", "coach", "system"]).notNull(),
  message: text("message").notNull(),
  moveNumber: int("move_number"), // Which move this chat is about
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type CoachChat = typeof coachChats.$inferSelect;
export type InsertCoachChat = typeof coachChats.$inferInsert;

/**
 * AI prompts configuration (editable by user)
 */
export const aiPrompts = mysqlTable("ai_prompts", {
  id: int("id").autoincrement().primaryKey(),
  promptKey: varchar("prompt_key", { length: 100 }).notNull().unique(),
  promptText: text("prompt_text").notNull(),
  description: text("description"),
  category: varchar("category", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type AiPrompt = typeof aiPrompts.$inferSelect;
export type InsertAiPrompt = typeof aiPrompts.$inferInsert;