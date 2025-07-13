import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiBox, FiUsers, FiFileText } from "react-icons/fi";
import LoginModal from "./Login";
import Register2 from "./Register2";

const features = [
  {
    title: "Product Management",
    icon: <FiBox size={28} className="text-gray-700" />,
    description: "Organize your stock effortlessly and stay ahead of demand.",
  },
  {
    title: "Customer Insights",
    icon: <FiUsers size={28} className="text-gray-700" />,
    description: "Track customer preferences and buying behavior with ease.",
  },
  {
    title: "Smart Billing",
    icon: <FiFileText size={28} className="text-gray-700" />,
    description: "Quickly generate bills and manage orders from one place.",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);


  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 text-gray-800 font-sans">
  {/* Login Modal */}
  {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}

  {/* Register Modal */}
{/* Register Modal */}
{showRegister && <Register2 onClose={() => setShowRegister(false)} openLogin={() => {
      setShowRegister(false);
      setShowLogin(true);
    }}/>}


      {/* Header */}
      <header className="flex justify-between items-center px-8 py-6 bg-white/80 backdrop-blur-sm shadow-sm rounded-b-xl">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-700 via-gray-800 to-black">
          InventoryPro
        </h1>
        <div className="space-x-4">
          <button
            onClick={() => setShowLogin(true)}
            className="px-5 py-2 rounded-md border border-gray-700 text-gray-100 hover:bg-gray-700 hover:text-white font-medium shadow-sm bg-opacity-50"
          >
            Login
          </button>
          <button
            onClick={() => setShowRegister(true)}
            className="px-5 py-2 rounded-md border border-gray-700 text-gray-100 hover:bg-gray-700 hover:text-white font-medium shadow-sm bg-opacity-50"
          >
            Register
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <h2 className="text-5xl font-extrabold mb-4 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-gray-900 to-black">
          Manage Smarter, Not Harder.
        </h2>
        <p className="text-lg text-gray-700 max-w-2xl mb-8">
          InventoryPro gives small businesses beautiful, simple tools to manage products,
          orders, and customers in one clean, intuitive platform.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
           <button
            onClick={() => setShowRegister(true)}
            className="px-6 py-3 rounded-lg border-2 border-gray-700 text-gray-100 hover:bg-gray-700 hover:text-white font-semibold transition"
          >
            Create account
          </button>
          <button
            onClick={() => setShowLogin(true)}
            className="px-6 py-3 rounded-lg border-2 border-gray-700 text-gray-100 hover:bg-gray-700 hover:text-white font-semibold transition"
          >
            Demo Login
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-white/80 backdrop-blur-sm rounded-3xl mx-6 shadow-lg">
        <h3 className="text-3xl font-bold text-center mb-14 text-transparent bg-clip-text bg-gradient-to-r from-gray-700 via-gray-800 to-black">
          What Can You Do?
        </h3>
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 max-w-6xl mx-auto">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition border border-gray-200"
            >
              <div className="mb-4">{feature.icon}</div>
              <h4 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h4>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 text-center text-sm text-gray-700 px-6 py-10">
        <div className="mb-2">
          📞 Contact us: <span className="font-medium text-gray-900">+91 93367 02981</span>
        </div>
      <div className="mb-2">
  📧 Email:{" "}
  <a
    href="mailto:inventorypro25@gmail.com"
    className="text-gray-900 font-semibold hover:underline !text-opacity-100 !opacity-100"
    style={{ color: "#1f2937" }} // fallback to dark gray
  >
    inventorypro25@gmail.com
  </a>
</div>



        <div className="mt-4 text-xs text-gray-500">
          &copy; {new Date().getFullYear()} InventoryPro. Built with ❤️ for businesses.
        </div>
      </footer>
    </div>
  );
};

export default Home;
