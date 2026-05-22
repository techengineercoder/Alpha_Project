import baseApi from "@/redux/api/baseApi";


export const genresApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // /catalog/genres/
        getGenres: builder.query({
            query: () => ({
                url: "/catalog/genres/",
                method: "GET",
            }),
            providesTags: ["Genres"],
        }),

    }),
});

export const {
    useGetGenresQuery,
} = genresApi;