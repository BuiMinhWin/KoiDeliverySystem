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
  Divider,
  Button,
} from "@mui/material";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import TextFieldWrapper from "../FromUI/Textfield";
import SelectWrapper from "../FromUI/Select";
import ButtonWrapper from "../FromUI/Button";
import koi_type from "../../data/koiTypes.json";
import koi_name from "../../data/koiVarieties.json";
import airport from "../../data/airport.json";
import { createOrder, uploadDocument } from "../../services/CustomerService";
import { createOrderDetail } from "../../services/CustomerService";
import CustomRadioGroup from "../FromUI/CustomRadioGroup";
import RocketIcon from "@mui/icons-material/Rocket";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import AddIcon from "@mui/icons-material/Add";
import FileUpload from "../FromUI/FileUpload";
import CheckboxWrapper from "../FromUI/Checkbox";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "notistack";
import ServiceSelect from "../FromUI/SelectServices";

const labelStyle = {
  fontSize: "1.5rem", // Adjust size as needed
  fontWeight: "600", // Demi-bold?
  textDecoration: "underline", // Underlined
};
const fishButtonStyles = {
  backgroundColor: "#161A31",
  color: "white",
  "&:hover": { backgroundColor: "#727376" },
  padding: "17px 16px",
  borderRadius: "8px",
  minWidth: "auto",
  justifyContent: "center",
};

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
  discount: "",
  koi_image: "",
  freight: "",
  serviceIds: [],
  document_file: null,
  orderNote: "",
  orderDetails: [
    {
      koiType: "",
      koiName: "",
      weight: 0.0,
      quantity: 0,
    },
  ],
};

// Validation Schema with Yup
const FORM_VALIDATION = Yup.object().shape({
  origin: Yup.string().required("Vui lòng nhập địa điểm xuất phát"),
  destination: Yup.string().required("Vui lòng nhập địa điểm đến"),
  receiverName: Yup.string()
    .matches(/^[A-Za-zÀ-ỹ\s]+$/, "Vui lòng chỉ nhập chữ cái")
    .required("Vui lòng nhập tên người nhận"),
  senderName: Yup.string()
    .matches(/^[A-Za-zÀ-ỹ\s]+$/, "Vui lòng chỉ nhập chữ cái")
    .required("Vui lòng nhập tên người gửi"),
  receiverPhone: Yup.string()
    .required("Vui lòng nhập số điện thoại người nhận")
    .matches(/^[0-9]{10}$/, "Số điện thoại phải là số và có 10 số"),
  senderPhone: Yup.string()
    .required("Vui lòng nhập số điện thoại người gửi")
    .matches(/^[0-9]{10}$/, "Số điện thoại phải là số và có 10 số"),
  receiverNote: Yup.string()
    .nullable()
    .max(500, "Ghi chú cần phải dưới 500 kí tự"),
  senderNote: Yup.string()
    .nullable()
    .max(500, "Ghi chú cần phải dưới 500 kí tự"),
  discount: Yup.string().nullable(),
  // cityS: Yup.string().required("Vui lòng chọn thành phố"),
  // cityR: Yup.string().required("Vui lòng chọn thành phố"),
  freight: Yup.string().required("Vui lòng chọn phương thức vận chuyển"),
  termsOfService: Yup.boolean()
    .oneOf([true], "The terms and conditions must be accepted.")
    .required("The terms and conditions must be accepted."),
  orderNote: Yup.string()
    .nullable()
    .max(500, "Ghi chú cần phải dưới 500 kí tự"),
  orderDetails: Yup.array().of(
    Yup.object().shape({
      koiType: Yup.string().required("Vui lòng chọn loại cá Koi"),
      koiName: Yup.string().required("Vui lòng chọn tên cá Koi"),
      weight: Yup.number()
        .min(0.1, "Cân nặng phải lớn hơn 0")
        .max(50, "Trọng lượng không vượt quá 50kg")
        .required("Vui lòng nhập cân nặng"),
      quantity: Yup.number()
        .min(1, "Số lượng phải lớn hơn 0")
        .required("Vui lòng nhập số lượng"),
      document_file: Yup.mixed()
        .required("A file is required")
        .test(
          "fileSize",
          "File cần phải nhỏ hơn 8MB",
          (value) => value && value.size <= 8 * 1024 * 1024
        )
        .test(
          "fileFormat",
          "Chỉ chấp nhận định dạng file PDF",
          (value) => value && value.type === "application/pdf"
        ),
    })
  ),
});

