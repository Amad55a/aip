import type { Language } from "@/i18n";

export type ProjectDifficulty = "beginner" | "intermediate" | "advanced";
export type ProjectCategory = "html-css-js" | "mern";

export type Project = {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  description: string;
  longDescription: string;
  difficulty: ProjectDifficulty;
  estimatedHours: number;
  technologies: string[];
  whatYouWillBuild: string[];
  whatYouWillLearn: string[];
  requirements: string[];
  suggestedSteps: string[];
  relatedLearning: string[];
};

export const PROJECTS: Project[] = [
  {
    id: "personal-portfolio-website",
    slug: "personal-portfolio-website",
    title: "Personal Portfolio Website",
    category: "html-css-js",
    description: "Create a personal portfolio to showcase your work, skills, and contact information.",
    longDescription:
      "Build a clean personal portfolio that helps you introduce yourself, present your work, and make it easy for recruiters or clients to contact you.",
    difficulty: "beginner",
    estimatedHours: 6,
    technologies: ["HTML", "CSS", "JavaScript"],
    whatYouWillBuild: [
      "A polished one-page portfolio with a hero section, about section, project cards, and contact details.",
      "Responsive layouts for desktop, tablet, and mobile screens.",
    ],
    whatYouWillLearn: [
      "Semantic HTML structure",
      "CSS layout and responsive design",
      "JavaScript interactivity",
      "Navigation and mobile-friendly design",
    ],
    requirements: [
      "Add a hero section with your name and profile summary",
      "Show your skills and featured projects",
      "Add a working contact section",
      "Make the page responsive across screen sizes",
    ],
    suggestedSteps: [
      "Create the HTML structure",
      "Style the layout and typography",
      "Add simple JavaScript interactions",
      "Test responsiveness and accessibility",
      "Polish the visual details",
    ],
    relatedLearning: ["HTML", "CSS", "Responsive Design", "JavaScript Basics"],
  },
  {
    id: "responsive-landing-page",
    slug: "responsive-landing-page",
    title: "Responsive Landing Page",
    category: "html-css-js",
    description: "Design a product landing page with a modern layout and responsive sections.",
    longDescription:
      "Create a professional landing page that communicates value clearly and adapts nicely to smaller screens.",
    difficulty: "beginner",
    estimatedHours: 5,
    technologies: ["HTML", "CSS"],
    whatYouWillBuild: [
      "A product-focused landing page with a headline, call-to-action buttons, and a feature section.",
      "A responsive layout with a mobile-friendly navigation flow.",
    ],
    whatYouWillLearn: [
      "CSS flexbox and grid",
      "Spacing and layout systems",
      "Responsive breakpoints",
      "Marketing-focused UI design",
    ],
    requirements: [
      "Add a clear headline and CTA",
      "Build a feature grid",
      "Include testimonials or trust signals",
      "Make the page usable on mobile",
    ],
    suggestedSteps: [
      "Sketch the layout",
      "Create the page structure",
      "Apply styling and spacing",
      "Add responsive breakpoints",
      "Review the visual hierarchy",
    ],
    relatedLearning: ["HTML", "CSS", "Flexbox", "Responsive Design"],
  },
  {
    id: "todo-list-application",
    slug: "todo-list-application",
    title: "Todo List Application",
    category: "html-css-js",
    description: "Build a task management application using HTML, CSS and JavaScript.",
    longDescription:
      "Create a practical to-do app where users can add, edit, complete, and remove tasks while keeping their work saved in the browser.",
    difficulty: "beginner",
    estimatedHours: 6,
    technologies: ["HTML", "CSS", "JavaScript"],
    whatYouWillBuild: [
      "A task input, task list, and status controls for each item.",
      "A simple UI for viewing and organizing tasks.",
    ],
    whatYouWillLearn: [
      "DOM manipulation",
      "Events",
      "Arrays and objects",
      "Local Storage",
    ],
    requirements: [
      "Add a task",
      "Delete a task",
      "Mark a task complete",
      "Edit a task",
      "Save and load tasks",
    ],
    suggestedSteps: [
      "Create the HTML structure",
      "Style the interface",
      "Add JavaScript state",
      "Implement add, delete, edit, and complete behavior",
      "Save tasks in local storage",
    ],
    relatedLearning: ["JavaScript", "DOM", "Events", "Local Storage"],
  },
  {
    id: "javascript-quiz-application",
    slug: "javascript-quiz-application",
    title: "JavaScript Quiz Application",
    category: "html-css-js",
    description: "Build an interactive quiz that evaluates the learner's answers in real time.",
    longDescription:
      "Design a quiz page where a user selects answers, sees immediate feedback, and gets a final score at the end.",
    difficulty: "beginner",
    estimatedHours: 5,
    technologies: ["HTML", "CSS", "JavaScript"],
    whatYouWillBuild: [
      "A timed or untimed quiz with multiple-choice questions.",
      "A summary score screen and answer feedback.",
    ],
    whatYouWillLearn: [
      "Arrays and objects",
      "Conditionals",
      "Counting and scoring logic",
      "User feedback in the UI",
    ],
    requirements: [
      "Show questions and answer choices",
      "Track the user's score",
      "Provide feedback after each question",
      "Show a final result summary",
    ],
    suggestedSteps: [
      "Create the questions data",
      "Render the first question",
      "Handle answer selection",
      "Add scoring logic",
      "Display the final score",
    ],
    relatedLearning: ["JavaScript", "Arrays", "Logic", "DOM"],
  },
  {
    id: "calculator",
    slug: "calculator",
    title: "Calculator",
    category: "html-css-js",
    description: "Build a responsive calculator for basic arithmetic operations.",
    longDescription:
      "Create a calculator interface that supports addition, subtraction, multiplication, and division in a clean and intuitive layout.",
    difficulty: "beginner",
    estimatedHours: 4,
    technologies: ["HTML", "CSS", "JavaScript"],
    whatYouWillBuild: [
      "A calculator keypad with number and operator buttons.",
      "Arithmetic behavior for everyday calculations.",
    ],
    whatYouWillLearn: [
      "Event handling",
      "State management",
      "String and number conversion",
      "Clean UI composition",
    ],
    requirements: [
      "Support arithmetic operations",
      "Display the current calculation",
      "Handle clear and reset actions",
      "Support keyboard or mouse input",
    ],
    suggestedSteps: [
      "Build the layout",
      "Add button click handling",
      "Implement calculation logic",
      "Fix edge cases",
      "Improve the experience with polish",
    ],
    relatedLearning: ["JavaScript", "Functions", "Events", "UI Design"],
  },
  {
    id: "weather-application",
    slug: "weather-application",
    title: "Weather Application",
    category: "html-css-js",
    description: "Build a weather dashboard that fetches data from an API and displays conditions.",
    longDescription:
      "Use a public weather API to let users search for a city and view current weather information, temperature, and conditions.",
    difficulty: "intermediate",
    estimatedHours: 7,
    technologies: ["HTML", "CSS", "JavaScript", "API"],
    whatYouWillBuild: [
      "A weather search experience with city input and result cards.",
      "A clear summary of current conditions and local weather data.",
    ],
    whatYouWillLearn: [
      "Fetch and parse API data",
      "Loading and error states",
      "Working with JSON",
      "Displaying user-friendly results",
    ],
    requirements: [
      "Search by city name",
      "Display current weather",
      "Handle loading and error states",
      "Display a friendly result even if data is missing",
    ],
    suggestedSteps: [
      "Read the API documentation",
      "Create the UI structure",
      "Fetch and render weather data",
      "Handle edge cases",
      "Improve the visual clarity",
    ],
    relatedLearning: ["JavaScript", "Fetch API", "JSON", "Async Programming"],
  },
  {
    id: "expense-tracker",
    slug: "expense-tracker",
    title: "Expense Tracker",
    category: "html-css-js",
    description: "Build an expense tracker with categories, totals, and local persistence.",
    longDescription:
      "Help users organize daily spending by tracking expenses, showing totals, and saving data locally in the browser.",
    difficulty: "intermediate",
    estimatedHours: 8,
    technologies: ["HTML", "CSS", "JavaScript", "Local Storage"],
    whatYouWillBuild: [
      "A transaction form and purchase history list.",
      "A summary panel showing monthly or category totals.",
    ],
    whatYouWillLearn: [
      "State-driven UI updates",
      "Data validation",
      "Local storage persistence",
      "Basic analytics presentation",
    ],
    requirements: [
      "Add a new expense",
      "Delete an expense",
      "Show totals by category",
      "Persist the data after refresh",
    ],
    suggestedSteps: [
      "Design the form and list layout",
      "Store transactions in JavaScript data",
      "Add calculation logic",
      "Persist with local storage",
      "Improve sorting and filtering",
    ],
    relatedLearning: ["JavaScript", "Objects", "Local Storage", "Data Handling"],
  },
  {
    id: "movie-search-application",
    slug: "movie-search-application",
    title: "Movie Search Application",
    category: "html-css-js",
    description: "Create a movie browser that loads data from an API and lets users search titles.",
    longDescription:
      "Build a searchable movie library with results cards, filters, and relevant metadata pulled from an external API.",
    difficulty: "intermediate",
    estimatedHours: 8,
    technologies: ["HTML", "CSS", "JavaScript", "API"],
    whatYouWillBuild: [
      "A search screen with a movie grid and minimal detail cards.",
      "A responsive results page that updates as the user searches.",
    ],
    whatYouWillLearn: [
      "Handling fetch requests",
      "Rendering API results",
      "User search flows",
      "Error handling and empty states",
    ],
    requirements: [
      "Search by movie title",
      "Display movie cards with relevant details",
      "Handle no-result states",
      "Show loading feedback",
    ],
    suggestedSteps: [
      "Set up the search input",
      "Fetch data from the API",
      "Render results elegantly",
      "Handle missing metadata",
      "Refine the layout",
    ],
    relatedLearning: ["JavaScript", "Fetch API", "DOM", "UI Patterns"],
  },
  {
    id: "ecommerce-frontend",
    slug: "ecommerce-frontend",
    title: "E-commerce Frontend",
    category: "html-css-js",
    description: "Design a storefront interface for browsing products and adding items to a cart.",
    longDescription:
      "Create a user-friendly storefront mockup with product cards, category sections, and an interactive cart experience.",
    difficulty: "intermediate",
    estimatedHours: 10,
    technologies: ["HTML", "CSS", "JavaScript"],
    whatYouWillBuild: [
      "A storefront homepage with product cards and pricing information.",
      "A cart area that updates as the user adds or removes products.",
    ],
    whatYouWillLearn: [
      "UI composition",
      "Shopping cart state",
      "Form and button interactions",
      "Simple ecommerce flows",
    ],
    requirements: [
      "Show product cards with image, title, and price",
      "Add items to the cart",
      "Update totals in the cart summary",
      "Provide a clean storefront layout",
    ],
    suggestedSteps: [
      "Create the product layout",
      "Add cart state and totals",
      "Connect actions to buttons",
      "Review spacing and polish",
      "Test the shopping flow",
    ],
    relatedLearning: ["HTML", "CSS", "JavaScript", "UI Design"],
  },
  {
    id: "admin-dashboard",
    slug: "admin-dashboard",
    title: "Admin Dashboard",
    category: "html-css-js",
    description: "Build an admin dashboard with analytics cards, tables, and quick actions.",
    longDescription:
      "Design a management dashboard that presents key metrics, recent activity, and administrative controls in a structured way.",
    difficulty: "intermediate",
    estimatedHours: 9,
    technologies: ["HTML", "CSS", "JavaScript"],
    whatYouWillBuild: [
      "A dashboard layout with cards, chart-like blocks, and a data table.",
      "Action buttons and easy-to-scan summary panels.",
    ],
    whatYouWillLearn: [
      "Dashboard layout patterns",
      "Data visualization concepts",
      "Spacing and consistency",
      "Readable professional UI design",
    ],
    requirements: [
      "Build metric cards",
      "Show recent activity or records",
      "Create a side navigation or top bar",
      "Use charts or progress elements",
    ],
    suggestedSteps: [
      "Plan the dashboard structure",
      "Layout the cards and table",
      "Add styling for hierarchy",
      "Improve the interactive details",
      "Tune the visual clarity",
    ],
    relatedLearning: ["HTML", "CSS", "JavaScript", "Design Systems"],
  },
  {
    id: "mern-todo-application",
    slug: "mern-todo-application",
    title: "MERN Todo Application",
    category: "mern",
    description: "Build a full-stack todo app with React on the frontend and Express and MongoDB on the backend.",
    longDescription:
      "Create a full-stack task manager where users can create, view, and complete tasks through a React interface connected to a Node.js API backed by MongoDB.",
    difficulty: "beginner",
    estimatedHours: 12,
    technologies: ["React", "Node.js", "Express.js", "MongoDB"],
    whatYouWillBuild: [
      "A React client for managing tasks.",
      "An Express API for creating and listing tasks.",
      "MongoDB storage for persistent task data.",
    ],
    whatYouWillLearn: [
      "React state and forms",
      "REST APIs",
      "MongoDB CRUD operations",
      "Frontend-backend communication",
    ],
    requirements: [
      "Add and display tasks",
      "Create API routes for task actions",
      "Save tasks in MongoDB",
      "Render the list in the UI",
    ],
    suggestedSteps: [
      "Set up the project structure",
      "Design the frontend form and list",
      "Build Express routes",
      "Connect MongoDB models",
      "Test the end-to-end flow",
    ],
    relatedLearning: ["React", "Node.js", "Express.js", "MongoDB"],
  },
  {
    id: "blog-platform",
    slug: "blog-platform",
    title: "Blog Platform",
    category: "mern",
    description: "Build a blog platform with posts, categories, and API-backed content management.",
    longDescription:
      "Create a simple blog application where articles can be created, listed, and viewed from a MongoDB-backed API.",
    difficulty: "beginner",
    estimatedHours: 14,
    technologies: ["React", "Node.js", "Express.js", "MongoDB"],
    whatYouWillBuild: [
      "A blog home page and detailed article view.",
      "A backend API for creating and reading blog posts.",
    ],
    whatYouWillLearn: [
      "React routing",
      "CRUD endpoints",
      "Data modeling",
      "User-facing content rendering",
    ],
    requirements: [
      "Create a post form",
      "Store post data",
      "Display posts on the home page",
      "Allow viewing individual posts",
    ],
    suggestedSteps: [
      "Create the React pages",
      "Define post schema",
      "Build API endpoints",
      "Connect the UI to backend data",
      "Refine the layout",
    ],
    relatedLearning: ["React", "Node.js", "Express.js", "MongoDB"],
  },
  {
    id: "authentication-system",
    slug: "authentication-system",
    title: "Authentication System",
    category: "mern",
    description: "Create a complete auth flow with signup, login, and protected routes.",
    longDescription:
      "Design a secure authentication system for a MERN app with proper user registration, login, and protected pages.",
    difficulty: "intermediate",
    estimatedHours: 16,
    technologies: ["React", "Node.js", "Express.js", "MongoDB"],
    whatYouWillBuild: [
      "Sign-up and sign-in forms in React.",
      "Protected routes that require a valid user session.",
    ],
    whatYouWillLearn: [
      "JWT and session concepts",
      "Password handling",
      "Express middleware",
      "Authorization patterns",
    ],
    requirements: [
      "Create a signup form",
      "Create a login form",
      "Store user data securely",
      "Protect private routes",
    ],
    suggestedSteps: [
      "Set up the user model",
      "Build signup and login endpoints",
      "Handle password hashing",
      "Protect backend routes",
      "Add frontend redirect logic",
    ],
    relatedLearning: ["React", "Express.js", "Authentication", "MongoDB"],
  },
  {
    id: "expense-management-application",
    slug: "expense-management-application",
    title: "Expense Management Application",
    category: "mern",
    description: "Build a full-stack expense app for tracking incomes, expenses, and monthly totals.",
    longDescription:
      "Create a dashboard-style expense manager that lets users add transactions and view running balances from a server-backed database.",
    difficulty: "intermediate",
    estimatedHours: 15,
    technologies: ["React", "Node.js", "Express.js", "MongoDB"],
    whatYouWillBuild: [
      "An expense form and transaction table.",
      "Summary cards for totals and category breakdowns.",
    ],
    whatYouWillLearn: [
      "Data modeling",
      "CRUD API patterns",
      "Frontend state synchronization",
      "Summary calculations",
    ],
    requirements: [
      "Add income and expense entries",
      "Display current totals",
      "Fetch data from the API",
      "Store entries in MongoDB",
    ],
    suggestedSteps: [
      "Define the transaction schema",
      "Build the API routes",
      "Create the form and list UI",
      "Calculate totals and render summary cards",
      "Review the data flow",
    ],
    relatedLearning: ["React", "Express.js", "MongoDB", "API Design"],
  },
  {
    id: "notes-application",
    slug: "notes-application",
    title: "Notes Application",
    category: "mern",
    description: "Build a notes app that stores user notes in a MongoDB-backed API.",
    longDescription:
      "Create a lightweight notes application where users can create, edit, and delete notes through a connected backend.",
    difficulty: "intermediate",
    estimatedHours: 13,
    technologies: ["React", "Node.js", "Express.js", "MongoDB"],
    whatYouWillBuild: [
      "A note list and editor interface.",
      "A backend API for note CRUD operations.",
    ],
    whatYouWillLearn: [
      "Forms and validation",
      "REST design",
      "MongoDB document storage",
      "Frontend to backend flow",
    ],
    requirements: [
      "Create a note",
      "Edit a note",
      "Delete a note",
      "Display notes from the database",
    ],
    suggestedSteps: [
      "Define the note model",
      "Build CRUD routes",
      "Create the React editor",
      "Connect the UI to the API",
      "Test editing and delete flows",
    ],
    relatedLearning: ["React", "Express.js", "MongoDB", "Forms"],
  },
  {
    id: "ecommerce-application",
    slug: "ecommerce-application",
    title: "E-commerce Application",
    category: "mern",
    description: "Build a shopping experience with products, carts, and a full-stack data flow.",
    longDescription:
      "Create a simplified online store with a product catalog, cart, and backend routes for reading and updating product data.",
    difficulty: "intermediate",
    estimatedHours: 18,
    technologies: ["React", "Node.js", "Express.js", "MongoDB"],
    whatYouWillBuild: [
      "A storefront with products and pricing.",
      "A cart flow that updates total cost and item counts.",
    ],
    whatYouWillLearn: [
      "State management for shopping flows",
      "API design for product data",
      "CRUD operations",
      "Frontend and database synchronization",
    ],
    requirements: [
      "List products",
      "Add products to cart",
      "Update quantities",
      "Show the final total",
    ],
    suggestedSteps: [
      "Create the product schema",
      "Build the product API",
      "Render the storefront",
      "Implement cart logic",
      "Review the end-to-end flow",
    ],
    relatedLearning: ["React", "Express.js", "MongoDB", "State Management"],
  },
  {
    id: "learning-management-system",
    slug: "learning-management-system",
    title: "Learning Management System",
    category: "mern",
    description: "Build a course dashboard where learners can view lessons and track progress.",
    longDescription:
      "Develop a simplified learning platform with courses, modules, and user-stored progress data.",
    difficulty: "advanced",
    estimatedHours: 22,
    technologies: ["React", "Node.js", "Express.js", "MongoDB"],
    whatYouWillBuild: [
      "A structured course list and lesson detail views.",
      "Progress tracking for completed modules or lessons.",
    ],
    whatYouWillLearn: [
      "Nested data design",
      "Progress tracking logic",
      "User-centric page flows",
      "Backend data relationships",
    ],
    requirements: [
      "Show a list of courses",
      "Display lesson content",
      "Track completion states",
      "Create a clear learning flow",
    ],
    suggestedSteps: [
      "Design the content structure",
      "Build data models for courses and lessons",
      "Create the routes and screens",
      "Add progress tracking",
      "Test the flow end-to-end",
    ],
    relatedLearning: ["React", "Express.js", "MongoDB", "Data Modeling"],
  },
  {
    id: "real-time-chat-application",
    slug: "real-time-chat-application",
    title: "Real-time Chat Application",
    category: "mern",
    description: "Build a real-time messaging app using a full-stack model with persistent message storage.",
    longDescription:
      "Create an application where users can send and receive messages in real time while messages are stored and reloaded from the backend.",
    difficulty: "advanced",
    estimatedHours: 20,
    technologies: ["React", "Node.js", "Express.js", "MongoDB"],
    whatYouWillBuild: [
      "A chat room UI and message composer.",
      "Backend support for storing recent messages and updates.",
    ],
    whatYouWillLearn: [
      "Real-time communication ideas",
      "Event-driven patterns",
      "API and frontend synchronization",
      "Message data modeling",
    ],
    requirements: [
      "Send new messages",
      "Display conversation history",
      "Keep the interface responsive",
      "Store messages in a database",
    ],
    suggestedSteps: [
      "Design the chat UI",
      "Create the message schema",
      "Build server endpoints",
      "Display messages in the frontend",
      "Improve the message experience",
    ],
    relatedLearning: ["React", "Express.js", "MongoDB", "State Sync"],
  },
  {
    id: "job-board-application",
    slug: "job-board-application",
    title: "Job Board Application",
    category: "mern",
    description: "Build a job board where employers can list positions and learners can browse them.",
    longDescription:
      "Create a simplified job board with role listings, filters, and an admin-friendly backend for storing opportunities.",
    difficulty: "advanced",
    estimatedHours: 18,
    technologies: ["React", "Node.js", "Express.js", "MongoDB"],
    whatYouWillBuild: [
      "A searchable jobs listing page with cards and filters.",
      "A backend API for storing job opportunities.",
    ],
    whatYouWillLearn: [
      "Product filtering",
      "Data-driven UI rendering",
      "API organization",
      "Content enrichment patterns",
    ],
    requirements: [
      "List job opportunities",
      "Allow filtering by role or type",
      "Display relevant metadata",
      "Store listings in MongoDB",
    ],
    suggestedSteps: [
      "Define the job model",
      "Create the backend data flow",
      "Design the listing layout",
      "Add filters and sort actions",
      "Review the user flow",
    ],
    relatedLearning: ["React", "Express.js", "MongoDB", "Forms"],
  },
  {
    id: "full-stack-saas-application",
    slug: "full-stack-saas-application",
    title: "Full-stack SaaS Application",
    category: "mern",
    description: "Build a SaaS-style product with a dashboard, secure API, and persistent data model.",
    longDescription:
      "Create a full-stack product experience that demonstrates how a real SaaS application connects frontend features to backend APIs and a database.",
    difficulty: "advanced",
    estimatedHours: 24,
    technologies: ["React", "Node.js", "Express.js", "MongoDB"],
    whatYouWillBuild: [
      "A dashboard, feature list, and product workflow screen.",
      "Server-side endpoints for product data management.",
    ],
    whatYouWillLearn: [
      "Architecture for full-stack products",
      "Database-backed features",
      "System design thinking",
      "Product and data cohesion",
    ],
    requirements: [
      "Model a product or service domain",
      "Create a dashboard layout",
      "Connect frontend actions to backend routes",
      "Store application data in MongoDB",
    ],
    suggestedSteps: [
      "Define the product domain",
      "Create backend resources",
      "Design the dashboard UI",
      "Connect the frontend to API data",
      "Refine workflows and polish",
    ],
    relatedLearning: ["React", "Express.js", "MongoDB", "System Design"],
  },
];

