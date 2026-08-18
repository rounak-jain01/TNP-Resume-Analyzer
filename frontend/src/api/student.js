import api from "./axios";

export const analyzeResume = async (resumeFile, jdFile) => {
  const formData = new FormData();
  formData.append("resume_file", resumeFile);
  formData.append("jd_file", jdFile);

  const res = await api.post("/student/analyze", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};