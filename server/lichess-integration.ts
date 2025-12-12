import { getDb } from "./db";
import { puzzles, puzzleThemes } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const LICHESS_API_BASE = "https://lichess.org/api";

interface LichessPuzzle {
  id: string;
  fen: string;
  moves: string[];
  rating: number;
  popularity: number;
  themes: string[];
}

/**
 * Fetch puzzles from Lichess API
 */
export async function fetchLichessPuzzles(count: number = 100, minRating: number = 1000) {
  try {
    const response = await fetch(`${LICHESS_API_BASE}/puzzles/daily`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Lichess API error: ${response.statusText}`);
    }

    const data = (await response.json()) as LichessPuzzle;
    return data;
  } catch (error) {
    console.error("[Lichess] Error fetching puzzles:", error);
    return null;
  }
}

/**
 * Sync puzzles from Lichess to local database
 */
export async function syncLichessPuzzles() {
  const db = await getDb();
  if (!db) {
    console.warn("[Lichess] Cannot sync: database not available");
    return { success: false, count: 0 };
  }

  try {
    // Fetch daily puzzle from Lichess
    const puzzle = await fetchLichessPuzzles();
    if (!puzzle) {
      return { success: false, count: 0 };
    }

    // Map Lichess themes to local theme IDs
    const themeMap: Record<string, number> = {
      tactics: 1,
      strategy: 2,
      endgame: 3,
      opening: 4,
      checkmate: 5,
      fork: 6,
      pin: 6,
      skewer: 6,
    };

    // Get or create theme for this puzzle
    let themeId = 1; // Default to tactics
    for (const lichessTheme of puzzle.themes) {
      if (themeMap[lichessTheme]) {
        themeId = themeMap[lichessTheme];
        break;
      }
    }

    // Check if puzzle already exists
    const existing = await db
      .select()
      .from(puzzles)
      .where(eq(puzzles.sourceId, puzzle.id))
      .limit(1);

    if (existing.length === 0) {
      // Insert new puzzle
      await db.insert(puzzles).values({
        sourceId: puzzle.id,
        source: "lichess",
        fen: puzzle.fen,
        moves: JSON.stringify(puzzle.moves),
        solution: puzzle.moves[0] || "",
        difficulty: puzzle.rating < 1200 ? "beginner" : puzzle.rating < 1600 ? "intermediate" : "advanced",
        rating: puzzle.rating,
        themeId: themeId,
      });

      console.log(`[Lichess] Synced puzzle ${puzzle.id}`);
      return { success: true, count: 1 };
    }

    return { success: true, count: 0 };
  } catch (error) {
    console.error("[Lichess] Error syncing puzzles:", error);
    return { success: false, count: 0 };
  }
}

/**
 * Batch sync puzzles from Lichess
 */
export async function batchSyncLichessPuzzles(count: number = 10) {
  const db = await getDb();
  if (!db) {
    console.warn("[Lichess] Cannot batch sync: database not available");
    return { success: false, total: 0 };
  }

  let total = 0;

  for (let i = 0; i < count; i++) {
    const result = await syncLichessPuzzles();
    if (result.success) {
      total += result.count;
    }

    // Add delay between requests to respect API rate limits
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log(`[Lichess] Batch sync completed: ${total} puzzles added`);
  return { success: true, total };
}

/**
 * Get puzzle statistics from Lichess
 */
export async function getLichessPuzzleStats() {
  try {
    const response = await fetch(`${LICHESS_API_BASE}/puzzle/activity`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Lichess API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("[Lichess] Error fetching stats:", error);
    return null;
  }
}
