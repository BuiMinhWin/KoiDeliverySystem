import React from "react";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Grid,
  Typography,
  Box,
  Tooltip,
  Divider,
} from "@mui/material";
import { useFormikContext, useField } from "formik";
import { HelpOutline } from "@mui/icons-material";
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';

const CustomRadioGroup = ({ name, options, selectedCountry }) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = (event) => {
    setFieldValue(name, event.target.value);
  };

  // Check if "Nhật Bản" is selected
  const isJapanSelected = selectedCountry === "Nhật Bản";

  const filteredOptions = isJapanSelected
    ? [
        {
          value: "Vận chuyển nước ngoài",
          label: "Vận chuyển nước ngoài",
          description: "Vận chuyển hàng hóa từ Nhật Bản",
          icon: <AirplanemodeActiveIcon fontSize="large" />,
          helpText:
            "Phí vận chuyển ước tính sẽ bao gồm phụ phí và trừ đi các khoản chiến khấu/giảm giá bởi khuyến mãi.",
        },
      ]
    : options;

  return (
    <FormControl component="fieldset" fullWidth>
      <RadioGroup
        row
        name={name}
        value={field.value}
        onChange={handleChange}
        sx={{ justifyContent: "space-between" }}
      >
        {filteredOptions.map((option) => (
          <Grid
            key={option.value}
            item
            xs={5.5}
            sx={{
              border: "1px solid #ccc",
              borderRadius: 2,
              padding: 2,
              display: "flex",
              alignItems: "center",
              transition: "border-color 0.3s",
              ...(field.value === option.value && {
                borderColor: "#415A77",
                "& .MuiTypography-root": { color: "#171B36" }, // Change text color when selected
              }),
              "&:hover": {
                borderColor: "#171B36",
                "& .MuiTypography-root": { color: "#171B36" }, // Change text color on hover
              },
            }}
          >
            <FormControlLabel
              value={option.value}
              control={<Radio sx={{ mr: 2 }} />}
              label={
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        color: field.value === option.value ? "#171B36" : "black",
                      }}
                    >
                      {option.label}
                    </Typography>
                    <Tooltip title={option.helpText} arrow placement="top">
                      <HelpOutline
                        fontSize="small"
                        sx={{ ml: 1, cursor: "pointer", color: "black" }}
                      />
                    </Tooltip>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color:
                        field.value === option.value
                          ? "#171B36"
                          : "text.secondary", // Set color based on selection
                    }}
                  >
                    {option.description}
                  </Typography>
                </Box>
              }
              sx={{ flex: 1 }}
            />
            <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
            {option.icon && <Box>{option.icon}</Box>}
          </Grid>
        ))}
      </RadioGroup>
      {meta.touched && meta.error && (
        <Typography variant="body2" color="error">
          {meta.error}
        </Typography>
      )}
    </FormControl>
  );
};

export default CustomRadioGroup;
