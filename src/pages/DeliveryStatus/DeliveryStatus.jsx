import React, { useEffect, useState } from 'react';
import { getAllDeliveryStatusByOrderId } from '../../services/DeliveryStatusService';
import './DeliveryStatus.css';

const DeliveryStatus = ({ orderId }) => {
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    getAllDeliveryStatusByOrderId(orderId)
      .then((response) => {
        const sortedStatuses = response.data.sort((a,b) => a.status - b.status);
        setStatuses(sortedStatuses);
      })
      .catch((error) => {
        console.error("Error fetching delivery statuses: ", error);
      });
  }, [orderId]);

  const statusLabels = [
    "Đang chờ xét duyệt",
    "Đơn đã được duyệt",
    "Đã chọn tài xế",
    "Tài xế đã nhận đơn và đang vận chuyển",
    "Đang vận chuyển",
    "Đã nhận hàng"
  ];

  return (
    <div className="delivery-status-container">
      <h2>Tracking Details for Order ID: {orderId}</h2>
      <ul className="status-list">
        {statuses.map((status) => (
          <li key={status.deliveryStatusId} className="status-item">
            <p><strong>Time:</strong> {new Date(status.timeTracking).toLocaleString()}</p>
            <p><strong>Location:</strong> {status.currentLocate}</p>
            <p><strong>Status:</strong> {statusLabels[status.status]}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeliveryStatus;