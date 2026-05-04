import { Navigate } from "react-router-dom";

export default function ProtectedSeller({ children }) {
  const authed = localStorage.getItem("seller_authed") === "true";

  if (!authed) {
    return <Navigate to="/seller-login" replace />;
  }

  return children;
}