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
            providesTags: ["Artist"],
        }),

        // /catalog/artists/<<artist_profile_id>>/
        getArtistById: builder.query({
            query: (id: string) => ({
                url: `/catalog/artists/${id}/`,
                method: "GET",
            }),
            providesTags: ["Artist"],
        }),
    }),
});

export const {
    useGetArtistsQuery,
    useGetArtistByIdQuery,
} = artistApi;