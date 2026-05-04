// src/pages/SeedProductsPage.jsx
// Run ONCE to seed defaultProducts into Firestore with fixed IDs (d1..d14).
// After seeding, you can remove this page/route.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function SeedProductsPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const defaultProducts = [
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
  ];

  const seed = async () => {
    setBusy(true);
    setStatus("Seeding products...");

    try {
      let created = 0;
      let skipped = 0;

      for (const p of defaultProducts) {
        const ref = doc(db, "products", p.id);

        // If you want to overwrite every time, remove this getDoc check.
        const exists = (await getDoc(ref)).exists();
        if (exists) {
          skipped++;
          continue;
        }

        await setDoc(ref, {
          name: p.name,
          price: Number(p.price),
          stock: Number(p.stock),
          image: p.image
        });

        created++;
      }

      setStatus(`Done. Created: ${created}, Skipped (already existed): ${skipped}`);
    } catch (e) {
      setStatus("Seed failed. Check console + Firestore rules.");
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  const overwriteAll = async () => {
    setBusy(true);
    setStatus("Overwriting ALL default products...");

    try {
      for (const p of defaultProducts) {
        const ref = doc(db, "products", p.id);
        await setDoc(ref, {
          name: p.name,
          price: Number(p.price),
          stock: Number(p.stock),
          image: p.image
        });
      }

      setStatus("Done. Overwrote all default products.");
    } catch (e) {
      setStatus("Overwrite failed. Check console + Firestore rules.");
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="dashboard-page minimal-page">
      <div className="dashboard-box minimal-box">
        <nav className="minimal-nav">
          <div className="minimal-logo" style={{ cursor: "pointer" }} onClick={() => navigate("/dashboard")}>
            DR<span style={{ color: "#e8ff47" }}>I</span>P
          </div>
          <div className="minimal-links">
            <button className="minimal-link" onClick={() => navigate("/dashboard")}>
              Back
            </button>
          </div>
        </nav>

        <h1 style={{ margin: "18px 0 8px", fontSize: 42, fontWeight: 1000 }}>
          Seed Products
        </h1>
        <p style={{ color: "#8a8a8a", lineHeight: 1.6, maxWidth: 760 }}>
          This will insert your hardcoded default products into Firestore under the{" "}
          <b style={{ color: "white" }}>products</b> collection using IDs{" "}
          <b style={{ color: "white" }}>d1–d14</b>. Run once, then remove this page/route.
        </p>

        <div
          style={{
            marginTop: 16,
            padding: 18,
            borderRadius: 22,
            border: "1px solid #222",
            background: "#111"
          }}
        >
          <button className="minimal-btn" onClick={seed} disabled={busy}>
            {busy ? "Working..." : "Seed (only missing)"}
          </button>

          <button
            className="minimal-btn"
            style={{
              marginLeft: 12,
              background: "transparent",
              border: "1px solid rgba(255,77,77,0.35)",
              color: "#ff7b7b"
            }}
            onClick={overwriteAll}
            disabled={busy}
          >
            Overwrite ALL (danger)
          </button>

          {status && (
            <div style={{ marginTop: 14, color: "#d9d9d9", fontWeight: 800 }}>
              {status}
            </div>
          )}

          <p style={{ marginTop: 12, fontSize: 12, color: "#666", lineHeight: 1.5 }}>
            If this fails, your Firestore rules probably block writes. Temporarily allow writes for seeding, or seed from the Firebase console.
          </p>
        </div>
      </div>
    </div>
  );
}