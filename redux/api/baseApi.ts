import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
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
      "refreshAccessToken",
      // "getArtists",
      // "getArtistById",
      // "getVenues",
      // "getVenueById",
    ];

    if (token && !noAuthEndpoints.includes(endpoint as string)) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithInterceptor: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const data = result.error.data as any;

    // Check if the error matches the token_not_valid structure
    if (data?.error?.code === "token_not_valid" || data?.error?.details?.code === "token_not_valid") {
      // Remove token from localStorage
      localStorage.removeItem("accessToken");

      // Remove token from cookies (matching authService token cookie)
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // Optionally redirect to login page
      // window.location.href = '/login';
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithInterceptor,
  tagTypes: [
    "User",
    "Artist",
    "Booking",
    "Genres",
    "Venues",
    "Session",
    "Favorites",
    "RecentSearches",
  ],
  endpoints: () => ({}),
});

export default baseApi;