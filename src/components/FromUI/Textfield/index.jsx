import React from 'react';
import { useField } from 'formik';
import { TextField } from '@mui/material'; // Correct component for a form text field

const TextfieldWrapper = ({
  name,
  ...otherProps
}) => {
  const [field, meta] = useField(name); // Fixed 'mata' to 'meta'

  const configTextfield = {
    ...field,
    ...otherProps,
    fullWidth: true,
    variant: 'outlined'
  };

  if (meta && meta.touched && meta.error) {
    configTextfield.error = true;
    configTextfield.helperText = meta.error;
  }

  return (
    <TextField {...configTextfield} /> // Correct component usage
  );
};

export default TextfieldWrapper;
