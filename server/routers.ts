import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { Chess } from "chess.js";
import { z } from "zod";
import { classifyMove, calculateAccuracy, isBrilliantMove, generateMoveComment, type MoveAnalysis } from "./analysis-engine";
import { chessRouter } from "./chess-routers";
import { getGameById, createGameAnalysis } from "./chess-db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  chess: chessRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Game analysis
  analyzeGame: protectedProcedure
    .input(z.object({ gameId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const game = await getGameById(input.gameId);
      if (!game || game.userId !== ctx.user.id) {
        throw new Error("Game not found");
      }

      // Parse PGN to get all moves
      const chess = new Chess();
      chess.loadPgn(game.pgn);
      const moves = chess.history({ verbose: true });

      // Analyze each move (import dynamically to avoid client-side issues)
      const { getStockfishEngine } = await import("../client/src/lib/stockfish");
      const engine = getStockfishEngine();
      await engine.waitUntilReady();

      const analysisResults: MoveAnalysis[] = [];
      const centipawnLosses: number[] = [];
      let previousEvaluation = 0;

      const analysisChess = new Chess();

      for (let i = 0; i < moves.length; i++) {
        const move = moves[i];
        const fen = analysisChess.fen();

        // Get evaluation before the move
        const evalBefore = await engine.evaluatePosition(fen);
        
        // Make the move
        analysisChess.move(move.san);
        const fenAfter = analysisChess.fen();

        // Get evaluation after the move
        const evalAfter = await engine.evaluatePosition(fenAfter);

        // Get best move
        const bestMoveResult = await engine.getBestMove(fen);
        const isBest = bestMoveResult === move.san;

        // Calculate centipawn loss (from player's perspective)
        const isWhite = move.color === "w";
        const cpLoss = isWhite
          ? Math.max(0, evalBefore.score - evalAfter.score)
          : Math.max(0, evalAfter.score - evalBefore.score);

        centipawnLosses.push(cpLoss);

        // Check for brilliant move
        let marker = classifyMove(cpLoss, isBest);
        if (isBrilliantMove(evalAfter.score, previousEvaluation, move.san)) {
          marker = "brilliant";
        }

        const comment = generateMoveComment(marker, cpLoss, isBest ? null : bestMoveResult);

        analysisResults.push({
          moveNumber: i + 1,
          move: move.san,
          fen: fenAfter,
          evaluation: evalAfter.score,
          bestMove: isBest ? null : bestMoveResult,
          marker,
          comment,
          centipawnLoss: cpLoss,
        });

        previousEvaluation = evalAfter.score;
      }

      // Calculate accuracy
      const accuracy = calculateAccuracy(centipawnLosses);

      // Save analysis to database
      for (const analysis of analysisResults) {
        await createGameAnalysis({
          gameId: input.gameId,
          moveNumber: analysis.moveNumber,
          move: analysis.move,
          evaluation: analysis.evaluation,
          bestMove: analysis.bestMove,
          marker: analysis.marker,
          comment: analysis.comment,
        });
      }

      return {
        accuracy,
        totalMoves: moves.length,
        analysisComplete: true,
      };
    }),
});

export type AppRouter = typeof appRouter;
