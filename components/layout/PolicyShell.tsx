import AnnouncementBar from "./AnnouncementBar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BackButton from "@/components/ui/BackButton";

export default function PolicyShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
        <BackButton />
        {children}
      </main>
      <Footer />
    </>
  );
}
