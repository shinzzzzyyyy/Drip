import { Navigate } from "react-router-dom";

export default function ProtectedCustomer({ children }) {
  const authed = localStorage.getItem("customer_authed") === "true";

  if (!authed) {
    return <Navigate to="/login" replace />;
  }

  return children;
}