// src/pages/ProductViewPage.jsx
// FULL NEXT STEP: product page compatible with Firestore products
// UPDATED: adds Track + Profile buttons in NAV for consistency

import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import useCartStore from "../store/cartStore";

export default function ProductViewPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { addToCart } = useCartStore();

  const [toast, setToast] = useState(false);

  const product = location.state?.product;

  if (!product) {
    return (
      <div className="dashboard-page minimal-page">
        <div
          className="dashboard-box minimal-box"
          style={{
            minHeight: "80vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "18px"
          }}
        >
          <h1>Product Not Found</h1>

          <button className="minimal-btn" onClick={() => navigate("/dashboard")}>
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const handleAdd = () => {
    addToCart(product);
    setToast(true);
    setTimeout(() => setToast(false), 1500);
  };

  return (
    <div className="dashboard-page minimal-page">
      <div className="dashboard-box minimal-box">
        {/* TOAST */}
        {toast && (
          <div
            style={{
              position: "fixed",
              top: "22px",
              right: "22px",
              background: "#e8ff47",
              color: "#111",
              padding: "12px 18px",
              borderRadius: "14px",
              fontWeight: "800",
              zIndex: 999
            }}
          >
            Added to cart
          </div>
        )}

        {/* NAV */}
        <nav className="minimal-nav">
          <div
            className="minimal-logo"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/dashboard")}
          >
            DR<span style={{ color: "#e8ff47" }}>I</span>P
          </div>

          <div className="minimal-links">
            <button className="minimal-link" onClick={() => navigate("/dashboard")}>
              Shop
            </button>
            <button className="minimal-link" onClick={() => navigate("/cart")}>
              Cart
            </button>
            <button className="minimal-link" onClick={() => navigate("/track")}>
              Track
            </button>
            <button className="minimal-link" onClick={() => navigate("/profile")}>
              Profile
            </button>
          </div>
        </nav>

        {/* CONTENT */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "40px",
            marginTop: "34px"
          }}
        >
          {/* IMAGE */}
          <div
            style={{
              background: "#111",
              border: "1px solid #222",
              borderRadius: "28px",
              padding: "30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: "100%",
                maxHeight: "480px",
                objectFit: "contain"
              }}
            />
          </div>

          {/* INFO */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center"
            }}
          >
            <small style={{ color: "#e8ff47", fontWeight: "800" }}>
              DRIP COLLECTION
            </small>

            <h1 style={{ fontSize: "52px", fontWeight: "900", margin: "10px 0" }}>
              {product.name}
            </h1>

            <h2 style={{ color: "#e8ff47", fontSize: "34px", marginBottom: "18px" }}>
              ₱{product.price}
            </h2>

            <p style={{ color: "#999", lineHeight: "1.7", marginBottom: "16px" }}>
              Premium streetwear designed for comfort and everyday style.
            </p>

            <p style={{ color: "#777", marginBottom: "28px" }}>
              Stock: {product.stock}
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <button className="minimal-btn" onClick={handleAdd}>
                Add Cart
              </button>

              <button
                className="minimal-btn"
                style={{
                  background: "transparent",
                  color: "white",
                  border: "1px solid #2a2a2a"
                }}
                onClick={() => {
                  addToCart(product);
                  navigate("/checkout");
                }}
              >
                Buy Now
              </button>
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              style={{
                marginTop: "18px",
                background: "none",
                border: "none",
                color: "#777",
                cursor: "pointer",
                textAlign: "left"
              }}
            >
              ← Back to Shop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}