# Portfolio Site — Spec

## Objective
A personal portfolio site for Ryan Vu, hosted at `RyanVu612.github.io`, aimed at
recruiters and hiring managers evaluating him for jobs/internships. It presents
who he is, showcases real GitHub projects with room for a fuller written
story than GitHub itself provides, and gives easy access to his resume and
contact info. Success = a recruiter can land on the site, understand Ryan's
background in under a minute, browse into any project for details/images, and
reach him or his resume in one click.

## Requirements

### Content sections
1. Home/About: headshot, short bio/intro, positioned above or alongside the
   projects grid on the same landing view.
2. Projects — cover page: a grid/list of project cards, one per allow-listed
   repo, in this fixed display order: `Panoptik`, `GCS`, `rotorboard`,
   `bach-path`, `rocklog`, `hub`, `2024_Robot`.
3. Projects — detail page: one page per project, reachable by clicking its
   card, showing the project's full write-up and image gallery (see below).
4. Resume: a section/page that displays and links to the existing
   `assets/Ryan_Vu_Resume.pdf` (view in-browser and/or download).
5. Contact: email (`vuryan612@gmail.com`), LinkedIn
   (`https://www.linkedin.com/in/ryan-q-vu/`), and GitHub
   (`https://github.com/RyanVu612`) links, visible in a persistent
   header/footer or a dedicated Contact section.

### Project data — GitHub API (live, client-side)
6. Repo list is a manual allowlist of exactly these 7 repo names, defined in
   a single TypeScript config file (e.g. `src/projects.config.ts`):
   `Panoptik, GCS, rotorboard, bach-path, rocklog, hub, 2024_Robot`.
7. On page load, the browser calls the GitHub REST API
   (`GET /repos/RyanVu612/{repo}` for each allow-listed repo) to fetch:
   name, description, primary language, star count, repo URL, and
   last-updated timestamp.
8. Fetched data is cached in `localStorage` (with a timestamp) on every
   successful fetch.
9. If a fetch fails or is rate-limited, the site falls back to the most
   recent cached copy for that repo (if any) and renders normally, no error
   shown to the visitor. If there is no cache yet and the fetch fails, the
   card shows the repo name/link only, with a small "live data unavailable"
   note instead of blocking the page.

### Project data — manual content
10. Each allow-listed repo has a corresponding entry in a local content file
    (e.g. `src/content/projects/<repo-name>.ts` or a single
    `src/content/projects.ts` keyed by repo name) containing:
    - a long-form written description (what it does, Ryan's role,
      notable challenges/decisions)
    - an ordered list of image filenames for that project's gallery
11. Project images live under `assets/projects/<repo-name>/` (one folder per
    repo). The content file lists which filenames in that folder to render
    and in what order. Images are not present yet — this is expected at
    launch (see Edge Cases).
12. The project detail page renders, in order: project name, GitHub-sourced
    metadata (language, stars, last updated, repo link), the manual
    long-form description, then the image gallery (if any images are
    listed and present).

### Navigation
13. Single `index.html`, client-side routing via the History API (e.g.
    `/`, `/projects/<repo-name>`, `/resume`) — no full page reloads between
    sections. Direct navigation to a project URL (e.g. a shared link or
    browser refresh) must load that project's detail page correctly.

### Visual design
14. Dark, technical/terminal-inspired aesthetic: dark background, a single
    accent color used sparingly, monospace type for accents (headings,
    labels, code-like elements), sharp/minimal-radius edges. No color
    gradients, no generic "AI-generated" UI patterns (glassmorphism,
    oversaturated purple/blue gradients, stock hero illustrations).
15. Responsive layout: usable and readable on both desktop and mobile
    viewport widths.

### Tech stack / build
16. Source written in TypeScript and CSS (no UI framework).
17. Built with Vite (`vite build` produces static output ready for
    GitHub Pages).
18. Deployed via a GitHub Actions workflow that runs on push to `main`:
    installs deps, runs `vite build`, and publishes the output using
    GitHub Pages' Actions deployment (repo's Pages source set to
    "GitHub Actions"). No built output is committed to the repo.

