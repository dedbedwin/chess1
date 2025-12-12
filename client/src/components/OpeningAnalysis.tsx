import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronDown, ChevronUp } from "lucide-react";

interface OpeningMove {
  moveNumber: number;
  move: string;
  fen: string;
  isTheory: boolean;
  alternatives?: string[];
}

interface OpeningAnalysisProps {
  moves: string[];
  analysis: Array<{
    moveNumber: number;
    move: string;
    marker?: string | null;
  }>;
  onMoveClick: (moveNumber: number) => void;
}

export function OpeningAnalysis({ moves, analysis, onMoveClick }: OpeningAnalysisProps) {
  const { t } = useLanguage();
  const [expandedMoves, setExpandedMoves] = useState<number[]>([]);
  const [openingMoves, setOpeningMoves] = useState<OpeningMove[]>([]);

  useEffect(() => {
    // Analyze opening moves (typically first 10-15 moves)
    const openingLength = Math.min(15, Math.floor(moves.length / 2));
    const analyzed: OpeningMove[] = [];

    for (let i = 0; i < openingLength; i++) {
      const moveNum = i + 1;
      const moveAnalysis = analysis.find((a) => a.moveNumber === moveNum);
      const isTheory = moveAnalysis?.marker === "book";

      analyzed.push({
        moveNumber: moveNum,
        move: moves[i],
        fen: "", // Would be populated from game state
        isTheory: isTheory,
        alternatives: generateAlternatives(i),
      });
    }

    setOpeningMoves(analyzed);
  }, [moves, analysis]);

  const generateAlternatives = (moveIndex: number): string[] => {
    // In a real implementation, this would fetch from a chess opening database
    const commonAlternatives: Record<number, string[]> = {
      0: ["1.e4", "1.d4", "1.c4"],
      1: ["1...c5", "1...e5", "1...c6"],
      2: ["2.Nf3", "2.Nc3", "2.f4"],
      3: ["2...d6", "2...e6", "2...Nc6"],
      4: ["3.d4", "3.Bb5", "3.Nc3"],
      5: ["3...cxd4", "3...exd4", "3...a6"],
    };

    return commonAlternatives[moveIndex] || [];
  };

  const toggleExpanded = (moveNumber: number) => {
    setExpandedMoves((prev) =>
      prev.includes(moveNumber)
        ? prev.filter((m) => m !== moveNumber)
        : [...prev, moveNumber]
    );
  };

  const getOpeningName = (): string => {
    // Simplified opening name detection based on moves
    if (moves.length >= 2) {
      if (moves[0] === "e4" && moves[1] === "c5") return "Sicilian Defense";
      if (moves[0] === "e4" && moves[1] === "e5") return "Open Game";
      if (moves[0] === "d4" && moves[1] === "d5") return "Closed Game";
      if (moves[0] === "d4" && moves[1] === "Nf6") return "Indian Defense";
      if (moves[0] === "c4") return "Reti Opening";
    }
    return "Unknown Opening";
  };

  const calculateOpeningAccuracy = (): number => {
    const theoryMoves = openingMoves.filter((m) => m.isTheory).length;
    return Math.round((theoryMoves / Math.max(openingMoves.length, 1)) * 100);
  };

  return (
    <Card className="bg-[#312e2b] border-[#3d3a35] p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Opening Analysis</h3>
        <div className="text-sm text-gray-400">
          {getOpeningName()}
        </div>
      </div>

      {/* Opening Performance */}
      <div className="mb-6 p-3 bg-[#262421] rounded">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold">Opening Accuracy</span>
          <span className="text-lg font-bold text-[#81b64c]">{calculateOpeningAccuracy()}%</span>
        </div>
        <div className="w-full bg-[#3d3a35] rounded-full h-2">
          <div
            className="bg-[#81b64c] h-2 rounded-full transition-all"
            style={{ width: `${calculateOpeningAccuracy()}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {openingMoves.filter((m) => m.isTheory).length} of {openingMoves.length} moves follow theory
        </p>
      </div>

      {/* Opening Moves */}
      <div className="space-y-2 mb-4">
        <h4 className="text-sm font-semibold text-gray-300">Opening Moves</h4>
        {openingMoves.map((move) => {
          const isExpanded = expandedMoves.includes(move.moveNumber);
          const moveAnalysis = analysis.find((a) => a.moveNumber === move.moveNumber);

          return (
            <div key={move.moveNumber} className="border border-[#3d3a35] rounded">
              <div
                className="flex items-center justify-between p-3 hover:bg-[#3d3a35] cursor-pointer"
                onClick={() => toggleExpanded(move.moveNumber)}
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-gray-400 w-8 text-sm">
                    {Math.ceil(move.moveNumber / 2)}.{move.moveNumber % 2 === 1 ? "" : ".."}
                  </span>
                  <span className="font-semibold">{move.move}</span>
                  {move.isTheory && (
                    <span className="text-xs bg-[#81b64c] text-white px-2 py-1 rounded">
                      Theory
                    </span>
                  )}
                  {moveAnalysis?.marker && (
                    <span className="text-xs text-gray-400">
                      {moveAnalysis.marker}
                    </span>
                  )}
                </div>
                <div>
                  {isExpanded ? (
                    <ChevronUp size={16} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={16} className="text-gray-400" />
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t border-[#3d3a35] p-3 bg-[#262421]">
                  {/* Alternatives */}
                  {move.alternatives && move.alternatives.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-gray-400 mb-2">
                        Common Alternatives:
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {move.alternatives.map((alt, idx) => (
                          <Button
                            key={idx}
                            variant="outline"
                            size="sm"
                            className="text-xs h-7"
                            onClick={() => onMoveClick(move.moveNumber)}
                          >
                            {alt}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 mb-2">
                      Recommendations:
                    </p>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {move.isTheory
                        ? "This move follows established opening theory. Good preparation!"
                        : "Consider studying this position in opening theory to improve your preparation."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="p-3 bg-[#262421] rounded text-sm">
        <h4 className="font-semibold mb-2">Opening Summary</h4>
        <ul className="space-y-1 text-xs text-gray-300">
          <li>• Opening: <span className="text-[#81b64c]">{getOpeningName()}</span></li>
          <li>• Moves analyzed: <span className="text-[#81b64c]">{openingMoves.length}</span></li>
          <li>• Theory moves: <span className="text-[#81b64c]">{openingMoves.filter((m) => m.isTheory).length}</span></li>
          <li>• Improvement: Study the alternatives above to strengthen your opening repertoire</li>
        </ul>
      </div>
    </Card>
  );
}
