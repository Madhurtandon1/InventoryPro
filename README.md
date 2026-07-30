<img width="1920" height="2965" alt="image" src="https://github.com/user-attachments/assets/dd9b0052-9636-4649-811d-a2a23263d537" /># 📦 InventoryPro

> **A Modern Inventory, Billing & Business Management System**

InventoryPro is a full-stack inventory management platform built to help businesses efficiently manage products, customers, orders, staff, and sales. The system streamlines inventory operations by providing secure authentication, automated invoice generation, stock monitoring, customer management, and real-time business insights through an intuitive dashboard.

Designed using the MERN stack, InventoryPro offers a scalable architecture suitable for small and medium-sized businesses looking to digitize their inventory and billing workflow.

---

# ✨ Features

## 🔐 Authentication & Authorization

- Secure JWT Authentication
- Password Hashing with bcrypt
- Cookie-based Authentication
- Forgot Password via Email
- Password Reset
- Protected Routes
- Role-Based Authorization (Admin & Staff)

---

## 📦 Product Management

Manage inventory efficiently with:

- Add Products
- Edit Products
- Delete Products
- Product Images
- Cloudinary Image Upload
- Product Categories
- Inventory Tracking

---

## 👥 Customer Management

Maintain complete customer records.

Features include:

- Add Customers
- Update Customer Details
- Delete Customers
- Customer Purchase History
- Customer Search

---

## 🧾 Order Management

Create and manage customer orders.

Features:

- Create Orders
- Track Orders
- Order History
- Automatic Order IDs
- Invoice Generation
- PDF Bills

---

## 📊 Dashboard

The dashboard provides business insights such as:

- Total Products
- Total Customers
- Total Orders
- Revenue Overview
- Recent Activity
- Inventory Status

---

## 📉 Sales Reports

Generate detailed reports including:

- Sales Summary
- Revenue Analysis
- Customer Purchases
- Product Performance
- Order Statistics

---

## 🚨 Stock Alerts

Automatically identify:

- Low Stock Products
- Out-of-Stock Items
- Inventory Warnings

Helping businesses restock products before shortages occur.

---

## 👨‍💼 Staff Management

Admins can:

- Add Staff Members
- Manage Staff Accounts
- Assign Roles
- Control Permissions

---

## 📄 Invoice Generation

Automatically generate professional PDF invoices for customer orders.

Features:

- Customer Details
- Ordered Products
- Quantity
- Pricing
- Total Amount
- Downloadable PDF

---

## ☁️ Cloud Storage

Product images are securely uploaded using Cloudinary.

Benefits:

- Fast Image Delivery
- Secure Storage
- Automatic Optimization

---

# 🏗️ System Architecture

```
                   React Frontend
                         │
                         ▼
                 Express.js Backend
                         │
        ┌────────────────┼───────────────┐
        │                │               │
        ▼                ▼               ▼
   MongoDB         Cloudinary      Email Service
    Mongoose         Storage        Nodemailer
```

---

# 🛠️ Tech Stack

## Frontend

- React
- Vite
- React Router
- Tailwind CSS
- Axios
- React Hot Toast
- Lucide React
- React Icons

---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Cookie Parser
- Multer
- Cloudinary
- Nodemailer
- Morgan

---

## Database

- MongoDB
- Mongoose ODM

---

## Deployment

Frontend

- Vercel

Backend

- Render / Node Server

Database

- MongoDB Atlas

---

# 📂 Project Structure

```
InventoryPro
│
├── frontend
│   ├── src
│   │   ├── pages
│   │   ├── components
│   │   ├── context
│   │   ├── services
│   │   ├── routes
│   │   └── utils
│
├── backend
│   ├── src
│   │   ├── controllers
│   │   ├── models
│   │   ├── routes
│   │   ├── middleware
│   │   ├── db
│   │   └── utils
│
└── README.md
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/Madhurtandon1/InventoryPro.git

cd InventoryPro
```

---

## Backend Setup

```bash
cd backend

npm install

npm run dev
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

# 🔐 Environment Variables

Create a `.env` file inside the backend directory.

```env
PORT=

MONGODB_URI=

ACCESS_TOKEN_SECRET=

ACCESS_TOKEN_EXPIRY=

REFRESH_TOKEN_SECRET=

REFRESH_TOKEN_EXPIRY=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

EMAIL_USER=

EMAIL_PASS=
```

---

# 📡 API Modules

## Authentication

- Register
- Login
- Logout
- Forgot Password
- Reset Password

---

## Products

- Create Product
- Update Product
- Delete Product
- Product Listing

---

## Customers

- Add Customer
- Update Customer
- Delete Customer
- Customer Details

---

## Orders

- Create Order
- View Orders
- Generate Invoice
- Download PDF

---

## Dashboard

- Revenue Statistics
- Product Summary
- Customer Summary
- Order Summary

---

## Reports

- Sales Reports
- Stock Reports

---

# 🔒 Security Features

- JWT Authentication
- Password Encryption
- HTTP-only Cookies
- Role-Based Access Control
- Protected Routes
- Secure Environment Variables
- Image Upload Validation

---

# 📈 Future Enhancements

- Barcode Scanner Integration
- QR Code Product Management
- Purchase Order Module
- Supplier Management
- GST Billing Support
- Multi-Warehouse Management
- Real-Time Notifications
- Analytics Dashboard
- Mobile Application
- Export Reports (Excel & CSV)

---

# 📸 Screenshots

<img width="1920" height="2965" alt="image" src="https://github.com/user-attachments/assets/8178bf44-63a3-44f8-bd98-889088a5f456" />



# 👨‍💻 Author

**Madhur Tandon**

B.Tech Computer Science  
Birla Institute of Technology, Mesra

GitHub: https://github.com/Madhurtandon1

---

# 📜 License

This project is developed for educational and portfolio purposes.
