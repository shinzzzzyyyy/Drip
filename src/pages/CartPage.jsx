// src/pages/CartPage.jsx
// UPDATED: added Logout button -> /login (clears seller_authed + clears cart)
// UPDATED: adds Profile nav button

import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useCartStore from "../store/cartStore";

const formatPeso = (n) =>
  `₱${Number(n || 0).toLocaleString("en-PH", { maximumFractionDigits: 0 })}`;

export default function CartPage() {
  const navigate = useNavigate();

  const {
    cartItems,
    increaseQty,
    decreaseQty,
    removeFromCart,
    clearCart
  } = useCartStore();

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0),
        0
      ),
    [cartItems]
  );

  const shipping = cartItems.length > 0 ? 99 : 0;
  const total = subtotal + shipping;

  const logout = () => {
    localStorage.removeItem("seller_authed");
    clearCart(); // remove if you want cart to persist after logout
    navigate("/login");
  };

  return (
    <div className="dashboard-page minimal-page">
      <div className="dashboard-box minimal-box">
        {/* NAV */}
        <nav className="minimal-nav" style={{ marginBottom: 18 }}>
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
            <button className="minimal-link active">Cart</button>
            <button className="minimal-link" onClick={() => navigate("/track")}>
              Track
            </button>
            <button className="minimal-link" onClick={() => navigate("/profile")}>
              Profile
            </button>
            <button className="minimal-link" onClick={logout}>
              Logout
            </button>
          </div>
        </nav>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 14, flexWrap: "wrap", marginBottom: 18 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 44, fontWeight: 900 }}>Shopping Cart</h1>
            <p style={{ margin: "10px 0 0", color: "#8e8e8e" }}>
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
            </p>
          </div>

          <button
            className="minimal-btn"
            style={{
              background: "transparent",
              color: "white",
              border: "1px solid #2a2a2a",
              padding: "12px 16px"
            }}
            onClick={() => navigate("/dashboard")}
          >
            Continue Shopping
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div
            style={{
              background: "linear-gradient(180deg,#0f0f0f,#0b0b0b)",
              border: "1px solid #222",
              borderRadius: 26,
              padding: 44,
              textAlign: "center"
            }}
          >
            <h2 style={{ margin: 0, fontSize: 28, fontWeight: 900 }}>Your cart is empty</h2>
            <p style={{ color: "#8a8a8a", marginTop: 10 }}>Browse products and add your favorites.</p>
            <button className="minimal-btn" style={{ marginTop: 18 }} onClick={() => navigate("/dashboard")}>
              Shop Now
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 28, alignItems: "start" }}>
            {/* LEFT */}
            <div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.2fr .55fr .65fr auto",
                  gap: 12,
                  padding: "12px 14px",
                  marginBottom: 12,
                  borderRadius: 16,
                  border: "1px solid #1f1f1f",
                  background: "#0e0e0e",
                  color: "#8a8a8a",
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em"
                }}
              >
                <span>Product</span>
                <span>Price</span>
                <span>Qty</span>
                <span style={{ textAlign: "right" }}>Total</span>
              </div>

              {cartItems.map((item) => {
                const stock = Number(item.stock ?? Infinity);
                const qty = Number(item.qty || 0);
                const lineTotal = Number(item.price || 0) * qty;

                const reachedStock = Number.isFinite(stock) ? qty >= stock : false;

                return (
                  <div
                    key={item.id}
                    style={{
                      background: "#111",
                      border: "1px solid #222",
                      borderRadius: 22,
                      padding: 16,
                      marginBottom: 14
                    }}
                  >
                    <div style={{ display: "grid", gridTemplateColumns: "1.2fr .55fr .65fr auto", gap: 12, alignItems: "center" }}>
                      <div style={{ display: "flex", gap: 14, alignItems: "center", minWidth: 0 }}>
                        <div
                          style={{
                            width: 88,
                            height: 88,
                            borderRadius: 18,
                            background: "#0d0d0d",
                            border: "1px solid #1f1f1f",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                            flex: "0 0 auto"
                          }}
                        >
                          <img
                            src={item.image}
                            alt={item.name || "Product image"}
                            onError={(e) => {
                              e.target.src = "/images/products/sneakers.png";
                            }}
                            style={{ width: "100%", height: "100%", objectFit: "contain", padding: 8 }}
                          />
                        </div>

                        <div style={{ minWidth: 0 }}>
                          <h3
                            style={{
                              margin: 0,
                              fontSize: 18,
                              fontWeight: 900,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap"
                            }}
                            title={item.name}
                          >
                            {item.name}
                          </h3>

                          <div style={{ marginTop: 8, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                            {Number.isFinite(stock) && (
                              <span style={{ fontSize: 12, color: "#8a8a8a" }}>
                                Stock: <b style={{ color: "white" }}>{stock}</b>
                              </span>
                            )}

                            <button
                              onClick={() => removeFromCart(item.id)}
                              style={{
                                background: "transparent",
                                border: "none",
                                color: "#ff6262",
                                cursor: "pointer",
                                fontWeight: 900,
                                padding: 0
                              }}
                            >
                              Remove
                            </button>
                          </div>

                          {reachedStock && Number.isFinite(stock) && (
                            <div style={{ marginTop: 10, color: "#e8ff47", fontSize: 12, fontWeight: 800 }}>
                              You reached the max stock for this item.
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ color: "#d9d9d9", fontWeight: 800 }}>{formatPeso(item.price)}</div>

                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <button
                          onClick={() => decreaseQty(item.id)}
                          className="minimal-btn"
                          style={{
                            padding: "8px 12px",
                            minWidth: 40,
                            borderRadius: 14,
                            background: "transparent",
                            border: "1px solid #2a2a2a",
                            color: "white"
                          }}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>

                        <div style={{ minWidth: 28, textAlign: "center", fontWeight: 900, color: "white" }}>{qty}</div>

                        <button
                          onClick={() => increaseQty(item.id)}
                          className="minimal-btn"
                          disabled={reachedStock}
                          style={{
                            padding: "8px 12px",
                            minWidth: 40,
                            borderRadius: 14,
                            ...(reachedStock ? disabledBtn : null)
                          }}
                          aria-label="Increase quantity"
                          title={reachedStock ? "Stock limit reached" : "Increase quantity"}
                        >
                          +
                        </button>
                      </div>

                      <div style={{ textAlign: "right", fontWeight: 900, color: "#e8ff47" }}>{formatPeso(lineTotal)}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* RIGHT */}
            <div
              style={{
                position: "sticky",
                top: 18,
                background: "linear-gradient(180deg,#111,#0c0c0c)",
                border: "1px solid #222",
                borderRadius: 26,
                padding: 22
              }}
            >
              <h2 style={{ margin: 0, fontWeight: 900, fontSize: 22 }}>Order Summary</h2>

              <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
                <Row label="Subtotal" value={formatPeso(subtotal)} />
                <Row label="Shipping" value={formatPeso(shipping)} />
              </div>

              <div style={{ borderTop: "1px solid #222", margin: "18px 0" }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
                <span style={{ color: "#cfcfcf", fontWeight: 800 }}>Total</span>
                <span style={{ fontSize: 30, fontWeight: 950, color: "#e8ff47" }}>{formatPeso(total)}</span>
              </div>

              <button className="minimal-btn" style={{ width: "100%", padding: "14px 16px", borderRadius: 18 }} onClick={() => navigate("/checkout")}>
                Proceed to Checkout
              </button>

              <div style={{ marginTop: 14, padding: 14, borderRadius: 18, border: "1px solid #1f1f1f", background: "#0e0e0e", color: "#8a8a8a", fontSize: 13, lineHeight: 1.45 }}>
                <strong style={{ color: "white" }}>Note:</strong> Stock limits are enforced.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
      <span style={{ color: "#a6a6a6" }}>{label}</span>
      <span style={{ color: "white", fontWeight: 850 }}>{value}</span>
    </div>
  );
}

const disabledBtn = {
  opacity: 0.45,
  cursor: "not-allowed"
};