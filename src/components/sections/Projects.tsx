import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import { ExternalLinkIcon } from '../ui/SocialIcon';
import { fetchGitHubRepos, GitHubRepo } from '../../services/githubService';
import { profile } from '../../constants/portfolioData';

type Filter = 'all' | string;

export const Projects: React.FC = () => {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchGitHubRepos();
        if (!cancelled) setRepos(data);
      } catch (e: unknown) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load repositories.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const languages = Array.from(new Set(repos.map((r) => r.language).filter(Boolean))).sort();

  const filtered = filter === 'all' ? repos : repos.filter((r) => r.language === filter);

  return (
    <section
      id="projects"
      className="relative z-[1] w-full py-20 sm:py-28 px-5 sm:px-8 md:px-10 section-border"
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="Projects"
          title="GitHub Projects"
          subtitle={`Live repositories from my GitHub (${profile.name}). Projects load directly from the GitHub API.`}
        />

        {/* Filters */}
        {repos.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`rounded-full px-4 py-1.5 text-[12px] sm:text-[13px] border transition-colors cursor-pointer ${
                filter === 'all'
                  ? 'bg-white text-black border-white'
                  : 'text-white/70 border-white/20 hover:text-white'
              }`}
            >
              All
            </button>
            {languages.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setFilter(lang)}
                className={`rounded-full px-4 py-1.5 text-[12px] sm:text-[13px] border transition-colors cursor-pointer ${
                  filter === lang
                    ? 'bg-white text-black border-white'
                    : 'text-white/70 border-white/20 hover:text-white'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            <p className="text-white/50 text-[14px]">Loading repositories…</p>
          </div>
        ) : error ? (
          <div className="glass rounded-3xl p-8 text-center max-w-lg mx-auto">
            <p className="text-red-300 text-[15px] mb-3">Unable to load projects.</p>
            <p className="text-white/50 text-[13px] mb-6">{error}</p>
            <a
              href={profile.resumeUrl !== '#' ? profile.resumeUrl : '#'}
              onClick={(e) => e.preventDefault()}
              className="inline-flex text-[13px] text-cyan-300 hover:underline"
            >
              Projects appear here once GitHub access is configured.
            </a>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-white/40 text-[15px] py-10">
            No projects to show yet. New repositories will appear here automatically.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((repo, i) => (
              <motion.a
                key={repo.id}
                href={repo.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.06 }}
                className="glass rounded-2xl p-5 flex flex-col gap-3 glow-card group cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3
                    className="text-white text-[15px] sm:text-[16px] leading-snug group-hover:text-cyan-300 transition-colors"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {repo.name}
                  </h3>
                  <span className="text-white/40 group-hover:text-white transition-colors shrink-0">
                    <ExternalLinkIcon />
                  </span>
                </div>

                <p className="text-white/55 text-[13px] leading-relaxed line-clamp-3 flex-1">
                  {repo.description}
                </p>

                {/* Topics */}
                {repo.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {repo.topics.slice(0, 4).map((topic) => (
                      <span
                        key={topic}
                        className="text-[11px] text-white/50 bg-white/5 border border-white/10 rounded-full px-2 py-0.5"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}

                {/* Meta */}
                <div className="flex items-center justify-between text-[12px] text-white/50 pt-1 border-t border-white/10">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
                    {repo.language}
                  </span>
                  <div className="flex items-center gap-3">
                    <span title="Stars">★ {repo.stars}</span>
                    <span title="Forks">⑂ {repo.forks}</span>
                    {repo.license && <span title={repo.license}>{repo.license}</span>}
                  </div>
                </div>

                <div className="text-[11px] text-white/35">
                  Updated {repo.updatedAt}
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
