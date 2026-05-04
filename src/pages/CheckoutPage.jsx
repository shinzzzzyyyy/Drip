// src/pages/CheckoutPage.jsx
// UPDATED: checkout validates stock LIVE in Firestore and decrements stock atomically.
// Result: if another user already bought the last stock, this user gets notified.

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCartStore from "../store/cartStore";
import { db } from "../firebase";

import {
  collection,
  doc,
  runTransaction
} from "firebase/firestore";

const formatPeso = (n) =>
  `₱${Number(n || 0).toLocaleString("en-PH", { maximumFractionDigits: 0 })}`;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCartStore();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [payment, setPayment] = useState("Cash on Delivery");
  const [coupon, setCoupon] = useState("");

  const [placing, setPlacing] = useState(false);

  const pricing = useMemo(() => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0),
      0
    );
    const shipping = cartItems.length > 0 ? 99 : 0;
    const discount =
      coupon.trim().toUpperCase() === "DRIP10" ? subtotal * 0.1 : 0;
    const total = subtotal + shipping - discount;
    return { subtotal, shipping, discount, total };
  }, [cartItems, coupon]);

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="minimal-page">
        <div className="minimal-box">
          <h1 style={{ margin: "0 0 12px", fontSize: 42, fontWeight: 900 }}>
            Checkout
          </h1>

          <div
            className="minimal-card"
            style={{
              marginTop: 14,
              borderRadius: 24,
              border: "1px solid #222",
              background: "#111",
              padding: 26
            }}
          >
            <h2 style={{ margin: 0 }}>Your cart is empty</h2>
            <p style={{ marginTop: 10, color: "#8a8a8a" }}>
              Add items before checking out.
            </p>

            <button
              className="minimal-btn"
              style={{ marginTop: 14 }}
              onClick={() => navigate("/dashboard")}
            >
              Back to Shop
            </button>
          </div>
        </div>
      </div>
    );
  }

  const placeOrder = async () => {
    if (placing) return;

    if (!name.trim() || !address.trim() || !phone.trim()) {
      alert("Please fill out name, address, and phone.");
      return;
    }

    setPlacing(true);

    try {
      // Normalize cart -> items
      const requestedItems = cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: Number(item.price || 0),
        qty: Number(item.qty || 0),
        image: item.image || "/images/products/sneakers.png"
      }));

      await runTransaction(db, async (tx) => {
        // 1) Read latest product stocks
        const productDocs = new Map();

        for (const it of requestedItems) {
          const ref = doc(db, "products", it.id);
          const snap = await tx.get(ref);

          if (!snap.exists()) {
            throw new Error(`PRODUCT_MISSING:${it.name || it.id}`);
          }

          const data = snap.data();
          const liveStock = Number(data.stock || 0);

          productDocs.set(it.id, { ref, liveStock, data });
        }

        // 2) Validate availability
        for (const it of requestedItems) {
          const { liveStock } = productDocs.get(it.id);

          if (it.qty <= 0) {
            throw new Error(`INVALID_QTY:${it.name}`);
          }

          if (liveStock <= 0) {
            throw new Error(`OUT_OF_STOCK:${it.name}`);
          }

          if (it.qty > liveStock) {
            throw new Error(`NOT_ENOUGH_STOCK:${it.name}:${liveStock}`);
          }
        }

        // 3) Decrement stock
        for (const it of requestedItems) {
          const { ref, liveStock } = productDocs.get(it.id);
          tx.update(ref, { stock: liveStock - it.qty });
        }

        // 4) Create the order document inside the same transaction
        const ordersRef = doc(collection(db, "orders"));
        tx.set(ordersRef, {
          customer: name,
          address,
          phone,
          payment,

          items: requestedItems,
          subtotal: pricing.subtotal,
          shipping: pricing.shipping,
          discount: pricing.discount,
          total: pricing.total,

          status: "Preparing",
          createdAt: Date.now()
        });
      });

      clearCart();
      navigate("/confirmed");
    } catch (err) {
      const msg = String(err?.message || "");

      // Friendly messages for common stock errors
      if (msg.startsWith("OUT_OF_STOCK:")) {
        const productName = msg.split(":")[1] || "Item";
        alert(`${productName} is already out of stock.`);
      } else if (msg.startsWith("NOT_ENOUGH_STOCK:")) {
        const parts = msg.split(":");
        const productName = parts[1] || "Item";
        const left = parts[2] || "0";
        alert(`${productName}: only ${left} left in stock. Please reduce quantity.`);
      } else if (msg.startsWith("PRODUCT_MISSING:")) {
        const productName = msg.split(":")[1] || "Item";
        alert(`${productName} is no longer available.`);
      } else {
        alert("Order failed. Please try again.");
      }
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="dashboard-page minimal-page">
      <div className="dashboard-box minimal-box">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            alignItems: "center",
            flexWrap: "wrap",
            marginBottom: 18
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: 44, fontWeight: 950 }}>
              Secure Checkout
            </h1>
            <p style={{ margin: "10px 0 0", color: "#8a8a8a" }}>
              Stock is validated live before placing your order.
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
            onClick={() => navigate("/cart")}
            disabled={placing}
          >
            ← Back to Cart
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: 22,
            alignItems: "start"
          }}
        >
          {/* LEFT */}
          <div
            className="minimal-card"
            style={{
              borderRadius: 26,
              border: "1px solid #222",
              background: "#111",
              padding: 22
            }}
          >
            <Label>Full Name</Label>
            <input
              className="minimal-search"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Juan Dela Cruz"
              disabled={placing}
            />

            <Label>Address</Label>
            <input
              className="minimal-search"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street / Barangay / City"
              disabled={placing}
            />

            <Label>Phone</Label>
            <input
              className="minimal-search"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="09xx xxx xxxx"
              disabled={placing}
            />

            <Label>Payment Method</Label>
            <select
              className="minimal-search"
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
              disabled={placing}
            >
              <option>Cash on Delivery</option>
              <option>GCash</option>
              <option>Maya</option>
              <option>Credit Card</option>
            </select>

            <Label>Coupon Code</Label>
            <input
              className="minimal-search"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="DRIP10"
              disabled={placing}
            />
          </div>

          {/* RIGHT */}
          <div
            style={{
              position: "sticky",
              top: 18,
              borderRadius: 26,
              border: "1px solid #222",
              background: "linear-gradient(180deg,#111,#0c0c0c)",
              padding: 22
            }}
          >
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 950 }}>
              Order Summary
            </h2>

            <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    padding: 12,
                    borderRadius: 18,
                    border: "1px solid #1f1f1f",
                    background: "#0e0e0e"
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 950,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }}
                      title={item.name}
                    >
                      {item.name}
                    </div>
                    <div style={{ marginTop: 6, fontSize: 13, color: "#8a8a8a" }}>
                      {formatPeso(item.price)} × {item.qty}
                    </div>
                  </div>

                  <div style={{ fontWeight: 950, color: "#e8ff47" }}>
                    {formatPeso(Number(item.price || 0) * Number(item.qty || 0))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
              <Row label="Subtotal" value={formatPeso(pricing.subtotal)} />
              <Row label="Shipping" value={formatPeso(pricing.shipping)} />
              <Row
                label="Discount"
                value={`- ${formatPeso(pricing.discount)}`}
                valueStyle={{ color: pricing.discount > 0 ? "#e8ff47" : "white" }}
              />
            </div>

            <div style={{ borderTop: "1px solid #222", margin: "18px 0" }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ color: "#cfcfcf", fontWeight: 900 }}>Total</span>
              <span style={{ fontSize: 34, fontWeight: 1000, color: "#e8ff47" }}>
                {formatPeso(pricing.total)}
              </span>
            </div>

            <button
              className="minimal-btn"
              style={{ width: "100%", marginTop: 16, padding: "14px 16px", borderRadius: 18, opacity: placing ? 0.6 : 1 }}
              onClick={placeOrder}
              disabled={placing}
            >
              {placing ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Label({ children }) {
  return (
    <div
      style={{
        fontSize: 12,
        color: "#9a9a9a",
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        margin: "14px 0 8px"
      }}
    >
      {children}
    </div>
  );
}

function Row({ label, value, valueStyle }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
      <span style={{ color: "#a6a6a6" }}>{label}</span>
      <span style={{ color: "white", fontWeight: 900, ...valueStyle }}>{value}</span>
    </div>
  );
}