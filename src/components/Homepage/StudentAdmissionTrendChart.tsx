import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface AdmissionData {
  name: string;
  value: number;
  color: string;
}

const data: AdmissionData[] = [
  {
    name: "LKG",
    value: 61,
    color: "#1B84FF",
  },
  {
    name: "5th Standard",
    value: 23,
    color: "#F39205",
  },
  {
    name: "8th Standard",
    value: 16,
    color: "#66BB6A",
  },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div
      className="
        w-14 h-14
        rounded-full
        bg-[#E8F1F7]
        border border-[#8CA7C0]
        shadow-sm
        flex items-center justify-center
      "
    >
      <span className="text-[16px] font-medium text-[#111827]">
        {payload[0].value}%
      </span>
    </div>
  );
};

const StudentAdmissionTrendChart = () => {
  return (
    <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 h-full min-h-[480px]">
      <h3 className="text-[20px] font-semibold text-[#2B2B2B] mb-6">
        Student admission trend
      </h3>

      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              content={<CustomTooltip />}
              cursor={false}
            />

            <Pie
              data={data}
              dataKey="value"
              innerRadius={32}
              outerRadius={150}
              cornerRadius={10}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.color}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap gap-6 mt-2">
        {data.map((item) => (
          <div
            key={item.name}
            className="flex items-center gap-2"
          >
            <div
              className="w-4 h-4 rounded-[3px]"
              style={{
                backgroundColor: item.color,
              }}
            />
            <span className="text-[16px] text-[#666]">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentAdmissionTrendChart;