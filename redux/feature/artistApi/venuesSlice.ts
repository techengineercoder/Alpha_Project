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
        }),
        // /catalog/venues/{id}/
        getVenueById: builder.query({
            query: (id) => ({
                url: `/catalog/venues/${id}/`,
                method: "GET",
            }),
            providesTags: ["Venues"],
        }),
    }),
});

export const {
    useGetVenuesQuery,
    useGetVenueByIdQuery,
} = venuesApi;