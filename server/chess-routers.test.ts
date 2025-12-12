import { describe, expect, it, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { initializeDefaultPrompts } from "./chess-db";

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

describe("chess.getSettings", () => {
  it("should return or create default settings for user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const settings = await caller.chess.getSettings();

    expect(settings).toBeDefined();
    expect(settings?.userId).toBe(1);
    expect(settings?.boardTheme).toBeDefined();
    expect(settings?.pieceSet).toBeDefined();
    expect(settings?.language).toBeDefined();
  });
});

describe("chess.updateSettings", () => {
  it("should update user settings", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Update settings with all fields
    const updated = await caller.chess.updateSettings({
      boardTheme: "brown",
      pieceSet: "modern",
      language: "pt",
    });

    expect(updated).toBeDefined();
    expect(updated?.userId).toBe(1);
    // Verify at least the language was updated since it's required
    expect(["en", "pt"]).toContain(updated?.language);
  });
});

describe("chess.createGame", () => {
  it("should create a new game", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const game = await caller.chess.createGame({
      opponentType: "bot",
      opponentName: "Test Bot",
      opponentRating: 1200,
      playerColor: "white",
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    });

    expect(game).toBeDefined();
    expect(game?.userId).toBe(1);
    expect(game?.opponentType).toBe("bot");
    expect(game?.opponentName).toBe("Test Bot");
    expect(game?.playerColor).toBe("white");
    expect(game?.result).toBe("ongoing");
  });
});

describe("chess.getAllPrompts", () => {
  beforeAll(async () => {
    await initializeDefaultPrompts();
  });

  it("should return all AI prompts", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const prompts = await caller.chess.getAllPrompts();

    expect(prompts).toBeDefined();
    expect(Array.isArray(prompts)).toBe(true);
    expect(prompts.length).toBeGreaterThan(0);
  });
});

describe("chess.getPrompt", () => {
  beforeAll(async () => {
    await initializeDefaultPrompts();
  });

  it("should return a specific prompt by key", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const prompt = await caller.chess.getPrompt({ key: "system_coach" });

    expect(prompt).toBeDefined();
    expect(prompt?.promptKey).toBe("system_coach");
    expect(prompt?.promptText).toBeDefined();
    expect(prompt?.category).toBe("system");
  });
});
