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
  Card,
  CardContent,
  CardActions,
  styled,
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
import PaymentIcon from "@mui/icons-material/Payment";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import DeliveryStatusPopup from "../../components/DeliveryTracking";
import PDFPreview from "../../components/PDFPreview";
import { getService } from '../../services/EmployeeService';

const buttonStyles = {
  backgroundColor: "#3e404e",
  color: "white",
  "&:hover": { backgroundColor: "#727376" },
  padding: "8px 16px",
  borderRadius: "8px",
  minWidth: "auto",
  maxWidth: "fit-content",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};
const pdfButtonStyles = {
  backgroundColor: "#3e404e",
  color: "white",
  "&:hover": { backgroundColor: "#727376" },
  padding: "8px 16px",
  borderRadius: "8px",
  justifyContent: "center",
};

const RedStepLabel = styled(StepLabel)(({ theme }) => ({
  color: theme.palette.error.main,
  "& .MuiStepIcon-root": {
    color: theme.palette.error.main, //Icon đỏ
  },
  "& .MuiStepIcon-text": {
    fill: theme.palette.common.white, // chữ "X" bla bla bla
  },
}));

const REST_API_BANK_URL =
 "/api/v1/payment/vn-pay";

const formatCurrency = (value) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const orderId = location.state?.orderId;
  const [openPDF, setOpenPDF] = useState(false);

  const [orderData, setOrderData] = useState(null);
  const [orderDetailData, setOrderDetailData] = useState([]);
  // const servicesData = useState([]);
  const [error, setError] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [selectedOrderDetailId, setSelectedOrderDetailId] = useState(null);


  const { enqueueSnackbar } = useSnackbar();

  const confirmCancelOrder = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const fetchedOrder = await order(orderId);
        setOrderData(fetchedOrder);
        console.log(fetchedOrder);

        const fetchedOrderDetails = await orderDetail(orderId);
        setOrderDetailData(
          Array.isArray(fetchedOrderDetails) ? fetchedOrderDetails : []
        );
      } catch (err) {
        console.error("Error fetching order data:", err);
        setError(err.message);
      }
    };

    if (orderId) {
      fetchOrderData();
    }
  getAllServices();
    

  }, [orderId]);
  const [serviceIdToName, setServiceIdToName] = useState({}); 
  const [services, setServices] = useState([]); 
  const getAllServices = () => {
    getService()
      .then((response) => {
        const serviceList = Array.isArray(response.data) ? response.data : [];
        console.log("Fetched services:", serviceList); 
  
        setServices(serviceList);
  
        const mapping = serviceList.reduce((acc, service) => {
          acc[service.servicesId] = service.servicesName; 
          return acc;
        }, {});
  
        setServiceIdToName(mapping); 
        console.log("Service ID to Name Mapping:", mapping); 
      })
      .catch((error) => console.error("Error fetching services: ", error));
  };
  

  const fetchPDF = async (orderDetailId) => {
    try {
      const response = await getOrderPDF(orderDetailId);
      const blob = new Blob([response], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err) {
      console.error("Error fetching PDF:", err);
      setError("Unable to load PDF.");
    }
  };

  const handlePDFClick = (orderDetailId) => {
    setSelectedOrderDetailId(orderDetailId);
    fetchPDF(orderDetailId);
    setOpenPDF(true);
  };

  const handleCancelOrder = async () => {
    try {
      await cancelOrder(orderId);
      alert("Order canceled successfully.");
      navigate("/order-report");
    } catch (error) {
      console.error("Error canceling order:", error);
    }
  };
  const handleConfirmCancel = async () => {
    try {
      await handleCancelOrder();
      enqueueSnackbar("Đơn của bạn đã được hủy", { variant: "success" });
    } catch (error) {
      console.error("Error during order cancellation:", error);
      enqueueSnackbar("Có lỗi xảy ra khi hủy đơn hàng. Vui lòng thử lại.", {
        variant: "error",
      });
    } finally {
      setOpenDialog(false);
    }
  };

  const handleProceedToPayment = async () => {
    try {
      console.log("Order ID:", orderId);

      const response = await axios.post(REST_API_BANK_URL, {
        orderId,
        bankCode: "NCB",
        returnUrl: "https://koi-delivery-system.vercel.app/payment-outcome",
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
    "Xử Lí",
    "Duyệt đơn",
    "Tài xế nhận đơn",
    "Tài xế lấy hàng",
    "Đơn đang được vận chuyển",
    orderData.paymentStatus === 2 && "Vui lòng thanh toán",
    orderData.paymentStatus === 1 && "Hoàn thành"
  ].filter(Boolean);
  


  const getActiveStep = (status, paymentStatus) => {
    if (status === 0) return 0; // "Đang xử lí"
    if (status === 1) return 1; // "Đã duyệt"
    if (status === 2) return 2; // "Tài xế nhận đơn"
    if (status === 3) return 3; // "Đã lấy hàng"
    if (status === 4) return 4; //"Đang giao"
    if (status === 5) return paymentStatus === 2 ? 4 : 5;
    return 0; // Default case
  };

  const handleUpdateOrderStatus = async () => {
    try {
      const newStatus = 7;
      const updatedOrder = await updateOrderStatus(orderData.id, newStatus);
      console.log("Order Id being updated to finish is:", orderData.id);
      message;
      console.log("Order status updated:", updatedOrder);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const activeStep = getActiveStep(orderData?.status, orderData?.paymentStatus);
  const hasError = orderData?.status === 6;

  // const serviceIdToName = servicesData.reduce((acc, service) => {
  //   acc[service.servicesId] = service.servicesName;
  //   return acc;
  // }, {});

  return (
    <Box
      sx={{
        p: 4,
        bgcolor: "#f5f5f5",
        minHeight: "100vh", // Ensures the Box fills the viewport height
        display: "flex", // Use flexbox to control layout
        flexDirection: "column",
        justifyContent: "center", // Centers content vertically
        alignItems: "center", // Centers content horizontally
      }}
    >
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography
          variant="h3"
          align="center"
          fontWeight={"bold"}
          gutterBottom
        >
          Thông Tin Đơn Hàng
        </Typography>
        {orderData && orderData.status !== 7 ? (
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label, index) => (
              <Step key={index} completed={hasError || activeStep >= index}>
                {hasError ? (
                  <RedStepLabel icon={<HighlightOffIcon />} error>
                    {label}
                  </RedStepLabel>
                ) : (
                  <StepLabel>{label}</StepLabel>
                )}
              </Step>
            ))}
          </Stepper>
        ) : (
          <Typography
            variant="h6"
            sx={{ textAlign: "center", mt: 4, mb: 4, color: "green" }}
          >
            Thank you for choosing our service!
          </Typography>
        )}

        {hasError && (
          <Typography color="error" variant="body2" align="center">
            Đã có vấn đề xảy ra khi xử lí đơn của bạn. Vui lòng liên hệ đội ngũ
            hỗ trợ để được hỗ trợ.
          </Typography>
        )}
        {/* Order Information */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
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
              <Typography>
                Dịch vụ áp dụng:{" "}
                {orderData.serviceIds && orderData.serviceIds.length > 0 ? (
                orderData.serviceIds
                  .sort((a, b) => a - b)
                  .map((id, index) => (
                    <span key={index}>
                      {serviceIdToName[id] || `Dịch vụ không xác định (${id})`}
                      {index < orderData.serviceIds.length - 1 && ", "}
                    </span>
                  ))
              ) : (
                <span>Không có dịch vụ</span>
              )}
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
              <Button
                sx={{ ...buttonStyles }}
                variant="contained"
                onClick={() => setPopupOpen(true)}
              >
                Nhấn vào đây để xem vị trí đơn hàng
              </Button>
            </Box>

            {/* Order Detail Information */}
            <Box>
              <Typography
                variant="h6"
                sx={{ textDecoration: "underline" }}
                gutterBottom
              >
                Chi tiết đơn hàng:
              </Typography>

              {orderDetailData.length > 0 ? (
                <Grid container spacing={2}>
                  {orderDetailData.map((detail) => (
                    <Grid item xs={12} sm={6} md={4} key={detail.orderDetailId}>
                      <Card sx={{ height: "100%" }}>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Loại cá: {detail.koiType}
                          </Typography>
                          <Typography>Biến thể: {detail.koiName}</Typography>
                          <Typography>Số lượng: {detail.quantity}</Typography>
                          <Typography>Cân nặng: {detail.weight} kg</Typography>
                          <Typography>
                            Trạng thái PDF:
                            {detail.status === 0 ? (
                              <span
                                style={{ color: "red", fontWeight: "bold" }}
                              >
                                {" "}
                                Bị từ chối - Vui lòng cập nhật lại tài liệu
                              </span>
                            ) : (
                              <span> Bình thường</span>
                            )}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button
                            sx={{ ...pdfButtonStyles }}
                            size="small"
                            onClick={() =>
                              handlePDFClick(
                                detail.orderDetailId,
                                detail.status
                              )
                            }
                          >
                            PDF
                          </Button>
                        </CardActions>
                      </Card>
                      <PDFPreview
                        open={openPDF}
                        onClose={() => setOpenPDF(false)}
                        pdfUrl={pdfUrl}
                        orderDetailStatus={detail.status}
                        orderDetailId={detail.orderDetailId}
                      />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography>Không có đơn nào được tìm thấy.</Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid item xs={12}>
              {orderData.status === 7 && <FeedbackForm orderId={orderId} />}
            </Grid>
            <Grid item xs={12}>
              {orderData.status === 5 && orderData.payment === 1 && (
                <Button
                  variant="contained"
                  onClick={handleUpdateOrderStatus}
                  sx={{ mt: 2, ...buttonStyles }}
                >
                  Xác nhận nhận hàng
                </Button>
              )}
            </Grid>
          </Grid>
          {(orderData.status === 0 || orderData.status === 1) &&
            orderData.paymentStatus == false && (
              <Button
                startIcon={<HighlightOffIcon />}
                variant="contained"
                color="error"
                onClick={confirmCancelOrder} // Use confirmCancelOrder to open the dialog
                sx={{ mt: 5, mx: 80 }}
              >
                Hủy đơn
              </Button>
            )}

          {[1, 2, 3, 4, 5].includes(orderData.status) && orderData.paymentStatus === 2 && (
            <Button
              startIcon={<PaymentIcon />}
              sx={{ mt: 5, mx: 80 }}
              variant="contained"
              color="primary"
              onClick={handleProceedToPayment}
            >
              Thanh toán
            </Button>
          )}
        </Grid>
        <DeliveryStatusPopup
          open={isPopupOpen}
          onClose={() => setPopupOpen(false)}
          orderId={orderId}
        />
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
          <DialogContentText
            sx={{ textAlign: "center", fontSize: "16px", color: "#ffffff" }}
          >
            Bạn có chắc muốn hủy đơn này?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{ borderRadius: 2, px: 4, color: "#ffffff" }}
          >
            Không
          </Button>
          <Button
            onClick={handleConfirmCancel}
            variant="contained"
            color="error"
            sx={{ borderRadius: 3, px: 4 }}
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