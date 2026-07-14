import { PROJECT_CONTENT } from "../content/projects";
import type { ProjectMetadata } from "../github";
import type { ProjectRepo } from "../projects.config";
import { escapeHtml, metadataRows, presentProjectImages } from "./utils";

export async function renderProjectDetail(project: ProjectMetadata): Promise<string> {
  const content = PROJECT_CONTENT[project.repo];
  const images = await presentProjectImages(project.repo, content.images);

  return `
    <article class="project-detail">
      <a class="route-link back-link" href="/" data-route>Back to projects</a>
      <header class="detail-header">
        <p class="eyebrow">${escapeHtml(project.repo)}</p>
        <h1>${escapeHtml(project.name)}</h1>
        <p class="lede">${escapeHtml(project.description ?? content.summary)}</p>
        ${metadataRows(project)}
        <a class="button" href="${escapeHtml(project.htmlUrl)}" target="_blank" rel="noreferrer">View repository</a>
      </header>

      <section class="section detail-copy" aria-labelledby="writeup-title">
        <div class="section-heading">
          <p class="eyebrow">Case study</p>
          <h2 id="writeup-title">Write-up</h2>
        </div>
        ${content.writeup.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
      </section>

      ${renderGallery(project.repo, images)}
    </article>
  `;
}

function renderGallery(repo: ProjectRepo, images: string[]): string {
  if (images.length === 0) {
    return "";
  }

  return `
    <section class="section" aria-labelledby="gallery-title">
      <div class="section-heading">
        <p class="eyebrow">Images</p>
        <h2 id="gallery-title">Gallery</h2>
      </div>
      <div class="gallery-grid">
        ${images
          .map(
            (src, index) => `
              <figure class="gallery-item">
                <img src="${escapeHtml(src)}" alt="${escapeHtml(repo)} project image ${index + 1}" loading="lazy" />
              </figure>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}
