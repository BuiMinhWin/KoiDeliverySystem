import React, { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { Typography, Box, Paper, Grid } from "@mui/material";
import { order } from "../../services/CustomerService";

const CheckoutPage = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const fetchedOrder = await order(orderId);
        setOrderData(fetchedOrder);
      } catch (err) {
        console.error("Error fetching order data:", err);
        setError(err.message);
      }
    };

    if (orderId) {
      fetchOrderData();
    }
  }, [orderId]);

  if (!orderId) {
    return <Navigate to="/" />;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  if (!orderData) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Order Confirmation
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6">Order ID: {orderData.id}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Sender: {orderData.senderName}</Typography>
            <Typography>Phone: {orderData.senderPhone}</Typography>
            <Typography>Address: {orderData.origin}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Receiver: {orderData.receiverName}</Typography>
            <Typography>Phone: {orderData.receiverPhone}</Typography>
            <Typography>Address: {orderData.destination}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>Koi Type: {orderData.koi_type}</Typography>
            <Typography>Quantity: {orderData.quantity}</Typography>
            <Typography>Weight: {orderData.weight} kg</Typography>
            <Typography>Freight: {orderData.freight}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default CheckoutPage;
