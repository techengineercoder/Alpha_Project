import baseApi from "@/redux/api/baseApi";


export const artistApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // /catalog/artists/
        getArtists: builder.query({
            query: (params: Record<string, string>) => ({
                url: "/catalog/artists/",
                method: "GET",
                params,
            }),
            providesTags: ["Artist", "Booking"],
        }),

        // /catalog/artists/<<artist_profile_id>>/
        getArtistById: builder.query({
            query: (id: string) => ({
                url: `/catalog/artists/${id}/`,
                method: "GET",
            }),
            providesTags: ["Artist", "Booking"],
        }),

        // /catalog/recent-searches/
        getRecentSearches: builder.query({
            query: (params: Record<string, string>) => ({
                url: "/catalog/recent-searches/",
                method: "GET",
                params,
            }),
            providesTags: ["Artist"],
        }),
    }),
});

export const {
    useGetArtistsQuery,
    useGetArtistByIdQuery,
    useGetRecentSearchesQuery,
} = artistApi;