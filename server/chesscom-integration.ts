import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { chesscomProfiles, importedGames, users } from "../drizzle/schema";
import { getDb } from "./db";
import { ENV } from "./_core/env";

const CHESSCOM_API = "https://api.chess.com/pub";

/**
 * Fetch user profile from Chess.com API
 */
export async function fetchChesscomProfile(username: string) {
  try {
    const response = await fetch(`${CHESSCOM_API}/player/${username}`);
    if (!response.ok) {
      throw new Error(`Chess.com API error: ${response.statusText}`);
    }

    const data = (await response.json()) as any;
    return {
      username: data.username,
      url: data.url,
      avatar: data.avatar,
      name: data.name,
      title: data.title,
    };
  } catch (error) {
    console.error("[ChessCom] Error fetching profile:", error);
    throw error;
  }
}

/**
 * Fetch user stats from Chess.com API
 */
export async function fetchChesscomStats(username: string) {
  try {
    const response = await fetch(`${CHESSCOM_API}/player/${username}/stats`);
    if (!response.ok) {
      throw new Error(`Chess.com API error: ${response.statusText}`);
    }

    const data = (await response.json()) as any;
    return {
      blitzRating: data.chess_blitz?.last?.rating || 0,
      rapidRating: data.chess_rapid?.last?.rating || 0,
      bulletRating: data.chess_bullet?.last?.rating || 0,
      dailyRating: data.chess_daily?.last?.rating || 0,
    };
  } catch (error) {
    console.error("[ChessCom] Error fetching stats:", error);
    throw error;
  }
}

/**
 * Fetch user games from Chess.com API
 */
export async function fetchChesscomGames(username: string, year?: number, month?: number) {
  try {
    let url = `${CHESSCOM_API}/player/${username}/games`;
    if (year && month) {
      url += `/${year}/${String(month).padStart(2, "0")}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Chess.com API error: ${response.statusText}`);
    }

    const data = (await response.json()) as any;
    return data.games || [];
  } catch (error) {
    console.error("[ChessCom] Error fetching games:", error);
    throw error;
  }
}

/**
 * Link Chess.com account to user
 */
export async function linkChesscomAccount(userId: number, chesscomUsername: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    // Fetch profile and stats from Chess.com
    const profile = await fetchChesscomProfile(chesscomUsername);
    const stats = await fetchChesscomStats(chesscomUsername);

    // Upsert Chess.com profile
    await db
      .insert(chesscomProfiles)
      .values({
        userId,
        chesscomUsername: profile.username,
        chesscomUrl: profile.url,
        blitzRating: stats.blitzRating,
        rapidRating: stats.rapidRating,
        bulletRating: stats.bulletRating,
        dailyRating: stats.dailyRating,
        avatar: profile.avatar,
        lastSyncedAt: new Date(),
      })
      .onDuplicateKeyUpdate({
        set: {
          blitzRating: stats.blitzRating,
          rapidRating: stats.rapidRating,
          bulletRating: stats.bulletRating,
          dailyRating: stats.dailyRating,
          avatar: profile.avatar,
          lastSyncedAt: new Date(),
        },
      });

    return {
      success: true,
      profile: {
        username: profile.username,
        avatar: profile.avatar,
        ...stats,
      },
    };
  } catch (error) {
    console.error("[ChessCom] Error linking account:", error);
    throw error;
  }
}

/**
 * Sync Chess.com games to database
 */
export async function syncChesscomGames(userId: number, chesscomUsername: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    // Fetch current month's games
    const now = new Date();
    const games = await fetchChesscomGames(chesscomUsername, now.getFullYear(), now.getMonth() + 1);

    let importedCount = 0;

    for (const game of games) {
      // Check if game already imported
      const existing = await db
        .select()
        .from(importedGames)
        .where(eq(importedGames.chesscomGameId, game.url.split("/").pop()))
        .limit(1);

      if (existing.length === 0) {
        // Import new game
        const moves = game.pgn.split(" ").filter((m: string) => !m.includes("."));

        await db.insert(importedGames).values({
          userId,
          chesscomGameId: game.url.split("/").pop(),
          pgn: game.pgn,
          fen: game.fen,
          moves: JSON.stringify(moves),
          whiteUsername: game.white.username,
          blackUsername: game.black.username,
          result: game.white.result === "win" ? "win" : game.white.result === "loss" ? "loss" : "draw",
          timeControl: game.time_control,
          playedAt: new Date(game.end_time * 1000),
          analyzed: false,
        });

        importedCount++;
      }
    }

    // Update last sync time
    await db
      .update(chesscomProfiles)
      .set({ lastSyncedAt: new Date() })
      .where(eq(chesscomProfiles.userId, userId));

    return {
      success: true,
      importedCount,
    };
  } catch (error) {
    console.error("[ChessCom] Error syncing games:", error);
    throw error;
  }
}

/**
 * Get Chess.com profile for user
 */
export async function getChesscomProfile(userId: number) {
  const db = await getDb();
  if (!db) {
    return null;
  }

  try {
    const result = await db
      .select()
      .from(chesscomProfiles)
      .where(eq(chesscomProfiles.userId, userId))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[ChessCom] Error getting profile:", error);
    return null;
  }
}
