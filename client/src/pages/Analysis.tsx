import { useState, useEffect, useRef } from "react";
import { useRoute } from "wouter";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { toast } from "sonner";
import { CoachChat } from "@/components/CoachChat";
import { EvaluationGraph } from "@/components/EvaluationGraph";
import { OpeningAnalysis } from "@/components/OpeningAnalysis";

export default function Analysis() {
  const { t } = useLanguage();
  const [, params] = useRoute("/analysis/:id");
  const gameId = params?.id ? parseInt(params.id) : null;

  const { data: game } = trpc.chess.getGame.useQuery(
    { gameId: gameId! },
    { enabled: !!gameId }
  );
  const { data: analysis, refetch: refetchAnalysis } = trpc.chess.getAnalysis.useQuery(
    { gameId: gameId! },
    { enabled: !!gameId }
  );
  const analyzeGameMutation = trpc.analyzeGame.useMutation({
    onSuccess: () => {
      refetchAnalysis();
      toast.success("Analysis complete!");
    },
  });
  const { data: settings } = trpc.chess.getSettings.useQuery();

  const [chess, setChess] = useState(new Chess());
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [moves, setMoves] = useState<string[]>([]);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [coachSummary, setCoachSummary] = useState<string | null>(null);
  const [loadingCoachSummary, setLoadingCoachSummary] = useState(false);
  const [showCoachChat, setShowCoachChat] = useState(false);

  useEffect(() => {
    if (game) {
      const gameInstance = new Chess();
      gameInstance.loadPgn(game.pgn);
      const history = gameInstance.history();
      setMoves(history);
      setChess(new Chess());
      setCurrentMoveIndex(0);

      // Trigger automatic analysis if not already done
      if (analysis && analysis.length === 0 && game.result !== "ongoing") {
        analyzeGameMutation.mutate({ gameId: game.id });
      }

      // Generate coach summary
      if (analysis && analysis.length > 0 && !coachSummary) {
        generateCoachSummary();
      }
    }
  }, [game, analysis]);

  const generateCoachSummary = async () => {
    if (!game || !analysis) return;

    setLoadingCoachSummary(true);
    try {
      const blunders = analysis.filter((a) => a.marker === "blunder").length;
      const mistakes = analysis.filter((a) => a.marker === "mistake").length;
      const inaccuracies = analysis.filter((a) => a.marker === "inaccuracy").length;
      const excellentMoves = analysis.filter((a) => a.marker === "excellent").length;
      const brilliantMoves = analysis.filter((a) => a.marker === "brilliant").length;

      const summary = `Game Analysis Summary:\n\nYour game had ${moves.length} moves total. Here is what I found:\n\n✨ Brilliant Moves: ${brilliantMoves}\n! Excellent Moves: ${excellentMoves}\n\n?? Blunders: ${blunders}\n? Mistakes: ${mistakes}\n?! Inaccuracies: ${inaccuracies}\n\nOverall Accuracy: ${accuracy}%\n\nKey Takeaways:\n- Focus on calculating variations before moving\n- Review your opening preparation\n- Practice endgame positions to improve your technique\n\nKeep practicing and you will improve!`;

      setCoachSummary(summary);
    } catch (error) {
      console.error("Error generating coach summary:", error);
    } finally {
      setLoadingCoachSummary(false);
    }
  };

  const goToMove = (index: number) => {
    if (index < 0 || index > moves.length) return;

    const newChess = new Chess();
    for (let i = 0; i < index; i++) {
      newChess.move(moves[i]);
    }
    setChess(newChess);
    setCurrentMoveIndex(index);
  };

  const nextMove = () => goToMove(currentMoveIndex + 1);
  const previousMove = () => goToMove(currentMoveIndex - 1);
  const goToStart = () => goToMove(0);
  const goToEnd = () => goToMove(moves.length);

  const downloadPGN = () => {
    if (!game) return;

    const blob = new Blob([game.pgn], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `game-${game.id}.pgn`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getMarkerColor = (marker: string | null) => {
    switch (marker) {
      case "brilliant":
        return "text-cyan-400";
      case "excellent":
        return "text-green-400";
      case "good":
        return "text-blue-400";
      case "book":
        return "text-gray-400";
      case "inaccuracy":
        return "text-yellow-400";
      case "mistake":
        return "text-orange-400";
      case "blunder":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getMarkerSymbol = (marker: string | null) => {
    switch (marker) {
      case "brilliant":
        return "!!";
      case "excellent":
        return "!";
      case "good":
        return "⌓";
      case "book":
        return "📖";
      case "inaccuracy":
        return "?!";
      case "mistake":
        return "?";
      case "blunder":
        return "??";
      default:
        return "";
    }
  };

  const boardThemes: Record<string, { lightSquareStyle: React.CSSProperties; darkSquareStyle: React.CSSProperties }> = {
    green: {
      lightSquareStyle: { backgroundColor: "#eeeed2" },
      darkSquareStyle: { backgroundColor: "#769656" },
    },
    brown: {
      lightSquareStyle: { backgroundColor: "#f0d9b5" },
      darkSquareStyle: { backgroundColor: "#b58863" },
    },
    blue: {
      lightSquareStyle: { backgroundColor: "#dee3e6" },
      darkSquareStyle: { backgroundColor: "#8ca2ad" },
    },
    gray: {
      lightSquareStyle: { backgroundColor: "#e8e8e8" },
      darkSquareStyle: { backgroundColor: "#6d6d6d" },
    },
  };

  const currentTheme = boardThemes[settings?.boardTheme || "green"];

  if (!game) {
    return (
      <div className="min-h-screen bg-[#262421] text-white flex items-center justify-center">
        <p>{t("loading")}</p>
      </div>
    );
  }

  // Get current position evaluation for coach chat
  const currentMoveAnalysis = analysis?.find((a) => a.moveNumber === currentMoveIndex);
  const currentEvaluation = currentMoveAnalysis?.evaluation || 0;

  return (
    <div className="min-h-screen bg-[#262421] text-white p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">{t("nav_analysis")}</h1>
            {accuracy !== null && (
              <p className="text-lg text-gray-400 mt-2">
                {t("analysis_accuracy")}: <span className="text-[#81b64c] font-bold">{accuracy}%</span>
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {analyzeGameMutation.isPending && (
              <p className="text-sm text-gray-400 flex items-center gap-2">
                <span className="animate-pulse">Analyzing game...</span>
              </p>
            )}
            <Button
              variant="outline"
              onClick={() => setShowCoachChat(!showCoachChat)}
              className="flex items-center gap-2"
            >
              💬 {showCoachChat ? "Hide Coach" : "Ask Coach"}
            </Button>
            <Button
              variant="outline"
              onClick={downloadPGN}
              className="flex items-center gap-2"
            >
              <Download size={16} />
              {t("btn_export_pgn")}
            </Button>
          </div>
        </div>

        {/* Coach Summary */}
        {coachSummary && (
          <Card className="bg-[#312e2b] border-[#3d3a35] p-4 mb-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>🎓</span>
              Coach Summary
            </h2>
            <div className="text-gray-300 whitespace-pre-line text-sm leading-relaxed">
              {coachSummary}
            </div>
          </Card>
        )}

        {/* Evaluation Graph */}
        {analysis && analysis.length > 0 && (
          <div className="mb-6">
            <EvaluationGraph
              analysis={analysis}
              onMoveClick={goToMove}
              currentMoveNumber={currentMoveIndex}
            />
          </div>
        )}

        {/* Opening Analysis */}
        {moves.length > 0 && (
          <div className="mb-6">
            <OpeningAnalysis
              moves={moves}
              analysis={analysis || []}
              onMoveClick={goToMove}
            />
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr_400px] gap-6">
          {/* Board and controls */}
          <div>
            <Card className="bg-[#312e2b] border-[#3d3a35] p-4">
              <Chessboard
                options={{
                  position: chess.fen(),
                  boardStyle: {
                    borderRadius: "4px",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
                  },
                  lightSquareStyle: currentTheme.lightSquareStyle,
                  darkSquareStyle: currentTheme.darkSquareStyle,
                  allowDragging: false,
                }}
              />

              {/* Navigation controls */}
              <div className="mt-4 flex justify-center items-center gap-2">
                <Button variant="outline" size="sm" onClick={goToStart}>
                  ⏮
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={previousMove}
                  disabled={currentMoveIndex === 0}
                >
                  <ChevronLeft size={16} />
                </Button>
                <span className="px-4 text-sm">
                  Move {currentMoveIndex} / {moves.length}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextMove}
                  disabled={currentMoveIndex === moves.length}
                >
                  <ChevronRight size={16} />
                </Button>
                <Button variant="outline" size="sm" onClick={goToEnd}>
                  ⏭
                </Button>
              </div>

              {/* Current move analysis */}
              {analysis && currentMoveIndex > 0 && (
                <div className="mt-4 p-4 bg-[#262421] rounded">
                  {analysis
                    .filter((a) => a.moveNumber === currentMoveIndex)
                    .map((a, idx) => (
                      <div key={idx}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold">{a.move}</span>
                          {a.marker && (
                            <span className={`font-bold ${getMarkerColor(a.marker)}`}>
                              {getMarkerSymbol(a.marker)} {t(`marker_${a.marker}`)}
                            </span>
                          )}
                        </div>
                        {a.evaluation !== null && (
                          <p className="text-sm text-gray-400">
                            {t("analysis_evaluation")}: {(a.evaluation / 100).toFixed(2)}
                          </p>
                        )}
                        {a.bestMove && (
                          <p className="text-sm text-gray-400">
                            {t("analysis_best_move")}: {a.bestMove}
                          </p>
                        )}
                        {a.comment && <p className="text-sm mt-2">{a.comment}</p>}
                      </div>
                    ))}
                </div>
              )}
            </Card>
          </div>

          {/* Right side: Move list or Coach Chat */}
          <div>
            {showCoachChat ? (
              <CoachChat
                gameId={game.id}
                currentFen={chess.fen()}
                currentEvaluation={currentEvaluation}
                currentMoveNumber={currentMoveIndex}
              />
            ) : (
              <Card className="bg-[#312e2b] border-[#3d3a35] p-4">
                <h3 className="text-xl font-bold mb-4">Move History</h3>
                <div className="space-y-1 max-h-[600px] overflow-y-auto">
                  {moves.map((move, index) => {
                    const moveAnalysis = analysis?.find((a) => a.moveNumber === index + 1);
                    const isCurrentMove = index + 1 === currentMoveIndex;

                    return (
                      <div
                        key={index}
                        className={`flex gap-2 text-sm p-2 rounded cursor-pointer ${
                          isCurrentMove ? "bg-[#81b64c] text-white" : "hover:bg-[#3d3a35]"
                        }`}
                        onClick={() => goToMove(index + 1)}
                      >
                        <span className="text-gray-400 w-8">
                          {Math.floor(index / 2) + 1}
                          {index % 2 === 0 ? "." : "..."}
                        </span>
                        <span className="flex-1">{move}</span>
                        {moveAnalysis?.marker && (
                          <span className={getMarkerColor(moveAnalysis.marker)}>
                            {getMarkerSymbol(moveAnalysis.marker)}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
