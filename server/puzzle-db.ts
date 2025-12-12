import { eq, and } from "drizzle-orm";
import { puzzles, puzzleThemes, userPuzzleAttempts } from "../drizzle/schema";
import { getDb } from "./db";

/**
 * Get all puzzle themes
 */
export async function getPuzzleThemes() {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(puzzleThemes);
  } catch (error) {
    console.error("[Puzzle] Error getting themes:", error);
    return [];
  }
}

/**
 * Get puzzles by theme
 */
export async function getPuzzlesByTheme(themeId: number, limit: number = 10) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(puzzles)
      .where(eq(puzzles.themeId, themeId))
      .limit(limit);
  } catch (error) {
    console.error("[Puzzle] Error getting puzzles by theme:", error);
    return [];
  }
}

/**
 * Get random puzzle by difficulty
 */
export async function getRandomPuzzle(difficulty?: string) {
  const db = await getDb();
  if (!db) return null;

  try {
    if (difficulty) {
      const result = await db
        .select()
        .from(puzzles)
        .where(eq(puzzles.difficulty, difficulty as any))
        .limit(1);
      return result.length > 0 ? result[0] : null;
    } else {
      const result = await db.select().from(puzzles).limit(1);
      return result.length > 0 ? result[0] : null;
    }
  } catch (error) {
    console.error("[Puzzle] Error getting random puzzle:", error);
    return null;
  }
}

/**
 * Record puzzle attempt
 */
export async function recordPuzzleAttempt(
  userId: number,
  puzzleId: number,
  solved: boolean,
  timeSpent: number,
  accuracy: number
) {
  const db = await getDb();
  if (!db) return null;

  try {
    // Check if attempt already exists
    const existing = await db
      .select()
      .from(userPuzzleAttempts)
      .where(and(eq(userPuzzleAttempts.userId, userId), eq(userPuzzleAttempts.puzzleId, puzzleId)))
      .limit(1);

    if (existing.length > 0) {
      // Update existing attempt
      const existingAttempts = existing[0].attempts || 0;
      const existingTime = existing[0].timeSpent || 0;
      await db
        .update(userPuzzleAttempts)
        .set({
          solved,
          attempts: existingAttempts + 1,
          timeSpent: existingTime + timeSpent,
          accuracy: accuracy.toString(),
        })
        .where(eq(userPuzzleAttempts.id, existing[0].id));
    } else {
      // Create new attempt
      await db.insert(userPuzzleAttempts).values({
        userId,
        puzzleId,
        solved,
        attempts: 1,
        timeSpent,
        accuracy: accuracy.toString(),
      });
    }

    return { success: true };
  } catch (error) {
    console.error("[Puzzle] Error recording attempt:", error);
    return null;
  }
}

/**
 * Get user puzzle statistics
 */
export async function getUserPuzzleStats(userId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const attempts = await db
      .select()
      .from(userPuzzleAttempts)
      .where(eq(userPuzzleAttempts.userId, userId));

    const solved = attempts.filter((a) => a.solved).length;
    const total = attempts.length;
    const avgAccuracy =
      attempts.length > 0
        ? attempts.reduce((sum, a) => sum + (parseFloat(a.accuracy as any) || 0), 0) / attempts.length
        : 0;

    return {
      solved,
      total,
      accuracy: Math.round(avgAccuracy),
      attempts: attempts.length,
    };
  } catch (error) {
    console.error("[Puzzle] Error getting stats:", error);
    return null;
  }
}

/**
 * Create puzzle theme
 */
export async function createPuzzleTheme(name: string, description?: string, icon?: string) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(puzzleThemes).values({
      name,
      description,
      icon,
    });

    return { success: true };
  } catch (error) {
    console.error("[Puzzle] Error creating theme:", error);
    return null;
  }
}

/**
 * Add puzzle to database
 */
export async function addPuzzle(
  fen: string,
  moves: string[],
  solution: string,
  difficulty: string,
  themeId?: number,
  description?: string,
  source?: string,
  sourceId?: string
) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(puzzles).values({
      fen,
      moves: JSON.stringify(moves),
      solution,
      difficulty: difficulty as any,
      themeId,
      description,
      source,
      sourceId,
    });

    return { success: true };
  } catch (error) {
    console.error("[Puzzle] Error adding puzzle:", error);
    return null;
  }
}
