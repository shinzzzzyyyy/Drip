import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import useCartStore from "../store/cartStore";
import logo from "../assets/logo.png";

export default function LoginPage() {
  const navigate = useNavigate();
  const { clearCart } = useCartStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ responsive switch (because this page uses inline styles)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 920);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 920);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const styles = useMemo(() => makeStyles(isMobile), [isMobile]);

  const handleLogin = async () => {
    if (loading) return;
    setErr("");

    if (!email.trim() || !password.trim()) {
      setErr("Please enter email and password.");
      return;
    }

    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 650));
      localStorage.setItem("customer_authed", "true");
      localStorage.removeItem("seller_authed");
      localStorage.setItem("customer_email", email.trim());
      navigate("/dashboard");
    } catch (e) {
      console.error(e);
      setErr("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const goSeller = () => {
    if (loading) return;
    navigate("/seller-login");
  };

  const resetDemo = () => {
    if (loading) return;
    localStorage.removeItem("customer_authed");
    localStorage.removeItem("seller_authed");
    localStorage.removeItem("customer_email");
    clearCart();
    setEmail("");
    setPassword("");
    setErr("");
  };

  return (
    <div style={styles.page}>
      <div style={styles.orb1} />
      <div style={styles.orb2} />
      <div style={styles.orb3} />

      <div style={styles.shell}>
        {/* LEFT */}
        <div style={styles.left}>
          <img src={logo} alt="System Logo" style={styles.logoImg} />

          <div style={styles.brandText}>
            <div style={styles.brandTitle}>
              DR<span style={{ color: "#e8ff47" }}>I</span>P
            </div>
            <div style={styles.brandSub}>
              Premium streetwear store system
              <br />
              Customer + Seller dashboard
            </div>
          </div>

          <div style={styles.leftCard}>
            <div style={{ fontWeight: 950 }}>Promo</div>
            <div style={{ marginTop: 8, color: "#8a8a8a", lineHeight: 1.55 }}>
              Use coupon <b style={{ color: "white" }}>DRIP10</b> on checkout for
              10% off.
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div style={styles.right}>
          <div style={styles.panel}>
            <h1 style={styles.h1}>Sign in</h1>
            <p style={styles.p}>
              Enter your credentials to continue as a customer.
            </p>

            <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                disabled={loading}
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                disabled={loading}
              />

              {err && <div style={styles.err}>{err}</div>}

              <button
                onClick={handleLogin}
                style={{
                  ...styles.primaryBtn,
                  ...(loading ? styles.primaryBtnDisabled : null)
                }}
                disabled={loading}
              >
                {loading && <span style={styles.spinner} />}
                {loading ? "Logging in..." : "Login as Customer"}
              </button>
            </div>

            <div style={styles.divider}>
              <div style={styles.dividerLine} />
              <div style={styles.dividerText}>or</div>
              <div style={styles.dividerLine} />
            </div>

            <button
              onClick={goSeller}
              style={{
                ...styles.secondaryBtn,
                ...(loading ? styles.secondaryBtnDisabled : null)
              }}
              disabled={loading}
            >
              Continue as Seller (password required)
            </button>

            <button
              onClick={resetDemo}
              style={{
                ...styles.resetBtn,
                ...(loading ? styles.secondaryBtnDisabled : null)
              }}
              disabled={loading}
            >
              Reset demo session
            </button>

            <p style={styles.footerNote}>
              Demo-only login. For real accounts, integrate Firebase Auth.
            </p>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function makeStyles(isMobile) {
  return {
    page: {
      minHeight: "100vh",
      background:
        "radial-gradient(900px 600px at 10% 10%, rgba(232,255,71,0.10), transparent 60%), linear-gradient(135deg,#050505,#111)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: isMobile ? 16 : 28,
      position: "relative",
      overflow: "hidden"
    },

    orb1: {
      position: "absolute",
      width: 360,
      height: 360,
      borderRadius: "50%",
      background: "#e8ff47",
      filter: "blur(130px)",
      top: -90,
      left: -90,
      opacity: 0.14
    },
    orb2: {
      position: "absolute",
      width: 300,
      height: 300,
      borderRadius: "50%",
      background: "#e8ff47",
      filter: "blur(130px)",
      bottom: -80,
      right: -80,
      opacity: 0.12
    },
    orb3: {
      position: "absolute",
      width: 230,
      height: 230,
      borderRadius: "50%",
      background: "#e8ff47",
      filter: "blur(110px)",
      top: "45%",
      left: "62%",
      opacity: 0.08
    },

    shell: {
      width: "min(1100px, 100%)",
      borderRadius: 34,
      border: "1px solid rgba(255,255,255,0.07)",
      background: "rgba(20,20,20,0.72)",
      backdropFilter: "blur(14px)",
      boxShadow: "0 34px 90px rgba(0,0,0,.55)",
      overflow: "hidden",
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1.05fr 0.95fr",
      position: "relative",
      zIndex: 2
    },

    left: {
      padding: isMobile ? 22 : 42,
      borderRight: isMobile ? "none" : "1px solid rgba(255,255,255,0.06)",
      borderBottom: isMobile ? "1px solid rgba(255,255,255,0.06)" : "none"
    },
    logoImg: {
      width: isMobile ? 74 : 92,
      height: isMobile ? 74 : 92,
      objectFit: "contain",
      marginBottom: 14,
      filter: "drop-shadow(0 14px 35px rgba(0,0,0,0.55))",
      borderRadius: 18
    },
    brandText: { marginBottom: 14 },
    brandTitle: {
      fontSize: isMobile ? 44 : 54,
      fontWeight: 1000,
      letterSpacing: 3,
      lineHeight: 1
    },
    brandSub: { marginTop: 10, color: "#8f8f8f", lineHeight: 1.6 },

    leftCard: {
      marginTop: 18,
      borderRadius: 24,
      border: "1px solid #222",
      background:
        "linear-gradient(135deg, rgba(232,255,71,0.10), rgba(17,17,17,1) 60%)",
      padding: 16
    },

    right: { padding: isMobile ? 22 : 42 },
    panel: {
      borderRadius: 28,
      border: "1px solid rgba(255,255,255,0.07)",
      background: "rgba(17,17,17,0.85)",
      padding: isMobile ? 20 : 28
    },

    h1: { margin: 0, fontSize: isMobile ? 26 : 30, fontWeight: 1000 },
    p: { margin: "10px 0 0", color: "#8f8f8f", lineHeight: 1.6 },

    input: {
      width: "100%",
      padding: "16px",
      borderRadius: 16,
      border: "1px solid #222",
      background: "#111",
      color: "white",
      outline: "none"
    },

    err: { color: "#ff7b7b", fontWeight: 800, fontSize: 13 },

    spinner: {
      display: "inline-block",
      width: 14,
      height: 14,
      borderRadius: "50%",
      border: "2px solid rgba(17,17,17,0.35)",
      borderTopColor: "#111",
      marginRight: 10,
      animation: "spin .8s linear infinite",
      verticalAlign: "middle"
    },

    primaryBtn: {
      width: "100%",
      padding: "16px",
      borderRadius: 18,
      border: "none",
      background: "#e8ff47",
      color: "#111",
      fontWeight: 1000,
      cursor: "pointer",
      marginTop: 4,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center"
    },
    primaryBtnDisabled: { opacity: 0.75, cursor: "not-allowed" },

    divider: { display: "flex", alignItems: "center", gap: 12, margin: "18px 0" },
    dividerLine: { height: 1, background: "#222", flex: 1 },
    dividerText: { color: "#777", fontSize: 12 },

    secondaryBtn: {
      width: "100%",
      padding: "14px",
      borderRadius: 16,
      border: "1px solid #222",
      background: "#111",
      color: "white",
      cursor: "pointer",
      fontWeight: 900
    },
    secondaryBtnDisabled: { opacity: 0.7, cursor: "not-allowed" },

    resetBtn: {
      width: "100%",
      padding: "14px",
      borderRadius: 16,
      border: "1px solid #2a2a2a",
      background: "transparent",
      color: "white",
      cursor: "pointer",
      fontWeight: 900,
      marginTop: 10,
      opacity: 0.92
    },

    footerNote: {
      marginTop: 18,
      color: "#666",
      fontSize: 12,
      textAlign: "center",
      lineHeight: 1.5
    }
  };
}