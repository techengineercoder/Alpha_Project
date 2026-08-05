import baseApi from "@/redux/api/baseApi";


export const inquiriesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // /inquiries/
        getInquiries: builder.query({
            query: (params) => {
                return {
                    url: `/inquiries/`,
                    method: "GET",
                    params,
                }
            },
            providesTags: ["Inquiries"],
        }),

        getInquiryDetails: builder.query({
            query: (id) => {
                return {
                    url: `/inquiries/${id}`,
                    method: "GET",
                }
            },
            providesTags: ["Inquiries"],
        }),

        addInquiry: builder.mutation({
            query: (data) => ({
                url: `/inquiries/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Inquiries"],
        }),

        acceptInquiry: builder.mutation({
            query: (id) => ({
                url: `/inquiries/${id}/accept/`,
                method: "POST",
            }),
            invalidatesTags: ["Inquiries"],
        }),

        rejectInquiry: builder.mutation({
            query: (id) => ({
                url: `/inquiries/${id}/decline/`,
                method: "POST",
            }),
            invalidatesTags: ["Inquiries"],
        }),

    }),
});

export const {
    useGetInquiriesQuery,
    useGetInquiryDetailsQuery,
    useAddInquiryMutation,
    useAcceptInquiryMutation,
    useRejectInquiryMutation,
} = inquiriesApi;