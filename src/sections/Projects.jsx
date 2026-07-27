import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaGithub, FaExternalLinkAlt, FaStar, FaCodeBranch, 
  FaSearch, FaInfoCircle, FaRegClock, FaBalanceScale 
} from "react-icons/fa";
import { fetchGitHubRepos } from "../services/githubService";
import Skeleton from "../components/ui/Skeleton";

export default function Projects() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("All");

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchGitHubRepos();
      setRepos(data);
    } catch (err) {
      setError("Failed to load projects from GitHub API. Please check your network connection or try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter languages list
  const uniqueLanguages = ["All", ...new Set(repos.map((r) => r.language).filter(Boolean))];

  // Filtering repositories based on search query and selected language
  const filteredRepos = repos.filter((repo) => {
    const matchesSearch = 
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      repo.topics.some((topic) => topic.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesLanguage = selectedLanguage === "All" || repo.language === selectedLanguage;

    return matchesSearch && matchesLanguage;
  });

  // Get color for language dot
  const getLanguageColor = (lang) => {
    switch (lang?.toLowerCase()) {
      case "python": return "bg-blue-500";
      case "javascript": return "bg-yellow-400";
      case "html": return "bg-orange-600";
      case "css": return "bg-purple-500";
      case "jupyter notebook": return "bg-orange-500";
      case "c++": return "bg-pink-500";
      case "c": return "bg-slate-400";
      default: return "bg-slate-500";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <section id="projects" className="py-24 px-6 relative bg-bg-black overflow-hidden border-t border-white/5">
      {/* Background gradients */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-brand-cyan/5 blur-[120px] top-[10%] right-[-100px] pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-brand-purple/5 blur-[100px] bottom-[10%] left-[-150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Heading */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-extrabold mb-4"
          >
            Featured <span className="text-gradient text-gradient-purple-pink">Projects</span>
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "80px" }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-[3px] bg-gradient-to-r from-brand-purple to-brand-magenta mx-auto rounded-full"
          />
        </div>

        {/* Filters and Search Bar Row */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-12 max-w-5xl mx-auto">
          {/* Search bar */}
          <div className="relative w-full md:max-w-md">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by repository name, keyword, topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl glass border border-white/5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/20 transition-all duration-300"
            />
          </div>

          {/* Language filter tab */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mr-2 flex-shrink-0 hidden sm:inline">
              Language:
            </span>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-4 py-3 rounded-xl glass border border-white/5 text-sm text-slate-300 focus:outline-none focus:border-brand-purple/50 cursor-pointer"
            >
              {uniqueLanguages.map((lang) => (
                <option key={lang} value={lang} className="bg-bg-black text-slate-350">
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content Render Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton count={6} />
          </div>
        ) : error ? (
          /* Premium Failure state */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto"
          >
            <div className="text-4xl text-rose-500 mb-4 animate-bounce">⚠️</div>
            <h3 className="text-lg font-bold text-slate-300 mb-2">Error Connection Failed</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">{error}</p>
            <button
              onClick={loadData}
              className="px-6 py-2.5 rounded-lg bg-slate-900 border border-white/10 hover:border-brand-purple/50 text-slate-300 font-bold transition-all text-xs cursor-pointer"
            >
              Retry Load
            </button>
          </motion.div>
        ) : filteredRepos.length === 0 ? (
          /* Premium Empty search state */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center max-w-sm mx-auto"
          >
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-bold text-slate-300 mb-1">No Projects Found</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              We couldn't find any repositories matching your queries. Try altering search words.
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredRepos.map((repo) => (
                <motion.div
                  key={repo.id}
                  variants={cardVariants}
                  whileHover={{ y: -6 }}
                  className="glass glow-card rounded-2xl p-6 flex flex-col justify-between border border-white/5 relative group cursor-pointer"
                  onClick={() => window.open(repo.htmlUrl, "_blank")}
                >
                  <div>
                    {/* Header: Title and Status Badge */}
                    <div className="flex justify-between items-start gap-4 mb-3.5">
                      <h3 className="font-extrabold text-lg text-slate-200 capitalize tracking-wide group-hover:text-brand-purple transition-colors truncate">
                        {repo.name}
                      </h3>
                      <span className="text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-brand-purple/10 border border-brand-purple/20 text-brand-purple flex-shrink-0">
                        Public
                      </span>
                    </div>

                    {/* Repository Description */}
                    <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                      {repo.description}
                    </p>
                  </div>

                  <div>
                    {/* Repository Tags / Topics */}
                    <div className="flex flex-wrap gap-1.5 mb-5 overflow-hidden max-h-12">
                      {repo.topics.slice(0, 3).map((topic) => (
                        <span
                          key={topic}
                          className="text-[10px] font-bold text-slate-450 bg-slate-900/60 border border-white/5 px-2.5 py-0.5 rounded-full"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>

                    {/* Stats bar */}
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-5 pt-3 border-t border-slate-900/60">
                      {/* Language indicator */}
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${getLanguageColor(repo.language)}`} />
                        <span className="font-semibold text-slate-400">{repo.language}</span>
                      </div>
                      
                      {/* Star and Fork counts */}
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-[11px] font-semibold" title="Stars">
                          <FaStar className="text-yellow-400/80" /> {repo.stars}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] font-semibold" title="Forks">
                          <FaCodeBranch className="text-brand-cyan/80" /> {repo.forks}
                        </span>
                      </div>
                    </div>

                    {/* Dates and License indicators */}
                    <div className="flex items-center justify-between text-[10px] text-slate-600 mb-5">
                      <span className="flex items-center gap-1">
                        <FaRegClock /> Updated {repo.updatedAt}
                      </span>
                      <span className="flex items-center gap-1 truncate max-w-[120px]">
                        <FaBalanceScale /> {repo.license}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3">
                      <a
                        href={repo.htmlUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2.5 rounded-xl font-bold text-xs tracking-wider glass border border-white/5 hover:border-slate-450 hover:bg-white/5 transition-all text-center flex items-center justify-center gap-1.5 text-slate-350 hover:text-slate-100 cursor-pointer"
                        onClick={(e) => e.stopPropagation()} // Stop triggering card click redirect
                      >
                        <FaGithub /> View Code
                      </a>
                      
                      {repo.homepage && (
                        <a
                          href={repo.homepage}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 py-2.5 rounded-xl font-bold text-xs tracking-wider bg-gradient-to-r from-brand-purple to-brand-magenta text-white text-center flex items-center justify-center gap-1.5 transition-all hover:opacity-95 shadow-md shadow-brand-magenta/10 cursor-pointer"
                          onClick={(e) => e.stopPropagation()} // Stop triggering card click redirect
                        >
                          <FaExternalLinkAlt size={10} /> Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
