import axios from "axios";

const REST_API_BASE_URL = "/api/orders";
const REST_API_BASE_URL2 = "/api/ordersDetail/order";
const REST_API_BASE_URL3 = "/api/documents/download/order/{orderId}";
const REST_API_BASE_URL4 = "/api/accounts";
const REST_API_BASE_URL6 = "/api/ordersDetail";


export const getOrder = (orderId) => {
  return axios.get(REST_API_BASE_URL + '/' + orderId);
}

export const listOrder = () => {
  return axios.get(REST_API_BASE_URL);
};

export const trackingOrder = (orderId) => {
  return axios.post(`${REST_API_BASE_URL}/update`, orderId);
} 

export const getOrderDetail =(orderId) => {
  return axios.get(`${REST_API_BASE_URL2}/${orderId}`);
};

export const updateSale = (orderId, sale) => {
  return axios.patch(`${REST_API_BASE_URL}/update/${orderId}`, { sale });
};

export const assignDriver = (orderId, deliver) => {
  return axios.patch(`${REST_API_BASE_URL}/update/${orderId}`, { deliver });
};

export const getDocument = (orderId) => {
  return axios.get(`${REST_API_BASE_URL3}/${orderId}`);
}

export const getDrivers = () => {
  return axios.get(`${REST_API_BASE_URL}/deliverers`);
};

export const listAccount = () => {
  return axios.get(REST_API_BASE_URL4);
};

export const replyOrder = (orderId) => {
  return axios.patch(`${REST_API_BASE_URL}/cancel/${orderId}`);
}

export const updateOrderDetailStatus = async (orderDetailId, newStatus) => {
  const response = await fetch(
    `${REST_API_BASE_URL6}/update/${orderDetailId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update order status: ${errorText}`);
  }

  try {
    return await response.json();
  } catch (error) {
    console.warn("Response is not in JSON format. Returning raw response.");
    return response;
  }
};

export const updateStatus = (orderId, newStatus) => {
  return axios.patch(`${REST_API_BASE_URL}/updateStatus/${orderId}`, { newStatus });
};




