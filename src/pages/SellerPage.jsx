// src/pages/SellerPage.jsx
// UPDATED: logo uses src/assets import URL (works even if /logo.png is routed)
// UPDATED: adds Restock per product (atomic increment)

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  increment // ✅ added
} from "firebase/firestore";

const formatPeso = (n) =>
  `₱${Number(n || 0).toLocaleString("en-PH", { maximumFractionDigits: 0 })}`;

export default function SellerPage() {
  const navigate = useNavigate();
  const logoSrc = new URL("../assets/logo.png", import.meta.url).href;

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");
  const [fileName, setFileName] = useState("");

  // ✅ restock input per product id
  const [restockInputs, setRestockInputs] = useState({});

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snapshot) => {
      setProducts(snapshot.docs.map((docu) => ({ id: docu.id, ...docu.data() })));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "orders"), (snapshot) => {
      setOrders(snapshot.docs.map((docu) => ({ id: docu.id, ...docu.data() })));
    });
    return () => unsub();
  }, []);

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const preparing = orders.filter((o) => o.status === "Preparing").length;
    const packed = orders.filter((o) => o.status === "Packed").length;
    const out = orders.filter((o) => o.status === "Out for Delivery").length;
    const delivered = orders.filter((o) => o.status === "Delivered").length;
    return { totalProducts, preparing, packed, out, delivered };
  }, [products, orders]);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setImage(url);
    setPreview(url);
    setFileName(file.name);
  };

  const addProduct = async () => {
    if (!name || !price || !stock) return;

    await addDoc(collection(db, "products"), {
      name,
      price: Number(price),
      stock: Number(stock),
      image: image || "/images/products/sneakers.png"
    });

    setName("");
    setPrice("");
    setStock("");
    setImage("");
    setPreview("");
    setFileName("");
  };

  const removeProduct = async (id) => {
    await deleteDoc(doc(db, "products", id));
  };

  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, "orders", id), { status });
  };

  const removeOrder = async (id) => {
    await deleteDoc(doc(db, "orders", id));
  };

  // ✅ RESTOCK: atomic increment (safe against race conditions)
  const restockProduct = async (id, restockQty) => {
    const qty = Number(restockQty);

    if (!Number.isFinite(qty) || qty <= 0) {
      alert("Restock quantity must be greater than 0");
      return;
    }

    await updateDoc(doc(db, "products", id), {
      stock: increment(qty)
    });

    // clear input for that product
    setRestockInputs((prev) => ({ ...prev, [id]: "" }));
  };

  const logout = () => {
    localStorage.removeItem("seller_authed");
    navigate("/dashboard");
  };

  return (
    <div className="dashboard-page minimal-page">
      <div className="dashboard-box minimal-box">
        <nav className="minimal-nav">
          <div
            className="minimal-logo"
            style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}
            onClick={() => navigate("/dashboard")}
          >
            <img src={logoSrc} alt="Logo" style={{ width: 34, height: 34, objectFit: "contain" }} />
            <span style={{ fontWeight: 1000, letterSpacing: 2 }}>
              DR<span style={{ color: "#e8ff47" }}>I</span>P{" "}
              <span style={{ color: "#8a8a8a", fontWeight: 800, letterSpacing: 0 }}>
                Seller
              </span>
            </span>
          </div>

          <div className="minimal-links">
            <button className="minimal-link" onClick={() => navigate("/dashboard")}>Shop</button>
            <button className="minimal-link active">Seller</button>
            <button className="minimal-link" onClick={logout}>Logout</button>
          </div>
        </nav>

        <section className="seller-content">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{stats.totalProducts}</div>
              <div className="stat-label">Products</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.preparing}</div>
              <div className="stat-label">Preparing</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.packed}</div>
              <div className="stat-label">Packed</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.out}</div>
              <div className="stat-label">Out for Delivery</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.delivered}</div>
              <div className="stat-label">Delivered</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 24, marginBottom: 28 }}>
            <div style={{ padding: 24, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24 }}>
              <h2 style={{ marginBottom: 18 }}>Add New Product</h2>
              <input
                type="text"
                placeholder="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: "100%", marginBottom: 12, padding: 12, borderRadius: 14, border: "1px solid #222", background: "#111", color: "#fff" }}
              />
              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                style={{ width: "100%", marginBottom: 12, padding: 12, borderRadius: 14, border: "1px solid #222", background: "#111", color: "#fff" }}
              />
              <input
                type="number"
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                style={{ width: "100%", marginBottom: 12, padding: 12, borderRadius: 14, border: "1px solid #222", background: "#111", color: "#fff" }}
              />
              <label className="file-input-button">
                {fileName || "Choose product image"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                />
              </label>
              {preview && (
                <img src={preview} alt="Preview" style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 16, marginBottom: 12 }} />
              )}
              <button
                onClick={addProduct}
                style={{ width: "100%", padding: 14, borderRadius: 14, border: "none", background: "#e8ff47", color: "#111", fontWeight: 700, cursor: "pointer" }}
              >
                Add Product
              </button>
            </div>

            <div style={{ padding: 24, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24 }}>
              <h2 style={{ marginBottom: 18 }}>Orders</h2>
              <div style={{ display: "grid", gap: 14 }}>
                {orders.length === 0 && <p>No orders yet.</p>}
                {orders.map((order) => (
                  <div key={order.id} style={{ display: "grid", gap: 10, padding: 16, borderRadius: 18, background: "#111", border: "1px solid #222" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                      <p style={{ margin: 0, fontWeight: 700 }}>Order ID: {order.id}</p>
                      <p style={{ margin: 0 }}>{formatPeso(order.total || 0)}</p>
                    </div>
                    <p style={{ margin: 0 }}>Status: {order.status}</p>
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      style={{ width: "100%", padding: 12, borderRadius: 14, border: "1px solid #222", background: "#111", color: "#fff" }}
                    >
                      <option value="Preparing">Preparing</option>
                      <option value="Packed">Packed</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                    <button
                      onClick={() => removeOrder(order.id)}
                      style={{ width: "100%", padding: 12, borderRadius: 14, border: "none", background: "#ff4d4d", color: "#111", fontWeight: 700, cursor: "pointer" }}
                    >
                      Remove Order
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ padding: 24, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24 }}>
            <h2 style={{ marginBottom: 18 }}>Products</h2>
            <div style={{ display: "grid", gap: 14 }}>
              {products.length === 0 && <p>No products found.</p>}
              {products.map((product) => (
                <div
                  key={product.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr auto",
                    gap: 16,
                    alignItems: "center",
                    padding: 16,
                    borderRadius: 18,
                    background: "#111",
                    border: "1px solid #222"
                  }}
                >
                  <img src={product.image} alt={product.name} style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 16 }} />

                  <div>
                    <p style={{ margin: 0, fontWeight: 700 }}>{product.name}</p>
                    <p style={{ margin: "6px 0 0", color: "#b0b0b0" }}>{formatPeso(product.price)}</p>
                    <p style={{ margin: "6px 0 0", color: "#b0b0b0" }}>Stock: {product.stock}</p>

                    {/* ✅ RESTOCK UI */}
                    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginTop: 10 }}>
                      <input
                        type="number"
                        min="1"
                        placeholder="Restock qty"
                        value={restockInputs[product.id] ?? ""}
                        onChange={(e) =>
                          setRestockInputs((prev) => ({
                            ...prev,
                            [product.id]: e.target.value
                          }))
                        }
                        style={{
                          width: 140,
                          padding: 10,
                          borderRadius: 12,
                          border: "1px solid #222",
                          background: "#0e0e0e",
                          color: "white",
                          outline: "none"
                        }}
                      />

                      <button
                        onClick={() => restockProduct(product.id, restockInputs[product.id])}
                        style={{
                          padding: "10px 14px",
                          borderRadius: 12,
                          border: "none",
                          background: "#e8ff47",
                          color: "#111",
                          fontWeight: 800,
                          cursor: "pointer"
                        }}
                      >
                        Restock
                      </button>

                      {/* optional quick buttons */}
                      <button
                        onClick={() => restockProduct(product.id, 1)}
                        style={quickBtn}
                        title="Add +1 stock"
                      >
                        +1
                      </button>
                      <button
                        onClick={() => restockProduct(product.id, 5)}
                        style={quickBtn}
                        title="Add +5 stock"
                      >
                        +5
                      </button>
                      <button
                        onClick={() => restockProduct(product.id, 10)}
                        style={quickBtn}
                        title="Add +10 stock"
                      >
                        +10
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => removeProduct(product.id)}
                    style={{ padding: "12px 16px", borderRadius: 14, border: "none", background: "#ff4d4d", color: "#111", fontWeight: 700, cursor: "pointer" }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

const quickBtn = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid #2a2a2a",
  background: "transparent",
  color: "white",
  fontWeight: 900,
  cursor: "pointer"
};