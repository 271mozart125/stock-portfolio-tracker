import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accountBalance: 0,
  cashBalance: 0,
  positions: [],
  trades: [],
  selected: "",
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    trade: (state, action) => {
      const position = state.positions.find(
        (pos) => pos.ticker === action.payload.ticker
      );
      if (!position) {
        state.positions.push(action.payload);
        state.cashBalance =
          state.cashBalance / 1 - action.payload.tradeTotal / 1;
      } else if (
        position &&
        action.payload.action === "BUY" &&
        position.direction === "LONG"
      ) {
        position.quantity = position.quantity / 1 + action.payload.quantity / 1;
        position.tradeTotal =
          position.tradeTotal / 1 + action.payload.tradeTotal / 1;
        state.cashBalance =
          state.cashBalance / 1 - action.payload.tradeTotal / 1;
        position.price = position.tradeTotal / 1 / (position.quantity / 1);
        1;
      } else if (
        position &&
        action.payload.action === "SELL" &&
        position.direction === "LONG"
      ) {
        position.quantity = position.quantity / 1 + action.payload.quantity / 1;
        position.tradeTotal =
          position.tradeTotal / 1 - action.payload.tradeTotal;
        state.cashBalance =
          state.cashBalance / 1 + action.payload.tradeTotal / 1;
      } else if (
        position &&
        action.payload.action === "BUY" &&
        position.direction === "SHORT"
      ) {
        position.quantity = position.quantity / 1 + action.payload.quantity / 1;
        state.cashBalance =
          state.cashBalance / 1 + action.payload.tradeTotal / 1;
        position.tradeTotal =
          position.tradeTotal / 1 - action.payload.tradeTotal / 1;
      } else if (
        position &&
        action.payload.action === "SELL" &&
        position.direction === "SHORT"
      ) {
        position.quantity = position.quantity / 1 + action.payload.quantity / 1;
        state.cashBalance = state.cashBalance / 1 - action.payload.tradeTotal;
        position.tradeTotal =
          position.tradeTotal / 1 + action.payload.tradeTotal;
        position.price = position.tradeTotal / 1 / (position.quantity / 1);
      }

      if (position && position.quantity === 0) {
        state.accountBalance = state.accountBalance / 1 - position.tradeTotal;
        state.positions = state.positions.filter(
          (pos) => pos.ticker != position.ticker
        );
      }
    },

    balanceAdjust: (state, action) => {
      switch (action.payload.type) {
        case "DEPOSIT":
          state.accountBalance =
            state.accountBalance / 1 + action.payload.amount / 1;
          state.cashBalance = state.cashBalance / 1 + action.payload.amount / 1;
          break;
        case "WITHDRAWL":
          state.accountBalance =
            state.accountBalance / 1 - action.payload.amount / 1;
          state.cashBalance = state.cashBalance / 1 - action.payload.amount / 1;
          break;
        default:
          return state;
      }
    },

    tradeSelect: (state, action) => {
      const selector = state.positions.find(
        (pos) => pos.ticker === action.payload.ticker
      );

      state.selected = selector;
    },

    getMark: (state, action) => {
      const position = state.positions.find(
        (pos) => pos.ticker === action.payload.ticker
      );

      position.mark = action.payload.mark;

      if (position.direction === "LONG") {
        state.accountBalance =
          state.cashBalance +
          position.tradeTotal +
          (position.mark - position.price) * position.quantity;
      } else {
        state.accountBalance =
          state.cashBalance +
          position.tradeTotal +
          (position.price - position.mark) * position.quantity;
      }
    },
  },
});

export const { trade, balanceAdjust, tradeSelect, getMark } =
  accountSlice.actions;

export default accountSlice.reducer;
