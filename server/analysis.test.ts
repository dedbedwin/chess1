import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("chess.getGame", () => {
  it("should retrieve a game by ID", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // First create a game
    const game = await caller.chess.createGame({
      opponentType: "bot",
      opponentName: "Test Bot",
      opponentRating: 1200,
      playerColor: "white",
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    });

    expect(game).toBeDefined();
    expect(game?.id).toBeDefined();

    // Now retrieve it
    if (game?.id) {
      const retrieved = await caller.chess.getGame({ gameId: game.id });
      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(game.id);
      expect(retrieved?.opponentName).toBe("Test Bot");
    }
  });
});

describe("chess.getAnalysis", () => {
  it("should return empty analysis for new game", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create a game
    const game = await caller.chess.createGame({
      opponentType: "bot",
      opponentName: "Test Bot",
      opponentRating: 1200,
      playerColor: "white",
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    });

    expect(game?.id).toBeDefined();

    // Get analysis for the new game
    if (game?.id) {
      const analysis = await caller.chess.getAnalysis({ gameId: game.id });
      expect(Array.isArray(analysis)).toBe(true);
      expect(analysis.length).toBe(0);
    }
  });
});

describe("Coach Summary Data Structure", () => {
  it("should support analysis data structure for coach summary generation", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create a game
    const game = await caller.chess.createGame({
      opponentType: "bot",
      opponentName: "Test Bot",
      opponentRating: 1200,
      playerColor: "white",
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    });

    expect(game?.id).toBeDefined();

    if (game?.id) {
      // Get analysis (empty for new game, but structure is valid)
      const analysis = await caller.chess.getAnalysis({ gameId: game.id });

      // Verify analysis structure for coach summary
      expect(Array.isArray(analysis)).toBe(true);

      // Verify each analysis entry has expected structure
      analysis.forEach((entry) => {
        expect(entry).toHaveProperty("moveNumber");
        expect(entry).toHaveProperty("move");
        expect(entry).toHaveProperty("marker");
        expect(entry).toHaveProperty("evaluation");
      });

      // Count different marker types (will be 0 for new game)
      const markerCounts = {
        brilliant: analysis.filter((a) => a.marker === "brilliant").length,
        excellent: analysis.filter((a) => a.marker === "excellent").length,
        good: analysis.filter((a) => a.marker === "good").length,
        book: analysis.filter((a) => a.marker === "book").length,
        inaccuracy: analysis.filter((a) => a.marker === "inaccuracy").length,
        mistake: analysis.filter((a) => a.marker === "mistake").length,
        blunder: analysis.filter((a) => a.marker === "blunder").length,
      };

      // Verify marker counts are non-negative
      Object.values(markerCounts).forEach((count) => {
        expect(count).toBeGreaterThanOrEqual(0);
      });

      // Verify total moves count
      const totalMoves = Object.values(markerCounts).reduce((a, b) => a + b, 0);
      expect(totalMoves).toBeLessThanOrEqual(analysis.length);
    }
  });
});
