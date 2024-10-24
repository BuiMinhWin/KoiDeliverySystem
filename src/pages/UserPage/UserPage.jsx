import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { getAccountById, updateAccount } from "../../services/CustomerService";
import TextfieldWrapper from "../../components/FromUI/Textfield";
import { Box, Paper, Typography, Divider, Grid, Avatar } from "@mui/material";
import ButtonWrapper from "../../components/FromUI/Button";

const INITIAL_FORM_STATE = {
  firstName: "",
  lastName: "",
  userName: "",
  email: "",
  phone: "",
};

const FORM_VALIDATION = Yup.object().shape({
  firstName: Yup.string()
    .required("First name is required")
    .max(50, "First name must be at most 50 characters long"),
  lastName: Yup.string()
    .required("Last name is required")
    .max(50, "Last name must be at most 50 characters long"),
  userName: Yup.string()
    .required("Username is required")
    .max(30, "Username must be at most 30 characters long")
    .matches(/^[a-zA-Z0-9]+$/, "Username can only contain letters and numbers"),
  email: Yup.string().required("Email is required").email("Email is invalid"),
  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
});

const AccountForm = () => {
  const [initialValues, setInitialValues] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(true);
  const accountId = localStorage.getItem("accountId");

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        console.log("Fetching account details for accountId:", accountId);
        const accountData = await getAccountById(accountId);
        console.log("Fetched account data:", accountData);
        setInitialValues({
          firstName: accountData.firstName,
          lastName: accountData.lastName,
          userName: accountData.userName,
          email: accountData.email,
          phone: accountData.phone,
        });
      } catch (error) {
        console.error("Error fetching account data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (accountId) fetchAccount();
  }, [accountId]);

  // Don't render the form until data is ready
  if (loading) return <div>Loading...</div>;

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      validationSchema={FORM_VALIDATION}
      onSubmit={async (values, { setSubmitting, setErrors }) => {
        console.log("Form values before submission:", values); // Debugging log

        try {
          console.log("Updating account with accountId:", accountId); // Debugging log
          await updateAccount(accountId, values); // Call the update API
          console.log("Account updated successfully with values:", values); // Success log
        } catch (error) {
          console.error("Error updating account:", error);
          setErrors({ submit: error.message });
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ handleSubmit, isValid, errors, values }) => {
        console.log("Current form values:", values); // Debugging log for form values
        console.log("Validation errors:", errors); // Debugging log for validation errors
        return (
          <Form onSubmit={handleSubmit}>
            {console.log("Current form values:", values)}

            <Box
              sx={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "#f5f5f5",
              }}
            >
              <Paper
                elevation={3}
                sx={{
                  width: "100%",
                  maxWidth: "1200px",
                  padding: "20px",
                }}
              >
                <Typography variant="h4" gutterBottom>
                  Hồ sơ của tôi
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Quản lí thông tin hồ sơ để bảo mật tài khoản
                </Typography>

                <Divider sx={{ my: 2, backgroundColor: "#1976d2" }} />

                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextfieldWrapper name="firstName" label="First Name" />
                      </Grid>
                      <Grid item xs={12}>
                        <TextfieldWrapper name="lastName" label="Last Name" />
                      </Grid>
                      <Grid item xs={12}>
                        <TextfieldWrapper name="userName" label="User Name" />
                      </Grid>
                      <Grid item xs={12}>
                        <TextfieldWrapper name="email" label="Email" />
                      </Grid>
                      <Grid item xs={12}>
                        <TextfieldWrapper name="phone" label="Phone" />
                      </Grid>
                    </Grid>

                    <ButtonWrapper disabled={!isValid}>
                      Cập nhật tài khoản
                    </ButtonWrapper>
                  </Grid>

                  <Grid item>
                    <Divider
                      orientation="vertical"
                      flexItem
                      sx={{ backgroundColor: "#1976d2", height: "100%" }}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={3}
                    container
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Avatar
                      alt="User Avatar"
                      src={initialValues.avatar || ""}
                      sx={{ width: 250, height: 250 }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AccountForm;
