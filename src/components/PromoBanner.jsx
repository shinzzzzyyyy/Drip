import { useMemo, useState } from "react";

export default function PromoBanner({ onShopNow }) {
  const promos = useMemo(
    () => [
      {
        id: "p1",
        title: "DRIP10 is live",
        desc: "Use coupon DRIP10 for 10% off today.",
        cta: "Use DRIP10"
      },
      {
        id: "p2",
        title: "Free shipping vibes",
        desc: "Shipping is still ₱99 — add more to make it worth it.",
        cta: "Browse bestsellers"
      },
      {
        id: "p3",
        title: "New drops weekly",
        desc: "Limited stocks. When it’s gone, it’s gone.",
        cta: "Shop new"
      }
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const [hidden, setHidden] = useState(false);

  if (hidden) return null;

  const promo = promos[index];

  return (
    <div
      style={{
        borderRadius: 22,
        border: "1px solid #222",
        background:
          "linear-gradient(135deg, rgba(232,255,71,0.12), rgba(17,17,17,1) 45%)",
        padding: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 14,
        marginBottom: 14
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            color: "#e8ff47",
            fontSize: 12,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontWeight: 900
          }}
        >
          Promo
        </div>

        <div style={{ fontSize: 18, fontWeight: 1000, marginTop: 6 }}>
          {promo.title}
        </div>

        <div
          style={{
            marginTop: 6,
            color: "#9a9a9a",
            lineHeight: 1.5,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: 740
          }}
          title={promo.desc}
        >
          {promo.desc}
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <button
          className="minimal-btn"
          style={{
            padding: "10px 14px",
            borderRadius: 14,
            background: "#e8ff47",
            color: "#111",
            fontWeight: 1000
          }}
          onClick={() => {
            if (promo.id === "p1") {
              navigator.clipboard?.writeText("DRIP10");
            }
            onShopNow?.();
          }}
          title={promo.id === "p1" ? "Copies DRIP10 to clipboard" : "Shop now"}
        >
          {promo.cta}
        </button>

        <button
          className="minimal-btn"
          style={{
            padding: "10px 12px",
            borderRadius: 14,
            background: "transparent",
            border: "1px solid #2a2a2a",
            color: "white"
          }}
          onClick={() => setIndex((i) => (i + 1) % promos.length)}
          title="Next promo"
        >
          Next
        </button>

        <button
          onClick={() => setHidden(true)}
          style={{
            background: "transparent",
            border: "none",
            color: "#8a8a8a",
            cursor: "pointer",
            fontWeight: 900
          }}
          title="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
