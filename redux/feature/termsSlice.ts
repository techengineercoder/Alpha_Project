import baseApi from "@/redux/api/baseApi";


export const termsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({


        // /pages/
        getAllTerms: builder.query({
            query: () => ({
                url: "/pages/",
                method: "GET",
            }),
            providesTags: ["Terms"],
        })

    }),
});

export const {

    useGetAllTermsQuery,
} = termsApi;