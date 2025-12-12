import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { ChevronRight, Trophy, Clock, Target } from "lucide-react";

interface PuzzleTheme {
  id: number;
  name: string;
  description?: string;
  icon?: string;
}

interface Puzzle {
  id: number;
  fen: string;
  moves: string;
  solution: string;
  difficulty: string;
  rating?: number;
  description?: string;
  themeId?: number;
}

export default function Puzzles() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

  const [themes, setThemes] = useState<PuzzleTheme[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<number | null>(null);
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock themes data
  useEffect(() => {
    const mockThemes: PuzzleTheme[] = [
      { id: 1, name: "Tactics", description: "Tactical puzzles and combinations" },
      { id: 2, name: "Strategy", description: "Strategic positioning and planning" },
      { id: 3, name: "Endgames", description: "Endgame techniques and theory" },
      { id: 4, name: "Openings", description: "Opening principles and theory" },
      { id: 5, name: "Checkmate", description: "Checkmate patterns and combinations" },
      { id: 6, name: "Pins & Forks", description: "Tactical motifs: pins, forks, skewers" },
    ];
    setThemes(mockThemes);
  }, []);

  const handleSelectTheme = (themeId: number) => {
    setSelectedTheme(themeId);
    loadPuzzles(themeId);
  };

  const loadPuzzles = async (themeId: number) => {
    setLoading(true);
    // Mock puzzle loading
    const mockPuzzles: Puzzle[] = [
      {
        id: 1,
        fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
        moves: '["e4", "c5", "Nf3", "Nc6", "Bc4"]',
        solution: "Nxe5",
        difficulty: "intermediate",
        rating: 1200,
        description: "Find the winning move",
        themeId,
      },
      {
        id: 2,
        fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
        moves: '["e4", "c5", "Nf3", "Nc6", "Bc4"]',
        solution: "Bxf7",
        difficulty: "advanced",
        rating: 1500,
        description: "Sacrifice for advantage",
        themeId,
      },
    ];
    setPuzzles(mockPuzzles);
    setLoading(false);
  };

  const handleStartPuzzle = (puzzleId: number) => {
    setLocation(`/puzzle-game/${puzzleId}`);
  };

  return (
    <div className="min-h-screen bg-[#262421] text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Chess Puzzles</h1>
          <p className="text-gray-400">Improve your tactical skills with our puzzle collection</p>
        </div>

        {/* Puzzle Themes */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Select a Theme</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {themes.map((theme) => (
              <Card
                key={theme.id}
                className={`p-6 cursor-pointer transition-all ${
                  selectedTheme === theme.id
                    ? "bg-green-600 border-green-500"
                    : "bg-[#3d3a35] border-[#4a4743] hover:bg-[#4a4743]"
                }`}
                onClick={() => handleSelectTheme(theme.id)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold mb-2">{theme.name}</h3>
                    <p className="text-sm text-gray-300">{theme.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-green-400" />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Puzzles List */}
        {selectedTheme && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Puzzles</h2>
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-400">Loading puzzles...</p>
              </div>
            ) : puzzles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {puzzles.map((puzzle) => (
                  <Card
                    key={puzzle.id}
                    className="bg-[#3d3a35] border-[#4a4743] p-6 hover:bg-[#4a4743] transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold mb-2">{puzzle.description}</h3>
                        <div className="flex gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <Trophy className="w-4 h-4" />
                            <span>Rating: {puzzle.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            <span className="capitalize">{puzzle.difficulty}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mini board preview */}
                    <div className="bg-[#2a2725] rounded p-4 mb-4 aspect-square flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-gray-500 text-sm">FEN: {puzzle.fen.substring(0, 30)}...</p>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleStartPuzzle(puzzle.id)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Start Puzzle
                    </Button>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">No puzzles available for this theme yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
