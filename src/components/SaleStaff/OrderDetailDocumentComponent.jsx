import React, { useEffect, useState } from 'react';
import { getOrder, getOrderDetail, replyOrder, updateOrderDetailStatus, updateStatus, updateSale } from '../../services/SaleStaffService';
import { getOrderPDF } from '../../services/CustomerService';
import { useParams } from 'react-router-dom';
import './OrderDetailDocumentComponent.css';

const OrderDetailDocumentComponent = () => {
  const { orderId } = useParams();
  const [orders, setOrders] = useState([]);
  const [orderDetail, setOrderDetail] = useState([]);
  const [pdfUrls, setPdfUrls] = useState({});
  const accountId = localStorage.getItem("accountId");

  useEffect(() => {
    if (orderId) {
      console.log(orderId)
      getOrderDetail(orderId)
        .then(response => {
          setOrderDetail(response.data);
          console.log("data order detail:",response.data)
        })
        .catch(error => console.error('Error fetching order details:', error));
    }
  }, [orderId]);

  useEffect(() => {
    getOrder(orderId)
      .then(response => {
          setOrders(response.data);     
      })
      .catch(error => {
        console.error("Error fetching orders: ", error);
      });
  }, []);

  const handleCancelOrder = (orderId) => {
    replyOrder(orderId)
      .then(() => {
        console.log(orderId.status);
      })
      .catch((error) => console.error("Error updating order: ", error));
  };

  const handleViewPDF = async (orderDetailId) => {
    if (pdfUrls[orderDetailId]) {
      setPdfUrls(prevUrls => {
        const updatedUrls = { ...prevUrls };
        delete updatedUrls[orderDetailId];
        return updatedUrls;
      });
    } else {
      try {
        const response = await getOrderPDF(orderDetailId);
        const blob = new Blob([response], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setPdfUrls(prevUrls => ({ ...prevUrls, [orderDetailId]: url }));
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    }
  };

  const handleUpdateOrderIdDetail = (orderDetailId) => {
    updateOrderDetailStatus(orderDetailId, 1) // Update to 1 (Báo lỗi)
      .then(() => {
        console.log(`Updated OrderDetailId ${orderDetailId} to status 1`);
        // Refresh the order details after update
        getOrderDetail(orderId).then(response => setOrderDetail(response.data));
      })
      .catch(error => console.error("Error updating order detail status:", error));
  };
  
  const handleUpdateOrderIdDetail1 = (orderDetailId, currentStatus) => {
    console.log("Updating OrderDetailId:", orderDetailId, "Current Status:", currentStatus);
  
    updateOrderDetailStatus(orderDetailId, 1) // Update status to 1 (Duyệt lại)
      .then(() => {
        console.log("Successfully updated OrderDetailId:", orderDetailId, "to status 1 (Duyệt lại)");
        setOrderDetail(prevDetails =>
          prevDetails.map(detail =>
            detail.orderDetailId === orderDetailId ? { ...detail, status: 1 } : detail
          )
        ); // Update state instead of reloading
      })
      .catch(error => console.error("Error updating order detail status:", error));
  };
  
  const handleUpdateStatus = (orderId) => {
    // Log the orderId and currentStatus
    console.log("Updating OrderId:", orderId, "Current Status:");
    const newStatus = 1; // Set new status to 1 (Duyệt)
    console.log("Setting new status to:", newStatus);
  
    updateStatus(orderId, newStatus)
      .then(() => {
        console.log("Successfully updated OrderId:", orderId, "to status 1 (Duyệt)");
        updateSale(orderId, accountId); // Update sale info if needed
        console.log("Sale information updated for OrderId:", orderId, "with AccountId:", accountId);
      })
      .catch((error) => console.error("Error updating order:", error));
  // Refresh the page
  };
  
  const handleUpdateStatus9000 = (orderId) => {
    // Log the orderId and currentStatus
    console.log("Updating OrderId:", orderId, "Current Status:");
  
    const newStatus = 0; // Set new status to 0 (Chờ phản hồi)
    console.log("Setting new status to:", newStatus);
  
    updateStatus(orderId, newStatus)
      .then(() => {
        console.log("Successfully updated OrderId:", orderId, "to status 0 (Chờ phản hồi)");
      })
      .catch((error) => console.error("Error updating order:", error));
  

  };
 
  console.log("Test button:", orders)
  // Check if the conditions for the "Update Order Status" button are met
console.log("orderDetail",orderDetail)

return (
  <div className="order-detail-document">
    <h2>Chi tiết đơn hàng cho OrderID: {orderId}</h2>
    {(orders.status <= 0   || orders.status === 9000) ? (
      orderDetail.length > 0 ? (
        <>
          <table className="table-document table-striped-document">
            <thead>
              <tr>
                <th>Ngày tạo</th>
                <th>Tên cá</th>
                <th>Loại cá</th>
                <th>Số lượng</th>
                <th>Cân nặng</th>
                <th>Trạng thái</th>
                <th>PDF</th>
              </tr>
            </thead>
            <tbody>
              {orderDetail.map((order) => (
                <React.Fragment key={order.orderDetailId}>
                  <tr>
                    <td>{order.createdAt || "N/A"}</td>
                    <td>{order.koiName || "N/A"}</td>
                    <td>{order.koiType || "N/A"}</td>
                    <td>{order.quantity || "N/A"}</td>
                    <td>{order.weight || "N/A"}</td>
                    <td>
                    {(orders.status < 1 || orders.status === 9000) && (
                    <>
                      {order.status === 1 ? (
                        <button
                          className="btn btn-danger"
                          onClick={() => handleUpdateOrderIdDetail(order.orderDetailId)}
                        >
                          Báo lỗi
                        </button>
                      ) : order.status === 2 ? (
                        <button
                          className="btn btn-warning"
                          onClick={() => handleUpdateOrderIdDetail1(order.orderDetailId)}
                        >
                          Duyệt lại
                        </button>
                      ) : order.status === 0 ? (
                        <span>Đang chờ khách hàng phản hồi</span>
                      ) : null}
                    </>
                  )}
                    </td>
                    <td>
                      <button
                        className="btn-document btn-primary-document"
                        onClick={() => handleViewPDF(order.orderDetailId)}
                      >
                        {pdfUrls[order.orderDetailId] ? "Ẩn PDF" : "Hiển thị PDF"}
                      </button>
                    </td>
                  </tr>
                  {pdfUrls[order.orderDetailId] && (
                    <tr>
                      <td colSpan="6">
                        <div className="pdf-viewer-document">
                          <h3>Xem Tài liệu cho Order Detail ID: {order.orderDetailId}</h3>
                          <iframe
                            src={pdfUrls[order.orderDetailId]}
                            width="100%"
                            height="500px"
                            style={{ border: "1px solid #ccc", borderRadius: "4px" }}
                            title={`PDF Viewer for Order Detail ID: ${order.orderDetailId}`}
                          />
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          {orderId && orders.status === 9000 && orderDetail.every(order => order.status === 1) ? (
            <button
              className="btn btn-success"
              onClick={() => handleUpdateStatus9000(orderId)}
            >
              Đưa về trạng thái 0
            </button>
          ) : orderId && orders.status === 0 ? (
            <button
              className="btn btn-success"
              onClick={() => handleUpdateStatus(orderId)}
            >
              Cập nhật trạng thái đơn hàng
            </button>
          ) : null}
        </>
      ) : (
        <div className="order-detail-item-document">
          <p>CreatedAt: N/A</p>
          <p>KoiName: N/A</p>
          <p>KoiType: N/A</p>
          <p>Quantity: N/A</p>
          <p>Weight: N/A</p>
          <p>Status: N/A</p>
        </div>
      )
    ) : (
      orderDetail.length > 0 ? (
        <>
          <table className="table-document table-striped-document">
            <thead>
              <tr>
                <th>Ngày tạo</th>
                <th>Tên cá</th>
                <th>Loại cá</th>
                <th>Số lượng</th>
                <th>Cân nặng</th>
                <th>Trạng thái</th>
                <th>PDF</th>
              </tr>
            </thead>
            <tbody>
              {orderDetail.map((order) => (
                <React.Fragment key={order.orderDetailId}>
                  <tr>
                    <td>{order.createdAt || "N/A"}</td>
                    <td>{order.koiName || "N/A"}</td>
                    <td>{order.koiType || "N/A"}</td>
                    <td>{order.quantity || "N/A"}</td>
                    <td>{order.weight || "N/A"}</td>
                   
                    <td>
                      <button
                        className="btn-document btn-primary-document"
                        onClick={() => handleViewPDF(order.orderDetailId)}
                      >
                        {pdfUrls[order.orderDetailId] ? "Ẩn PDF" : "Hiển thị PDF"}
                      </button>
                    </td>
                  </tr>
                  {pdfUrls[order.orderDetailId] && (
                    <tr>
                      <td colSpan="6">
                        <div className="pdf-viewer-document">
                          <h3>Xem Tài liệu cho Order Detail ID: {order.orderDetailId}</h3>
                          <iframe
                            src={pdfUrls[order.orderDetailId]}
                            width="100%"
                            height="500px"
                            style={{ border: "1px solid #ccc", borderRadius: "4px" }}
                            title={`PDF Viewer for Order Detail ID: ${order.orderDetailId}`}
                          />
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          {orderId && orders.status === 9000 && orderDetail.every(order => order.status === 1) ? (
            <button
              className="btn btn-success"
              onClick={() => handleUpdateStatus9000(orderId)}
            >
              Đưa về trạng thái 0
            </button>
          ) : orderId && orders.status === 0 ? (
            <button
              className="btn btn-success"
              onClick={() => handleUpdateStatus(orderId)}
            >
              Cập nhật trạng thái đơn hàng
            </button>
          ) : null}
        </>
      ) : (
        <div className="order-detail-item-document">
          <p>CreatedAt: N/A</p>
          <p>KoiName: N/A</p>
          <p>KoiType: N/A</p>
          <p>Quantity: N/A</p>
          <p>Weight: N/A</p>
          <p>Status: N/A</p>
        </div>
      )
    )}
  </div>
);
}

export default OrderDetailDocumentComponent;
