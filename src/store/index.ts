import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./productsSlice"; 
import clientsReducer from "./clientsSlice";
import cartReducer from "./cartSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    clients: clientsReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
