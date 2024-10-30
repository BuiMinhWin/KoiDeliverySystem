// PaymentOutcome.js
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Stack,
} from "@mui/material";

import { order, updatePaymentStatus } from "../../services/CustomerService";

const PaymentOutcome = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const transactionStatus = searchParams.get("vnp_TransactionStatus");
  const orderInfo = searchParams.get("vnp_OrderInfo");
  const extractedUUID = orderInfo ? orderInfo.split(": ")[1] : "";

  const success = transactionStatus === "00"; // Check if payment succeeded
  const [countdown, setCountdown] = useState(150000); // 15 second countdown
  const [orderData, setOrderData] = useState(null); // Store order details
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  
  console.log("Transaction status:", transactionStatus); // Debug log
  console.log("Extracted Order UUID:", extractedUUID); // Debug log

  const formatCurrency = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Fetch the order details when the component loads
  useEffect(() => {
    const getOrderData = async () => {
      try {
        console.log(`Fetching order data for UUID: ${extractedUUID}`);
        const data = await order(extractedUUID);
        setOrderData(data);
        console.log("Payment success condition:", success); // Add this
        if (success) {
          console.log("Payment successful, calling updatePaymentStatus...");
          await updatePaymentStatus(extractedUUID);
          console.log("updatePaymentStatus completed.");
        } else {
          console.log("Payment not successful, skipping status update.");
        }
      } catch (err) {
        console.error(`Failed to fetch or update order with UUID: ${extractedUUID}`, err);
        setError("Failed to fetch order data.");
      } finally {
        setLoading(false);
      }
    };
    getOrderData();
  }, [extractedUUID]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          navigate(success ? "/order-report" : "/checkout", {
            state: { extractedUUID },
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [success, navigate, extractedUUID]);

  // Render loading state
  if (loading) {
    return (
      <Box
        sx={{
          p: 4,
          bgcolor: "#f5f5f5",
          minHeight: "100vh",
          textAlign: "center",
        }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading order details...
        </Typography>
      </Box>
    );
  }

  // Render error state
  if (error || success === false) {
    return (
      <Box
        sx={{
          p: 4,
          bgcolor: "#f5f5f5",
          minHeight: "75vh",
        }}
      >
        <Alert
          severity="error"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Thanh toán thất bại
        </Alert>

        <Box sx={{ textAlign: "center", pt: "50px" }}>
          <Typography align="center" sx={{ fontSize: "20px", color: "red" }}>
            Bạn sẽ được tự động chuyển về sau {countdown} giây...
          </Typography>
          <Box sx={{ display: "inline-flex", pt: "50px" }}>
            <Button
              sx={{
                backgroundColor: "#161A31",
                color: "white",
                "&:hover": {
                  backgroundColor: "#1D233D",
                },
                padding: "7px 16px",
              }}
              onClick={() =>
                navigate("/order-report", {
                  state: { extractedUUID },
                })
              }
            >
              Hoặc nhấn vào đây để quay về
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }
  // Render order information if available
  return (
    <Box sx={{ height: "100vh" }}>
      <Box
        sx={{ p: 4, bgcolor: "#f5f5f5", height: "75vh", overflow: "hidden" }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          {success ? "Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ!" : ""}
        </Typography>
        {orderData && (
          <Box sx={{ mt: 4 }}>
            <Stack spacing={4}>
              <Typography
                sx={{ display: "flex", justifyContent: "center" }}
                variant="h3"
              >
                Đơn hàng của bạn
              </Typography>
              <Typography variant="h6">
                Mã đơn hàng: {orderData.orderId}
              </Typography>
              <Typography variant="h6">
                Người gửi: {orderData.senderName} - {orderData.senderPhone}
              </Typography>
              <Typography variant="h6">
                Người nhận: {orderData.receiverName} - {orderData.receiverPhone}
              </Typography>
              <Typography variant="h6">
                Gửi từ địa chỉ: {orderData.origin}
              </Typography>
              <Typography variant="h6">
                Gửi đến địa chỉ: {orderData.destination}
              </Typography>
              <Typography variant="h6">
                Số tiền đã thanh toán:{" "}
                <Typography
                  variant="h6"
                  component="span"
                  sx={{ color: "#01611c" }}
                >
                  {orderData.totalPrice}
                </Typography>{" "}
                VND
              </Typography>
            </Stack>
          </Box>
        )}
      </Box>
      <Box sx={{ textAlign: "center" }}>
        <Typography align="center" sx={{ fontSize: "20px", color: "red" }}>
          Bạn sẽ được tự động chuyển về sau {countdown} giây...
        </Typography>
        <Box sx={{ display: "inline-flex" }}>
          <Button
            sx={{
              backgroundColor: "#161A31",
              color: "white",
              "&:hover": {
                backgroundColor: "#1D233D",
              },
              padding: "7px 16px",
            }}
            onClick={() =>
              navigate(success ? "/order-report" : "/checkout", {
                state: { extractedUUID },
              })
            }
          >
            Hoặc nhấn vào đây để quay về
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default PaymentOutcome;
