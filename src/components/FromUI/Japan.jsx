import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import FlightIcon from "@mui/icons-material/Flight";
import { useNavigate } from "react-router-dom";

// Define the common button style
const buttonStyle = {
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  cursor: "pointer",
  p: 3,
  borderRadius: 1,
  "&:hover": { bgcolor: "#f0f0f0" },
  border: "2px solid #ccc",
  fontSize: "1.2rem",
};
function JapanDialog({ open, onClose }) {
  const navigate = useNavigate();

  const handleSelection = (japan) => {
    navigate("/form", { state: { japan } });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: 600, textAlign: "center" }}>
          Chọn Nơi Vận Chuyển
        </Typography>
      </DialogTitle>
      <Box sx={{ display: "flex", justifyContent: "space-around", p: 3 }}>
        <Box sx={buttonStyle} onClick={() => handleSelection("Trong nước")}>
          <LocalShippingIcon sx={{ fontSize: 50, mb: 1 }} />{" "}
          <Typography>Trong nước</Typography>
        </Box>
        <Box sx={buttonStyle} onClick={() => handleSelection("Nhật Bản")}>
          <FlightIcon sx={{ fontSize: 50, mb: 1 }} />{" "}
          <Typography>Nhật Bản</Typography>
        </Box>
      </Box>
    </Dialog>
  );
}

export default JapanDialog;
