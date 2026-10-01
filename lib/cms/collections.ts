/* The dashboard is generated from this file. Each collection names its table,
   its fields and how a row is summarised in the list. Adding a field here and
   a column in schema.sql is all it takes to make something editable. */

export type FieldType =
  | "text"
  | "textarea"
  | "markdown"
  | "number"
  | "boolean"
  | "image"
  | "images"
  | "list"
  | "select"
  | "icon"
  | "date"
  | "slug";

export interface Field {
  key: string;
  label: string;
  type: FieldType;
  help?: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  from?: string; // slug: the field it's generated from
  wide?: boolean;
}

export interface Collection {
  key: string;
  table: string;
  title: string;
  singular: string;
  icon: string;
  description: string;
  fields: Field[];
  order: "position" | "published_at";
  publishedField?: string;
  list: { title: string; sub?: string; image?: string };
}

const SERVICE_OPTIONS = ["Brand Essentials", "Social Media Designs", "Brand System", "Brand Strategy"];
export const SECTION_ICONS = ["bag", "phone", "folder", "brush", "monitor", "briefcase", "image", "grid", "sparkles", "search", "rocket", "book", "user", "star"];
export const TOOL_ICONS = ["figma", "framer", "Ps", "Ai", "Id", "Ae", "Pr", "Lr", "capcut", "canva", "brush", "monitor"];

