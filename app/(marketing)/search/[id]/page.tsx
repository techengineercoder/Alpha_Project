import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/Footer";
import { ArtistDetails } from "@/components/search/ArtistDetails";

export default function DetailsPage() {
    return (
        <div className="flex flex-col min-h-screen b">
            <main className="flex-1 ">
                <ArtistDetails />
            </main>
        </div>
    );
}
