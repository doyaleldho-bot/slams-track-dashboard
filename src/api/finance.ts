import api from "./axios";

export type FinanceDashboardData = any;
export type FinanceAdmissionsData = any;

export async function getFinanceDashboard(): Promise<FinanceDashboardData> {
  const res = await api.get("/finance/dashboard/");
  return res.data.data ?? res.data;
}

export async function getFinanceAdmissions(
  page: number = 1,
  pageSize: number = 10,
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

export async function getAdmissionById(id: string | number): Promise<any> {
  try {
    const res = await api.get(`/finance/admissions/${id}/`);
    return res.data.data ?? res.data;
  } catch (err: any) {
    // If backend returns 404 for string admission codes, try searching by admission_id
    if (err?.response?.status === 404) {
      const listRes = await api.get("/finance/admissions/", {
        params: { admission_id: id },
      });

      const list =
        listRes.data.results?.data ?? listRes.data.data ?? listRes.data ?? [];

      if (Array.isArray(list) && list.length > 0) return list[0];
      return listRes.data;
    }
    throw err;
  }
}

export async function getFinanceCourseReports(
  page: number = 1,
  pageSize: number = 10,
  filters: Record<string, string | number | undefined> = {},
): Promise<any> {
  const params: Record<string, string | number> = {
    page,
    page_size: pageSize,
  };

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params[key] = value;
    }
  });

  const res = await api.get("/finance/reports/courses/", {
    params,
  });
  return {
    count: res.data.count,
    next: res.data.next,
    previous: res.data.previous,
    results: res.data.results?.data ?? res.data.results ?? res.data.data ?? [],
  };
}

export async function exportFinanceCourseReports(
  filters: Record<string, string | number | undefined> = {},
): Promise<Blob> {
  const params: Record<string, string | number> = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params[key] = value;
    }
  });

  const res = await api.get("/finance/reports/courses/", {
    params,
    responseType: "blob",
  });

  return res.data;
}

export async function exportFinanceStudentReports(
  filters: Record<string, string | number | undefined> = {},
): Promise<Blob> {
  const params: Record<string, string | number> = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params[key] = value;
    }
  });

  const res = await api.get("/finance/reports/students/", {
    params,
    responseType: "blob",
  });

  return res.data;
}

export async function exportFinanceTeacherReports(
  filters: Record<string, string | number | undefined> = {},
): Promise<Blob> {
  const params: Record<string, string | number> = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params[key] = value;
    }
  });

  const res = await api.get("/finance/reports/teachers/", {
    params,
    responseType: "blob",
  });

  return res.data;
}

export async function getFinanceStudentReports(
  page: number = 1,
  pageSize: number = 10,
  filters: Record<string, string | number | undefined> = {},
): Promise<any> {
  const params: Record<string, string | number> = {
    page,
    page_size: pageSize,
  };

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params[key] = value;
    }
  });

  const res = await api.get("/finance/reports/students/", {
    params,
  });
  return {
    count: res.data.count,
    next: res.data.next,
    previous: res.data.previous,
    results: res.data.results?.data ?? res.data.results ?? res.data.data ?? [],
  };
}

export async function getFinanceTeacherReports(
  page: number = 1,
  pageSize: number = 10,
  filters: Record<string, string | number | undefined> = {},
): Promise<any> {
  const params: Record<string, string | number> = {
    page,
    page_size: pageSize,
  };

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params[key] = value;
    }
  });

  const res = await api.get("/finance/reports/teachers/", {
    params,
  });
  return {
    count: res.data.count,
    next: res.data.next,
    previous: res.data.previous,
    results: res.data.results?.data ?? res.data.results ?? res.data.data ?? [],
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
  month?: number,
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

export const updateAdmission = async (
  admissionId: string | number,
  data: any,
) => {
  console.log(data);
  const payload = {
    financial_details: {
      admission_amount: Number(data.admission_amount),
      paid_amount: Number(data.paid_amount),
      pending_amount: Number(data.pending_amount ?? data.balance_amount ?? 0),
      course_fee: Number(data.course_fee ?? 0),
      discount_amount: Number(data.discount_amount ?? 0),
      balance_amount: Number(data.balance_amount),
    },
  };

  const response = await api.put(
    `/finance/admissions/${admissionId}/update/`,
    payload,
  );
  console.log(response);

  return response.data;
};

export default {
  getFinanceDashboard,
  getFinanceAdmissions,
  getFinanceCourseReports,
  getFinanceStudentReports,
  getFinanceTeacherReports,
  getFinanceRevenueReports,
  getAdmissionById,
};
