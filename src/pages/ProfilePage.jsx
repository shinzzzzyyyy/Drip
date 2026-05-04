import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import useCartStore from "../store/cartStore";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { clearCart } = useCartStore();

  const email = useMemo(() => (localStorage.getItem("customer_email") || "").trim(), []);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: ""
  });

  const [msg, setMsg] = useState("");

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setMsg("");

      if (!email) {
        setLoading(false);
        setMsg("No customer email found. Please log in again.");
        return;
      }

      try {
        const ref = doc(db, "profiles", email);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          await setDoc(ref, {
            email,
            name: "",
            phone: "",
            address: "",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });

          setForm({ name: "", phone: "", address: "" });
        } else {
          const data = snap.data() || {};
          setForm({
            name: data.name || "",
            phone: data.phone || "",
            address: data.address || ""
          });
        }
      } catch (e) {
        console.error(e);
        setMsg("Failed to load profile. Check Firestore rules/connection.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [email]);

  const logout = () => {
    localStorage.removeItem("customer_authed");
    localStorage.removeItem("seller_authed");
    localStorage.removeItem("customer_email");
    clearCart();
    navigate("/login");
  };

  const save = async () => {
    setMsg("");

    if (!email) {
      setMsg("No customer email found. Please log in again.");
      return;
    }

    setSaving(true);
    try {
      const ref = doc(db, "profiles", email);
      await updateDoc(ref, {
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        updatedAt: serverTimestamp()
      });
      setMsg("Profile saved.");
    } catch (e) {
      console.error(e);
      setMsg("Failed to save profile.");
    } finally {
      setSaving(false);
    }
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
            <button className="minimal-link" onClick={() => navigate("/cart")}>
              Cart
            </button>
            <button className="minimal-link" onClick={() => navigate("/track")}>
              Track
            </button>
            <button className="minimal-link active">Profile</button>
            <button className="minimal-link" onClick={logout}>
              Logout
            </button>
          </div>
        </nav>

        <h1 style={{ margin: 0, fontSize: 44, fontWeight: 1000 }}>Your Profile</h1>
        <p style={{ margin: "10px 0 0", color: "#8a8a8a" }}>
          Saved in Firestore • {email || "unknown"}
        </p>

        <div
          style={{
            marginTop: 18,
            borderRadius: 26,
            border: "1px solid #222",
            background: "linear-gradient(180deg,#111,#0b0b0b)",
            padding: 20,
            maxWidth: 720
          }}
        >
          {loading ? (
            <div style={{ color: "#8a8a8a" }}>Loading profile…</div>
          ) : (
            <>
              <label style={styles.label}>Full name</label>
              <input
                className="minimal-search"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Juan Dela Cruz"
              />

              <label style={styles.label}>Phone</label>
              <input
                className="minimal-search"
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                placeholder="e.g. 09xxxxxxxxx"
              />

              <label style={styles.label}>Address</label>
              <textarea
                value={form.address}
                onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                placeholder="Delivery address"
                style={styles.textarea}
              />

              {msg && (
                <div style={{ marginTop: 12, color: msg.includes("Failed") ? "#ff7b7b" : "#e8ff47", fontWeight: 900 }}>
                  {msg}
                </div>
              )}

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
                <button className="minimal-btn" onClick={save} disabled={saving}>
                  {saving ? "Saving..." : "Save Profile"}
                </button>

                <button
                  className="minimal-btn"
                  style={{ background: "transparent", border: "1px solid #2a2a2a", color: "white" }}
                  onClick={() => navigate("/dashboard")}
                >
                  Back to Shop
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  label: {
    display: "block",
    marginTop: 14,
    marginBottom: 8,
    color: "#8a8a8a",
    fontWeight: 800,
    fontSize: 13
  },
  textarea: {
    width: "100%",
    minHeight: 110,
    marginTop: 0,
    padding: 14,
    borderRadius: 18,
    border: "1px solid #222",
    background: "#0e0e0e",
    color: "white",
    outline: "none",
    resize: "vertical"
  }
};