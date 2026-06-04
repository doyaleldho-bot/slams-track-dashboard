import React, { useState } from "react";
import { Download } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  {
    month: "January",
    "Admission Revenue": 900,
    "fee Collection": 700,
    "salary expences": 880,
  },
  {
    month: "February",
    "Admission Revenue": 920,
    "fee Collection": 720,
    "salary expences": 890,
  },
  {
    month: "March",
    "Admission Revenue": 910,
    "fee Collection": 710,
    "salary expences": 885,
  },
  {
    month: "April",
    "Admission Revenue": 905,
    "fee Collection": 705,
    "salary expences": 880,
  },
  {
    month: "May",
    "Admission Revenue": 915,
    "fee Collection": 715,
    "salary expences": 890,
  },
  {
    month: "June",
    "Admission Revenue": 920,
    "fee Collection": 720,
    "salary expences": 895,
  },
  {
    month: "July",
    "Admission Revenue": 930,
    "fee Collection": 730,
    "salary expences": 900,
  },
  {
    month: "August",
    "Admission Revenue": 925,
    "fee Collection": 725,
    "salary expences": 895,
  },
  {
    month: "September",
    "Admission Revenue": 918,
    "fee Collection": 718,
    "salary expences": 888,
  },
  {
    month: "October",
    "Admission Revenue": 928,
    "fee Collection": 728,
    "salary expences": 898,
  },
  {
    month: "November",
    "Admission Revenue": 935,
    "fee Collection": 735,
    "salary expences": 905,
  },
  {
    month: "December",
    "Admission Revenue": 940,
    "fee Collection": 740,
    "salary expences": 910,
  },
];

const ReturnVsExpenseChart: React.FC = () => {
  const [year, setYear] = useState("All Year");

  return (
    <div className="rounded-[10px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <h3 className="text-lg font-semibold">Return Vs Expences</h3>
          <div className="flex items-center gap-3 rounded-[10px] border-[#E5E7EB] bg-white px-4 py-2">
            <span className="text-sm font-medium text-[#111827]">Year</span>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="h-10 rounded-[10px] border border-[#E5E7EB] bg-white px-4 text-sm text-[#111827] outline-none"
            >
              <option>All Year</option>
              <option>2026</option>
              <option>2025</option>
            </select>
          </div>
        </div>
        <button className="inline-flex items-center gap-2 rounded-[10px] border border-[#D1D5DB] bg-white px-4 py-2 text-sm font-semibold text-[#111827] shadow-sm hover:bg-[#F8F8F8]">
          <Download size={16} />
          Export Report
        </button>
      </div>

      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            barCategoryGap="10%"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 14 }} />
            <YAxis />
            <Tooltip />
            <Legend
              verticalAlign="bottom"
              height={34}
              wrapperStyle={{ paddingTop: "20px" }}
              content={({ payload }: any) => (
                <div className="flex justify-center gap-7">
                  {payload?.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className="w-3.5 h-3.5 rounded-sm"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-sm text-[#6B7280]">
                        {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            />

            <Bar
              dataKey="Admission Revenue"
              fill="#0073F9"
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="fee Collection"
              fill="#8CB92B"
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="salary expences"
              fill="#6F849C"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ReturnVsExpenseChart;
