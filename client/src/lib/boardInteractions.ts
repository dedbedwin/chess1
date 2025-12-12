import { Chess, Square } from "chess.js";

export interface SquareHighlight {
  square: Square;
  color: "red" | "yellow" | "green";
}

export interface ArrowMarking {
  from: Square;
  to: Square;
  type: "normal" | "knight";
}

export class BoardInteractions {
  private game: Chess;
  private selectedSquare: Square | null = null;
  private possibleMoves: Square[] = [];
  private markedSquares: Map<Square, SquareHighlight> = new Map();
  private arrows: ArrowMarking[] = [];

  constructor(game: Chess) {
    this.game = game;
  }

  /**
   * Handle left-click on square - show possible moves
   */
  handleLeftClick(square: Square): Square[] {
    // If clicking same square, deselect
    if (this.selectedSquare === square) {
      this.selectedSquare = null;
      this.possibleMoves = [];
      return [];
    }

    // If clicking a piece, select it and show moves
    const piece = this.game.get(square);
    if (piece && piece.color === (this.game.turn() === "w" ? "w" : "b")) {
      this.selectedSquare = square;
      this.possibleMoves = this.getPossibleMovesForSquare(square);
      return this.possibleMoves;
    }

    // If clicking an empty square or opponent piece, try to move
    if (this.selectedSquare) {
      const move = this.game.move({
        from: this.selectedSquare,
        to: square,
        promotion: "q", // Default to queen
      });

      if (move) {
        this.selectedSquare = null;
        this.possibleMoves = [];
        return [];
      }
    }

    return [];
  }

  /**
   * Handle right-click on square - mark with red
   */
  handleRightClick(square: Square): void {
    const existing = this.markedSquares.get(square);
    if (existing?.color === "red") {
      this.markedSquares.delete(square);
    } else {
      this.markedSquares.set(square, { square, color: "red" });
    }
  }

  /**
   * Handle drag from square to square - show yellow highlight
   */
  handleDragStart(square: Square): void {
    this.selectedSquare = square;
  }

  handleDragEnd(fromSquare: Square, toSquare: Square): void {
    // Add yellow highlight for the move
    this.markedSquares.set(fromSquare, { square: fromSquare, color: "yellow" });
    this.markedSquares.set(toSquare, { square: toSquare, color: "yellow" });

    // Try to make the move
    const move = this.game.move({
      from: fromSquare,
      to: toSquare,
      promotion: "q",
    });

    if (move) {
      // Check if it's a knight move
      const piece = this.game.get(toSquare);
      if (piece?.type === "n") {
        this.addArrow(fromSquare, toSquare, "knight");
      } else {
        this.addArrow(fromSquare, toSquare, "normal");
      }
    }

    this.selectedSquare = null;
  }

  /**
   * Get possible moves for a square
   */
  private getPossibleMovesForSquare(square: Square): Square[] {
    const moves = this.game.moves({ square, verbose: true });
    return moves.map((m) => m.to as Square);
  }

  /**
   * Add arrow marking for move
   */
  addArrow(from: Square, to: Square, type: "normal" | "knight" = "normal"): void {
    this.arrows.push({ from, to, type });
  }

  /**
   * Clear all markings
   */
  clearMarkings(): void {
    this.markedSquares.clear();
    this.arrows = [];
    this.selectedSquare = null;
    this.possibleMoves = [];
  }

  /**
   * Get current state
   */
  getState() {
    return {
      selectedSquare: this.selectedSquare,
      possibleMoves: this.possibleMoves,
      markedSquares: Array.from(this.markedSquares.values()),
      arrows: this.arrows,
    };
  }

  /**
   * Draw knight arrow (curved)
   */
  static drawKnightArrow(
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    color: string = "#f59e0b"
  ): void {
    const midX = (fromX + toX) / 2;
    const midY = (fromY + toY) / 2;
    const offsetX = (toY - fromY) * 0.2;
    const offsetY = (fromX - toX) * 0.2;

    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.quadraticCurveTo(
      midX + offsetX,
      midY + offsetY,
      toX,
      toY
    );
    ctx.stroke();

    // Draw arrowhead
    const angle = Math.atan2(toY - midY, toX - midX);
    const headlen = 15;
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  /**
   * Draw normal arrow (straight)
   */
  static drawNormalArrow(
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    color: string = "#f59e0b"
  ): void {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    // Draw arrowhead
    const angle = Math.atan2(toY - fromY, toX - fromX);
    const headlen = 15;
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }
}
