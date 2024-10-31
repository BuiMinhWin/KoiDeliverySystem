import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { getAccountById, getAvatar, updateAccount, updateAvatar } from "../../services/CustomerService";
import TextfieldWrapper from "../../components/FromUI/Textfield";
import { Box, Paper, Typography, Divider, Grid, Avatar, Button } from "@mui/material";
import ButtonWrapper from "../../components/FromUI/Button";
import { useSnackbar } from "notistack";

const INITIAL_FORM_STATE = {
  firstName: "",
  lastName: "",
  userName: "",
  email: "",
  phone: "",
};

const FORM_VALIDATION = Yup.object().shape({
  firstName: Yup.string().required("First name is required").max(50),
  lastName: Yup.string().required("Last name is required").max(50),
  userName: Yup.string()
    .required("Username is required")
    .max(30)
    .matches(/^[a-zA-Z0-9]+$/, "Username can only contain letters and numbers"),
  email: Yup.string().required("Email is required").email("Email is invalid"),
  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
});

const AccountForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [initialValues, setInitialValues] = useState(INITIAL_FORM_STATE);
  const [avatar, setAvatar] = useState(null); // Avatar preview URL
  const [newAvatar, setNewAvatar] = useState(null); // New avatar file
  const [loading, setLoading] = useState(true);
  const accountId = localStorage.getItem("accountId");

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const accountData = await getAccountById(accountId);
        setInitialValues({
          firstName: accountData.firstName,
          lastName: accountData.lastName,
          userName: accountData.userName,
          email: accountData.email,
          phone: accountData.phone,
        });

        const avatarUrl = await getAvatar(accountId);
        
        setAvatar(avatarUrl);
      } catch (error) {
        console.error("Error fetching account data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (accountId) fetchAccount();
  }, [accountId]);

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewAvatar(file);
      setAvatar(URL.createObjectURL(file));
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={FORM_VALIDATION}
      onSubmit={async (values, { setSubmitting, setErrors }) => {
        try {
          const accountUpdate = updateAccount(accountId, values);
          let avatarUpdate = Promise.resolve();

          if (newAvatar) {
            avatarUpdate = updateAvatar(accountId, newAvatar);
          }

          await Promise.all([accountUpdate, avatarUpdate]);

          enqueueSnackbar("Cập nhật tài khoản thành công", { variant: "success" });
        } catch (error) {
          enqueueSnackbar("Cập nhật tài khoản thất bại", { variant: "error" });
          console.error("Error updating account or avatar:", error);
          setErrors({ submit: error.message });
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ handleSubmit, isValid }) => (
        <Form onSubmit={handleSubmit}>
          <Box
            sx={{
              height: "auto", 
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: "#f5f5f5",
              overflow: "hidden", 
              p: 3, 
            
            }}
          >
            <Paper elevation={3} sx={{ width: "100%", maxWidth: "1200px", padding: "20px", overflow: "hidden"  }}>
              <Typography variant="h4" gutterBottom>
                Hồ sơ của tôi
              </Typography>
              <Typography variant="body1" gutterBottom>
                Quản lí thông tin hồ sơ để bảo mật tài khoản
              </Typography>

              <Divider sx={{ my: 2, backgroundColor: "#1976d2" }} />

              <Grid container spacing={2} justifyContent="center" alignItems="center">
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

                  <ButtonWrapper disabled={!isValid}>Cập nhật tài khoản</ButtonWrapper>
                </Grid>

                <Grid item xs={1} sx={{ display: "flex", justifyContent: "center" }}>
                  <Divider orientation="vertical" flexItem sx={{ backgroundColor: "#1976d2", height: "500px", width: "0.1px" }} />
                </Grid>

                <Grid item xs={3} container alignItems="center">
                  <Box justifyContent="center">
                    <Avatar
                      alt="User Avatar"
                      src={avatar}
                      sx={{ width: 250, height: 250, cursor: "pointer" }}
                      onClick={() => document.getElementById("avatarInput").click()}
                    />
                    <input
                      type="file"
                      id="avatarInput"
                      style={{ display: "none" }}
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                    <Typography variant="body2" sx={{ mt: 2, ml: 2 }}>
                      Nhấn vào ảnh đại diện để thay đổi
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default AccountForm;
