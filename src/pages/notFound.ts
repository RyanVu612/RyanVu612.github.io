import { escapeHtml } from "./utils";

export function renderNotFound(label = "Page"): string {
  return `
    <section class="not-found" aria-labelledby="not-found-title">
      <p class="eyebrow">404</p>
      <h1 id="not-found-title">${escapeHtml(label)} not found</h1>
      <p>The requested route is not part of this portfolio.</p>
      <a class="button" href="/" data-route>Back to projects</a>
    </section>
  `;
}
