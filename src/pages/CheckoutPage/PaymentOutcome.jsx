import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Typography, Box, Button } from "@mui/material";

const PaymentOutcome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search); // Parse query params

  // Check the vnp_TransactionStatus from the URL query parameters
  const transactionStatus = searchParams.get("vnp_TransactionStatus");
  const orderId = searchParams.get("vnp_TxnRef");

  const success = transactionStatus === "00"; // If status is "00", payment was successful

  const [countdown, setCountdown] = useState(10); // Countdown starting from 10 seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          if (success) {
            navigate("/order-report"); 
          } else {
            navigate(`/checkout`, { state: { orderId } }); 
          }
          return 0; 
        }
        return prev - 1; 
      });
    }, 1000);

    return () => clearInterval(timer); 
  }, [success, navigate, orderId]);

  return (
    <Box sx={{ p: 4, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography variant="h4" align="center" gutterBottom>
        {success ? "Payment Successful!" : "Payment Failed"}
      </Typography>
      <Typography align="center" sx={{ fontSize: "24px", color: "red" }}>
        Redirecting in {countdown} seconds...
      </Typography>
      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() =>
            navigate(success ? "/order-report" : `/checkout`, {
              state: { orderId },
            })
          }
        >
          Go Now
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentOutcome;
