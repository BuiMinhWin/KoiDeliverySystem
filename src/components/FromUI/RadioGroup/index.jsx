import React, { useEffect, useCallback } from "react";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Divider,
} from "@mui/material";
import { useFormikContext } from "formik";

const RadioGroupWrapper = React.memo(({ service, serviceIds }) => {
  const { setFieldValue, values } = useFormikContext();

  // Memoized function to avoid re-creating the handleChange function on every render
  const handleChange = useCallback(
    (event) => {
      const selectedValue = event.target.value;

      if (selectedValue === "Yes") {
        setFieldValue("serviceIds", [...new Set([...serviceIds, service.id])]);
      } else {
        setFieldValue(
          "serviceIds",
          serviceIds.filter((id) => id !== service.id)
        );
      }
    },
    [service.id, serviceIds, setFieldValue]
  );

  // Set initial value to "Yes" only once on component mount
  useEffect(() => {
    if (!serviceIds.includes(service.id)) {
      setFieldValue("serviceIds", [...serviceIds, service.id]);
    }
    // Only run on mount by passing an empty dependency array
  }, []);

  return (
    <>
      <FormControl>
        <FormLabel component="legend" sx={{ color: "black" }}>
          {service.label}
        </FormLabel>
        <RadioGroup
          row
          value={serviceIds.includes(service.id) ? "Yes" : "No"}
          onChange={handleChange}
        >
          <FormControlLabel
            control={<Radio sx={{ color: "black" }} />}
            label="Yes"
            value="Yes"
            sx={{ color: "black" }}
          />
          <FormControlLabel
            control={<Radio sx={{ color: "black" }} />}
            label="No"
            value="No"
            sx={{ color: "black" }}
          />
        </RadioGroup>
      </FormControl>
      <Divider sx={{ backgroundColor: "black", margin: "10px 0" }} />
    </>
  );
});

export default RadioGroupWrapper;
