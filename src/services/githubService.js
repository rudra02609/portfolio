const GITHUB_USERNAME = "rudra02609";
const CACHE_KEY = "github_repos_data";

export async function fetchGitHubRepos() {
  // Check sessionStorage cache first
  const cachedData = sessionStorage.getItem(CACHE_KEY);
  if (cachedData) {
    try {
      return JSON.parse(cachedData);
    } catch (e) {
      console.error("Error parsing cached repositories:", e);
    }
  }

  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`);
    if (!response.ok) {
      throw new Error(`GitHub API returned status: ${response.status}`);
    }
    const data = await response.json();

    // Filter, sort and format repositories
    const formattedRepos = data
      .filter((repo) => !repo.fork && repo.name !== ".github" && !repo.archived)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .map((repo) => ({
        id: repo.id,
        name: repo.name.replace(/-/g, " "), // Pretty display name
        rawName: repo.name,
        description: repo.description || "An interesting project built with dedication and clean engineering principles.",
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
        topics: repo.topics && repo.topics.length > 0 ? repo.topics : [repo.language ? repo.language.toLowerCase() : "react"],
        htmlUrl: repo.html_url,
        homepage: repo.homepage || null,
        isFeatured: repo.stargazers_count > 0 || repo.forks_count > 0 || ["portfolio", "machine-learning", "deep-learning"].some(term => repo.name.toLowerCase().includes(term))
      }));

    // Cache the parsed response
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(formattedRepos));
    return formattedRepos;
  } catch (error) {
    console.error("Failed fetching repositories from GitHub:", error);
    // Return empty list or fallbacks
    throw error;
  }
}
