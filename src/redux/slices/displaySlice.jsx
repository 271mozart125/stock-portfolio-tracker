import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  trading: false,
  balance: false,
  priorTrade: false,
};
export const displaySlice = createSlice({
  name: "display",
  initialState,
  reducers: {
    trader: (state, action) => {
      switch (action.payload) {
        case "close":
          state.trading = false;
          break;
        case "open":
          state.trading = true;
          break;
        default:
          return state;
      }
    },

    balanceModal: (state, action) => {
      switch (action.payload) {
        case "close":
          state.balance = false;
          break;
        case "open":
          state.balance = true;
          break;
        default:
          return state;
      }
    },

    priorTradeModal: (state, action) => {
      switch (action.payload) {
        case "close":
          state.priorTrade = false;
          break;
        case "open":
          state.priorTrade = true;
          break;
        default:
          return state;
      }
    },
  },
});

export const { trader, balanceModal, priorTradeModal } = displaySlice.actions;

export default displaySlice.reducer;
