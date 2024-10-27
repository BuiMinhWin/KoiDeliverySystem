import React, { useEffect, useState } from 'react';
import { listAccount, assignDriver, updateStatus } from '../../services/SaleStaffService';
import './AssignDriverComponent.css';

const AssignDriverComponent = ({ orderId, onClose, onAssigned }) => {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriverId, setSelectedDriverId] = useState('');

  useEffect(() => {
    listAccount()
      .then((response) => {
        const filteredDrivers = response.data.filter((account) => account.roleId === 'Delivery');
        setDrivers(filteredDrivers);
      })
      .catch((error) => {
        console.error("Error fetching accounts: ", error);
      });
      
  }, []);

  const handleAssign = () => {
    if (selectedDriverId) {
      updateStatus(orderId, 2)
        .then(() => assignDriver(orderId, selectedDriverId)) // Đảm bảo API `assignDriver` hoàn thành trước khi cập nhật status
        .then(() => {
          onAssigned(); 
          onClose(); 
        })
        .catch((error) => console.error("Error: ", error));
    }
  };


  return (
    <div className="assign-driver-modal">
      <h3>Chọn tài xế cho đơn hàng</h3>
      <select 
        value={selectedDriverId} 
        onChange={(e) => setSelectedDriverId(e.target.value)}
        className="form-select"
      >
        <option value="">Chọn tài xế</option>
        {drivers.map((driver) => (
          <option key={driver.accountId} value={driver.accountId}>
            {driver.lastName} {driver.firstName} - {driver.phone}
          </option>
        ))}
      </select>
      <button onClick={handleAssign} className="btn btn-primary mt-3">Cập nhật</button>
      <button onClick={onClose} className="btn btn-secondary mt-3">Đóng</button>
    </div>
  );
};

export default AssignDriverComponent;
