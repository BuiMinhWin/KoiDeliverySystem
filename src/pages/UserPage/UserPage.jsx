  import React, { useEffect, useState } from "react";
  import { Box, Grid, Paper, Typography } from "@mui/material";
  import { Formik, Form } from "formik";
  import * as Yup from "yup";
  import TextFieldWrapper from "../../components/FromUI/Textfield";
  import ButtonWrapper from "../../components/FromUI/Button";
  import { getAccountById, updateAccount } from "../../services/CustomerService";
  import SelectWrapper from "../../components/FromUI/Select";
  import { FaLongArrowAltLeft } from "react-icons/fa";
  import { useNavigate } from 'react-router-dom';

  
  const INITIAL_FORM_STATE = {
    firstName: "",
    lastName: "",
    userName: "",
    password: "",
    email: "",
    phone: "",
    avatar: "",
    roleId: "",
  };

  const FORM_VALIDATION = Yup.object().shape({
    firstName: Yup.string().required("Vui lòng nhập tên"),
    lastName: Yup.string().required("Vui lòng nhập họ"),
    userName: Yup.string().required("Vui lòng nhập tên người dùng"),
    password: Yup.string().required("Vui lòng nhập mật khẩu"),
    email: Yup.string()
      .email("Email không hợp lệ")
      .required("Vui lòng nhập email"),
    phone: Yup.string()
      .matches(/^[0-9]+$/, "Số điện thoại phải là số")
      .required("Vui lòng nhập số điện thoại"),
    roleId: Yup.string().required("Vui lòng chọn vai trò người dùng"),
  });

  const AccountForm = () => {
    const [initialValues, setInitialValues] = useState(INITIAL_FORM_STATE);
    const accountId = localStorage.getItem("accountId"); // Get accountId from localStorage

    useEffect(() => {
      const fetchAccount = async () => {
        try {
          console.log("Fetching account details for accountId:", accountId); // Debug log
          const accountData = await getAccountById(accountId);
          console.log("Account data fetched:", accountData); // Debug log

          setInitialValues({
            firstName: accountData.firstName,
            lastName: accountData.lastName,
            userName: accountData.userName,
            password: accountData.password,
            email: accountData.email,
            phone: accountData.phone,
            avatar: accountData.avatar,
            roleId:accountData.roleId,
          });
        } catch (error) {
          console.error("Error fetching account:", error);
        }
      };

      fetchAccount();
    }, [accountId]);
    const navigate = useNavigate();
    const roleId = localStorage.getItem('roleId'); 
    return (
      <Formik
        initialValues={initialValues}
        enableReinitialize={true} // Ensures the form reinitializes when initialValues change
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
            
              {/* <Box
                sx={{ display: "flex", flexDirection: "column", height: "100vh" }}
                component={"body"}
              > */}
              <Box
                sx={{ display: "flex", flexDirection: "column", height: "100vh" }}
              >
                
                {
                  (roleId === 'Manager') ? (
                    <button
                      onClick={() => navigate('/manager')}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        position: 'absolute',
                        top: '10px',
                        left: '25px', // Đẩy nút vào trong bằng cách chỉnh left
                        padding: '5px',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <FaLongArrowAltLeft size={16} color="black" />
                      <span style={{ marginLeft: '5px' }}></span>
                    </button>
                  ) : roleId === 'Delivery' ? (
                    <button
                      onClick={() => navigate('/delivery')}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        position: 'absolute',
                        top: '10px',
                        left: '25px', // Đẩy nút vào trong bằng cách chỉnh left
                        padding: '5px',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <FaLongArrowAltLeft size={16} color="black" />
                      <span style={{ marginLeft: '5px' }}></span>
                    </button>
                  ) : roleId === 'Sales' ? (
                    <button
                      onClick={() => navigate('/sales')}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        position: 'absolute',
                        top: '10px',
                        left: '25px', // Đẩy nút vào trong bằng cách chỉnh left
                        padding: '5px',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <FaLongArrowAltLeft size={16} color="black" />
                      <span style={{ marginLeft: '5px' }}></span>
                    </button>
                  ) : null
                }
                
                 {/* <button
                  type="button"
                  onClick={() => navigate('/manager')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                <FaLongArrowAltLeft size={24} />
                back
                </button> */}
                
                <Box sx={{ flex: 1, p: 3 }}>
                  <Paper elevation={4} sx={{ padding: "20px" }}>
                  
                    <Typography variant="h6" gutterBottom>
                      Cập nhật thông tin tài khoản
                    </Typography>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={6}>
                        <TextFieldWrapper name="firstName" label="Tên" />
                      </Grid>
                      <Grid item xs={6}>
                        <TextFieldWrapper name="lastName" label="Họ" />
                      </Grid>
                      <Grid item xs={6}>
                        <TextFieldWrapper
                          name="userName"
                          label="Tên người dùng"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextFieldWrapper name="password" label="Mật khẩu" />
                      </Grid>
                      <Grid item xs={6}>
                        <TextFieldWrapper name="email" label="Email" />
                      </Grid>
                      <Grid item xs={6}>
                        <TextFieldWrapper name="phone" label="Số điện thoại" />
                      </Grid>
                      <Grid item xs={6}>
                        <TextFieldWrapper name="avatar" label="Avatar URL" />
                      </Grid>
                    </Grid>
                    <ButtonWrapper disabled={!isValid}>
                      Cập nhật tài khoản
                    </ButtonWrapper>
                  </Paper>
                </Box>
              </Box>
            </Form>
          );
        }}
      </Formik>
    );
  };

  export default AccountForm;
