import baseApi from "@/redux/api/baseApi";


export const teamManagementApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // /teams/roles/
        getTeamRoles: builder.query({
            query: () => ({
                url: "/teams/roles/",
                method: "GET",
            }),
            providesTags: ["Team"],
        }),

        // /teams/
        myTeam: builder.query({
            query: () => ({
                url: "/teams/",
                method: "GET",
            }),
            providesTags: ["Team"],
        }),

        // /teams/3/
        teamDetails: builder.query({
            query: (id: string) => ({
                url: `/teams/${id}/`,
                method: "GET",
            }),
            providesTags: ["Team"],
        }),

        // /teams/
        createTeam: builder.mutation({
            query: (data: Record<string, string>) => ({
                url: "/teams/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Team"],
        }),

        // /teams/22/members/
        teamMembers: builder.query({
            query: ({ id, search }: { id: string; search?: string }) => ({
                url: `/teams/${id}/members/`,
                method: "GET",
                params: search ? { search } : undefined,
            }),
            providesTags: ["Team"],
        }),

        // /teams/44/members/
        addTeamMember: builder.mutation({
            query: ({ id, data }: { id: string, data: Record<string, string> }) => ({
                url: `/teams/${id}/members/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Team"],
        }),

        // /teams/33/members/33/
        deleteTeamMember: builder.mutation({
            query: (arg: string | { id?: string; memberId: string }) => {
                const id = typeof arg === "string" ? undefined : arg.id;
                const memberId = typeof arg === "string" ? arg : arg.memberId;
                return {
                    url: id ? `/teams/${id}/members/${memberId}/` : `/teams/members/${memberId}/`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["Team"],
        }),

        // /teams/33/invitations/
        teamInvitations: builder.query({
            query: (id: string) => ({
                url: `/teams/${id}/invitations/`,
                method: "GET",
            }),
            providesTags: ["Team"],
        }),

        // /teams/33/invitations/
        inviteTeamMember: builder.mutation({
            query: ({ id, data }: { id: string, data: Record<string, string> }) => ({
                url: `/teams/${id}/invitations/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Team"],
        }),

        // /teams/44/invitations/
        sendTeamMemberInvitation: builder.mutation({
            query: ({ id, data }: { id: string, data: Record<string, string> }) => ({
                url: `/teams/${id}/invitations/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Team"],
        }),

        // /teams/33/invitations/33/revoke/ method post
        revokeTeamMemberInvitation: builder.mutation({
            query: ({ id, invitationId }: { id: string, invitationId: string }) => ({
                url: `/teams/${id}/invitations/${invitationId}/revoke/`,
                method: "POST",
            }),
            invalidatesTags: ["Team"],
        }),

        // /teams/33/invitations/33/accept/ method post
        acceptTeamMemberInvitation: builder.mutation({
            query: (data: { token: string }) => ({
                url: `/teams/invitations/accept/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Team"],
        }),

        // /teams/review/pending/
        pendingTeamReviews: builder.query({
            query: () => ({
                url: `/teams/review/pending/`,
                method: "GET",
            }),
            providesTags: ["Team"],
        }),

        // /teams/review/memberships/33/
        submitTeamMembershipReview: builder.mutation({
            query: ({ id, data }: { id: string, data: Record<string, string> }) => ({
                url: `/teams/review/memberships/${id}/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Team"],
        }),




    }),
});

export const {

    useGetTeamRolesQuery,
    useMyTeamQuery,
    useTeamDetailsQuery,
    useCreateTeamMutation,
    useTeamMembersQuery,
    useAddTeamMemberMutation,
    useDeleteTeamMemberMutation,
    useTeamInvitationsQuery,
    useInviteTeamMemberMutation,
    useSendTeamMemberInvitationMutation,
    useRevokeTeamMemberInvitationMutation,
    useAcceptTeamMemberInvitationMutation,
    usePendingTeamReviewsQuery,
    useSubmitTeamMembershipReviewMutation,

} = teamManagementApi;