export const COLLECTIONS: Collection[] = [
  {
    key: "projects",
    table: "projects",
    title: "Projects",
    singular: "project",
    icon: "brush",
    description: "Case studies with their own page. Drive designs show up on their own — use projects for work you want to tell the story of.",
    order: "position",
    publishedField: "published",
    list: { title: "title", sub: "category", image: "cover_url" },
    fields: [
      { key: "title", label: "Title", type: "text", required: true, placeholder: "e.g. Glidex rebrand" },
      { key: "slug", label: "Web address", type: "slug", from: "title", help: "The end of the link: /works/your-slug" },
      { key: "category", label: "Category", type: "select", options: SERVICE_OPTIONS, help: "Matches the pills on the Works page." },
      { key: "client", label: "Client", type: "text" },
      { key: "year", label: "Year", type: "text", placeholder: "2026" },
      { key: "industry", label: "Industry", type: "text", placeholder: "e.g. Fintech" },
      { key: "summary", label: "Short summary", type: "textarea", wide: true, help: "One or two sentences under the title." },
      { key: "cover_url", label: "Cover image", type: "image", wide: true },
      { key: "body", label: "The story", type: "markdown", wide: true, help: "The brief, the idea, the result. Use ## for headings, - for bullet points." },
      { key: "gallery", label: "More images", type: "images", wide: true },
      { key: "featured", label: "Feature on the home page first", type: "boolean" },
      { key: "published", label: "Visible on the site", type: "boolean" },
    ],
  },
  {
    key: "services",
    table: "services",
    title: "Services",
    singular: "service",
    icon: "bag",
    description: "The priced cards on the home and Services pages.",
    order: "position",
    publishedField: "published",
    list: { title: "title", sub: "price" },
    fields: [
      { key: "title", label: "Name", type: "text", required: true },
      { key: "description", label: "One-line description", type: "textarea", wide: true },
      { key: "features", label: "What's included", type: "list", wide: true, help: "One per line — each becomes a chip." },
      { key: "price", label: "Starting price", type: "text", placeholder: "₦100k" },
      { key: "unit", label: "Per", type: "text", placeholder: "/project" },
      { key: "icon", label: "Icon", type: "icon", options: SECTION_ICONS },
      { key: "published", label: "Visible on the site", type: "boolean" },
    ],
  },
  {
    key: "process",
    table: "process_steps",
    title: "Process",
    singular: "step",
    icon: "list",
    description: "The steps in \"Crafting visuals\". Four fits the layout best.",
    order: "position",
    list: { title: "title" },
    fields: [
      { key: "title", label: "Step name", type: "text", required: true },
      { key: "tags", label: "Chips", type: "list", help: "One per line." },
      { key: "icon", label: "Icon", type: "icon", options: SECTION_ICONS },
    ],
  },
  {
    key: "experience",
    table: "experience",
    title: "Experience",
    singular: "role",
    icon: "briefcase",
    description: "The work timeline. Top of the list shows first.",
    order: "position",
    list: { title: "company", sub: "period" },
    fields: [
      { key: "role", label: "Job title", type: "text", required: true },
      { key: "company", label: "Company", type: "text" },
      { key: "period", label: "Dates", type: "text", placeholder: "2023 — Present" },
      { key: "bullets", label: "What you did", type: "list", wide: true, help: "One achievement per line." },
    ],
  },
  {
    key: "testimonials",
    table: "testimonials",
    title: "Testimonials",
    singular: "testimonial",
    icon: "quote",
    description: "Only real clients, with their permission. Hidden ones never appear on the site.",
    order: "position",
    publishedField: "published",
    list: { title: "name", sub: "role", image: "photo_url" },
    fields: [
      { key: "name", label: "Client name", type: "text", required: true },
      { key: "role", label: "Role & company", type: "text", placeholder: "Founder, Glow Studio" },
      { key: "quote", label: "What they said", type: "textarea", wide: true, required: true },
      { key: "tags", label: "Two words that sum it up", type: "list", help: "e.g. Impactful, Strategic — one per line." },
      { key: "rating", label: "Stars (0–5)", type: "number" },
      { key: "photo_url", label: "Photo", type: "image" },
      { key: "published", label: "Visible on the site", type: "boolean" },
    ],
  },
  {
    key: "tools",
    table: "tools",
    title: "Toolkit",
    singular: "tool",
    icon: "wrench",
    description: "Software cards with a skill percentage.",
    order: "position",
    list: { title: "name", sub: "description" },
    fields: [
      { key: "name", label: "Tool", type: "text", required: true },
      { key: "description", label: "Used for", type: "text" },
      { key: "percent", label: "Skill %", type: "number" },
      { key: "icon", label: "Icon", type: "icon", options: TOOL_ICONS, help: "Or type two letters, e.g. Ps" },
    ],
  },
  {
    key: "faqs",
    table: "faqs",
    title: "FAQ",
    singular: "question",
    icon: "help",
    description: "Questions clients ask before they book.",
    order: "position",
    publishedField: "published",
    list: { title: "question" },
    fields: [
      { key: "question", label: "Question", type: "text", required: true, wide: true },
      { key: "answer", label: "Answer", type: "textarea", wide: true, help: "Start lines with • for a list." },
      { key: "published", label: "Visible on the site", type: "boolean" },
    ],
  },
  {
    key: "posts",
    table: "posts",
    title: "Blog",
    singular: "post",
    icon: "book",
    description: "Articles. The Blog link appears in the menu once one is published.",
    order: "published_at",
    publishedField: "published",
    list: { title: "title", sub: "category", image: "cover_url" },
    fields: [
      { key: "title", label: "Title", type: "text", required: true, wide: true },
      { key: "slug", label: "Web address", type: "slug", from: "title" },
      { key: "category", label: "Category", type: "text", placeholder: "Branding" },
      { key: "excerpt", label: "Summary", type: "textarea", wide: true },
      { key: "cover_url", label: "Cover image", type: "image", wide: true },
      { key: "body", label: "Article", type: "markdown", wide: true },
      { key: "published_at", label: "Publish date", type: "date" },
      { key: "published", label: "Published", type: "boolean" },
    ],
  },
];

export const collection = (key: string) => COLLECTIONS.find((c) => c.key === key);

/* ── Settings form ─────────────────────────────────────────────────── */

export interface SettingsGroup {
  title: string;
  help?: string;
  fields: Field[];
}

