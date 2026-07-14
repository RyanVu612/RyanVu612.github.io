import type { ProjectMetadata } from "../github";
import { PROJECT_CONTENT } from "../content/projects";
import { PROJECT_REPOS } from "../projects.config";
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

export async function renderHome(projects: ProjectMetadata[]): Promise<string> {
  const orderedProjects = PROJECT_REPOS.map((repo) => projects.find((project) => project.repo === repo)).filter(
    (project): project is ProjectMetadata => Boolean(project),
  );

  const cards = await Promise.all(
    orderedProjects.map(async (project, index) => {
      const content = PROJECT_CONTENT[project.repo];
      const [imageSrc] = await presentProjectImages(project.repo, content.images.slice(0, 1));
      return projectCard(project, index, imageSrc ?? null);
    }),
  );

  const liveCount = orderedProjects.filter((project) => project.source !== "fallback").length;

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
            <dd><a href="mailto:vuryan612@gmail.com">vuryan612@gmail.com</a></dd>
          </div>
        </dl>
        <div class="intro-actions" aria-label="Primary links">
          <a class="button" href="/resume" data-route>Resume</a>
          <a class="button button--quiet" href="https://github.com/RyanVu612" target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </div>
      <figure class="headshot boot boot--late">
        <img src="${headshotSrc}" alt="Ryan Vu headshot" />
        <figcaption>Ryan Vu</figcaption>
      </figure>
    </section>

    <section class="section" id="projects" aria-labelledby="projects-title">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Selected repositories</p>
          <h2 id="projects-title">Projects</h2>
        </div>
        <p class="section-heading__note">${String(cards.length).padStart(2, "0")} modules · ${String(liveCount).padStart(2, "0")} linked</p>
      </div>
      <div class="project-grid">
        ${cards.join("")}
      </div>
    </section>

    <section class="contact-strip" aria-labelledby="contact-title">
      <div>
        <p class="eyebrow">Contact</p>
        <h2 id="contact-title">Reach Ryan</h2>
      </div>
      <div class="contact-links">
        <a href="mailto:vuryan612@gmail.com">vuryan612@gmail.com</a>
        <a href="https://www.linkedin.com/in/ryan-q-vu/" target="_blank" rel="noreferrer">LinkedIn</a>
        <a href="https://github.com/RyanVu612" target="_blank" rel="noreferrer">GitHub</a>
      </div>
    </section>
  `;
}
