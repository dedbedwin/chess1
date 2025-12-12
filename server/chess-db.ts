import { eq, desc, and } from "drizzle-orm";
import { getDb } from "./db";
import {
  games,
  gameAnalysis,
  coachChats,
  userSettings,
  aiPrompts,
  InsertGame,
  InsertGameAnalysis,
  InsertCoachChat,
  InsertUserSettings,
  InsertAiPrompt,
} from "../drizzle/schema";

// ============ User Settings ============

export async function getUserSettings(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, userId))
    .limit(1);

  return result[0] || null;
}

export async function upsertUserSettings(settings: InsertUserSettings) {
  const db = await getDb();
  if (!db) return null;

  // Get existing settings to merge with new values
  const existing = await getUserSettings(settings.userId);

  const finalSettings: InsertUserSettings = {
    userId: settings.userId,
    boardTheme: settings.boardTheme ?? existing?.boardTheme ?? "green",
    pieceSet: settings.pieceSet ?? existing?.pieceSet ?? "classic",
    language: settings.language ?? existing?.language ?? "en",
  };

  await db
    .insert(userSettings)
    .values(finalSettings)
    .onDuplicateKeyUpdate({
      set: {
        boardTheme: finalSettings.boardTheme,
        pieceSet: finalSettings.pieceSet,
        language: finalSettings.language,
        updatedAt: new Date(),
      },
    });

  return getUserSettings(settings.userId);
}

// ============ Games ============

export async function createGame(game: InsertGame) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(games).values(game);
  const gameId = Number(result[0].insertId);

  return getGameById(gameId);
}

export async function getGameById(gameId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(games).where(eq(games.id, gameId)).limit(1);

  return result[0] || null;
}

export async function getUserGames(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(games)
    .where(eq(games.userId, userId))
    .orderBy(desc(games.createdAt))
    .limit(limit);
}

export async function updateGame(
  gameId: number,
  updates: {
    result?: "win" | "loss" | "draw" | "ongoing";
    pgn?: string;
    fen?: string;
    moves?: string;
    endedAt?: Date;
  }
) {
  const db = await getDb();
  if (!db) return null;

  await db
    .update(games)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(games.id, gameId));

  return getGameById(gameId);
}

// ============ Game Analysis ============

export async function createGameAnalysis(analysis: InsertGameAnalysis) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(gameAnalysis).values(analysis);
  const analysisId = Number(result[0].insertId);

  const created = await db
    .select()
    .from(gameAnalysis)
    .where(eq(gameAnalysis.id, analysisId))
    .limit(1);

  return created[0] || null;
}

export async function getGameAnalysis(gameId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(gameAnalysis)
    .where(eq(gameAnalysis.gameId, gameId))
    .orderBy(gameAnalysis.moveNumber);
}

export async function createBulkGameAnalysis(analyses: InsertGameAnalysis[]) {
  const db = await getDb();
  if (!db) return;

  if (analyses.length === 0) return;

  await db.insert(gameAnalysis).values(analyses);
}

// ============ Coach Chats ============

export async function createCoachChat(chat: InsertCoachChat) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(coachChats).values(chat);
  const chatId = Number(result[0].insertId);

  const created = await db
    .select()
    .from(coachChats)
    .where(eq(coachChats.id, chatId))
    .limit(1);

  return created[0] || null;
}

export async function getCoachChats(gameId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(coachChats)
    .where(eq(coachChats.gameId, gameId))
    .orderBy(coachChats.createdAt);
}

// ============ AI Prompts ============

export async function getAllAiPrompts() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(aiPrompts).orderBy(aiPrompts.category, aiPrompts.promptKey);
}

export async function getAiPromptByKey(key: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(aiPrompts)
    .where(eq(aiPrompts.promptKey, key))
    .limit(1);

  return result[0] || null;
}

export async function upsertAiPrompt(prompt: InsertAiPrompt) {
  const db = await getDb();
  if (!db) return null;

  await db
    .insert(aiPrompts)
    .values(prompt)
    .onDuplicateKeyUpdate({
      set: {
        promptText: prompt.promptText,
        description: prompt.description,
        category: prompt.category,
        updatedAt: new Date(),
      },
    });

  return getAiPromptByKey(prompt.promptKey);
}

export async function initializeDefaultPrompts() {
  const db = await getDb();
  if (!db) return;

  // Check if prompts already exist
  const existing = await getAllAiPrompts();
  if (existing.length > 0) return;

  // Import default prompts from shared config
  const { COACH_PROMPTS } = await import("../shared/ai-prompts");

  const promptsToInsert: InsertAiPrompt[] = COACH_PROMPTS.map((p) => ({
    promptKey: p.key,
    promptText: p.text,
    description: p.description,
    category: p.category,
  }));

  if (promptsToInsert.length > 0) {
    await db.insert(aiPrompts).values(promptsToInsert);
  }
}
