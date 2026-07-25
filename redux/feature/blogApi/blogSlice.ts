import baseApi from "@/redux/api/baseApi";

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  image: string | null;
  category: number;
  category_detail: {
    id: number;
    name: string;
    slug: string;
    created_at: string;
    updated_at: string;
  };
  author: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogListResponse {
  success: boolean;
  count: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
  results: BlogPost[];
}

export const blogApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // /blog/posts/
        getAllBlog: builder.query<BlogListResponse, { limit?: number; offset?: number } | undefined>({
            query: (params) => ({
                url: "/blog/posts/",
                method: "GET",
                params: params || {},
            }),
            providesTags: ["Blog"],
        }),

        // /blog/posts/50/
        getBlogById: builder.query<{ success: boolean; post: BlogPost }, string>({
            query: (slug: string) => ({
                url: `/blog/posts/${slug}/`,
                method: "GET",
            }),
            providesTags: ["Blog"],
        }),

    }),
});

export const {
    useGetAllBlogQuery,
    useGetBlogByIdQuery,
} = blogApi;