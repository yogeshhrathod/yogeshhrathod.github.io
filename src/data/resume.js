export const profile = {
  name: "Yogesh Rathod",
  title: "Senior Software Engineer",
  focus: "Applied AI & Full Stack",
  location: "Pune, India",
  tagline: "I BUILD AI SYSTEMS & SHIP PRODUCTS.",
  summary:
    "Senior Software Engineer with more than seven years of experience since 2019. At Qualys I build applied AI systems: an internal AI assistant, multi-agent workflows, MCP integrations, and streaming interfaces. Before that I scaled a centralized reporting service from 100 MB to multi-gigabyte reports. Outside work I ship my own products end to end: an iOS app on the App Store, MCP servers on npm, and open-source React libraries. I have worked in a startup environment, gathering requirements directly from customers and turning them into working software.",
  resumePdf: "/yogesh_rathod_resume.pdf",
};

export const projects = [
  {
    title: "HAPTIX",
    name: "Haptix: Physical Feel",
    subtitle: "Physical Feel",
    date: "LIVE ON THE APP STORE · AUG 2026",
    stack: ["Swift", "SwiftUI", "Core Haptics", "Supabase", "Cloudflare"],
    desc: "A free iOS app that adds haptic tracks to YouTube videos, so viewers feel engines, impacts, and bass through the iPhone. People publish tracks to a community feed with likes, comments, and profiles.",
    points: [
      "Shipped a free iOS app, live on the App Store since August 2026, that adds haptic tracks to YouTube videos so viewers feel engines, impacts, and bass through the iPhone. People publish tracks to a community feed with likes, comments, and profiles.",
      "Built a video-editor-style haptic studio: a scrubbable, pinch-to-zoom timeline, tap pads, hold-to-rumble, motion-sensor recording that maps phone tilt to texture, preset stamps, undo, and 0.5x slow motion for precise placement.",
      "Synced playback by compiling each track into one Core Haptics pattern and correcting drift against the YouTube player clock every 100 ms.",
      "Added audio-driven auto-haptics that listen while the video plays and turn beat onsets into taps and sustained bass into rumble.",
      "Designed the Supabase backend with row-level security (public reads, signed-in writes only), Apple and Google sign-in, edge functions for publishing and account deletion, and shareable post links served from Cloudflare.",
    ],
    links: [
      { label: "APP STORE", href: "https://apps.apple.com/app/haptix-physical-feel/id6794054309" },
      { label: "WEBSITE", href: "https://haptix.maincharacter.one/" },
    ],
  },
  {
    title: "JIRA MCP",
    name: "Jira MCP Server",
    subtitle: "Jira MCP Server",
    date: "OPEN SOURCE · NPM",
    stack: ["TypeScript", "Node.js", "MCP SDK v2"],
    desc: "A Model Context Protocol server with 29 tools that lets AI clients work with self-hosted Jira. It validates fields against Jira's real options and asks the user through MCP elicitation instead of guessing.",
    points: [
      "Built a Model Context Protocol server with 29 tools that lets AI clients work with self-hosted Jira: issues, JQL search, comments, transitions, watchers, and links.",
      "Validated field values against Jira's real options before writing. When a value is ambiguous, the server asks the user through MCP elicitation instead of guessing, and it checks for an existing ticket before retrying a timed-out create.",
    ],
    links: [
      { label: "GITHUB", href: "https://github.com/yogeshhrathod/JiraMCP" },
      { label: "NPM", href: "https://www.npmjs.com/package/jira-mcp-server-pro" },
    ],
  },
  {
    title: "QIVI",
    name: "Qivi",
    subtitle: "GPU particle avatar for AI assistants",
    date: "OPEN SOURCE · NPM",
    stack: ["TypeScript", "React 19", "Three.js / WebGL"],
    desc: "An open-source React library that gives AI assistants a GPU particle avatar with conversation states, 12 expressions, six characters, and a mouth that follows real audio.",
    points: [
      "Created an open-source React library that gives AI assistants a GPU particle avatar with conversation states, 12 expressions, six characters, and a mouth that follows real audio. Ships with documentation, examples, tests, and CI.",
    ],
    links: [
      { label: "LIVE DEMO", href: "https://yogeshhrathod.github.io/qivi/" },
      { label: "GITHUB", href: "https://github.com/yogeshhrathod/qivi" },
      { label: "NPM", href: "https://www.npmjs.com/package/qivi-react" },
    ],
  },
  {
    title: "BITBUCKET + CONFLUENCE MCP",
    name: "Bitbucket and Confluence MCP Servers",
    subtitle: "Bitbucket and Confluence MCP Servers",
    date: "OPEN SOURCE · NPM",
    stack: ["TypeScript", "Node.js", "Vitest"],
    desc: "Two MCP servers: 25+ Bitbucket tools with automatic Cloud v2 vs. Server v1.0 API detection, and a self-hosted Confluence server for spaces, pages, search, and attachments.",
    points: [
      "Bitbucket: 25+ tools for branches, commits, pull requests, and files, with automatic detection of Bitbucket Cloud API v2 vs. Server API v1.0.",
      "Confluence: self-hosted server connecting AI clients to spaces, pages, search, labels, comments, attachments, and restrictions.",
    ],
    links: [
      { label: "BITBUCKET · GITHUB", href: "https://github.com/yogeshhrathod/BitbucketMCP1.0" },
      { label: "BITBUCKET · NPM", href: "https://www.npmjs.com/package/@yogeshrathod/bitbucket-mcp" },
      { label: "CONFLUENCE · GITHUB", href: "https://github.com/yogeshhrathod/wikimcp" },
      { label: "CONFLUENCE · NPM", href: "https://www.npmjs.com/package/@yogeshrathod/confluence-mcp" },
    ],
  },
  {
    title: "CANON",
    name: "Canon Novel Engine",
    subtitle: "Canon Novel Engine",
    date: "OPEN SOURCE",
    stack: ["React 18", "Express", "Drizzle ORM", "SQLite", "Zod"],
    desc: "A multi-agent story engine that coordinates 8 specialized agents across 10+ LLM providers, with token streaming and persistent character and world bibles.",
    points: [
      "Built a multi-agent story engine that coordinates 8 specialized agents across 10+ LLM providers, with token streaming, Zod-validated structured outputs, and persistent character and world bibles.",
    ],
    links: [{ label: "GITHUB", href: "https://github.com/yogeshhrathod/canon-novel-engine" }],
  },
  {
    title: "LUNA_",
    name: "Luna (Anayas 2.0)",
    subtitle: "Luna (Anayas 2.0)",
    date: "12 ALPHA BUILDS · MACOS / WINDOWS / LINUX",
    stack: ["Electron", "React 18", "TypeScript", "Monaco", "Playwright"],
    desc: "A cross-platform desktop REST client with collections, environments, request history, and a command palette.",
    points: [
      "Created a cross-platform desktop REST client with collections, environments, request history, and a command palette. Released 12 alpha builds for macOS, Windows, and Linux with Playwright tests in CI.",
    ],
    links: [
      { label: "LIVE DEMO", href: "https://luna.wesparkvault.com/" },
      { label: "GITHUB", href: "https://github.com/yogeshhrathod/Anayas2.0" },
    ],
  },
  {
    title: "SCOOTY",
    name: "Scooty",
    subtitle: "FTP / SFTP media player",
    date: "WEB · DESKTOP · IOS · ANDROID",
    stack: ["React", "Vite", "Electron", "Capacitor", "Tailwind CSS"],
    desc: "A media player that streams from FTP/SFTP servers on web, desktop, iOS, and Android from one codebase, with background TMDB metadata ingestion.",
    points: [
      "Engineered a media player that streams from FTP/SFTP servers on web, desktop, iOS, and Android from one codebase, with background TMDB metadata ingestion.",
    ],
    links: [
      { label: "LIVE DEMO", href: "https://scooty.wesparkvault.com/" },
      { label: "GITHUB", href: "https://github.com/yogeshhrathod/Scooty" },
    ],
  },
];

