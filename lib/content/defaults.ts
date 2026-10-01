import type { SiteContent, Settings } from "./types";

/* Jeremiah's content, taken from the brief he wrote (website copy.pdf).
   Used two ways:
   - as the whole site while Supabase isn't connected yet ("demo" mode), and
   - as the seed that `npm run seed:sql` turns into supabase/seed.sql.
   Once Supabase is connected, the database is the only source: deleting a
   row in the dashboard deletes it from the site, nothing here brings it back. */

export const DEFAULT_SETTINGS: Settings = {
  name: "Ndubuisi Jeremiah",
  brand: "Acegraphiix",
  role: "Brand Designer",
  sidebar_bio:
    "I'm Acegraphiix, a brand designer and strategist, focused on building bold and unforgettable visual systems and brand experiences.",
  hero_greeting: "Hi, I'm Acegraphiix,",
  hero_line_1: "Graphic designer",
  hero_line_2: "& Brand strategist",
  location: "Port Harcourt, Nigeria",
  available: true,
  availability_label: "Available",
  announcement: "See my latest work",
  announcement_url: "/works",
  email: "acegraphiix@gmail.com",
  phone: "+234 903 207 5156",
  whatsapp: "2349032075156",
  handle: "@acegraphiix",
  socials: [
    { label: "instagram", url: "https://instagram.com/acegraphiix" },
    { label: "linkedin", url: "" }, // add his profile link in the dashboard
    { label: "whatsapp", url: "https://wa.me/2349032075156" },
    { label: "email", url: "mailto:acegraphiix@gmail.com" },
  ],
  avatar_url: "/img/avatar.jpg",
  cover_url: "/img/cover.jpg",
  portrait_url: "/img/portrait.jpg",

  projects_title: "Projects that\ntell you stories",
  projects_years: "23-26",
  services_title: "Crafting visuals\nthat lead, not follow.",
  services_intro:
    "I help brands shape strong visual identities and marketing designs through thoughtful strategy and design.",
  currency_note: "",
  process_title: "Crafting visuals",
  process_intro:
    "Every project begins with understanding the brand's purpose, then evolves into a visual system that is distinctive, scalable, and built to create lasting impact.",
  stat_value: "98%",
  stat_label: "Client satisfaction rate",
  stat_text:
    "Trusted by founders and brands to deliver thoughtful creative direction, refined execution, and consistent design quality.",
  experience_title: "Building brands through design",
  philosophy_title: "Great design isn't decoration.",
  philosophy_left:
    "I believe the strongest visual identities are built on a clear point of view. They create consistency, meaning, and recognition across every touchpoint.",
  philosophy_right:
    "As a brand designer and strategist, my role is to bring structure to ideas and emotion to strategy, translating business goals into visual experiences people genuinely remember.",
  philosophy_image_url: "/img/philosophy.jpg",
  testimonials_title: "What people\nsay about my work",
  clients_count: "", // e.g. "50+ clients" — only shown once he fills it in
  toolkit_text:
    "Over the years, I've built a flexible toolkit that allows me to move from concept to execution efficiently - balancing creativity with precision across different mediums.",
  archive_title: "From the archive",
  blog_title: "Space for journal",
  faq_intro:
    "Everything you need to know about my creative process, collaboration, and project expectations.",
  contact_title: "Let's build\nsomething impactful.",
  contact_text:
    "If you're looking to elevate your brand or create something meaningful, I'd love to collaborate.",
  about_body:
    "I'm Ndubuisi Jeremiah — known in the studio as Acegraphiix — a graphic designer and brand strategist based in Port Harcourt, Nigeria.\n\nI help businesses, creators and organisations look as good as the work they do: identities that hold together, social content that stops the scroll, and campaign visuals that bring people through the door.\n\nI've designed campaign and event visuals for the Lagos Internal Revenue Service, visual assets for Glidex Technologies, and brand identities, pitch decks and social designs for clients of Voise Agency in the UK.",

  drive_folder_url: "",
  seo_title: "Acegraphiix — Graphic Designer & Brand Strategist",
  seo_description:
    "Portfolio of Ndubuisi Jeremiah (Acegraphiix), a graphic designer and brand strategist in Port Harcourt, Nigeria, building bold visual systems and brand experiences.",
};

let n = 0;
const id = () => `demo-${++n}`;

