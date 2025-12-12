import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { CheckCircle, XCircle, RotateCcw, ChevronRight } from "lucide-react";

export default function PuzzleGame() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [, params] = useRoute("/puzzle-game/:id");
  const [, setLocation] = useLocation();

  const puzzleId = params?.id;

  const [game, setGame] = useState(new Chess());
  const [solved, setSolved] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [moves, setMoves] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string>("");

  // Mock puzzle data
  const puzzle = {
    id: puzzleId,
    fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
    solution: "Nxe5",
    difficulty: "intermediate",
    rating: 1200,
    description: "Find the winning move",
  };

  useEffect(() => {
    const chessGame = new Chess(puzzle.fen);
    setGame(chessGame);
  }, [puzzle.fen]);

  const handleMove = (sourceSquare: string, targetSquare: string) => {
    const gameCopy = new Chess(game.fen());
    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (move === null) return false;

    setGame(gameCopy);
    setMoves([...moves, move.san]);

    // Check if move matches solution
    if (move.san === puzzle.solution) {
      setSolved(true);
      setFeedback("Excellent! You found the solution!");
    } else {
      setFeedback("Not quite right. Try again!");
    }

    return true;
  };

  const handleReset = () => {
    const chessGame = new Chess(puzzle.fen);
    setGame(chessGame);
    setMoves([]);
    setSolved(false);
    setFeedback("");
  };

  const handleSkip = () => {
    setShowSolution(true);
    setFeedback(`The solution was: ${puzzle.solution}`);
  };

  const handleNextPuzzle = () => {
    setLocation("/puzzles");
  };

  return (
    <div className="min-h-screen bg-[#262421] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chess Board */}
          <div className="lg:col-span-2">
            <Card className="bg-[#3d3a35] border-[#4a4743] p-6">
              <div className="mb-4">
                <h2 className="text-2xl font-bold mb-2">{puzzle.description}</h2>
                <div className="flex gap-4 text-sm text-gray-400">
                  <span>Rating: {puzzle.rating}</span>
                  <span className="capitalize">Difficulty: {puzzle.difficulty}</span>
                </div>
              </div>

              <div className="bg-[#2a2725] rounded p-4 mb-6">
                <div className="w-full max-w-md mx-auto">
                  {(Chessboard as any)({
                    position: game.fen(),
                    onPieceDrop: handleMove,
                  })}
                </div>
              </div>

              {/* Move History */}
              <div className="mb-6">
                <h3 className="font-bold mb-2">Moves:</h3>
                <div className="bg-[#2a2725] rounded p-4 min-h-12">
                  <p className="text-gray-400">{moves.length > 0 ? moves.join(" ") : "No moves yet"}</p>
                </div>
              </div>

              {/* Feedback */}
              {feedback && (
                <div
                  className={`rounded p-4 mb-6 flex items-center gap-2 ${
                    solved ? "bg-green-900/30 text-green-400" : "bg-yellow-900/30 text-yellow-400"
                  }`}
                >
                  {solved ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  <span>{feedback}</span>
                </div>
              )}

              {/* Controls */}
              <div className="flex gap-3">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="flex-1 border-gray-600 hover:bg-gray-700"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button
                  onClick={handleSkip}
                  variant="outline"
                  className="flex-1 border-gray-600 hover:bg-gray-700"
                  disabled={solved || showSolution}
                >
                  Show Solution
                </Button>
                {solved && (
                  <Button
                    onClick={handleNextPuzzle}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Next Puzzle
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div>
            <Card className="bg-[#3d3a35] border-[#4a4743] p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">Puzzle Info</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Difficulty</p>
                  <p className="font-bold capitalize">{puzzle.difficulty}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Rating</p>
                  <p className="font-bold">{puzzle.rating}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Solution</p>
                  <p className="font-bold font-mono">{showSolution ? puzzle.solution : "???"}</p>
                </div>
              </div>
            </Card>

            {solved && (
              <Card className="bg-green-900/20 border-green-700 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <h3 className="text-lg font-bold">Puzzle Solved!</h3>
                </div>
                <p className="text-gray-300 text-sm mb-4">Great job! You found the correct solution.</p>
                <Button
                  onClick={handleNextPuzzle}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Continue to Next Puzzle
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