### Explicitly deferred (not in this build)
- Project images themselves (folders/config wired up, actual image files
  added later by Ryan).
- Any project not in the 7-repo allowlist; adding future projects means
  editing the allowlist/content file, not new site logic.
- Blog, testimonials, analytics, or any section beyond
  About/Projects/Resume/Contact.
- Authentication, CMS, or non-GitHub-Pages hosting.

## Constraints
- Must deploy as a fully static site on GitHub Pages from this repo
  (`RyanVu612.github.io`); no server-side runtime.
- No new runtime dependency beyond what Vite needs and the browser's native
  `fetch`/GitHub REST API — no UI framework, no CSS framework/utility
  library, no gradient-heavy design system.
- GitHub REST API is unauthenticated (no token committed to a public repo),
  so calls are subject to the standard 60 requests/hour per-IP limit — the
  localStorage caching in Requirement 8–9 exists specifically to keep the
  site usable under that limit.
- Repo names in the allowlist are case-sensitive and must match GitHub
  exactly.
- Real contact info (email, LinkedIn, GitHub) is published on a public
  page — no placeholder/fake values.

## Edge Cases
- **GitHub API fetch fails / rate-limited, no cache exists**: render the
  card/page with repo name + link to GitHub only, plus a small
  "live data unavailable, view on GitHub" note. Page must not crash or
  block on this.
- **GitHub API fetch fails / rate-limited, cache exists**: silently render
  the cached data; no visible error to the user.
- **A repo in the allowlist is renamed, deleted, or made private on
  GitHub**: treat like a failed fetch for that repo (fall back to cache if
  present, else name/link-only card) — do not remove it from the UI or
  throw an unhandled error.
- **Project has no images yet in `assets/projects/<repo-name>/`**: detail
  page renders without a gallery section (no broken image icons, no empty
  placeholder boxes).
- **Direct/refreshed navigation to a project detail URL**: must resolve to
  the correct project, not fall back to the home page.
- **Unknown project URL** (repo name not in the allowlist): show a simple
  not-found state with a link back to the projects grid.
- **Narrow mobile viewport**: project grid, header/nav, and detail pages
  reflow to a single readable column; no horizontal scrolling.
- **`localStorage` unavailable** (privacy mode/disabled): site still
  functions, it just re-fetches from the API every load instead of caching.

## Definition of Done
- [ ] Site builds with `vite build` and outputs static files with no
      TypeScript errors.
- [ ] A GitHub Actions workflow builds and deploys to GitHub Pages on push
      to `main`, and the Pages source is set to "GitHub Actions".
- [ ] Home view shows headshot, bio, and the projects grid without
      requiring navigation.
- [ ] All 7 allow-listed repos (`Panoptik`, `GCS`, `rotorboard`,
      `bach-path`, `rocklog`, `hub`, `2024_Robot`) render as project cards
      in that order, each showing live-fetched GitHub metadata (language,
      stars, last updated, link).
- [ ] Clicking any project card navigates (no full reload) to that
      project's own URL and detail page, showing its manual write-up and
      metadata.
- [ ] Refreshing the browser on a project detail URL loads that same
      project directly (not the home page).
- [ ] Resume section displays/links `assets/Ryan_Vu_Resume.pdf` and it
      opens/downloads correctly.
- [ ] Contact section/header shows working links for email, LinkedIn, and
      GitHub with the confirmed real values.
- [ ] Simulating an API failure (e.g. throttling/blocking the GitHub API
      request in devtools) after at least one successful load still shows
      cached project data with no visible error.
- [ ] Simulating an API failure with no prior cache shows the
      name/link-only fallback card, not a crash or blank page.
- [ ] A project with no files yet in its `assets/projects/<repo-name>/`
      folder renders its detail page with no gallery section and no broken
      images.
- [ ] Layout is usable with no horizontal scroll at a mobile width
      (~375px) and a desktop width (~1440px).
- [ ] No color gradients or glassmorphism-style elements anywhere in the
      CSS; dark theme with a single accent color is applied consistently
      across all sections.
