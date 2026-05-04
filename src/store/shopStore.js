// src/store/shopStore.js
// FULL FIX: old localStorage is overriding your new products.
// Replace ENTIRE file with this.

import { create } from "zustand";
import { persist } from "zustand/middleware";

const defaultProducts = [
  { id: 1, name: "Classic Tee", price: 799, stock: 12, image: "/images/products/classic-tee.png" },
  { id: 2, name: "Cargo Pants", price: 1499, stock: 5, image: "/images/products/cargo-pants.png" },
  { id: 3, name: "Varsity Jacket", price: 2499, stock: 3, image: "/images/products/varsity-jacket.png" },
  { id: 4, name: "Sneakers", price: 2999, stock: 8, image: "/images/products/sneakers.png" },
  { id: 5, name: "Oversized Hoodie", price: 1899, stock: 6, image: "/images/products/hoodie.png" },
  { id: 6, name: "Slim Jeans", price: 1599, stock: 10, image: "/images/products/slim-jeans.png" },
  { id: 7, name: "Graphic Tee", price: 899, stock: 15, image: "/images/products/graphic-tee.png" },
  { id: 8, name: "Running Shoes", price: 3299, stock: 4, image: "/images/products/running-shoes.png" },
  { id: 9, name: "Bomber Jacket", price: 2699, stock: 7, image: "/images/products/bomber-jacket.png" },
  { id: 10, name: "Jogger Pants", price: 1399, stock: 9, image: "/images/products/jogger-pants.png" },
  { id: 11, name: "Tank Top", price: 699, stock: 14, image: "/images/products/tank-top.png" },
  { id: 12, name: "High Top Sneakers", price: 3599, stock: 5, image: "/images/products/high-top.png" },
  { id: 13, name: "Denim Jacket", price: 2299, stock: 8, image: "/images/products/denim-jacket.png" },
  { id: 14, name: "Chino Pants", price: 1499, stock: 11, image: "/images/products/chino-pants.png" }
];

const useShopStore = create(
  persist(
    (set, get) => ({
      products: defaultProducts,
      orders: [],

      resetProducts: () =>
        set({ products: defaultProducts }),

      addProduct: (product) =>
        set((state) => ({
          products: [
            ...state.products,
            { ...product, id: Date.now() }
          ]
        })),

      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter(
            (item) => item.id !== id
          )
        })),

      reduceStock: (id, qty) =>
        set((state) => ({
          products: state.products.map((item) =>
            item.id === id
              ? {
                  ...item,
                  stock:
                    item.stock - qty >= 0
                      ? item.stock - qty
                      : 0
                }
              : item
          )
        })),

      placeOrder: (customer, cartItems) => {
        const newOrder = {
          id: Date.now(),
          customer,
          items: cartItems,
          status: "Preparing",
          createdAt:
            new Date().toLocaleString()
        };

        set((state) => ({
          orders: [...state.orders, newOrder]
        }));

        cartItems.forEach((item) => {
          get().reduceStock(
            item.id,
            item.qty
          );
        });
      },

      updateOrderStatus: (
        id,
        status
      ) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id
              ? { ...order, status }
              : order
          )
        }))
    }),
    {
      name: "shop-storage"
    }
  )
);

/* LIVE TAB SYNC */
window.addEventListener(
  "storage",
  (e) => {
    if (e.key === "shop-storage") {
      useShopStore.persist.rehydrate();
    }
  }
);

export default useShopStore;