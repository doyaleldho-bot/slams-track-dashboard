import React, { useEffect, useState } from "react";
import api from "../../api/axios";

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
  revenue: number;
}

interface DashboardLineChartResponse {
  status: boolean;
  message: string;
  year: number;
  data: CollectionData[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white shadow-lg border border-gray-100 px-3 py-2 rounded-lg">
        <p className="text-xs text-gray-500">
          {payload[0].payload.month}
        </p>
        <p className="text-sm font-semibold text-gray-900">
          ₹ {Number(payload[0].value).toLocaleString()}
        </p>
      </div>
    );
  }

  return null;
};

const MonthlyCollectionChart: React.FC = () => {
  const [chartData, setChartData] = useState<CollectionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);

        const response =
          await api.get<DashboardLineChartResponse>(
            "/dashboard-line-chart/"
          );

        setChartData(response.data.data);
      } catch (error) {
        console.error(
          "Failed to fetch dashboard chart data:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  const maxRevenue =
    Math.max(
      ...chartData.map((item) => item.revenue),
      100000
    ) * 1.1;

  if (loading) {
    return (
      <div className="w-full h-[726px] rounded-3xl p-5 md:p-6 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full h-[726px] rounded-3xl p-5 md:p-6 mb-6 pb-6">
      <h3 className="text-[20px] font-semibold text-[#202020] mb-4">
        Monthly Collection Chart
      </h3>

      <div className="w-full h-full max-h-[650px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            accessibilityLayer={false}
            tabIndex={-1}
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: 10,
              bottom: 10,
            }}
          >
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

            <CartesianGrid
              stroke="#E9E9E9"
              vertical={false}
              strokeDasharray="0"
            />

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

            <YAxis
              domain={[0, maxRevenue]}
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#8A8A8A",
                fontSize: 16,
              }}
              width={80}
              tickFormatter={(value) =>
                `₹${(value / 100000).toFixed(1)}L`
              }
            />

            <Tooltip
              cursor={false}
              content={<CustomTooltip />}
            />

            <Area
              type="monotone"
              dataKey="revenue"
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