/* Shapes of everything the site renders. The dashboard edits exactly these,
   and supabase/schema.sql has one table per collection with matching columns. */

export interface Social {
  label: string; // instagram | linkedin | x | behance | dribbble | whatsapp | tiktok
  url: string;
}

export interface Settings {
  name: string;
  brand: string; // "Acegraphiix" — the name he goes by in headlines
  role: string; // pill under the name in the sidebar
  sidebar_bio: string;
  hero_greeting: string; // "Hi, I'm Acegraphiix,"
  hero_line_1: string; // "Graphic designer"
  hero_line_2: string; // "& Brand strategist"
  location: string;
  available: boolean;
  availability_label: string;
  announcement: string; // pill above the hero
  announcement_url: string;
  email: string;
  phone: string;
  whatsapp: string; // digits only, international format
  handle: string; // @acegraphiix
  socials: Social[];
  avatar_url: string;
  cover_url: string;
  portrait_url: string;

  projects_title: string;
  projects_years: string;
  services_title: string;
  services_intro: string;
  currency_note: string;
  process_title: string;
  process_intro: string;
  stat_value: string;
  stat_label: string;
  stat_text: string;
  experience_title: string;
  philosophy_title: string;
  philosophy_left: string;
  philosophy_right: string;
  philosophy_image_url: string;
  testimonials_title: string;
  clients_count: string;
  toolkit_text: string;
  archive_title: string;
  blog_title: string;
  faq_intro: string;
  contact_title: string;
  contact_text: string;
  about_body: string;

  drive_folder_url: string;
  seo_title: string;
  seo_description: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  client: string | null;
  year: string | null;
  industry: string | null;
  summary: string | null;
  body: string | null;
  cover_url: string | null;
  gallery: string[];
  featured: boolean;
  published: boolean;
  position: number;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  price: string;
  unit: string;
  icon: string;
  published: boolean;
  position: number;
}

export interface ProcessStep {
  id: string;
  title: string;
  tags: string[];
  icon: string;
  position: number;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  bullets: string[];
  position: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  tags: string[];
  rating: number;
  photo_url: string | null;
  published: boolean;
  position: number;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  percent: number;
  icon: string;
  position: number;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  published: boolean;
  position: number;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  cover_url: string | null;
  body: string | null;
  published_at: string | null;
  published: boolean;
}

export interface GalleryItem {
  id: string; // Google Drive file id
  name: string;
  folder_name: string;
  width: number | null;
  height: number | null;
  visible: boolean;
  featured: boolean;
  position: number;
  created_time: string | null;
  sections?: string[];
  section_order?: number;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  budget: string | null;
  message: string | null;
  status: "new" | "contacted" | "in_progress" | "won" | "lost" | "archived";
  notes: string | null;
  created_at: string;
}

export interface SiteContent {
  settings: Settings;
  projects: Project[];
  services: Service[];
  steps: ProcessStep[];
  experience: Experience[];
  testimonials: Testimonial[];
  tools: Tool[];
  faqs: Faq[];
  posts: Post[];
  gallery: GalleryItem[];
  demo: boolean; // true when Supabase isn't connected yet
}