type ProjectTranslation = Pick<
  Project,
  | "title"
  | "description"
  | "longDescription"
  | "whatYouWillBuild"
  | "whatYouWillLearn"
  | "requirements"
  | "suggestedSteps"
  | "relatedLearning"
>;

const projectTranslations: Record<
  string,
  Partial<Record<Exclude<Language, "en">, ProjectTranslation>>
> = {
  "personal-portfolio-website": {
    so: {
      title: "Website Portfolio Shakhsiyeed",
      description: "Samee portfolio aad ku soo bandhigto shaqadaada, xirfadahaaga, iyo sida lagula soo xiriiri karo.",
      longDescription:
        "Dhis portfolio nadiif ah oo kaa caawinaya inaad isbarato, soo bandhigto shaqadaada, una fududayso shaqo-bixiyeyaasha ama macaamiisha inay kula soo xiriiraan.",
      whatYouWillBuild: [
        "Portfolio hal bog ah oo leh qayb hordhac ah, xog kooban, kaararka mashaariicda, iyo faahfaahinta xiriirka.",
        "Qaab bogga si fiican uga shaqeeya kombiyuutar, tablet, iyo telefoon.",
      ],
      whatYouWillLearn: [
        "Qaab-dhismeedka HTML ee macnaha leh",
        "Habaynta CSS iyo naqshad ku habboon cabbirro kala duwan",
        "Isdhexgalka JavaScript",
        "Navigation iyo naqshad ku habboon telefoonka",
      ],
      requirements: [
        "Ku dar qayb hordhac ah oo leh magacaaga iyo warbixin kooban.",
        "Soo bandhig xirfadahaaga iyo mashaariicda aad dooratay.",
        "Ku dar qayb xiriir oo shaqaynaysa.",
        "Hubi in boggu la qabsado cabbirrada shaashadaha kala duwan.",
      ],
      suggestedSteps: [
        "Samee qaab-dhismeedka HTML.",
        "Hagaaji muuqaalka iyo qoraalka.",
        "Ku dar falal JavaScript oo fudud.",
        "Tijaabi la-qabsiga shaashadaha iyo accessibility.",
        "Ugu dambayn hagaaji faahfaahinta muuqaalka.",
      ],
      relatedLearning: ["HTML", "CSS", "Naqshad la qabsata shaashadaha", "Aasaaska JavaScript"],
    },
    ar: {
      title: "موقع معرض الأعمال الشخصي",
      description: "أنشئ معرضاً شخصياً لعرض أعمالك ومهاراتك ومعلومات التواصل معك.",
      longDescription:
        "أنشئ معرض أعمال بسيطاً يساعدك على التعريف بنفسك وعرض مشاريعك، ويسهّل على أصحاب العمل أو العملاء التواصل معك.",
      whatYouWillBuild: [
        "معرضاً من صفحة واحدة يضم مقدمة ونبذة عنك وبطاقات للمشاريع ومعلومات التواصل.",
        "تصميماً متجاوباً يعمل على الحاسوب والجهاز اللوحي والهاتف.",
      ],
      whatYouWillLearn: [
        "بنية HTML الدلالية",
        "تنسيق CSS والتصميم المتجاوب",
        "التفاعل باستخدام JavaScript",
        "التنقل وتصميم يناسب الهاتف",
      ],
      requirements: [
        "أضف مقدمة تتضمن اسمك ونبذة قصيرة عنك.",
        "اعرض مهاراتك والمشاريع التي اخترتها.",
        "أضف قسماً فعالاً للتواصل.",
        "تأكد من ملاءمة الصفحة لمقاسات الشاشات المختلفة.",
      ],
      suggestedSteps: [
        "أنشئ بنية HTML.",
        "نسّق التخطيط والنصوص.",
        "أضف تفاعلات بسيطة باستخدام JavaScript.",
        "اختبر التصميم المتجاوب وإمكانية الوصول.",
        "حسّن التفاصيل البصرية.",
      ],
      relatedLearning: ["HTML", "CSS", "التصميم المتجاوب", "أساسيات JavaScript"],
    },
  },
};

export function getLocalizedProject(project: Project, language: Language): Project {
  if (language === "en") return project;
  const translation = projectTranslations[project.id]?.[language];
  return translation ? { ...project, ...translation } : project;
}

export const PROJECTS_BY_CATEGORY: Record<ProjectCategory, Project[]> = {
  "html-css-js": PROJECTS.filter((project) => project.category === "html-css-js"),
  mern: PROJECTS.filter((project) => project.category === "mern"),
};

export const PROJECTS_BY_ID = Object.fromEntries(PROJECTS.map((project) => [project.id, project])) as Record<string, Project>;
export const PROJECTS_BY_SLUG = Object.fromEntries(PROJECTS.map((project) => [project.slug, project])) as Record<string, Project>;

export function getProjectBySlug(slug: string | undefined | null): Project | undefined {
  if (!slug) return undefined;
  return PROJECTS_BY_SLUG[slug];
}

export function getProjectCountByCategory(category: ProjectCategory): number {
  return PROJECTS_BY_CATEGORY[category].length;
}
