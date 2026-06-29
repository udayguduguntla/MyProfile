// Portfolio Data - Updated from Resume
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
    resume: "/documents/udayNewUAE.pdf"
  },

  social: {
    github: "https://github.com/udayguduguntla",
    linkedin: "https://linkedin.com/in/udayguduguntla",
    leetcode: "https://leetcode.com/u/udayguduguntla",
    codechef: "https://codechef.com/users/udayguduguntla"
  },

  skills: {
    "Core Programming": [
      "Python", "JavaScript", "TypeScript", "Java", "SQL"
    ],
    "AI/ML & NLP": [
      "Large Language Models (LLMs)", "Retrieval-Augmented Generation (RAG)",
      "Multi-Agent Systems", "Semantic Search", "NLP", "Computer Vision"
    ],
    "Backend & APIs": [
      "FastAPI", "Flask", "Node.js", "Express.js", "REST APIs", "MCP Protocol"
    ],
    "Databases & Storage": [
      "PostgreSQL", "Neo4j", "MongoDB", "Qdrant", "Pinecone", "Redis"
    ],
    "DevOps & Tools": [
      "Docker", "Git", "Linux", "Postman", "VS Code", "GitHub Actions"
    ],
    "Frameworks & Libraries": [
      "LangChain", "LlamaIndex", "OpenAI API", "React", "Next.js", "Tailwind CSS"
    ]
  },

  projects: [
    {
      id: "multi-agent-platform",
      title: "Multi-Agent Orchestration Platform",
      description: "Production-grade multi-agent system enabling intelligent task routing and agent orchestration. Built semantic layers for AI agents to collaborate on complex workflows with real-time state management.",
      image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg",
      technologies: ["Python", "FastAPI", "LangChain", "Neo4j", "PostgreSQL", "Multi-Agent Systems"],
      features: [
        "Intelligent task routing across multiple AI agents",
        "Semantic understanding of user queries",
        "State management for agent collaboration",
        "Production-ready REST APIs",
        "Real-time agent communication"
      ],
      github: "https://github.com/udayguduguntla",
      demo: "#",
      category: "AI/ML",
      featured: true,
      status: "in-progress"
    },
    {
      id: "rag-pipeline",
      title: "Enterprise RAG Pipeline System",
      description: "End-to-end Retrieval-Augmented Generation pipeline with semantic search, document chunking, and vector storage. Supports multiple LLM providers and custom embedding models.",
      image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg",
      technologies: ["Python", "FastAPI", "Qdrant", "OpenAI API", "LlamaIndex", "RAG"],
      features: [
        "Multi-format document processing",
        "Semantic chunking with overlap",
        "Vector search with hybrid retrieval",
        "Custom embedding model support",
        "Streaming response generation"
      ],
      github: "https://github.com/udayguduguntla",
      demo: "#",
      category: "AI/ML",
      featured: true,
      status: "completed"
    },
    {
      id: "mcp-server-framework",
      title: "MCP Server Implementation",
      description: "Model Context Protocol (MCP) server implementation for standardized AI agent communication. Enables seamless integration between LLMs and external tools with secure authentication.",
      image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg",
      technologies: ["Python", "MCP Protocol", "FastAPI", "Async Programming", "Tool Integration"],
      features: [
        "Standardized MCP protocol implementation",
        "Tool discovery and registration",
        "Secure authentication layer",
        "Asynchronous request handling",
        "Extensible tool architecture"
      ],
      github: "https://github.com/udayguduguntla",
      demo: "#",
      category: "AI/ML",
      featured: true,
      status: "completed"
    },
    {
      id: "color-detection",
      title: "Live Camera Color Detection",
      description: "Revolutionary accessibility tool helping color-blind individuals identify colors in real-time through live camera feed with voice feedback. This project aims to make the digital world more inclusive for people with color vision deficiency.",
      image: "https://images.pexels.com/photos/6059209/pexels-photo-6059209.jpeg",
      technologies: ["Python", "OpenCV", "Computer Vision", "Accessibility", "Machine Learning"],
      features: [
        "Real-time color detection using camera",
        "Voice feedback for identified colors",
        "High accuracy color recognition",
        "User-friendly interface",
        "Accessibility-focused design"
      ],
      github: "https://github.com/udayguduguntla/ColorDetention",
      demo: "https://github.com/udayguduguntla/ColorDetention",
      category: "Computer Vision",
      featured: false,
      status: "completed"
    },
    {
      id: "license-plate-recognition",
      title: "License Plate Recognition System",
      description: "Advanced Automatic Number Plate Recognition (ANPR) system using computer vision and OCR technology for automatic vehicle identification and traffic management.",
      image: "https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg",
      technologies: ["Python", "OpenCV", "OCR", "Image Processing", "Computer Vision"],
      features: [
        "Automatic license plate detection",
        "OCR text recognition",
        "Multiple image format support",
        "High accuracy recognition",
        "Real-time processing"
      ],
      github: "https://github.com/udayguduguntla/LicencePlateDetention",
      demo: "/projects/license-plate-recognition/demo",
      category: "Computer Vision",
      featured: false,
      status: "completed"
    },
    {
      id: "face-attendance",
      title: "Face Recognition Attendance System",
      description: "Comprehensive attendance management system using facial recognition technology with Flask backend for educational institutions and organizations.",
      image: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg",
      technologies: ["Python", "Flask", "Face Recognition", "Machine Learning", "Web Development"],
      features: [
        "Real-time face recognition",
        "Automated attendance marking",
        "Web-based dashboard",
        "Student database management",
        "Attendance reports generation"
      ],
      github: "https://github.com/udayguduguntla/FaceReconitionBasedAttendence",
      demo: "https://github.com/udayguduguntla/FaceReconitionBasedAttendence",
      category: "Machine Learning",
      featured: false,
      status: "completed"
    },
    {
      id: "traffic-generation",
      title: "Website Traffic Generation System",
      description: "Sophisticated web automation tool built with Java and Selenium for generating website traffic with proxy management and analytics tracking capabilities.",
      image: "https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg",
      technologies: ["Java", "Selenium", "Web Automation", "Analytics", "Multi-threading"],
      features: [
        "Automated web traffic generation",
        "Proxy server integration",
        "Analytics and reporting",
        "Configurable traffic patterns",
        "Multi-threading support"
      ],
      github: "https://github.com/udayguduguntla/BuildingTrafficeOnAWebsiteJava",
      demo: "https://github.com/udayguduguntla/BuildingTrafficeOnAWebsiteJava",
      category: "Web Automation",
      featured: false,
      status: "completed"
    },
    {
      id: "plant-doctor",
      title: "Plant Doctor & Fertilizer Advisor",
      description: "AI-powered plant leaf health diagnostic tool using HSV color segmentation to detect diseases, nutrient deficiencies, and pests. Provides tailored organic and chemical fertilizer recommendations with treatment plans.",
      image: "https://images.pexels.com/photos/807598/pexels-photo-807598.jpeg",
      technologies: ["Python", "OpenCV", "Computer Vision", "Streamlit", "HSV Segmentation", "NumPy"],
      features: [
        "Real-time leaf tissue analysis using HSV color segmentation",
        "Detects chlorosis, necrosis, powdery mildew, and healthy tissue",
        "Custom fertilizer recommendations with NPK ratios",
        "Organic and chemical treatment plans for diseases",
        "Interactive tissue composition visualization",
        "Premium glassmorphic UI with constellation animation background"
      ],
      github: "https://github.com/udayguduguntla",
      demo: "/projects/plant-doctor/demo",
      category: "Machine Learning",
      featured: false,
      status: "completed"
    },
    {
      id: "license-plate-reader",
      title: "License Plate Reader (ANPR)",
      description: "Automatic Number Plate Recognition system using OpenCV contour detection and Tesseract OCR to detect and read vehicle license plates from images with high accuracy.",
      image: "https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg",
      technologies: ["Python", "OpenCV", "Tesseract OCR", "Computer Vision", "Streamlit", "Image Processing"],
      features: [
        "Real-time license plate localization using contour detection",
        "OCR text extraction with Tesseract engine",
        "Multi-format image support (JPG, PNG, BMP, WebP)",
        "Visual plate annotation and crop extraction",
        "Interactive Streamlit dashboard with dark theme",
        "Constellation canvas background animation"
      ],
      github: "https://github.com/udayguduguntla",
      demo: "/projects/license-plate-reader/demo",
      category: "Computer Vision",
      featured: true,
      status: "completed"
    }
  ],

  achievements: [
    {
      category: "Competitive Programming",
      items: [
        {
          title: "TCS CodeVita Season 12 - Global Rank #7574",
          description: "Secured global rank 7574 in the world's largest coding competition with participants from across the globe",
          year: "2024",
          icon: "🏆"
        },
        {
          title: "AINCAT 2025 - National Rank #3567",
          description: "India's Biggest Career Aptitude Test conducted by Naukri.com",
          year: "2025",
          icon: "🧠"
        }
      ]
    },
    {
      category: "Hackathons & Competitions",
      items: [
        {
          title: "DevFista Hackathon - 1st Prize",
          description: "Won first place in the national-level hackathon for innovative AI solution",
          year: "2024",
          icon: "🥇"
        },
        {
          title: "TechChroma - 1st Prize",
          description: "First place in technical competition showcasing innovative project development",
          year: "2024",
          icon: "🥇"
        },
        {
          title: "CVCORP - Top 40 Finalist",
          description: "Selected among top 40 participants in prestigious corporate competition",
          year: "2024",
          icon: "🎖️"
        }
      ]
    },
    {
      category: "Certifications",
      items: [
        {
          title: "MCP Certification",
          description: "Certified in Model Context Protocol for AI agent development",
          year: "2025",
          icon: "📜"
        }
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
  ],

  blogs: [
    {
      id: "rag-systems",
      title: "Building Production-Ready RAG Systems",
      excerpt: "A deep dive into creating scalable RAG pipelines with semantic search and vector databases.",
      content: "Full blog content about RAG systems...",
      publishedAt: "2025-01-15",
      readTime: "8 min read",
      tags: ["RAG", "AI", "NLP", "Vector Databases"],
      featured: true
    },
    {
      id: "multi-agent-systems",
      title: "Orchestrating Multi-Agent AI Systems",
      excerpt: "Best practices for building collaborative AI agent systems with semantic understanding.",
      content: "Full blog content about multi-agent systems...",
      publishedAt: "2025-02-20",
      readTime: "10 min read",
      tags: ["AI", "Multi-Agent", "LangChain", "Architecture"],
      featured: false
    }
  ],

  contact: {
    email: "udayguduguntla@gmail.com",
    phone: "+91 6302111386",
    location: "Hyderabad, India",
    availability: "Open to opportunities in AI/ML and NLP development"
  }
};

export type Project = typeof portfolioData.projects[0];
export type Achievement = typeof portfolioData.achievements[0];
export type Blog = typeof portfolioData.blogs[0];
