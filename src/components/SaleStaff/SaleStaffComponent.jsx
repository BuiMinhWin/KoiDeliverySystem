import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler  } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SaleStaff.css';
import logo from '../../assets/Logo.png';
import avatar from '../../assets/Avatar.jpg';
import { useNavigate } from 'react-router-dom';
import { listOrder,getOrderDetail } from '../../services/DeliveryService';
import { logout } from '../Member/auth'; 
import { IoSettingsOutline } from "react-icons/io5";
import { MdSupportAgent} from "react-icons/md";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { CgProfile } from "react-icons/cg";
import { CiLogout } from "react-icons/ci";
import './SaleStaff.css';

  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler );

  const SaleStaffComponent = () => {

    
  const formatCurrency = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };


    const handleLogout = () => {
      logout();
      navigate('/');
    }

    const [isDropdownOpen, setDropdownOpen] = useState(false); // Quản lý trạng thái mở dropdown

    const toggleDropdown = () => {
      setDropdownOpen(!isDropdownOpen);
    }

  // const handleViewOrder = (orderId) => {
  //   navigate(`/order/${orderId}`);
  // };

    const [orders, setOrders] = useState([]);
    const [orderDetail, setOrderDetail] = useState(null);
    const navigate = useNavigate();

    const [monthFilter, setMonthFilter] = useState('');
      const [provinceFilter, setProvinceFilter] = useState('');
      const [provinces, setProvinces] = useState([]);
      const [statusFilter, setStatusFilter] = useState('');
      const [transportationFilter, setTransportationFilter] = useState('');

      const [currentPage, setCurrentPage] = useState(1);  // Trang hiện tại
      const ordersPerPage = 10; 

      useEffect(() => {
        
        const fetchProvinces = async () => {
          try {
            const response = await fetch('https://online-gateway.ghn.vn/shiip/public-api/master-data/province', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Token': 'ba986de0-8bd6-11ef-9db4-127d7400f642',
              },
            });
            const data = await response.json();
            // console.log(data); 
            setProvinces(data.data); 
          } catch (error) {
            console.error('Error fetching provinces:', error);
          }
        };
    
        fetchProvinces();
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
            console.error("Error fetching : ", error);
          });
      };

      const filteredOrders = orders.filter(order => {
        const orderMonth = new Date(order.orderDate).getMonth() + 1;
        const matchesMonth = monthFilter ? orderMonth === parseInt(monthFilter) : true;
        const matchesProvince = provinceFilter ? order.destination.includes(provinceFilter) : true;
        const matchesStatus = statusFilter ? order.status === parseInt(statusFilter) : true;
    
        return matchesMonth && matchesProvince && matchesStatus ;
      });
    
      const indexOfLastOrder = currentPage * ordersPerPage;
      const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
      const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

      const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
    
      const paginate = (pageNumber) => setCurrentPage(pageNumber);
    
      const statusLabels = [
        "Đang chờ xét duyệt",
        "Đơn đã được duyệt",
        "Đã chọn tài xế",
        "Tài xế đã nhận đơn và đang vận chuyển",
        "Đã vận chuyển",
        "Đã nhận hàng"
      ];
    
    return (

      <div className="container-fluid">
        <div className="row">
          {/*SideBar */}
        <aside className="sidebar col-2 p-3 ">
              <div className='manager-sidebar'>
              <div className="profile-container text-center mb-4">
                <div className="SideKoi d-flex ">
                <img src="/Logo-Koi/Order.png" alt="Profile " className="profile-img rounded-circle me-3"/>
                  <div className=" KoiLogo">
                    <p className="KoiDeli ">KoiDeli</p>
                  </div>
                </div>
                <hr className="logo-separator" /> 
                {/* border */}
                
              </div>
              <nav>
          <ul className="list-unstyled">
            
              <li>
                <a href="/confirm"><i className="bi bi-speedometer2 me-2"> <HiOutlineClipboardDocumentList /> </i>  Order awaiting confirmation</a>
            </li>

            <li>
              <a href="/salestaff/listsaleorder"><i className="bi bi-chat-dots me-2"> <HiOutlineClipboardDocumentList/> </i>  View Order</a>
            </li>

          <li>
            <a href="/salestaff/test"><i className="bi bi-chat-dots me-2"> <HiOutlineClipboardDocumentList/> </i> Driver Booking</a>
          </li>

          {/* <li>
            <a href="/salestaff/respondFeedback"><i className="bi bi-chat-dots me-2"> <HiOutlineClipboardDocumentList/> </i> Respond FeedBack</a>
          </li>

            <li>
              <a href="/orders"><i className="bi bi-person-badge me-2"><MdSupportAgent /></i> View Report</a>
            </li>

            <li>
              <a href="#"><i className="bi bi-life-preserver me-2"><MdSupportAgent /></i> View Feedback</a>
            </li>

          <li>
            <a href="#"><i className="bi bi-gear me-2"><IoSettingsOutline /></i> Settings</a>
           </li> */}
         
        </ul>
        </nav>
        </div>
          </aside>

          <main className="dashboard-sale">
          <header className="d-flex justify-content-between align-items-center mb-4 pb-4">
          
                <h4 className="title">Dashboard</h4>
                <header className="d-flex justify-content-between align-items-center mb-4 ">
                <div className="header-content" style={{ width: '%' }} > 
                  
                <div className="navbar-sale-right">
                    <div className="dropdown" onClick={toggleDropdown}>
                      <img src={avatar} alt="Avatar" className="avatar" />
                      {isDropdownOpen && ( 
                        <div className="dropdown-content-salestaff">
                          <a href="/user-page"><CgProfile /> Thông tin của tôi</a>
                          <a onClick={handleLogout}><CiLogout /> Đăng xuất</a>
                        </div>
                      )}
                    </div>
                  </div>  
                  
                </div>

              </header>

              </header>

              <section className="ongoing-delivery mt-4 d-flex border-top pt-3">
              <div className="delivery-list col-12" style={{ width: '80%', margin: '0 0' }}>
                  <h2>List of Orders</h2>

                  <div className="filter-bar d-flex mb-3">
                    <select className="form-select me-2" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}>
                      <option value="">Cả năm</option>
                      <option value="1">Tháng 1</option>
                      <option value="2">Tháng 2</option>
                      <option value="3">Tháng 3</option>
                      <option value="4">Tháng 4</option>
                      <option value="5">Tháng 5</option>
                      <option value="6">Tháng 6</option>
                      <option value="7">Tháng 7</option>
                      <option value="8">Tháng 8</option>
                      <option value="9">Tháng 9</option>
                      <option value="10">Tháng 10</option>
                      <option value="11">Tháng 11</option>
                      <option value="12">Tháng 12</option>
                    </select>
                  
    
                  <select className="form-select me-2" value={provinceFilter} onChange={(e) => setProvinceFilter(e.target.value)}>
                  <option value="">Tất cả tỉnh thành</option>
                  {provinces?.map((province) => (
                    <option key={province.ProvinceID} value={province.ProvinceName}>
                      {province.ProvinceName}
                    </option>
                  ))}
                </select>
                </div>
                
                <table className="table table-striped table-bordered"  style={{ width: '100%', margin: '0 0' }}>
                  <thead>
                    <tr>
                    <th>OrderId</th>
                    <th>Điểm đi</th>
                    <th>Điểm đến</th>
                    <th>Phương tiện</th>
                    <th>Ngày đặt hàng</th>
                    <th>Ngày nhận hàng</th>
                    <th>Tổng giá tiền</th>
                    <th>Trạng thái</th>
 
                    </tr>
                  </thead>
                  <tbody>
                  {currentOrders.length > 0 ? (
                    currentOrders.map((order) => (
                      <tr key={order.orderId}>
                         <td>{order.orderId}</td>
                          <td>{order.origin}</td>
                          <td>{order.destination}</td>
                          <td>{order.freight}</td>
                          <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                          <td>{new Date (order.shippedDate).toLocaleDateString()}</td>
                          <td>{formatCurrency(order.totalPrice)}</td>   
                        <td>{statusLabels[order.status]}</td>
                        {/* <td>
                          <button onClick={() => handleViewOrder(order.orderId)}>View</button>
                        </td> */}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="12" className="text-center">No Orders Found</td>
                    </tr>
                  )}
                </tbody>
                </table>

                  <nav>
                  <ul className="pagination">
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <li key={index} className="page-item">
                      <button onClick={() => paginate(index + 1)} className="page-link">
                        {index + 1}
                      </button>
                    </li>
                  ))}
                </ul>
                </nav>

                </div>
              
              </section>

              </main>
          </div>
        </div>
      );
    };


  export default SaleStaffComponent;
