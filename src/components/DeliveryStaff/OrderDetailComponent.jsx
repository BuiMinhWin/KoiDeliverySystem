import React, { useEffect, useState } from 'react';
import { listOrder, updateStatus } from '../../services/SaleStaffService';
import { getOrderDetail } from '../../services/DeliveryService';
import { getOrderPDF } from '../../services/CustomerService';
import { useParams } from 'react-router-dom';


const OrderDetailComponent = () => {
  const { orderId } = useParams();
  const [orders, setOrders] = useState([]);
  const [orderDetail, setOrderDetail] = useState([]);
  const [pdfUrls, setPdfUrls] = useState({});


  useEffect(() => {
    if (orderId) {
      getOrderDetail(orderId)
        .then(response => {
          console.log(response.data); 
          setOrderDetail(response.data); 
        })
        .catch(error => console.error('Error fetching order details:', error));
    } else {
      console.log("Order ID not found");
    }
  }, [orderId]); 

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
  const handleViewPDF = async (orderDetailId) => {
    if (pdfUrls[orderDetailId]) {
      // If the PDF URL exists, remove it to hide the viewer
      setPdfUrls(prevUrls => {
        const updatedUrls = { ...prevUrls };
        delete updatedUrls[orderDetailId];
        return updatedUrls;
      });
    } else {
      // If the PDF URL doesn't exist, fetch and display it
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

  return (
<div className="order-detail-document">
      <h2>Chi tiết đơn hàng cho OrderID: {orderId}</h2>
      
      {orderDetail.length > 0 ? (
        <table className="table-document table-striped-document">
          <thead>
            <tr>
              <th>Ngày tạo</th>
              <th>Tên cá</th>
              <th>Loại cá</th>
              <th>Số lượng</th>
              <th>Cân nặng</th>
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
                {/* Conditional rendering of the PDF viewer directly below each row */}
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
      ) : (
        <div className="order-detail-item-document">
          <p>CreatedAt: N/A</p>
          <p>KoiName: N/A</p>
          <p>KoiType: N/A</p>
          <p>Quantity: N/A</p>
          <p>Weight: N/A</p>
          <p>Status: N/A</p>
        </div>
      )}
    </div>
  );
};

export default OrderDetailComponent;
