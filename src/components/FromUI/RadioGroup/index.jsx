import React from "react";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useField, useFormikContext } from "formik";

const RadioGroupWrapper = ({
  name,
  label,
  legend,
  defaultValue,
  options,
  ...otherProps
}) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = (evt) => {
    setFieldValue(name, evt.target.value);
  };

  const configFormControl = {};
  if (meta && meta.touched && meta.error) {
    configFormControl.error = true;
  }

  return (
    <FormControl {...configFormControl}>
      <FormLabel component="legend">{legend}</FormLabel>
      <RadioGroup
        {...field}
        onChange={handleChange}
        row // Optional: Display radios in a row
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={option.label}
            sx={{ color: "black" }} // Set label color to black
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default RadioGroupWrapper;
