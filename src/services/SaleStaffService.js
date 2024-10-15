import axios from "axios";

const REST_API_BASE_URL = "http://koideliverysystem.id.vn:8080/api/orders";
const REST_API_BASE_URL2 = "http://koideliverysystem.id.vn:8080/api/ordersDetail/order";
export const getOrder = (orderId) => {
  return axios.get(REST_API_BASE_URL + '/' + orderId);
}

export const listOrder = () => {
  return axios.get(REST_API_BASE_URL);
};

export const trackingOrder = (orderId) => {
  return axios.post(`${REST_API_BASE_URL}/update`, orderId);
} 

export const getOrderDetail = (orderId)=>{
  return axios.get(REST_API_BASE_URL2+ '/' + orderId)
}

export const updateStatus = (orderId, newStatus) => {
  return axios.patch(`${REST_API_BASE_URL}/updateStatus/${orderId}`, { newStatus });
};


const BASE_URL = 'http://api.koi.vn/reports'; // Đường dẫn API của báo cáo

// Lấy dữ liệu báo cáo tổng quát
export const getSalesReport = () => {
  return axios.get(`${BASE_URL}/sales`);
};

// Lấy dữ liệu báo cáo theo khoảng thời gian
export const getSalesReportByDateRange = (startDate, endDate) => {
  return axios.get(`${BASE_URL}/sales`, {
    params: { startDate, endDate }
  });
};


const BASE_URL_1 = 'http://api.koi.vn/feedback'; // Đường dẫn API của phản hồi

// Lấy tất cả các phản hồi
export const getFeedbacks = () => {
  return axios.get(`${BASE_URL_1}`);
};

// Lấy chi tiết của một phản hồi cụ thể
export const getFeedbackDetails = (feedbackId) => {
  return axios.get(`${BASE_URL_1}/${feedbackId}`);
};

// Trả lời phản hồi
export const replyFeedback = (feedbackId, content) => {
  return axios.post(`${BASE_URL_1}/${feedbackId}/reply`, { content });
};