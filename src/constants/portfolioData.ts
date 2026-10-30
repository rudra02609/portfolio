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
  resumeUrl: "/resume/RUDRA%20PRAJAPATI%20RESUME.pdf",
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
  image?: string;
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

export const experience: TimelineItem[] = [
  {
    type: "experience",
    title: "Data Science Intern",
    subtitle: "Synent Technologies — SYN-SIP AICTE Internship Program",
    date: "May 2026 – Jun 2026",
    description:
      "Successfully completed a 6-week SYN-SIP AICTE Internship Program as a Data Science Intern at Synent Technologies with highly commendable remarks. Gained practical experience in Data Science, Data Visualization, Exploratory Data Analysis (EDA), Time Series Analysis, and Machine Learning, working on data-driven problems and developing practical analytical solutions.",
    tags: ["Python", "Pandas", "Data Visualization", "EDA", "Machine Learning", "Time Series Analysis", "Scikit-learn", "Jupyter Notebook"],
  },
];

export const certifications: TimelineItem[] = [];

// ============================================================
// CERTIFICATES — Domain-organized certificate portfolio
// ============================================================

export interface CertificateItem {
  name: string;
  file: string;
  issuer?: string;
  date?: string;
  skills?: string[];
}

export interface CertificateDomain {
  domain: string;
  icon: string;
  certificates: CertificateItem[];
}

export const certificateDomains: CertificateDomain[] = [
  {
    domain: "Hackathons",
    icon: "🏆",
    certificates: [
      {
        name: "TetraTHON 2026 — AI Innovation Hackathon",
        file: "/Certificates/hackhathon/Tetrathon 2026.jpg",
        issuer: "Navrachana University × ISEN Méditerranée, France",
        date: "7 August 2026",
        skills: ["AI Innovation", "Machine Learning", "Rapid Prototyping", "Team Leadership"],
      },
      {
        name: "Math Flow AI Hackathon",
        file: "/Certificates/math-flow-ai-hackathon.jpg",
issuer: "CHARUSAT University",
        skills: ["Artificial Intelligence", "Problem Solving", "Mathematical Modeling"],
      },
      {
        name: "Mind Sprint Hackathon",
        file: "/Certificates/hackhathon/Mind sprint hackathon.jpg",
        skills: ["Hackathon", "Problem Solving", "Team Collaboration"],
      },
      {
        name: "Coders Arcade 2.0 Hackathon",
        file: "/Certificates/hackhathon/Coders-arcade2.0.jpg",
        skills: ["Competitive Programming", "Problem Solving", "Team Collaboration"],
      },
    ],
  },
  {
    domain: "Coursera",
    icon: "🎓",
    certificates: [
      {
        name: "Introduction to Java",
        file: "/Certificates/coursera/Coursera Introduction to java.jpg",
        issuer: "Coursera",
        skills: ["Java", "Object-Oriented Programming", "Core Java Concepts"],
      },
      {
        name: "Design and Analysis of Algorithms",
        file: "/Certificates/coursera/DAA Coursera.jpg",
        issuer: "Coursera",
        skills: ["Algorithms", "Data Structures", "Complexity Analysis", "Problem Solving"],
      },
      {
        name: "Foundation of Data Structures & Algorithms",
        file: "/Certificates/coursera/foundation of dsa.jpg",
        issuer: "Coursera",
        skills: ["Data Structures", "Algorithms", "DSA Fundamentals"],
      },
      {
        name: "Java Class Library",
        file: "/Certificates/coursera/java class library.jpg",
        issuer: "Coursera",
        skills: ["Java", "Java Collections Framework", "Standard Library"],
      },
      {
        name: "Advanced Web Development Frameworks",
        file: "/Certificates/coursera/AWDF Coursera.jpg",
        issuer: "Coursera",
        date: "3 September 2026",
        skills: ["Web Development", "Web Frameworks", "Frontend Development"],
      },
    ],
  },
  {
    domain: "Internship",
    icon: "🏢",
    certificates: [
      {
        name: "Data Science Intern — SYN-SIP AICTE Program",
        file: "/Certificates/internship/Prajapati Rudra  Certificate.jpg",
        issuer: "Synent Technologies",
        date: "May 2026 – Jun 2026",
        skills: ["Data Science", "Machine Learning", "EDA", "Time Series Analysis", "Python"],
      },
    ],
  },
];

export const achievements: TimelineItem[] = [
  {
    type: "achievement",
    title: "TetraTHON 2026 — Second Runner-Up",
    subtitle: "Indo-French AI Innovation Hackathon",
    date: "7 August 2026",
    description:
      "Secured Second Runner-Up (3rd Place) in TetraTHON 2026, a high-intensity 36-hour Indo-French AI Innovation Sprint hosted by Navrachana University, Vadodara, in partnership with ISEN Méditerranée, France. Finished among the Top 9 finalist teams out of 160 participating teams, receiving a ₹25,000 team prize. The achievement highlights excellence in AI innovation, technical problem-solving, teamwork, and rapid development under extreme time constraints.",
    tags: ["🏆 3rd Place", "Top 9 / 160 Teams", "₹25,000 Prize", "36-Hour Sprint", "Navrachana University × ISEN France", "Rudra Prajapati", "Khushi Vadadoriya", "Have Patel", "Diya Patel"],
    image: "/Certificates/Tetrathon-2026-2nd-runnerup.jpeg",
  },
];

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
