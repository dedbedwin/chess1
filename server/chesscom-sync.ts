import { getDb } from "./db";
import { chesscomProfiles, importedGames } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const CHESSCOM_API_BASE = "https://api.chess.com/pub";

interface ChessComProfile {
  username: string;
  avatar?: string;
  title?: string;
  followers: number;
  country?: string;
  last_online: number;
  joined: number;
  status: string;
  name?: string;
  location?: string;
  fide?: number;
}

interface ChessComStats {
  chess_blitz?: {
    last?: { rating: number; date: number };
    best?: { rating: number; date: number };
    record?: { wins: number; losses: number; draws: number };
    wins?: number;
    losses?: number;
    draws?: number;
  };
  chess_bullet?: {
    last?: { rating: number; date: number };
    best?: { rating: number; date: number };
    record?: { wins: number; losses: number; draws: number };
    wins?: number;
    losses?: number;
    draws?: number;
  };
  chess_rapid?: {
    last?: { rating: number; date: number };
    best?: { rating: number; date: number };
    record?: { wins: number; losses: number; draws: number };
    wins?: number;
    losses?: number;
    draws?: number;
  };
  chess_daily?: {
    last?: { rating: number; date: number };
    best?: { rating: number; date: number };
    record?: { wins: number; losses: number; draws: number };
    wins?: number;
    losses?: number;
    draws?: number;
  };
}

interface ChessComGame {
  url: string;
  pgn: string;
  time_class: string;
  rules: string;
  white: { username: string; rating: number; result: string };
  black: { username: string; rating: number; result: string };
  end_time: number;
}

/**
 * Fetch player profile from Chess.com
 */
export async function fetchChessComProfile(username: string) {
  try {
    const response = await fetch(`${CHESSCOM_API_BASE}/player/${username}`, {
      headers: {
        "User-Agent": "ChessCoach/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`Chess.com API error: ${response.statusText}`);
    }

    const data = (await response.json()) as ChessComProfile;
    return data;
  } catch (error) {
    console.error("[Chess.com] Error fetching profile:", error);
    return null;
  }
}

/**
 * Fetch player stats from Chess.com
 */
export async function fetchChessComStats(username: string) {
  try {
    const response = await fetch(`${CHESSCOM_API_BASE}/player/${username}/stats`, {
      headers: {
        "User-Agent": "ChessCoach/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`Chess.com API error: ${response.statusText}`);
    }

    const data = (await response.json()) as ChessComStats;
    return data;
  } catch (error) {
    console.error("[Chess.com] Error fetching stats:", error);
    return null;
  }
}

/**
 * Fetch recent games from Chess.com
 */
export async function fetchChessComGames(username: string, year?: number, month?: number) {
  try {
    let url = `${CHESSCOM_API_BASE}/player/${username}/games`;

    if (year && month) {
      url += `/${year}/${String(month).padStart(2, "0")}`;
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent": "ChessCoach/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`Chess.com API error: ${response.statusText}`);
    }

    const data = (await response.json()) as { games: ChessComGame[] };
    return data.games;
  } catch (error) {
    console.error("[Chess.com] Error fetching games:", error);
    return [];
  }
}

/**
 * Sync Chess.com profile and stats to database
 */
export async function syncChessComProfile(userId: number, username: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Chess.com] Cannot sync: database not available");
    return { success: false };
  }

  try {
    // Fetch profile and stats
    const profile = await fetchChessComProfile(username);
    const stats = await fetchChessComStats(username);

    if (!profile || !stats) {
      return { success: false };
    }

    // Extract ratings
    const bulletRating = stats.chess_bullet?.last?.rating || 0;
    const blitzRating = stats.chess_blitz?.last?.rating || 0;
    const rapidRating = stats.chess_rapid?.last?.rating || 0;
    const dailyRating = stats.chess_daily?.last?.rating || 0;

    // Check if profile already exists
    const existing = await db
      .select()
      .from(chesscomProfiles)
      .where(eq(chesscomProfiles.userId, userId))
      .limit(1);

    if (existing.length > 0) {
      // Update existing profile
      await db
        .update(chesscomProfiles)
        .set({
          chesscomUsername: username,
          bulletRating,
          blitzRating,
          rapidRating,
          dailyRating,
          avatar: profile.avatar,
          lastSyncedAt: new Date(),
        })
        .where(eq(chesscomProfiles.userId, userId));
    } else {
      // Create new profile
      await db.insert(chesscomProfiles).values({
        userId,
        chesscomUsername: username,
        bulletRating,
        blitzRating,
        rapidRating,
        dailyRating,
        avatar: profile.avatar,
        lastSyncedAt: new Date(),
      });
    }

    console.log(`[Chess.com] Synced profile for ${username}`);
    return { success: true };
  } catch (error) {
    console.error("[Chess.com] Error syncing profile:", error);
    return { success: false };
  }
}

/**
 * Sync recent games from Chess.com
 */
export async function syncChessComGames(userId: number, username: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Chess.com] Cannot sync games: database not available");
    return { success: false, count: 0 };
  }

  try {
    // Get current date
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    // Fetch games from current month
    const games = await fetchChessComGames(username, year, month);

    if (!games || games.length === 0) {
      return { success: true, count: 0 };
    }

    let importedCount = 0;

    for (const game of games) {
      // Check if game already exists
      const existing = await db
        .select()
        .from(importedGames)
        .where(eq(importedGames.chesscomGameId, game.url))
        .limit(1);

      if (existing.length === 0) {
        // Import new game
        await db.insert(importedGames).values({
          userId,
          chesscomGameId: game.url,
          pgn: game.pgn,
          moves: "",
          whiteUsername: game.white.username,
          blackUsername: game.black.username,
          result: game.white.result as "win" | "loss" | "draw",
          timeControl: game.time_class,
          playedAt: new Date(game.end_time * 1000),
        });

        importedCount++;
      }
    }

    console.log(`[Chess.com] Imported ${importedCount} new games for ${username}`);
    return { success: true, count: importedCount };
  } catch (error) {
    console.error("[Chess.com] Error syncing games:", error);
    return { success: false, count: 0 };
  }
}

/**
 * Periodic sync of Chess.com data (call this from a cron job or interval)
 */
export async function periodicChessComSync() {
  const db = await getDb();
  if (!db) {
    console.warn("[Chess.com] Cannot run periodic sync: database not available");
    return;
  }

  try {
    // Get all linked Chess.com profiles
    const profiles = await db.select().from(chesscomProfiles);

    for (const profile of profiles) {
      // Sync profile data
      await syncChessComProfile(profile.userId, profile.chesscomUsername);

      // Sync recent games
      await syncChessComGames(profile.userId, profile.chesscomUsername);

      // Add delay between requests to respect API rate limits
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log("[Chess.com] Periodic sync completed");
  } catch (error) {
    console.error("[Chess.com] Error in periodic sync:", error);
  }
}
