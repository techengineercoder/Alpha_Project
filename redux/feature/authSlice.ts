import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  image: string | null;
  phone: string;
  email_verified_at: string;
  last_seen_at: string | null;
  is_staff: boolean;
  created_at: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refresh: string | null;
  isAuthenticated: boolean;
}

const getInitialState = (): AuthState => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    const refresh = localStorage.getItem("refreshToken");
    const user = localStorage.getItem("user");

    if (token && user) {
      return {
        user: JSON.parse(user),
        token,
        refresh,
        isAuthenticated: true,
      };
    }
  }

  return {
    user: null,
    token: null,
    refresh: null,
    isAuthenticated: false,
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ user: User; access: string; refresh: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.access;
      state.refresh = action.payload.refresh;
      state.isAuthenticated = true;

      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", action.payload.access);
        localStorage.setItem("refreshToken", action.payload.refresh);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refresh = null;
      state.isAuthenticated = false;

      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      }
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;