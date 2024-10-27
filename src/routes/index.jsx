import React from "react";
import { Route, Routes } from "react-router-dom";
import Homepage from "../pages/HomePage/HomePage";
import LoginComponent from "../components/Member/LoginComponent";
import RegisterComponent from "../components/Member/RegisterComponent";
import UserPage from "../pages/UserPage/UserPage";
import OrderForm from "../components/OrderForm/OrderForm";
import SaleStaffComponent from "../components/SaleStaff/SaleStaffComponent";
import DeliveryComponent from "../components/DeliveryStaff/DeliveryComponent";
import CustomerHomePage from "../components/Customer/CustomerHomePage";
import ManagerComponent from "../components/Manager/ManagerComponent";
import ListOrderComponent from "../components/DeliveryStaff/ListOrderComponent";
import EmployeeComponent from "../components/Manager/EmployeeComponent";
import ListEmployeeComponent from "../components/Manager/ListEmployeeComponent";
import ListCustomerComponent from "../components/Customer/ListCustomerComponent";
import OrderDetailComponent from "../components/DeliveryStaff/OrderDetailComponent";
// import { OrderProvider } from '../components/DeliveryStaff/OrderContext';
import CheckoutPage from "../pages/CheckoutPage/CheckoutPage";
import ListOrderOfSales from "../components/SaleStaff/ListOrderOfSales";
import Blog from "../pages/Blog/Blog";
import Layout from "../components/Layout/Layout";
import OrderDetailDocumentComponent from "../components/SaleStaff/OrderDetailDocumentComponent";
import ListOfConfirmOrder from "../components/SaleStaff/ListOfConfirmOrder";
import OrderReport from "../pages/Order/OrderReport";
import Authenticate from "../components/Member/Authenticate";
import ResetPasswordComponent from "../components/Member/ResetPasswordComponent";
import Map from "../components/Map";
import { SnackbarProvider } from 'notistack';
import PaymentOutcome from "../pages/CheckoutPage/PaymentOutCome";
import DriverBooking from "../components/SaleStaff/AssignDriverComponent";
import ConfirmDriver from "../components/SaleStaff/ConfirmDriver";
import ListOrderManageComponent from "../components/Manager/ListOrderManageComponent";

function index() {
  return (
      

  
    <Routes>
      {/* Member */}
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<LoginComponent />} />
      <Route path="/user-page" element={<UserPage />} />
      <Route path="/register" element={<RegisterComponent />} />
      <Route path="/reset" element={<ResetPasswordComponent />} />
      <Route path="/map" element={< Map />} />
      {/* <Route path="/calculate" element={< DistanceCalculator />} /> */}

      <Route path="/" element={<Layout />}>
        <Route
          path="/user"
          element={
            <Authenticate allowedRoles={["Customer"]}>
              <UserPage />
            </Authenticate>
          }
        />
        <Route
          path="/form"
          element={
            // <Authenticate allowedRoles={["Customer"]}>
            //   <OrderForm />
            // </Authenticate>
            <OrderForm />
          }
        />
        <Route
          path="/checkout"
          element={
            <Authenticate allowedRoles={["Customer"]}>
              <CheckoutPage />
            </Authenticate>
          }
        />
        <Route
          path="/order-report"
          element={
            <Authenticate allowedRoles={["Customer"]}>
              <OrderReport />
            </Authenticate>
          }
        />
        <Route path="/payment-outcome" element={<PaymentOutcome />} />
      </Route>

      <Route path="/blog" element={<Blog />} />

      {/*Manager*/}
      <Route
        path="/manager"
        element={
          <Authenticate allowedRoles={["Manager"]}>
            <ManagerComponent />
          </Authenticate>
        }
      />
      <Route
        path="/accounts"
        element={
          <Authenticate allowedRoles={["Manager"]}>
            <ListEmployeeComponent />
          </Authenticate>
        }
      />

      <Route
        path="/add-account"
        element={
          <Authenticate allowedRoles={["Manager"]}>
            <EmployeeComponent />
          </Authenticate>
        }
      />

      <Route
        path="/edit-account/:accountId"
        element={
          <Authenticate allowedRoles={["Manager"]}>
            <EmployeeComponent />
          </Authenticate>
        }
      />

      <Route
        path="/listcustomers"
        element={
          <Authenticate allowedRoles={["Manager"]}>
            <ListCustomerComponent />
          </Authenticate>
        }
      />

      <Route
        path="/ordersM"
        element={
          <Authenticate allowedRoles={["Manager"]}>
            <ListOrderManageComponent />
          </Authenticate>
        }
      />

    

      {/*customer*/}
      <Route
        path="/customer"
        element={
          <Authenticate allowedRoles={["Customer"]}>
            <CustomerHomePage />
          </Authenticate>
        }
      />

      {/*DeliveryStaff*/}
      <Route
        path="/delivery"
        element={
          <Authenticate allowedRoles={["Delivery"]}>
            <DeliveryComponent />
          </Authenticate>
        }
      />

      <Route
        path="/orders"
        element={
          <Authenticate allowedRoles={["Delivery"]}>
            <ListOrderComponent />
          </Authenticate>
        }
      />

      <Route
        path="/order/:orderId"
        element={
          <Authenticate allowedRoles={["Delivery"]}>
            <OrderDetailComponent />
          </Authenticate>
        }
      />

      {/*SalesStaff*/}
      <Route
        path="/salestaff/listsaleorder"
        element={
          <Authenticate allowedRoles={["Sales"]}>
            <ListOrderOfSales />
          </Authenticate>
        }
      />

        {/*SalesStaff*/}
        <Route
        path="/salestaff/driverbooking"
        element={
          <Authenticate allowedRoles={["Sales"]}>
            <DriverBooking />
          </Authenticate>
        }
      />

      {/*SalesStaff*/}
      <Route
        path="/salestaff/test"
        element={
          <Authenticate allowedRoles={["Sales"]}>
            <ConfirmDriver />
          </Authenticate>
        }
      />

      <Route
        path="/salestaff"
        element={
          <Authenticate allowedRoles={["Sales"]}>
            <SaleStaffComponent />
          </Authenticate>
        }
      />

      <Route
        path="/confirm"
        element={
          <Authenticate allowedRoles={["Sales"]}>
            <ListOfConfirmOrder />
          </Authenticate>
        }
      />

      <Route
        path="/confirmDetail/:orderId"
        element={
          <Authenticate allowedRoles={["Sales"]}>
            <OrderDetailDocumentComponent />
          </Authenticate>
        }
      />
    </Routes>
  );
}

export default index;

//rfce enter
