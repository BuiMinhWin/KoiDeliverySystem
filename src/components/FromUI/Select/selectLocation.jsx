import React from "react";
import { useField, useFormikContext } from "formik";
import { MenuItem, TextField } from "@mui/material";

const SelectLocation = ({ name, options, onChange, label, ...otherProps }) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = (evt) => {
    const { value } = evt.target;
    console.log(`Selected value for ${name}: ${value}`);
    
    // Find the selected option's label
    const selectedOption = options.find(option => option.value === value);
    if (selectedOption) {
      const selectedLabel = selectedOption.label;
      console.log(`Selected label for ${name}: ${selectedLabel}`);
      
      // Set the label in Formik instead of the value
      setFieldValue(name, selectedLabel); // Save the label in Formik

      // Call the passed in onChange function with the label
      if (onChange) {
        console.log("SelectLocation onChange triggered:", selectedLabel);
        onChange(selectedLabel); // Call onChange with the label
      }
    } else {
      console.warn("Selected option not found.");
    }
  };

  const configSelect = {
    ...field,
    ...otherProps,
    select: true,
    variant: "outlined",
    fullWidth: true,
    onChange: handleChange,
  };

  // Handle errors
  if (meta.touched && meta.error) {
    configSelect.error = true;
    configSelect.helperText = meta.error;
  }

  return (
    <TextField {...configSelect}>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default SelectLocation;
