import axios from "axios";


const REST_API_BASE_URL = "/api/accounts";
const REST_API_BASE_URL2 = "/api/Google/loginGG";
const REST_API_PASSWORD_URL = "/api/auth";

export const listAccount = () => {
  return axios.get(REST_API_BASE_URL);
};

export const createAccount = (account) => {
  return axios.post(REST_API_BASE_URL + '/register', account);
};

export const getAccount = (accountId) => {
  return axios.get(REST_API_BASE_URL + '/' + accountId);
};

export const updateAccount = (accountId, account) => {
  return axios.put(REST_API_BASE_URL + '/' + accountId, account);
};

export const deleteAccount = (accountId) => {

  return axios.patch(`${REST_API_BASE_URL}/deActive/${accountId}`, { isDeleted: true });
};

export const loginAccount = (loginData) => {
  return axios.post(REST_API_BASE_URL + '/login', loginData, {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
  });
};

export const googleLogin = (account) => {
  console.log('URL:', REST_API_BASE_URL2);
  console.log('Account data:', account);

  return axios.post(REST_API_BASE_URL2, account, {
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then((response) => response)
  .catch((error) => {
    console.error('Google login error:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      // Trả về lỗi có cấu trúc để có thể xử lý trong component
      return Promise.reject(error.response);
    }
    return Promise.reject(error);
  });
};

export const forgotPassword = (email) => {
  return axios.post(REST_API_PASSWORD_URL + `/forgot?email=${email}`);
};

export const verifyPassword = (email, code, newPassword, confirmPassword) => {
  return axios.post(REST_API_PASSWORD_URL + `/verify?email=${email}&code=${code}&newPassword=${newPassword}&confirmPassword=${confirmPassword}`);
};
