export default function NavBrand({ onClick, title = "DRIP" }) {
  return (
    <div
      className="minimal-logo"
      onClick={onClick}
      style={{
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 10
      }}
      title={title}
    >
      <img
        src="/logo.png"
        alt="Logo"
        style={{ width: 34, height: 34, objectFit: "contain" }}
      />
      <span style={{ fontWeight: 1000, letterSpacing: 2 }}>
        DR<span style={{ color: "#e8ff47" }}>I</span>P
      </span>
    </div>
  );
}