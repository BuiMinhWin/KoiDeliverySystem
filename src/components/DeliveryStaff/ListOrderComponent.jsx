import React, { useEffect, useState } from 'react';
import { listOrder, updateStatus} from '../../services/DeliveryService';
import { FaLongArrowAltLeft } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import axios from "axios";



const ListOrderComponent = () => {
  const [orders, setOrders] = useState([]);
  const [editedStatuses, setEditedStatuses] = useState({});
  // const [orderDetail, setOrderDetail] = useState(null); // Lưu chi tiết đơn hàng ở đây
  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    getAllOrders();
    
  }, []);

  const getAllOrders = () => {
    listOrder()
      .then((response) => {
        if (Array.isArray(response.data)) {
          setOrders(response.data);
        } else {
          console.error("API response is not an array", response.data);
          setOrders([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching orders: ", error);
      });
  };

  const handleStatusChange = (orderId, newStatus) => {
    const updatedStatuses = {
      ...editedStatuses,
      [orderId]: newStatus,
    };
    setEditedStatuses(updatedStatuses);
  };

  const API_KEY =import.meta.env.VITE_GOONG_API_KEY; // Thay bằng API Key của bạn

  const reverseGeocodeAddress = async (lat, long) => {
    try {
      const response = await axios.get(
        `https://rsapi.goong.io/Geocode?latlng=${lat},${long}&api_key=${API_KEY}`
      );
      const data = response.data;
      if (data.results && data.results.length > 0) {
        const address = data.results[0].formatted_address; // Get the formatted address
        return address; // Return the full address
      } else {
        throw new Error('No results found for the address.');
      }
    } catch (error) {
      console.error('Error fetching geocode:', error);
      throw new Error('Failed to fetch geocode.');
    }
  };

  const updateOrderStatus = async (orderId) => {
    const newStatus = editedStatuses[orderId] ?? orders.find(order => order.orderId === orderId)?.status;
    
    if (newStatus) {
      updateStatus(orderId, newStatus);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const currentLocate = await reverseGeocodeAddress(latitude, longitude);
          console.log(currentLocate);
          // const currentLocate = `${latitude},${longitude}`;
          const data = {
            orderId: orderId,
            timeTracking: new Date().toISOString(),
            currentLocate: currentLocate,
            status: newStatus, 
          };
          console.log(data.status);

          fetch("http://koideliverysystem.id.vn:8080/api/deliveryStatus/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          })
            .then((response) => response.json())
            .then(() => {
              enqueueSnackbar("Cập nhật trạng thái thành công", { variant: "success", autoHideDuration: 1000 });
              getAllOrders(); 
            })
            .catch(() => {
              
              enqueueSnackbar("Cập nhật thất bại. Vui lòng thử lại.", { variant: "error", autoHideDuration: 1000 });
            });
        }, () => {
          
          enqueueSnackbar("Không thể lấy vị trí hiện tại.", { variant: "error", autoHideDuration: 1000 });
        });
      } else {
        alert("Geolocation fail.");
      }
    }
  };

  const handleViewOrder = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  const roleId = localStorage.getItem('roleId'); 
  const accountId = localStorage.getItem("accountId");
  // console.log("accountId:", accountId);

  const handleBackClick = () => {
    if (roleId === 'Manager') {
      navigate('/manager'); // Điều hướng cho manager
    }  else if (roleId === 'Delivery') {
      navigate('/delivery'); // Điều hướng cho delivery
    } else {
      navigate('/'); // Điều hướng về homepage
    }
  };




  return (
    <div className="container">
       <button
        type="button"
        onClick={handleBackClick}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          position: 'absolute',
          top: '10px',
          left: '120px',
          padding: '5px',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <FaLongArrowAltLeft size={16} color="black" />
        <span style={{ marginLeft: '15px' }}>Back</span>
      </button>

      <h2 className="text-center">List of Orders</h2>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>OrderId</th>
            <th>Destination</th>
            <th>Freight</th>
            <th>OrderDate</th>
            <th>ShipDate</th>
            <th>TotalPrice</th>
            <th>Origin</th>
            <th>Status</th>
            <th>Actions</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders
            .filter(order => order.deliver ===accountId) 
            .map(order => (
              <tr key={order.orderId}>
                <td>{order.orderId}</td>
                <td>{order.destination}</td>
                <td>{order.freight}</td>
                <td>{order.orderDate}</td>
                <td>{order.shippedDate}</td>
                <td>{order.totalPrice}</td>
                <td>{order.origin}</td>
                <td>
                  <input
                    type="text"
                    value={editedStatuses[order.orderId] ?? order.status}
                    onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                  />
                </td>
                <td>
                  <button
                    className="btn btn-info"
                    onClick={() => updateOrderStatus(order.orderId)}
                  >
                    Update Status
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleViewOrder(order.orderId)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center">No Orders Found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListOrderComponent;