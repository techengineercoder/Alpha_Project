import baseApi from "@/redux/api/baseApi";


export const shareFavApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // /catalog/favorites/share/
        shareList: builder.mutation({
            query: (body) => ({
                url: "/catalog/favorites/artist/share/",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Favorites"],
        }),
        // /catalog/favorites/share/
        disableShareList: builder.mutation({
            query: (body) => ({
                url: "/catalog/favorites/artist/share/",
                method: "DELETE",
                body,
            }),
            invalidatesTags: ["Favorites"],
        }),

        // /catalog/favorites/shared/7a8b6c29-a221-4d08-aa76-44eed70326e7/
        getShareList: builder.query({
            query: (id: string) => ({
                url: `/catalog/favorites/artist/shared/${id}/`,
                method: "GET",
            }),
            providesTags: ["Favorites"],
        }),
        // /catalog/favorites/share/
        shareStatusCheck: builder.query({
            query: () => ({
                url: `/catalog/favorites/artist/share/`,
                method: "GET",
            }),
            providesTags: ["Favorites"],
        }),

    }),
});

export const {
    useShareListMutation,
    useDisableShareListMutation,
    useGetShareListQuery,
    useShareStatusCheckQuery,
} = shareFavApi;