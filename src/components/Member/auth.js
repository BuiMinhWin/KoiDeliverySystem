
export const logout = () => {
  localStorage.removeItem("roleId");
  localStorage.removeItem("accountId");
};