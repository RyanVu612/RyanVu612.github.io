import type { ProjectMetadata } from "../github";
import type { ProjectRepo } from "../projects.config";

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function formatDate(value: string | null): string {
  if (!value) {
    return "Unavailable";
  }

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function metadataRows(project: ProjectMetadata): string {
  if (project.source === "fallback") {
    return `
      <p class="project-note">live data unavailable, view on GitHub</p>
    `;
  }

  return `
    <dl class="meta-grid" aria-label="${escapeHtml(project.name)} GitHub metadata">
      <div>
        <dt>Language</dt>
        <dd>${escapeHtml(project.language ?? "Not listed")}</dd>
      </div>
      <div>
        <dt>Stars</dt>
        <dd>${project.stars ?? 0}</dd>
      </div>
      <div>
        <dt>Updated</dt>
        <dd>${formatDate(project.pushedAt)}</dd>
      </div>
    </dl>
  `;
}

export function projectImagePath(repo: ProjectRepo, filename: string): string {
  return `/assets/projects/${encodeURIComponent(repo)}/${encodeURIComponent(filename)}`;
}

function imageExists(src: string): Promise<string | null> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(src);
    image.onerror = () => resolve(null);
    image.src = src;
  });
}

export async function presentProjectImages(repo: ProjectRepo, filenames: string[]): Promise<string[]> {
  if (filenames.length === 0) {
    return [];
  }

  const checks = await Promise.all(filenames.map((filename) => imageExists(projectImagePath(repo, filename))));
  return checks.filter((src): src is string => src !== null);
}
