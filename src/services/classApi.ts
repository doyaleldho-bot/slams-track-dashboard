import api from "../api/axios";


export const getClasses = async () => {
  const res = await api.get("/list-classes-for-dropdowns/");

  return res.data.data.map((item: any) => ({
    id: item.id,
    class_name: item.class_name,
  }));
};

export const getSections = async (classId: string | number) => {
  const res = await api.get(
    `sections-drop/?class_id=${classId}`
  );

  return res.data.sections || [];
};