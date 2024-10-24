import React from "react";
import { useFormikContext } from "formik";
import { Button } from "@mui/material";

const ButtonWrapper = ({ children , ...otherProps }) => {
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
    <Button {...configButton}>
      {isSubmitting ? "Submitting..." : children}
    </Button>
  );
};

export default ButtonWrapper;
