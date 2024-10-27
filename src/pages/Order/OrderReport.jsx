import React, { useEffect, useState } from "react";
import { Paper, Stack, Typography, Button, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OrderReport = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  // Define the sort order for statuses
  const statusOrder = [1, 0, 2, 3, 4];

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
    if (order.status === 1 || order.status === 4) {
      navigate("/checkout", { state: { orderId: order.orderId } });
    } else {
      navigate("/checkout", { state: { orderId: order.orderId } });
    }
  };

  // Determine button properties based on order status
  const getButtonProps = (status) => {
    switch (status) {
      case 0:
        return { text: "Pending", color: "warning" };
      case 1:
        return { text: "Checkout", color: "error" };
      case 4:
        return { text: "View", color: "success" };
      default:
        return { text: "Unknown", color: "default" };
    }
  };

  return (
    <Stack spacing={2} sx={{ margin: 2 }}>
      {orders.length > 0 ? (
        orders.map((order) => {
          const { text, color } = getButtonProps(order.status);

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
                <Typography variant="h6">Order ID: {order.orderId}</Typography>
                <Typography variant="body2">
                  From: {order.senderName} ({order.senderPhone}) -{" "}
                  {order.origin}
                </Typography>
                <Typography variant="body2">
                  To: {order.receiverName} ({order.receiverPhone}) -{" "}
                  {order.destination}
                </Typography>
                <Typography variant="body2">
                  Status: {order.status === 0 ? "Pending" : "Shipped"}
                </Typography>
                <Typography variant="body2">
                  Total Price: ${order.totalPrice}
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
          No orders found for this account.
        </Typography>
      )}
    </Stack>
  );
};

export default OrderReport;
