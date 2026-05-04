// src/pages/DashboardPage.jsx
// FULL UPDATED VERSION (with promo "ads")
// - Adds PromoBanner + PromoCards below hero and above search
// - Logout clears customer/seller auth + clears cart + goes to /login
// - Stock limit enforced for Add to Cart
// - Avoids duplicates after seeding by preferring Firestore products
// UPDATED: logo uses src/assets import URL (works even if /logo.png is routed)
// FIXED: Profile button belongs in NAV, not inside product card

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import useCartStore from "../store/cartStore";

import PromoBanner from "../components/PromoBanner";
import PromoCards from "../components/PromoCards";

const formatPeso = (n) =>
  `₱${Number(n || 0).toLocaleString("en-PH", { maximumFractionDigits: 0 })}`;

export default function DashboardPage() {
  const navigate = useNavigate();
  const logoSrc = new URL("../assets/logo.png", import.meta.url).href;

  const { addToCart, cartItems, clearCart } = useCartStore();

  const [search, setSearch] = useState("");
  const [toastId, setToastId] = useState(null);
  const [toastMsg, setToastMsg] = useState("Added to cart");

  const [firebaseProducts, setFirebaseProducts] = useState([]);

  const defaultProducts = useMemo(
    () => [
      { id: "d1", name: "Classic Tee", price: 799, stock: 12, image: "/images/products/classic-tee.png" },
      { id: "d2", name: "Cargo Pants", price: 1499, stock: 5, image: "/images/products/cargo-pants.png" },
      { id: "d3", name: "Varsity Jacket", price: 2499, stock: 3, image: "/images/products/varsity-jacket.png" },
      { id: "d4", name: "Sneakers", price: 2999, stock: 8, image: "/images/products/sneakers.png" },
      { id: "d5", name: "Oversized Hoodie", price: 1899, stock: 6, image: "/images/products/hoodie.png" },
      { id: "d6", name: "Slim Jeans", price: 1599, stock: 10, image: "/images/products/slim-jeans.png" },
      { id: "d7", name: "Graphic Tee", price: 899, stock: 15, image: "/images/products/graphic-tee.png" },
      { id: "d8", name: "Running Shoes", price: 3299, stock: 4, image: "/images/products/running-shoes.png" },
      { id: "d9", name: "Bomber Jacket", price: 2699, stock: 7, image: "/images/products/bomber-jacket.png" },
      { id: "d10", name: "Jogger Pants", price: 1399, stock: 9, image: "/images/products/jogger-pants.png" },
      { id: "d11", name: "Tank Top", price: 699, stock: 14, image: "/images/products/tank-top.png" },
      { id: "d12", name: "High Top Sneakers", price: 3599, stock: 5, image: "/images/products/high-top.png" },
      { id: "d13", name: "Denim Jacket", price: 2299, stock: 8, image: "/images/products/denim-jacket.png" },
      { id: "d14", name: "Chino Pants", price: 1499, stock: 11, image: "/images/products/chino-pants.png" }
    ],
    []
  );

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snapshot) => {
      setFirebaseProducts(snapshot.docs.map((docu) => ({ id: docu.id, ...docu.data() })));
    });

    return () => unsub();
  }, []);

  const allProducts = useMemo(() => {
    const firebaseIds = new Set(firebaseProducts.map((p) => p.id));
    const defaultsNotInDb = defaultProducts.filter((p) => !firebaseIds.has(p.id));
    return [...defaultsNotInDb, ...firebaseProducts];
  }, [defaultProducts, firebaseProducts]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return allProducts;
    return allProducts.filter((item) =>
      String(item.name || "").toLowerCase().includes(s)
    );
  }, [allProducts, search]);

  const qtyInCart = (id) =>
    Number(cartItems.find((c) => c.id === id)?.qty || 0);

  const showToast = (id, msg) => {
    setToastId(id);
    setToastMsg(msg);
    setTimeout(() => setToastId(null), 1400);
  };

  const handleAddToCart = (product) => {
    const stock = Number(product.stock || 0);
    const current = qtyInCart(product.id);

    if (stock <= 0) {
      showToast(product.id, "Out of stock");
      return;
    }

    if (current >= stock) {
      showToast(product.id, "Stock limit reached");
      return;
    }

    addToCart(product);
    showToast(product.id, "Added to cart");
  };

  const logout = () => {
    localStorage.removeItem("customer_authed");
    localStorage.removeItem("seller_authed");
    clearCart();
    navigate("/login");
  };

  return (
    <div className="dashboard-page minimal-page">
      <div className="dashboard-box minimal-box">
        <div
          style={{
            position: "relative",
            background: "linear-gradient(135deg,#0a0a0a,#111)",
            border: "1px solid #1f1f1f",
            borderRadius: 34,
            padding: 30,
            marginBottom: 18,
            overflow: "hidden"
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 320,
              height: 320,
              borderRadius: "50%",
              background: "#e8ff47",
              filter: "blur(120px)",
              top: -110,
              left: -100,
              opacity: 0.16,
              animation: "dashOrb1 8s ease-in-out infinite"
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 260,
              height: 260,
              borderRadius: "50%",
              background: "#e8ff47",
              filter: "blur(120px)",
              right: -90,
              bottom: -90,
              opacity: 0.12,
              animation: "dashOrb2 10s ease-in-out infinite"
            }}
          />

          <nav className="minimal-nav" style={{ position: "relative", zIndex: 2 }}>
            <div
              className="minimal-logo"
              onClick={() => navigate("/dashboard")}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 10
              }}
            >
              <img
                src={logoSrc}
                alt="Logo"
                style={{ width: 34, height: 34, objectFit: "contain" }}
              />
              <span style={{ fontWeight: 1000, letterSpacing: 2 }}>
                DR<span style={{ color: "#e8ff47" }}>I</span>P
              </span>
            </div>

            <div className="minimal-links">
              <button className="minimal-link active">Shop</button>
              <button className="minimal-link" onClick={() => navigate("/cart")}>
                Cart
              </button>
              <button className="minimal-link" onClick={() => navigate("/track")}>
                Track
              </button>
              <button className="minimal-link" onClick={() => navigate("/profile")}>
                Profile
              </button>
              <button className="minimal-link" onClick={() => navigate("/seller")}>
                Seller
              </button>
              <button className="minimal-link" onClick={logout}>
                Logout
              </button>
            </div>
          </nav>

          <div style={{ position: "relative", zIndex: 2, paddingTop: 18 }}>
            <div
              style={{
                color: "#e8ff47",
                fontWeight: 900,
                letterSpacing: "0.14em",
                fontSize: 12,
                textTransform: "uppercase"
              }}
            >
              New drops weekly
            </div>

            <h1
              style={{
                fontSize: 56,
                fontWeight: 1000,
                lineHeight: 1.03,
                margin: "10px 0 0"
              }}
            >
              Premium Streetwear,
              <br />
              Built for the Bold.
            </h1>

            <p
              style={{
                color: "#9a9a9a",
                maxWidth: 560,
                lineHeight: 1.6,
                marginTop: 12
              }}
            >
              Browse the collection. Stock is limited—once it’s gone, it’s gone.
            </p>
          </div>
        </div>

        <PromoBanner onShopNow={() => window.scrollTo({ top: 0, behavior: "smooth" })} />
        <PromoCards onGoCheckout={() => navigate("/checkout")} onGoTrack={() => navigate("/track")} />

        <input
          className="minimal-search"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="minimal-grid" style={{ marginTop: 14 }}>
          {filtered.map((item) => {
            const stock = Number(item.stock || 0);
            const inCart = qtyInCart(item.id);
            const remaining = Math.max(stock - inCart, 0);

            const soldOut = stock <= 0;
            const addDisabled = remaining <= 0;

            return (
              <div
                key={item.id}
                className="minimal-card"
                style={{ position: "relative", overflow: "hidden", borderRadius: 24 }}
              >
                {toastId === item.id && (
                  <div
                    style={{
                      position: "absolute",
                      top: 12,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "#e8ff47",
                      color: "#111",
                      padding: "8px 12px",
                      borderRadius: 14,
                      fontWeight: 900,
                      fontSize: 12,
                      zIndex: 10,
                      whiteSpace: "nowrap"
                    }}
                  >
                    {toastMsg}
                  </div>
                )}

                <div style={{ position: "absolute", top: 12, right: 12, zIndex: 5 }}>
                  <span
                    style={{
                      padding: "6px 10px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 900,
                      background: soldOut
                        ? "rgba(255,77,77,0.14)"
                        : remaining <= 2
                          ? "rgba(232,255,71,0.10)"
                          : "rgba(255,255,255,0.06)",
                      border: soldOut
                        ? "1px solid rgba(255,77,77,0.35)"
                        : remaining <= 2
                          ? "1px solid rgba(232,255,71,0.25)"
                          : "1px solid rgba(255,255,255,0.10)",
                      color: soldOut ? "#ff7b7b" : remaining <= 2 ? "#e8ff47" : "#d9d9d9"
                    }}
                  >
                    {soldOut ? "Sold out" : `${remaining} left`}
                  </span>
                </div>

                <div style={{ borderRadius: 18, border: "1px solid #1f1f1f", background: "#0d0d0d", padding: 10 }}>
                  <img
                    src={item.image}
                    onError={(e) => {
                      e.target.src = "/images/products/sneakers.png";
                    }}
                    alt={item.name || "Product"}
                    style={{ width: "100%", height: 180, objectFit: "contain" }}
                  />
                </div>

                <div style={{ marginTop: 12 }}>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 950 }}>{item.name}</h3>

                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: 8 }}>
                    <p style={{ margin: 0, color: "#e8ff47", fontWeight: 1000, fontSize: 18 }}>
                      {formatPeso(item.price)}
                    </p>

                    <p style={{ margin: 0, color: "#8a8a8a", fontSize: 12 }}>
                      In cart: <b style={{ color: "white" }}>{inCart}</b>
                    </p>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
                  <button
                    className="minimal-btn"
                    disabled={addDisabled}
                    onClick={() => handleAddToCart(item)}
                    style={addDisabled ? disabledBtn : undefined}
                  >
                    Add to Cart
                  </button>

                  <button
                    className="minimal-btn"
                    disabled={soldOut}
                    style={{ background: "white", color: "#111", ...(soldOut ? disabledBtn : null) }}
                    onClick={() => navigate("/product", { state: { product: item } })}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <style>
          {`
            @keyframes dashOrb1{0%,100%{transform:translate(0,0);}50%{transform:translate(90px,70px);}}
            @keyframes dashOrb2{0%,100%{transform:translate(0,0);}50%{transform:translate(-80px,-60px);}}
          `}
        </style>
      </div>
    </div>
  );
}

const disabledBtn = {
  opacity: 0.45,
  cursor: "not-allowed"
};