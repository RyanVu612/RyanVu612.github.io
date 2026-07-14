import type { ProjectMetadata } from "../github";
import { PROJECT_CONTENT } from "../content/projects";
import { EXPERIENCE_REPOS, PERSONAL_PROJECT_REPOS } from "../projects.config";
import type { ProjectRepo } from "../projects.config";
import { escapeHtml, formatDate, presentProjectImages, statusLight } from "./utils";

const headshotSrc = "/assets/image%20-%20Ryan%20Vu.jpeg";

function projectCard(project: ProjectMetadata, index: number, imageSrc: string | null): string {
  const content = PROJECT_CONTENT[project.repo];
  const description = project.description ?? content.summary;
  const href = `/projects/${encodeURIComponent(project.repo)}`;
  const id = String(index + 1).padStart(2, "0");
  const image = imageSrc
    ? `<img class="card__image" src="${escapeHtml(imageSrc)}" alt="${escapeHtml(project.name)} preview" loading="lazy" />`
    : "";
  const meta =
    project.source === "fallback"
      ? `<span>live data unavailable</span>`
      : `<span>${escapeHtml(project.language ?? "—")}</span><span>★ ${project.stars ?? 0}</span><span>${formatDate(project.pushedAt)}</span>`;

  return `
    <article class="card" data-project-href="${href}" tabindex="0">
      <header class="card__rail">
        <span class="card__index">${id}</span>
        ${statusLight(project.source)}
      </header>
      ${image}
      <h3 class="card__title">${escapeHtml(project.name)}</h3>
      <p class="card__desc">${escapeHtml(description)}</p>
      <footer class="card__meta">
        ${meta}
        <a class="card__cta" href="${href}" data-route>Open →</a>
      </footer>
    </article>
  `;
}

type CardGroup = {
  ordered: ProjectMetadata[];
  cards: string[];
  liveCount: number;
};

async function buildCardGroup(repos: readonly ProjectRepo[], projects: ProjectMetadata[]): Promise<CardGroup> {
  const ordered = repos
    .map((repo) => projects.find((project) => project.repo === repo))
    .filter((project): project is ProjectMetadata => Boolean(project));

  const cards = await Promise.all(
    ordered.map(async (project, index) => {
      const content = PROJECT_CONTENT[project.repo];
      const [imageSrc] = await presentProjectImages(project.repo, content.images.slice(0, 1));
      return projectCard(project, index, imageSrc ?? null);
    }),
  );

  const liveCount = ordered.filter((project) => project.source !== "fallback").length;
  return { ordered, cards, liveCount };
}

function cardsSection(options: {
  id: string;
  eyebrow: string;
  title: string;
  group: CardGroup;
}): string {
  const { id, eyebrow, title, group } = options;

  return `
    <section class="section" id="${id}" aria-labelledby="${id}-title">
      <div class="section-heading">
        <div>
          <p class="eyebrow">${eyebrow}</p>
          <h2 id="${id}-title">${title}</h2>
        </div>
        <p class="section-heading__note">${String(group.cards.length).padStart(2, "0")} modules · ${String(group.liveCount).padStart(2, "0")} linked</p>
      </div>
      <div class="project-grid">
        ${group.cards.join("")}
      </div>
    </section>
  `;
}

export async function renderExperience(projects: ProjectMetadata[]): Promise<string> {
  const group = await buildCardGroup(EXPERIENCE_REPOS, projects);
  return cardsSection({ id: "experience", eyebrow: "Team & applied work", title: "Experience", group });
}

export async function renderProjects(projects: ProjectMetadata[]): Promise<string> {
  const group = await buildCardGroup(PERSONAL_PROJECT_REPOS, projects);
  return cardsSection({ id: "projects", eyebrow: "Personal builds", title: "Projects", group });
}

export function renderHome(): string {

  return `
    <section class="hero" aria-labelledby="intro-title">
      <div class="hero__copy boot">
        <p class="eyebrow eyebrow--cursor">Software portfolio</p>
        <h1 id="intro-title">Ryan Vu builds practical software for technical workflows.</h1>
        <p class="lede">
          Computer science student and builder focused on robotics, developer tools,
          data-heavy interfaces, and product systems that need to stay clear under real constraints.
        </p>
        <dl class="hero__strip" aria-label="Quick facts">
          <div>
            <dt>Focus</dt>
            <dd>Robotics · Dev tools · Data UI</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>Open to opportunities</dd>
          </div>
          <div>
            <dt>Contact</dt>
            <dd><a href="mailto:ryanvu@cpp.edu">ryanvu@cpp.edu</a></dd>
          </div>
        </dl>
        <div class="intro-actions" aria-label="Primary links">
          <a class="button" href="/experience" data-route>Experience</a>
          <a class="button" href="/projects" data-route>Projects</a>
          <a class="button" href="/resume" data-route>Resume</a>
          <a class="button button--quiet" href="https://github.com/RyanVu612" target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </div>
      <figure class="headshot boot boot--late">
        <img src="${headshotSrc}" alt="Ryan Vu headshot" />
        <figcaption>Ryan Vu</figcaption>
      </figure>
    </section>
  `;
}
