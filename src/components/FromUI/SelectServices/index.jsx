import React, { useEffect, useState } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  Chip,
  Box,
} from "@mui/material";
import { fetchServices } from "../../../services/CustomerService";

const ServiceSelect = ({ value, onChange }) => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const loadServices = async () => {
      const data = await fetchServices();
      const onlineServices = data.filter(
        (service) => service.servicesStatus === "online"
      );
      setServices(onlineServices);
    };

    loadServices();
  }, []);

  return (
    <FormControl fullWidth>
      <InputLabel id="service-select-label">Choose Services</InputLabel>
      <Select
        labelId="service-select-label"
        multiple
        value={value} // Controlled by Formik
        onChange={onChange} // Controlled by Formik
        input={
          <OutlinedInput id="select-multiple-chip" label="Choose Services" />
        }
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((serviceId) => {
              const service = services.find((s) => s.servicesId === serviceId);
              return service ? (
                <Chip
                  key={serviceId}
                  label={`${service.servicesName} - ${service.price} VND`}
                />
              ) : null;
            })}
          </Box>
        )}
      >
        {services.map((service) => (
          <MenuItem key={service.servicesId} value={service.servicesId}>
            {service.servicesName} - {service.price} VND
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ServiceSelect;
