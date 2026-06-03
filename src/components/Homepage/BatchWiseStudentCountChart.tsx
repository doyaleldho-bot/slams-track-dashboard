import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface BatchData {
  batch: string;
  students: number;
}

const data: BatchData[] = [
  {
    batch: "Batch 2026",
    students: 900,
  },
  {
    batch: "Batch 2025",
    students: 600,
  },
  {
    batch: "Batch 2023",
    students: 1020,
  },
  {
    batch: "Batch 2024",
    students: 700,
  },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-lg">
        <p className="text-sm font-medium text-gray-800">
          {payload[0].payload.batch}
        </p>
        <p className="text-sm font-semibold text-[#1672E8]">
          {payload[0].value} Students
        </p>
      </div>
    );
  }

  return null;
};

const BatchWiseStudentCountChart = () => {
  return (
    <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 h-full min-h-[480px]">
      <h3 className="text-[20px] font-semibold text-[#2B2B2B] mb-6">
        Batch-wise student count
      </h3>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 0,
              left: 0,
              bottom: 10,
            }}
          >
            <CartesianGrid
              stroke="#CFCFCF"
              strokeDasharray="4 4"
              vertical={false}
            />

            <XAxis
              dataKey="batch"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#9CA3AF",
                fontSize: 12,
              }}
            />

            <YAxis
              domain={[0, 1200]}
              ticks={[0, 300, 600, 900, 1200]}
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#7A7A7A",
                fontSize: 14,
              }}
            />

            <Tooltip
              cursor={false}
              content={<CustomTooltip />}
            />

            <Bar
              dataKey="students"
              fill="#1672E8"
              radius={[8, 8, 0, 0]}
              barSize={88}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BatchWiseStudentCountChart;