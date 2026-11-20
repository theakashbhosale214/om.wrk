import farmMitra from "../assets/clients/farm-mitra.webp";
import travestingMoney from "../assets/clients/travesting-money.webp";
import onestopEvents from "../assets/clients/onestop-events.webp";
import systemicGains from "../assets/clients/systemic-gains.webp";
import kpsConstruction from "../assets/clients/kps-construction.webp";
import propcatcher from "../assets/clients/propcatcher.webp";
import baithack from "../assets/clients/baithack.webp";
import aspireProperties from "../assets/clients/aspire-properties.webp";
import pizzaBurst from "../assets/clients/pizza-burst.webp";
import pgInteriors from "../assets/clients/pg-interiors.webp";
import koolhome from "../assets/clients/koolhome.webp";
import skyHomeInterio from "../assets/clients/sky-home-interio.webp";
import vivahByRaka from "../assets/clients/vivah-by-raka.webp";
import bolKa from "../assets/clients/bol-ka.webp";

/*
  All site copy lives here.
  Reels are managed in the admin panel (/admin). The `fallbackReels` below are only
  shown until Cloudinary is set up and the first reel has been uploaded.
*/
export const content = {
  brand: {
    name: "Zoomify Media",
    tagline: "Content and growth studio. We make the reels, run the ads and grow the brand.",
  },

  nav: [
    { label: "Work", href: "#work" },
    { label: "Services", href: "#services" },
    { label: "Process", href: "#process" },
    { label: "Studio", href: "#studio" },
    { label: "FAQ", href: "#faq" },
  ],

  hero: {
    eyebrow: "Content & growth studio",
    subtitle:
      "We script, shoot and edit reels and ad films, then run the campaigns that put them in front of the right people.",
  },

  stats: [
    { value: 200, suffix: "+", label: "Brands grown" },
    { value: 2000, suffix: "+", label: "Projects delivered" },
    { value: 5, suffix: "", label: "Services, one team" },
  ],

  fallbackReels: [
    { slug: "aariv-walkthrough", title: "Site walkthrough, Kharadi", client: "Aariv Interiors", category: "Interiors", featured: true },
    { slug: "diwali-real-estate", title: "Real estate launch ad", client: "Diwali campaign", category: "Real estate", featured: true },
    { slug: "aariv-window-seat", title: "Window seat & storage", client: "Aariv Interiors", category: "Interiors", featured: true },
  ],

  services: [
    {
      title: "Content Creation",
      desc: "Reels, ads and brand videos that grab attention in the first second and keep people watching.",
      tags: ["Reels", "Ad films", "Brand videos", "Scripting"],
    },
    {
      title: "Video Production",
      desc: "Professional shoots with a high-quality camera and lighting setup, directed and edited in-house.",
      tags: ["Shoots", "Lighting", "Direction", "Editing"],
    },
    {
      title: "Social Media Management",
      desc: "Consistent posting, strategy and community handling, so your page grows while you run the business.",
      tags: ["Strategy", "Content calendar", "Community", "Insights"],
    },
    {
      title: "Performance Marketing",
      desc: "ROI-driven Facebook, Instagram and Google Ads that turn views into leads and sales.",
      tags: ["Meta Ads", "Google Ads", "Lead generation", "Retargeting"],
    },
    {
      title: "Branding & Design",
      desc: "Logos, creatives and visual identity that make your brand recognisable everywhere it shows up.",
      tags: ["Logo", "Identity", "Creatives", "Guidelines"],
    },
  ],

  process: [
    { title: "Discover", text: "A call to understand your brand, your customers and what growth means for you." },
    { title: "Plan", text: "A content and ads plan built around your goals, with hooks and formats that fit your audience." },
    { title: "Shoot & edit", text: "Scripts, shoots, edits and design, produced in-house with a pro camera and lighting setup." },
    { title: "Launch & scale", text: "We publish, run the ads, measure what works and double down on the winners." },
  ],

  studio: {
    statement:
      "We don't just make content. We make content that *converts* — and then we put it in front of the people who buy.",
    body: "Zoomify Media is a creative digital marketing studio. From concept to execution, one team handles strategy, shoots, edits and ads, and cares about your numbers as much as you do.",
  },

  whyChooseUs: [
    { title: "Result-oriented", text: "Every reel, post and campaign is tied to a number that matters: reach, leads or sales." },
    { title: "Creative + strategy", text: "Strategy shapes the idea, craft makes it unmissable." },
    { title: "High-quality production", text: "Pro cameras, lighting and editing — not a rushed phone video." },
    { title: "Fast & reliable", text: "Clear timelines, quick turnarounds and no chasing." },
    { title: "Growth, not just content", text: "Success is how your brand grows, not how many posts go out." },
  ],

  faq: [
    {
      q: "What does Zoomify Media do?",
      a: "We're a content and growth studio. We create reels, ad films and brand videos, manage social media, run performance marketing on Meta and Google, and design brand identities.",
    },
    {
      q: "Which industries do you work with?",
      a: "We've worked with 200+ brands across real estate, interiors, restaurants and cafés, weddings and events, finance, construction, agriculture and media.",
    },
    {
      q: "Do you shoot the videos yourselves?",
      a: "Yes. Our team shoots with a professional camera and lighting setup, and scripting, editing and design are all handled in-house.",
    },
    {
      q: "Can you run our ads as well as make the content?",
      a: "Yes. We run Facebook, Instagram and Google Ads campaigns, so the content we make is the content that gets promoted and measured.",
    },
    {
      q: "How do we get started?",
      a: "Send a message through the form or on WhatsApp. We'll set up a quick call to understand your brand and goals, then come back with a plan.",
    },
  ],

  contact: {
    phones: ["+91 9921779460", "+91 9272581220"],
    whatsapp: "919272581220",
    whatsappDisplay: "+91 9272581220",
    email: "Zoomifymedia@gmail.com",
    instagram: "@zoomifymedia",
    instagramUrl: "https://www.instagram.com/zoomifymedia/",
  },

  clients: [
    { name: "Propcatcher", logo: propcatcher },
    { name: "Pizza Burst", logo: pizzaBurst },
    { name: "Vivah by Raka", logo: vivahByRaka },
    { name: "Aspire Properties", logo: aspireProperties },
    { name: "Systemic Gains", logo: systemicGains, dark: true },
    { name: "Baithack", logo: baithack },
    { name: "Koolhome", logo: koolhome },
    { name: "Farm Mitra", logo: farmMitra },
    { name: "Sky Home Interio", logo: skyHomeInterio },
    { name: "Travesting Money", logo: travestingMoney },
    { name: "Bol Ka?", logo: bolKa, dark: true },
    { name: "PG Interiors", logo: pgInteriors },
    { name: "OneStop Happening Events", logo: onestopEvents },
    { name: "KPS Construction", logo: kpsConstruction },
  ],
};
