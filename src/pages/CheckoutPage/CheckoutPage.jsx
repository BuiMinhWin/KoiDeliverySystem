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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  order,
  orderDetail,
  cancelOrder,
  getOrderPDF,
} from "../../services/CustomerService";
import axios from "axios";
import FeedbackForm from "../../components/FeedbackForm";
import { useSnackbar } from "notistack";

const REST_API_BANK_URL =
  "http://koideliverysystem.id.vn:8080/api/v1/payment/vn-pay";

const formatCurrency = (value) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const orderId = location.state?.orderId;

  const [orderData, setOrderData] = useState(null);
  const [orderDetailData, setOrderDetailData] = useState([]);
  const [serviceStatusData, setServiceStatusData] = useState([]);
  const [error, setError] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  

  const { enqueueSnackbar } = useSnackbar();

  const confirmCancelOrder = () => {
    setOpenDialog(true); // Open the confirmation dialog
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // Close the dialog without canceling the order
  };

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
      navigate("/customer");
    } catch (error) {
      console.error("Error canceling order:", error);
    }
  };
  const handleConfirmCancel = async () => {
    await handleCancelOrder(); // Execute cancel order logic after confirmation
    enqueueSnackbar("Đơn của bạn đã được hủy", { variant: "success" }); // Show success notification
    setOpenDialog(false); // Close the dialog
  };

  const handleProceedToPayment = async () => {
    try {
      console.log("Order ID:", orderId);

      const response = await axios.post(REST_API_BANK_URL, {
        orderId,
        bankCode: "NCB",
        returnUrl: "http://localhost:3000/payment-outcome",
      });

      console.log("Payment API Response:", response.data);

      const paymentUrl = response.data.data?.paymentUrl;
      console.log("Payment URL:", paymentUrl);

      if (paymentUrl) {
        navigate("/payment-outcome", {
          state: { orderId, paymentStatus: "pending" },
        });
        window.location.href = paymentUrl;
      } else {
        throw new Error("Payment URL not found.");
      }
    } catch (error) {
      if (error.response) {
        console.error("API Error:", error.response.data);
        navigate("/payment-outcome", {
          state: { orderId, paymentStatus: "failed" },
        });
      } else if (error.request) {
        console.error("No Response from API:", error.request);
        alert("Failed to proceed to payment.");
      } else {
        console.error("Unexpected Error:", error.message);
        alert("Failed to proceed to payment.");
      }
    }
  };

  if (!orderId) return <Navigate to="/customer" />;
  if (error) return <Typography color="error">Error: {error}</Typography>;
  if (!orderData) return <Typography>Đang tải...</Typography>;

  // Define steps based on orderData
  const steps = [
    "Đang Xử Lí", // Step 1
    "Đã Duyệt", // Step 2
    orderData.paymentStatus ? "Đang Vận chuyển" : "Vui Lòng Thanh Toán", // Step 3
    "Hoàn Thành", // Step 4
  ];

  const getActiveStep = (status, paymentStatus) => {
    if (status === 0) return 0; // "Đang xử lí"
    if (status === 1) return 1; // "Đã duyệt"
    if (status === 2 || status === 3) return 2; // "Đang vận chuyển"
    if (status === 4) return paymentStatus ? 4 : 3; // Completed orders
    if (status === 5) return paymentStatus ? 4 : 3; // If payment is made
    return 0; // Default case
  };

  const activeStep = getActiveStep(orderData.status, orderData.paymentStatus);

  return (
    <Box sx={{ p: 4, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography
          variant="h3"
          align="center"
          fontWeight={"bold"}
          gutterBottom
        >
          Thông Tin Đơn Hàng
        </Typography>

        {/* Stepper for Order Status */}
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Order Information */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 2,
                border: "1px solid #ddd",
                borderRadius: 1,
                backgroundColor: "#fff",
                mb: 3,
              }}
            >
              <Typography
                variant="h6"
                sx={{ textDecoration: "underline" }}
                gutterBottom
              >
                Thông tin đơn hàng:
              </Typography>
              <Typography>Mã đơn: {orderData.orderId}</Typography>
              <Typography>
                Ngày đặt đơn: {new Date(orderData.orderDate).toLocaleString()}
              </Typography>
              <Typography>
                Ngày nhận hàng:{" "}
                {orderData.shippedDate && orderData.shippedDate.trim() !== ""
                  ? orderData.shippedDate
                  : "Đơn hàng chưa được giao đến"}
              </Typography>
              <Typography>
                <span style={{ fontWeight: "bold" }}>Gửi từ:</span>{" "}
                {orderData.senderName} - {orderData.senderPhone} -{" "}
                {orderData.origin}
              </Typography>
              <Typography>Ghi chú lấy hàng:</Typography>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  px: 5,
                  bgcolor: "#fafafa",
                  borderRadius: 3,
                  mb: 1,
                  mt: 1,
                }}
              >
                <Typography>
                  {orderData.senderNote && orderData.senderNote.trim() !== ""
                    ? orderData.senderNote
                    : "Không có ghi chú nào cho đơn hàng này"}
                </Typography>
              </Paper>
              <Typography>
                <span style={{ fontWeight: "bold" }}>Gửi đến:</span>{" "}
                {orderData.receiverName} - {orderData.receiverPhone} -{" "}
                {orderData.destination}
              </Typography>
              <Typography>Ghi chú nhận hàng:</Typography>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  px: 5,
                  bgcolor: "#fafafa",
                  borderRadius: 3,
                  mb: 1,
                  mt: 1,
                }}
              >
                <Typography>
                  {orderData.receiverNote &&
                  orderData.receiverNote.trim() !== ""
                    ? orderData.receiverNote
                    : "Không có ghi chú nào cho đơn hàng này"}
                </Typography>
              </Paper>
              <Typography sx={{ fontWeight: "bold" }}>
                Tình trạng đơn hàng: {steps[orderData.status]}
              </Typography>
              <Typography variant="h6">
                Tổng giá:
                <span style={{ color: "red", fontWeight: "bold" }}>
                  {` ${formatCurrency(orderData.totalPrice)} VND`}
                </span>
              </Typography>
              <Typography>
                Tình trạng thanh toán:{" "}
                {orderData.paymentStatus ? "Đã thanh toán" : "Chưa thanh toán"}
              </Typography>
            </Box>

            {/* Order Detail Information */}
            <Box
              sx={{
                p: 2,
                border: "1px solid #ddd",
                borderRadius: 1,
                backgroundColor: "#fff",
                maxHeight: 300,
                overflow: "auto",
              }}
            >
              <Typography
                variant="h6"
                sx={{ textDecoration: "underline" }}
                gutterBottom
              >
                Chi tiết đơn hàng:
              </Typography>

              {orderDetailData.length > 0 ? (
                orderDetailData.map((detail) => (
                  <Box key={detail.orderDetailId}>
                    <Typography>Loại cá: {detail.koiType}</Typography>
                    <Typography>Biến thể: {detail.koiName}</Typography>
                    <Typography>Số lượng: {detail.quantity}</Typography>
                    <Typography>Cân nặng: {detail.weight} kg</Typography>
                    <Typography>
                      Mã giảm giá:{" "}
                      {detail.discount && detail.discount.trim() !== ""
                        ? detail.discount
                        : "Không có mã giảm giá nào được áp dụng cho đơn hàng này"}{" "}
                    </Typography>
                    <Typography>
                      Tình trạng cá:{" "}
                      {detail.status === 0 ? "Bất thường" : "Khỏe mạnh"}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography>Không có đơn nào được tìm thấy.</Typography>
              )}
            </Box>
          </Grid>

          {/* PDF Preview */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="h6"
              sx={{ textDecoration: "underline" }}
              gutterBottom
            >
              Xem trước PDF
            </Typography>
            {pdfUrl ? (
              <iframe
                src={pdfUrl}
                width="100%"
                height="400px"
                style={{ border: "1px solid #ccc", borderRadius: 4 }}
                title="Order PDF Preview"
              />
            ) : (
              <Typography>PDF đang được tải...</Typography>
            )}
            <Grid item xs={12}>
              {orderData.status === 5 && <FeedbackForm orderId={orderId} />}
            </Grid>
          </Grid>

          {(orderData.status === 0 || orderData.status === 1) &&
            orderData.paymentStatus == false && (
              <Button
                variant="contained"
                color="error"
                onClick={confirmCancelOrder} // Use confirmCancelOrder to open the dialog
                sx={{ mr: 2, mt: 5, mx: 15 }}
              >
                Hủy đơn
              </Button>
            )}

          {[1, 2, 3, 4, 5].includes(orderData.status) &&
            !orderData.paymentStatus && (
              <Button
                sx={{ mt: 5, mx: 15 }}
                variant="contained"
                color="primary"
                onClick={handleProceedToPayment}
              >
                Thanh toán
              </Button>
            )}
        </Grid>
      </Paper>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 2,
            width: "400px",
            bgcolor: "#171B36",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            pb: 1,
            color: "#ffffff",
          }}
        >
          Xác nhận hủy đơn
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ textAlign: "center", fontSize: "16px",  color: "#ffffff", }}>
            Bạn có chắc muốn hủy đơn này?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{ borderRadius: 2, px: 4,  color: "#ffffff", }}
          >
            Không
          </Button>
          <Button
            onClick={handleConfirmCancel}
            variant="contained"
            color="error"
            sx={{ borderRadius: 2, px: 4 }}
            autoFocus
          >
            Có
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CheckoutPage;
