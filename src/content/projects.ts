import type { ProjectRepo } from "../projects.config";

export type ProjectContent = {
  title: ProjectRepo;
  summary: string;
  writeup: string[];
  images: string[];
};

export const PROJECT_CONTENT: Record<ProjectRepo, ProjectContent> = {
  Panoptik: {
    title: "Panoptik",
    summary:
      "A full-stack product project focused on turning authenticated user workflows into a cohesive application experience.",
    writeup: [
      "Panoptik represents Ryan's work on a production-shaped app surface: account flows, durable data boundaries, and user-facing states that need to stay understandable when the network or platform is imperfect.",
      "Ryan's role centers on connecting the user experience to the underlying service contracts, keeping authentication and account communication paths consistent without hiding failures from the person using the app.",
      "The notable challenge is balancing product polish with implementation discipline: preserving the platform source of truth, keeping sensitive flows explicit, and designing fallback behavior that does not create duplicate business logic.",
    ],
    images: [],
  },
  GCS: {
    title: "GCS",
    summary:
      "A ground-control style project for monitoring and operating technical systems with clear state and command surfaces.",
    writeup: [
      "GCS is presented as a control-oriented project: a place where live state, operator decisions, and reliable feedback need to be visible without cluttering the interface.",
      "Ryan's role is reflected in the system design work around data presentation, command pathways, and layouts that support fast scanning under changing conditions.",
      "The key challenge is making dense technical information useful. The project favors explicit state, predictable controls, and a structure that can grow as additional telemetry or command modules are added.",
    ],
    images: [],
  },
  rotorboard: {
    title: "rotorboard",
    summary:
      "A rotorcraft telemetry dashboard project with configurable views, replayable data sources, and operator-focused instrumentation.",
    writeup: [
      "rotorboard is a telemetry and dashboard project built around the needs of people inspecting vehicle state, sensor readings, and flight-relevant data in one place.",
      "Ryan's role spans the interaction model and the runtime plumbing: making data sources selectable, keeping dashboard widgets predictable, and supporting replayable inputs for repeatable development and testing.",
      "The notable challenge is reliability. Telemetry interfaces fail when they depend on fragile visual assumptions, so the project emphasizes stable settings, explicit data-source behavior, and testable UI seams.",
    ],
    images: [],
  },
  "bach-path": {
    title: "bach-path",
    summary:
      "A desktop and API workflow for pathology-style image inference, review, and persisted result inspection.",
    writeup: [
      "bach-path focuses on moving image-analysis results from inference into a reviewable desktop experience. The work is not just model output; it is also startup behavior, persistence, and clear viewer state.",
      "Ryan's role includes tracing the full path from local app launch to backend processing and then to visible overlays, so a user can tell whether a result failed in inference, persistence, or rendering.",
      "The hard part is keeping a complex local workflow debuggable. Large outputs, local API health, and result payload shape all need to be handled without turning the viewer into a black box.",
    ],
    images: [],
  },
  rocklog: {
    title: "rocklog",
    summary:
      "A logging project for tracking climbing sessions, routes, and progress over time.",
    writeup: [
      "rocklog is a personal tracking application concept for recording climbing activity in a way that can survive beyond a single note or spreadsheet.",
      "Ryan's role is in shaping the data model and interface around repeated use: quick entry, readable history, and enough structure to compare progress without overcomplicating the log.",
      "The notable challenge is restraint. A useful activity log needs to stay fast and familiar while still capturing the details that make later review meaningful.",
    ],
    images: [],
  },
  CoSA: {
    title: "CoSA",
    summary:
      "A structured software project presented as a focused build around a specific workflow Ryan wanted to make more reliable and usable.",
    writeup: [
      "CoSA is presented as a project where the goal is to take a repeated task and give it a dependable shape: clear inputs, understandable state, and outputs a user can trust without second-guessing the tooling.",
      "Ryan's role is in defining the structure and implementation boundaries, connecting the interface to the underlying logic while keeping the moving parts explicit and easy to reason about.",
      "The notable challenge is keeping the project simple as it grows. It favors predictable behavior, testable seams, and conventions that let future additions land without making the whole surface harder to follow.",
    ],
    images: [],
  },
  hub: {
    title: "hub",
    summary:
      "A central workspace-style project for collecting tools, links, or operating surfaces into one navigable place.",
    writeup: [
      "hub is a project about reducing navigation friction: bringing related resources into a single place so repeated workflows start from the same known surface.",
      "Ryan's role is in organizing information architecture and implementation boundaries so the project can be useful immediately while staying easy to extend.",
      "The design challenge is avoiding a junk drawer. The project needs clear grouping, fast access, and conventions that keep future additions from making the whole surface harder to scan.",
    ],
    images: [],
  },
  "2024_Robot": {
    title: "2024_Robot",
    summary:
      "A robotics codebase for a 2024 competition robot, where control logic and team iteration have to meet real hardware.",
    writeup: [
      "2024_Robot showcases Ryan's robotics work in a setting where software decisions are tested against physical behavior, match constraints, and team development pressure.",
      "Ryan's role is represented through robot-side implementation work: organizing mechanisms, controls, and autonomous or assisted behaviors into code the team can operate and revise.",
      "The notable challenge is the hardware feedback loop. Good robot code has to be readable enough for rapid iteration while still protecting the assumptions that keep a mechanism safe and predictable.",
    ],
    images: [],
  },
  "CS2640-Blackjack": {
    title: "CS2640-Blackjack",
    summary:
      "A fully playable Blackjack game written in MIPS assembly, running in the MARS simulator with an interactive console interface.",
    writeup: [
      "CS2640-Blackjack implements the complete game loop of Blackjack — dealing, hitting, standing, and win/loss resolution — entirely in MIPS assembly, with all game state managed in registers and memory by hand.",
      "Ryan's role covers the whole program: structuring the control flow with syscalls for console I/O, factoring repeated logic into assembly macros, and keeping the game playable through MARS's Run I/O interface.",
      "The notable challenge is doing everything without a high-level language: no data structures, no standard library, just registers, branches, and memory. The project shows how far disciplined low-level code organization can go.",
    ],
    images: [],
  },
};
