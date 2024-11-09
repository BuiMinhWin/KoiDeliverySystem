import React, { useEffect, useState } from 'react';
import { listOrder, updateStatus, getOrderDetail } from '../../services/SaleStaffService';
import AssignDriverComponent from './AssignDriverComponent';
import { FaLongArrowAltLeft } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import './SaleStaff.css'; 

const Booking = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const navigate = useNavigate();
  const accountId = localStorage.getItem("accountId"); //lấy accountId của sale

  const formatCurrency = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const statusLabels = [
    "Đang chờ xét duyệt",
    "Đơn đã được duyệt",
    "Đã chọn tài xế",
    "Tài xế đã nhận đơn và đang vận chuyển",
    "Đã vận chuyển",
    "Đã nhận hàng"
  ];

  useEffect(() => {
    getAllOrders();
  }, []);

  const getAllOrders = () => {
    listOrder()
      .then((response) => {
        if (Array.isArray(response.data)) {
          const filteredOrders = response.data.filter(order => order.sale === accountId);
          const sortedOrders = filteredOrders.sort((a, b) => {
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
      .catch((error) => {
        console.error("Error fetching orders: ", error);
      });
  };

  const handleViewOrder = (orderId) => {
    navigate(`/confirmDetail/${orderId}`);
  };

  const openAssignDriverModal = (orderId) => {
    setSelectedOrderId(orderId);
  };

  const closeAssignDriverModal = () => {
    setSelectedOrderId(null);
  };

  const handleDriverAssigned = () => {
    getAllOrders();
    closeAssignDriverModal();
  };

  return (
    <div className="container">
      <h2 className="text-center">Chọn Tài Xế</h2>
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
            <th>Tài xế</th>
            <th>Trạng thái</th>
            <th>Chọn tài xế</th>
            <th>Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map(order => (
              <tr key={order.orderId} >
                <td>{order.orderId}</td>
                <td>{order.origin}</td>
                <td>{order.destination}</td>
                <td style={{ color: order.freight === "Dịch vụ hỏa tốc" ? "red" : "green"}}>
                  {order.freight}</td>
                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                <td>{new Date(order.shippedDate).toLocaleDateString()}</td>
                <td>{formatCurrency(order.totalPrice)}</td>
                <td>{order.deliver}</td>
                <td>{statusLabels[order.status]}</td>
                <td>
                  {order.status === 1 ? (
                    <button
                      className="btn btn-info"
                      onClick={() => openAssignDriverModal(order.orderId)}
                    >
                      Chọn tài
                    </button>
                  ) : (
                    <span>N/A</span>
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

      {/* Render the AssignDriverComponent if a driver is being assigned */}
      {selectedOrderId && (
        <AssignDriverComponent 
          orderId={selectedOrderId} 
          onClose={closeAssignDriverModal} 
          onAssigned={handleDriverAssigned} 
        />
      )}
    </div>
  );
};

export default Booking;
