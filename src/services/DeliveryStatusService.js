import axios from 'axios';

const API_BASE_URL = '/api/deliveryStatus';

export const getAllDeliveryStatusByOrderId = (orderId) => {
  return axios.get(`${API_BASE_URL}/getAllDeliveryStatusByOrderId/${orderId}`);
};
export const trackingOrder = ({  orderId, timeTracking, currentLocate, status }) => {
  const data = {
    
    orderId,
    timeTracking,
    currentLocate,
    status,
  };

  return axios.post(`${API_BASE_URL}/create`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};