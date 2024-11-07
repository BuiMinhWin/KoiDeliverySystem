import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import { useState } from "react";


const PDFPreview = ({ pdfUrl, open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Xem trước PDF</DialogTitle>
      <DialogContent dividers>
        {pdfUrl ? (
          <iframe
            src={pdfUrl}
            width="100%"
            height="500px"
            style={{ border: "1px solid #ccc", borderRadius: 4 }}
            title="Xem trước PDF"
          />
        ) : (
          <Typography>PDF đang được tải...</Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PDFPreview;
