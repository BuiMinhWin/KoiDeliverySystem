import axios from 'axios';

const API_BASE_URL = "http://koideliverysystem.id.vn:8080/api/feedbacks";

// Gửi feedback của người dùng
export const createFeedback = (orderId, content) => {
  return axios.post(`${API_BASE_URL}/create`, { orderId, content });
};

// Sale staff trả lời feedback
export const respondToFeedback = (feedbackId, content) => {
  return axios.post(`${API_BASE_URL}/respond/${feedbackId}`, { content });
};

// Lấy tất cả feedback theo orderId
export const getAllFeedbackByOrderId = (orderId) => {
  return axios.get(`${API_BASE_URL}/getAllFeedbackById/${orderId}`);
};
