import React, { useEffect, useState } from 'react';
import { listOrder, updateStatus, updateSale } from '../../services/SaleStaffService';
import { useNavigate } from 'react-router-dom';
import { colors } from '@mui/material';
import './SaleStaff.css'; 


const ListOrderComponent = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const accountId = localStorage.getItem("accountId");

  const formatCurrency = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  useEffect(() => {
    getAllOrders();
  }, []);

  const getAllOrders = () => {
    listOrder()
      .then((response) => {
        if (Array.isArray(response.data)) {
          // First, sort by the `freight` type to put "express" orders at the top, then by order date in descending order.
          const sortedOrders = response.data.sort((a, b) => {
            if (a.freight === "Dịch vụ hỏa tốc" && b.freight !== "Dịch vụ hỏa tốc") return -1;
            if (a.freight !== "Dịch vụ hỏa tốc" && b.freight === "Dịch vụ hỏa tốc") return 1;
            return new Date(b.orderDate) - new Date(a.orderDate);
          });
          setOrders(sortedOrders);
        } else {
          console.error("API response is not an array", response.data);
          setOrders([]);
        }
      })
      .catch((error) => console.error("Error fetching orders: ", error));
  };

  const handleUpdateStatus = (orderId, currentStatus) => {
    if (currentStatus === 0) {
      const newStatus = 1;
      updateStatus(orderId, newStatus)
        .then(() => updateSale(orderId, accountId)) 
        .then(getAllOrders) // Refresh list
        .catch((error) => console.error("Error updating order: ", error));
    }
  };

  const handleViewOrder = (orderId) => navigate(`/confirmDetail/${orderId}`);

  return (
    <div className="container">
     

      <h2 className="text-center">Duyệt Đơn Vận Chuyển</h2>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>OrderId</th>
            <th>Điểm đi</th>
            <th>Điểm đến</th>
            <th>Phương tiện</th>
            <th>Ngày đặt hàng</th>
            <th>Ngày nhận hàng</th>
            <th>Tổng giá tiền</th>
            <th>Sale</th>
            <th>Trạng thái</th>
            <th>Cập nhật trạng thái</th>
            <th>Chi tiết đơn hàng</th>
          </tr>
        </thead>
        <tbody>
  {orders.length > 0 ? (
    orders.map(order => (
      <tr key={order.orderId}>
        <td>{order.orderId}</td>
        <td>{order.origin}</td>
        <td>{order.destination}</td>
        <td style={{ color: order.freight === "Dịch vụ hỏa tốc" ? "red" : "green" }}>
          {order.freight}
        </td>
        <td>{new Date(order.orderDate).toLocaleDateString()}</td>
        <td>{new Date (order.shippedDate).toLocaleDateString()}</td>
        <td>{formatCurrency(order.totalPrice)}</td>
        <td>{order.sale}</td>
        <td style={{ color: order.status === 0 ? 'red' : 'green' }}>
          {order.status === 0 ? "Đang chờ xét duyệt" : "Đơn đã được duyệt"}
        </td>
        <td>
          {order.status === 0 ? (
            <button
              className="btn btn-success"
              onClick={() => handleUpdateStatus(order.orderId, order.status)}
            >
              Cập nhật
            </button>
          ) : (
            <button className="btn btn-secondary" disabled>
              Đã duyệt
            </button>
          )}
        </td>
        <td>
          <button
            className="btn btn-primary"
            onClick={() => handleViewOrder(order.orderId)}
          >
            Chi tiết
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="10" className="text-center">No Orders Found</td>
    </tr>
  )}
</tbody>

      </table>
    </div>
  );
};

export default ListOrderComponent;