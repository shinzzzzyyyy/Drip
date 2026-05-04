import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";

export default function SellerLoginPage() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSellerLogin = async () => {
    if (loading) return;
    setErr("");

    if (!password.trim()) {
      setErr("Please enter the seller password.");
      return;
    }

    setLoading(true);
    try {
      // small delay so you see the loading state
      await new Promise((r) => setTimeout(r, 450));

      // TODO: replace with your real password check if you have one
      // Example:
      // if (password !== "admin") { setErr("Wrong password"); return; }

      localStorage.setItem("seller_authed", "true");
      localStorage.removeItem("customer_authed");
      navigate("/seller");
    } catch (e) {
      console.error(e);
      setErr("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.panel}>
        <div style={styles.header}>
          <img src={logo} alt="Logo" style={styles.logo} />
          <div>
            <h1 style={styles.h1}>Seller Login</h1>
            <p style={styles.p}>
              Enter the seller password to access the seller dashboard.
            </p>
          </div>
        </div>

        <input
          type="password"
          placeholder="Seller password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          disabled={loading}
        />

        {err && <div style={styles.err}>{err}</div>}

        <button
          onClick={handleSellerLogin}
          style={{ ...styles.primaryBtn, ...(loading ? styles.btnDisabled : null) }}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <button
          onClick={() => navigate("/dashboard")}
          style={{ ...styles.secondaryBtn, ...(loading ? styles.btnDisabled : null) }}
          disabled={loading}
        >
          Back to Shop
        </button>

        <p style={styles.note}>
          Note: This is a simple password gate. For real security, use Firebase
          Auth + roles.
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
    background: "linear-gradient(135deg,#050505,#111)"
  },
  panel: {
    width: "min(760px, 100%)",
    borderRadius: 28,
    border: "1px solid rgba(255,255,255,0.07)",
    background: "rgba(17,17,17,0.85)",
    padding: 28
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 18
  },
  logo: {
    width: 46,
    height: 46,
    objectFit: "contain",
    borderRadius: 12
  },
  h1: { margin: 0, fontSize: 42, fontWeight: 1000 },
  p: { margin: "8px 0 0", color: "#8f8f8f", lineHeight: 1.5 },
  input: {
    width: "100%",
    padding: "16px",
    borderRadius: 16,
    border: "1px solid #222",
    background: "#111",
    color: "white",
    outline: "none"
  },
  err: { marginTop: 10, color: "#ff7b7b", fontWeight: 800, fontSize: 13 },
  primaryBtn: {
    width: "100%",
    marginTop: 14,
    padding: "16px",
    borderRadius: 18,
    border: "none",
    background: "#e8ff47",
    color: "#111",
    fontWeight: 1000,
    cursor: "pointer"
  },
  secondaryBtn: {
    width: "100%",
    marginTop: 12,
    padding: "14px",
    borderRadius: 18,
    border: "1px solid #2a2a2a",
    background: "transparent",
    color: "white",
    fontWeight: 900,
    cursor: "pointer"
  },
  btnDisabled: { opacity: 0.75, cursor: "not-allowed" },
  note: { marginTop: 14, color: "#666", fontSize: 12, lineHeight: 1.5 }
};