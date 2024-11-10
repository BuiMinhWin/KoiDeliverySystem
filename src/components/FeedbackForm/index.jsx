import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Typography,
  TextField,
  Button,
  Rating,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  createFeedback,
  getFeedbackByOrderId,
} from "../../services/FeedBackService";
import { useSnackbar } from "notistack";

// Custom styled Rating component
const StyledRating = styled(Rating)(({ theme }) => ({
  "& .MuiRating-iconFilled": {
    color: "#FAB700",
    fontSize: "2rem",
  },
  "& .MuiRating-iconHover": {
    color: "#FAB700",
  },
  "& .MuiRating-iconEmpty": {
    color: "#FAB700",
    fontSize: "2rem",
  },
}));
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

const FeedbackForm = ({ orderId }) => {
  const [existingFeedback, setExistingFeedback] = useState(null);
  const [accountId, setAccountId] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchExistingFeedback = async () => {
      try {
        const feedback = await getFeedbackByOrderId(orderId);
       
        if (feedback && feedback.length > 0) {
          setExistingFeedback(feedback[0]);
          
        } else {
          setExistingFeedback(null);
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };

    fetchExistingFeedback();
  }, [orderId]);

  useEffect(() => {
    const id = localStorage.getItem("accountId");
    if (id) setAccountId(id);
  }, []);

  const formik = useFormik({
    initialValues: {
      rating: 0,
      comment: "",
    },
    validationSchema: Yup.object({
      rating: Yup.number()
        .required("Vui lòng để lại đánh giá của bạn.")
        .min(1, "Đánh giá thấp nhất là 1.")
        .max(5, "Maximum rating is 5."),
      comment: Yup.string()
        .nullable()
        .max(500, "Mỗi feedback chỉ được tối đa 500 kí tự"),
    }),
    onSubmit: async (values) => {
      try {
        await createFeedback({
          orderId,
          rating: values.rating,
          comment: values.comment,
          accountId: accountId,
        });
        enqueueSnackbar("Feedback được gửi thành công", { variant: "success" });
     
        const feedback = await getFeedbackByOrderId(orderId);
        if (feedback && feedback.length > 0) {
          setExistingFeedback(feedback[0]); 
        } else {
          setExistingFeedback(null); 
        }
        formik.resetForm();
      } catch (error) {
        console.error("Error submitting feedback:", error);
        enqueueSnackbar("Feedback gửi thất bại", { variant: "error" });
      }
    },
  });


  if (existingFeedback) {
    return (
      <Box
        sx={{
          p: 2,
          border: "1px solid #ddd",
          borderRadius: 1,
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h6" sx={{ textDecoration: "underline" }} gutterBottom>
          Feedback của bạn:
        </Typography>
        <StyledRating value={existingFeedback.rating} readOnly />
        <Typography>Bình luận: {existingFeedback.comment}</Typography>
        
        {/* Display responses if available */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Phản hồi:</Typography>
          
          {/* Ensure that responses exists before accessing its comment */}
          {existingFeedback.responses && existingFeedback.responses.comment ? (
            <Paper sx={{ p: 2, mb: 1 }}>
              <Typography>{existingFeedback.responses.comment}</Typography>
            </Paper>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Chưa có phản hồi.
            </Typography>
          )}
        </Box>
      </Box>
    );
  }

  // Render the feedback submission form
  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{
        p: 2,
        border: "1px solid #ddd",
        borderRadius: 1,
        backgroundColor: "#fff",
      }}
    >
      <Typography
        variant="h6"
        sx={{ textDecoration: "underline" }}
        gutterBottom
      >
        Feedback
      </Typography>
      <StyledRating
        name="rating"
        value={formik.values.rating}
        onChange={(event, newValue) => {
          formik.setFieldValue("rating", newValue);
        }}
      />
      {formik.touched.rating && formik.errors.rating && (
        <Typography color="error">{formik.errors.rating}</Typography>
      )}
      <TextField
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        margin="normal"
        label="Bình luận"
        name="comment"
        value={formik.values.comment}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched.comment && formik.errors.comment && (
        <Typography color="error">{formik.errors.comment}</Typography>
      )}
      <Button sx={{ ...buttonStyles }} variant="contained" type="submit">
        Gửi Feedback
      </Button>
    </Box>
  );
};

export default FeedbackForm;
