export default function PromoCards({ onGoCheckout, onGoTrack }) {
  const cards = [
    {
      title: "10% OFF",
      subtitle: "Use DRIP10",
      desc: "Apply coupon on checkout.",
      action: "Go to Checkout",
      onClick: onGoCheckout
    },
    {
      title: "Track Orders",
      subtitle: "Live status",
      desc: "See Preparing → Packed → Delivered.",
      action: "Track Now",
      onClick: onGoTrack
    },
    {
      title: "Limited Stock",
      subtitle: "First come, first served",
      desc: "Stock is shared across users (Firestore).",
      action: "Shop Now",
      onClick: null
    }
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: 12,
        marginBottom: 14
      }}
    >
      {cards.map((c) => (
        <div
          key={c.title}
          style={{
            borderRadius: 22,
            border: "1px solid #222",
            background: "#111",
            padding: 16
          }}
        >
          <div style={{ color: "#e8ff47", fontWeight: 1000, fontSize: 22 }}>
            {c.title}
          </div>
          <div style={{ marginTop: 6, fontWeight: 950 }}>{c.subtitle}</div>
          <div style={{ marginTop: 8, color: "#8a8a8a", lineHeight: 1.5 }}>
            {c.desc}
          </div>

          {c.onClick && (
            <button
              className="minimal-btn"
              style={{
                marginTop: 12,
                padding: "10px 14px",
                borderRadius: 14,
                background: "transparent",
                border: "1px solid #2a2a2a",
                color: "white"
              }}
              onClick={c.onClick}
            >
              {c.action}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}