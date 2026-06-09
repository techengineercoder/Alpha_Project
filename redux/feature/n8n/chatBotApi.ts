import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Replace with your base URL
// const API_URL = "http://10.10.12.111:8001/ai/api";
const API_URL = "http://31.220.59.215:5678/webhook/0e1cd1fa-5f4d-4184-be07-9d58929172b4";

export const chatBotApi = createApi({
    reducerPath: "chatApi",
    tagTypes: ["Session"],
    baseQuery: fetchBaseQuery({
        baseUrl: API_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("accessToken");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        chat: builder.mutation({
            query: (data) => ({
                url: "/chat",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Session"],
        }),
    }),
});

export const {
    useChatMutation
} = chatBotApi;