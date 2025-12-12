import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  createGame,
  getGameById,
  getUserGames,
  updateGame,
  createGameAnalysis,
  getGameAnalysis,
  createBulkGameAnalysis,
  createCoachChat,
  getCoachChats,
  getUserSettings,
  upsertUserSettings,
  getAllAiPrompts,
  getAiPromptByKey,
  upsertAiPrompt,
  initializeDefaultPrompts,
} from "./chess-db";
import { invokeLLM } from "./_core/llm";

export const chessRouter = router({
  // ============ Settings ============
  getSettings: protectedProcedure.query(async ({ ctx }) => {
    let settings = await getUserSettings(ctx.user.id);
    
    // Create default settings if none exist
    if (!settings) {
      settings = await upsertUserSettings({
        userId: ctx.user.id,
        boardTheme: "green",
        pieceSet: "classic",
        language: "en",
      });
    }
    
    return settings;
  }),

  updateSettings: protectedProcedure
    .input(
      z.object({
        boardTheme: z.string().optional(),
        pieceSet: z.string().optional(),
        language: z.enum(["en", "pt"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return upsertUserSettings({
        userId: ctx.user.id,
        boardTheme: input.boardTheme,
        pieceSet: input.pieceSet,
        language: input.language,
      });
    }),

  // ============ Games ============
  createGame: protectedProcedure
    .input(
      z.object({
        opponentType: z.enum(["bot", "coach"]),
        opponentName: z.string(),
        opponentRating: z.number().optional(),
        playerColor: z.enum(["white", "black"]),
        fen: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return createGame({
        userId: ctx.user.id,
        opponentType: input.opponentType,
        opponentName: input.opponentName,
        opponentRating: input.opponentRating,
        playerColor: input.playerColor,
        result: "ongoing",
        pgn: "",
        fen: input.fen,
        moves: "[]",
        startedAt: new Date(),
      });
    }),

  getGame: protectedProcedure
    .input(z.object({ gameId: z.number() }))
    .query(async ({ input }) => {
      return getGameById(input.gameId);
    }),

  getMyGames: protectedProcedure
    .input(z.object({ limit: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      return getUserGames(ctx.user.id, input.limit);
    }),

  updateGame: protectedProcedure
    .input(
      z.object({
        gameId: z.number(),
        result: z.enum(["win", "loss", "draw", "ongoing"]).optional(),
        pgn: z.string().optional(),
        fen: z.string().optional(),
        moves: z.string().optional(),
        endedAt: z.date().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { gameId, ...updates } = input;
      return updateGame(gameId, updates);
    }),

  // ============ Analysis ============
  createAnalysis: protectedProcedure
    .input(
      z.object({
        gameId: z.number(),
        moveNumber: z.number(),
        move: z.string(),
        evaluation: z.number().optional(),
        marker: z
          .enum(["brilliant", "excellent", "good", "book", "inaccuracy", "mistake", "blunder"])
          .optional(),
        bestMove: z.string().optional(),
        comment: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return createGameAnalysis(input);
    }),

  createBulkAnalysis: protectedProcedure
    .input(
      z.array(
        z.object({
          gameId: z.number(),
          moveNumber: z.number(),
          move: z.string(),
          evaluation: z.number().optional(),
          marker: z
            .enum(["brilliant", "excellent", "good", "book", "inaccuracy", "mistake", "blunder"])
            .optional(),
          bestMove: z.string().optional(),
          comment: z.string().optional(),
        })
      )
    )
    .mutation(async ({ input }) => {
      await createBulkGameAnalysis(input);
      return { success: true };
    }),

  getAnalysis: protectedProcedure
    .input(z.object({ gameId: z.number() }))
    .query(async ({ input }) => {
      return getGameAnalysis(input.gameId);
    }),

  // ============ Coach Chat ============
  sendCoachMessage: protectedProcedure
    .input(
      z.object({
        gameId: z.number(),
        message: z.string(),
        moveNumber: z.number().optional(),
        fen: z.string(),
        evaluation: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Save user message
      await createCoachChat({
        gameId: input.gameId,
        role: "user",
        message: input.message,
        moveNumber: input.moveNumber,
      });

      // Get chat history
      const history = await getCoachChats(input.gameId);

      // Get system prompt
      const systemPrompt = await getAiPromptByKey("system_coach");

      // Build messages for LLM
      const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
        {
          role: "system",
          content: systemPrompt?.promptText || "You are a helpful chess coach.",
        },
      ];

      // Add chat history (last 10 messages)
      const recentHistory = history.slice(-10);
      for (const chat of recentHistory) {
        if (chat.role === "user" || chat.role === "coach") {
          messages.push({
            role: chat.role === "coach" ? "assistant" : "user",
            content: chat.message,
          });
        }
      }

      // Add context about current position
      if (input.evaluation !== undefined) {
        messages.push({
          role: "system",
          content: `Current position FEN: ${input.fen}. Stockfish evaluation: ${input.evaluation} centipawns.`,
        });
      }

      // Get response from LLM
      const response = await invokeLLM({ messages });

      const content = response.choices[0]?.message?.content;
      const coachResponse = typeof content === "string" ? content : "I'm thinking...";

      // Save coach response
      const savedChat = await createCoachChat({
        gameId: input.gameId,
        role: "coach",
        message: coachResponse,
        moveNumber: input.moveNumber,
      });

      return savedChat;
    }),

  getCoachChats: protectedProcedure
    .input(z.object({ gameId: z.number() }))
    .query(async ({ input }) => {
      return getCoachChats(input.gameId);
    }),

  // ============ AI Prompts ============
  getAllPrompts: protectedProcedure.query(async () => {
    // Initialize default prompts if needed
    await initializeDefaultPrompts();
    return getAllAiPrompts();
  }),

  getPrompt: protectedProcedure
    .input(z.object({ key: z.string() }))
    .query(async ({ input }) => {
      return getAiPromptByKey(input.key);
    }),

  updatePrompt: protectedProcedure
    .input(
      z.object({
        promptKey: z.string(),
        promptText: z.string(),
        description: z.string().optional(),
        category: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return upsertAiPrompt(input);
    }),

  // PGN Import
  importPGN: protectedProcedure
    .input(z.object({ pgn: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { Chess } = await import("chess.js");
      
      // Parse PGN
      const chess = new Chess();
      try {
        chess.loadPgn(input.pgn);
      } catch (error) {
        throw new Error("Invalid PGN format");
      }

      // Extract game information
      const moves = chess.history();
      const fen = chess.fen();
      const header = chess.header();

      // Determine result
      let result: "win" | "loss" | "draw" | "ongoing" = "ongoing";
      if (chess.isCheckmate()) {
        result = chess.turn() === "w" ? "loss" : "win";
      } else if (chess.isDraw()) {
        result = "draw";
      }

      // Create game record
      const game = await createGame({
        userId: ctx.user.id,
        opponentType: "bot",
        opponentName: header.Black || "Unknown",
        opponentRating: null,
        playerColor: "white",
        fen,
        pgn: input.pgn,
        moves: JSON.stringify(moves),
        result,
        startedAt: new Date(),
        endedAt: result !== "ongoing" ? new Date() : null,
      });

      return game;
    }),
});
