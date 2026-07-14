import { escapeHtml } from "./utils";

export function renderNotFound(label = "Page"): string {
  return `
    <section class="not-found" aria-labelledby="not-found-title">
      <p class="eyebrow">Err 404 — signal lost</p>
      <h1 id="not-found-title">${escapeHtml(label)} not found</h1>
      <p class="lede">The requested route is not part of this portfolio.</p>
      <div class="intro-actions">
        <a class="button" href="/" data-route>Back to projects</a>
      </div>
    </section>
  `;
}
