import { useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  SkipBack,
  SkipForward,
  Play,
  Pause,
} from "lucide-react";

interface GameReplayProps {
  pgn: string;
  onMoveSelect?: (moveIndex: number) => void;
}

export default function GameReplay({ pgn, onMoveSelect }: GameReplayProps) {
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [game] = useState(() => new Chess());
  const [moves, setMoves] = useState<Array<{ san: string; uci: string }>>([]);
  const [fen, setFen] = useState(game.fen());

  // Parse PGN and extract moves
  const parsePGN = (pgnText: string) => {
    const gameObj = new Chess();
    gameObj.loadPgn(pgnText);
    const history = gameObj.history({ verbose: true });
    const moveList = history.map((move) => ({
      san: move.san,
      uci: `${move.from}${move.to}`,
    }));
    setMoves(moveList);
  };

  // Load PGN on mount
  useState(() => {
    if (pgn) {
      parsePGN(pgn);
    }
  });

  // Navigate to specific move
  const goToMove = (index: number) => {
    const newGame = new Chess();
    newGame.loadPgn(pgn);
    const history = newGame.history({ verbose: true });

    // Reset and replay moves up to index
    for (let i = 0; i <= Math.min(index, history.length - 1); i++) {
      newGame.move(history[i]?.san);
    }

    setCurrentMoveIndex(Math.min(index, history.length - 1));
    setFen(newGame.fen());
    onMoveSelect?.(Math.min(index, history.length - 1));
  };

  // Navigation controls
  const goToStart = () => goToMove(0);
  const goToPrevious = () => goToMove(Math.max(0, currentMoveIndex - 1));
  const goToNext = () => goToMove(currentMoveIndex + 1);
  const goToEnd = () => goToMove(moves.length - 1);

  // Auto-play
  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="space-y-4">
      {/* Board */}
      <Card className="bg-[#3d3a35] border-[#4a4743] p-4">
        <div className="aspect-square max-w-md mx-auto">
          {(Chessboard as any)({
            position: fen,
            onPieceDrop: () => false,
          })}
        </div>
      </Card>

      {/* Controls */}
      <Card className="bg-[#3d3a35] border-[#4a4743] p-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Button
            onClick={goToStart}
            variant="outline"
            size="sm"
            className="border-gray-600 hover:bg-gray-700"
            title="Go to start"
          >
            <SkipBack className="w-4 h-4" />
          </Button>

          <Button
            onClick={goToPrevious}
            variant="outline"
            size="sm"
            className="border-gray-600 hover:bg-gray-700"
            title="Previous move"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <Button
            onClick={toggleAutoPlay}
            variant="outline"
            size="sm"
            className="border-gray-600 hover:bg-gray-700"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>

          <Button
            onClick={goToNext}
            variant="outline"
            size="sm"
            className="border-gray-600 hover:bg-gray-700"
            title="Next move"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          <Button
            onClick={goToEnd}
            variant="outline"
            size="sm"
            className="border-gray-600 hover:bg-gray-700"
            title="Go to end"
          >
            <SkipForward className="w-4 h-4" />
          </Button>

          <span className="ml-4 text-sm text-gray-400">
            Move {currentMoveIndex + 1} of {moves.length}
          </span>
        </div>

        {/* Move list */}
        <div className="bg-[#2a2725] rounded p-3 max-h-24 overflow-y-auto">
          <div className="flex flex-wrap gap-2">
            {moves.map((move, index) => (
              <button
                key={index}
                onClick={() => goToMove(index)}
                className={`px-2 py-1 rounded text-sm transition-colors ${
                  index === currentMoveIndex
                    ? "bg-green-600 text-white"
                    : "bg-[#3d3a35] text-gray-300 hover:bg-[#4a4743]"
                }`}
              >
                {Math.floor(index / 2) + 1}
                {index % 2 === 0 ? "." : "..."} {move.san}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Move details */}
      {currentMoveIndex < moves.length && (
        <Card className="bg-[#3d3a35] border-[#4a4743] p-4">
          <p className="text-sm text-gray-400">
            <span className="font-bold text-white">Move {currentMoveIndex + 1}:</span>{" "}
            {moves[currentMoveIndex]?.san}
          </p>
        </Card>
      )}
    </div>
  );
}
