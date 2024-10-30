import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DeliveryStaff.css';
import { useNavigate } from 'react-router-dom';
import { logout } from '../Member/auth'; 
import { FaRegCalendarAlt } from "react-icons/fa";
import { FiHome } from "react-icons/fi";
import { IoSettingsOutline } from "react-icons/io5";
import { MdSupportAgent} from "react-icons/md";
import { IoIosNotificationsOutline } from "react-icons/io";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { FaRegMessage } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { CiLogout } from "react-icons/ci";
import { getAvatar} from "../../services/CustomerService";
import { getService, updatePrice } from '../../services/EmployeeService';

const ServiceComponent = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [avatar, setAvatar] = useState(null); 
  const [isDropdownOpen, setDropdownOpen] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  const [showModal, setShowModal] = useState(false);
  const accountId = localStorage.getItem("accountId");

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const avatarUrl = await getAvatar(accountId);
        setAvatar(avatarUrl);
      } catch (error) {
        console.error("Error fetching account data:", error);
      }
    };
    getAllServices();
    if (accountId) fetchAccount();
  }, [accountId]);

  const getAllServices = () => {
    getService()
      .then((response) => {
        setServices(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => console.error("Error fetching services: ", error));
  };

  const handleOpenModal = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewPrice('');
  };

  const handleUpdatePrice = () => {
    if (selectedService && newPrice) {
      updatePrice(selectedService.serviceName, newPrice)
        .then(() => {
          getAllServices(); // Refresh the services list after updating
          handleCloseModal();
        })
        .catch((error) => console.error("Error updating price:", error));
    }
  };
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  return (
    <div className="container-fluid">
      <div className="row">
        <aside className="sidebar col-3 p-3">
          <div className='side-bar'>
            <div className="profile-container text-center mb-4">
              <div className="SideKoi d-flex align-items-center justify-content-between">
                <img src="/Logo-Koi/Order.png" alt="Profile" className="profile-img rounded-circle" />
                <div className="KoiLogo">
                  <p className="KoiDeli">Koi Deli</p>
                </div>
              </div>
            </div>
            <nav>
              <ul className="list-unstyled">
              <li>
                  <a href="/"><i className="bi bi-speedometer2 me-2"> <FiHome /> </i>  Homepage</a>
              </li>
              <li>
                <a href="/manager"><i className="bi bi-person-badge me-2"><HiOutlineClipboardDocumentList /></i>Manage</a>
              </li>

              <li>
                <a href="#"><i className="bi bi-chat-dots me-2"><FaRegCalendarAlt /></i> Calendar</a>
              </li>

              <li>
                <a href="#"><i className="bi bi-life-preserver me-2"><MdSupportAgent /></i> Help & Support</a>
              </li>

              <li>
                <a href="#"><i className="bi bi-chat-dots me-2"> <FaRegMessage/> </i>  Messages</a>
              </li>

              <li>
                <a href="#"><i className="bi bi-gear me-2"><IoSettingsOutline /></i> Settings</a>
              </li>
              </ul>
            </nav>
          </div>
        </aside>
        <main className="dashboard col">
        <header className="d-flex justify-content-between align-items-center mb-4 ">
            <h1>Service Manage</h1> 
            <header className="d-flex justify-content-between align-items-center mb-4 ">
              <div className="header-content" style={{ width: '%' }}> 
              <div className="d-flex align-items-center justify-content-center search-container">
              <input
                  className="search-bar"
                  type="text"
                  placeholder="Search Order"
              />
             </div>

                <div className="navbar-cus-right">
                  <div className="dropdown" onClick={toggleDropdown}>
                  <img src={avatar || '/default-avatar.png'} alt="Avatar" className="avatar" />
                    {isDropdownOpen && ( 
                      <div className="dropdown-content">
                        <a  href="user-page"><CgProfile /> View Profile</a>
                        <a  onClick={handleLogout}><CiLogout /> Logout</a>
                      </div>
                    )}
                  </div>
                </div>
              
              </div>
            <div className="notification-icon m-4">
                <IoIosNotificationsOutline />
              </div>
              </header>
          </header>
          <section className="delivery-ongoing-delivery mt-4 d-flex border-top pt-3">
            <div className="delivery-list col-12">
              <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th>ServiceName</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service.serviceName}>
                      <td>{service.serviceName}</td>
                      <td>${service.price}</td>
                      <td>
                        <button onClick={() => handleOpenModal(service)}>Update</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Modal for updating price */}
          {showModal && (
            <div className="modal show d-block"  role="dialog">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title ">Update Price</h5>
                    <button type="button" className="close" onClick={handleCloseModal} aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <input
                      type="number"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      placeholder="Enter new price"
                      className="form-control"
                    />
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-primary" onClick={handleUpdatePrice}>
                      Save changes
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ServiceComponent;
