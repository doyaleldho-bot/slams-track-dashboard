import api from "../api/axios";

const getCurrentSession = () => {
  return (
    localStorage.getItem("currentSession") ||
    localStorage.getItem("selectedSession") ||
    localStorage.getItem("academicSession") ||
    localStorage.getItem("session") ||
    undefined
  );
};

export const getClasses = async (session?: string) => {
  const sessionValue = session || getCurrentSession();
  const params: Record<string, string> = {};

  if (sessionValue) {
    params.session = sessionValue;
  }

  const res = await api.get("/list-classes-for-dropdowns/", {
    params,
  });

  return res.data.data.map((item: any) => ({
    id: item.id,
    class_id: item.class_id,
    class_name: item.class_name,
    class_section: item.class_section,
    class_batch: item.class_batch,
  }));
};

export const getSections = async (classId: string | number) => {
  const res = await api.get(
    `sections-drop/?class_id=${classId}`
  );

  return res.data.sections || [];
};