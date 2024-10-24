import React, { useEffect, useState } from 'react';
import { getOrderDetail } from '../../services/DeliveryService';
import { useParams } from 'react-router-dom';

const OrderDetailComponent = () => {
  const { orderId } = useParams();
  //const {orderId,setOrderId } = useState([]); chuỗi rỗng 
  const [orderDetail, setOrderDetail] = useState([]); // Dùng để lưu danh sách orderDetail

  useEffect(() => {
    if (orderId) {
      getOrderDetail(orderId) // Gọi API với orderId
        .then(response => {
          console.log(response.data); // In kết quả trả về để kiểm tra
          setOrderDetail(response.data); // Lưu lại danh sách chi tiết đơn hàng
        })
        .catch(error => console.error('Error fetching order details:', error));
    } else {
      console.log("Order ID not found");
    }
  }, [orderId]); // Gọi lại khi orderId thay đổi

  return (
    <div className="order-detail">
      {orderDetail && orderDetail.length > 0 ? (
        <div>
          <h2>Order Details for Order ID: {orderId}</h2>
          {orderDetail.map((order) => (
            <div key={order.orderDetailId} className="order-detail-item">
              <p>CreatedAt: {order.createdAt}</p>
              <p>KoiName: {order.koiName}</p>
              <p>KoiType: {order.koiType}</p>
              <p>Quantity: {order.quantity}</p>
              <p>Weight: {order.weight}</p>
              <p>Status: {order.status}</p>
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
