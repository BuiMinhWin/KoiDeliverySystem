import React, { useEffect, useState } from "react";
import { Paper, Stack, Typography, Button, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getAccountById } from "../../services/CustomerService";

const OrderReport = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const formatCurrency = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Define the sort order for statuses
  const statusOrder = [0, 1, 2, 3, 4];

  // Fetch orders and filter by accountId from localStorage
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "http://koideliverysystem.id.vn:8080/api/orders"
        );
        const accountId = localStorage.getItem("accountId");

        // Filter orders by accountId
        const filteredOrders = response.data.filter(
          (order) => order.accountId === accountId
        );

        // Sort orders based on the defined status order
        const sortedOrders = filteredOrders.sort((a, b) => {
          return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
        });

        setOrders(sortedOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };
    fetchOrders();
  }, []);

  // Navigate to checkout or order view based on status
  const handleButtonClick = (order) => {
    navigate("/checkout", { state: { orderId: order.orderId } });
  };

  // Determine button properties based on order status
  const getButtonProps = (status, paymentStatus) => {
    console.log("Button prop: ", paymentStatus)
    switch (status) {
      case 0:
        return { text: "Pending", color: "warning" };
      case 1:
        return { text: "Verified", color: "success" }; 
      case 2:
      case 3:
      case 4:
        return { text: "Shipping", color: "info" };
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
          const { text, color } = getButtonProps(order.status, order.paymentStatus);

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
                    : [2, 3, 4].includes(order.status)
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
                  onClick={() => handleButtonClick(order)}
                  sx={{
                    padding: "4px 10px",
                    fontSize: "1.2rem",
                    height: 40,
                  }}
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
    </Stack>
  );
};

export default OrderReport;
