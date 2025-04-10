import Copywriting from "./category-images/copy-wrting.png"
import BlogWriting from "./category-images/blog.png"
import TechnicalWriting from "./category-images/tech-wrt.jpg"
import graphic from "./category-images/graphic_design.png"
import logo from "./category-images/logo-dis.jpg"
import app from "./category-images/app.avif"
import data_entry from "./category-images/data_entry.webp"
import email from "./category-images/email-mark.webp"
import game from "./category-images/game-dev.jpg"
import podcast from "./category-images/podcast.jpg"
import seo from "./category-images/seo.avif"
import social_media from "./category-images/social-media-management.jpg"
import voice from "./category-images/Voice Over.png"
import vedio_edit from "./category-images/vedio-edit.jpg"
import ui_ux from "./category-images/uiux.png"
// import web_development from "./category-images/web-development-concept-in-flat-style-vector.jpg"
import vertual_assis from "./category-images/vertual_assis.jpg"
import Market_Research from "./category-images/Market_Research.jpg"
import Resume_Building from "./category-images/Resume_Building.jpg"
import Presentation_Design from "./category-images/Presentation_Design.webp" 
import Business_Plan_Writing from "./category-images/business_plan.jpg"
import illustration from "./category-images/illustration.jpg"
import Photo_Editing from "./category-images/Photo_Editing.jpg"
import Language_Translation from "./category-images/Language_Translation.webp"
import Transcription from "./category-images/Transcription.jpg"
import Proofreading from "./category-images/Proofreading.jpg"
import Scripting from "./category-images/Scripting.jpg"
import Excel_Automation from "./category-images/Excel_Automation.webp"
import AI_Tools_Support from "./category-images/AI_Tools_Support.jpg"
import D_Modeling from "./category-images/D_Modeling.jpg"
import DigitalMarketing from "./category-images/DigitalMarketing.png"
import CustomerSupport from "./category-images/CustomerSupport.png"
import EbookDesign from "./category-images/EbookDesign.jpg"
import WhiteboardAnimation from "./category-images/WhiteboardAnimation.png"
import SMMAdsCampaign from "./category-images/SMMAdsCampaign.jpg"
import Voice_Coaching from "./category-images/Voice Coaching.png"



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
    "image":  graphic,
    "mainCategory": "Design & Creativity"
  },
  {
    "id": 5,
    "name": "Logo Design",
    "image": logo,
    "mainCategory": "Design & Creativity"
  },
  {
    "id": 6,
    "name": "UI/UX Design",
    "image": ui_ux,
    "mainCategory": "Design & Creativity"
  },
  {
    "id": 7,
    "name": "Video Editing",
    "image": vedio_edit,
    "mainCategory": "Media & Production"
  },
  {
    "id": 8,
    "name": "Podcast Editing",
    "image": podcast,
    "mainCategory": "Media & Production"
  },
  {
    "id": 9,
    "name": "Voice Over",
    "image": voice,
    "mainCategory": "Media & Production"
  },
  {
    "id": 10,
    "name": "Social Media Management",
    "image": social_media,
    "mainCategory": "Marketing & Advertising"
  },
  {
    "id": 11,
    "name": "SEO Optimization",
    "image": seo,
    "mainCategory": "Marketing & Advertising"
  },
  {
    "id": 12,
    "name": "Email Marketing",
    "image": email,
    "mainCategory": "Marketing & Advertising"
  },
  // {
  //   "id": 13,
  //   "name": "Web Development",
  //   "image": web_development,
  //   "mainCategory": "Tech & Programming"
  // },
  {
    "id": 14,
    "name": "App Development",
    "image": app,
    "mainCategory": "Tech & Programming"
  },
  {
    "id": 15,
    "name": "Game Development",
    "image": game,
    "mainCategory": "Tech & Programming"
  },
  {
    "id": 16,
    "name": "Data Entry",
    "image":data_entry,
    "mainCategory": "Virtual Assistance"
  },
  {
    "id": 17,
    "name": "Virtual Assistance",
    "image": vertual_assis,
    "mainCategory": "Virtual Assistance"
  },
  {
    "id": 18,
    "name": "Market Research",
    "image": Market_Research,
    "mainCategory": "Virtual Assistance"
  },
  {
    "id": 19,
    "name": "Resume Building",
    "image": Resume_Building,
    "mainCategory": "Career & Education"
  },
  {
    "id": 20,
    "name": "Presentation Design",
    "image": Presentation_Design,
    "mainCategory": "Career & Education"
  },
  {
    "id": 24,
    "name": "Business Plan Writing",
    "image": Business_Plan_Writing,
    "mainCategory": "Business & Finance"
  },
  {
    "id": 25,
    "name": "Illustration",
    "image": illustration,
    "mainCategory": "Design & Creativity"
  },
  {
    "id": 26,
    "name": "Photo Editing",
    "image": Photo_Editing,
    "mainCategory": "Media & Production"
  },
  {
    "id": 27,
    "name": "Language Translation",
    "image": Language_Translation,
    "mainCategory": "Languages"
  },
  {
    "id": 28,
    "name": "Transcription",
    "image": Transcription,
    "mainCategory": "Languages"
  },
  {
    "id": 29,
    "name": "Proofreading",
    "image": Proofreading,
    "mainCategory": "Content & Writing"
  },
  {
    "id": 30,
    "name": "Scripting",
    "image": Scripting,
    "mainCategory": "Content & Writing"
  },
  {
    "id": 31,
    "name": "Excel Automation",
    "image": Excel_Automation,
    "mainCategory": "Tech & Programming"
  },
  {
    "id": 32,
    "name": "AI Tools Support",
    "image": AI_Tools_Support,
    "mainCategory": "Tech & Programming"
  },
  {
    "id": 33,
    "name": "3D Modeling",
    "image": D_Modeling,
    "mainCategory": "Design & Creativity"
  },
  {
    "id": 34,
    "name": "Digital Marketing",
    "image": DigitalMarketing,
    "mainCategory": "Marketing & Advertising"
  },
  {
    "id": 35,
    "name": "Customer Support",
    "image": CustomerSupport,
    "mainCategory": "Virtual Assistance"
  },
  {
    "id": 36,
    "name": "Ebook Design",
    "image": EbookDesign,
    "mainCategory": "Content & Writing"
  },
  {
    "id": 37,
    "name": "Whiteboard Animation",
    "image": WhiteboardAnimation,
    "mainCategory": "Media & Production"
  },
  {
    "id": 38,
    "name": "Infographic Design",
    "image": WhiteboardAnimation,
    "mainCategory": "Design & Creativity"
  },
  {
    "id": 39,
    "name": "SMM Ads Campaign",
    "image": SMMAdsCampaign,
    "mainCategory": "Marketing & Advertising"
  },
  {
    "id": 40,
    "name": "Voice Coaching",
    "image": Voice_Coaching,
    "mainCategory": "Career & Education"
  }
]

export default categories