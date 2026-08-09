/**
 * =============================================================================
 * content.tsx — ALL portfolio text/data lives in this one file.
 *
 * Want to change wording, add a project, or update a link?
 * Edit it HERE — you should almost never need to touch the section components.
 *
 * Bullets are written as JSX so they can contain <strong> and <code> styling.
 * =============================================================================
 */

import type { ReactNode } from "react"

/* ---------------------------------------------------------------------------
 * Basic identity / links — used by Nav, Hero, and Contact
 * ------------------------------------------------------------------------- */
export const IDENTITY = {
  name: "Dhiraj Rishi Atmakuri",
  firstLine: "Dhiraj Rishi", // hero renders name on two lines
  secondLine: "Atmakuri",
  email: "rishi.atmakuri@gmail.com",
  phone: "(346) 404-5507",
  phoneHref: "tel:+13464045507",
  linkedin: "https://www.linkedin.com/in/dhiraj-atmakuri",
  github: "https://github.com/dhirajatmakuri",
  resume: "/assets/dhiraj-atmakuri-resume.pdf",
  location: "Houston, TX",
}

/* ---------------------------------------------------------------------------
 * Nav links — anchor ids must match the `id` of each <section>
 * ------------------------------------------------------------------------- */
export const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Now", href: "#now" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
  // Note: Resume + social links (GitHub/LinkedIn/Email) render as ICONS on the
  // right of the nav — see Nav.tsx — using IDENTITY, not this list.
]

/* ---------------------------------------------------------------------------
 * About section — paragraphs + quick-facts table
 * ------------------------------------------------------------------------- */
export const ABOUT_PARAGRAPHS: ReactNode[] = [
  <>
    I'm a Computer Engineering graduate from Texas A&amp;M (Class of May 2026)
    who likes working where the physical and digital meet. My senior capstone,{" "}
    <strong>BluStick</strong>, is a belt-worn BLE tracking device — I designed
    and built its entire Android app solo (seven screens, a token-based design
    system, and the BLE data layer in React Native), wrote the ESP32 firmware
    in C, and wired them together through a PostgreSQL backend on Google Cloud.
  </>,
  <>
    That range is the point. I've soldered power circuits and diagnosed faults
    with a multimeter, written a bare-metal kernel and MPI programs on an HPC
    cluster, led Agile sprints as Scrum Master on a full-stack team, and run
    user research studies for an HCI project. Whether the problem lives in a
    Kalman filter, a REST API, or a usability test, I can own it end to end.
  </>,
  <>Off the clock: Coaching tennis in the summers.</>,
]

export const FACTS = [
  { label: "Degree", value: "B.S. Computer Engineering" },
  { label: "School", value: "Texas A&M University" },
  { label: "Graduated", value: "May 2026" },
  { label: "Based in", value: "Houston, TX" },
  { label: "Focus", value: "Full-stack · Embedded · UX · ML" },
  { label: "Open to", value: "Software & hardware-adjacent roles" },
]

/* ---------------------------------------------------------------------------
 * "Now" section — what I'm currently doing
 * ------------------------------------------------------------------------- */
export const NOW_ITEMS = [
  {
    tag: "STATUS",
    title: "Interviewing for full-time roles",
    body: "Open to software engineering, full-stack, mobile, embedded, and hardware-adjacent positions. Based in Texas, open to relocation.",
  },
  {
    tag: "BUILDING",
    title: "AI Job Application Copilot",
    body: "A full-stack app that scores resume-to-job fit and generates tailored outreach with an LLM — Next.js 14, PostgreSQL + pgvector RAG, Docker, and GitHub Actions CI/CD. In progress.",
  },
  {
    tag: "LEARNING",
    title: "AWS & production tooling",
    body: "Studying for the AWS Cloud Practitioner certification and deepening Docker, CI/CD, and automated testing by shipping the copilot with them.",
  },
]

