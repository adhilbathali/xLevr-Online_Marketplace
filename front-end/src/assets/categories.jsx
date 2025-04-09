
import Copywriting from "./category-images/copy-wrting.png"
import BlogWriting from "./category-images/blog.png"
import TechnicalWriting from "./category-images/tech-wrt.jpg"
const categories = [
  {
    "id": 1,
    "name": "Copywriting",
    "image": Copywriting,
    "mainCategory": "Content & Writing"
  },
  {
    "id": 2,
    "name": "Blog Writing",
    "image": BlogWriting,
    "mainCategory": "Content & Writing"
  },
  {
    "id": 3,
    "name": "Technical Writing",
    "image": TechnicalWriting,
    "mainCategory": "Content & Writing"
  },
  {
    "id": 4,
    "name": "Graphic Design",
    "image": "./images/design/graphic-design.png",
    "mainCategory": "Design & Creativity"
  },
  {
    "id": 5,
    "name": "Logo Design",
    "image": "./images/design/logo-design.png",
    "mainCategory": "Design & Creativity"
  },
  {
    "id": 6,
    "name": "UI/UX Design",
    "image": "./images/design/uiux.png",
    "mainCategory": "Design & Creativity"
  },
  {
    "id": 7,
    "name": "Video Editing",
    "image": "./images/media/video-editing.png",
    "mainCategory": "Media & Production"
  },
  {
    "id": 8,
    "name": "Podcast Editing",
    "image": "./images/media/podcast-editing.png",
    "mainCategory": "Media & Production"
  },
  {
    "id": 9,
    "name": "Voice Over",
    "image": "./images/media/voiceover.png",
    "mainCategory": "Media & Production"
  },
  {
    "id": 10,
    "name": "Social Media Management",
    "image": "./images/marketing/social-media.png",
    "mainCategory": "Marketing & Advertising"
  },
  {
    "id": 11,
    "name": "SEO Optimization",
    "image": "./images/marketing/seo.png",
    "mainCategory": "Marketing & Advertising"
  },
  {
    "id": 12,
    "name": "Email Marketing",
    "image": "./images/marketing/email-marketing.png",
    "mainCategory": "Marketing & Advertising"
  },
  {
    "id": 13,
    "name": "Web Development",
    "image": "./images/tech/web-development.png",
    "mainCategory": "Tech & Programming"
  },
  {
    "id": 14,
    "name": "App Development",
    "image": "./images/tech/app-development.png",
    "mainCategory": "Tech & Programming"
  },
  {
    "id": 15,
    "name": "Game Development",
    "image": "./images/tech/game-development.png",
    "mainCategory": "Tech & Programming"
  },
  {
    "id": 16,
    "name": "Data Entry",
    "image": "./images/virtual/data-entry.png",
    "mainCategory": "Virtual Assistance"
  },
  {
    "id": 17,
    "name": "Virtual Assistance",
    "image": "./images/virtual/va.png",
    "mainCategory": "Virtual Assistance"
  },
  {
    "id": 18,
    "name": "Market Research",
    "image": "./images/virtual/market-research.png",
    "mainCategory": "Virtual Assistance"
  },
  {
    "id": 19,
    "name": "Resume Building",
    "image": "./images/education/resume.png",
    "mainCategory": "Career & Education"
  },
  {
    "id": 20,
    "name": "Presentation Design",
    "image": "./images/education/presentation.png",
    "mainCategory": "Career & Education"
  },
  {
    "id": 21,
    "name": "Academic Tutoring",
    "image": "./images/education/tutoring.png",
    "mainCategory": "Career & Education"
  },
  {
    "id": 22,
    "name": "Finance Consulting",
    "image": "./images/business/finance.png",
    "mainCategory": "Business & Finance"
  },
  {
    "id": 23,
    "name": "Pitch Deck Creation",
    "image": "./images/business/pitch-deck.png",
    "mainCategory": "Business & Finance"
  },
  {
    "id": 24,
    "name": "Business Plan Writing",
    "image": "./images/business/business-plan.png",
    "mainCategory": "Business & Finance"
  },
  {
    "id": 25,
    "name": "Illustration",
    "image": "./images/design/illustration.png",
    "mainCategory": "Design & Creativity"
  },
  {
    "id": 26,
    "name": "Photo Editing",
    "image": "./images/media/photo-editing.png",
    "mainCategory": "Media & Production"
  },
  {
    "id": 27,
    "name": "Language Translation",
    "image": "./images/language/translation.png",
    "mainCategory": "Languages"
  },
  {
    "id": 28,
    "name": "Transcription",
    "image": "./images/language/transcription.png",
    "mainCategory": "Languages"
  },
  {
    "id": 29,
    "name": "Proofreading",
    "image": "./images/content/proofreading.png",
    "mainCategory": "Content & Writing"
  },
  {
    "id": 30,
    "name": "Scripting",
    "image": "./images/content/scripting.png",
    "mainCategory": "Content & Writing"
  },
  {
    "id": 31,
    "name": "Excel Automation",
    "image": "./images/tech/excel.png",
    "mainCategory": "Tech & Programming"
  },
  {
    "id": 32,
    "name": "AI Tools Support",
    "image": "./images/tech/ai.png",
    "mainCategory": "Tech & Programming"
  },
  {
    "id": 33,
    "name": "3D Modeling",
    "image": "./images/design/3d-modeling.png",
    "mainCategory": "Design & Creativity"
  },
  {
    "id": 34,
    "name": "Digital Marketing",
    "image": "./images/marketing/digital-marketing.png",
    "mainCategory": "Marketing & Advertising"
  },
  {
    "id": 35,
    "name": "Customer Support",
    "image": "./images/virtual/customer-support.png",
    "mainCategory": "Virtual Assistance"
  },
  {
    "id": 36,
    "name": "Ebook Design",
    "image": "./images/content/ebook.png",
    "mainCategory": "Content & Writing"
  },
  {
    "id": 37,
    "name": "Whiteboard Animation",
    "image": "./images/media/whiteboard.png",
    "mainCategory": "Media & Production"
  },
  {
    "id": 38,
    "name": "Infographic Design",
    "image": "./images/design/infographic.png",
    "mainCategory": "Design & Creativity"
  },
  {
    "id": 39,
    "name": "SMM Ads Campaign",
    "image": "./images/marketing/ads.png",
    "mainCategory": "Marketing & Advertising"
  },
  {
    "id": 40,
    "name": "Voice Coaching",
    "image": "./images/education/voice-coaching.png",
    "mainCategory": "Career & Education"
  }
]

export default categories
