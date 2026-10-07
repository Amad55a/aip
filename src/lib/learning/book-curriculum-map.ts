export type BookLesson = {
  slug: string;
  title: string;
  source: string;
  kind?: "lesson" | "project" | "quiz";
};

export type BookModule = {
  slug: string;
  title: string;
  source: string;
  lessons: BookLesson[];
};

export const bookCurriculumMap: BookModule[] = [
  {
    slug: "html-basics",
    title: "HTML Basics",
    source: "Complete Web Development Handbook — Introduction to HTML + foundational HTML topics",
    lessons: [
      { slug: "what-is-html", title: "What is HTML?", source: "Introduction to HTML", kind: "lesson" },
      { slug: "how-the-web-works", title: "How the web works: browsers, servers, and HTTP", source: "Web basics and browser/server communication", kind: "lesson" },
      { slug: "html-document-structure", title: "HTML document structure", source: "Basic HTML structure", kind: "lesson" },
      { slug: "doctype-declaration", title: "The DOCTYPE declaration", source: "DOCTYPE and HTML5 basics", kind: "lesson" },
      { slug: "html-head-body", title: "The html, head, and body elements", source: "Basic HTML structure", kind: "lesson" },
      { slug: "headings-outline", title: "Headings and document outline", source: "Headings and paragraphs", kind: "lesson" },
      { slug: "paragraphs-line-breaks", title: "Paragraphs and line breaks", source: "Headings and paragraphs", kind: "lesson" },
      { slug: "text-formatting", title: "Text formatting and emphasis", source: "Formatting text in HTML", kind: "lesson" },
      { slug: "html-comments", title: "HTML comments", source: "Comments and code readability", kind: "lesson" },
      { slug: "attributes", title: "Attributes and global attributes", source: "Attributes and HTML syntax", kind: "lesson" },
      { slug: "links-anchor-elements", title: "Links and anchor elements", source: "Creating links in HTML", kind: "lesson" },
      { slug: "urls-paths-fragments", title: "URLs, paths, and fragments", source: "Links, paths, and navigation", kind: "lesson" },
      { slug: "images-alt-text", title: "Images and alternative text", source: "Adding images and alt text", kind: "lesson" },
      { slug: "lists", title: "Ordered, unordered, and description lists", source: "Lists and navigation", kind: "lesson" },
      { slug: "semantic-profile-page", title: "Build a semantic profile page", source: "Practice project from the handbook", kind: "project" },
      { slug: "html-basics-knowledge-check", title: "HTML basics knowledge check", source: "HTML foundations quiz", kind: "quiz" },
    ],
  },
  {
    slug: "html-structure-and-forms",
    title: "HTML Structure and Forms",
    source: "Complete Web Development Handbook — semantic structure + forms",
    lessons: [
      { slug: "div-span", title: "Generic containers: div and span", source: "Inline vs block elements and containers", kind: "lesson" },
      { slug: "semantic-html-landmarks", title: "Semantic HTML and landmark regions", source: "Semantic HTML sectioning elements", kind: "lesson" },
      { slug: "header-element", title: "The header element", source: "Semantic sectioning", kind: "lesson" },
      { slug: "nav-element", title: "The nav element", source: "Navigation structure", kind: "lesson" },
      { slug: "main-element", title: "The main element", source: "Main content landmark", kind: "lesson" },
      { slug: "section-element", title: "Sectioning content with section", source: "Semantic HTML layout sections", kind: "lesson" },
      { slug: "article-element", title: "Articles and self-contained content", source: "Articles and content grouping", kind: "lesson" },
      { slug: "aside-element", title: "Complementary content with aside", source: "Sidebar and related content", kind: "lesson" },
      { slug: "footer-element", title: "The footer element", source: "Footer structure", kind: "lesson" },
      { slug: "figures-captions", title: "Figures and figcaptions", source: "Embedded media and captions", kind: "lesson" },
      { slug: "form-fundamentals", title: "Form fundamentals and the form element", source: "Forms and input data", kind: "lesson" },
      { slug: "input-types", title: "Input types and name values", source: "Text inputs, radio, checkbox, file, and form data", kind: "lesson" },
      { slug: "labels-accessible-controls", title: "Labels and accessible form controls", source: "Labels, fieldsets, and accessibility", kind: "lesson" },
      { slug: "buttons", title: "Buttons and button types", source: "Buttons and form actions", kind: "lesson" },
      { slug: "textarea", title: "Multiline input with textarea", source: "Textarea and multiline input", kind: "lesson" },
      { slug: "select-menu", title: "Select menus and option groups", source: "Dropdown lists and selections", kind: "lesson" },
      { slug: "checkbox-radio", title: "Checkboxes and radio groups", source: "Choice controls", kind: "lesson" },
      { slug: "file-inputs", title: "File inputs and upload attributes", source: "Upload input and form details", kind: "lesson" },
      { slug: "constraint-validation", title: "Native constraint validation", source: "HTML form validation", kind: "lesson" },
      { slug: "fieldset-legend", title: "Grouping controls with fieldset and legend", source: "Grouping and labeling form sets", kind: "lesson" },
    ],
  },
  {
    slug: "html-advanced",
    title: "Advanced HTML",
    source: "Complete Web Development Handbook — advanced HTML and browser-native content",
    lessons: [
      { slug: "tables", title: "Data tables and table structure", source: "Creating tables", kind: "lesson" },
      { slug: "accessible-tables", title: "Accessible tables: captions, headers, and scope", source: "Accessible tables", kind: "lesson" },
      { slug: "iframe-embedding", title: "Embedding content with iframe", source: "Embedding websites and content", kind: "lesson" },
      { slug: "audio-elements", title: "Audio elements and media controls", source: "Embedding audio", kind: "lesson" },
      { slug: "video-elements", title: "Video elements and captions", source: "Embedding video", kind: "lesson" },
      { slug: "svg-fundamentals", title: "SVG fundamentals for scalable graphics", source: "Scalable graphics and browser-native vector content", kind: "lesson" },
      { slug: "canvas-drawing", title: "Canvas drawing basics", source: "Canvas graphics and drawing primitives", kind: "lesson" },
      { slug: "meta-and-head", title: "Metadata and the head element", source: "Meta tags and document metadata", kind: "lesson" },
      { slug: "seo-fundamentals", title: "SEO fundamentals for document markup", source: "SEO basics and page metadata", kind: "lesson" },
      { slug: "open-graph", title: "Open Graph and social sharing metadata", source: "Social metadata and previews", kind: "lesson" },
      { slug: "accessibility-fundamentals", title: "Accessibility fundamentals and keyboard navigation", source: "Accessibility basics and keyboard interaction", kind: "lesson" },
      { slug: "aria", title: "ARIA roles, states, and authoring practices", source: "ARIA and accessible authoring", kind: "lesson" },
      { slug: "details-dialog", title: "Native interactive elements: details and dialog", source: "Native disclosure and dialog patterns", kind: "lesson" },
      { slug: "html-validation", title: "HTML validation and browser parsing", source: "Validation and browser behavior", kind: "lesson" },
      { slug: "progressive-enhancement", title: "Progressive enhancement and HTML best practices", source: "Robust HTML and progressive enhancement", kind: "lesson" },
    ],
  },
  {
    slug: "css-foundations",
    title: "CSS Foundations",
    source: "Complete Web Development Handbook — CSS basics, selectors, and the box model",
    lessons: [
      { slug: "what-css-does", title: "What CSS does and how stylesheets are applied", source: "How CSS works with HTML", kind: "lesson" },
      { slug: "style-application", title: "Connecting external, embedded, and inline styles", source: "CSS application methods", kind: "lesson" },
      { slug: "css-rules", title: "CSS rules, declarations, and comments", source: "CSS syntax and structure", kind: "lesson" },
      { slug: "selectors", title: "Type, class, ID, and attribute selectors", source: "Selectors and CSS targets", kind: "lesson" },
      { slug: "selectors-combinators", title: "Combinators and selector lists", source: "Selector combination patterns", kind: "lesson" },
      { slug: "cascade-specificity", title: "The cascade, specificity, and inheritance", source: "CSS cascade and inheritance", kind: "lesson" },
      { slug: "colors", title: "Colors, opacity, and color formats", source: "Color systems and CSS colors", kind: "lesson" },
      { slug: "length-units", title: "Length units: px, rem, em, %, vw, and vh", source: "CSS units", kind: "lesson" },
      { slug: "box-model", title: "The box model and box-sizing", source: "Box model and sizing", kind: "lesson" },
      { slug: "margin-padding-border", title: "Margins, padding, and borders", source: "Spacing and borders", kind: "lesson" },
      { slug: "typography", title: "Typography, font stacks, and web fonts", source: "Type and typography", kind: "lesson" },
      { slug: "backgrounds", title: "Backgrounds, gradients, and image sizing", source: "Backgrounds and textures", kind: "lesson" },
      { slug: "display-values", title: "Display values and normal flow", source: "Display and layout flow", kind: "lesson" },
      { slug: "responsive-thinking", title: "Basic responsive thinking", source: "Responsive design foundations", kind: "lesson" },
      { slug: "styled-profile-card", title: "Build a styled profile card", source: "Practice project from the handbook", kind: "project" },
      { slug: "css-foundations-knowledge-check", title: "CSS foundations knowledge check", source: "CSS foundations quiz", kind: "quiz" },
    ],
  },
  {
    slug: "javascript-foundations",
    title: "JavaScript Foundations",
    source: "Complete Web Development Handbook — JavaScript fundamentals and core language behavior",
    lessons: [
      { slug: "javascript-browser-server", title: "JavaScript in the browser and on the server", source: "JavaScript runtime overview", kind: "lesson" },
      { slug: "script-tags", title: "Adding scripts and module scripts to HTML", source: "Script loading and modules", kind: "lesson" },
      { slug: "values-variables", title: "Values, variables, and const versus let", source: "Variables and declarations", kind: "lesson" },
      { slug: "primitive-types", title: "Primitive types and type conversion", source: "JavaScript values and conversion", kind: "lesson" },
      { slug: "operators", title: "Operators and expressions", source: "Operators and expressions", kind: "lesson" },
      { slug: "strings", title: "Strings, templates, and useful string methods", source: "Strings and templates", kind: "lesson" },
      { slug: "numbers-bigint", title: "Numbers, BigInt, and numeric pitfalls", source: "Numbers and numeric behavior", kind: "lesson" },
      { slug: "booleans-nullish", title: "Booleans, truthiness, and nullish values", source: "Booleans and equality rules", kind: "lesson" },
      { slug: "arrays", title: "Arrays and common array methods", source: "Working with arrays", kind: "lesson" },
      { slug: "objects", title: "Objects, properties, and destructuring", source: "Objects and object destructuring", kind: "lesson" },
      { slug: "conditionals", title: "Conditionals and switch statements", source: "Branching logic", kind: "lesson" },
      { slug: "loops", title: "Loops and iteration", source: "Looping patterns", kind: "lesson" },
      { slug: "functions", title: "Functions, parameters, and return values", source: "Functions and return values", kind: "lesson" },
      { slug: "scope", title: "Scope and lexical environments", source: "Scope and closures", kind: "lesson" },
      { slug: "errors-debugging", title: "Errors, exceptions, and debugging basics", source: "Errors and debugging", kind: "lesson" },
      { slug: "json", title: "Reading and writing JSON", source: "JSON workflows", kind: "lesson" },
      { slug: "number-game-project", title: "Build a command-line number game", source: "Practice project from the handbook", kind: "project" },
      { slug: "javascript-fundamentals-knowledge-check", title: "JavaScript fundamentals knowledge check", source: "JavaScript foundations quiz", kind: "quiz" },
    ],
  },
];

export const bookTopicOrder = bookCurriculumMap.flatMap((module) =>
  module.lessons.map((lesson) => ({
    moduleSlug: module.slug,
    moduleTitle: module.title,
    lessonSlug: lesson.slug,
    lessonTitle: lesson.title,
    kind: lesson.kind ?? "lesson",
  }))
);
