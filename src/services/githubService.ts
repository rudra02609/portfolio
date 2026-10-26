import { contactInfo } from '../constants/portfolioData';

const GITHUB_USERNAME = contactInfo.github;
const CACHE_KEY = "github_repos_data_rudra";

// Read GitHub token from env (optional). Never expose a secret in the UI bundle.
const getToken = () => import.meta.env.VITE_GITHUB_TOKEN || "";

export interface GitHubRepo {
  id: number;
  name: string;
  rawName: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  issues: number;
  license: string;
  createdAt: string;
  updatedAt: string;
  topics: string[];
  htmlUrl: string;
  homepage: string | null;
  isFeatured: boolean;
  isFork: boolean;
}

export async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  // Check sessionStorage cache first
  const cachedData = sessionStorage.getItem(CACHE_KEY);
  if (cachedData) {
    try {
      return JSON.parse(cachedData) as GitHubRepo[];
    } catch (e) {
      console.error("Error parsing cached repositories:", e);
    }
  }

  const baseUrl = `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`;
  let url = baseUrl;
  const allRepos: GitHubRepo[] = [];

  while (url) {
    const response = await fetch(
      url,
      {
        headers: getToken()
          ? { Authorization: `Bearer ${getToken()}`, Accept: "application/vnd.github+json" }
          : { Accept: "application/vnd.github+json" },
      }
    );

    if (response.status === 403 || response.status === 429) {
      throw new Error("GitHub API rate limit reached. Please try again later.");
    }

    if (!response.ok) {
      throw new Error(`GitHub API returned status: ${response.status}`);
    }

    const data: any[] = await response.json();
    allRepos.push(...data);

    // Parse Link header for next page
    const linkHeader = response.headers.get('link');
    url = linkHeader
      ?.split(';')
      .find((part) => part.includes('rel="next"'))
      .split('<')[1]
      .split('>')[0];
  }

  // Deduplicate by repo ID (in case of overlapping pages)
  const seen = new Set();
  const uniqueRepos = allRepos.filter((repo) => {
    if (seen.has(repo.id)) return false;
    seen.add(repo.id);
    return true;
  });

  const formattedRepos: GitHubRepo[] = uniqueRepos
    .filter((repo) => repo.name !== ".github" && !repo.archived)
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .map((repo) => ({
      id: repo.id,
      name: repo.name.replace(/-/g, " "),
      rawName: repo.name,
      description:
        repo.description ||
        "An interesting project built with dedication and clean engineering principles.",
      language: repo.language || "JavaScript",
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      issues: repo.open_issues_count,
      license: repo.license ? repo.license.name : "MIT License",
      createdAt: new Date(repo.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      updatedAt: new Date(repo.updated_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      topics:
        repo.topics && repo.topics.length > 0
          ? repo.topics
          : [repo.language ? repo.language.toLowerCase() : "code"],
      htmlUrl: repo.html_url,
      homepage: repo.homepage || null,
      isFeatured:
        repo.stargazers_count > 0 ||
        repo.forks_count > 0 ||
        ["portfolio", "machine-learning", "deep-learning", "ai"].some((term) =>
          repo.name.toLowerCase().includes(term)
        ),
      isFork: repo.fork,
    }));

  // Cache the parsed response
  sessionStorage.setItem(CACHE_KEY, JSON.stringify(formattedRepos));
  return formattedRepos;
}