export const experience = [
  {
    company: "QUALYS",
    period: "OCT 2021 – PRESENT",
    location: "PUNE, INDIA",
    roles: [
      {
        role: "Senior Software Engineer",
        period: "JUN 2024 – PRESENT",
        points: [
          "Building an internal AI assistant for colleagues that combines LLMs, multi-agent workflows, and tool orchestration.",
          "Built a custom Model Context Protocol integration that connects AI systems to internal services, along with streaming interfaces.",
          "Contributing AI agent capabilities to Qualys mROC, a managed risk-operations platform.",
        ],
      },
      {
        role: "Full Stack Engineer",
        period: "OCT 2021 – MAY 2024",
        points: [
          "Architected a centralized report-generation service used across Qualys products, scaling report size from about 100 MB to several gigabytes.",
          "Removed reporting bottlenecks that cut some report-generation flows from hours to near-instant.",
          "Led the migration of the core reporting service from JavaScript to TypeScript.",
          "Owned GitHub Actions pipelines and blue-green deployments for zero-downtime microservice releases.",
        ],
      },
    ],
  },
  {
    company: "GEOSPOC",
    period: "SEP 2020 – SEP 2021",
    location: "PUNE, INDIA",
    roles: [
      {
        role: "Full Stack Engineer",
        period: "SEP 2020 – SEP 2021",
        points: [
          "Built the GeoQi backend from scratch on AWS with automated CI/CD, reducing deployment cycle time by 40%.",
          "Delivered geospatial dashboards by integrating Mapbox GL JS with real-time APIs for logistics tracking.",
          "Contributed to AIS, an Indian government maritime platform tracking 5,000+ active vessels.",
        ],
      },
    ],
  },
  {
    company: "REDPANDA",
    fullName: "RedPanda Innovation Labs",
    period: "JUN 2019 – DEC 2020",
    location: "PUNE, INDIA",
    roles: [
      {
        role: "Full Stack Engineer",
        period: "JUN 2019 – DEC 2020",
        points: [
          "Owned full-stack delivery with Vue.js, Node.js, Loopback, and MongoDB, working with banking teams on custom financial matching logic.",
          "Launched Simplified Credit, a loan aggregator that automated financial models and bank matching, cutting turnaround from 3 days to under 10 minutes.",
        ],
      },
    ],
  },
];

