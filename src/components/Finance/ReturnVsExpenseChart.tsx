import React, { useState, useEffect } from "react";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";
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
import {
  getFinanceRevenueReports,
  getFinanceRevenueYears,
  getFinanceRevenueMonths,
} from "../../api/finance";

const ReturnVsExpenseChart: React.FC = () => {
  const [year, setYear] = useState("All Year");
  const [month, setMonth] = useState<number | undefined>(undefined);
  const [yearOptions, setYearOptions] = useState<string[]>(["All Year"]);
  const [monthOptions, setMonthOptions] = useState<number[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadYearOptions = async () => {
      try {
        const response = await getFinanceRevenueYears();
        if (!mounted) return;
        const years = Array.isArray(response)
          ? response.map((item: any) => String(item.year ?? item))
          : [];
        setYearOptions(["All Year", ...years]);
      } catch (fetchError) {
        console.error("Failed to load revenue year options", fetchError);
      }
    };

    const loadMonthOptions = async () => {
      try {
        const response = await getFinanceRevenueMonths();
        if (!mounted) return;
        const months = Array.isArray(response)
          ? response.map((item: any) => Number(item.month ?? item))
          : [];
        setMonthOptions(months.filter((m) => !Number.isNaN(m)));
      } catch (fetchError) {
        console.error("Failed to load revenue month options", fetchError);
      }
    };

    loadYearOptions();
    loadMonthOptions();

    const loadRevenueData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getFinanceRevenueReports(1, 12, year, month);
        if (!mounted) return;

        // Handle chart_data from response (all months data)
        if (Array.isArray(response?.chart_data)) {
          const mappedData = response.chart_data.map((item: any) => ({
            month: item.month_name ?? item.month ?? "",
            admissionRevenue: Number(item.admission_revenue ?? 0) || 0,
            feeCollection: Number(item.fee_collection ?? 0) || 0,
            salaryExpenses: Number(item.salary_expense ?? 0) || 0,
          }));
          setChartData(mappedData);
          return;
        }

        const totals =
          response?.data ??
          (Array.isArray(response?.results) ? null : response?.results) ??
          null;

        if (totals && typeof totals === "object" && !Array.isArray(totals)) {
          setChartData([
            {
              month: year === "All Year" ? "All Year" : String(year),
              admissionRevenue:
                Number(
                  totals.total_admission_revenue ??
                    totals.total_admission ??
                    totals.admission_revenue ??
                    0,
                ) || 0,
              feeCollection:
                Number(
                  totals.total_fee_collection ??
                    totals.total_amount_collected ??
                    totals.fee_collection ??
                    0,
                ) || 0,
              salaryExpenses:
                Number(
                  totals.total_salary_expense ??
                    totals.salary_expenses ??
                    totals.salary ??
                    0,
                ) || 0,
            },
          ]);
        } else {
          let results: any[] = [];
          if (Array.isArray(response?.results)) results = response.results;
          else if (Array.isArray(response?.results?.data))
            results = response.results.data;
          else if (Array.isArray(response?.data)) results = response.data;

          const mappedData = results.map((item: any) => ({
            month:
              item.month ?? item.report_month ?? item.name ?? item.label ?? "",
            admissionRevenue:
              Number(
                item.admission_revenue ??
                  item.revenue ??
                  item.admissionRevenue ??
                  item.admission ??
                  0,
              ) || 0,
            feeCollection:
              Number(
                item.fee_collection ??
                  item.fees_collected ??
                  item.feeCollection ??
                  item.fees ??
                  0,
              ) || 0,
            salaryExpenses:
              Number(
                item.salary_expenses ??
                  item.salary_expence ??
                  item.salary_expenses ??
                  item.salary ??
                  item.expense ??
                  0,
              ) || 0,
          }));

          if (mappedData.length > 0) {
            setChartData(mappedData);
          }
        }
      } catch (fetchError: unknown) {
        console.error("Failed to fetch revenue report", fetchError);
        if (!mounted) return;
        setError("Unable to load revenue data.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadRevenueData();

    return () => {
      mounted = false;
    };
  }, [year]);

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
              {yearOptions.map((yearOption) => (
                <option key={yearOption} value={yearOption}>
                  {yearOption}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3 rounded-[10px] border-[#E5E7EB] bg-white px-4 py-2">
            <span className="text-sm font-medium text-[#111827]">Month</span>
            <select
              value={month ?? ""}
              onChange={(e) =>
                setMonth(e.target.value ? Number(e.target.value) : undefined)
              }
              className="h-10 rounded-[10px] border border-[#E5E7EB] bg-white px-4 text-sm text-[#111827] outline-none"
            >
              <option value="">All Month</option>
              {monthOptions.map((monthOption) => (
                <option key={monthOption} value={monthOption}>
                  {monthOption}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={() => {
            try {
              const exportData = chartData.map((item) => ({
                Month: item.month,
                "Admission Revenue": item.admissionRevenue,
                "Fee Collection": item.feeCollection,
                "Salary Expenses": item.salaryExpenses,
              }));

              const worksheet = XLSX.utils.json_to_sheet(exportData);
              const workbook = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(
                workbook,
                worksheet,
                "Revenue Report",
              );
              XLSX.writeFile(
                workbook,
                `revenue-report-${year === "All Year" ? "all" : year}-${month ?? "all"}-${new Date().toISOString().split("T")[0]}.xlsx`,
              );
            } catch (error) {
              console.error("Revenue report export failed", error);
            }
          }}
          className="inline-flex items-center gap-2 rounded-[10px] border border-[#D1D5DB] bg-white px-4 py-2 text-sm font-semibold text-[#111827] shadow-sm hover:bg-[#F8F8F8]"
        >
          <Download size={16} />
          Export Report
        </button>
      </div>

      {error ? (
        <div className="mb-4 rounded-[10px] bg-[#FEF3C7] px-4 py-3 text-sm text-[#92400E]">
          {error}
        </div>
      ) : null}

      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <BarChart
            data={chartData}
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
              dataKey="admissionRevenue"
              name="Admission Revenue"
              fill="#0073F9"
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="feeCollection"
              name="Fee Collection"
              fill="#8CB92B"
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="salaryExpenses"
              name="Salary Expenses"
              fill="#6F849C"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {isLoading ? (
        <div className="mt-4 text-sm text-[#6B7280]">Updating chart data…</div>
      ) : null}
    </div>
  );
};

export default ReturnVsExpenseChart;
