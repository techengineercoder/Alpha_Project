import { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/blog-data";
import { CalendarDays, Clock } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Blog & Insights | GetAvails",
  description: "Educational and industry-focused content to help you book the perfect artists and venues for your events.",
};

export default function BlogPage() {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link
              href={`/blog/${post.slug}`}
              key={post.id}
              className="group flex flex-col bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
            >
              <div className="relative h-64 w-full overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold text-white uppercase tracking-wider border border-white/10">
                  {post.category}
                </div>
              </div>

              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-[#A1A1AA] text-sm mb-4">
                  <div className="flex items-center gap-1.5">
                    <CalendarDays size={14} />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-4 line-clamp-2 group-hover:text-[#7C5CFF] transition-colors">
                  {post.title}
                </h3>

                <p className="text-[#A1A1AA] line-clamp-3 mb-8 flex-1">
                  {post.excerpt}
                </p>

                <div className="flex items-center gap-3 mt-auto pt-6 border-t border-white/10">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
                    <img src={post.authorImage} alt={post.author} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-white text-sm font-medium">{post.author}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
