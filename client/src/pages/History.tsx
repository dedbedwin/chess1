import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

export default function History() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const { data: games, isLoading } = trpc.chess.getMyGames.useQuery({ limit: 50 });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#262421] text-white flex items-center justify-center">
        <p>{t("loading")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#262421] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">{t("nav_history")}</h1>
          <Button
            className="bg-[#81b64c] hover:bg-[#6fa03c]"
            onClick={() => setLocation("/play")}
          >
            {t("btn_new_game")}
          </Button>
        </div>

        {!games || games.length === 0 ? (
          <Card className="bg-[#312e2b] border-[#3d3a35] p-8 text-center">
            <p className="text-gray-400 mb-4">No games played yet</p>
            <Button
              className="bg-[#81b64c] hover:bg-[#6fa03c]"
              onClick={() => setLocation("/play")}
            >
              {t("btn_new_game")}
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {games.map((game) => {
              const resultColor =
                game.result === "win"
                  ? "text-green-500"
                  : game.result === "loss"
                  ? "text-red-500"
                  : "text-gray-400";

              const resultText =
                game.result === "win"
                  ? t("result_win")
                  : game.result === "loss"
                  ? t("result_loss")
                  : t("result_draw");

              return (
                <Card
                  key={game.id}
                  className="bg-[#312e2b] border-[#3d3a35] p-4 hover:bg-[#3d3a35] transition-colors cursor-pointer"
                  onClick={() => setLocation(`/analysis/${game.id}`)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-semibold">
                          vs {game.opponentName}
                        </span>
                        {game.opponentRating && (
                          <span className="text-sm text-gray-400">
                            ({game.opponentRating})
                          </span>
                        )}
                        <span className="text-sm text-gray-400">
                          {game.playerColor === "white" ? "⚪" : "⚫"}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        {new Date(game.startedAt).toLocaleDateString()} •{" "}
                        {game.opponentType === "coach" ? t("mode_coach") : t("mode_bot")}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`text-lg font-bold ${resultColor}`}>
                        {resultText}
                      </div>
                      {game.result !== "ongoing" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLocation(`/analysis/${game.id}`);
                          }}
                        >
                          {t("btn_analyze")}
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
