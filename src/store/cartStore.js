import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Cart item shape expected across your pages:
 * {
 *   id: string,
 *   name: string,
 *   price: number,
 *   stock?: number,
 *   image?: string,
 *   qty: number
 * }
 */

const normalizeProduct = (product) => {
  const id = product?.id;
  const name = product?.name ?? "Unnamed Product";
  const price = Number(product?.price || 0);
  const stock =
    product?.stock === undefined || product?.stock === null
      ? undefined
      : Number(product.stock);
  const image = product?.image;

  return { id, name, price, stock, image };
};

const clampQtyToStock = (qty, stock) => {
  // if stock is missing, treat as unlimited
  if (stock === undefined || stock === null || Number.isNaN(stock)) return qty;
  return Math.max(0, Math.min(qty, Number(stock)));
};

const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],

      // Add 1 qty, but never exceed stock (if stock exists).
      // Returns { ok, reason } so UI can show messages if you want.
      addToCart: (product) => {
        const p = normalizeProduct(product);
        if (!p.id) return { ok: false, reason: "invalid_product" };

        const { cartItems } = get();
        const existing = cartItems.find((i) => i.id === p.id);

        // if stock is defined and <= 0 => sold out
        if (p.stock !== undefined && p.stock <= 0) {
          return { ok: false, reason: "out_of_stock" };
        }

        // compute new qty
        const currentQty = existing ? Number(existing.qty || 0) : 0;
        const wantedQty = currentQty + 1;

        const nextQty =
          p.stock !== undefined ? clampQtyToStock(wantedQty, p.stock) : wantedQty;

        // reached limit
        if (p.stock !== undefined && nextQty <= currentQty) {
          return { ok: false, reason: "stock_limit" };
        }

        set((state) => {
          // refresh stock/name/price/image from latest product object
          if (existing) {
            return {
              cartItems: state.cartItems.map((item) =>
                item.id === p.id
                  ? {
                      ...item,
                      ...p,
                      qty: nextQty
                    }
                  : item
              )
            };
          }

          return {
            cartItems: [
              ...state.cartItems,
              {
                ...p,
                qty: nextQty <= 0 ? 1 : nextQty // safety
              }
            ]
          };
        });

        return { ok: true };
      },

      // Increase qty by 1, but never exceed stock (if stock exists).
      // Returns { ok, reason }
      increaseQty: (id) => {
        const { cartItems } = get();
        const existing = cartItems.find((i) => i.id === id);
        if (!existing) return { ok: false, reason: "not_found" };

        const stock =
          existing.stock === undefined || existing.stock === null
            ? undefined
            : Number(existing.stock);

        if (stock !== undefined && stock <= 0) {
          return { ok: false, reason: "out_of_stock" };
        }

        const currentQty = Number(existing.qty || 0);
        const wantedQty = currentQty + 1;
        const nextQty = stock !== undefined ? clampQtyToStock(wantedQty, stock) : wantedQty;

        if (stock !== undefined && nextQty <= currentQty) {
          return { ok: false, reason: "stock_limit" };
        }

        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.id === id ? { ...item, qty: nextQty } : item
          )
        }));

        return { ok: true };
      },

      // Decrease qty by 1; if it would go to 0, item is removed (common e-commerce behavior).
      // If you prefer min qty = 1, tell me and I'll switch it back.
      decreaseQty: (id) => {
        const { cartItems } = get();
        const existing = cartItems.find((i) => i.id === id);
        if (!existing) return { ok: false, reason: "not_found" };

        const currentQty = Number(existing.qty || 0);
        const nextQty = currentQty - 1;

        if (nextQty <= 0) {
          set((state) => ({
            cartItems: state.cartItems.filter((item) => item.id !== id)
          }));
          return { ok: true, removed: true };
        }

        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.id === id ? { ...item, qty: nextQty } : item
          )
        }));

        return { ok: true };
      },

      removeFromCart: (id) =>
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.id !== id)
        })),

      clearCart: () => set({ cartItems: [] }),

      // Optional helper: set qty directly (also clamps to stock)
      setQty: (id, qty) => {
        const { cartItems } = get();
        const existing = cartItems.find((i) => i.id === id);
        if (!existing) return { ok: false, reason: "not_found" };

        const stock =
          existing.stock === undefined || existing.stock === null
            ? undefined
            : Number(existing.stock);

        const safeQty = Math.floor(Number(qty || 0));
        const clamped = stock !== undefined ? clampQtyToStock(safeQty, stock) : Math.max(0, safeQty);

        if (clamped <= 0) {
          set((state) => ({
            cartItems: state.cartItems.filter((item) => item.id !== id)
          }));
          return { ok: true, removed: true };
        }

        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.id === id ? { ...item, qty: clamped } : item
          )
        }));

        return { ok: true };
      }
    }),
    {
      name: "cart-storage",
      version: 1
    }
  )
);

// Keep cart in sync across tabs/windows
window.addEventListener("storage", (e) => {
  if (e.key === "cart-storage") {
    useCartStore.persist.rehydrate();
  }
});

export default useCartStore;