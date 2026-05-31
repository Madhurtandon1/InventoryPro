// import React, { useEffect, useState } from "react";
// import axios from "../utils/axios.js";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const Dashboard = () => {
//   const [summary, setSummary] = useState(null);
//   const [trend, setTrend] = useState([]);
//   const [topProducts, setTopProducts] = useState([]);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const isStaff = user?.role === "staff";

//   const fetchData = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const [summaryRes, trendRes, topRes] = await Promise.all([
//         axios.get("/dashboard/summary", {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         axios.get("/dashboard/trend", {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         axios.get("/dashboard/top-products", {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ]);

//       setSummary(summaryRes.data.data);
//       setTrend(trendRes.data.data);
//       setTopProducts(topRes.data.data);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to load dashboard");
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   if (error) {
//     return <div className="text-red-600 p-4">{error}</div>;
//   }

//   if (!summary) {
//     return <div className="p-4">Loading dashboard...</div>;
//   }

//   return (
//     <div className="p-6 space-y-8">
//       <h1 className="text-3xl font-bold text-center text-gray-800 ">
//         📊 Dashboard
//       </h1>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//         <Card
//           title="Products"
//           value={summary.totalProducts}
//           onClick={() => navigate("/products")}
//         />
//         <Card
//           title="Customers"
//           value={summary.totalCustomers}
//           onClick={() => navigate("/customers")}
//         />
//         <Card
//           title="Orders"
//           value={summary.totalOrders}
//           onClick={() => navigate("/orders")}
//         />
//         <Card
//           title="Completed Orders"
//           value={summary.completedOrders}
//           onClick={() => navigate("/orders?status=Completed")}
//         />
//         <Card
//           title="Pending Orders"
//           value={summary.pendingOrders}
//           onClick={() => navigate("/orders?status=Pending")}
//         />
//         <Card
//           title="Cancelled Orders"
//           value={summary.cancelledOrders}
//           onClick={() => navigate("/orders?status=Cancelled")}
//         />
//         {!isStaff && (
//           <Card
//             title="Revenue"
//             value={`₹${summary.totalRevenue}`}
//             onClick={() => {}}
//           />
//         )}
//         <Card
//           title="Low Stock Items"
//           value={summary.lowStockCount}
//           onClick={() => navigate("/products?lowStock=true")}
//         />
//       </div>

//       {/* 📈 Sales Trend */}
//       { !isStaff && (
//       <section>
//         <h2 className="text-xl font-semibold mb-2 text-gray-700 ">
//           📈 Sales Trend (Last 7 Days)
//         </h2>
//         <div className="bg-white dark:bg-gray-900 p-4 rounded shadow space-y-2">
//           {trend.length === 0 ? (
//             <p className="text-gray-500">No recent sales</p>
//           ) : (
//             trend.map((day) => (
//               <div key={day._id} className="flex justify-between text-sm">
//                 <span>{day._id}</span>
//                 <span>
//                   Orders: {day.orderCount}, Sales: ₹{day.totalSales}
//                 </span>
//               </div>
//             ))
//           )}
//         </div>
//       </section>
// )}
//       {/* 🔥 Top Selling Products */}
//       {!isStaff && (
//       <section>
//         <h2 className="text-xl font-semibold mb-2 text-gray-700 ">
//           🔥 Top Selling Products
//         </h2>
//         <div className="bg-white dark:bg-gray-900 p-4 rounded shadow space-y-2">
//           {topProducts.length === 0 ? (
//             <p className="text-gray-500">No data available</p>
//           ) : (
//             topProducts.map((prod) => (
//               <div
//                 key={prod.productId}
//                 className="flex justify-between text-sm"
//               >
//                 <span>
//                   {prod.name} (SKU: {prod.sku})
//                 </span>
//                 <span>Sold: {prod.totalSold}</span>
//               </div>
//             ))
//           )}
//         </div>
//       </section>
//       )}
//     </div>
//   );
// };

// // 📦 Reusable Card Component
// const Card = ({ title, value, onClick, disabled }) => (
//   <div
//     onClick={disabled ? undefined : onClick}
//     className={`p-4 rounded shadow text-center transition-all duration-200 ${
//       disabled
//         ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//         : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer text-gray-800 dark:text-white"
//     }`}
//   >
//     <div className="text-sm font-medium mb-1">{title}</div>
//     <div className="text-2xl font-bold">{value}</div>
//   </div>
// );

// export default Dashboard;





import React, { useEffect, useState } from "react";
import axios from "../utils/axios.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiBox, FiUsers, FiFileText, FiTrendingUp, FiAlertTriangle, FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const isStaff = user?.role === "staff";

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const [summaryRes, trendRes, topRes] = await Promise.all([
        axios.get("/dashboard/summary", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/dashboard/trend", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/dashboard/top-products", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setSummary(summaryRes.data.data);
      setTrend(trendRes.data.data);
      setTopProducts(topRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-4">
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 p-4 rounded-xl max-w-md w-full text-center shadow-sm">
          <FiAlertTriangle className="mx-auto mb-2 text-2xl" />
          <p className="font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] p-4 space-y-3">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 dark:text-gray-400 font-medium text-sm animate-pulse">Loading workspace analytics...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 bg-[#F8FAFC] dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 dark:border-slate-800 pb-5 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <span>📊</span> System Overview
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time metric monitoring and transactional diagnostics ecosystem.
          </p>
        </div>
        <div className="text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg shadow-sm text-slate-500 max-w-fit">
          Status: <span className="text-emerald-500 font-semibold animate-pulse">● Online</span>
        </div>
      </div>

      {/* Analytics Summary Grid */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">
          Core Operational Lifelines
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Card
            title="Total Products"
            value={summary.totalProducts}
            icon={<FiBox />}
            onClick={() => navigate("/products")}
          />
          <Card
            title="Customer Base"
            value={summary.totalCustomers}
            icon={<FiUsers />}
            onClick={() => navigate("/customers")}
          />
          <Card
            title="All Orders"
            value={summary.totalOrders}
            icon={<FiFileText />}
            onClick={() => navigate("/orders")}
          />
          <Card
            title="Completed Orders"
            value={summary.completedOrders}
            icon={<FiCheckCircle className="text-emerald-500" />}
            onClick={() => navigate("/orders?status=Completed")}
          />
          <Card
            title="Pending Pipelines"
            value={summary.pendingOrders}
            icon={<FiClock className="text-amber-500" />}
            onClick={() => navigate("/orders?status=Pending")}
          />
          <Card
            title="Cancelled Orders"
            value={summary.cancelledOrders}
            icon={<FiXCircle className="text-rose-500" />}
            onClick={() => navigate("/orders?status=Cancelled")}
          />
          {!isStaff && (
            <Card
              title="Gross Revenue"
              value={`₹${Number(summary.totalRevenue).toLocaleString("en-IN")}`}
              icon={<FiTrendingUp className="text-blue-500" />}
              onClick={() => {}}
            />
          )}
          <Card
            title="Low Stock Risks"
            value={summary.lowStockCount}
            icon={<FiAlertTriangle />}
            danger={summary.lowStockCount > 0}
            onClick={() => navigate("/products?lowStock=true")}
          />
        </div>
      </div>

      {/* Bottom Visual Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 📈 Sales Trend */}
        {!isStaff && (
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <span>📈</span> Seven-Day Activity Curve
              </h2>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-[280px] overflow-y-auto pr-1">
              {trend.length === 0 ? (
                <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-8">No transactional history recorded within this window.</p>
              ) : (
                trend.map((day) => (
                  <div key={day._id} className="flex justify-between items-center py-3 text-sm group hover:bg-slate-50 dark:hover:bg-slate-800/30 px-2 rounded-lg transition-colors">
                    <span className="font-medium text-slate-600 dark:text-slate-400 font-mono">{day._id}</span>
                    <div className="flex items-center gap-4 text-right">
                      <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500 dark:text-slate-400">
                        {day.orderCount} {day.orderCount === 1 ? 'order' : 'orders'}
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white font-mono text-emerald-600 dark:text-emerald-400">
                        ₹{Number(day.totalSales).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {/* 🔥 Top Selling Products */}
        {!isStaff && (
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <span>🔥</span> High-Velocity Inventories
              </h2>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-[280px] overflow-y-auto pr-1">
              {topProducts.length === 0 ? (
                <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-8">Velocity telemetry data unavailable.</p>
              ) : (
                topProducts.map((prod) => (
                  <div key={prod.productId} className="flex justify-between items-center py-3 text-sm group hover:bg-slate-50 dark:hover:bg-slate-800/30 px-2 rounded-lg transition-colors">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[240px] md:max-w-xs">{prod.name}</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">SKU: {prod.sku}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/30 px-2.5 py-1 rounded-full">
                        {prod.totalSold} Units Sold
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

// 📦 Premium, Highly Visible Card Component
const Card = ({ title, value, icon, onClick, disabled, danger }) => (
  <div
    onClick={disabled ? undefined : onClick}
    className={`p-5 rounded-xl border transition-all duration-200 text-left relative overflow-hidden flex flex-col justify-between min-h-[110px] ${
      disabled
        ? "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-50 cursor-not-allowed text-slate-400"
        : danger
        ? "bg-rose-50/60 dark:bg-rose-950/10 border-rose-200 dark:border-rose-900/40 hover:border-rose-400 dark:hover:border-rose-700 cursor-pointer text-slate-800 dark:text-slate-200 shadow-sm shadow-rose-100 dark:shadow-none"
        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md hover:shadow-slate-100 dark:hover:shadow-none cursor-pointer text-slate-800 dark:text-slate-200 shadow-sm"
    }`}
  >
    <div className="flex justify-between items-start gap-4">
      <div className="text-xs font-bold tracking-wide uppercase text-slate-400 dark:text-slate-500">
        {title}
      </div>
      {icon && (
        <div className={`text-lg p-1.5 rounded-lg ${
          danger 
            ? "bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400" 
            : "bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400"
        }`}>
          {icon}
        </div>
      )}
    </div>
    
    <div className={`text-2xl font-extrabold tracking-tight font-mono mt-2 ${
      danger ? "text-rose-600 dark:text-rose-400" : "text-slate-900 dark:text-white"
    }`}>
      {value}
    </div>
  </div>
);

export default Dashboard;