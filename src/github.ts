import { GITHUB_OWNER, PROJECT_REPOS, repoUrl, type ProjectRepo } from "./projects.config";

const CACHE_PREFIX = "ryanvu.portfolio.repo.";

type GitHubApiRepo = {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  html_url: string;
  pushed_at: string | null;
};

type CachedRepo = {
  timestamp: number;
  data: GitHubApiRepo;
};

export type ProjectMetadata = {
  repo: ProjectRepo;
  name: string;
  description: string | null;
  language: string | null;
  stars: number | null;
  htmlUrl: string;
  pushedAt: string | null;
  cacheTimestamp: number | null;
  source: "live" | "cache" | "fallback";
};

function storage(): Storage | null {
  try {
    const testKey = `${CACHE_PREFIX}test`;
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch {
    return null;
  }
}

function cacheKey(repo: ProjectRepo): string {
  return `${CACHE_PREFIX}${repo}`;
}

function fromApi(repo: ProjectRepo, data: GitHubApiRepo, source: "live" | "cache", cacheTimestamp: number | null): ProjectMetadata {
  return {
    repo,
    name: data.name,
    description: data.description,
    language: data.language,
    stars: data.stargazers_count,
    htmlUrl: data.html_url,
    pushedAt: data.pushed_at,
    cacheTimestamp,
    source,
  };
}

function fallback(repo: ProjectRepo): ProjectMetadata {
  return {
    repo,
    name: repo,
    description: null,
    language: null,
    stars: null,
    htmlUrl: repoUrl(repo),
    pushedAt: null,
    cacheTimestamp: null,
    source: "fallback",
  };
}

function readCache(repo: ProjectRepo): ProjectMetadata | null {
  const local = storage();

  if (!local) {
    return null;
  }

  try {
    const raw = local.getItem(cacheKey(repo));

    if (!raw) {
      return null;
    }

    const cached = JSON.parse(raw) as CachedRepo;
    return fromApi(repo, cached.data, "cache", cached.timestamp);
  } catch {
    return null;
  }
}

function writeCache(repo: ProjectRepo, data: GitHubApiRepo): void {
  const local = storage();

  if (!local) {
    return;
  }

  const cached: CachedRepo = {
    timestamp: Date.now(),
    data,
  };

  try {
    local.setItem(cacheKey(repo), JSON.stringify(cached));
  } catch {
    // The site remains usable when storage quota or privacy settings block writes.
  }
}

export async function fetchProjectMetadata(repo: ProjectRepo): Promise<ProjectMetadata> {
  try {
    const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${repo}`, {
      headers: {
        Accept: "application/vnd.github+json",
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub responded with ${response.status}`);
    }

    const data = (await response.json()) as GitHubApiRepo;
    writeCache(repo, data);
    return fromApi(repo, data, "live", Date.now());
  } catch {
    return readCache(repo) ?? fallback(repo);
  }
}

export async function fetchAllProjectMetadata(): Promise<ProjectMetadata[]> {
  return Promise.all(PROJECT_REPOS.map((repo) => fetchProjectMetadata(repo)));
}
