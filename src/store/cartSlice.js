// src/store/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { loadState, saveState } from '../utils/localStorage';

const STORAGE_KEY = 'app_cart';

const initialState = loadState(STORAGE_KEY) || {
  items: [] // { productId, title, price, qty, image }
};

const findIndex = (items, productId) => items.findIndex(i => i.productId === productId);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const { productId, title, price, image } = action.payload;
      const idx = findIndex(state.items, productId);
      if (idx >= 0) {
        state.items[idx].qty += 1;
      } else {
        state.items.push({ productId, title, price, image, qty: 1 });
      }
      saveState(STORAGE_KEY, state);
    },
    removeFromCart(state, action) {
      state.items = state.items.filter(i => i.productId !== action.payload);
      saveState(STORAGE_KEY, state);
    },
    changeQty(state, action) {
      const { productId, qty } = action.payload;
      const idx = findIndex(state.items, productId);
      if (idx >= 0) {
        state.items[idx].qty = Math.max(1, qty);
      }
      saveState(STORAGE_KEY, state);
    },
    clearCart(state) {
      state.items = [];
      saveState(STORAGE_KEY, state);
    }
  }
});

export const { addToCart, removeFromCart, changeQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
