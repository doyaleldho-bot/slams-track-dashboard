import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface CollectionData {
  month: string;
  amount: number;
}

const data: CollectionData[] = [
  { month: "Jan", amount: 60000 },
  { month: "Feb", amount: 170000 },
  { month: "Mar", amount: 160000 },
  { month: "Apr", amount: 160000 },
  { month: "May", amount: 150000 },
  { month: "Jun", amount: 240000 },
  { month: "Jul", amount: 175000 },
  { month: "Aug", amount: 265000 },
  { month: "Sep", amount: 270000 },
  { month: "Oct", amount: 305000 },
  { month: "Nov", amount: 160000 },
  { month: "Dec", amount: 200000 },

];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white shadow-lg border border-gray-100 px-3 py-2 rounded-lg">
        <p className="text-xs text-gray-500">{payload[0].payload.month}</p>
        <p className="text-sm font-semibold text-gray-900">
          ₹ {payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }

  return null;
};

const MonthlyCollectionChart: React.FC = () => {
  return (
    <div className="w-full h-[726px]  rounded-3xl p-5 md:p-6 mb-6 pb-6 ">
      {/* Title */}
      <h3 className="text-[20px] font-semibold text-[#202020] mb-4">
        Monthly Collection Chart
      </h3>

      {/* Chart */}
      <div className="w-full h-full max-h-[726px] ">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
           accessibilityLayer={false}
  tabIndex={-1}
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 10,
              bottom: 10,
            }}
          >
            {/* Gradient */}
            <defs>
              <linearGradient
                id="collectionGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="40%"
                  stopColor="#7F8EF7"
                  stopOpacity={0.22}
                />
                <stop
                  offset="100%"
                  stopColor="#7F8EF7"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            {/* Grid */}
            <CartesianGrid
              stroke="#E9E9E9"
              vertical={false}
              strokeDasharray="0"
            />

            {/* X Axis */}
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#8A8A8A",
                fontSize: 16,
              }}
              dy={12}
            />

            {/* Y Axis */}
            <YAxis
              domain={[0, 320000]}
              ticks={[0, 80000, 160000, 240000, 320000]}
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#8A8A8A",
                fontSize: 16,
              }}
              width={60}
            />

            <Tooltip
              cursor={false}
              content={<CustomTooltip />}
            />

            {/* Area */}
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#8192F8"
              strokeWidth={8}
              fill="url(#collectionGradient)"
              activeDot={{
                r: 12,
                stroke: "#FFFFFF",
                fill: "#8192F8",
                strokeWidth: 6,
              }}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyCollectionChart;