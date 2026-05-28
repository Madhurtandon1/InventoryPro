// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FiBox, FiUsers, FiFileText } from "react-icons/fi";
// import LoginModal from "./Login";
// import Register2 from "./Register2";

// const features = [
//   {
//     title: "Product Management",
//     icon: <FiBox size={28} className="text-gray-700" />,
//     description: "Organize your stock effortlessly and stay ahead of demand.",
//   },
//   {
//     title: "Customer Insights",
//     icon: <FiUsers size={28} className="text-gray-700" />,
//     description: "Track customer preferences and buying behavior with ease.",
//   },
//   {
//     title: "Smart Billing",
//     icon: <FiFileText size={28} className="text-gray-700" />,
//     description: "Quickly generate bills and manage orders from one place.",
//   },
// ];

// const Home = () => {
//   const navigate = useNavigate();
//   const [showLogin, setShowLogin] = useState(false);
//   const [showRegister, setShowRegister] = useState(false);


//   return (
//     <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 text-gray-800 font-sans">
//   {/* Login Modal */}
//   {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}

//   {/* Register Modal */}
// {/* Register Modal */}
// {showRegister && <Register2 onClose={() => setShowRegister(false)} openLogin={() => {
//       setShowRegister(false);
//       setShowLogin(true);
//     }}/>}


//       {/* Header */}
//       <header className="flex justify-between items-center px-8 py-6 bg-white/80 backdrop-blur-sm shadow-sm rounded-b-xl">
//         <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-700 via-gray-800 to-black">
//           InventoryPro
//         </h1>
//         <div className="space-x-4">
//           <button
//             onClick={() => setShowLogin(true)}
//             className="px-5 py-2 rounded-md border border-gray-700 text-gray-100 hover:bg-gray-700 hover:text-white font-medium shadow-sm bg-opacity-50"
//           >
//             Login
//           </button>
//           <button
//             onClick={() => setShowRegister(true)}
//             className="px-5 py-2 rounded-md border border-gray-700 text-gray-100 hover:bg-gray-700 hover:text-white font-medium shadow-sm bg-opacity-50"
//           >
//             Register
//           </button>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
//         <h2 className="text-5xl font-extrabold mb-4 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-gray-900 to-black">
//           Manage Smarter, Not Harder.
//         </h2>
//         <p className="text-lg text-gray-700 max-w-2xl mb-8">
//           InventoryPro gives small businesses beautiful, simple tools to manage products,
//           orders, and customers in one clean, intuitive platform.
//         </p>
//         <div className="mt-6 flex flex-col sm:flex-row gap-4">
//            <button
//             onClick={() => setShowRegister(true)}
//             className="px-6 py-3 rounded-lg border-2 border-gray-700 text-gray-100 hover:bg-gray-700 hover:text-white font-semibold transition"
//           >
//             Create account
//           </button>
//           <button
//             onClick={() => setShowLogin(true)}
//             className="px-6 py-3 rounded-lg border-2 border-gray-700 text-gray-100 hover:bg-gray-700 hover:text-white font-semibold transition"
//           >
//             Demo Login
//           </button>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="px-6 py-20 bg-white/80 backdrop-blur-sm rounded-3xl mx-6 shadow-lg">
//         <h3 className="text-3xl font-bold text-center mb-14 text-transparent bg-clip-text bg-gradient-to-r from-gray-700 via-gray-800 to-black">
//           What Can You Do?
//         </h3>
//         <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 max-w-6xl mx-auto">
//           {features.map((feature, idx) => (
//             <div
//               key={idx}
//               className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition border border-gray-200"
//             >
//               <div className="mb-4">{feature.icon}</div>
//               <h4 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h4>
//               <p className="text-gray-600">{feature.description}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="mt-16 text-center text-sm text-gray-700 px-6 py-10">
//         <div className="mb-2">
//           📞 Contact us: <span className="font-medium text-gray-900">+91 93367 02981</span>
//         </div>
//       <div className="mb-2">
//   📧 Email:{" "}
//   <a
//     href="mailto:inventorypro25@gmail.com"
//     className="text-gray-900 font-semibold hover:underline !text-opacity-100 !opacity-100"
//     style={{ color: "#1f2937" }} // fallback to dark gray
//   >
//     inventorypro25@gmail.com
//   </a>
// </div>



//         <div className="mt-4 text-xs text-gray-500">
//           &copy; {new Date().getFullYear()} InventoryPro. Built with ❤️ for businesses.
//         </div>
//       </footer>
//     </div>
//   );
// };
//  export default Home;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiBox, FiUsers, FiFileText, FiTrendingUp, FiShield, FiZap } from "react-icons/fi";
import LoginModal from "./Login";
import Register2 from "./Register2";

const BLUE = "#155dfc";
const BLUE_LIGHT = "#e8effe";
const DARK = "#1C1C1A";
const CREAM = "#F5F4F1";
const MID = "#5F5E5A";
const BORDER = "#E2E0D9";

const features = [
  { title: "Product Management", icon: FiBox, description: "Organize your entire catalog effortlessly. Track stock levels, set reorder alerts, and stay ahead of demand — all in one place.", tag: "Inventory" },
  { title: "Customer Insights", icon: FiUsers, description: "Understand your buyers deeply. Monitor purchase history, preferences, and patterns to make smarter business decisions.", tag: "Analytics" },
  { title: "Smart Billing", icon: FiFileText, description: "Generate invoices in seconds, manage orders with ease, and keep your cash flow clean and organized.", tag: "Billing" },
  { title: "Sales Tracking", icon: FiTrendingUp, description: "Monitor revenue trends, top-performing products, and daily sales — visualized beautifully for quick decisions.", tag: "Reports" },
  { title: "Secure & Reliable", icon: FiShield, description: "Your data is encrypted and backed up automatically. We keep your business safe so you can focus on growing it.", tag: "Security" },
  { title: "Blazing Fast", icon: FiZap, description: "Instant search, real-time updates, and a responsive interface built for speed — because every second counts.", tag: "Performance" },
];

const stats = [
  { value: "2,400+", label: "Businesses" },
  { value: "₹18Cr+", label: "Billed monthly" },
  { value: "99.9%", label: "Uptime" },
  { value: "4.9★", label: "Avg rating" },
];