const OrderForm = () => {
  const navigate = useNavigate();
  const orderDetailsToSend = [];
  const location = useLocation();
  const { japan } = location.state || {};
  const HAN = "Noi Bai International Airport, Hanoi, Vietnam";

  const handleAirportChange = (event, setFieldValue) => {
    const selectedCode = event.target.value;
    const selectedAirport = airport[selectedCode];
    const formattedValue = `${selectedAirport.split(",")[0]} - ${HAN}`;
    setOriginAirport(formattedValue); // Updates local state, if needed
    setFieldValue("origin", formattedValue); // Updates Formik field value
  };

  // state lưu danh sáchh tỉnh, phường, quận người gửi
  const [provincesS, setProvincesS] = useState([]);
  const [districtsS, setDistrictsS] = useState([]);
  const [wardsS, setWardsS] = useState([]);

  // state lưu danh sáchh tỉnh, phường, quận người nhận
  const [provincesR, setProvincesR] = useState([]);
  const [districtsR, setDistrictsR] = useState([]);
  const [wardsR, setWardsR] = useState([]);

  // người gửi
  const [selectedProvinceS, setSelectedProvinceS] = useState(null);
  const [selectedDistrictSId, setSelectedDistrictSId] = useState(null);
  const [selectedWardSId, setSelectedSWard] = useState(null);

  // người nhận
  const [selectedProvinceR, setSelectedProvinceR] = useState(null);
  const [selectedDistrictRId, setSelectedDistrictRId] = useState(null);
  const [selectedWardRId, setSelectedRWard] = useState(null);

  // const [distanceData, setDistanceData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const { enqueueSnackbar } = useSnackbar();

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

          // Lưu các tỉnh cho cả người gửi và người nhận
          setProvincesS(provinceOptions);
          setProvincesR(provinceOptions);
        } else {
          console.log("No data found");
        }
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };

    fetchProvinces();
  }, []);

  const fetchDistricts = async (provinceId, isSender) => {
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

        // check điều kiện để gán
        if (isSender) {
          setDistrictsS(districtOptions); // set quận người gửi
          setWardsS([]); // reset
        } else {
          setDistrictsR(districtOptions); // set quận người nhận
          setWardsR([]);
        }
      }
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const fetchWards = async (districtId, isSender) => {
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

        // check điều kiện để gán
        if (isSender && wardsS !== wardOptions) {
          setWardsS(wardOptions); // set quận người gửi
        } else if (!isSender && wardsR !== wardOptions) {
          setWardsR(wardOptions); // set quận người nhận
        }
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
        cityR: selectedProvinceR,
        cityS: selectedProvinceS,
        districtS: selectedDistrictSId,
        wardS: selectedWardSId,
      }}
      validationSchema={FORM_VALIDATION}
      onSubmit={async (values, { setSubmitting, setErrors }) => {
        try {
          const accountId = localStorage.getItem("accountId");
          const originCoordinates = await geocodeAddress(
            japan === "Nhật Bản"
              ? "Noi Bai International Airport, Phú Minh, Sóc Sơn, Hà Nội"
              : `${values.origin}, ${values.wardS}, ${values.districtS} ,${values.cityS}`
          );
          const destinationCoordinates = await geocodeAddress(
            `${values.destination}, ${values.wardR}, ${values.districtR} ,${values.cityR}`
          );

          const origins = `${originCoordinates.lat},${originCoordinates.lng}`;
          const destinations = `${destinationCoordinates.lat},${destinationCoordinates.lng}`;

          const distance = await fetchDistanceData(origins, destinations);
          console.log("Khoảng cách tính được: ", distance);

          console.log("Current origin value:", values.origin);

          const orderData = {
            ...values,
            accountId,
            origin: `${values.origin}, ${values.wardS || "Phú Minh"}, ${
              values.districtS || "Sóc Sơn"
            } ,${values.cityS || "Hà Nội"}`,
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
            serviceIds: values.serviceIds,
          };
          if (!orderData.cityS || !orderData.districtS || !orderData.wardS) {
            if (!orderData.cityS) orderData.cityS = "Hà Nội";
            if (!orderData.districtS) orderData.districtS = "Sóc Sơn";
            if (!orderData.wardS) orderData.wardS = "Phú Minh";
          }

          if (japan === "Trong nước") {
            // If 'Trong nước', adjust origin with specific values
            orderData.origin = `${values.origin}`;
            orderData.cityS = "Hà Nội";
            orderData.districtS = "Sóc Sơn";
            orderData.wardS = "Phú Minh";
          }

          const orderResponse = await createOrder(orderData);
          console.log("Order data created successfully:", orderResponse);

          if (!orderResponse?.orderId) {
            throw new Error("Order ID not found in the response");
          }

          const newOrderId = orderResponse.orderId;
          console.log("Order created with ID:", newOrderId);

          // Clear orderDetailsToSend array for each submission
          const orderDetailsToSend = [];

          for (const orderDetail of values.orderDetails) {
            const { document_file, ...orderDetailData } = orderDetail;

            const orderDetailToSend = {
              ...orderDetailData,
              orderId: newOrderId,
            };

            orderDetailsToSend.push(orderDetailToSend);
            console.log(
              "Data prepared for createOrderDetail:",
              orderDetailToSend
            );
          }

          const orderDetailResponses = await createOrderDetail(
            orderDetailsToSend
          );
          console.log(
            "Order details created successfully:",
            orderDetailResponses
          );

          // Handle document upload for each order detail
          for (let i = 0; i < orderDetailResponses.length; i++) {
            const orderDetailResponse = orderDetailResponses[i];
            const documentFile = values.orderDetails[i]?.document_file;

            if (documentFile) {
              const formData = new FormData();
              formData.append("document_file", documentFile);
              console.log("Uploading document:", {
                orderDetailId: orderDetailResponse.orderDetailId,
                file: documentFile,
              });

              await uploadDocument(orderDetailResponse.orderDetailId, formData);
              console.log(
                "Document uploaded for order detail:",
                orderDetailResponse.orderDetailId
              );
            }
          }
          enqueueSnackbar("Đơn của bạn đã được tạo thành công", {
            variant: "success",
          });
          navigate("/checkout", { state: { orderId: newOrderId } });
        } catch (error) {
          enqueueSnackbar("Đã có lỗi xảy ra khi tạo đơn, vui lòng thử lại", {
            variant: "error",
          });
          console.error("Error creating order:", error);
          setErrors({ submit: error.message });
        } finally {
          setSubmitting(false);
        }
      }}
      validateOnMount={true}
    >
      {({ handleSubmit, errors, setFieldValue, values }) => {
        console.log("Form values on submit:", values);
        console.log("OrderDetail value on submit:", values.orderDetails);
        console.log("Validation errors:", errors);
        const handleSenderProvinceChange = (event) => {
          const selectedProvince = provincesS.find(
            (province) => province.value === event.target.value
          );
          if (selectedProvince) {
            setSelectedProvinceS(selectedProvince.value);
            setFieldValue("cityS", selectedProvince.label);
            console.log("Selected Province ID:", selectedProvince.value);

            // Reset quận và phường của người gửi khi thay đổi tỉnh người gửi
            setDistrictsS([]);
            setWardsS([]);

            fetchDistricts(selectedProvince.value, true); // true cho người nhận,check dk không bị mất
          }
        };

        const handleReceiverProvinceChange = (event) => {
          const selectedProvince = provincesR.find(
            (province) => province.value === event.target.value
          );
          if (selectedProvince) {
            setSelectedProvinceR(selectedProvince.value);
            setFieldValue("cityR", selectedProvince.label);
            console.log("Selected Province ID:", selectedProvince.value);

            // Reset quận và phường của người nhận khi thay đổi tỉnh người nhận
            setDistrictsR([]);
            setWardsR([]);

            fetchDistricts(selectedProvince.value, false); // false cho người nhận,check dk không bị mất
          }
        };

        const handleSenderDistrictChange = (event) => {
          const selectedDistrict = districtsS.find(
            (district) => district.value === event.target.value
          );
          if (selectedDistrict) {
            setSelectedDistrictSId(selectedDistrict.value);
            setFieldValue("districtS", selectedDistrict.label);
            console.log("Selected District ID:", selectedDistrict.value);

            fetchWards(selectedDistrict.value, true);
          }
        };

        const handleReceiverDistrictChange = (event) => {
          const selectedDistrict = districtsR.find(
            (district) => district.value === event.target.value
          );
          if (selectedDistrict) {
            setSelectedDistrictRId(selectedDistrict.value);
            setFieldValue("districtR", selectedDistrict.label);
            console.log("Selected District ID:", selectedDistrict.value);

            fetchWards(selectedDistrict.value, false);
          }
        };

        const handleSenderWardChange = (event) => {
          const selectedWard = wardsS.find(
            (ward) => ward.value === event.target.value
          );
          if (selectedWard) {
            setSelectedSWard(selectedWard.value);
            setFieldValue("wardS", selectedWard.label);
            console.log("Selected Ward ID:", selectedWard.value);
          }
        };

        const handleReceiverWardChange = (event) => {
          const selectedWard = wardsR.find(
            (ward) => ward.value === event.target.value
          );
          if (selectedWard) {
            setSelectedRWard(selectedWard.value);
            setFieldValue("wardR", selectedWard.label);
            console.log("Selected Ward ID:", selectedWard.value);
          }
        };

        return (
          <Form onSubmit={handleSubmit}>
            {/* Content */}
            <>
              <Box sx={{ p: 4, bgcolor: "#eeeeee" }}>
                {/* Paper 1: Receiver Information */}

                {japan === "Trong nước" ? (
                  <Paper elevation={4} sx={{ padding: "20px" }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ ...labelStyle }}
                    >
                      Địa chỉ lấy hàng
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={6}>
                        <TextFieldWrapper
                          name="senderName"
                          label="Tên người gửi"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextFieldWrapper
                          name="senderPhone"
                          label="Điện thoại"
                        />
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
                            {provincesS.map((province) => (
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
                            {districtsS.map((district) => (
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
                            {wardsS.map((ward) => (
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
                ) : japan === "Nhật Bản" ? (
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
                        <TextFieldWrapper
                          name="senderPhone"
                          label="Điện thoại"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <SelectWrapper
                          name="origin"
                          label="Chọn sân bay tại Nhật Bản"
                          options={airport}
                          value={values.origin} // Ensure Formik is using the correct value here
                          onChange={(event) =>
                            handleAirportChange(event, setFieldValue)
                          }
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
                ) : (
                  <p>Please select a shipping destination.</p>
                )}

                {/* Paper 2: Receiver Information */}
                <Paper elevation={4} sx={{ padding: "20px" }}>
                  <Typography variant="h6" gutterBottom sx={{ ...labelStyle }}>
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
                          {provincesR.map((province) => (
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
                          {districtsR.map((district) => (
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
                          {wardsR.map((ward) => (
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

                {/* FishDetail */}
                <FieldArray name="orderDetails">
                  {({ push, remove }) => (
                    <>
                      {values.orderDetails.map((_, index) => (
                        <Paper
                          elevation={4}
                          sx={{ padding: "20px", marginBottom: "20px" }}
                          key={index}
                        >
                          <Typography
                            variant="h6"
                            gutterBottom
                            sx={{ ...labelStyle }}
                          >
                            Thông tin cá Koi {index + 1}
                          </Typography>
                          <Grid container spacing={3}>
                            <Grid item xs={6}>
                              <SelectWrapper
                                name={`orderDetails.${index}.koiType`}
                                label="Loại cá Koi"
                                options={koi_type}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <SelectWrapper
                                name={`orderDetails.${index}.koiName`}
                                label="Biến thể Koi"
                                options={koi_name}
                              />
                            </Grid>
                            <Grid item xs={3}>
                              <TextFieldWrapper
                                name={`orderDetails.${index}.weight`}
                                label="Cân nặng trung bình"
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      kg
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </Grid>
                            <Grid item xs={3}>
                              <TextFieldWrapper
                                name={`orderDetails.${index}.quantity`}
                                label="Số lượng"
                                type="number"
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <FileUpload
                                name={`orderDetails.${index}.document_file`}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <Button
                                variant="outlined"
                                color="error"
                                sx={{
                                  padding: "17px 16px",
                                  borderRadius: "8px",
                                }}
                                onClick={() => remove(index)}
                                disabled={values.orderDetails.length === 1} // Prevents removing the last section
                              >
                                Xóa thông tin cá Koi {index + 1}
                              </Button>
                            </Grid>
                            <Grid item xs={6}>
                              <Button
                                variant="contained"
                                sx={{ ...fishButtonStyles }}
                                startIcon={<AddIcon />}
                                onClick={() =>
                                  push({
                                    koiType: "",
                                    koiName: "",
                                    weight: 0.0,
                                    quantity: 0,
                                  })
                                }
                              >
                                Thêm thông tin cá Koi mới
                              </Button>
                            </Grid>
                          </Grid>
                        </Paper>
                      ))}
                    </>
                  )}
                </FieldArray>

                {/* Order Information */}
                <Paper elevation={4} sx={{ padding: "20px" }}>
                  <Typography variant="h6" gutterBottom sx={{ ...labelStyle }}>
                    Tùy chọn bưu gửi
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextFieldWrapper
                        name="orderNote"
                        label="Ghi chú"
                        multiline
                        rows={4}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <CustomRadioGroup
                        name="freight"
                        selectedCountry={japan}
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
                      xs={5.6}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <ServiceSelect
                        value={values.serviceIds}
                        onChange={(event) =>
                          setFieldValue("serviceIds", event.target.value)
                        }
                      />
                    </Grid>
                  </Grid>
                  <Divider
                    sx={{ backgroundColor: "black", margin: "20px 50px" }}
                  />
                  <Grid xs={12}>
                    <CheckboxWrapper
                      name="termsOfService"
                      legend="Terms Of Service"
                      label="Tôi đã đọc và đồng ý với các điều khoản"
                    />
                  </Grid>
                  <ButtonWrapper>Tạo đơn đặt hàng</ButtonWrapper>
                </Paper>
              </Box>
            </>
          </Form>
        );
      }}
    </Formik>
  );
};

export default OrderForm;