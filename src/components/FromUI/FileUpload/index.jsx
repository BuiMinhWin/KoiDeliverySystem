import React from "react";
import { useField, useFormikContext } from "formik";
import { Box, Typography } from "@mui/material";
import { useDropzone } from "react-dropzone";

// Custom FileUpload component
const FileUpload = ({ name }) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];

      // Limit the file size to 8MB
      if (file.size > 8 * 1024 * 1024) {
        setFieldValue(name, ""); // Clear the value if too large
        return alert("File size must be less than 8MB");
      }

      setFieldValue(name, file); // Store the file in Formik's state
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
  });

  return (
    <Box
      {...getRootProps()}
      sx={{ border: "2px dashed #3f51b5", padding: 2, borderRadius: 1, textAlign: "center" }}
    >
      <input {...getInputProps()} />
      <Typography variant="body1" color="textSecondary">
        Drag 'n' drop your fish PDF document here, or click to select one
      </Typography>
      {field.value && (
        <Typography variant="body2" sx={{ marginTop: 1 }}>
          Selected file: {field.value.name}
        </Typography>
      )}
      {meta.touched && meta.error && (
        <Typography variant="body2" color="error">
          {meta.error}
        </Typography>
      )}
    </Box>
  );
};

export default FileUpload;

