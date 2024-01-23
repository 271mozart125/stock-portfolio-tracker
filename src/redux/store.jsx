import { configureStore, combineReducers } from "@reduxjs/toolkit";
import accountReducer from "./slices/accountSlice";
import displayReducer from "./slices/displaySlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "theKey",
  version: 1,
  storage,
};

const reducer = combineReducers({
  account: accountReducer,
  display: displayReducer,
});

const persisitedReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
  reducer: persisitedReducer,
});

export default store;
