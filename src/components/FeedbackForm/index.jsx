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
    color: "#ff6d75",
    fontSize: "2rem",
  },
  "& .MuiRating-iconHover": {
    color: "#ff3d47",
  },
  "& .MuiRating-iconEmpty": {
    color: "#ff6d75",
    fontSize: "2rem",
  },
}));

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
        .required("Please provide a rating.")
        .min(1, "Minimum rating is 1.")
        .max(5, "Maximum rating is 5."),
      comment: Yup.string().required("Comment is required."),
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
        // After submission, fetch existing feedback again to update state
        const feedback = await getFeedbackByOrderId(orderId);
        if (feedback && feedback.length > 0) {
          setExistingFeedback(feedback[0]); // Update with the new feedback
        } else {
          setExistingFeedback(null); // No feedback available
        }
        formik.resetForm();
      } catch (error) {
        console.error("Error submitting feedback:", error);
        enqueueSnackbar("Feedback gửi thất bại", { variant: "error" });
      }
    },
  });

  // Render existing feedback if available
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
        <Typography
          variant="h6"
          sx={{ textDecoration: "underline" }}
          gutterBottom
        >
          Feedback của bạn:
        </Typography>
        <StyledRating value={existingFeedback.rating} readOnly />
        <Typography>Comment: {existingFeedback.comment}</Typography>
        {/* Display responses if available */}
        {existingFeedback.responses &&
          existingFeedback.responses.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Responses:</Typography>
              {existingFeedback.responses.map((response) => (
                <Paper key={response.feedbackId} sx={{ p: 2, mb: 1 }}>
                  <Typography>Response: {response.comment}</Typography>
                </Paper>
              ))}
            </Box>
          )}
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
        Submit Feedback
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
        label="Comment"
        name="comment"
        value={formik.values.comment}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched.comment && formik.errors.comment && (
        <Typography color="error">{formik.errors.comment}</Typography>
      )}
      <Button variant="contained" color="primary" type="submit">
        Submit Feedback
      </Button>
    </Box>
  );
};

export default FeedbackForm;