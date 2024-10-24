import axios from "axios";

const REST_API_BASE_URL = "http://koideliverysystem.id.vn:8080/api/accounts";
const REST_API_BASE_URL2 = "http://koideliverysystem.id.vn:8080/api/Google/loginGG";
const REST_API_PASSWORD_URL = "http://koideliverysystem.id.vn:8080/api/auth";

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
  return axios.delete(REST_API_BASE_URL + '/' + accountId);
};


export const loginAccount = (loginData) => {
  return axios.post(REST_API_BASE_URL + '/login', loginData, {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
  });
};


export const googleLogin = (account) => {
  return axios.post(REST_API_BASE_URL2,account);
   
};

export const forgotPassword = (email) => {
  return axios.post(REST_API_PASSWORD_URL + `/forgot?email=${email}`);
};

export const verifyPassword = (email,code,newPassword,confirmPassword) => {
  return axios.post(REST_API_PASSWORD_URL +`/verify?email=${email}&code=${code}&newPassword=${newPassword}&confirmPassword=${confirmPassword}`);
};


