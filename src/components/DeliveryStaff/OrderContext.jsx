import React, { createContext, useState, useContext } from 'react';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orderDetail, setOrderDetail] = useState(null);

  return (
    <OrderContext.Provider value={{ orderDetail, setOrderDetail }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
