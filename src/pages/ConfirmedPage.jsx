// src/pages/ConfirmedPage.jsx
// Updated: more e-commerce looking confirmation (receipt-like card + actions)

import { useNavigate } from "react-router-dom";

export default function ConfirmedPage() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-page minimal-page">
      <div
        className="dashboard-box minimal-box"
        style={{
          minHeight: "85vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 760,
            borderRadius: 30,
            border: "1px solid #222",
            background: "linear-gradient(180deg,#111,#0b0b0b)",
            padding: "44px 34px",
            position: "relative",
            overflow: "hidden"
          }}
        >
          {/* accent glow */}
          <div
            style={{
              position: "absolute",
              width: 260,
              height: 260,
              borderRadius: "50%",
              background: "#e8ff47",
              filter: "blur(110px)",
              opacity: 0.13,
              top: -120,
              right: -120
            }}
          />

          {/* header */}
          <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
            <div
              style={{
                width: 92,
                height: 92,
                borderRadius: "50%",
                margin: "0 auto 18px",
                background: "#e8ff47",
                color: "#111",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 44,
                fontWeight: 1000
              }}
            >
              ✓
            </div>

            <h1 style={{ margin: 0, fontSize: 46, fontWeight: 1000, letterSpacing: "-0.5px" }}>
              Order Confirmed
            </h1>

            <p
              style={{
                color: "#9a9a9a",
                fontSize: 16,
                lineHeight: 1.65,
                maxWidth: 560,
                margin: "14px auto 0"
              }}
            >
              Thanks for shopping with DRIP. Your order is now in the queue and will move through the preparation stages. You can track live updates anytime.
            </p>
          </div>

          {/* receipt */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              marginTop: 26,
              borderRadius: 22,
              border: "1px solid #1f1f1f",
              background: "#0e0e0e",
              padding: 18
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 12, color: "#8a8a8a", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                  Next steps
                </div>
                <div style={{ marginTop: 8, color: "#d9d9d9", lineHeight: 1.6 }}>
                  • Track status in the tracker page<br />
                  • Seller will update to Packed → Out for Delivery → Delivered
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, color: "#8a8a8a", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                  Support
                </div>
                <div style={{ marginTop: 8, color: "#d9d9d9" }}>
                  Check your order in <span style={{ color: "#e8ff47", fontWeight: 900 }}>Track</span>
                </div>
              </div>
            </div>
          </div>

          {/* actions */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginTop: 18
            }}
          >
            <button className="minimal-btn" onClick={() => navigate("/track")}>
              Track Order
            </button>

            <button
              className="minimal-btn"
              style={{
                background: "transparent",
                color: "white",
                border: "1px solid #2a2a2a"
              }}
              onClick={() => navigate("/dashboard")}
            >
              Continue Shopping
            </button>
          </div>

          <p style={{ marginTop: 16, fontSize: 12, color: "#666", textAlign: "center", position: "relative", zIndex: 2 }}>
            Keep this tab open if you want to track updates in real-time.
          </p>
        </div>
      </div>
    </div>
  );
}