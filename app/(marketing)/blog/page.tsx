'use client';
import { useState } from "react";
import Link from "next/link";
import { CalendarDays, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { useGetAllBlogQuery } from "@/redux/feature/blogApi/blogSlice";

function BlogSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col bg-white/5 border border-white/10 rounded-3xl overflow-hidden animate-pulse">
          <div className="relative h-64 w-full bg-white/5" />
          <div className="p-8 flex flex-col flex-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-4 w-20 bg-white/10 rounded" />
              <div className="h-4 w-20 bg-white/10 rounded" />
            </div>
            <div className="h-7 w-3/4 bg-white/10 rounded mb-4" />
            <div className="h-4 w-full bg-white/10 rounded mb-2" />
            <div className="h-4 w-5/6 bg-white/10 rounded mb-8" />
            <div className="flex items-center gap-3 mt-auto pt-6 border-t border-white/10">
              <div className="w-10 h-10 rounded-full bg-white/10" />
              <div className="h-4 w-24 bg-white/10 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function BlogPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 9;
  const offset = (currentPage - 1) * limit;

  const { data, isLoading, isFetching, error } = useGetAllBlogQuery({ limit, offset });

  const blogs = data?.results || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  // Helper functions
  const getImageUrl = (imagePath?: string | null) => {
    if (!imagePath) return "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200&h=800";
    if (imagePath.startsWith("http")) return imagePath;
    const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL || "https://backend.getavails.com";
    return `${baseUrl}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Unknown Date";
    }
  };


  const getExcerpt = (content: string) => {
    if (!content) return "";
    const text = content.replace(/<[^>]*>/g, '');
    if (text.length <= 150) return text;
    return text.substring(0, 150).trim() + "...";
  };

  const getAuthorDisplay = (email: string) => {
    if (!email) return "Anonymous";
    const part = email.split('@')[0];
    return part.charAt(0).toUpperCase() + part.slice(1);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 2) {
        end = 3;
      }
      if (currentPage >= totalPages - 1) {
        start = totalPages - 2;
      }

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 md:px-8 lg:px-12 relative overflow-hidden bg-[#050505]">
      {/* Background Elements */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#7C5CFF]/10 to-transparent pointer-events-none" />
      <div className="absolute -top-48 -left-48 w-96 h-96 bg-[#00A5E5]/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-24 -right-48 w-96 h-96 bg-[#FF4C8C]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Insights & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C5CFF] to-[#FF4C8C]">Resources</span>
          </h1>
          <p className="text-[#A1A1AA] text-lg md:text-xl">
            Expert advice, industry trends, and practical guides to elevate your events and booking experience.
          </p>
        </div>

        {isLoading || isFetching ? (
          <BlogSkeleton />
        ) : error ? (
          <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Error Loading Blogs</h3>
            <p className="text-[#A1A1AA] mb-6">Something went wrong while fetching the latest articles. Please try again.</p>
            <button
              onClick={() => setCurrentPage(1)}
              className="px-6 py-2.5 rounded-full bg-[#7C5CFF] text-white font-medium hover:bg-[#6843ec] transition-colors"
            >
              Retry
            </button>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">No Blog Posts Found</h3>
            <p className="text-[#A1A1AA]">Check back later for new content!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((post) => (
                <Link
                  href={`/blog/${post.slug}`}
                  key={post.id}
                  className="group flex flex-col bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                >
                  <div className="relative h-64 w-full overflow-hidden">
                    <img
                      src={getImageUrl(post.image)}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold text-white uppercase tracking-wider border border-white/10">
                      {post.category_detail?.name || "General"}
                    </div>
                  </div>

                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-4 text-[#A1A1AA] text-sm mb-4">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays size={14} />
                        <span>{formatDate(post.created_at)}</span>
                      </div>
                      {/* <div className="flex items-center gap-1.5">
                        <Clock size={14} />
                        <span>{getReadTime(post.content)}</span>
                      </div> */}
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-4 line-clamp-2 group-hover:text-[#7C5CFF] transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-[#A1A1AA] line-clamp-3 mb-8 flex-1">
                      {getExcerpt(post.content)}
                    </p>

                    <div className="flex items-center gap-3 mt-auto pt-6 border-t border-white/10">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
                        <img
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(post.author)}`}
                          alt={post.author}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-white text-sm font-medium">{getAuthorDisplay(post.author)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-16">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-3 rounded-full bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all duration-200"
                  aria-label="Previous Page"
                >
                  <ChevronLeft size={20} />
                </button>

                {renderPageNumbers().map((page, index) =>
                  page === "..." ? (
                    <span key={`ellipsis-${index}`} className="px-3 text-[#A1A1AA]">
                      ...
                    </span>
                  ) : (
                    <button
                      key={`page-${page}`}
                      onClick={() => setCurrentPage(page as number)}
                      className={`w-11 h-11 rounded-full font-semibold transition-all duration-200 ${currentPage === page
                        ? "bg-gradient-to-r from-[#7C5CFF] to-[#FF4C8C] text-white shadow-[0_0_15px_rgba(124,92,255,0.4)]"
                        : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                        }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-3 rounded-full bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all duration-200"
                  aria-label="Next Page"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
