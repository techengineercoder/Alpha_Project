import baseApi from "@/redux/api/baseApi";


export const bookingtApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // /bookings/offers/
        bookingList: builder.query({
            query: (params?: Record<string, any>) => ({
                url: "/bookings/offers/",
                method: "GET",
                params,
            }),
            providesTags: ["Booking"],
        }),
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
            invalidatesTags: ["Favorites"],
        }),
        // /catalog/favorites/<<id>>/
        removeFavorites: builder.mutation({
            query: (id: string) => ({
                url: `/catalog/favorites/${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["Favorites"],
        }),

        // /catalog/favorites/
        getFavorites: builder.query({
            query: () => ({
                url: "/catalog/favorites/",
                method: "GET",
            }),
            providesTags: ["Favorites"],
        }),

        // /bookings/dashboard/
        getDashboard: builder.query({
            query: () => ({
                url: "/bookings/dashboard/",
                method: "GET",
            }),
            providesTags: ["Booking"],
        }),

        // /bookings/offers/<<offer_id>>/accept/
        // /bookings/offers/<<offer_id>>/reject/
        acceptOffer: builder.mutation({
            query: (id: string) => ({
                url: `/bookings/offers/${id}/accept/`,
                method: "POST",
            }),
            invalidatesTags: ["Booking"],
        }),
        rejectOffer: builder.mutation({
            query: (id: string) => ({
                url: `/bookings/offers/${id}/reject/`,
                method: "POST",
            }),
            invalidatesTags: ["Booking"],
        }),

    }),
});

export const {
    useBookingListQuery,
    useCreateBookingMutation,
    useAddFavoritesMutation,
    useRemoveFavoritesMutation,
    useGetFavoritesQuery,
    useGetDashboardQuery,
    useAcceptOfferMutation,
    useRejectOfferMutation
} = bookingtApi;