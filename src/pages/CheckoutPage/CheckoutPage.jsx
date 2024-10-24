import React, { useEffect, useState } from "react";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Stepper,
  Step,
  StepLabel,
  Divider,
} from "@mui/material";
import {
  order,
  orderDetail,
  cancelOrder,
  getOrderPDF,
} from "../../services/CustomerService";
import axios from "axios";

const REST_API_BANK_URL =
  "http://koideliverysystem.id.vn:8080/api/v1/payment/vn-pay";

const steps = ["Pending", "Confirmed", "Completed", "Delivered"];

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;

  const [orderData, setOrderData] = useState(null);
  const [orderDetailData, setOrderDetailData] = useState([]);
  const [error, setError] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const fetchedOrder = await order(orderId);
        setOrderData(fetchedOrder);

        const fetchedOrderDetails = await orderDetail(orderId);
        setOrderDetailData(
          Array.isArray(fetchedOrderDetails) ? fetchedOrderDetails : []
        );
      } catch (err) {
        console.error("Error fetching order data:", err);
        setError(err.message);
      }
    };

    const fetchPDF = async () => {
      try {
        const response = await getOrderPDF(orderId);
        const blob = new Blob([response], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (err) {
        console.error("Error fetching PDF:", err);
        setError("Unable to load PDF.");
      }
    };

    if (orderId) {
      fetchOrderData();
      fetchPDF();
    }
  }, [orderId]);

  const handleCancelOrder = async () => {
    try {
      await cancelOrder(orderId);
      alert("Order canceled successfully.");
      navigate("/");
    } catch (error) {
      console.error("Error canceling order:", error);
      alert("Failed to cancel order.");
    }
  };

  const handleProceedToPayment = async () => {
    try {
      console.log("Order ID:", orderId);

      const response = await axios.post(REST_API_BANK_URL, {
        orderId,
        bankCode: "NCB",
        returnUrl: "http://localhost:3000/checkout",
      });

      console.log("Payment API Response:", response.data);

      // Accessing nested paymentUrl correctly
      const paymentUrl = response.data.data?.paymentUrl;
      console.log("Payment URL:", paymentUrl);

      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        throw new Error("Payment URL not found.");
      }
    } catch (error) {
      if (error.response) {
        console.error("API Error:", error.response.data);
      } else if (error.request) {
        console.error("No Response from API:", error.request);
      } else {
        console.error("Unexpected Error:", error.message);
      }
      alert("Failed to proceed to payment.");
    }
  };

  if (!orderId) return <Navigate to="/" />;
  if (error) return <Typography color="error">Error: {error}</Typography>;
  if (!orderData) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ p: 4, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Order Confirmation
        </Typography>

        {/* Stepper for Order Status */}
        <Stepper activeStep={orderData.status} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Order Information */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Order Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography>Order ID: {orderData.orderId}</Typography>
            <Typography>
              Order Date: {new Date(orderData.orderDate).toLocaleString()}
            </Typography>
            <Typography>Total Price: {orderData.totalPrice} VND</Typography>
            <Typography>Status: {steps[orderData.status]}</Typography>
          </Grid>

          {/* PDF Preview */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Order PDF Preview
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {pdfUrl ? (
              <iframe
                src={pdfUrl}
                width="100%"
                height="400px"
                style={{ border: "1px solid #ccc", borderRadius: 4 }}
                title="Order PDF Preview"
              />
            ) : (
              <Typography>Loading PDF...</Typography>
            )}
          </Grid>

          {/* Order Details */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Order Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {orderDetailData.length > 0 ? (
              <Box
                sx={{
                  maxHeight: 300,
                  overflow: "auto",
                  p: 1,
                  bgcolor: "#fafafa",
                  borderRadius: 1,
                }}
              >
                {orderDetailData.map((detail) => (
                  <Paper key={detail.orderDetailId} sx={{ mb: 2, p: 2 }}>
                    <Typography>Koi Type: {detail.koiType}</Typography>
                    <Typography>Koi Name: {detail.koiName}</Typography>
                    <Typography>Quantity: {detail.quantity}</Typography>
                    <Typography>Weight: {detail.weight} kg</Typography>
                    <Typography>Discount: {detail.discount}</Typography>
                    <Typography>
                      Status: {detail.status === 0 ? "Pending" : "Completed"}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            ) : (
              <Typography>No order details found.</Typography>
            )}
          </Grid>

          {/* Actions: Cancel and Proceed to Payment */}
          {orderData.status === 1 && (
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="error"
                onClick={handleCancelOrder}
                sx={{ mr: 2 }}
              >
                Cancel Order
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleProceedToPayment}
              >
                Proceed to Payment
              </Button>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Box>
  );
};

export default CheckoutPage;
