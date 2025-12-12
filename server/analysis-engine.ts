/**
 * Chess game analysis engine
 * Analyzes completed games and classifies moves
 */

export interface MoveAnalysis {
  moveNumber: number;
  move: string;
  fen: string;
  evaluation: number;
  bestMove: string | null;
  marker: "brilliant" | "excellent" | "good" | "book" | "inaccuracy" | "mistake" | "blunder" | null;
  comment: string | null;
  centipawnLoss: number;
}

export interface GameAnalysisResult {
  moves: MoveAnalysis[];
  accuracy: number;
  summary: string;
}

/**
 * Classify a move based on centipawn loss
 */
export function classifyMove(centipawnLoss: number, isBestMove: boolean): MoveAnalysis["marker"] {
  if (isBestMove || centipawnLoss <= 10) {
    if (centipawnLoss === 0) return "book";
    if (centipawnLoss <= 5) return "excellent";
    return "good";
  }

  if (centipawnLoss <= 50) return "inaccuracy";
  if (centipawnLoss <= 100) return "mistake";
  return "blunder"; // capivarada in PT
}

/**
 * Calculate accuracy percentage from centipawn losses
 * Formula similar to chess.com's accuracy calculation
 */
export function calculateAccuracy(centipawnLosses: number[]): number {
  if (centipawnLosses.length === 0) return 100;

  const totalLoss = centipawnLosses.reduce((sum, loss) => sum + loss, 0);
  const averageLoss = totalLoss / centipawnLosses.length;

  // Convert average loss to accuracy percentage
  // Lower loss = higher accuracy
  const accuracy = Math.max(0, 100 - averageLoss / 10);
  return Math.round(accuracy * 10) / 10; // Round to 1 decimal
}

/**
 * Check if a move is brilliant (sacrifices material for advantage)
 */
export function isBrilliantMove(
  evaluation: number,
  previousEvaluation: number,
  move: string
): boolean {
  // A brilliant move typically:
  // 1. Improves position significantly (>100 centipawns)
  // 2. Involves a sacrifice (captured piece in move notation)
  // 3. Is not the obvious best move

  const improvement = evaluation - previousEvaluation;
  const isSacrifice = move.includes("x") && /[QRBN]/.test(move[0]);

  return isSacrifice && improvement > 100;
}

/**
 * Generate a summary comment for a move
 */
export function generateMoveComment(
  marker: MoveAnalysis["marker"],
  centipawnLoss: number,
  bestMove: string | null
): string | null {
  switch (marker) {
    case "brilliant":
      return "Brilliant sacrifice! This unexpected move creates winning chances.";
    case "excellent":
      return "Excellent move! You found the best continuation.";
    case "good":
      return "Good move, maintaining your position.";
    case "book":
      return "Standard opening theory.";
    case "inaccuracy":
      return bestMove
        ? `Slightly inaccurate. Consider ${bestMove} instead.`
        : "Slightly inaccurate move.";
    case "mistake":
      return bestMove
        ? `Mistake! ${bestMove} was much better.`
        : `Mistake! This loses ${Math.round(centipawnLoss / 10) / 10} pawns of advantage.`;
    case "blunder":
      return bestMove
        ? `Blunder! You should have played ${bestMove}.`
        : `Blunder! This loses ${Math.round(centipawnLoss / 10) / 10} pawns.`;
    default:
      return null;
  }
}
