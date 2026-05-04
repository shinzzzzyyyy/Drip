// src/pages/TrackPage.jsx
// UPDATED: added Logout button -> /login
// UPDATED: adds Profile nav button

import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import useCartStore from "../store/cartStore";

const formatPeso = (n) =>
  `₱${Number(n || 0).toLocaleString("en-PH", { maximumFractionDigits: 0 })}`;

export default function TrackPage() {
  const navigate = useNavigate();
  const { clearCart } = useCartStore();

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map((docu) => ({ id: docu.id, ...docu.data() })));
    });
    return () => unsub();
  }, []);

  const getStep = (status) => {
    if (status === "Preparing") return 1;
    if (status === "Packed") return 2;
    if (status === "Out for Delivery") return 3;
    if (status === "Delivered") return 4;
    return 1;
  };

  const empty = useMemo(() => orders.length === 0, [orders]);

  const logout = () => {
    localStorage.removeItem("seller_authed");
    clearCart(); // optional
    navigate("/login");
  };

  return (
    <div className="dashboard-page minimal-page">
      <div className="dashboard-box minimal-box">
        {/* NAV */}
        <nav className="minimal-nav">
          <div className="minimal-logo" style={{ cursor: "pointer" }} onClick={() => navigate("/dashboard")}>
            DR<span style={{ color: "#e8ff47" }}>I</span>P
          </div>

          <div className="minimal-links">
            <button className="minimal-link" onClick={() => navigate("/dashboard")}>
              Shop
            </button>
            <button className="minimal-link active">Track</button>
            <button className="minimal-link" onClick={() => navigate("/cart")}>
              Cart
            </button>
            <button className="minimal-link" onClick={() => navigate("/profile")}>
              Profile
            </button>
            <button className="minimal-link" onClick={logout}>
              Logout
            </button>
          </div>
        </nav>

        <div style={{ margin: "18px 0 18px" }}>
          <h1 style={{ margin: 0, fontSize: 44, fontWeight: 1000 }}>Order Tracking</h1>
          <p style={{ margin: "10px 0 0", color: "#8a8a8a" }}>Live status updates from Firestore.</p>
        </div>

        {empty ? (
          <div style={{ background: "linear-gradient(180deg,#111,#0b0b0b)", border: "1px solid #222", borderRadius: 26, padding: 44, textAlign: "center" }}>
            <h2 style={{ margin: 0, fontSize: 28, fontWeight: 950 }}>No orders yet</h2>
            <p style={{ color: "#8a8a8a", marginTop: 10 }}>Place an order first to see it here.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {orders.map((order) => {
              const step = getStep(order.status);
              const items =
                Array.isArray(order.items) && order.items.length > 0
                  ? order.items
                  : order.product
                    ? [{ name: order.product, qty: 1, price: 0 }]
                    : [];

              return (
                <div key={order.id} style={{ background: "#111", border: "1px solid #222", borderRadius: 26, padding: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
                    <div>
                      <h2 style={{ margin: 0, fontWeight: 950 }}>{order.customer}</h2>
                      <p style={{ margin: "8px 0 0", color: "#8a8a8a" }}>
                        Order <span style={{ color: "white", fontWeight: 900 }}>#{order.id.slice(0, 6)}</span>
                      </p>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: "#e8ff47", fontWeight: 1000 }}>{order.status}</div>
                      <div style={{ marginTop: 8, color: "#8a8a8a", fontSize: 13 }}>
                        Total: <span style={{ color: "white", fontWeight: 900 }}>{formatPeso(order.total)}</span>
                      </div>
                    </div>
                  </div>

                  {items.length > 0 && (
                    <div style={{ marginBottom: 14, padding: 14, borderRadius: 18, border: "1px solid #1f1f1f", background: "#0e0e0e" }}>
                      {items.map((item, i) => (
                        <div key={item.id || i} style={{ display: "flex", justifyContent: "space-between", color: "#b1b1b1", marginBottom: 8 }}>
                          <span>
                            {item.name} × {item.qty}
                          </span>
                          <span>{item.price && item.qty ? formatPeso(Number(item.price) * Number(item.qty)) : ""}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
                    {[
                      { label: "Preparing", idx: 1 },
                      { label: "Packed", idx: 2 },
                      { label: "Delivery", idx: 3 },
                      { label: "Done", idx: 4 }
                    ].map((s) => {
                      const active = s.idx <= step;

                      return (
                        <div key={s.label} style={{ textAlign: "center" }}>
                          <div
                            style={{
                              width: 42,
                              height: 42,
                              borderRadius: "50%",
                              margin: "0 auto 10px",
                              background: active ? "#e8ff47" : "#2a2a2a",
                              boxShadow: active ? "0 0 0 6px rgba(232,255,71,0.10)" : "none"
                            }}
                          />
                          <small style={{ color: "#8a8a8a", fontWeight: 800 }}>{s.label}</small>
                        </div>
                      );
                    })}
                  </div>

                  <p style={{ marginTop: 14, color: "#666", fontSize: 12 }}>Tip: Status is updated by the seller dashboard.</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}