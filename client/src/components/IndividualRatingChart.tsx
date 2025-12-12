import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";

interface RatingChartData {
  date: string;
  rating: number;
}

interface IndividualRatingChartProps {
  title: string;
  rating: number | null;
  data: RatingChartData[];
  color: string;
  icon: React.ReactNode;
}

export default function IndividualRatingChart({
  title,
  rating,
  data,
  color,
  icon,
}: IndividualRatingChartProps) {
  return (
    <Card className="bg-[#3d3a35] border-[#4a4743] p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-bold text-white">{title}</h3>
        </div>
        <p className={`text-2xl font-bold ${color}`}>
          {rating !== null ? rating : "N/A"}
        </p>
      </div>

      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4a4743" />
            <XAxis dataKey="date" stroke="#999" tick={{ fontSize: 12 }} />
            <YAxis stroke="#999" tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#2a2725",
                border: `1px solid ${color}`,
                borderRadius: "4px",
                color: "#fff",
              }}
            />
            <Line
              type="monotone"
              dataKey="rating"
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-24 flex items-center justify-center text-gray-400">
          <p className="text-sm">No data available</p>
        </div>
      )}
    </Card>
  );
}