export const SETTINGS_GROUPS: SettingsGroup[] = [
  {
    title: "Profile",
    help: "The dark card on the left of every page.",
    fields: [
      { key: "name", label: "Full name", type: "text" },
      { key: "brand", label: "Brand name", type: "text" },
      { key: "role", label: "Title under the name", type: "text" },
      { key: "sidebar_bio", label: "Short bio", type: "textarea", wide: true },
      { key: "avatar_url", label: "Profile photo", type: "image" },
      { key: "cover_url", label: "Card background", type: "image" },
      { key: "portrait_url", label: "Portrait (About page & link previews)", type: "image" },
    ],
  },
  {
    title: "Hero",
    fields: [
      { key: "hero_greeting", label: "First line", type: "text" },
      { key: "hero_line_1", label: "Second line, before the logo", type: "text" },
      { key: "hero_line_2", label: "After the logo", type: "text" },
      { key: "announcement", label: "Pill above the headline", type: "text", help: "Leave empty to hide." },
      { key: "announcement_url", label: "Pill links to", type: "text", placeholder: "/works" },
      { key: "available", label: "Available for new work", type: "boolean" },
      { key: "availability_label", label: "Availability text", type: "text" },
      { key: "location", label: "Based in", type: "text" },
    ],
  },
  {
    title: "Contact & socials",
    fields: [
      { key: "email", label: "Email", type: "text" },
      { key: "phone", label: "Phone (as shown)", type: "text" },
      { key: "whatsapp", label: "WhatsApp number", type: "text", help: "Country code, digits only: 2349032075156" },
      { key: "handle", label: "Handle in the top bar", type: "text" },
      { key: "socials", label: "Social links", type: "list", wide: true, help: "One per line as  name | link  — names: instagram, linkedin, whatsapp, email, x, behance, dribbble, tiktok. The first four show as buttons on the card." },
    ],
  },
  {
    title: "Section headings",
    help: "Use a line break to split a heading over two lines.",
    fields: [
      { key: "projects_title", label: "Projects heading", type: "textarea" },
      { key: "projects_years", label: "Years (grey, right)", type: "text" },
      { key: "services_title", label: "Services heading", type: "textarea" },
      { key: "services_intro", label: "Services intro", type: "textarea" },
      { key: "currency_note", label: "Note under prices", type: "text", placeholder: "Prices in Naira. International clients welcome." },
      { key: "process_title", label: "Process heading", type: "text" },
      { key: "process_intro", label: "Process intro", type: "textarea" },
      { key: "experience_title", label: "Experience heading", type: "text" },
      { key: "testimonials_title", label: "Testimonials heading", type: "textarea" },
      { key: "clients_count", label: "Trusted by", type: "text", placeholder: "100+ clients" },
      { key: "toolkit_text", label: "Toolkit paragraph", type: "textarea", wide: true },
      { key: "archive_title", label: "Archive heading", type: "text" },
      { key: "blog_title", label: "Blog heading", type: "text" },
      { key: "faq_intro", label: "FAQ intro", type: "textarea" },
      { key: "contact_title", label: "Contact heading", type: "textarea" },
      { key: "contact_text", label: "Contact text", type: "textarea" },
    ],
  },
  {
    title: "Stat & philosophy",
    fields: [
      { key: "stat_value", label: "Big number", type: "text", placeholder: "98%", help: "Leave empty to hide the black stat card." },
      { key: "stat_label", label: "Stat label", type: "text" },
      { key: "stat_text", label: "Stat text", type: "textarea", wide: true },
      { key: "philosophy_title", label: "Philosophy heading", type: "text", wide: true },
      { key: "philosophy_left", label: "Left paragraph", type: "textarea" },
      { key: "philosophy_right", label: "Right paragraph", type: "textarea" },
      { key: "philosophy_image_url", label: "Philosophy background", type: "image", wide: true },
    ],
  },
  {
    title: "About page",
    fields: [{ key: "about_body", label: "Your story", type: "markdown", wide: true }],
  },
  {
    title: "Search & sharing",
    fields: [
      { key: "seo_title", label: "Title in Google & link previews", type: "text", wide: true },
      { key: "seo_description", label: "Description", type: "textarea", wide: true },
    ],
  },
];
