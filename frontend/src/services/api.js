import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

export const uploadDataset = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(`${API_URL}/jobs/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const getJobStatus = (jobId) =>
  api.get(`/jobs/${jobId}`);

export const getJobResults = (jobId) =>
  api.get(`/jobs/${jobId}/results`);

export const askChatbot = (question, jobId) =>
  api.post('/chatbot/ask', { question, jobId });

export const getChatHistory = (userId) =>
  api.get(`/chatbot/history/${userId}`);

export const singlePredict = (data) =>
  api.post('/predict', data);
