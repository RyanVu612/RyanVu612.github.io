import type { ProjectMetadata } from "../github";
import { PROJECT_CONTENT } from "../content/projects";
import { PROJECT_REPOS } from "../projects.config";
import { escapeHtml, metadataRows } from "./utils";

const headshotSrc = "/assets/image%20-%20Ryan%20Vu.jpeg";

function projectCard(project: ProjectMetadata): string {
  const content = PROJECT_CONTENT[project.repo];
  const description = project.description ?? content.summary;

  return `
    <article class="project-card" data-project-href="/projects/${encodeURIComponent(project.repo)}" tabindex="0">
      <div class="project-card__topline">
        <span class="eyebrow">${escapeHtml(project.repo)}</span>
        <a class="external-link" href="${escapeHtml(project.htmlUrl)}" target="_blank" rel="noreferrer">GitHub</a>
      </div>
      <h3>${escapeHtml(project.name)}</h3>
      <p>${escapeHtml(description)}</p>
      ${metadataRows(project)}
      <a class="route-link project-card__details" href="/projects/${encodeURIComponent(project.repo)}" data-route>View project</a>
    </article>
  `;
}

export function renderHome(projects: ProjectMetadata[]): string {
  const orderedProjects = PROJECT_REPOS.map((repo) => projects.find((project) => project.repo === repo)).filter(
    (project): project is ProjectMetadata => Boolean(project),
  );

  return `
    <section class="home-grid" aria-labelledby="intro-title">
      <div class="intro-copy">
        <p class="eyebrow">Software portfolio</p>
        <h1 id="intro-title">Ryan Vu builds practical software for technical workflows.</h1>
        <p class="lede">
          Computer science student and builder focused on robotics, developer tools,
          data-heavy interfaces, and product systems that need to stay clear under real constraints.
        </p>
        <div class="intro-actions" aria-label="Primary links">
          <a class="button" href="/resume" data-route>Resume</a>
          <a class="button button--quiet" href="mailto:vuryan612@gmail.com">Email</a>
        </div>
      </div>
      <figure class="headshot-block">
        <img src="${headshotSrc}" alt="Ryan Vu headshot" />
      </figure>
    </section>

    <section class="section" id="projects" aria-labelledby="projects-title">
      <div class="section-heading">
        <p class="eyebrow">Selected repositories</p>
        <h2 id="projects-title">Projects</h2>
      </div>
      <div class="project-grid">
        ${orderedProjects.map(projectCard).join("")}
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
