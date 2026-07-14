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
    return "N/A";
  }

  return new Date(value).toISOString().slice(0, 10);
}

const STATUS_LABELS: Record<ProjectMetadata["source"], string> = {
  live: "Live GitHub data",
  cache: "Cached GitHub data",
  fallback: "GitHub data unavailable",
};

export function statusLight(source: ProjectMetadata["source"]): string {
  const label = STATUS_LABELS[source];
  return `<span class="status status--${source}" title="${label}"><span class="sr-only">${label}</span></span>`;
}

export function metadataRows(project: ProjectMetadata): string {
  if (project.source === "fallback") {
    return `
      <p class="project-note">${statusLight("fallback")} live data unavailable — view on GitHub</p>
    `;
  }

  return `
    <dl class="readout" aria-label="${escapeHtml(project.name)} GitHub metadata">
      <div>
        <dt>Lang</dt>
        <dd>${escapeHtml(project.language ?? "—")}</dd>
      </div>
      <div>
        <dt>Stars</dt>
        <dd>${project.stars ?? 0}</dd>
      </div>
      <div>
        <dt>Pushed</dt>
        <dd>${formatDate(project.pushedAt)}</dd>
      </div>
      <div>
        <dt>Link</dt>
        <dd>${statusLight(project.source)} ${project.source === "live" ? "Live" : "Cached"}</dd>
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
