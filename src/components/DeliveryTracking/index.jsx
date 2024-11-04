import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Typography,
} from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@mui/lab";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { getDeliveryStatusByOrderId } from "../../services/CustomerService";

const DeliveryStatusPopup = ({ open, onClose, orderId }) => {
  const [deliveryStatus, setDeliveryStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeliveryStatus = async () => {
      try {
        const data = await getDeliveryStatusByOrderId(orderId);
        setDeliveryStatus(data);
      } catch (error) {
        console.error("Failed to fetch delivery status:", error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchDeliveryStatus();
  }, [orderId]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Vị trí đơn hàng</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <CircularProgress />
        ) : deliveryStatus.length === 0 ? (
          <Typography>Vị trí đơn hàng vẫn chưa được cập nhật.</Typography>
        ) : (
          <Timeline>
            {deliveryStatus.map((status, index) => (
              <TimelineItem key={index}>
                <TimelineOppositeContent
                  color="textSecondary"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "end",
                  }}
                >
                  {new Date(status.timeTracking).toLocaleString()}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot
                    sx={{
                      bgcolor: "#171B36",
                      display: "flex",
                      alignItems: "center",
                      justifyContent:"center"
                    }}
                  >
                    <LocalShippingIcon sx={{ color: "#FFFFFF" }} />
                  </TimelineDot>
                  {index < deliveryStatus.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography variant="h6">{status.currentLocate}</Typography>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryStatusPopup;
