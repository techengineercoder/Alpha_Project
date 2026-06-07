import baseApi from "@/redux/api/baseApi";


export const bookingtApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // /bookings/offers/
        createBooking: builder.mutation({
            query: (data: Record<string, any>) => ({
                url: "/bookings/offers/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Booking"],
        }),

        // /catalog/favorites/
        addFavorites: builder.mutation({
            query: (data: Record<string, string>) => ({
                url: "/catalog/favorites/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Booking"],
        }),

        // /catalog/favorites/
        getFavorites: builder.query({
            query: () => ({
                url: "/catalog/favorites/",
                method: "GET",
            }),
            providesTags: ["Booking"],
        }),

        // /bookings/dashboard/
        getDashboard: builder.query({
            query: () => ({
                url: "/bookings/dashboard/",
                method: "GET",
            }),
            providesTags: ["Booking"],
        }),
    }),
});

export const {
    useCreateBookingMutation,
    useAddFavoritesMutation,
    useGetFavoritesQuery,
    useGetDashboardQuery
} = bookingtApi;