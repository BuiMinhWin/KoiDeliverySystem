import React, { useEffect, useState } from 'react';
import { listOrder } from '../../services/DeliveryService';
import { FaLongArrowAltLeft } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';


const ListOrderOfSales = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const accountId = localStorage.getItem("accountId");

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
          setOrders(filteredOrders);
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

  const handleViewFeedback = (orderId) => {
    navigate(`/salestaff/respondFeedback/${orderId}`);
  };

  return (
    <div className="container">
      

      <h2 className="text-center">List of Orders</h2>
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
            <th>Sale</th>
            <th>Delivery</th>
            <th>Status</th>
            <th>View</th>
            <th>Feedback</th> {/* Thêm cột Feedback */}
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
                <td>{order.sale}</td>
                <td>{order.deliver}</td>
                <td>{statusLabels[order.status]}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleViewOrder(order.orderId)}
                  >
                    View
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleViewFeedback(order.orderId)}
                  >
                    View Feedback
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11" className="text-center">No Orders Found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListOrderOfSales;
