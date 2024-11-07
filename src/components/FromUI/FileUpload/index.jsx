import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Typography } from "@mui/material";
import { useFormikContext, useField } from "formik";

const FileUpload = ({ name, ...otherProps }) => {
  const { setFieldValue } = useFormikContext(); // Get Formik's setFieldValue function
  const [field, meta] = useField(name); // Get field and meta info from Formik

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFieldValue(name, acceptedFiles[0]); // Set the first accepted file
      }
    },
    [setFieldValue, name]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "application/pdf",
    onDrop,
  });

  const errorText = meta.touched && meta.error ? meta.error : "";

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: "2px dashed #1976d2",
        padding: "20px",
        textAlign: "center",
        cursor: "pointer",
      }}
    >
      <input {...getInputProps()} {...otherProps} />
      {isDragActive ? (
        <Typography>Drop the file here...</Typography>
      ) : (
        <Typography>Kéo và Thả file cần Upload</Typography>
      )}
      {field.value && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          Uploaded file: {field.value.name}
        </Typography>
      )}
      {errorText && <Typography color="error">{errorText}</Typography>}
    </Box>
  );
};

export default FileUpload;
