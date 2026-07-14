import { fetchAllProjectMetadata, type ProjectMetadata } from "./github";
import { isProjectRepo, PROJECT_REPOS } from "./projects.config";
import { renderExperience, renderHome, renderProjects } from "./pages/home";
import { renderNotFound } from "./pages/notFound";
import { renderProjectDetail } from "./pages/projectDetail";
import { renderResume } from "./pages/resume";

type Route =
  | { name: "home" }
  | { name: "experience" }
  | { name: "projects" }
  | { name: "resume" }
  | { name: "project"; repo: string }
  | { name: "not-found" };

function parseRoute(pathname: string): Route {
  const path = pathname.replace(/\/+$/, "") || "/";

  if (path === "/") {
    return { name: "home" };
  }

  if (path === "/experience") {
    return { name: "experience" };
  }

  if (path === "/projects") {
    return { name: "projects" };
  }

  if (path === "/resume") {
    return { name: "resume" };
  }

  const projectMatch = path.match(/^\/projects\/([^/]+)$/);

  if (projectMatch) {
    return { name: "project", repo: decodeURIComponent(projectMatch[1] ?? "") };
  }

  return { name: "not-found" };
}

function shell(content: string, route: Route): string {
  const navLink = (href: string, label: string, active: boolean): string =>
    `<a href="${href}" data-route${active ? ` aria-current="page"` : ""}>${label}</a>`;

  return `
    <a class="skip-link" href="#main-content">Skip to content</a>
    <header class="site-header">
      <a class="site-mark" href="/" data-route>Ryan Vu<span class="site-mark__cursor" aria-hidden="true">_</span></a>
      <nav class="site-nav" aria-label="Primary navigation">
        ${navLink("/", "Home", route.name === "home")}
        ${navLink("/experience", "Experience", route.name === "experience")}
        ${navLink("/projects", "Projects", route.name === "projects" || route.name === "project")}
        ${navLink("/resume", "Resume", route.name === "resume")}
        <a href="mailto:ryanvu@cpp.edu">Email</a>
        <a href="https://github.com/RyanVu612" target="_blank" rel="noreferrer">GitHub</a>
        <a href="https://www.linkedin.com/in/ryan-q-vu/" target="_blank" rel="noreferrer">LinkedIn</a>
      </nav>
    </header>
    <main id="main-content" class="site-main">
      ${content}
    </main>
    <footer class="site-footer">
      <span>Ryan Vu · Villa Park, CA</span>
      <a href="mailto:ryanvu@cpp.edu">ryanvu@cpp.edu</a>
      <a href="https://www.linkedin.com/in/ryan-q-vu/" target="_blank" rel="noreferrer">LinkedIn</a>
      <a href="https://github.com/RyanVu612" target="_blank" rel="noreferrer">GitHub</a>
    </footer>
  `;
}

function loadingView(): string {
  return `
    <section class="loading-view" aria-live="polite">
      <p class="eyebrow eyebrow--cursor">Establishing link</p>
      <p class="lede">Fetching project telemetry from GitHub.</p>
    </section>
  `;
}

function projectByRepo(projects: ProjectMetadata[], repo: string): ProjectMetadata | null {
  if (!isProjectRepo(repo)) {
    return null;
  }

  return projects.find((project) => project.repo === repo) ?? null;
}

export function startRouter(root: HTMLElement): void {
  let projectDataPromise = fetchAllProjectMetadata();

  async function render(): Promise<void> {
    const route = parseRoute(window.location.pathname);
    root.innerHTML = shell(loadingView(), route);

    try {
      const projects = await projectDataPromise;
      let view = "";

      if (route.name === "home") {
        view = renderHome();
      } else if (route.name === "experience") {
        view = await renderExperience(projects);
      } else if (route.name === "projects") {
        view = await renderProjects(projects);
      } else if (route.name === "resume") {
        view = renderResume();
      } else if (route.name === "project") {
        const project = projectByRepo(projects, route.repo);
        view = project ? await renderProjectDetail(project) : renderNotFound("Project");
      } else {
        view = renderNotFound();
      }

      root.innerHTML = shell(view, route);
      attachProjectCardHandlers(root, navigate);
    } catch {
      projectDataPromise = Promise.resolve(PROJECT_REPOS.map((repo) => ({
        repo,
        name: repo,
        description: null,
        language: null,
        stars: null,
        htmlUrl: `https://github.com/RyanVu612/${repo}`,
        pushedAt: null,
        cacheTimestamp: null,
        source: "fallback" as const,
      })));
      await render();
    }
  }

  function navigate(href: string): void {
    if (href !== window.location.pathname) {
      window.history.pushState({}, "", href);
    }

    window.scrollTo({ top: 0, behavior: "auto" });
    void render();
  }

  document.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const link = target.closest<HTMLAnchorElement>("a[data-route]");

    if (!link) {
      return;
    }

    const url = new URL(link.href);

    if (url.origin !== window.location.origin) {
      return;
    }

    event.preventDefault();
    navigate(`${url.pathname}${url.search}${url.hash}`);
  });

  window.addEventListener("popstate", () => {
    void render();
  });

  void render();
}

function attachProjectCardHandlers(root: HTMLElement, navigate: (href: string) => void): void {
  const cards = root.querySelectorAll<HTMLElement>("[data-project-href]");

  cards.forEach((card) => {
    const href = card.dataset.projectHref;

    if (!href) {
      return;
    }

    card.addEventListener("click", (event) => {
      const target = event.target;

      if (target instanceof Element && target.closest("a")) {
        return;
      }

      navigate(href);
    });

    card.addEventListener("keydown", (event) => {
      const target = event.target;

      if (target instanceof Element && target.closest("a")) {
        return;
      }

      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      event.preventDefault();
      navigate(href);
    });
  });
}