const Home = () => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=Instrument+Serif:ital@0;1&display=swap');

        .ip-page *,
        .ip-page *::before,
        .ip-page *::after { box-sizing: border-box; }

        .ip-page {
          width: 100%;
          min-height: 100vh;
          background: #F5F4F1;
          color: #1C1C1A;
          overflow-x: hidden;
        }

        /* ── NAV ── */
        .ip-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          background: #2A2A28;
          border-bottom: 1px solid #3A3A38;
          transition: background 0.25s, box-shadow 0.25s;
        }
        .ip-nav.scrolled {
          background: #1C1C1A;
          box-shadow: 0 2px 20px rgba(0,0,0,0.25);
        }
        .ip-nav-inner {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 40px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .ip-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .ip-logo-icon {
          width: 32px; height: 32px;
          background: #155dfc;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .ip-logo-box {
          width: 14px; height: 14px;
          border: 2.5px solid #fff;
          border-radius: 3px;
        }
        .ip-logo-text {
          font-size: 17px;
          font-weight: 600;
          letter-spacing: -0.02em;
          color: #F5F4F1;
        }
        .ip-nav-actions { display: flex; gap: 10px; align-items: center; }

        .btn-nav-login {
          background: transparent;
          border: 1.5px solid #4A4A48;
          color: #C5C3BB;
          padding: 8px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          font-family: inherit;
          transition: border-color 0.15s, color 0.15s, background 0.15s;
        }
        .btn-nav-login:hover {
          border-color: #888780;
          color: #F5F4F1;
          background: #333330;
        }
        .btn-nav-cta {
          background: #155dfc;
          border: none;
          color: #fff;
          padding: 8px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.15s, transform 0.12s;
        }
        .btn-nav-cta:hover { background: #1a6aff; transform: translateY(-1px); }
        .btn-nav-cta:active { transform: translateY(0); }

        /* ── HERO (Reduced vertical padding to make it significantly smaller) ── */
        .ip-hero {
          width: 100%;
          padding: 95px 40px 40px;
          text-align: center;
          background: #F5F4F1;
        }
        .ip-hero-inner { max-width: 800px; margin: 0 auto; }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #1C1C1A;
          color: #F5F4F1;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.04em;
          padding: 6px 16px 6px 10px;
          border-radius: 100px;
          margin-bottom: 24px;
        }
        .badge-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #155dfc;
          display: inline-block;
          box-shadow: 0 0 0 3px rgba(21,93,252,0.2);
        }

        .hero-h1 {
          font-family: 'Instrument Serif', Georgia, serif;
          font-size: clamp(48px, 7.5vw, 88px);
          font-weight: 400;
          line-height: 1.06;
          letter-spacing: -0.025em;
          color: #1C1C1A;
          margin-bottom: 20px;
        }
        .hero-h1 em {
          font-style: italic;
          color: #155dfc;
        }

        .hero-sub {
          font-size: 18px;
          color: #5F5E5A;
          line-height: 1.65;
          max-width: 500px;
          margin: 0 auto 32px;
        }

        .hero-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

        .btn-hero-primary {
          background: #155dfc;
          color: #fff;
          border: none;
          padding: 15px 36px;
          border-radius: 9px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.15s, transform 0.12s, box-shadow 0.15s;
          box-shadow: 0 4px 16px rgba(21,93,252,0.3);
        }
        .btn-hero-primary:hover {
          background: #1a6aff;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(21,93,252,0.35);
        }
        .btn-hero-primary:active { transform: translateY(0); }

        .btn-hero-ghost {
          background: #fff;
          color: #1C1C1A;
          border: 1.5px solid #D5D3CC;
          padding: 15px 36px;
          border-radius: 9px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          font-family: inherit;
          transition: border-color 0.15s, background 0.15s, transform 0.12s;
        }
        .btn-hero-ghost:hover {
          border-color: #1C1C1A;
          background: #ECEAE4;
          transform: translateY(-2px);
        }
        .btn-hero-ghost:active { transform: translateY(0); }

        .hero-fine {
          margin-top: 14px;
          font-size: 13px;
          color: #888780;
        }
        .hero-fine span {
          color: #155dfc;
          font-weight: 500;
        }

        /* ── STATS ── */
        .ip-stats {
          width: 100%;
          background: #1C1C1A;
          padding: 52px 40px;
        }
        .ip-stats-inner {
          max-width: 1000px;
          margin: 0 auto;
          display: flex;
          gap: 0;
          flex-wrap: wrap;
          justify-content: center;
        }
        .stat-item {
          text-align: center;
          padding: 10px 48px;
          border-right: 1px solid #2E2E2C;
        }
        .stat-item:last-child { border-right: none; }
        .stat-val {
          font-size: 32px;
          font-weight: 700;
          color: #F5F4F1;
          letter-spacing: -0.03em;
          line-height: 1;
        }
        .stat-val .accent { color: #155dfc; }
        .stat-lbl {
          font-size: 13px;
          color: #888780;
          margin-top: 5px;
          font-weight: 400;
        }

        /* ── FEATURES ── */
        .ip-features {
          width: 100%;
          padding: 100px 40px;
          background: #F5F4F1;
        }
        .ip-features-inner { max-width: 1280px; margin: 0 auto; }
        .features-header { margin-bottom: 56px; }
        .features-label {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #155dfc;
          margin-bottom: 12px;
        }
        .features-h2 {
          font-family: 'Instrument Serif', Georgia, serif;
          font-size: clamp(30px, 4vw, 44px);
          font-weight: 400;
          letter-spacing: -0.02em;
          line-height: 1.18;
          color: #1C1C1A;
          max-width: 460px;
          margin-bottom: 14px;
        }
        .features-sub { font-size: 16px; color: #5F5E5A; line-height: 1.65; max-width: 420px; }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 20px;
        }

        .feat-card {
          background: #fff;
          border: 1px solid #E2E0D9;
          border-radius: 16px;
          padding: 28px;
          position: relative;
          overflow: hidden;
          transition: box-shadow 0.22s, transform 0.22s, border-color 0.22s;
        }
        .feat-card::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: #155dfc;
          opacity: 0;
          transition: opacity 0.22s;
        }
        .feat-card:hover {
          box-shadow: 0 10px 36px rgba(21,93,252,0.10), 0 2px 8px rgba(0,0,0,0.06);
          transform: translateY(-4px);
          border-color: #C8D8FE;
        }
        .feat-card:hover::after { opacity: 1; }

        .feat-tag {
          display: inline-block;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #155dfc;
          background: #e8effe;
          padding: 3px 10px;
          border-radius: 100px;
          margin-bottom: 18px;
        }
        .feat-icon-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }
        .feat-icon-box {
          width: 42px; height: 42px;
          background: #e8effe;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .feat-title {
          font-size: 16px;
          font-weight: 600;
          letter-spacing: -0.01em;
          color: #1C1C1A;
        }
        .feat-desc {
          font-size: 14px;
          color: #5F5E5A;
          line-height: 1.65;
        }

        /* ── CTA BAND ── */
        .ip-cta {
          width: 100%;
          padding: 0 40px 100px;
        }
        .ip-cta-inner {
          max-width: 1280px;
          margin: 0 auto;
          background: #1C1C1A;
          border-radius: 24px;
          padding: 80px 60px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .ip-cta-inner::before {
          content: '';
          position: absolute;
          top: -80px; left: 50%;
          transform: translateX(-50%);
          width: 500px; height: 300px;
          background: radial-gradient(ellipse, rgba(21,93,252,0.18) 0%, transparent 70%);
          pointer-events: none;
        }
        .cta-eyebrow {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #155dfc;
          margin-bottom: 16px;
        }
        .cta-h2 {
          font-family: 'Instrument Serif', Georgia, serif;
          font-size: clamp(30px, 4vw, 52px);
          font-weight: 400;
          color: #F5F4F1;
          letter-spacing: -0.02em;
          line-height: 1.12;
          margin-bottom: 32px;
        }
        .cta-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

        .btn-cta-primary {
          background: #155dfc;
          color: #fff;
          border: none;
          padding: 15px 36px;
          border-radius: 9px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.15s, transform 0.12s;
          box-shadow: 0 4px 20px rgba(21,93,252,0.4);
        }
        .btn-cta-primary:hover { background: #1a6aff; transform: translateY(-1px); }
        .btn-cta-ghost {
          background: transparent;
          color: #C5C3BB;
          border: 1.5px solid #3A3A38;
          padding: 15px 36px;
          border-radius: 9px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          font-family: inherit;
          transition: border-color 0.15s, color 0.15s;
        }
        .btn-cta-ghost:hover { border-color: #888780; color: #F5F4F1; }

        /* ── FOOTER ── */
        .ip-footer {
          width: 100%;
          border-top: 1px solid #E2E0D9;
          padding: 40px;
          background: #F5F4F1;
        }
        .ip-footer-inner {
          max-width: 1280px;
          margin: 0 auto;
        }
        .footer-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 24px;
          padding-bottom: 24px;
          border-bottom: 1px solid #ECEAE4;
        }
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 9px;
        }
        .footer-logo-icon {
          width: 28px; height: 28px;
          background: #155dfc;
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .footer-logo-box {
          width: 12px; height: 12px;
          border: 2px solid #fff;
          border-radius: 2px;
        }
        .footer-logo-text {
          font-size: 15px;
          font-weight: 600;
          letter-spacing: -0.02em;
          color: #1C1C1A;
        }
        .footer-contacts { display: flex; gap: 28px; flex-wrap: wrap; align-items: center; }
        .footer-link {
          color: #5F5E5A;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.15s;
        }
        .footer-link:hover { color: #155dfc; }
        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
        }
        .footer-copy { font-size: 13px; color: #888780; }
        .footer-tag { font-size: 13px; color: #B4B2A9; }
      `}</style>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showRegister && (
        <Register2
          onClose={() => setShowRegister(false)}
          openLogin={() => { setShowRegister(false); setShowLogin(true); }}
        />
      )}

      <div className="ip-page">

        {/* NAV */}
        <nav className={`ip-nav${scrolled ? " scrolled" : ""}`}>
          <div className="ip-nav-inner">
            <div className="ip-logo">
              <div className="ip-logo-icon"><div className="ip-logo-box" /></div>
              <span className="ip-logo-text">InventoryPro</span>
            </div>
            <div className="ip-nav-actions">
              <button className="btn-nav-login" onClick={() => setShowLogin(true)}>Log in</button>
              <button className="btn-nav-cta" onClick={() => setShowRegister(true)}>Get started →</button>
            </div>
          </div>
        </nav>

        {/* HERO */}
        <section className="ip-hero">
          <div className="ip-hero-inner">
            <div className="hero-badge">
              <span className="badge-dot" />
              Now live · Trusted by 2,400+ businesses
            </div>
            <h1 className="hero-h1">
              Manage smarter,<br />
              <em>not harder.</em>
            </h1>
            <p className="hero-sub">
              InventoryPro gives small businesses beautiful, simple tools to manage products, orders, and customers — from one clean platform.
            </p>
            <div className="hero-actions">
              <button className="btn-hero-primary" onClick={() => setShowRegister(true)}>Start for free</button>
              <button className="btn-hero-ghost" onClick={() => setShowLogin(true)}>Demo login</button>
            </div>
            <p className="hero-fine">No credit card required · <span>Setup in 2 minutes</span></p>
          </div>
        </section>

        {/* STATS */}
        <section className="ip-stats">
          <div className="ip-stats-inner">
            {stats.map((s, i) => (
              <div key={i} className="stat-item">
                <div className="stat-val">{s.value}</div>
                <div className="stat-lbl">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section className="ip-features">
          <div className="ip-features-inner">
            <div className="features-header">
              <p className="features-label">Features</p>
              <h2 className="features-h2">Everything you need, nothing you don't.</h2>
              <p className="features-sub">Six core tools designed to run your inventory end-to-end — no complexity, no bloat.</p>
            </div>
            <div className="features-grid">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div key={i} className="feat-card">
                    <span className="feat-tag">{f.tag}</span>
                    <div className="feat-icon-row">
                      <div className="feat-icon-box">
                        <Icon size={19} color={BLUE} />
                      </div>
                      <span className="feat-title">{f.title}</span>
                    </div>
                    <p className="feat-desc">{f.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="ip-cta">
          <div className="ip-cta-inner">
            <p className="cta-eyebrow">Ready to get started?</p>
            <h2 className="cta-h2">Your inventory, finally<br />under control.</h2>
            <div className="cta-actions">
              <button className="btn-cta-primary" onClick={() => setShowRegister(true)}>Create free account</button>
              <button className="btn-cta-ghost" onClick={() => setShowLogin(true)}>Demo login</button>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="ip-footer">
          <div className="ip-footer-inner">
            <div className="footer-top">
              <div className="footer-logo">
                <div className="footer-logo-icon"><div className="footer-logo-box" /></div>
                <span className="footer-logo-text">InventoryPro</span>
              </div>
              <div className="footer-contacts">
                <a href="tel:+919336702981" className="footer-link">📞 +91 93367 02981</a>
                <a href="mailto:inventorypro25@gmail.com" className="footer-link">✉ inventorypro25@gmail.com</a>
              </div>
            </div>
            <div className="footer-bottom">
              <p className="footer-copy">© {new Date().getFullYear()} InventoryPro. Built with ❤️ for small businesses.</p>
              <p className="footer-tag">Manage smarter.</p>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
};

export default Home;