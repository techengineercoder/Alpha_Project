export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorImage?: string;
  date: string;
  category: string;
  readTime: string;
  image: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "how-to-choose-the-perfect-artist-for-your-corporate-event",
    title: "How to Choose the Perfect Artist for Your Corporate Event",
    excerpt: "Discover the key factors to consider when booking entertainment for corporate gatherings to ensure a memorable experience.",
    content: `
      <h2>Understanding Your Audience</h2>
      <p>The first step in booking the perfect artist for your corporate event is understanding your audience. Are they young professionals who might appreciate a modern indie band, or a more senior demographic that would enjoy classic jazz? Tailoring the entertainment to the guests is crucial.</p>
      
      <h2>Setting the Right Tone</h2>
      <p>Consider the objective of your event. Is it a relaxed networking evening, a high-energy product launch, or a formal awards ceremony? The artist you choose will set the tone for the entire event.</p>
      
      <h2>Budgeting for Entertainment</h2>
      <p>Be realistic about your budget. Remember that the artist's fee is just one part of the cost; you also need to factor in production, travel, and accommodation expenses.</p>
      
      <h2>Working with GetAvails</h2>
      <p>Using a platform like GetAvails simplifies the process. You can browse artists by genre, budget, and availability, ensuring you find the perfect match without the usual hassle.</p>
    `,
    author: "Sarah Jenkins",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
    date: "May 15, 2026",
    category: "Event Planning",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=1200&h=800",
  },
  {
    id: "2",
    slug: "top-5-venue-trends-for-2026",
    title: "Top 5 Venue Trends You Need to Know in 2026",
    excerpt: "From immersive tech integrations to sustainable spaces, explore what's dominating the event venue space this year.",
    content: `
      <h2>1. Immersive Environments</h2>
      <p>Venues are no longer just four walls. They are becoming immersive environments equipped with 360-degree projection mapping and interactive installations that engage attendees on a new level.</p>
      
      <h2>2. Sustainable Spaces</h2>
      <p>Eco-friendly venues are in high demand. Event organizers are looking for spaces that prioritize sustainability, from solar power to zero-waste catering options.</p>
      
      <h2>3. Hybrid Capabilities</h2>
      <p>The need for high-quality live-streaming capabilities remains strong. Venues are investing in robust tech infrastructure to seamlessly blend in-person and virtual experiences.</p>
      
      <h2>4. Non-Traditional Locations</h2>
      <p>Think abandoned warehouses, historic libraries, and outdoor botanical gardens. Unique, non-traditional spaces are trending as organizers seek to create memorable experiences.</p>
      
      <h2>5. Wellness-Centric Design</h2>
      <p>Venues are incorporating wellness elements, such as natural lighting, outdoor access, and designated quiet zones, to promote attendee well-being during long events.</p>
    `,
    author: "David Chen",
    authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150",
    date: "June 02, 2026",
    category: "Industry Trends",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1200&h=800",
  },
  {
    id: "3",
    slug: "maximizing-ticket-sales-for-your-first-festival",
    title: "Maximizing Ticket Sales for Your First Festival",
    excerpt: "A comprehensive guide to marketing your new festival, building hype, and selling out your first major event.",
    content: `
      <h2>Building the Hype</h2>
      <p>Start marketing early. Tease your lineup, venue, and unique experiences months in advance. Use social media to create a sense of exclusivity and anticipation.</p>
      
      <h2>Tiered Pricing Strategies</h2>
      <p>Implement early-bird pricing to drive initial sales. As the event date approaches and the lineup is fully revealed, gradually increase ticket prices. This creates urgency.</p>
      
      <h2>Leveraging Artist Audiences</h2>
      <p>Collaborate with your booked artists to promote the festival to their fans. Provide them with custom marketing assets and trackable links to incentivize promotion.</p>
      
      <h2>Creating FOMO</h2>
      <p>Use limited-time offers and exclusive VIP packages to create a Fear Of Missing Out (FOMO). Highlight experiences that attendees can't get anywhere else.</p>
    `,
    author: "Elena Rodriguez",
    authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
    date: "April 28, 2026",
    category: "Marketing",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=1200&h=800",
  },
  {
    id: "4",
    slug: "streamlining-artist-booking-workflow",
    title: "How Agents Can Streamline Their Artist Booking Workflow",
    excerpt: "Learn how modern platforms help agents manage multiple artists, track offers, and close more bookings with less back-and-forth.",
    content: `
      <h2>The Problem with Emails</h2>
      <p>Relying on long email threads to negotiate offers often leads to miscommunication, lost documents, and delayed responses.</p>
      
      <h2>Centralizing Offers</h2>
      <p>Using a centralized dashboard allows agents to see all incoming offers at a glance, compare them, and respond quickly.</p>
      
      <h2>Automating Contracts</h2>
      <p>Automated contract generation and e-signatures reduce the administrative burden and speed up the booking process.</p>
    `,
    author: "Michael Chang",
    authorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150",
    date: "July 10, 2026",
    category: "Productivity",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200&h=800",
  },
  {
    id: "5",
    slug: "why-event-organizers-are-switching",
    title: "Why Event Organizers are Switching to Unified Dashboards",
    excerpt: "See how moving away from emails and spreadsheets into a centralized dashboard changes the game for festivals.",
    content: `
      <h2>The Chaos of Spreadsheets</h2>
      <p>Managing hundreds of artists, riders, and schedules using spreadsheets is a recipe for disaster. Version control issues are rampant.</p>
      
      <h2>Real-time Updates</h2>
      <p>Unified dashboards provide real-time updates. If an artist's flight is delayed, the entire team knows instantly.</p>
      
      <h2>Better Collaboration</h2>
      <p>Event teams can collaborate more effectively when everyone has access to the same centralized information.</p>
    `,
    author: "Sarah Jenkins",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
    date: "August 05, 2026",
    category: "Technology",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1200&h=800",
  }
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
