import { configureStore } from "@reduxjs/toolkit";
import baseApi from "./api/baseApi";
import authReducer from "./feature/authSlice";
import { chatBotApi } from "./feature/n8n/chatBotApi";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [chatBotApi.reducerPath]: chatBotApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware, chatBotApi.middleware),
});

export default store;