import React from "react";
import { useFormikContext } from "formik";
import { Button } from "@mui/material";
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

const ButtonWrapper = ({ children, ...otherProps }) => {
  const { submitForm, isSubmitting, isValid } = useFormikContext();

  const handleSubmit = () => {
    submitForm();
  };

  const configButton = {
    variant: "contained",
    color: "primary",
    fullWidth: true,
    onClick: handleSubmit,
    disabled: !isValid || isSubmitting, // Disable if invalid or submitting
    ...otherProps, // Spread other props
  };

  return (
    <Button sx={{ ...buttonStyles }} {...configButton}>
      {isSubmitting ? "Submitting..." : children}
    </Button>
  );
};

export default ButtonWrapper;
