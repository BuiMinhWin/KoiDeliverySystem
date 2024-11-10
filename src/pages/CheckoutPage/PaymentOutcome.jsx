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
import CreditCardOffIcon from "@mui/icons-material/CreditCardOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const PaymentOutcome = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const transactionStatus = searchParams.get("vnp_TransactionStatus");
  const orderInfo = searchParams.get("vnp_OrderInfo");
  const extractedUUID = orderInfo ? orderInfo.split(": ")[1] : "";

  const success = transactionStatus === "00";
  const notfinished = transactionStatus === "01";
  const failed = transactionStatus === "02";
  const fraud = transactionStatus === "07";

  const [countdown, setCountdown] = useState(15);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const buttonStyles = {
    backgroundColor: "#161A31",
    color: "white",
    "&:hover": { backgroundColor: "#727376" },
    padding: "17px 16px",
    borderRadius: "8px",
    minWidth: "auto",
    maxWidth: "fit-content",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  };

  useEffect(() => {
    const getOrderData = async () => {
      try {
        if (extractedUUID) {
          const data = await order(extractedUUID);
          setOrderData(data);
          if (success) await updatePaymentStatus(extractedUUID);
        }
      } catch (err) {
        setError("Failed to fetch order data.");
      } finally {
        setLoading(false);
      }
    };
    getOrderData();
  }, [extractedUUID]);

  useEffect(() => {
    if (!transactionStatus) return; // Prevent countdown if status is not available

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          navigate(success ? "/order-report" : "/checkout", {
            state: { extractedUUID },
          });
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [success, navigate, extractedUUID, transactionStatus]);

  // Loading screen until transaction status is available
  if (loading || !transactionStatus) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "#f5f5f5",
        }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading order details...
        </Typography>
      </Box>
    );
  }

  // Error or failed payment outcome
  if (error || !success) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
          bgcolor: "#f5f5f5",
        }}
      >
        <Alert
          severity="error"
          variant="filled"
          icon={<CreditCardOffIcon sx={{ fontSize: "2rem", marginRight: 2 }} />}
          sx={{
            display: "flex",
            alignItems: "center",
            fontSize: "1.75rem",
            padding: "32px",
            width: "50%",
            textAlign: "center",
            marginBottom: 3,
          }}
        >
          {failed
            ? "Thanh toán thất bại (Ngân hàng từ chối)."
            : notfinished
            ? "Thanh toán chưa hoàn thành."
            : fraud
            ? "Thanh toán bị đánh dấu là gian lận!"
            : "Thanh toán thất bại"}
        </Alert>
        <Typography sx={{ fontSize: "20px", color: "red", mb: 2 }}>
          Bạn sẽ được tự động chuyển về sau {countdown} giây...
        </Typography>
        <Button
          sx={buttonStyles}
          onClick={() =>
            navigate(success ? "/order-report" : "/checkout", {
              state: { extractedUUID },
            })
          }
        >
          Hoặc nhấn vào đây để quay về
        </Button>
      </Box>
    );
  }

  // Successful payment outcome with order details
  return (
    <Box sx={{ height: "100vh", position: "relative" }}>
      {/* Success check icon */}
      <Box
        sx={{
          position: "absolute",
          top: 20,
          left: "50%",
          transform: "translateX(-50%)",
          color: "green",
        }}
      >
     
      </Box>

      <Box
        sx={{
          p: 4,
          bgcolor: "#f5f5f5",
          height: "75vh",
          overflow: "hidden",
          mt: 8, // Adds top margin to avoid overlap with the icon
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ!
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
        <Box sx={{ textAlign: "center" }}>
          <Typography sx={{ fontSize: "20px", color: "red", mb: 2 }}>
            Bạn sẽ được tự động chuyển về sau {countdown} giây...
          </Typography>
          <Button
            sx={buttonStyles}
            onClick={() =>
              navigate("/order-report", { state: { extractedUUID } })
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
