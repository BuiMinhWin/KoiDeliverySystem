import axios from "axios";

const REST_API_BASE_URL = "http://koideliverysystem.id.vn:8080/api/orders";
const REST_API_DOCUMENT_URL =
  "http://koideliverysystem.id.vn:8080/api/documents";
const REST_API_ORDER_DETAIL_URL =
  "http://koideliverysystem.id.vn:8080/api/ordersDetail";

const REST_API_BASE_URL2 = "http://koideliverysystem.id.vn:8080/api/accounts";

export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(`${REST_API_BASE_URL}/create`, orderData);
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error.response || error.message);
    throw error;
  }
};

export const createDocument = async (DocumentData) => {
  try {
    const response = await axios.post(
      `${REST_API_DOCUMENT_URL}/create`,
      DocumentData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error.response || error.message);
    throw error;
  }
};
export const createOrderDetail = async (orderDetailData) => {
  try {
    const response = await axios.post(
      `${REST_API_ORDER_DETAIL_URL}/create`,
      orderDetailData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error.response || error.message);
    throw error;
  }
};
export const order = async (orderId) => {
  try {
    const response = await axios.get(`${REST_API_BASE_URL}/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order data:", error);
    throw error;
  }
};
export const orderDetail = async (orderId) => {
  try {
    const response = await axios.get(`${REST_API_BASE_URL}/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order data:", error);
    throw error;
  }
};

export const getAccountById = async (accountId) => {
  try {
    const response = await axios.get(`${REST_API_BASE_URL2}/${accountId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching account:", error);
    throw error;
  }
};

export const updateAccount = async (accountId, accountData) => {
  try {
    const response = await axios.patch(
      `${REST_API_BASE_URL2}/${accountId}`,
      accountData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating account:", error);
    throw error;
  }
};


const REST_API_BASE_URL3 = "http://koideliverysystem.id.vn:8080/api/orders";

export const getOrder = (orderId) => {
  return axios.get(REST_API_BASE_URL3 + '/' + orderId);
}