import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import axios from "axios";
import { getOrderPDF, orderDetail } from "../../services/CustomerService";

const REST_API_ORDER_URL = "http://koideliverysystem.id.vn:8080/api/orders";

const OrderReport = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all order data from multiple APIs
  const fetchAllOrderData = async () => {
    try {
      console.log("Fetching orders...");

      // Fetch orders
      const ordersResponse = await axios.get(REST_API_ORDER_URL);
      const ordersData = ordersResponse.data;
      console.log("Orders data:", ordersData);

      if (!Array.isArray(ordersData) || ordersData.length === 0) {
        throw new Error("No orders found.");
      }

      // Fetch details and documents for each order
      const orderDataPromises = ordersData.map(async (order) => {
        console.log(`Fetching details for order ${order.id}...`);
        const detailResponse = await orderDetail(order.id);

        console.log(`Fetching document for order ${order.id}...`);
        const documentBlob = await getOrderPDF(order.id);

        return {
          ...order,
          detail: detailResponse,
          documentBlob,
        };
      });

      const combinedOrders = await Promise.all(orderDataPromises);
      console.log("Combined Orders:", combinedOrders);

      setOrders(combinedOrders);
    } catch (error) {
      setError("Failed to fetch orders. " + error.message);
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrderData();
  }, []);

  const handleDownload = (orderId, blob) => {
    console.log(`Downloading document for order ${orderId}...`);

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `order_${orderId}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Order Details</TableCell>
            <TableCell>Document</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{JSON.stringify(order.detail)}</TableCell>
              <TableCell>
                {order.documentBlob ? "Available" : "Not Available"}
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleDownload(order.id, order.documentBlob)}
                  disabled={!order.documentBlob}
                >
                  Download Document
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderReport;
