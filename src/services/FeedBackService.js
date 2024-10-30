import axios from 'axios';

const API_BASE_URL = "/api/feedbacks";


export const createFeedback = async (feedbackData) => {
  const response = await axios.post(`${API_BASE_URL}/create`, feedbackData);
  return response.data;
};

// Lấy tất cả feedback theo orderId
export const getFeedbackByOrderId = async (orderId) => {
  const response = await axios.get(`${API_BASE_URL}/getAllFeedbackByOrderId/${orderId}`);
  return response.data; 
};


// Sale staff trả lời feedback
export const respondToFeedback = (feedbackId, comment, accountId) => {
  return axios.post(`${API_BASE_URL}/respond/${feedbackId}`, {
    feedbackId,
    comment,
    createdAt: new Date().toISOString(),
    accountId,
  });
};
