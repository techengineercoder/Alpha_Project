import { Metadata } from "next";
import { getPostBySlug, blogPosts } from "@/lib/blog-data";
import { notFound } from "next/navigation";
import { CalendarDays, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  
  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | GetAvails Blog`,
    description: post.excerpt,
  };
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 md:px-8 lg:px-12 relative bg-[#050505]">
      {/* Background Elements */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#7C5CFF]/10 to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-[#A1A1AA] hover:text-white transition-colors mb-10 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Blog
        </Link>

        <div className="mb-12 text-center">
          <div className="inline-block bg-[#7C5CFF]/10 text-[#7C5CFF] border border-[#7C5CFF]/20 px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wider mb-6">
            {post.category}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 tracking-tight leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-[#A1A1AA]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
                <img src={post.authorImage} alt={post.author} className="w-full h-full object-cover" />
              </div>
              <span className="text-white font-medium">{post.author}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <div className="flex items-center gap-2 text-sm">
              <CalendarDays size={16} />
              <span>{post.date}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <div className="flex items-center gap-2 text-sm">
              <Clock size={16} />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>

        <div className="relative w-full h-[400px] md:h-[500px] rounded-[32px] overflow-hidden mb-16 border border-white/10 shadow-2xl">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
        </div>

        <article 
          className="max-w-none 
            [&_h2]:text-white [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:mt-10 [&_h2]:mb-4
            [&_p]:text-[#A1A1AA] [&_p]:leading-relaxed [&_p]:text-lg [&_p]:mb-6
            [&_a]:text-[#7C5CFF] hover:[&_a]:text-[#9D7CFF] [&_a]:transition-colors
            [&_strong]:text-white [&_strong]:font-semibold
            [&_ul]:text-[#A1A1AA] [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:space-y-2
            [&_ol]:text-[#A1A1AA] [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol]:space-y-2
            [&_blockquote]:border-l-4 [&_blockquote]:border-[#7C5CFF] [&_blockquote]:bg-white/5 [&_blockquote]:px-6 [&_blockquote]:py-4 [&_blockquote]:rounded-r-lg [&_blockquote]:not-italic [&_blockquote]:text-white [&_blockquote]:my-8"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        {/* Call to action */}
        <div className="mt-24 p-10 bg-gradient-to-br from-[#7C5CFF]/10 to-[#FF4C8C]/10 border border-white/10 rounded-3xl text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to elevate your next event?</h3>
          <p className="text-[#A1A1AA] mb-8 max-w-2xl mx-auto">
            Browse our curated list of world-class artists and venues, and book directly through GetAvails.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/search" 
              className="px-8 py-3.5 rounded-full bg-[#7C5CFF] text-white font-bold hover:bg-[#6A4BE5] transition-all shadow-[0_0_20px_rgba(124,92,255,0.3)] animate-pulse-glow"
            >
              Browse Artists
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
