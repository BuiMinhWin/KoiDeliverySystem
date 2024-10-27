import axios from 'axios';

const API_BASE_URL = '/api/deliveryStatus';

export const getAllDeliveryStatusByOrderId = (orderId) => {
  return axios.get(`${API_BASE_URL}/getAllDeliveryStatusByOrderId/${orderId}`);
};
export const trackingOrderState = (trackingData) => {
  console.log(trackingData);
  return axios.post(`${API_BASE_URL}/create`, trackingData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};