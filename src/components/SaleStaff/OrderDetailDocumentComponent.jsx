import React, { useEffect, useState } from 'react'; 
import { listOrder, updateStatus } from '../../services/SaleStaffService';
import { getOrderDetail } from '../../services/DeliveryService';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const OrderDetailDocumentComponent = () => {
  const { orderId } = useParams();
  const [orders, setOrders] = useState([]);
  const [orderDetail, setOrderDetail] = useState([]); // Dùng để lưu danh sách orderDetail
  const [editedStatuses, setEditedStatuses] = useState({});

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
  }, [orderId]);

  const navigate = useNavigate();
  useEffect(() => {
    getAllOrders();
  }, []);
  
  const getAllOrders = () => {
    listOrder()
      .then((response) => {
        if (Array.isArray(response.data)) {
          setOrders(response.data);
        } else {
          console.error("API response is not an array", response.data);
          setOrders([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching orders: ", error);
      });
  };
  
  const handleStatusChange = (orderId, newStatus) => {
    const updatedStatuses = {
      ...editedStatuses,  
      [orderId]: newStatus,  
    };
    setEditedStatuses(updatedStatuses); 
  };

  const updateOrderStatus = (orderId) => {
    const newStatus = editedStatuses[orderId] ?? orders.status;
    if (newStatus) {
      console.log('New status to update:', newStatus);
      updateStatus(orderId, newStatus)  
        .then((response) => {
          console.log('Status updated successfully:', response);
          getAllOrders();  
        })
        .catch((error) => {
          console.error('Error updating status:', error);
        });
    }
  };

  // Lọc danh sách orders để chỉ lấy đơn hàng với orderId hiện tại
  const currentOrder = orders.filter(order => order.orderId === orderId);

  return (
    <div className="order-detail">
      <h2>Order Details for Order ID: {orderId}</h2>
      
      {orderDetail.length > 0 ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>CreatedAt</th>
              <th>KoiName</th>
              <th>KoiType</th>
              <th>Quantity</th>
              <th>Weight</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orderDetail.map((order) => (
              <tr key={order.orderDetailId}>
                <td>{order.createdAt || "N/A"}</td>
                <td>{order.koiName || "N/A"}</td>
                <td>{order.koiType || "N/A"}</td>
                <td>{order.quantity || "N/A"}</td>
                <td>{order.weight || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="order-detail-item">
          <p>CreatedAt: N/A</p>
          <p>KoiName: N/A</p>
          <p>KoiType: N/A</p>
          <p>Quantity: N/A</p>
          <p>Weight: N/A</p>
          <p>Status: N/A</p>
        </div>
      )}

      {/* Hiển thị chỉ đơn hàng có orderId khớp với orderId hiện tại */}
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentOrder.length > 0 ? (
            currentOrder.map(order => (
              <tr key={order.orderId}>
                <td>{order.orderId}</td>
                <td>{order.status}</td>
                <td>
                  <input
                    type="text"
                    value={editedStatuses[order.orderId] ?? order.status}
                    onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                  />
                </td>
                <td>
                  <button
                    className="btn btn-info"
                    onClick={() => updateOrderStatus(order.orderId)}
                  >
                    Update Status
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">No Orders Found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderDetailDocumentComponent;
