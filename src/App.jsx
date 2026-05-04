import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ConfirmedPage from "./pages/ConfirmedPage";
import TrackPage from "./pages/TrackPage";
import ProductViewPage from "./pages/ProductViewPage";
import ProfilePage from "./pages/ProfilePage"; // ✅ ADD

import SellerPage from "./pages/SellerPage";
import SellerLoginPage from "./pages/SellerLoginPage";
import ProtectedSeller from "./components/ProtectedSeller";
import ProtectedCustomer from "./components/ProtectedCustomer";
import SeedProductsPage from "./pages/SeedProductsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ENTRY */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/seed" element={<SeedProductsPage />} />

        {/* CUSTOMER (protected) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedCustomer>
              <DashboardPage />
            </ProtectedCustomer>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedCustomer>
              <CartPage />
            </ProtectedCustomer>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedCustomer>
              <ProfilePage />
            </ProtectedCustomer>
          }
        />
        <Route
          path="/product"
          element={
            <ProtectedCustomer>
              <ProductViewPage />
            </ProtectedCustomer>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedCustomer>
              <CheckoutPage />
            </ProtectedCustomer>
          }
        />
        <Route
          path="/confirmed"
          element={
            <ProtectedCustomer>
              <ConfirmedPage />
            </ProtectedCustomer>
          }
        />
        <Route
          path="/track"
          element={
            <ProtectedCustomer>
              <TrackPage />
            </ProtectedCustomer>
          }
        />

        {/* SELLER */}
        <Route path="/seller-login" element={<SellerLoginPage />} />
        <Route
          path="/seller"
          element={
            <ProtectedSeller>
              <SellerPage />
            </ProtectedSeller>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}