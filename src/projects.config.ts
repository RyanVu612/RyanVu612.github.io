export const GITHUB_OWNER = "RyanVu612";

export const EXPERIENCE_REPOS = ["GCS", "rotorboard", "bach-path", "2024_Robot"] as const;

export const PERSONAL_PROJECT_REPOS = ["Panoptik", "rocklog", "CoSA", "hub", "CS2640-Blackjack"] as const;

export const PROJECT_REPOS = [...EXPERIENCE_REPOS, ...PERSONAL_PROJECT_REPOS] as const;

export type ProjectRepo = (typeof PROJECT_REPOS)[number];

export function isProjectRepo(value: string): value is ProjectRepo {
  return (PROJECT_REPOS as readonly string[]).includes(value);
}

export function repoUrl(repo: ProjectRepo): string {
  return `https://github.com/${GITHUB_OWNER}/${repo}`;
}
