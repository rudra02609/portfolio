import { contactInfo } from '../constants/portfolioData';

const GITHUB_USERNAME = contactInfo.github;
const CACHE_KEY = "github_repos_data_rudra";

// Read GitHub token from env (optional). Never expose a secret in the UI bundle.
const getToken = () => import.meta.env.VITE_GITHUB_TOKEN || "";

// GitHub API returns repo data with snake_case property names
export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  license: { name: string } | null;
  created_at: string;
  updated_at: string;
  topics: string[];
  html_url: string;
  homepage: string | null;
  fork: boolean;
  archived: boolean;
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

    const data: GitHubRepo[] = await response.json();
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

  // Filter out .github repo and archived repos, then sort by updated date descending
  const formattedRepos: GitHubRepo[] = uniqueRepos
    .filter((repo) => repo.name !== ".github" && !repo.archived)
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

  // Cache the parsed response
  sessionStorage.setItem(CACHE_KEY, JSON.stringify(formattedRepos));
  return formattedRepos;
}