import React, { useEffect, useState } from "react";
import { Paper, Stack, Typography, Button, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DeliveryStatusPopup from "../../components/DeliveryTracking";

const OrderReport = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);

  const handleOpenPopup = (orderId) => {
    setSelectedOrderId(orderId);
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
    setSelectedOrderId(null);
  };

  const formatCurrency = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  //Sort order theo status
  const statusOrder = [1, 0, 2, 3, 4, 5];

  // Lấy order rồi filter
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "http://koideliverysystem.id.vn:8080/api/orders"
        );
        const accountId = localStorage.getItem("accountId");

        // Ko có hàm lấy full order nên phải filter :(( siêu tốn tài nguyên
        const filteredOrders = response.data.filter(
          (order) => order.accountId === accountId
        );

        // Sort order theo status
        const sortedOrders = filteredOrders.sort((a, b) => {
          // Kiểm tra paymentStatus = 1 and status = 5
          const aPriority = a.paymentStatus === 1 && a.status === 5 ? -1 : 0;
          const bPriority = b.paymentStatus === 1 && b.status === 5 ? -1 : 0;
          if (aPriority === bPriority) {
            return (
              statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
            );
          }
          return aPriority - bPriority;
        });

        setOrders(sortedOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, []);

  // Navigate to checkout or show tracking based on status
  const handleButtonClick = (order) => {
    if (order.status === 3) {
      handleOpenPopup(order.orderId);
    } else {
      navigate("/checkout", { state: { orderId: order.orderId } });
    }
  };

  // Determine button properties based on order status
  const getButtonProps = (status, paymentStatus) => {
    switch (status) {
      case 0:
        return { text: "Pending", color: "warning" };
      case 1:
        return { text: "Verified", color: "success" };
      case 2:
      case 4:
        return { text: "Shipping", color: "info" };
      case 3:
        return { text: "Tracking", color: "transparent" };
      case 5:
        return paymentStatus
          ? { text: "View", color: "primary" }
          : { text: "Checkout Now", color: "error" };
      default:
        return { text: "Unknown", color: "default" };
    }
  };

  return (
    <Stack spacing={2} sx={{ margin: 2 }}>
      {orders.length > 0 ? (
        orders.map((order) => {
          const { text, color } = getButtonProps(
            order.status,
            order.paymentStatus
          );

          return (
            <Paper
              key={order.orderId}
              elevation={3}
              sx={{
                padding: 2,
                backgroundColor: "#f5f5f5",
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* Left: Order Details */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="h6">Mã đơn: {order.orderId}</Typography>
                <Typography variant="body1">
                  Gửi từ: {order.senderName} ({order.senderPhone}) -{" "}
                  {order.origin}
                </Typography>
                <Typography variant="body1">
                  Gửi đến: {order.receiverName} ({order.receiverPhone}) -{" "}
                  {order.destination}
                </Typography>
                <Typography variant="body1">
                  Tình trạng đơn hàng:{" "}
                  {order.status === 0
                    ? "Đang chờ xét duyệt"
                    : order.status === 1
                    ? "Đã duyệt - Đơn hàng của bạn đang được chuẩn bị cho bắt đầu vận chuyển"
                    : order.status === 2
                    ? "Tài xế đã nhận đơn"
                    : [3, 4].includes(order.status)
                    ? `Đơn hàng đang được giao đến địa điểm chỉ định sau ${
                        order.freight === "Dịch vụ tiêu chuẩn"
                          ? "5-7 ngày"
                          : order.freight === "Dịch vụ hỏa tốc"
                          ? "3-4 ngày"
                          : "Thời gian không xác định"
                      } kể từ ngày duyệt đơn`
                    : order.status === 5
                    ? "Đơn hàng đã được giao đến"
                    : "Trạng thái không xác định"}
                </Typography>
                <Typography variant="body1">
                  Tổng tiền: {`${formatCurrency(order.totalPrice)}`} VND -{" "}
                  {order.paymentStatus ? "Đã thanh toán" : "Chưa thanh toán"}
                </Typography>
              </Box>

              {/* Right: Dynamic Status Button */}
              <Box sx={{ flexShrink: 0, marginLeft: "auto" }}>
                <Button
                  variant="contained"
                  color={color}
                  sx={{
                    ...(order.status === 3 && {
                      backgroundColor: "#171B36",
                      color: "white",
                    }),
                    padding: "4px 10px",
                    fontSize: "1.2rem",
                    height: 40,
                  }}
                  onClick={() => handleButtonClick(order)}
                >
                  {text}
                </Button>
              </Box>
            </Paper>
          );
        })
      ) : (
        <Typography variant="body1" sx={{ textAlign: "center" }}>
          Tài khoản chưa có đơn nào được tạo.
        </Typography>
      )}
      <DeliveryStatusPopup
        open={popupOpen}
        onClose={handleClosePopup}
        orderId={selectedOrderId}
        showButton={true}
      />
    </Stack>
  );
};

export default OrderReport;
