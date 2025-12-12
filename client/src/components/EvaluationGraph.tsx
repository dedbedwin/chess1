import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface EvaluationData {
  moveNumber: number;
  move: string;
  evaluation: number;
}

interface EvaluationGraphProps {
  analysis: Array<{
    moveNumber: number;
    move: string;
    evaluation: number | null;
    marker?: string | null;
  }>;
  onMoveClick: (moveNumber: number) => void;
  currentMoveNumber: number;
}

export function EvaluationGraph({ analysis, onMoveClick, currentMoveNumber }: EvaluationGraphProps) {
  const { t } = useLanguage();

  // Transform analysis data for chart
  const chartData: EvaluationData[] = analysis
    .filter((a) => a.evaluation !== null)
    .map((a) => ({
      moveNumber: a.moveNumber,
      move: a.move,
      evaluation: Math.max(-300, Math.min(300, (a.evaluation || 0) / 100)), // Normalize to -300 to 300 range
    }));

  if (chartData.length === 0) {
    return (
      <Card className="bg-[#312e2b] border-[#3d3a35] p-4">
        <h3 className="text-lg font-bold mb-4">Evaluation Graph</h3>
        <div className="text-center text-gray-400 py-8">
          <p>No evaluation data available</p>
        </div>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const evaluation = data.evaluation;
      const side = evaluation > 0 ? "White" : "Black";
      const advantage = Math.abs(evaluation).toFixed(1);

      return (
        <div className="bg-[#262421] border border-[#3d3a35] rounded p-2 text-sm">
          <p className="text-gray-300">Move {data.moveNumber}: {data.move}</p>
          <p className={evaluation > 0 ? "text-blue-400" : "text-red-400"}>
            {side} +{advantage}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-[#312e2b] border-[#3d3a35] p-4">
      <h3 className="text-lg font-bold mb-4">Evaluation Graph</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3d3a35" />
            <XAxis
              dataKey="moveNumber"
              stroke="#666"
              style={{ fontSize: "12px" }}
              tick={{ fill: "#999" }}
            />
            <YAxis
              stroke="#666"
              style={{ fontSize: "12px" }}
              tick={{ fill: "#999" }}
              domain={[-300, 300]}
              label={{ value: "Evaluation (Centipawns / 100)", angle: -90, position: "insideLeft" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="#81b64c" strokeDasharray="5 5" />
            <Line
              type="monotone"
              dataKey="evaluation"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
              onClick={(data: any) => {
                if (data.moveNumber) {
                  onMoveClick(data.moveNumber);
                }
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 flex gap-6 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-blue-400"></div>
          <span>Position Evaluation</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-[#81b64c] opacity-50"></div>
          <span>Equal Position</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-blue-400">↑</span>
          <span>White Advantage</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-red-400">↓</span>
          <span>Black Advantage</span>
        </div>
      </div>

      {/* Critical Moments */}
      <div className="mt-4 pt-4 border-t border-[#3d3a35]">
        <h4 className="text-sm font-bold mb-2">Critical Moments</h4>
        <div className="space-y-1 text-xs text-gray-400">
          {analysis
            .filter((a) => a.evaluation !== null && Math.abs((a.evaluation || 0) / 100) > 2)
            .slice(0, 3)
            .map((a) => (
              <div
                key={a.moveNumber}
                className="flex justify-between items-center p-2 bg-[#262421] rounded hover:bg-[#3d3a35] cursor-pointer"
                onClick={() => onMoveClick(a.moveNumber)}
              >
                <span>Move {a.moveNumber}: {a.move}</span>
                <span className={(a.evaluation || 0) > 0 ? "text-blue-400" : "text-red-400"}>
                  {((a.evaluation || 0) / 100).toFixed(1)}
                </span>
              </div>
            ))}
        </div>
      </div>
    </Card>
  );
}