/** Example questions shown inside the "ask-rishi" AI agent placeholder card */
export const AGENT_SUGGESTIONS = [
  '"How does BluStick\'s Kalman filter work?"',
  '"Has Rishi worked with PostgreSQL in production?"',
  '"Is he open to embedded roles?"',
]

/* ---------------------------------------------------------------------------
 * Featured projects — rendered as full-width rows with bullets + tags.
 * `demo` controls the optional embedded demo under the bullets:
 *   - { kind: "iframe" }  → live scaled preview of an external site
 *   - { kind: "water" }   → the interactive water-reflection canvas
 * ------------------------------------------------------------------------- */
export type ProjectDemo =
  | { kind: "iframe"; url: string; label: string }
  | { kind: "water" }

export interface Project {
  when: string
  context: string
  extra?: string
  title: string
  /** One polished, first-person paragraph — "what it is → what I did". */
  description: ReactNode
  /** Tech-stack logo keys — see the TECH registry in StackStrip.tsx. */
  stack: string[]
  demo?: ProjectDemo
  links: { label: string; href: string; github?: boolean }[]
}

export const PROJECTS: Project[] = [
  {
    when: "AUG – DEC 2025",
    context: "Senior Capstone · CSCE 483",
    extra: "5-person team · app 100% mine",
    title: "BluStick — Real-Time BLE Tracking System",
    description: (
      <>
        BluStick is a belt-worn Bluetooth Low Energy tracking device I built as
        my senior capstone. I was the sole developer of the companion app — a
        seven-screen React Native application — and also wrote the ESP32
        firmware in C, designed a Node.js and PostgreSQL backend, and soldered
        the hardware into a 3D-printed case. A 1D Kalman filter smooths the BLE
        signal to roughly 1–1.5 meters of ranging accuracy, and the finished
        device met all ten project specifications, including a 24-hour battery
        and a 15-meter range.
      </>
    ),
    stack: [
      "react", "typescript", "expo", "espressif", "c",
      "nodejs", "express", "postgresql", "astro", "tailwind",
    ],
    demo: {
      kind: "iframe",
      url: "https://blu-stick-project-portfolio.vercel.app",
      label: "blu-stick-project-portfolio.vercel.app",
    },
    links: [
      {
        label: "Source on GitHub ↗",
        href: "https://github.com/dhirajatmakuri/BluStick",
        github: true,
      },
    ],
  },
  {
    when: "SPRING 2026",
    context: "Computational Photography · CSCE 448",
    title: "Computer Vision Image-Effects Toolkit",
    description: (
      <>
        A computational photography toolkit I built in Python and OpenCV to
        create photorealistic image effects. It produces water reflections,
        tilt-shift miniaturization, and invisible watermarks through a real-time
        pipeline of perspective warping, ripple displacement, and seam-blended
        compositing. I ported the water-reflection effect to JavaScript so it
        runs live in the browser — you can try it right below.
      </>
    ),
    stack: ["python", "opencv", "numpy"],
    demo: { kind: "water" },
    links: [
      {
        label: "Source on GitHub ↗",
        href: "https://github.com/dhirajatmakuri/CSCE448",
        github: true,
      },
    ],
  },
  {
    when: "AUG – DEC 2024",
    context: "Embedded Systems · CSCE 462",
    title: "Human Radar — Autonomous Elder-Care Robot",
    description: (
      <>
        Human Radar is an autonomous elder-care robot that follows a person,
        sees in the dark, and calls for help when they fall. I built the
        MediaPipe fall-detection system and autonomous person-following using a
        PID pan/tilt camera, LiDAR, and NoIR night vision. I also assembled the
        hardware end to end — soldering the Raspberry Pi 5 rig, debugging a
        motor driver with a multimeter, and modeling custom parts in Fusion 360.
      </>
    ),
    stack: ["raspberrypi", "python", "opencv", "autodesk"],
    links: [
      {
        label: "Source on GitHub ↗",
        href: "https://github.com/dhirajatmakuri/Human-Radar-System",
        github: true,
      },
      {
        label: "Watch the robot in action ↗",
        href: "https://drive.google.com/file/d/1_jqKU0h8kfYxaFu0u5v6hLnrjFzSZahq/view",
      },
    ],
  },
  {
    when: "FALL 2024",
    context: "Software Engineering · CSCE 331",
    extra: "Team project · Scrum Master",
    title: "Panda Express POS — Full-Stack Web App",
    description: (
      <>
        A full-stack restaurant point-of-sale platform with four role-based
        interfaces — cashier, self-serve kiosk, kitchen display, and manager
        dashboard — built in Next.js 14 over a PostgreSQL database. I secured
        the REST API with NextAuth and Zod validation, built the manager
        analytics with Recharts, and led the team as Scrum Master across three
        Agile sprints.
      </>
    ),
    stack: ["nextjs", "typescript", "postgresql", "mui", "tailwind"],
    links: [],
  },
]

