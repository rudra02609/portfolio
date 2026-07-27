import { 
  FaReact, FaJs, FaHtml5, FaCss3, FaPython, FaNodeJs, FaGitAlt, FaGithub, FaDatabase, FaChartBar
} from "react-icons/fa";
import { 
  SiTailwindcss, SiTensorflow, SiPytorch, SiScikitlearn, SiOpencv, 
  SiMongodb, SiPostgresql, SiMysql, SiFlask, SiJupyter 
} from "react-icons/si";


export const portfolioData = {
  profile: {
    name: "Rudra Prajapati",
    title: "AI & ML Engineer / Full Stack Developer",
    subTitle: "B.Tech AIML Student @ CHARUSAT University",
    tagline: "Building the future of intelligent applications using Deep Learning, Machine Learning, and modern Web Technologies.",
    aboutShort: "Passionate about Artificial Intelligence, Machine Learning, Python Development, and Web Applications. I enjoy building intelligent solutions, analyzing datasets, and engineering products that solve real-world challenges.",
    resumeUrl: "#", // User can replace with direct path to their resume PDF
  },
  
  stats: [
    { label: "Repositories", value: "10+", key: "repos" },
    { label: "CGPA", value: "9.2/10", key: "cgpa" },
    { label: "Technologies", value: "15+", key: "tech" },
    { label: "Projects Completed", value: "12+", key: "projects" }
  ],
  
  about: {
    bio: [
      "I am currently pursuing my B.Tech in Artificial Intelligence & Machine Learning at CHARUSAT University (2024 - Present). My academic path has equipped me with strong analytical skills and deep technical knowledge in engineering neural network models and implementing web interfaces.",
      "My passion lies at the intersection of AI/ML algorithms and full-stack software development. I build data-driven backend systems with Python, visual dashboards using Power BI, and interactive frontends using React and Tailwind CSS.",
      "I thrive in collaborative environments such as hackathons and code sprints. I am dedicated to continuously upgrading my skills, staying ahead of trends in Generative AI, and delivering performant, recruiter-ready code bases."
    ]
  },
  
  skills: [
    {
      category: "Programming",
      items: [
        { name: "Python", icon: FaPython, level: 90, color: "from-blue-500 to-yellow-500" },
        { name: "JavaScript", icon: FaJs, level: 80, color: "from-yellow-400 to-orange-500" },
        { name: "SQL", icon: FaDatabase, level: 75, color: "from-blue-400 to-indigo-600" }
      ]
    },
    {
      category: "AI / ML & Data Science",
      items: [
        { name: "Machine Learning", icon: SiScikitlearn, level: 85, color: "from-orange-500 to-red-600" },
        { name: "Deep Learning & TF", icon: SiTensorflow, level: 70, color: "from-orange-400 to-orange-600" },
        { name: "PyTorch", icon: SiPytorch, level: 65, color: "from-red-500 to-pink-600" },
        { name: "Computer Vision (OpenCV)", icon: SiOpencv, level: 75, color: "from-green-400 to-emerald-600" },
        { name: "Power BI & Analytics", icon: FaChartBar, level: 80, color: "from-yellow-500 to-yellow-600" }
      ]
    },
    {
      category: "Frontend",
      items: [
        { name: "React", icon: FaReact, level: 85, color: "from-cyan-400 to-blue-500" },
        { name: "Tailwind CSS", icon: SiTailwindcss, level: 90, color: "from-cyan-300 to-teal-500" },
        { name: "HTML5 & CSS3", icon: FaHtml5, level: 95, color: "from-orange-500 to-blue-500" }
      ]
    },
    {
      category: "Backend & Databases",
      items: [
        { name: "Flask (Python)", icon: SiFlask, level: 75, color: "from-gray-400 to-gray-700" },
        { name: "Node.js & Express", icon: FaNodeJs, level: 60, color: "from-green-500 to-emerald-700" },
        { name: "MongoDB", icon: SiMongodb, level: 70, color: "from-green-500 to-green-600" },
        { name: "MySQL / PostgreSQL", icon: SiMysql, level: 80, color: "from-blue-500 to-indigo-600" }
      ]
    },
    {
      category: "Tools & Platforms",
      items: [
        { name: "Git & GitHub", icon: FaGitAlt, level: 85, color: "from-orange-600 to-red-500" }
      ]
    }
  ],
  
  timeline: [
    {
      type: "education",
      title: "B.Tech in Artificial Intelligence & Machine Learning",
      subtitle: "CHARUSAT University",
      date: "2024 - Present",
      description: "Focusing on Neural Networks, Machine Learning Algorithms, Python, Advanced Mathematics, Database Management, and Data Structures. Maintaining a premium academic track record.",
      tags: ["AI", "ML", "Python", "SQL", "Academics"]
    },
    {
      type: "achievement",
      title: "Hackathon Competitor",
      subtitle: "CHARUSAT Innovate",
      date: "2025",
      description: "Collaborated in a team of 4 to design a smart dashboard forecasting model using Python, Flask, and Machine Learning algorithms.",
      tags: ["Hackathon", "ML", "Flask", "Teamwork"]
    },
    {
      type: "certification",
      title: "Supervised Machine Learning: Regression and Classification",
      subtitle: "Coursera / Stanford Online",
      date: "2025",
      description: "Learned linear regression, logistic regression, gradient descent, regularization, and classification strategies in depth.",
      tags: ["Machine Learning", "Certification"]
    },
    {
      type: "certification",
      title: "Data Analysis with Python",
      subtitle: "Cognitive Class",
      date: "2024",
      description: "Acquired core competencies in data cleaning, data exploration, predictive modeling, and data visualization using Pandas, NumPy, and Matplotlib.",
      tags: ["Data Analysis", "Python"]
    }
  ],
  
  contact: {
    email: "rudra02609@gmail.com",
    phone: "+91 6353479871",
    github: "rudra02609",
    linkedin: "rudra-prajapati-276265321",
    linkedinUrl: "https://www.linkedin.com/in/rudra-prajapati-276265321",
    location: "Gujarat, India"
  },

  // Users can set up these configurations inside their EmailJS dashboard
  emailJs: {
    serviceId: "service_default", // Replace with your Service ID
    templateId: "template_portfolio", // Replace with your Template ID
    publicKey: "user_placeholder" // Replace with your Public Key
  }
};
