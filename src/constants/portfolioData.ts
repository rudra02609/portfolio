// ============================================================
// RUDRA PRAJAPATI — PORTFOLIO DATA
// Central source of truth for all content rendered in the UI.
// Keep portfolio content here, separated from components.
// ============================================================

export const profile = {
  name: "Rudra Prajapati",
  title: "AI & ML Engineer / Full Stack Developer",
  subTitle: "B.Tech AIML Student @ CHARUSAT University",
  tagline:
    "Building the future of intelligent applications using Deep Learning, Machine Learning, and modern Web Technologies.",
  aboutShort:
    "Passionate about Artificial Intelligence, Machine Learning, Python Development, and Web Applications. I enjoy building intelligent solutions, analyzing datasets, and engineering products that solve real-world challenges.",
  resumeUrl: "#", // Replace with a direct link to the resume PDF
  avatar: undefined, // Optional avatar image path (e.g. "/assets/avatar.png")
};

export const hero = {
  intro: "Hey there, I'm Rudra —",
  typewriter: [
    "AI & ML Engineer",
    "Full Stack Developer",
    "Machine Learning Enthusiast",
    "Problem Solver",
  ],
  cta: [
    { label: "View Projects", href: "#projects", variant: "solid" as const },
    { label: "Contact Me", href: "#contact", variant: "outline" as const },
  ],
  quickLinks: [
    { label: "GitHub", href: "https://github.com/rudra02609" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/rudra-prajapati-276265321" },
    { label: "Resume", href: "#" },
  ],
};

export const stats = [
  { label: "Repositories", value: "10+" },
  { label: "Technologies", value: "15+" },
  { label: "Projects Completed", value: "12+" },
];

export const about = {
  bio: [
    "I am currently pursuing my B.Tech in Artificial Intelligence & Machine Learning at CHARUSAT University (2024 - Present). My academic path has equipped me with strong analytical skills and deep technical knowledge in engineering intelligent systems.",
    "I build full-stack web applications that integrate machine learning models, creating seamless user experiences backed by intelligent processing. My expertise spans Python, React, Node.js, and various AI/ML frameworks.",
    "When I'm not coding, I participate in hackathons, work on open-source projects, and continuously expand my knowledge of emerging AI technologies and research papers.",
  ],
  highlights: [
    { icon: "🎓", label: "B.Tech AIML @ CHARUSAT" },
    { icon: "🏆", label: "Stanford ML Certified" },
    { icon: "🤖", label: "Deep Learning & Vision" },
    { icon: "⚡", label: "Full Stack + AI Integration" },
  ],
};

export interface SkillItem {
  name: string;
  level?: number; // optional real proficiency (0-100); omit if unknown
  color: string;
  icon?: string;
}

export interface SkillCategory {
  category: string;
  items: SkillItem[];
}

export const skills: SkillCategory[] = [
  {
    category: "AI / ML",
    items: [
      { name: "Python", level: 90, color: "from-cyan-400 to-blue-500", icon: "🐍" },
      { name: "TensorFlow", level: 75, color: "from-orange-400 to-red-500", icon: "🧠" },
      { name: "PyTorch", level: 70, color: "from-red-400 to-pink-500", icon: "🔥" },
      { name: "Scikit-learn", level: 80, color: "from-blue-400 to-indigo-500", icon: "📊" },
      { name: "OpenCV", level: 72, color: "from-green-400 to-emerald-500", icon: "👁" },
      { name: "Pandas / NumPy", level: 85, color: "from-purple-400 to-violet-500", icon: "🐼" },
    ],
  },
  {
    category: "Web Dev",
    items: [
      { name: "React", level: 88, color: "from-cyan-400 to-blue-500", icon: "⚛️" },
      { name: "JavaScript", level: 85, color: "from-yellow-400 to-amber-500", icon: "🟨" },
      { name: "TypeScript", level: 75, color: "from-blue-400 to-indigo-500", icon: "🟦" },
      { name: "Node.js", level: 80, color: "from-green-400 to-emerald-500", icon: "🟩" },
      { name: "HTML5 / CSS3", level: 90, color: "from-orange-400 to-red-500", icon: "🌐" },
      { name: "Tailwind CSS", level: 85, color: "from-cyan-400 to-teal-500", icon: "🎨" },
      { name: "Flask", level: 72, color: "from-slate-400 to-gray-500", icon: "🧪" },
    ],
  },
  {
    category: "Data & DB",
    items: [
      { name: "MongoDB", level: 78, color: "from-green-400 to-emerald-500", icon: "🍃" },
      { name: "PostgreSQL", level: 68, color: "from-blue-400 to-indigo-500", icon: "🐘" },
      { name: "MySQL", level: 70, color: "from-orange-400 to-amber-500", icon: "🗄️" },
      { name: "Matplotlib / Seaborn", level: 82, color: "from-purple-400 to-violet-500", icon: "📈" },
      { name: "Jupyter Notebook", level: 88, color: "from-orange-400 to-red-500", icon: "📓" },
    ],
  },
  {
    category: "Tools & Workflow",
    items: [
      { name: "Git / GitHub", level: 85, color: "from-slate-400 to-gray-500", icon: "🐙" },
      { name: "VS Code", level: 92, color: "from-blue-400 to-indigo-500", icon: "💻" },
      { name: "REST APIs", level: 82, color: "from-cyan-400 to-blue-500", icon: "🔗" },
      { name: "Express.js", level: 78, color: "from-slate-400 to-gray-500", icon: "⚡" },
      { name: "Mongoose", level: 75, color: "from-green-400 to-emerald-500", icon: "📦" },
    ],
  },
];

export interface TimelineItem {
  type: "education" | "experience" | "certification" | "achievement";
  title: string;
  subtitle?: string;
  date: string;
  description: string;
  tags?: string[];
}

export const education: TimelineItem[] = [
  {
    type: "education",
    title: "B.Tech — Artificial Intelligence & Machine Learning",
    subtitle: "CHARUSAT University, Gujarat",
    date: "2024 – Present",
    description:
      "Currently pursuing B.Tech specializing in AI & ML. Covering subjects including Machine Learning, Deep Learning, Computer Vision, Natural Language Processing, Data Structures, and Software Engineering.",
    tags: ["AI", "ML", "Deep Learning", "NLP", "Python"],
  },
];

export const experience: TimelineItem[] = [];

export const certifications: TimelineItem[] = [];

export const achievements: TimelineItem[] = [];

export const contactInfo = {
  email: "rudra02609@gmail.com",
  phone: "+91 6353479871",
  github: "rudra02609",
  linkedin: "rudra-prajapati-276265321",
  githubUrl: "https://github.com/rudra02609",
  linkedinUrl: "https://www.linkedin.com/in/rudra-prajapati-276265321",
  location: "Gujarat, India",
};

export const socialLinks = [
  { label: "GitHub", url: contactInfo.githubUrl, icon: "github" },
  { label: "LinkedIn", url: contactInfo.linkedinUrl, icon: "linkedin" },
  { label: "Email", url: `mailto:${contactInfo.email}`, icon: "mail" },
];

export const emailConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || "",
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "",
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "",
};

export const portfolioData = {
  profile,
  hero,
  stats,
  about,
  skills,
  education,
  experience,
  certifications,
  achievements,
  contact: contactInfo,
  socialLinks,
  emailJs: emailConfig,
};

export type PortfolioData = typeof portfolioData;
