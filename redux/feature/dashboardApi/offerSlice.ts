import baseApi from "@/redux/api/baseApi";


export const offerApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // /api/v1/offers/
        getAllOffer: builder.query({
            query: (params) => ({
                url: `/offers/`,
                method: "GET",
                params,
            }),
            providesTags: ["Offer"],
        }),

        // /api/v1/offers/one/
        getOfferById: builder.query({
            query: (id) => ({
                url: `/offers/${id}/`,
                method: "GET",
            }),
            providesTags: ["Offer"],
        }),

        // /api/v1/offers/
        createOffer: builder.mutation({
            query: (data) => ({
                url: `/offers/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Offer"],
        }),

        //         PUT
        // /api/v1/offers/{offer_id}/
        updateOffer: builder.mutation({
            query: ({ id, data }) => ({
                url: `/offers/${id}/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Offer"],
        }),

        // /api/v1/offers/{offer_id}/share/
        shareOffer: builder.mutation({
            query: ({ id, data }: { id: string; data: any }) => ({
                url: `/offers/${id}/share/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Offer"],
        }),

        // /api/v1/offers/{offer_id}/unshare/
        unshareOffer: builder.mutation({
            query: ({ id, data }: { id: string; data: any }) => ({
                url: `/offers/${id}/unshare/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Offer"],
        }),

    }),
});

export const {
    useGetAllOfferQuery,
    useGetOfferByIdQuery,
    useCreateOfferMutation,
    useUpdateOfferMutation,
    useShareOfferMutation,
    useUnshareOfferMutation
} = offerApi;