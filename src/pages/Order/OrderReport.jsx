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

  const statusOrder = [1, 9000, 0, 2, 3, 4, 5, 7];

  // Lấy order rồi filter
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "/api/orders"
        );
        const accountId = localStorage.getItem("accountId");

        // Lấy order theo accountID
        const filteredOrders = response.data.filter(
          (order) => order.accountId === accountId
        );

        // Sort lại thứ tự order
        const sortedOrders = filteredOrders.sort((a, b) => {
          // Status 6 có priority cao nhất
          if (a.status === 6) return -1;
          if (b.status === 6) return 1;

          // Tiếp là 5 với paymentStatus = 0
          if (a.status === 5 && a.paymentStatus === 0) return -1;
          if (b.status === 5 && b.paymentStatus === 0) return 1;

          // Sort còn lại thì giữ nguyên
          return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
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
        return { text: "Đang Duyệt", color: "warning" };
      case 1:
        return { text: "Đã Duyệt", color: "success" };
      case 2:
        return { text: "Đang Lấy Hàng", color: "info" };
      case 3:
        return { text: "Theo Dõi", color: "transparent" };
      case 4:
        return { text: "Đang Vận Chuyển", color: "info" };
      case 5:
        return paymentStatus === 1
          ? { text: "Xem Đơn Hàng", color: "primary" }
          : { text: "Thanh Toán", color: "error" };
      case 6:
        return { text: "Đơn Hàng Cần Chú Ý", color: "error" };
      case 7:
        return { text: "Đã nhận hàng", color: "transparent" };
      case 9000:
        return { text: "Lỗi tài liệu", color: "error" };
      default:
        return { text: "Không Xác Định", color: "default" };
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
                  {order.status === 0 ? (
                    "Đang chờ xét duyệt"
                  ) : order.status === 1 ? (
                    "Đã duyệt - Đơn hàng của bạn đang được chuẩn bị cho bắt đầu vận chuyển"
                  ) : order.status === 2 ? (
                    "Tài xế đã nhận đơn"
                  ) : [3, 4].includes(order.status) ? (
                    `Đơn hàng đang được giao đến địa điểm chỉ định sau ${
                      order.freight === "Dịch vụ tiêu chuẩn"
                        ? "5-7 ngày"
                        : order.freight === "Dịch vụ hỏa tốc"
                        ? "3-4 ngày"
                        : order.freight === "Vận chuyển nước ngoài"
                        ? "7-14 ngày"
                        : "Thời gian không xác định"
                    } kể từ ngày duyệt đơn`
                  ) : order.status === 5 ? (
                    "Đơn hàng đã được giao đến"
                  ) : order.status === 6 ? (
                    "Đơn hàng cần được chú ý"
                  ) : order.status === 7 ? (
                    "Đã nhận hàng"
                  ) : order.status === 9000 ? (
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      {" "}
                      PDF bị từ chối - Vui lòng cập nhật lại tài liệu
                    </span>
                  ) : (
                    "Trạng thái không xác định"
                  )}
                </Typography>
                <Typography variant="body1">
                  Tổng tiền: {`${formatCurrency(order.totalPrice)}`} VND -{" "}
                  {order.paymentStatus ===2 ? "Trả sau" : order.paymentStatus ===0 ? "Chưa thanh toán" : order.paymentStatus ===1? "Đã thanh toán":undefined}
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
                    ...(order.status === 7 && {
                      backgroundColor: "#CC00CC",
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
