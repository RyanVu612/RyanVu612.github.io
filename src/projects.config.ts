export const GITHUB_OWNER = "RyanVu612";

export const PROJECT_REPOS = [
  "Panoptik",
  "GCS",
  "rotorboard",
  "bach-path",
  "rocklog",
  "hub",
  "2024_Robot",
] as const;

export type ProjectRepo = (typeof PROJECT_REPOS)[number];

export function isProjectRepo(value: string): value is ProjectRepo {
  return (PROJECT_REPOS as readonly string[]).includes(value);
}

export function repoUrl(repo: ProjectRepo): string {
  return `https://github.com/${GITHUB_OWNER}/${repo}`;
}
