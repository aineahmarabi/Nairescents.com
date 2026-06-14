import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackButton from "@/components/ui/BackButton";

export default function ContactPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <BackButton />
          <h1 className="text-white text-4xl sm:text-5xl font-bold tracking-tight text-center mb-12">
            Contact
          </h1>

          <form className="space-y-6">
            {/* Row 1: Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-white text-sm font-medium">Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full bg-transparent border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm
                    focus:outline-none focus:border-[#C9A96E] transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-white text-sm font-medium">Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full bg-transparent border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm
                    focus:outline-none focus:border-[#C9A96E] transition-colors"
                />
              </div>
            </div>

            {/* Row 2: Phone */}
            <div className="flex flex-col gap-2">
              <label className="text-white text-sm font-medium">Phone</label>
              <input
                type="tel"
                placeholder="+254 ..."
                className="w-full bg-transparent border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm
                  focus:outline-none focus:border-[#C9A96E] transition-colors"
              />
            </div>

            {/* Row 3: Comment */}
            <div className="flex flex-col gap-2">
              <label className="text-white text-sm font-medium">Comment</label>
              <textarea
                rows={6}
                placeholder="Write your message here..."
                className="w-full bg-transparent border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm resize-none
                  focus:outline-none focus:border-[#C9A96E] transition-colors"
              />
            </div>

            {/* Submit */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="px-12 py-3.5 border border-[#C9A96E] text-[#C9A96E] rounded-xl text-sm font-semibold tracking-widest uppercase
                  hover:bg-[#C9A96E]/10 active:scale-[0.98] transition-all"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
