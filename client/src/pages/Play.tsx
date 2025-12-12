import { useState, useEffect, useCallback } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { getStockfishEngine } from "@/lib/stockfish";
import { BOT_PERSONALITIES, getRandomPhrase } from "@shared/ai-prompts";
import { toast } from "sonner";
import { CoachChat } from "@/components/CoachChat";

export default function Play() {
  const { t } = useLanguage();
  const [game, setGame] = useState(new Chess());
  const [gameId, setGameId] = useState<number | null>(null);
  const [selectedBot, setSelectedBot] = useState<number>(1200);
  const [playerColor, setPlayerColor] = useState<"white" | "black">("white");
  const [gameMode, setGameMode] = useState<"bot" | "coach" | null>(null);
  const [gameStatus, setGameStatus] = useState<string>("");
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState<number | undefined>();

  const createGameMutation = trpc.chess.createGame.useMutation();
  const updateGameMutation = trpc.chess.updateGame.useMutation();
  const { data: settings } = trpc.chess.getSettings.useQuery();

  const engine = getStockfishEngine();

  // Initialize engine
  useEffect(() => {
    engine.waitUntilReady();
  }, []);

  const startNewGame = useCallback(
    async (mode: "bot" | "coach", botRating: number, color: "white" | "black") => {
      const newGame = new Chess();
      setGame(newGame);
      setGameMode(mode);
      setSelectedBot(botRating);
      setPlayerColor(color);
      setMoveHistory([]);
      setGameStatus("");

      const bot = BOT_PERSONALITIES.find((b) => b.rating === botRating);
      const opponentName = bot?.name || `Bot ${botRating}`;

      // Create game in database
      const createdGame = await createGameMutation.mutateAsync({
        opponentType: mode,
        opponentName,
        opponentRating: botRating,
        playerColor: color,
        fen: newGame.fen(),
      });

      if (createdGame) {
        setGameId(createdGame.id);

        // Show bot greeting
        if (bot) {
          toast.info(getRandomPhrase(bot.greetings));
        }

        // If player is black, make bot's first move
        if (color === "black") {
          setTimeout(() => makeBotMove(newGame), 500);
        }
      }
    },
    [createGameMutation]
  );

  const makeBotMove = async (currentGame: Chess) => {
    if (currentGame.isGameOver()) return;

    setIsThinking(true);
    try {
      const fen = currentGame.fen();
      const evaluation = await engine.evaluatePosition(fen);
      setCurrentEvaluation(evaluation.score);
      
      const move = await engine.getBotMove(fen, selectedBot);

      if (move) {
        currentGame.move(move);
        setGame(new Chess(currentGame.fen()));
        setMoveHistory([...currentGame.history()]);
        updateGameState(currentGame);
      }
    } catch (error) {
      console.error("Bot move error:", error);
      toast.error("Bot failed to make a move");
    } finally {
      setIsThinking(false);
    }
  };

  const onDrop = ({ sourceSquare, targetSquare }: { piece: any; sourceSquare: string; targetSquare: string | null }) => {
    if (!gameMode || isThinking || !targetSquare) return false;

    // Check if it's player's turn
    const isPlayerTurn =
      (playerColor === "white" && game.turn() === "w") ||
      (playerColor === "black" && game.turn() === "b");

    if (!isPlayerTurn) {
      toast.warning(t("status_opponent_turn"));
      return false;
    }

    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q", // Always promote to queen for simplicity
      });

      if (move) {
        const newGame = new Chess(game.fen());
        setGame(newGame);
        setMoveHistory([...newGame.history()]);
        updateGameState(newGame);

        // Make bot move after a short delay
        if (!newGame.isGameOver()) {
          setTimeout(() => makeBotMove(newGame), 500);
        }

        return true;
      }
    } catch (error) {
      // Invalid move
      return false;
    }

    return false;
  };

  const updateGameState = (currentGame: Chess) => {
    let status = "";
    let result: "win" | "loss" | "draw" | "ongoing" = "ongoing";

    if (currentGame.isCheckmate()) {
      const winner = currentGame.turn() === "w" ? "black" : "white";
      result = winner === playerColor ? "win" : "loss";
      status = t("status_checkmate") + " " + (result === "win" ? t("result_win") : t("result_loss"));

      // Show bot phrase
      const bot = BOT_PERSONALITIES.find((b) => b.rating === selectedBot);
      if (bot) {
        const phrase =
          result === "win"
            ? getRandomPhrase(bot.lossPhrases)
            : getRandomPhrase(bot.winPhrases);
        toast.info(phrase);
      }
    } else if (currentGame.isDraw()) {
      result = "draw";
      status = t("status_draw");

      const bot = BOT_PERSONALITIES.find((b) => b.rating === selectedBot);
      if (bot) {
        toast.info(getRandomPhrase(bot.drawPhrases));
      }
    } else if (currentGame.isCheck()) {
      status = t("status_check");
    } else {
      status = currentGame.turn() === (playerColor === "white" ? "w" : "b")
        ? t("status_your_turn")
        : t("status_opponent_turn");
    }

    setGameStatus(status);

    // Update game in database
    if (gameId) {
      updateGameMutation.mutate({
        gameId,
        fen: currentGame.fen(),
        pgn: currentGame.pgn(),
        moves: JSON.stringify(currentGame.history()),
        result,
        endedAt: currentGame.isGameOver() ? new Date() : undefined,
      });
    }
  };

  const resign = () => {
    if (!gameId) return;

    updateGameMutation.mutate({
      gameId,
      result: "loss",
      endedAt: new Date(),
    });

    toast.info("You resigned");
    setGameMode(null);
  };

  // Board theme mapping
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

  if (!gameMode) {
    return (
      <div className="min-h-screen bg-[#262421] text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Chess Coach</h1>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-[#312e2b] border-[#3d3a35] p-6">
              <h2 className="text-2xl font-bold mb-4 text-[#81b64c]">{t("mode_bot")}</h2>
              <p className="text-gray-300 mb-4">
                Play against bots of different skill levels
              </p>

              <div className="space-y-2 mb-4">
                {BOT_PERSONALITIES.map((bot) => (
                  <Button
                    key={bot.rating}
                    variant={selectedBot === bot.rating ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedBot(bot.rating)}
                  >
                    {bot.name} ({bot.rating})
                  </Button>
                ))}
              </div>

              <div className="space-y-2">
                <Button
                  className="w-full bg-[#81b64c] hover:bg-[#6fa03c]"
                  onClick={() => startNewGame("bot", selectedBot, "white")}
                >
                  {t("color_white")}
                </Button>
                <Button
                  className="w-full bg-[#81b64c] hover:bg-[#6fa03c]"
                  onClick={() => startNewGame("bot", selectedBot, "black")}
                >
                  {t("color_black")}
                </Button>
              </div>
            </Card>

            <Card className="bg-[#312e2b] border-[#3d3a35] p-6">
              <h2 className="text-2xl font-bold mb-4 text-[#81b64c]">{t("mode_coach")}</h2>
              <p className="text-gray-300 mb-4">
                Play with an AI coach that helps you improve
              </p>

              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-400">
                  The coach will analyze your moves and provide feedback
                </p>
              </div>

              <div className="space-y-2">
                <Button
                  className="w-full bg-[#81b64c] hover:bg-[#6fa03c]"
                  onClick={() => startNewGame("coach", 1200, "white")}
                >
                  {t("color_white")}
                </Button>
                <Button
                  className="w-full bg-[#81b64c] hover:bg-[#6fa03c]"
                  onClick={() => startNewGame("coach", 1200, "black")}
                >
                  {t("color_black")}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#262421] text-white p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_400px] gap-6">
          {/* Board section */}
          <div className="space-y-4">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {gameMode === "coach" ? t("mode_coach") : t("mode_bot")}
              </h2>
              <Button variant="outline" onClick={() => setGameMode(null)}>
                {t("btn_new_game")}
              </Button>
            </div>

            <Card className="bg-[#312e2b] border-[#3d3a35] p-4">
              <Chessboard
                options={{
                  position: game.fen(),
                  onPieceDrop: onDrop,
                  boardOrientation: playerColor,
                  boardStyle: {
                    borderRadius: "4px",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
                  },
                  lightSquareStyle: currentTheme.lightSquareStyle,
                  darkSquareStyle: currentTheme.darkSquareStyle,
                }}
              />

              <div className="mt-4 text-center">
                <p className="text-lg font-semibold">{gameStatus}</p>
                {isThinking && <p className="text-sm text-gray-400">Bot is thinking...</p>}
              </div>
            </Card>

            <div className="mt-4 flex gap-2">
              <Button variant="destructive" onClick={resign}>
                {t("btn_resign")}
              </Button>
            </div>
          </div>

          {/* Sidebar: Move history or Coach chat */}
          <div className="space-y-4">
            {gameMode === "coach" && gameId ? (
              <div className="h-[600px]">
                <CoachChat
                  gameId={gameId}
                  currentFen={game.fen()}
                  currentEvaluation={currentEvaluation}
                  currentMoveNumber={moveHistory.length}
                />
              </div>
            ) : (
              <Card className="bg-[#312e2b] border-[#3d3a35] p-4">
                <h3 className="text-xl font-bold mb-4">Move History</h3>
                <div className="space-y-1 max-h-[600px] overflow-y-auto">
                  {moveHistory.map((move, index) => (
                    <div
                      key={index}
                      className="flex gap-2 text-sm p-1 hover:bg-[#3d3a35] rounded"
                    >
                      <span className="text-gray-400 w-8">{Math.floor(index / 2) + 1}.</span>
                      <span>{move}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
