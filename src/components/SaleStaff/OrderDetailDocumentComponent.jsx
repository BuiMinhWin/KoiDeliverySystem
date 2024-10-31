import React, { useEffect, useState } from 'react';
import { listOrder, updateStatus } from '../../services/SaleStaffService';
import { getOrderDetail } from '../../services/DeliveryService';
import { getOrderPDF } from '../../services/CustomerService';
import { useParams } from 'react-router-dom';

const OrderDetailDocumentComponent = () => {
  const { orderId } = useParams();
  const [orders, setOrders] = useState([]);
  const [orderDetail, setOrderDetail] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);

  // Lấy thông tin chi tiết đơn hàng
  useEffect(() => {
    if (orderId) {
      getOrderDetail(orderId)
        .then(response => {
          console.log(response.data);
          setOrderDetail(response.data);
        })
        .catch(error => console.error('Error fetching order details:', error));
    }
  }, [orderId]);

  // Lấy danh sách các đơn hàng
  useEffect(() => {
    listOrder()
      .then(response => {
        if (Array.isArray(response.data)) {
          setOrders(response.data);
        } else {
          console.error("API response is not an array", response.data);
          setOrders([]);
        }
      })
      .catch(error => {
        console.error("Error fetching orders: ", error);
      });
  }, []);

  // Lấy PDF và tạo URL để hiển thị
  const handleViewPDF = async (orderId) => {
    try {
      const response = await getOrderPDF(orderId);
      const blob = new Blob([response], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error('Error loading PDF:', error);
    }
  };

  // Cập nhật trạng thái đơn hàng
  const handleUpdateStatus = (orderId, currentStatus) => {
    if (currentStatus === 0) {
      const newStatus = 1;
      updateStatus(orderId, newStatus)
        .then(() => {
          // Refresh orders list after update
          listOrder().then((response) => setOrders(response.data));
        })
        .catch(error => console.error("Error updating order status: ", error));
    }
  };

  // Tìm đơn hàng hiện tại theo orderId
  const currentOrder = orders.filter(order => order.orderId === orderId);

  return (
    <div className="order-detail">
      <h2>Order Details for Order ID: {orderId}</h2>
      
      {orderDetail.length > 0 ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Ngày tạo</th>
              <th>Tên cá</th>
              <th>Loại cá</th>
              <th>Số lượng</th>
              <th>Cân nặng</th>
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

      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Trạng thái</th>
            <th>Hiện tại</th>
            <th>Xem PDF</th>
          </tr>
        </thead>
        <tbody>
          {currentOrder.length > 0 ? (
            currentOrder.map(order => (
              <tr key={order.orderId}>
                <td style={{color : order.status === 0 ? 'red' : 'green'}}>
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
                    <span>{order.sale || "N/A"}</span>
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleViewPDF(order.orderId)}
                  >
                    Hiển thị PDF
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

      {/* Hiển thị PDF trong iframe */}
      {pdfUrl && (
        <div className="pdf-viewer">
          <h3>Xem Tài liệu</h3>
          <iframe
            src={pdfUrl}
            width="50%"
            height="500px"
            style={{ border: "1px solid #ccc", borderRadius: "4px" }}
            title="PDF Viewer"
          />
        </div>
      )}
    </div>
  );
};

export default OrderDetailDocumentComponent;
