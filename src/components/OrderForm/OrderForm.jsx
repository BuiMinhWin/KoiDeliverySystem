import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  InputAdornment,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextFieldWrapper from "../FromUI/Textfield";
import SelectWrapper from "../FromUI/Select";
// import countries from "../../data/countries.json";
import ButtonWrapper from "../FromUI/Button";
import koi_type from "../../data/koiTypes.json";
import koi_name from "../../data/koiVarieties.json";
import {
  createOrder,
  order,
  uploadDocument,
  updateServiceStatus,
  getServiceStatus,
} from "../../services/CustomerService";
import { createOrderDetail } from "../../services/CustomerService";
// import SideBar from "../SideBar/SideBar";
// import HeaderBar from "../Header/Header/Nguyen";
import RadioGroupWrapper from "../FromUI/RadioGroup";
import CustomRadioGroup from "../FromUI/CustomRadioGroup";
import RocketIcon from '@mui/icons-material/Rocket';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import FileUpload from "../FromUI/FileUpload";
import CheckboxWrapper from "../FromUI/Checkbox";
import { useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";

// Initial Form State
const INITIAL_FORM_STATE = {
  origin: "",
  cityS: "",
  cityR: "",
  districtS: "",
  districtR: "",
  wardS: "",
  wardR: "",
  destination: "",
  distance: "",
  receiverName: "",
  senderName: "",
  receiverAddress: "",
  senderAddress: "",
  receiverPhone: "",
  senderPhone: "",
  receiverNote: "",
  senderNote: "",
  orderNote: "",
  document_file: null,
  discount: "",
  koi_image: "",
  koi_name: "",
  koi_type: "",
  quantity: 0,
  weight: 0.0,
  freight: "",
  additional_service: "Yes",
  additional_service_1: "Yes",
  additional_service_2: "Yes",
};

// Validation Schema with Yup
const FORM_VALIDATION = Yup.object().shape({
  origin: Yup.string().required("Vui lòng nhập địa điểm xuất phát"),
  destination: Yup.string().required("Vui lòng nhập địa điểm đến"),
  receiverName: Yup.string().required("Vui lòng nhập tên người nhận"),
  senderName: Yup.string().required("Vui lòng nhập tên người gửi"),
  receiverPhone: Yup.string()
  .required("Vui lòng nhập số điện thoại người nhận")
  .matches(/^[0-9]{10}$/, "Số điện thoại phải là số và có 10 số"),
  senderPhone: Yup.string()
  .required("Vui lòng nhập số điện thoại người gửi")
  .matches(/^[0-9]{10}$/, "Số điện thoại phải là số và có 10 số"),
  receiverNote: Yup.string().nullable(),
  senderNote: Yup.string().nullable(),
  orderNote: Yup.string().nullable(), // Optional field for additional notes
  discount: Yup.string().nullable(),
  cityS: Yup.string().required("Vui lòng chọn thành phố"), //
  cityR: Yup.string().required("Vui lòng chọn thành phố"), //
  koi_name: Yup.string().required("Vui lòng nhập tên cá Koi"), //
  koi_type: Yup.string().required("Vui lòng nhập loại cá Koi"), //
  quantity: Yup.number()
    .min(1, "Số lượng phải lớn hơn 0")
    .required("Vui lòng nhập số lượng"),
  weight: Yup.number()
    .min(0.1, "Cân nặng phải lớn hơn 0")
    .required("Vui lòng nhập cân nặng"),
  freight: Yup.string().required("Vui lòng chọn phương thức vận chuyển"),
  additional_service: Yup.string().nullable(),
  additional_service_1: Yup.string().nullable(),
  additional_service_2: Yup.string().nullable(),
  termsOfService: Yup.boolean()
    .oneOf([true], "The terms and conditions must be accepted.")
    .required("The terms and conditions must be accepted."),
  document_file: Yup.mixed()
    .required("A file is required")
    .test(
      "fileSize",
      "File size must be less than 8MB",
      (value) => value && value.size <= 8 * 1024 * 1024
    )
    .test(
      "fileFormat",
      "Only PDF file are allowed",
      (value) => value && value.type === "application/pdf"
    ),
});

const OrderForm = () => {
  const { testaccId, accountData } = useOutletContext();
  console.log("accId: ", testaccId, "accData: ", "accountData: ", accountData);

  const navigate = useNavigate();
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]); // State để lưu danh sách quận
  const [wards, setWards] = useState([]); // State để lưu danh sách phường

  // người gửi
  const [selectedProvinceS, setSelectedProvinceS] = useState("");
  const [selectedDistrictSId, setSelectedDistrictSId] = useState("");
  const [selectedWardSId, setSelectedSWard] = useState("");

  // người nhận
  const [selectedProvinceR, setSelectedProvinceR] = useState("");
  const [selectedDistrictRId, setSelectedDistrictRId] = useState("");
  const [selectedWardRId, setSelectedRWard] = useState("");

  // const [distanceData, setDistanceData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const API_KEY = import.meta.env.VITE_GOONG_API_KEY; // Thay bằng API Key của bạn

  const geocodeAddress = async (address) => {
    console.log("địa chỉ để tính", address);
    try {
      const response = await axios.get(
        `https://rsapi.goong.io/geocode?address=${encodeURIComponent(
          address
        )}&api_key=${API_KEY}`
      );
      const data = response.data;

      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        return { lat: location.lat, lng: location.lng };
      } else {
        throw new Error("No results found for the address.");
      }
    } catch (error) {
      console.error("Error fetching geocode:", error);
      throw new Error("Failed to fetch geocode.");
    }
  };

  const GHN_API_KEY = import.meta.env.VITE_GHN_API_KEY;

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch(
          "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Token: GHN_API_KEY,
            },
          }
        );
        const data = await response.json();
        console.log(data);
        if (data && data.data) {
          const provinceOptions = data.data.map((province) => ({
            label: province.ProvinceName,
            value: province.ProvinceID,
          }));

          setProvinces(provinceOptions);
        } else {
          console.log("No data found");
        }
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };

    fetchProvinces();
  }, []);

  const fetchDistricts = async (provinceId) => {
    try {
      const response = await fetch(
        `https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${provinceId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Token: GHN_API_KEY,
          },
        }
      );
      const data = await response.json();
      console.log("District data:", data);
      if (data && data.data) {
        const districtOptions = data.data.map((district) => ({
          label: district.DistrictName,
          value: district.DistrictID,
        }));
        setDistricts(districtOptions);
      }
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const fetchWards = async (districtId) => {
    try {
      const response = await fetch(
        `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtId}`,
        {
          method: "GET",
          headers: {
            Token: GHN_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log("Ward data:", data);
      if (data && data.data) {
        const wardOptions = data.data.map((ward) => ({
          label: ward.WardName,
          value: ward.WardCode,
        }));
        setWards(wardOptions);
      }
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  const fetchDistanceData = async (origins, destinations) => {
    try {
      console.log(origins);
      console.log(destinations);
      const response = await axios.get(
        `https://rsapi.goong.io/distancematrix?origins=${origins}&destinations=${destinations}&vehicle=car&api_key=${API_KEY}`
      );

      const data = response.data;
      if (
        data?.rows &&
        data.rows.length > 0 &&
        data.rows[0]?.elements[0]?.distance
      ) {
        const distanceInKm = data.rows[0].elements[0].distance.value / 1000;
        return distanceInKm;
      } else {
        throw new Error("Invalid distance data");
      }
    } catch (error) {
      console.error("Error fetching distance matrix:", error);
      setErrorMessage("Có lỗi xảy ra khi lấy dữ liệu.");
      return null;
    }
  };

  return (
    <Formik
      initialValues={{
        ...INITIAL_FORM_STATE,
        cityS: selectedProvinceS,
        cityR: selectedProvinceR,
      }}
      validationSchema={FORM_VALIDATION}
      onSubmit={async (values, { setSubmitting, setErrors }) => {
        try {
          const accountId = localStorage.getItem("accountId");

          const originCoordinates = await geocodeAddress(
            `${values.origin}, ${values.wardS}, ${values.districtS} ,${values.cityS}`
          );
          const destinationCoordinates = await geocodeAddress(
            `${values.destination}, ${values.wardR}, ${values.districtR} ,${values.cityR}`
          );

          const origins = `${originCoordinates.lat},${originCoordinates.lng}`;
          const destinations = `${destinationCoordinates.lat},${destinationCoordinates.lng}`;

          const distance = await fetchDistanceData(origins, destinations);
          console.log("Khoảng cách tính được: ", distance);

          const orderData = {
            ...values,
            accountId,
            origin: `${values.origin}, ${values.wardS}, ${values.districtS} ,${values.cityS}`,
            destination: `${values.destination}, ${values.wardR}, ${values.districtR} ,${values.cityR}`,
            freight: values.freight,
            receiverName: values.receiverName,
            senderName: values.senderName,
            receiverPhone: values.receiverPhone,
            senderPhone: values.senderPhone,
            receiverNote: values.receiverNote,
            senderNote: values.senderNote,
            orderNote: values.orderNote,
            distance: distance,
          };

          const orderResponse = await createOrder(orderData);
          console.log("Order data created successfully:", orderResponse);

          if (!orderResponse?.orderId) {
            throw new Error("Order ID not found in the response");
          }

          const newOrderId = orderResponse.orderId;
          console.log("Order created with ID:", newOrderId);

          const uploadResponse = await uploadDocument(
            values.document_file,
            newOrderId
          );
          console.log("File uploaded successfully:", uploadResponse);

          const orderDetails = await order(newOrderId);
          console.log("Order Details:", orderDetails);

          const orderDetailData = {
            orderId: newOrderId,
            quantity: Number(values.quantity),
            weight: parseFloat(values.weight),
            discount: values.discount,
            koiName: values.koi_name,
            koiType: values.koi_type,
          };
          const orderDetailResponse = await createOrderDetail(orderDetailData);
          console.log(
            "Order detail created successfully:",
            orderDetailResponse
          );

          console.log("Order created successfully with ID:", newOrderId);

          const orderDetailId = orderDetailResponse.orderDetailId; //getting the orderDetailId for newly created order

          try {
            const orderServiceData = await getServiceStatus(orderDetailId);
            console.log(
              "Service for order detail Id: ",
              orderDetailId,
              "data: ",
              orderServiceData
            );
          } catch (error) {
            console.error("Failed to get service status:", error);
          }

          console.log("order detail Id get for status", orderDetailId);
          const services = [
            {
              serviceId: 1,
              serviceStatus: values.additional_service === "Yes" ? "Yes" : "No",
            },
            {
              serviceId: 2,
              serviceStatus:
                values.additional_service_1 === "Yes" ? "Yes" : "No",
            },
            {
              serviceId: 3,
              serviceStatus:
                values.additional_service_2 === "Yes" ? "Yes" : "No",
            },
          ];
          console.log("Current values:", values);

          for (const service of services) {
            console.log(
              `Updating service ${service.serviceId} with status: ${service.serviceStatus}`
            );
            try {
              console.log("Calling updateServiceStatus with parameters:", {
                orderDetailId,
                serviceId: service.serviceId,
                serviceStatus: service.serviceStatus,
              });
              const updatedResponse = await updateServiceStatus(
                orderDetailId,
                service.serviceId,
                service.serviceStatus
              );
              console.log(
                `Service ${service.serviceId} updated successfully:`,
                updatedResponse
              );
            } catch (error) {
              console.error(
                `Failed to update service ${service.serviceId}:`,
                error
              );
            }
          }

          navigate("/checkout", { state: { orderId: newOrderId } });
        } catch (error) {
          alert("Upload failed, please try again");
          console.error("Error creating order:", error);
          setErrors({ submit: error.message });
        } finally {
          setSubmitting(false);
        }
      }}
      validateOnMount={true}
    >
      {({ handleSubmit, errors, setFieldValue }) => {
        console.log("Validation errors:", errors); // Log validation errors
        const handleSenderProvinceChange = (event) => {
          const selectedProvince = provinces.find(
            (province) => province.value === event.target.value
          );
          if (selectedProvince) {
            setSelectedProvinceS(selectedProvince.value); // Save the value for state
            setFieldValue("cityS", selectedProvince.label); // Save the label for the form
            console.log("Selected Province ID:", selectedProvince.value);
            fetchDistricts(selectedProvince.value);
          }
        };

        const handleReceiverProvinceChange = (event) => {
          const selectedProvince = provinces.find(
            (province) => province.value === event.target.value
          );
          if (selectedProvince) {
            setSelectedProvinceR(selectedProvince.value);
            setFieldValue("cityR", selectedProvince.label);
            console.log("Selected Province ID:", selectedProvince.value);
            fetchDistricts(selectedProvince.value);
          }
        };

        const handleSenderDistrictChange = (event) => {
          const selectedDistrict = districts.find(
            (district) => district.value === event.target.value
          );
          if (selectedDistrict) {
            setSelectedDistrictSId(selectedDistrict.value);
            setFieldValue("districtS", selectedDistrict.label); // Save the label for the form
            console.log("Selected District ID:", selectedDistrict.value);
            fetchWards(selectedDistrict.value);
          }
        };

        const handleReceiverDistrictChange = (event) => {
          const selectedDistrict = districts.find(
            (district) => district.value === event.target.value
          );
          if (selectedDistrict) {
            setSelectedDistrictRId(selectedDistrict.value);
            setFieldValue("districtR", selectedDistrict.label); // Save the label for the form
            console.log("Selected District ID:", selectedDistrict.value);
            fetchWards(selectedDistrict.value);
          }
        };

        const handleSenderWardChange = (event) => {
          const selectedWard = wards.find(
            (ward) => ward.value === event.target.value
          );
          if (selectedWard) {
            setSelectedSWard(selectedWard.value);
            setFieldValue("wardS", selectedWard.label); // Save the label for the form
            console.log("Selected Ward ID:", selectedWard.value);
          }
        };

        const handleReceiverWardChange = (event) => {
          const selectedWard = wards.find(
            (ward) => ward.value === event.target.value
          );
          if (selectedWard) {
            setSelectedRWard(selectedWard.value);
            setFieldValue("wardR", selectedWard.label); // Save the label for the form
            console.log("Selected Ward ID:", selectedWard.value);
          }
        };

        return (
          <Form onSubmit={handleSubmit}>
            {/* Content */}
            <>
              <Box sx={{ p: 4, bgcolor: "#eeeeee" }}>
                {/* Paper 1: Receiver Information */}
                <Paper elevation={4} sx={{ padding: "20px" }}>
                  <Typography variant="h6" gutterBottom>
                    Địa chỉ lấy hàng *
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <TextFieldWrapper
                        name="senderName"
                        label="Tên người gửi"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextFieldWrapper name="senderPhone" label="Điện thoại" />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel>Tỉnh (người gửi)</InputLabel>
                        <Select
                          name="cityS"
                          value={selectedProvinceS}
                          onChange={handleSenderProvinceChange}
                          label="Tỉnh (người gửi)"
                        >
                          {provinces.map((province) => (
                            <MenuItem
                              key={province.value}
                              value={province.value}
                            >
                              {province.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel>Quận (người gửi)</InputLabel>
                        <Select
                          name="districtS"
                          value={selectedDistrictSId}
                          onChange={handleSenderDistrictChange}
                          label="Quận (người gửi)"
                        >
                          {districts.map((district) => (
                            <MenuItem
                              key={district.value}
                              value={district.value}
                            >
                              {district.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel>Phường (người gửi)</InputLabel>
                        <Select
                          name="wards"
                          label="Phường (người gửi)"
                          value={selectedWardSId} // Nếu bạn có state để lưu phường đã chọn
                          onChange={handleSenderWardChange} // Nếu bạn có hàm xử lý cho phường
                        >
                          {wards.map((ward) => (
                            <MenuItem key={ward.value} value={ward.value}>
                              {ward.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                      <TextFieldWrapper
                        name="origin"
                        label="Địa chỉ người gửi"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextFieldWrapper
                        name="senderNote"
                        label="Hướng dẫn giao hàng"
                        multiline
                        rows={3}
                      />
                    </Grid>
                  </Grid>
                </Paper>

                {/* Paper 2: Receiver Information */}
                <Paper elevation={4} sx={{ padding: "20px" }}>
                  <Typography variant="h6" gutterBottom>
                    Địa chỉ người nhận
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <TextFieldWrapper
                        name="receiverName"
                        label="Tên người nhận"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextFieldWrapper
                        name="receiverPhone"
                        label="Điện thoại"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel>Tỉnh (người nhận)</InputLabel>
                        <Select
                          name="cityR"
                          value={selectedProvinceR}
                          onChange={handleReceiverProvinceChange}
                          label="Tỉnh (người nhận)"
                        >
                          {provinces.map((province) => (
                            <MenuItem
                              key={province.value}
                              value={province.value}
                            >
                              {province.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel>Quận (người nhận)</InputLabel>
                        <Select
                          name="districtR"
                          value={selectedDistrictRId}
                          onChange={handleReceiverDistrictChange}
                          label="Quận (người nhận)"
                        >
                          {districts.map((district) => (
                            <MenuItem
                              key={district.value}
                              value={district.value}
                            >
                              {district.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel>Phường (người nhận)</InputLabel>
                        <Select
                          name="wardR"
                          label="Phường (người nhận)"
                          value={selectedWardRId}
                          onChange={handleReceiverWardChange}
                        >
                          {wards.map((ward) => (
                            <MenuItem key={ward.value} value={ward.value}>
                              {ward.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                      <TextFieldWrapper
                        name="destination"
                        label="Địa chỉ người nhận"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextFieldWrapper
                        name="receiverNote"
                        label="Hướng dẫn giao hàng"
                        multiline
                        rows={3}
                      />
                    </Grid>
                  </Grid>
                </Paper>

                {/* Paper 3: Order Information */}
                <Paper elevation={4} sx={{ padding: "20px" }}>
                  <Typography variant="h6" gutterBottom>
                    Thông tin bưu gửi
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <SelectWrapper
                        name="koi_type"
                        label="Koi Type"
                        options={koi_type}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <SelectWrapper
                        name="koi_name"
                        label="Koi Variant"
                        options={koi_name}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextFieldWrapper
                        name="weight"
                        label="Cân nặng trung bình"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">kg</InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextFieldWrapper
                        name="quantity"
                        label="Số lượng"
                        type="number"
                        slotProps={{
                          inputLabel: {
                            shrink: true,
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FileUpload name="document_file" />
                    </Grid>
                    <Grid item xs={12}>
                      <TextFieldWrapper
                        name="description"
                        label="Ghi chú"
                        multiline
                        rows={4}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <CustomRadioGroup
                        name="freight"
                        options={[
                          {
                            value: "Dịch vụ tiêu chuẩn",
                            label: "Dịch vụ tiêu chuẩn",
                            description:
                              "Giao theo tiêu chuẩn dịch vụ 1-4 ngày",
                            icon: <RocketIcon fontSize="large" />,
                            helpText:
                              "Phí vận chuyển ước tính sẽ bao gồm phụ phí và trừ đi các khoản chiến khấu/giảm giá bởi khuyến mãi.",
                          },
                          {
                            value: "Dịch vụ hỏa tốc",
                            label: "Dịch vụ hỏa tốc",
                            description: "Giao theo tiêu chuẩn dịch vụ 1-3 giờ",
                            icon: <RocketLaunchIcon fontSize="large" />,
                            helpText:
                              "Phí vận chuyển ước tính sẽ bao gồm phụ phí và trừ đi các khoản chiến khấu/giảm giá bởi khuyến mãi.",
                          },
                        ]}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextFieldWrapper
                        name="discount"
                        label="Mã giảm giá"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">%</InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={3.5}></Grid>
                    <Grid
                      item
                      xs={5}
                      justifyContent="center" // Center horizontally
                      alignItems="center"
                    >
                      <RadioGroupWrapper
                        name="additional_service_2"
                        legend="Thanh toán"
                        options={[
                          {
                            value: "Yes",
                            label: "Người gửi thanh toán",
                          },
                          {
                            value: "No",
                            label: "Người nhận thanh toán",
                          },
                        ]}
                      />
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      justifyContent="center" // Center horizontally
                      alignItems="center"
                    >
                      <RadioGroupWrapper
                        name="additional_service"
                        legend="Bảo hiểm sự cố"
                        options={[
                          {
                            value: "Yes",
                            label: "Có",
                          },
                          {
                            value: "No",
                            label: "Không",
                          },
                        ]}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      justifyContent="center" // Center horizontally
                      alignItems="center"
                    >
                      <RadioGroupWrapper
                        name="additional_service_1"
                        legend="Chăm sóc cá"
                        options={[
                          {
                            value: "Yes",
                            label: "Có",
                          },
                          {
                            value: "No",
                            label: "Không",
                          },
                        ]}
                      />
                    </Grid>
                  </Grid>
                </Paper>
                <CheckboxWrapper
                  name="termsOfService"
                  legend="Terms Of Service"
                  label="I agree"
                />

                <ButtonWrapper>Submit Order</ButtonWrapper>
              </Box>
            </>
          </Form>
        );
      }}
    </Formik>
  );
};

export default OrderForm;
