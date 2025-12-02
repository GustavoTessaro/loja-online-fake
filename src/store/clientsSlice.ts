import { createSlice, nanoid } from "@reduxjs/toolkit";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

const initialState = {
  list: JSON.parse(localStorage.getItem("clients") || "[]") as Client[],
};

const save = (state: any) =>
  localStorage.setItem("clients", JSON.stringify(state.list));

const clientsSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    addClient: {
      reducer(state, action) {
        state.list.push(action.payload);
        save(state);
      },
      prepare(client) {
        return { payload: { id: nanoid(), ...client } };
      },
    },
    updateClient(state, action) {
      const index = state.list.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) state.list[index] = action.payload;
      save(state);
    },
    deleteClient(state, action) {
      state.list = state.list.filter((c) => c.id !== action.payload);
      save(state);
    },
  },
});

export const { addClient, updateClient, deleteClient } = clientsSlice.actions;

export default clientsSlice.reducer;
