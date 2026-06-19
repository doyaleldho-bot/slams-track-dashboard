import api from "./axios";

export type FinanceDashboardData = any;
export type FinanceAdmissionsData = any;

export async function getFinanceDashboard(): Promise<FinanceDashboardData> {
  const res = await api.get("/finance/dashboard/");
  return res.data.data ?? res.data;
}

export async function getFinanceAdmissions(
  page: number = 1,
  pageSize: number = 10
): Promise<FinanceAdmissionsData> {
  const res = await api.get("/finance/admissions/", {
    params: {
      page,
      page_size: pageSize,
    },
  });

  return {
    count: res.data.count,
    next: res.data.next,
    previous: res.data.previous,
    results: res.data.results?.data ?? [],
  };
}

export async function getFinanceCourseReports(
  page: number = 1,
  pageSize: number = 10
): Promise<any> {
  const res = await api.get("/finance/reports/courses/", {
    params: {
      page,
      page_size: pageSize,
    },
  });
  return {
    count: res.data.count,
    next: res.data.next,
    previous: res.data.previous,
    results: res.data.results?.data ?? [],
  };
}

export async function getFinanceStudentReports(
  page: number = 1,
  pageSize: number = 10
): Promise<any> {
  const res = await api.get("/finance/reports/students/", {
    params: { page, page_size: pageSize },
  });
  return {
    count: res.data.count,
    next: res.data.next,
    previous: res.data.previous,
    results: res.data.results?.data ?? [],
  };
}

export async function getFinanceTeacherReports(
  page: number = 1,
  pageSize: number = 10
): Promise<any> {
  const res = await api.get("/finance/reports/teachers/", {
    params: { page, page_size: pageSize },
  });
  return {
    count: res.data.count,
    next: res.data.next,
    previous: res.data.previous,
    results: res.data.results?.data ?? [],
  };
}

export async function getFinanceRevenueYears(): Promise<any> {
  const res = await api.get("/finance/reports/revenue-years/");
  return res.data.data ?? res.data;
}

export async function getFinanceRevenueMonths(): Promise<any> {
  const res = await api.get("/finance/reports/revenue-months/");
  return res.data.data ?? res.data;
}

export async function getFinanceRevenueReports(
  page: number = 1,
  pageSize: number = 12,
  year?: string,
  month?: number
): Promise<any> {
  const params: Record<string, string | number> = {
    page,
    page_size: pageSize,
  };

  if (year && year !== "All Year") {
    params.year = year;
  }

  if (month) {
    params.month = month;
  }

  const res = await api.get("/finance/reports/revenue/", {
    params,
  });

  return {
    ...res.data,
    count: res.data.count,
    next: res.data.next,
    previous: res.data.previous,
    results: res.data.results?.data ?? res.data.data ?? [],
    data: res.data.data ?? res.data.results?.data ?? null,
  };
}

export default {
  getFinanceDashboard,
  getFinanceAdmissions,
  getFinanceCourseReports,
  getFinanceStudentReports,
  getFinanceTeacherReports,
  getFinanceRevenueReports,
};