/* ---------------------------------------------------------------------------
 * "More work" — smaller card grid under the featured projects
 * ------------------------------------------------------------------------- */
export const MORE_WORK = [
  {
    tag: "HCI · CSCE 436 · 4-PERSON TEAM",
    title: "ClassComm — Anonymous Classroom Feedback",
    body: "Full UX process for a real-time anonymous feedback tool: user research, evidence-based requirements, high-fidelity design, and a structured user evaluation — participants unanimously rated it easy to use.",
  },
  {
    tag: "UX CASE STUDY · FIGMA · SOLO",
    title: "Smart TV Interface Redesign",
    body: "Triangulated interviews, surveys, and observation into personas, How-Might-We framing, wireframes, and a Figma prototype — audited against the WCAG POUR accessibility framework.",
  },
  {
    tag: "SYSTEMS · CSCE 313 · C++",
    title: "Systems Programming Suite",
    body: "A buddy-system memory allocator, a Unix shell with pipes and redirection, and multithreaded client–server IPC over named pipes, message queues, and shared memory with pthreads and semaphores.",
  },
  {
    tag: "HPC · CSCE 435 · GRACE CLUSTER",
    title: "Parallel & High-Performance Computing",
    body: "MPI and OpenMP programs on Texas A&M's Grace supercomputer — hypercube quicksort, a custom barrier implementation, and speedup analysis across node counts.",
  },
  {
    tag: "OS · CSCE 410 · C++ / X86 ASM",
    title: "Bare-Metal Kernel",
    body: "A kernel machine problem built from boot: x86 assembly startup, console driver, custom linker script, and makefile — no OS underneath.",
  },
  {
    tag: "FOUNDATIONS · CSCE 221 · C++",
    title: "Data Structures Library",
    body: "~4,100 lines of templated C++ built from scratch: vectors, linked lists, BSTs, hash maps, heaps, and graph algorithms including Dijkstra's shortest path and topological sort.",
  },
]

/* ---------------------------------------------------------------------------
 * Experience
 * ------------------------------------------------------------------------- */
export const EXPERIENCE = [
  {
    when: "MAY – AUG 2025",
    title: "Undergraduate Research Assistant",
    org: "Texas A&M University",
    body: "Trained deep-learning models to classify agricultural seed images, improving accuracy by tuning model architecture and evaluating metrics. Built the UI for the AI seed-classification research pipeline so researchers could use the models without touching code.",
  },
]

/* ---------------------------------------------------------------------------
 * Skills — shown as a slow marquee; keep the list short and punchy
 * ------------------------------------------------------------------------- */
export const SKILLS = [
  "Python", "TypeScript", "C / C++", "React & Next.js", "React Native (Expo)",
  "Node.js & Express", "PostgreSQL", "ESP32 & BLE", "FreeRTOS", "OpenCV",
  "Docker", "Figma",
]
