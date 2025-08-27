import { useEffect, useState } from "react";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import { type Link } from "../Types/Types";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = process.env.VITE_API_BASE_URL;
const Home = () => {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [recentUrls, setRecentUrls] = useState<Link[]>([]);
  const [copied, setCopied] = useState("");

  // Fetch 10 recent URLs from backend
  const fetchRecentUrls = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/recent`);
      const normalized = res.data.map((link: Link) => ({
        ...link,
        shortUrl: `${API_BASE_URL}/${link.shortCode}`,
      }));
      setRecentUrls(normalized);
    } catch (err) {
      console.error("Error fetching recent URLs:", err);
      alert("Could not load recent links. Please refresh.");
    }
  };

  // On mount, fetch recent links
  useEffect(() => {
    fetchRecentUrls();
  }, []);

  // Handle shorten
  const handleShorten = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!url.trim()) {
      alert("Please enter a valid URL");
      return;
    }
    try {
      const res = await axios.post(`${API_BASE_URL}/shorten`, {
        originalUrl: url,
      });
      const shortLink = `${API_BASE_URL}/${res.data.shortCode}`;
      setShortUrl(shortLink);
      setUrl("");
      fetchRecentUrls(); // refresh list
    } catch (err) {
      console.error("Error shortening URL:", err);
      alert("Something went wrong while creating the short URL. Try again!");
    }
  };

  // Copy to clipboard
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(""), 1500);
    } catch (err) {
      console.error("Clipboard copy failed", err);
      alert("Failed to copy link. Please copy manually.");
    }
  };

  // Share link
  const handleShare = async (text: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check this shortened link",
          url: text,
        });
      } catch (err) {
        console.error("Error sharing", err);
      }
    } else {
      handleCopy(text);
      alert("Sharing not supported. Link copied to clipboard!");
    }
  };

  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-blue-100 to-white py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Shorten URLs. Simplify Sharing.
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Turn long, messy links into clean and professional short URLs in
            seconds. Easy to share, track, and manage.
          </p>

          <form
            onSubmit={handleShorten}
            className="flex flex-col md:flex-row items-center justify-between gap-2"
          >
            <input
              type="text"
              placeholder="Paste your long URL here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              aria-label="Enter URL to shorten"
              className="w-full md:w-6/8 px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 transition"
            >
              Shorten URL
            </button>
          </form>

          {shortUrl && (
            <AnimatePresence>
              <motion.div
                key="short-url-box"
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="mt-4 border-2 p-5 border-gray-300 rounded-xl shadow-md"
              >
                <p className="text-lg font-medium text-gray-600 mb-2">
                  Short URL :
                </p>
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 font-medium truncate hover:underline"
                >
                  {shortUrl}
                </a>
              </motion.div>
            </AnimatePresence>
          )}

          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              type="button"
              className="px-5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
            >
              See Features
            </button>
          </div>
        </div>
      </section>

      {/* Recent Links Section */}
      <section className="px-25 py-10">
        <div>
          <h1 className="text-2xl text-gray-700 font-medium border-b border-gray-300">
            Recent Links
          </h1>
        </div>

        <div className="h-[40vh] p-3">
          <div className="border-2 border-gray-300 mt-3 rounded-xl">
            <div className="border-b border-gray-200 font-medium text-gray-600 text-lg flex justify-between py-2 px-8 rounded-xl">
              <p>Original URL</p>
              <p>Shortened URL</p>
              <p>Actions</p>
            </div>

            <div className="mt-5 max-h-[38vh] space-y-4 overflow-y-scroll p-5 scrollbar-hidden">
              {recentUrls.map((link: Link) => (
                <div
                  key={link.id}
                  className="border border-gray-300 mx-2 py-3 px-5 rounded-xl flex justify-between items-center"
                >
                  {/* Original URL */}
                  <div className="w-[45vh] truncate pr-2 flex gap-3 items-center justify-between">
                    <p className="text-gray-500 font-medium truncate">
                      {link.originalUrl}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleCopy(link.originalUrl)}
                      className="text-blue-600 font-medium hover:text-blue-400"
                    >
                      {copied === link.originalUrl ? "Copied!" : "Copy"}
                    </button>
                  </div>

                  {/* Short URL */}
                  <div className="w-[33%] truncate px-2 flex gap-3 items-center justify-between">
                    <a
                      href={link.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 font-medium truncate hover:underline"
                    >
                      {link.shortUrl}
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopy(link.shortUrl!)}
                      className="text-blue-600 font-medium hover:text-blue-400"
                    >
                      {copied === link.shortUrl ? "Copied!" : "Copy"}
                    </button>
                  </div>

                  {/* Share button */}
                  <div className="max-w-[33%] flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => handleShare(link.shortUrl!)}
                      className="text-blue-600 font-medium hover:text-blue-400"
                    >
                      Share
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;