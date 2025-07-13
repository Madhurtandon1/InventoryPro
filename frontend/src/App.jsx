import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import React from "react";

import Home from "./pages/Home.jsx";
import AddCustomer from "./pages/AddCustomer.jsx";
import AddOrder from "./pages/AddOrder.jsx";
import AddProduct from "./pages/AddProducts.jsx";
import Customers from "./pages/Customer.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import EditCustomer from "./pages/EditCustomer.jsx";
import EditProduct from "./pages/EditProducts.jsx";
import Login from "./pages/Login.jsx";
import Order from "./pages/Order.jsx";
import Products from "./pages/Products.jsx";
import Profile from "./pages/Profile.jsx";
import Register from "./pages/Register.jsx";
import SalesReport from "./pages/SalesReport.jsx";
import StockAlerts from "./pages/StockAlerts.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import Staff from "./pages/Staff.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import ForgotAdminPasscode from "./pages/ForgetAdminPasscode.jsx";
import ResetAdminPasscode from "./pages/ResetAdminPasscode.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";

import DashboardLayout from "./components/DashboardLayout.jsx";

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/forgot-admin-passcode" element={<ForgotAdminPasscode />} />
          <Route path="/reset-admin-passcode/:token" element={<ResetAdminPasscode />} />

          {/* Protected Routes Inside Dashboard Layout */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
           
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/add" element={<AddProduct />} />
            <Route path="/products/edit/:id" element={<EditProduct />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/add" element={<AddCustomer />} />
            <Route path="/customers/edit/:id" element={<EditCustomer />} />
            <Route path="/orders" element={<Order />} />
            <Route path="/orders/add" element={<AddOrder />} />
            <Route path="/sales-report" element={<SalesReport />} />
            <Route path="/stock-alerts" element={<StockAlerts />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/profile" element={<Profile />} />
          

          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
