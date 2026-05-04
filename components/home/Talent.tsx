import React from 'react';

const talents = [
    {
        title: 'Agents',
        description: 'Update availability dates, view booking inquiries.',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
    },
    {
        title: 'Artists',
        description: 'Manage multiple artist profiles, claim artists and upload avails.',
        image: 'https://images.unsplash.com/photo-1571266028243-cb40fce7573a?w=800&q=80',
    },
    {
        title: 'Venues',
        description: 'Manage venue profiles, claim venue and track booking request.',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
    },
    {
        title: 'Buyers',
        description: 'Search history, saved profiles, and direct messaging.',
        image: 'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=800&q=80',
    }
];

export function Talent() {
    return (
        <section className="w-full bg-[#0b0b0f] py-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl md:text-[45px] text-white font-bold mb-4">Talent on the rise</h1>
                <p className="text-[#A1A1AA] text-sm md:text-xl font-normal  mb-8">
                    Discover trending artists available for booking
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {talents.map((talent, index) => (
                        <div
                            key={index}
                            className="group flex flex-col border border-[#121218] rounded-2xl overflow-hidden bg-[#121218] transition-transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#7C5CFF]/10 cursor-pointer"
                        >
                            {/* Image Container */}
                            <div className="w-full aspect-square relative overflow-hidden">
                                <img
                                    src={talent.image}
                                    alt={talent.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>

                            {/* Text Content */}
                            <div className="p-6 md:p-8 flex flex-col flex-grow bg-[#0b0b0f] relative">
                                {/* Subtle top border/separator */}
                                <div className="absolute top-0 left-6 right-6 h-[1px] bg-white/5"></div>

                                <h3 className="text-white font-bold text-xl md:text-2xl ">
                                    {talent.title}
                                </h3>
                                <div className="border-b border-[#A1A1AA] my-3"></div>
                                <p className="text-[#A1A1AA] text-sm md:text-base leading-relaxed">
                                    {talent.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
