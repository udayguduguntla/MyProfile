export const portfolioData = {
  personal: {
    name: "Uday Kumar Guduguntla",
    title: "NLP Developer & Python Engineer",
    tagline: "Building intelligent systems that understand and generate human language.",
    description: "Results-driven NLP Developer and Python Engineer with hands-on experience in developing multi-agent systems, RAG pipelines, and production-grade AI applications. Currently working at Worktual Innovations building semantic layers for AI agent orchestration.",
    email: "udayguduguntla@gmail.com",
    phone: "+91 6302111386",
    location: "Hyderabad, India",
    avatar: "/images/profile.jpg",
    resume: "#"
  },

  social: {
    github: "https://github.com/udayguduguntla",
    linkedin: "https://linkedin.com/in/udayguduguntla",
    leetcode: "https://leetcode.com/u/udayguduguntla",
    codechef: "https://codechef.com/users/udayguduguntla"
  },

  skills: {
    "Core Programming": ["Python", "JavaScript", "TypeScript", "Java", "SQL"],
    "AI/ML & NLP": ["Large Language Models (LLMs)", "Retrieval-Augmented Generation (RAG)", "Multi-Agent Systems", "Semantic Search", "NLP", "Computer Vision"],
    "Backend & APIs": ["FastAPI", "Flask", "Node.js", "Express.js", "REST APIs", "MCP Protocol"],
    "Databases & Storage": ["PostgreSQL", "Neo4j", "MongoDB", "Qdrant", "Pinecone", "Redis"],
    "DevOps & Tools": ["Docker", "Git", "Linux", "Postman", "VS Code", "GitHub Actions"],
    "Frameworks & Libraries": ["LangChain", "LlamaIndex", "OpenAI API", "React", "Next.js", "Tailwind CSS"]
  },

  projects: [
    {
      id: "multi-agent-platform",
      title: "Multi-Agent Orchestration Platform",
      description: "Production-grade multi-agent system enabling intelligent task routing and agent orchestration.",
      image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg",
      technologies: ["Python", "FastAPI", "LangChain", "Neo4j", "PostgreSQL", "Multi-Agent Systems"],
      features: ["Intelligent task routing across multiple AI agents", "Semantic understanding of user queries", "State management for agent collaboration", "Production-ready REST APIs", "Real-time agent communication"],
      github: "https://github.com/udayguduguntla",
      readmeUrl: "https://github.com/udayguduguntla",
      workingUrl: "#",
      category: "AI/ML",
      isPublic: true,
      featured: true,
      status: "in-progress"
    },
    {
      id: "rag-pipeline",
      title: "Enterprise RAG Pipeline System",
      description: "End-to-end Retrieval-Augmented Generation pipeline with semantic search, document chunking, and vector storage.",
      image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg",
      technologies: ["Python", "FastAPI", "Qdrant", "OpenAI API", "LlamaIndex", "RAG"],
      features: ["Multi-format document processing", "Semantic chunking with overlap", "Vector search with hybrid retrieval", "Custom embedding model support", "Streaming response generation"],
      github: "https://github.com/udayguduguntla",
      readmeUrl: "https://github.com/udayguduguntla",
      workingUrl: "#",
      category: "AI/ML",
      isPublic: true,
      featured: true,
      status: "completed"
    },
    {
      id: "mcp-server-framework",
      title: "MCP Server Implementation",
      description: "Model Context Protocol (MCP) server implementation for standardized AI agent communication.",
      image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg",
      technologies: ["Python", "MCP Protocol", "FastAPI", "Async Programming", "Tool Integration"],
      features: ["Standardized MCP protocol implementation", "Tool discovery and registration", "Secure authentication layer", "Asynchronous request handling", "Extensible tool architecture"],
      github: "https://github.com/udayguduguntla",
      readmeUrl: "https://github.com/udayguduguntla",
      workingUrl: "#",
      category: "AI/ML",
      isPublic: false,
      featured: true,
      status: "completed"
    },
    {
      id: "color-detection",
      title: "Live Camera Color Detection",
      description: "Accessibility tool helping color-blind individuals identify colors in real-time through live camera feed with voice feedback.",
      image: "https://images.pexels.com/photos/6059209/pexels-photo-6059209.jpeg",
      technologies: ["Python", "OpenCV", "Computer Vision", "Accessibility", "Machine Learning"],
      features: ["Real-time color detection using camera", "Voice feedback for identified colors", "High accuracy color recognition", "User-friendly interface", "Accessibility-focused design"],
      github: "https://github.com/udayguduguntla/ColorDetention",
      readmeUrl: "https://github.com/udayguduguntla/ColorDetention",
      workingUrl: "https://github.com/udayguduguntla/ColorDetention",
      category: "Computer Vision",
      isPublic: true,
      featured: false,
      status: "completed"
    },
    {
      id: "license-plate-recognition",
      title: "License Plate Recognition System",
      description: "Advanced ANPR system using computer vision and OCR technology for automatic vehicle identification and traffic management.",
      image: "https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg",
      technologies: ["Python", "OpenCV", "OCR", "Image Processing", "Computer Vision"],
      features: ["Automatic license plate detection", "OCR text recognition", "Multiple image format support", "High accuracy recognition", "Real-time processing"],
      github: "https://github.com/udayguduguntla/LicencePlateDetention",
      readmeUrl: "https://github.com/udayguduguntla/LicencePlateDetention",
      workingUrl: "#",
      category: "Computer Vision",
      isPublic: true,
      featured: false,
      status: "completed"
    },
    {
      id: "face-attendance",
      title: "Face Recognition Attendance System",
      description: "Comprehensive attendance management system using facial recognition technology with Flask backend.",
      image: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg",
      technologies: ["Python", "Flask", "Face Recognition", "Machine Learning", "Web Development"],
      features: ["Real-time face recognition", "Automated attendance marking", "Web-based dashboard", "Student database management", "Attendance reports generation"],
      github: "https://github.com/udayguduguntla/FaceReconitionBasedAttendence",
      readmeUrl: "https://github.com/udayguduguntla/FaceReconitionBasedAttendence",
      workingUrl: "https://github.com/udayguduguntla/FaceReconitionBasedAttendence",
      category: "Machine Learning",
      isPublic: true,
      featured: false,
      status: "completed"
    },
    {
      id: "traffic-generation",
      title: "Website Traffic Generation System",
      description: "Sophisticated web automation tool built with Java and Selenium for generating website traffic with proxy management.",
      image: "https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg",
      technologies: ["Java", "Selenium", "Web Automation", "Analytics", "Multi-threading"],
      features: ["Automated web traffic generation", "Proxy server integration", "Analytics and reporting", "Configurable traffic patterns", "Multi-threading support"],
      github: "https://github.com/udayguduguntla/BuildingTrafficeOnAWebsiteJava",
      readmeUrl: "https://github.com/udayguduguntla/BuildingTrafficeOnAWebsiteJava",
      workingUrl: "https://github.com/udayguduguntla/BuildingTrafficeOnAWebsiteJava",
      category: "Web Automation",
      isPublic: true,
      featured: false,
      status: "completed"
    },
    {
      id: "plant-doctor",
      title: "Plant Doctor & Fertilizer Advisor",
      description: "AI-powered plant leaf health diagnostic tool using HSV color segmentation to detect diseases, nutrient deficiencies, and pests.",
      image: "https://images.pexels.com/photos/807598/pexels-photo-807598.jpeg",
      technologies: ["Python", "OpenCV", "Computer Vision", "Streamlit", "HSV Segmentation", "NumPy"],
      features: ["Real-time leaf tissue analysis using HSV color segmentation", "Detects chlorosis, necrosis, powdery mildew, and healthy tissue", "Custom fertilizer recommendations with NPK ratios", "Organic and chemical treatment plans", "Interactive tissue composition visualization", "Premium glassmorphic UI with constellation animation background"],
      github: "https://github.com/udayguduguntla",
      readmeUrl: "https://github.com/udayguduguntla",
      workingUrl: "#",
      category: "Machine Learning",
      isPublic: true,
      featured: false,
      status: "completed"
    },
    {
      id: "license-plate-reader",
      title: "License Plate Reader (ANPR)",
      description: "Automatic Number Plate Recognition system using OpenCV contour detection and Tesseract OCR to detect and read vehicle license plates.",
      image: "https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg",
      technologies: ["Python", "OpenCV", "Tesseract OCR", "Computer Vision", "Streamlit", "Image Processing"],
      features: ["Real-time license plate localization using contour detection", "OCR text extraction with Tesseract engine", "Multi-format image support (JPG, PNG, BMP, WebP)", "Visual plate annotation and crop extraction", "Interactive Streamlit dashboard with dark theme", "Constellation canvas background animation"],
      github: "https://github.com/udayguduguntla",
      readmeUrl: "https://github.com/udayguduguntla",
      workingUrl: "#",
      category: "Computer Vision",
      isPublic: true,
      featured: true,
      status: "completed"
    }
  ],

  achievements: [
    {
      category: "Competitive Programming",
      items: [
        { title: "TCS CodeVita Season 12 - Global Rank #7574", description: "Secured global rank 7574 in the world's largest coding competition", year: "2024", icon: "🏆" },
        { title: "AINCAT 2025 - National Rank #3567", description: "India's Biggest Career Aptitude Test conducted by Naukri.com", year: "2025", icon: "🧠" }
      ]
    },
    {
      category: "Hackathons & Competitions",
      items: [
        { title: "DevFista Hackathon - 1st Prize", description: "Won first place in the national-level hackathon for innovative AI solution", year: "2024", icon: "🥇" },
        { title: "TechChroma - 1st Prize", description: "First place in technical competition showcasing innovative project development", year: "2024", icon: "🥇" },
        { title: "CVCORP - Top 40 Finalist", description: "Selected among top 40 participants in prestigious corporate competition", year: "2024", icon: "🎖️" }
      ]
    },
    {
      category: "Certifications",
      items: [
        { title: "MCP Certification", description: "Certified in Model Context Protocol for AI agent development", year: "2025", icon: "📜" }
      ]
    }
  ],

  education: [
    {
      degree: "Master of Computer Applications (MCA)",
      institution: "Narayana Engineering College",
      period: "2023 - Present",
      description: "Currently pursuing with CGPA of 8.8, focusing on AI/ML and advanced software development.",
      cgpa: "8.8",
      status: "current"
    },
    {
      degree: "Bachelor of Science (B.Sc)",
      institution: "Previous Institution",
      period: "2020 - 2023",
      description: "Graduated with CGPA of 9.2, building strong foundation in computer science fundamentals.",
      cgpa: "9.2",
      status: "completed"
    }
  ],

  contact: {
    email: "udayguduguntla@gmail.com",
    phone: "+91 6302111386",
    location: "Hyderabad, India",
    availability: "Open to opportunities in AI/ML and NLP development"
  },

  experience: [
    {
      title: "NLP Developer & Python Engineer",
      company: "Worktual Innovations",
      period: "May 2025 - Present",
      description: "Building multi-agent AI systems and semantic layers for intelligent agent orchestration. Developing production-grade RAG pipelines and MCP server implementations.",
      technologies: ["Python", "FastAPI", "LangChain", "Neo4j", "PostgreSQL", "OpenAI API"],
      current: true
    },
    {
      title: "Full Stack Developer",
      company: "Freelance",
      period: "2023 - May 2025",
      description: "Developed web applications using modern technologies including React, Node.js, and various databases.",
      technologies: ["React", "Node.js", "MongoDB", "Express.js", "Python"]
    }
  ]
};

export type Project = typeof portfolioData.projects[0];
export type Achievement = typeof portfolioData.achievements[0];
