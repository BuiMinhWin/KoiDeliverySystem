import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FileUpload from "../FromUI/FileUpload";
import { useSnackbar } from "notistack";
import {
  updateDocument,
  updateOrderDetailStatus,
} from "../../services/CustomerService";

const buttonStyles = {
  backgroundColor: "#3e404e",
  color: "white",
  "&:hover": { backgroundColor: "#727376" },
  padding: "8px 16px",
  borderRadius: "8px",
  minWidth: "auto",
  justifyContent: "center",
};

const PDFPreview = ({
  pdfUrl,
  open,
  onClose,
  orderDetailStatus,
  orderDetailId,
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const validationSchema = Yup.object({
    document_file: Yup.mixed()
      .required("A file is required")
      .test(
        "fileSize",
        "File cần phải nhỏ hơn 8MB",
        (value) => value && value.size <= 8 * 1024 * 1024
      )
      .test(
        "fileFormat",
        "Chỉ chấp nhận định dạng file PDF",
        (value) => value && value.type === "application/pdf"
      ),
  });

  const handleSubmit = async (values) => {
    console.log("Reupload PDF file:", values.document_file);

    const formData = new FormData();
    formData.append("document_file", values.document_file);

    try {
      const response = await updateDocument(orderDetailId, formData);
      console.log("Document reupload successful:", response);

      await updateOrderDetailStatus(orderDetailId, 2);
      console.log("Order status updated to 2");

      enqueueSnackbar("Cập nhật lại tài liệu thành công.", {
        variant: "success",
      });
      onClose(); 
      window.location.reload();
    } catch (error) {
      console.error("Failed to reupload document:", error.message);
      enqueueSnackbar("Cập nhật lại tài liệu thất bại. Vui lòng thử lại.", {
        variant: "error",
      });
    }
  };

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
      {orderDetailStatus === 0 && (
        <Formik
          initialValues={{ document_file: null }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, errors, touched }) => (
            <Form>
              <DialogActions>
                <Grid container>
                  <Grid item xs={12}>
                    <FileUpload
                      name="document_file"
                      onChange={(event) =>
                        setFieldValue(
                          "document_file",
                          event.currentTarget.files[0]
                        )
                      }
                      error={
                        touched.document_file && Boolean(errors.document_file)
                      }
                      helpertext={touched.document_file && errors.document_file}
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ textAlign: "center", mt: 2 }}>
                    <Button type="submit" variant="contained" sx={buttonStyles}>
                      Lưu thay đổi
                    </Button>
                  </Grid>
                </Grid>
              </DialogActions>
            </Form>
          )}
        </Formik>
      )}
    </Dialog>
  );
};

export default PDFPreview;
