export function logout({ clearCart, navigate }) {
  // remove seller access (so customer can't jump back into seller without password)
  localStorage.removeItem("seller_authed");

  // optional: clear cart on logout (uncomment if you want)
  if (typeof clearCart === "function") clearCart();

  // go back to login (or "/")
  navigate("/");
}