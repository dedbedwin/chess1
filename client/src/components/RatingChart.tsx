import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";

interface RatingData {
  format: string;
  rating: number;
}

interface RatingChartProps {
  data: RatingData[];
  title?: string;
}

export default function RatingChart({ data, title = "Ratings by Format" }: RatingChartProps) {
  // Filter out N/A ratings (0 or null)
  const validData = data.filter((d) => d.rating > 0);

  // Chess.com color palette (not green)
  const colors: Record<string, string> = {
    Bullet: "#f59e0b",      // Amber/Orange
    Blitz: "#3b82f6",       // Blue
    Rapid: "#8b5cf6",       // Purple
    Daily: "#ec4899",       // Pink
  };

  if (validData.length === 0) {
    return (
      <Card className="bg-[#3d3a35] border-[#4a4743] p-6">
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        <div className="text-center py-8">
          <p className="text-gray-400">Link your Chess.com account to see your ratings</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-[#3d3a35] border-[#4a4743] p-6">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={validData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4a4743" />
          <XAxis dataKey="format" stroke="#999" />
          <YAxis stroke="#999" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#2a2725",
              border: "1px solid #4a4743",
              borderRadius: "4px",
              color: "#fff",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="rating"
            stroke={colors.Bullet}
            strokeWidth={3}
            dot={{ fill: colors.Bullet, r: 6 }}
            activeDot={{ r: 8 }}
            name="Rating"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
