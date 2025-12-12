/**
 * Stockfish Engine Wrapper
 * Provides a clean interface to interact with the Stockfish chess engine
 */

export interface EngineEvaluation {
  score: number; // Centipawn score (positive = white advantage)
  mate?: number; // Moves to mate (if applicable)
  bestMove: string;
  depth: number;
}

export class StockfishEngine {
  private engine: Worker | null = null;
  private ready: boolean = false;
  private readyPromise: Promise<void>;
  private messageHandlers: Map<string, (data: string) => void> = new Map();

  constructor() {
    this.readyPromise = this.initialize();
  }

  private async initialize(): Promise<void> {
    return new Promise((resolve) => {
      // Import Stockfish as a Web Worker
      this.engine = new Worker("/stockfish.js");

      this.engine.onmessage = (event) => {
        const message = event.data;
        
        if (message === "uciok") {
          this.ready = true;
          resolve();
        }

        // Call registered message handlers
        this.messageHandlers.forEach((handler) => {
          handler(message);
        });
      };

      // Initialize UCI protocol
      this.send("uci");
    });
  }

  private send(command: string): void {
    if (this.engine) {
      this.engine.postMessage(command);
    }
  }

  async waitUntilReady(): Promise<void> {
    await this.readyPromise;
  }

  /**
   * Set the skill level of the engine (0-20)
   * Lower values make the engine play weaker
   */
  setSkillLevel(level: number): void {
    const clampedLevel = Math.max(0, Math.min(20, level));
    this.send(`setoption name Skill Level value ${clampedLevel}`);
  }

  /**
   * Set the depth limit for analysis
   */
  setDepth(depth: number): void {
    this.send(`setoption name Depth value ${depth}`);
  }

  /**
   * Get the best move for a given position
   */
  async getBestMove(fen: string, depth: number = 15): Promise<string> {
    await this.waitUntilReady();

    return new Promise((resolve) => {
      const handler = (message: string) => {
        if (message.startsWith("bestmove")) {
          const parts = message.split(" ");
          const move = parts[1];
          this.messageHandlers.delete("bestmove");
          resolve(move);
        }
      };

      this.messageHandlers.set("bestmove", handler);

      this.send(`position fen ${fen}`);
      this.send(`go depth ${depth}`);
    });
  }

  /**
   * Evaluate a position and get detailed analysis
   */
  async evaluatePosition(fen: string, depth: number = 15): Promise<EngineEvaluation> {
    await this.waitUntilReady();

    return new Promise((resolve) => {
      let bestEval: EngineEvaluation = {
        score: 0,
        bestMove: "",
        depth: 0,
      };

      const handler = (message: string) => {
        // Parse evaluation info
        if (message.startsWith("info") && message.includes("score")) {
          const depthMatch = message.match(/depth (\d+)/);
          const scoreMatch = message.match(/score cp (-?\d+)/);
          const mateMatch = message.match(/score mate (-?\d+)/);
          const pvMatch = message.match(/pv (\S+)/);

          if (depthMatch) {
            const currentDepth = parseInt(depthMatch[1]);
            
            if (scoreMatch && pvMatch) {
              bestEval = {
                score: parseInt(scoreMatch[1]),
                bestMove: pvMatch[1],
                depth: currentDepth,
              };
            } else if (mateMatch && pvMatch) {
              bestEval = {
                score: parseInt(mateMatch[1]) > 0 ? 10000 : -10000,
                mate: parseInt(mateMatch[1]),
                bestMove: pvMatch[1],
                depth: currentDepth,
              };
            }
          }
        }

        // When analysis is complete
        if (message.startsWith("bestmove")) {
          this.messageHandlers.delete("evaluate");
          resolve(bestEval);
        }
      };

      this.messageHandlers.set("evaluate", handler);

      this.send(`position fen ${fen}`);
      this.send(`go depth ${depth}`);
    });
  }

  /**
   * Get a move from the engine at a specific skill level
   * Used for bot opponents
   */
  async getBotMove(fen: string, rating: number): Promise<string> {
    await this.waitUntilReady();

    // Map rating to skill level and depth
    const { skillLevel, depth } = this.ratingToEngineSettings(rating);
    
    this.setSkillLevel(skillLevel);
    
    return this.getBestMove(fen, depth);
  }

  /**
   * Convert chess rating to Stockfish settings
   */
  private ratingToEngineSettings(rating: number): { skillLevel: number; depth: number } {
    if (rating <= 400) return { skillLevel: 0, depth: 1 };
    if (rating <= 800) return { skillLevel: 3, depth: 3 };
    if (rating <= 1200) return { skillLevel: 7, depth: 5 };
    if (rating <= 1600) return { skillLevel: 11, depth: 8 };
    if (rating <= 2000) return { skillLevel: 15, depth: 12 };
    if (rating <= 2400) return { skillLevel: 18, depth: 16 };
    return { skillLevel: 20, depth: 20 };
  }

  /**
   * Stop the engine
   */
  stop(): void {
    this.send("stop");
  }

  /**
   * Terminate the engine worker
   */
  terminate(): void {
    if (this.engine) {
      this.engine.terminate();
      this.engine = null;
      this.ready = false;
    }
  }
}

// Singleton instance
let engineInstance: StockfishEngine | null = null;

export function getStockfishEngine(): StockfishEngine {
  if (!engineInstance) {
    engineInstance = new StockfishEngine();
  }
  return engineInstance;
}