export const skillGroups = [
  {
    label: "AI & LLM",
    items: [
      "MCP servers", "Multi-agent orchestration", "Tool use / function calling", "RAG", "LangChain",
      "LangGraph", "Token streaming", "OpenAI", "Anthropic", "Gemini", "Groq", "Mistral", "Ollama",
    ],
  },
  { label: "Languages", items: ["TypeScript", "JavaScript", "Swift", "HTML", "CSS"] },
  {
    label: "Backend",
    items: ["Node.js", "Express", "NestJS", "Loopback", "REST and GraphQL APIs", "Microservices"],
  },
  {
    label: "Frontend & Mobile",
    items: ["React", "Vue.js", "Angular", "SwiftUI", "Electron", "Capacitor", "Tailwind CSS", "Three.js / WebGL"],
  },
  {
    label: "Data",
    items: ["PostgreSQL", "Supabase (Auth, RLS, Edge Functions)", "MongoDB", "MySQL", "SQLite", "Drizzle ORM"],
  },
  { label: "Platform", items: ["AWS (EC2, S3, RDS, IAM)", "Cloudflare", "Docker", "GitHub Actions"] },
  { label: "Testing", items: ["Playwright", "Vitest", "Jest", "Cypress", "XCTest"] },
];

export const education = [
  {
    degree: "Bachelor of Engineering, Computer Engineering",
    institute: "Pune Institute of Computer Technology (PICT)",
    period: "2016 – 2019",
    location: "PUNE, INDIA",
  },
];

export const achievements = [
  { place: "1ST PLACE", title: "Credenz '17", desc: "Software Development · PICT Pune" },
  { place: "2ND PLACE", title: "SPECTER '17", desc: "Best Idea · Zeal College" },
  { place: "3RD PLACE", title: "GameJam '18", desc: "Ubisoft Pune" },
];

// One dialogue per gap between scenes (see TIMELINE in App.jsx).
export const dialogues = [
  ["SIMPLE.", "I BUILD AI SYSTEMS AND SHIP PRODUCTS.", "HERE IS WHAT I'VE MADE."],
  ["THAT WAS THE SIDE WORK.", "THE DAY JOB RUNS AT SCALE.", "SEVEN YEARS OF SHIPPING SOFTWARE."],
  ["THE ROOTS.", "THE TOOLS I WORK WITH.", "AND WHERE I LEARNED THE CRAFT."],
  ["SIMPLE.", "ESTABLISH CONTACT.", "LET'S BUILD SOMETHING BEYOND."],
];

export const socials = {
  linkedin: "https://www.linkedin.com/in/rathod-yogesh/",
  github: "https://github.com/yogeshhrathod",
  npm: "https://www.npmjs.com/~yogeshrathod",
  appStore: "https://apps.apple.com/app/haptix-physical-feel/id6794054309",
  email: "yrathod33@gmail.com",
  phone: "+91 86984 82662",
  phoneHref: "tel:+918698482662",
};
