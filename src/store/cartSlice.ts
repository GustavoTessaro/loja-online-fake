import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { loadState, saveState } from '../utils/localStorage';

const STORAGE_KEY = 'app_cart';

export interface CartItem {
  productId: string | number;
  title: string;
  price: number;
  image?: string;
  qty: number;
}

export interface CartState {
  items: CartItem[];
}

const initialState: CartState = (loadState(STORAGE_KEY) as CartState) || {
  items: [],
};

const findIndex = (items: CartItem[], productId: string | number): number =>
  items.findIndex((i) => String(i.productId) === String(productId));

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(
      state,
      action: PayloadAction<Omit<CartItem, 'qty'>>
    ) {
      const { productId, title, price, image } = action.payload;
      const idx = state.items.findIndex((i) => String(i.productId) === String(productId));
      if (idx >= 0) {
        state.items[idx].qty += 1;
      } else {
        state.items.push({ productId, title, price, image, qty: 1 });
      }
      saveState(STORAGE_KEY, state);
    },
    removeFromCart(state, action: PayloadAction<string | number>) {
      console.log('Removing productId:', action.payload);
      console.log('Current items:', state.items);
      state.items = state.items.filter((i) => String(i.productId) !== String(action.payload));
      console.log('Items after filter:', state.items);
      saveState(STORAGE_KEY, state);
    },
    changeQty(
      state,
      action: PayloadAction<{ productId: string | number; qty: number }>
    ) {
      const { productId, qty } = action.payload;
      const idx = state.items.findIndex((i) => String(i.productId) === String(productId));
      if (idx >= 0) {
        state.items[idx].qty = Math.max(1, qty);
      }
      saveState(STORAGE_KEY, state);
    },
    clearCart(state) {
      state.items = [];
      saveState(STORAGE_KEY, state);
    },
  },
});

export const { addToCart, removeFromCart, changeQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
