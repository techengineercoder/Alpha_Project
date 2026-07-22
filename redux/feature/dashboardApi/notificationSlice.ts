import baseApi from "@/redux/api/baseApi";


export const notificationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // /notifications/
        getNotification: builder.query({
            query: (params?: { limit?: number; offset?: number }) => ({
                url: "/notifications/",
                method: "GET",
                params,
            }),
            providesTags: ["Notification"],
        }),

        // /notifications/34/read/
        readSingleNotification: builder.mutation({
            query: (id) => ({
                url: `/notifications/${id}/read/`,
                method: "POST",
            }),
            invalidatesTags: ["Notification"],
        }),

        // /notifications/read-all/
        readAllNotification: builder.mutation({
            query: () => ({
                url: `/notifications/read-all/`,
                method: "PATCH",
            }),
            invalidatesTags: ["Notification"],
        }),

    }),
});

export const {
    useGetNotificationQuery,
    useReadSingleNotificationMutation,
    useReadAllNotificationMutation,
} = notificationApi;