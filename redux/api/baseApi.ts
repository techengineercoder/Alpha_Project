import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL, // Use the local development URL here
    credentials: "include",

    prepareHeaders: (headers, { endpoint }) => {
      const token = localStorage.getItem("accessToken");

      // Endpoints that do not require an authorization token
      const noAuthEndpoints = [
        "login",
        "register",
        "resendOTP",
        "forgotPassword",
        "verifyEmail",
        "resetPassword",
        "googleLogin",
        "facebookLogin",
        "refreshAccessToken"
      ];

      if (token && !noAuthEndpoints.includes(endpoint as string)) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "User",
    "Artist",
    "Booking",
    "Genres",
    "Venues",

  ],
  endpoints: () => ({}),
});

export default baseApi;