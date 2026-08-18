import api from "./axios";

export const uploadJD = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post("/faculty/jd/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const uploadBatch = async (jdId, batchName, files) => {
  const formData = new FormData();
  formData.append("jd_id", jdId);
  formData.append("batch_name", batchName);
  files.forEach((file) => formData.append("files", file));

  const res = await api.post("/faculty/batch/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const getBatches = async () => {
  const res = await api.get("/faculty/batches");
  return res.data;
};

export const getBatchResults = async (batchId) => {
  const res = await api.get(`/faculty/batch/${batchId}/results`);
  return res.data;
};

export const getBatchInsights = async (batchId) => {
  const res = await api.get(`/faculty/batch/${batchId}/insights`);
  return res.data;
};

export const addResumesToBatch = async (batchId, files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const res = await api.post(`/faculty/batch/${batchId}/add-resumes`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteBatch = async (batchId) => {
  const res = await api.delete(`/faculty/batch/${batchId}`);
  return res.data;
};