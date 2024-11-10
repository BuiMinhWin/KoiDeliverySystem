import axios from "axios";

const REST_API_ORDER_URL = "/api/orders";
const REST_API_ORDER_DETAIL_URL = "/api/ordersDetail";
const REST_API_DOCUMENT_URL = "/api/documents";
const REST_API_ACCOUNT_URL = "/api/accounts";
const REST_API_SERVICE_URL = "/api/services";
const REST_API_DELI_URL = "/api/deliveryStatus";



export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(`${REST_API_ORDER_URL}/create`, orderData);
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error.message); // Log only the message
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    } else if (error.request) {
      console.error("Request data:", error.request);
    }
    throw error;
  }
};


export const uploadDocument = (orderDetailId, formData) => {
  return axios.post(
    `/api/documents/${orderDetailId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
};
export const updateDocument = async (orderDetailId, formData) => {
  const response = await fetch(
    `/api/documents/update/${orderDetailId}`,
    {
      method: "PUT",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to reupload document: ${errorText}`);
  }

  try {
    return await response.json();
  } catch (error) {
    console.warn("Response is not in JSON format. Returning raw response.");
    return response;
  }
};

export const updateOrderDetailStatus = async (orderDetailId, newStatus) => {
  const response = await fetch(
    `${REST_API_ORDER_DETAIL_URL}/update/${orderDetailId}`,
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

export const updateOrderStatus = async (orderId, newStatus) => {
  const response = await fetch(
    `${REST_API_ORDER_URL}/updateStatus/${orderId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newStatus: newStatus }),
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

export const createOrderDetail = async (orderDetailData) => {
  try {
    const response = await axios.post(
      `${REST_API_ORDER_DETAIL_URL}/create`,
      orderDetailData
    );
    console.log("Order detail created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error.response || error.message);
    throw error;
  }
};

export const order = async (orderId) => {
  try {
    const response = await axios.get(`${REST_API_ORDER_URL}/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order data:", error);
    throw error;
  }
};

export const orderDetail = async (orderId) => {
  try {
    const response = await axios.get(
      `${REST_API_ORDER_DETAIL_URL}/order/${orderId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching order data:", error);
    throw error;
  }
};

export const getOrder = (orderId) => {
  return axios.get(REST_API_ORDER_URL + "/" + orderId);
};

export const cancelOrder = async (orderId) => {
  const response = await fetch(`${REST_API_ORDER_URL}/${orderId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to cancel order");
  }

  // Only try to parse JSON if there is content
  const data = response.status !== 204 ? await response.json() : {};
  return data;
};

// export const getOrderPDF = async (orderId) => {
//   const response = await fetch(`${REST_API_DOCUMENT_URL}/download/order/${orderId}`);
//   if (!response.ok) {
//     throw new Error("Failed to fetch PDF");
//   }
//   return response.blob();
// };

export const getOrderPDF = async (orderDetailId) => {
  try {
    const response = await fetch(`${REST_API_DOCUMENT_URL}/download/order/${orderDetailId}`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch PDF");
    }
    
    return await response.blob(); // Return blob for use as PDF in the UI
  } catch (error) {
    console.error("Error fetching PDF:", error);
    throw error; // Re-throw error for handling in the calling function
  }
};


export const getAccountById = async (accountId) => {
  try {
    const response = await axios.get(`${REST_API_ACCOUNT_URL}/${accountId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching account:", error);
    throw error;
  }
};

export const updateAccount = async (accountId, accountData) => {
  const response = await fetch(`${REST_API_ACCOUNT_URL}/update/${accountId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(accountData),
  });

  if (!response.ok) {
    throw new Error("Failed to update account.");
  }

  return response.json();
};


export const getAvatar = async (accountId) => {
  const response = await fetch(`${REST_API_ACCOUNT_URL}/${accountId}/avatar`);
  if (!response.ok) throw new Error("Failed to fetch account Avatar");
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

export const updateAvatar = async (accountId, avatarFile) => {
  const formData = new FormData();
  formData.append("avatar", avatarFile);

  const response = await fetch(`${REST_API_ACCOUNT_URL}/${accountId}/avatar`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text(); // Read text response for debugging
    throw new Error(`Failed to update avatar: ${errorText}`);
  }

  try {
    return await response.json(); // Attempt to parse JSON if available
  } catch (error) {
    console.warn("Response is not in JSON format. Returning raw response.");
    return response; // Return raw response if not JSON
  }
};
export const updateServiceStatus = async (
  orderDetailId,
  serviceId,
  serviceStatus
) => {
  try {
    console.log("Sending request with:", {
      orderDetailId,
      serviceId,
      serviceStatus,
    });

    const response = await axios.patch(
      `${REST_API_SERVICE_URL}/updateService/${orderDetailId}/service/${serviceId}`,
      null,
      {
        params: { newStatus: serviceStatus },
      }
    );

    console.log("Response status:", response.status);
    console.log("Response data:", response.data);

    if (response.status !== 200) {
      throw new Error(`Unexpected response status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error("Error updating service: status", error);
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
    } else if (error.request) {
      console.error("Error request:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
    throw new Error("Failed to update service status.");
  }
};

export const updatePaymentStatus = async (orderId) => {
  try {
    console.log(`Sending PATCH request for order ID: ${orderId}`); // Debug log
    console.log("Sending PATCH request with body:", JSON.stringify({ paymentStatus: 1 }));

    const response = await fetch(`${REST_API_ORDER_URL}/update/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentStatus: 1 }),
    });

    if (!response.ok) {
      console.error("PATCH request failed:", response.status, response.statusText);
      const errorData = await response.json();
      console.error("Error response data:", errorData);
      throw new Error("Failed to update payment status.");
    }

    const data = await response.json();
    console.log("Payment status successfully updated:", data);
    return data;
  } catch (error) {
    console.error("An error occurred in updatePaymentStatus:", error);
    throw error;
  }
};

export const getDeliveryStatusByOrderId = async (orderId) => {
  try {
    const response = await axios.get(
      `${REST_API_DELI_URL}/getAllDeliveryStatusByOrderId/${orderId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching delivery status:", error);
    throw error;
  }
};

export const fetchServices = async () => {
  try {
    const response = await fetch(`${REST_API_SERVICE_URL}`); 
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const servicesData = await response.json();
    console.log("Fetched Services Data:", servicesData);
    return servicesData;
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
};

