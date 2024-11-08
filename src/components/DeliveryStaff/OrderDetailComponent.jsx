import React, { useEffect, useState } from 'react';
import { getOrderDetail } from '../../services/DeliveryService';
import { useParams } from 'react-router-dom';

const OrderDetailComponent = () => {
  const { orderId } = useParams();
  
  const [orderDetail, setOrderDetail] = useState([]); 

  useEffect(() => {
    if (orderId) {
      getOrderDetail(orderId)
        .then(response => {
          console.log(response.data); 
          setOrderDetail(response.data); 
        })
        .catch(error => console.error('Error fetching order details:', error));
    } else {
      console.log("Order ID not found");
    }
  }, [orderId]); 

  return (
    <div className="order-detail">
      {orderDetail && orderDetail.length > 0 ? (
        <div>
          <h2>Chi tiết đơn hàng: {orderId}</h2>
          {orderDetail.map((order) => (
            <div key={order.orderDetailId} className="order-detail-item">
              <p>Ngày tạo: {order.createdAt}</p>
              <p>Tên cá: {order.koiName}</p>
              <p>Loại cá: {order.koiType}</p>
              <p>Số lượng: {order.quantity}</p>
              <p>Cân nặng: {order.weight}</p>
              <p>Trạng thái: {order.status}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Loading order details...</p>
      )}
    </div>
  );
};

export default OrderDetailComponent;
