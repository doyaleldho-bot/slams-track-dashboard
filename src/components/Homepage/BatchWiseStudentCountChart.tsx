import { useEffect, useState } from "react";
import api from "../../api/axios";

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
  const [data, setData] = useState<BatchData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBatchData = async () => {
      try {
        const res = await api.get("/dashboard-charts/");

        const batchData = res.data.batch_wise_student_count || [];

        const formattedData: BatchData[] = batchData.map(
          (item: any) => ({
            batch: item.batch,
            students: item.count,
          })
        );

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching batch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBatchData();
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
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
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