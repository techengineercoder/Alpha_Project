import baseApi from "@/redux/api/baseApi";


export const venuesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // /catalog/venues/
        getVenues: builder.query({
            query: (params) => ({
                url: "/catalog/venues/",
                method: "GET",
                params,
            }),
            providesTags: ["Venues"],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(
                        venuesApi.util.invalidateTags(["RecentSearches"])
                    );
                } catch (err) {
                    // fail silently
                }
            },
        }),
        // /catalog/venues/{id}/
        getVenueById: builder.query({
            query: (id) => ({
                url: `/catalog/venues/${id}/`,
                method: "GET",
            }),
            providesTags: ["Venues"],
        }),

        // /catalog/favorites/venue/
        addVenueToFavorite: builder.mutation({
            query: (body: any) => ({
                url: `/catalog/favorites/venue/`,
                method: "POST",
                body
            }),
            invalidatesTags: ["Venues"],
        }),
        removeVenueFromFavorite: builder.mutation({
            query: (id) => ({
                url: `/catalog/favorites/venue/${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["Venues"],
        }),
        getFavoriteVenues: builder.query({
            query: (params?: any) => ({
                url: "/catalog/favorites/venue/",
                method: "GET",
                params,
            }),
            providesTags: ["Venues"],
        }),

        // /catalog/favorites/venue/share/
        shareVenue: builder.mutation({
            query: (id) => ({
                url: `/catalog/favorites/venue/share/`,
                method: "POST",
                body: id ? { venue_id: id } : {}
            }),
            invalidatesTags: ["Venues"],
        }),
        // /catalog/favorites/venue/share/
        disableShareVenue: builder.mutation({
            query: (id) => ({
                url: `/catalog/favorites/venue/share/`,
                method: "DELETE",
                body: id ? { venue_id: id } : {}
            }),
            invalidatesTags: ["Venues"],
        }),
        // /catalog/favorites/venue/shared/{token}/
        getSharedVenueList: builder.query({
            query: (token: string) => ({
                url: `/catalog/favorites/venue/shared/${token}/`,
                method: "GET",
            }),
            providesTags: ["Venues"],
        }),
        checkVenueShareStatus: builder.query({
            query: () => ({
                url: `/catalog/favorites/venue/share/`,
                method: "GET",
            }),
            providesTags: ["Venues"],
        }),


    }),
});

export const {
    useGetVenuesQuery,
    useGetVenueByIdQuery,
    useAddVenueToFavoriteMutation,
    useRemoveVenueFromFavoriteMutation,
    useGetFavoriteVenuesQuery,
    useShareVenueMutation,
    useDisableShareVenueMutation,
    useGetSharedVenueListQuery,
    useCheckVenueShareStatusQuery,
} = venuesApi;