export const DEFAULT_CONTENT: Omit<SiteContent, "settings" | "demo"> = {
  projects: [],
  services: [
    {
      id: id(),
      title: "Brand Essentials",
      description: "A strong starting point for brands that need clarity and direction.",
      features: ["Logo Design", "Basic Visual System", "Color & Typography", "Mini Brand Guidelines"],
      price: "₦100k",
      unit: "/project",
      icon: "bag",
      published: true,
      position: 1,
    },
    {
      id: id(),
      title: "Social Media Designs",
      description: "Modern, conversion-focused designs for social media advertising.",
      features: ["Business Flyers", "Event Posters", "Birthday Flyers", "Advertisement Flyers"],
      price: "₦20k",
      unit: "/project",
      icon: "phone",
      published: true,
      position: 2,
    },
    {
      id: id(),
      title: "Brand System",
      description: "A complete visual foundation across brand and digital touchpoints.",
      features: ["Full Brand Identity", "Website Design", "Visual Consistency Guidelines"],
      price: "₦800k",
      unit: "/project",
      icon: "folder",
      published: true,
      position: 3,
    },
    {
      id: id(),
      title: "Brand Strategy",
      description: "End-to-end strategy and campaign direction for brands that aim to stand out.",
      features: ["Concept & Campaign Direction", "Key Visual Development"],
      price: "₦700k",
      unit: "/project",
      icon: "brush",
      published: true,
      position: 4,
    },
  ],
  steps: [
    { id: id(), title: "Discover & Define", tags: ["Research", "Strategy", "Foundation"], icon: "search", position: 1 },
    { id: id(), title: "Creative Direction", tags: ["Concept", "Moodboard", "Identity"], icon: "sparkles", position: 2 },
    { id: id(), title: "Design System", tags: ["Typography", "Grid", "Components"], icon: "grid", position: 3 },
    { id: id(), title: "Refine & Deliver", tags: ["Polish", "Assets", "Launch"], icon: "rocket", position: 4 },
  ],
  experience: [
    {
      id: id(),
      role: "Graphic Designer",
      company: "Lagos Internal Revenue Service (LIRS)",
      period: "2023 — Present",
      bullets: [
        "Collaborate with a team to develop visual assets for campaigns and events.",
        "Design flyers for client events, birthdays and tax filing deadlines, boosting attendance and engagement.",
        "Contribute to campaign success through creative design solutions.",
      ],
      position: 1,
    },
    {
      id: id(),
      role: "Graphic Designer",
      company: "Glidex Technologies",
      period: "2025 — Present",
      bullets: [
        "Create visual assets, brochures and event visuals with the team.",
        "Designed flyers that boosted engagement and brand recognition.",
        "Developed social media graphics that drove campaign success and online presence.",
      ],
      position: 2,
    },
    {
      id: id(),
      role: "Brand & Social Designer",
      company: "Voise Agency, UK",
      period: "2023 — 2025",
      bullets: [
        "Created social media designs that drove engagement and online presence.",
        "Built brand identities with logos, pitch decks and guidelines.",
        "Developed eye-catching event flyers that increased attendance.",
      ],
      position: 3,
    },
  ],
  /* Placeholders ONLY. They ship unpublished in seed.sql, so nothing appears on
     the live site until Jeremiah replaces them with real clients' words. */
  testimonials: [
    {
      id: id(),
      name: "Client name",
      role: "Founder, Business name",
      quote:
        "Sample testimonial — replace this with a real client's words in the dashboard. It should say what changed for them after working with Acegraphiix.",
      tags: ["Impactful", "Strategic"],
      rating: 5,
      photo_url: "",
      published: false,
      position: 1,
    },
    {
      id: id(),
      name: "Client name",
      role: "Creative lead, Business name",
      quote:
        "Sample testimonial — a second client quote goes here. Keep it short and specific: the project, the result, how the process felt.",
      tags: ["Creative", "Reliable"],
      rating: 5,
      photo_url: "",
      published: false,
      position: 2,
    },
    {
      id: id(),
      name: "Client name",
      role: "Event organiser",
      quote:
        "Sample testimonial — a third client quote goes here. Ask for permission before using a client's name and photo.",
      tags: ["Fast", "Detailed"],
      rating: 5,
      photo_url: "",
      published: false,
      position: 3,
    },
  ],
  tools: [
    { id: id(), name: "Figma", description: "Interface & system design", percent: 95, icon: "figma", position: 1 },
    { id: id(), name: "Framer", description: "Prototyping & web building", percent: 85, icon: "framer", position: 2 },
    { id: id(), name: "Adobe Photoshop", description: "Visual composition & retouching", percent: 90, icon: "Ps", position: 3 },
    { id: id(), name: "CapCut", description: "Video editing & motion", percent: 85, icon: "capcut", position: 4 },
    { id: id(), name: "Adobe Illustrator", description: "Vector & identity design", percent: 90, icon: "Ai", position: 5 },
    { id: id(), name: "Canva", description: "Fast layouts & social content", percent: 75, icon: "canva", position: 6 },
  ],
  faqs: [
    {
      id: id(),
      question: "Can you work with existing brands?",
      answer:
        "Yes, absolutely. I regularly work with established brands — whether that means expanding an existing visual system, creating new marketing collaterals, refreshing brand assets, or redesigning digital products while keeping the core identity intact. I adapt to existing guidelines and design systems to keep every touchpoint consistent.",
      published: true,
      position: 1,
    },
    {
      id: id(),
      question: "What types of projects do you take on?",
      answer:
        "I work on brand identities, creative direction, websites, digital products, marketing visuals, and design systems for startups, agencies, and growing businesses.",
      published: true,
      position: 2,
    },
    {
      id: id(),
      question: "How long does a typical project take?",
      answer:
        "Timelines vary with scope, deliverables and revision cycles.\n\n• Brand identity / web redesign: typically 4 to 8 weeks from discovery to final delivery.\n• Smaller initiatives (landing page, brand extension, campaign visual set): 1 to 3 weeks.\n• Complex digital products / comprehensive systems: 8 to 12+ weeks, depending on requirements and testing.\n\nA project schedule and milestone breakdown always comes with the proposal.",
      published: true,
      position: 3,
    },
    {
      id: id(),
      question: "What do you need before we begin?",
      answer:
        "To kick off smoothly, I need:\n\n• A brief or kickoff call — your business goals, target audience and key objectives.\n• Existing brand assets, if any — logos, guidelines, fonts, colour palettes or current design files.\n• Content & copy — initial copy, high-res images, product data or media the design needs.\n• Project logistics — timelines, a point of contact for feedback, and budget parameters.",
      published: true,
      position: 4,
    },
  ],
  posts: [],
  gallery: [],
};

export const CATEGORIES = ["Brand Essentials", "Social Media Designs", "Brand System", "Brand Strategy"];
