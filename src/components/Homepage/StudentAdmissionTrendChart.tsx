import React, { useEffect, useState } from "react";
import api from "../../api/axios";
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

const COLORS = [
  "#1B84FF",
  "#F39205",
  "#66BB6A",
  "#EF4444",
  "#8B5CF6",
  "#14B8A6",
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
        {payload[0].value}
      </span>
    </div>
  );
};

const StudentAdmissionTrendChart = () => {
  const [data, setData] = useState<AdmissionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const res = await api.get("/dashboard-charts/");

        const trendData = res.data.student_admission_trend || [];

        const formattedData: AdmissionData[] = trendData.map(
          (item: any, index: number) => ({
            name: item.label,
            value: item.value,
            color: COLORS[index % COLORS.length],
          })
        );

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 h-full min-h-[480px] flex items-center justify-center">
        Loading...
      </div>
    );
  }

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