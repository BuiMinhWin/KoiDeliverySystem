import React, { useEffect, useState } from 'react';
import { listOrder, updateStatus, getOrderDetail } from '../../services/SaleStaffService';
import AssignDriverComponent from './AssignDriverComponent';
import { FaLongArrowAltLeft } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const Booking = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const navigate = useNavigate();
  const accountId = localStorage.getItem("accountId"); //lấy accountId của sale

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
          const filteredOrders = response.data.filter(order => order.sale === accountId); // loggedInSaleId là accountId của nhân viên sale đang đăng nhập
          setOrders(filteredOrders);
          console.log(response.data);
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
      <button
        type="button"
        onClick={() => navigate('/delivery')}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          position: 'absolute',
          top: '10px',
          left: '120px',
          padding: '5px',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <FaLongArrowAltLeft size={16} color="black" />
        <span style={{ marginLeft: '15px' }}>Back</span>
      </button>

      <h2 className="text-center">List of Confirm Drivers</h2>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>OrderId</th>
            <th>Destination</th>
            <th>Freight</th>
            <th>OrderDate</th>
            <th>ShipDate</th>
            <th>TotalPrice</th>
            <th>Origin</th>
            <th>Delivery</th>
            <th>Status</th>
            <th>Assign Driver</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map(order => (
              <tr key={order.orderId}>
                <td>{order.orderId}</td>
                <td>{order.destination}</td>
                <td>{order.freight}</td>
                <td>{order.orderDate}</td>
                <td>{order.shippedDate}</td>
                <td>{order.totalPrice}</td>
                <td>{order.origin}</td>
                <td>{order.deliver}</td> 
                <td>{statusLabels[order.status]}</td>
                <td>
                  {order.status === 1 ? (
                    <button
                      className="btn btn-info"
                      onClick={() => openAssignDriverModal(order.orderId)}
                    >
                      Assign Driver
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
                    View
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
