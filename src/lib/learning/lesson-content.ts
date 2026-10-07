import type { LessonQuizQuestion } from "@/lib/supabase/database.types";

export type LessonCodeExample = {
  title: string;
  language: string;
  code: string;
  explanation: string;
};

export type LessonTerm = {
  term: string;
  definition: string;
  example?: string;
};

export type LessonPhaseSection = {
  id: "learn" | "see" | "practice";
  title: string;
  summary: string;
  content: string;
  code?: string;
  language?: string;
  tasks?: string[];
  audio_url?: string | null;
  audio_path?: string | null;
  audio_language?: "so" | null;
};

export type LessonMaterial = {
  introduction: string;
  explanation: string;
  example: string;
  codeExample: LessonCodeExample;
  terminology: LessonTerm[];
  phaseSections: LessonPhaseSection[];
  useCases: string[];
  mistakes: string[];
  tips: string[];
  practice: string[];
  quiz: LessonQuizQuestion[];
  audioUrl?: string | null;
  audioPath?: string | null;
  audioLanguage?: "so" | null;
};

export type LessonStudyMaterial = Omit<LessonMaterial, "quiz">;

type CourseProfile = {
  name: string;
  foundation: string;
  workflow: string;
  principle: string;
  useCases: string[];
  mistakes: string[];
  tips: string[];
};

const profiles: Record<string, CourseProfile> = {
  html: {
    name: "HTML",
    foundation: "HTML describes the meaning and structure of a document. Elements form a tree that browsers expose as the DOM; semantic elements communicate purpose to assistive technology and other tools.",
    workflow: "Start with the content and its relationships, choose the element whose meaning matches each part, then verify the resulting outline and keyboard behavior in the browser.",
    principle: "Choose elements for their meaning, not for their default appearance.",
    useCases: ["Building accessible page structure and navigation", "Collecting user input with native forms", "Describing images, media, and data with useful alternatives"],
    mistakes: ["Using elements only because their default style looks convenient", "Skipping labels or meaningful alternative text", "Using heading levels to control font size instead of document structure"],
    tips: ["Validate markup and inspect the accessibility tree", "Keep one clear main landmark and use links for navigation, buttons for actions", "Use native browser behavior before adding custom JavaScript"],
  },
  css: {
    name: "CSS",
    foundation: "CSS matches selectors to elements and applies declarations through the cascade. Layout is governed by containing blocks, intrinsic sizing, and the formatting context—not by isolated pixel positions.",
    workflow: "Inspect the target element and its ancestors, identify the winning rule and layout context, make the smallest responsive change, then test narrow and wide viewports.",
    principle: "Understand the cascade and layout context before adding another override.",
    useCases: ["Creating reusable visual systems with custom properties", "Composing responsive page and component layouts", "Improving readable typography, focus states, and motion preferences"],
    mistakes: ["Increasing specificity to hide a cascade conflict", "Using fixed dimensions where content must grow", "Ignoring keyboard focus, reduced motion, or small screens"],
    tips: ["Prefer Grid for two-dimensional placement and Flexbox for one-dimensional alignment", "Use rem and fluid constraints for resilient sizing", "Use browser devtools to inspect computed styles and box geometry"],
  },
  javascript: {
    name: "JavaScript",
    foundation: "JavaScript evaluates values and expressions in an execution context. Functions, objects, and the event loop are the building blocks for browser and server behavior.",
    workflow: "Define the input and expected output, keep transformations explicit, handle invalid and asynchronous outcomes, and verify behavior with focused tests.",
    principle: "Make data flow and side effects explicit so the program is predictable.",
    useCases: ["Transforming and validating application data", "Responding to browser events and user input", "Coordinating network requests and other asynchronous work"],
    mistakes: ["Confusing assignment with comparison or relying on implicit coercion", "Mutating shared state unexpectedly", "Ignoring rejected promises and edge cases"],
    tips: ["Prefer const unless a binding must be reassigned", "Use strict equality and validate external data at boundaries", "Separate pure transformations from I/O and other side effects"],
  },
  "git-github": {
    name: "Git and GitHub",
    foundation: "Git records snapshots of a project as commits. Branches are lightweight references that let work evolve independently; remotes exchange commits rather than replacing a working directory.",
    workflow: "Inspect the working tree, stage only the intended changes, review the staged diff, commit a meaningful snapshot, and synchronize branches deliberately.",
    principle: "Review exactly what is staged before creating or sharing a commit.",
    useCases: ["Reviewing and collaborating on changes through pull requests", "Isolating features and experiments in branches", "Recovering or tracing changes with history and diffs"],
    mistakes: ["Committing generated files, secrets, or unrelated changes", "Treating a merge conflict as something to resolve by blindly choosing one side", "Assuming a successful push means a change has been reviewed or deployed"],
    tips: ["Use small commits with focused intent", "Read conflict markers and compare both histories before resolving", "Keep credentials out of tracked files and rotate any accidentally exposed secret"],
  },
  react: {
    name: "React",
    foundation: "React renders a UI from component inputs and state. A render describes the next interface; state updates schedule another render rather than changing the existing output in place.",
    workflow: "Break the interface into components, identify the minimal state, pass data through props, and derive values rather than synchronizing duplicate state.",
    principle: "Treat rendering as a pure description of UI for the current props and state.",
    useCases: ["Building reusable interactive interfaces", "Managing local and shared UI state", "Rendering lists and conditional views from application data"],
    mistakes: ["Mutating state objects or arrays directly", "Adding effects for values that can be calculated during render", "Using unstable list keys or placing state too high in the tree"],
    tips: ["Keep state close to the components that need it", "Use effects to synchronize with external systems, not to mirror props", "Use semantic HTML and preserve keyboard interaction in custom controls"],
  },
  nextjs: {
    name: "Next.js",
    foundation: "Next.js layers routing, rendering, data access, and delivery on React. A route can render on the server or client, so choosing the correct boundary affects security, performance, and user experience.",
    workflow: "Identify the route and data requirements, fetch private data on the server, keep client components focused on interaction, and verify loading, error, and not-found states.",
    principle: "Keep server-only data and secrets on the server; add a client boundary only for browser interaction.",
    useCases: ["Rendering indexable pages with server data", "Building interactive routes with client components", "Creating server endpoints and handling route-level loading or errors"],
    mistakes: ["Sending secrets or privileged data into client bundles", "Adding client directives to whole route trees unnecessarily", "Assuming navigation, caching, and rendering behave exactly like a plain client-only SPA"],
    tips: ["Use the App Router conventions consistently", "Validate route parameters and authorization at the data boundary", "Test production builds because development rendering can mask caching issues"],
  },
  "tailwind-css": {
    name: "Tailwind CSS",
    foundation: "Tailwind utility classes map directly to CSS declarations. Responsive and state variants apply utilities under explicit conditions, while design tokens keep spacing, color, and typography consistent.",
    workflow: "Compose utilities around the component's semantic structure, apply mobile-first constraints, extract repeated patterns only when they form a stable component, and check contrast and focus states.",
    principle: "Use utilities to express intentional design decisions, not as a substitute for accessible structure.",
    useCases: ["Styling component states and responsive layouts", "Applying a shared design scale across pages", "Building consistent interactive controls without a large custom stylesheet"],
    mistakes: ["Constructing class names dynamically in ways the compiler cannot detect", "Repeating conflicting utilities and expecting an arbitrary winner", "Removing focus styles or using color alone to communicate state"],
    tips: ["Prefer complete statically detectable class names", "Use responsive variants mobile-first", "Extract reusable components when markup and behavior repeat together"],
  },
  nodejs: {
    name: "Node.js",
    foundation: "Node.js runs JavaScript outside the browser and provides APIs for files, processes, networking, and streams. Its event loop makes I/O concurrency practical, but CPU-heavy synchronous work still blocks the process.",
    workflow: "Separate application logic from runtime I/O, validate configuration at startup, use asynchronous APIs for I/O, and handle process failures and shutdown explicitly.",
    principle: "Avoid blocking the event loop and make runtime boundaries observable and testable.",
    useCases: ["Building command-line tools and web services", "Reading files and coordinating network I/O", "Streaming large inputs without loading everything into memory"],
    mistakes: ["Blocking the event loop with expensive synchronous work", "Assuming browser globals or APIs exist in Node", "Swallowing errors or exposing environment secrets in logs"],
    tips: ["Use supported Node APIs and package versions intentionally", "Handle rejected promises and graceful shutdown", "Use streams and backpressure for large data"],
  },
  expressjs: {
    name: "Express.js",
    foundation: "Express processes each request through an ordered middleware and route pipeline. Middleware can inspect or change the request and response, pass control onward, or end the response.",
    workflow: "Parse and validate input, authenticate and authorize before sensitive work, call the service or data layer, and translate failures into consistent HTTP responses.",
    principle: "Every request path must either send one response or pass control to the next handler.",
    useCases: ["Designing REST endpoints", "Applying authentication, logging, and validation middleware", "Centralizing error handling and API response conventions"],
    mistakes: ["Registering routes or parsers in the wrong order", "Trusting request bodies without validation or authorization", "Calling next after a response has already been sent"],
    tips: ["Keep route handlers thin and move domain logic into services", "Use explicit status codes and consistent error shapes", "Test both successful and failure paths"],
  },
  mongodb: {
    name: "MongoDB",
    foundation: "MongoDB stores BSON documents in collections. Document shape should follow access patterns: embed data that is read and updated together, and reference data with independent growth or ownership.",
    workflow: "Model the read and write patterns first, validate document shape, add indexes for measured queries, and examine query plans as data volume grows.",
    principle: "Design documents around the application's access patterns and consistency requirements.",
    useCases: ["Storing flexible records with related embedded values", "Querying and aggregating document collections", "Scaling reads with carefully selected indexes"],
    mistakes: ["Embedding unbounded arrays that grow without limit", "Adding indexes without considering write cost", "Treating schema flexibility as a reason to skip validation"],
    tips: ["Use projections to return only needed fields", "Make update operations atomic where possible", "Use explain plans and realistic data to evaluate performance"],
  },
  postgresql: {
    name: "PostgreSQL",
    foundation: "PostgreSQL stores relational data in tables governed by types and constraints. SQL queries declare the result they need; indexes and query plans determine how the database retrieves it.",
    workflow: "Model entities and constraints, write parameterized queries, use transactions for related changes, and inspect execution plans before optimizing.",
    principle: "Let constraints protect data integrity and parameterize all values supplied by users.",
    useCases: ["Representing related entities with foreign keys", "Querying and aggregating structured data", "Maintaining consistent multi-step changes with transactions"],
    mistakes: ["Building SQL by concatenating untrusted values", "Skipping constraints and relying only on application checks", "Adding indexes without measuring query plans and write impact"],
    tips: ["Choose types and constraints deliberately", "Use EXPLAIN ANALYZE with representative data", "Keep transactions short and handle rollback paths"],
  },
  "system-design": {
    name: "System Design",
    foundation: "System design translates user and operational requirements into components, data flows, and explicit trade-offs. Capacity, consistency, availability, latency, and operational complexity must be reasoned about together.",
    workflow: "Clarify requirements and constraints, estimate load, define APIs and data ownership, identify bottlenecks and failure modes, then compare the simplest viable architecture with alternatives.",
    principle: "Make requirements and trade-offs explicit before selecting technologies.",
    useCases: ["Planning services that must handle growth", "Analyzing reliability and failure recovery", "Choosing between consistency, latency, cost, and operational complexity"],
    mistakes: ["Choosing a distributed architecture before measuring requirements", "Ignoring data ownership and failure behavior", "Presenting capacity estimates without stating assumptions"],
    tips: ["Start with a readable request and data-flow diagram", "State assumptions and revisit them when requirements change", "Design observability and recovery alongside the happy path"],
  },
  "web-security": {
    name: "Web Security",
    foundation: "Web security reduces risk by identifying trust boundaries, validating inputs, enforcing authorization, and using browser and protocol defenses. Security controls must be applied at the boundary where the threat occurs.",
    workflow: "Identify assets and attacker-controlled inputs, map trust boundaries, apply least privilege and context-appropriate defenses, then test both expected and adversarial cases.",
    principle: "Treat all external input as untrusted and enforce authorization on the server for every protected operation.",
    useCases: ["Preventing injection and cross-site scripting", "Protecting sessions and user data", "Hardening transport, headers, and access-control policies"],
    mistakes: ["Relying on client-side checks for authorization", "Escaping output for the wrong context", "Storing credentials or sensitive tokens in unsafe locations"],
    tips: ["Use framework protections and keep dependencies patched", "Prefer allowlists and parameterized data access", "Log security-relevant events without exposing secrets or personal data"],
  },
  devops: {
    name: "DevOps",
    foundation: "DevOps connects source changes to reproducible builds, tests, deployment, and feedback. Automation reduces manual variation; observability and rollback limit the impact of failures.",
    workflow: "Build the same artifact once, validate it with automated checks, deploy through controlled stages, monitor health, and keep a tested rollback path.",
    principle: "Make delivery repeatable, observable, and recoverable rather than relying on manual steps.",
    useCases: ["Automating build and test pipelines", "Deploying services consistently across environments", "Monitoring health and restoring service after failure"],
    mistakes: ["Putting secrets in source control or build logs", "Deploying without health checks or rollback", "Treating a green pipeline as proof that production is healthy"],
    tips: ["Keep environment configuration separate from artifacts", "Use least-privilege identities for automation", "Practice rollbacks and incident response before an outage"],
  },
  "ai-for-web-developers": {
    name: "AI for Web Developers",
    foundation: "An AI application sends structured input to a model and receives a probabilistic output. Reliable products add task-specific instructions, bounded context, validation, safety controls, and evaluation around that model call.",
    workflow: "Define the task and success criteria, provide only relevant context, call the model from a protected server boundary, validate the response, and evaluate quality on representative cases.",
    principle: "Treat model output as untrusted data: validate it before using it for actions or displaying it as trusted content.",
    useCases: ["Adding natural-language help to a web product", "Summarizing or classifying user-provided content", "Grounding answers in trusted application data"],
    mistakes: ["Exposing API keys in browser code", "Assuming generated output is factual or valid JSON", "Sending private data without a clear purpose or retention policy"],
    tips: ["Set output limits and timeouts", "Use retrieval or application data for grounding when freshness matters", "Measure quality, latency, and cost with realistic prompts"],
  },
};

const courseTopicRules: Record<string, [RegExp, string][]> = {
  html: [
    [/what is html|how the web works|doctype|document structure|html, head|paragraph|line break|comment|attribute/i, "An HTML document begins with `<!doctype html>`, then the `html` root contains metadata in `head` and visible document content in `body`. Elements describe content; attributes add element-specific values. Browsers parse this source into a DOM, and comments are not displayed as page content."],
    [/heading|outline|text formatting|emphasis/i, "Headings communicate a nested document outline; use them in a meaningful order rather than choosing a level for its default font size. Use `strong` and `em` when the content is important or emphasized, not just to get bold or italic styling."],
    [/link|anchor|url|path|fragment/i, "An anchor with `href` creates navigation. Relative URLs resolve against the current document, absolute URLs identify a full address, and a fragment such as `#details` targets an element whose `id` is `details`. Use link text that explains its destination."],
    [/image|alternative text/i, "The `img` element needs alternative text that conveys the information an informative image adds. Use `alt=\"\"` for decorative images; do not copy the filename or repeat a nearby caption without a reason."],
    [/list|ordered|unordered|description/i, "Use `ul` when order is irrelevant, `ol` when sequence matters, and `dl` for term–description pairs. Keep each `li` within its list and use lists to represent relationships rather than merely to indent text."],
    [/header element|nav element|main element|section|article|aside|footer|semantic|landmark/i, "Semantic regions such as `header`, `nav`, `main`, `article`, `aside`, and `footer` expose a page's structure to browsers and assistive technology. Use `section` for a thematic grouping with a heading; use `div` only when no semantic element fits."],
    [/form|input|label|button|textarea|select|checkbox|radio|file input|fieldset|validation/i, "Native forms associate a submitted control with a `name`; a visible `label` should target the control's `id`. Choose the correct input type, group related controls with `fieldset` and `legend`, and use native constraints as helpful client feedback while validating again on the server."],
    [/table|caption|scope/i, "Use a table for data with row and column relationships, not for page layout. A `caption` names the table, and `th` cells with appropriate `scope` identify the headers that describe each data cell."],
    [/iframe|audio|video|caption|svg|canvas/i, "Embedded and media content needs a meaningful title or accessible alternative. Video captions provide synchronized text, SVG is appropriate for scalable vector graphics, and canvas drawing needs a text or DOM alternative for users who cannot perceive the bitmap."],
    [/metadata|head element|seo|open graph/i, "Document metadata belongs in `head`: set a useful title, character encoding, viewport, and description. Social preview metadata such as Open Graph complements rather than replaces clear page content and canonical metadata."],
    [/details|dialog|interactive|progressive enhancement|html best practices/i, "Prefer browser-native interactive elements when their behavior matches the need. Progressive enhancement starts with meaningful, usable HTML and adds CSS or JavaScript without making essential content depend on optional behavior."],
  ],
  css: [
    [/what css|stylesheet|external|embedded|inline|rules|declarations|comments/i, "A CSS rule combines a selector with declarations. External stylesheets are reusable and cacheable; embedded styles are local to a document, while inline styles have high precedence and are difficult to maintain."],
    [/selector|combinator|specificity|cascade|inheritance|layer/i, "The cascade resolves applicable declarations by origin, importance, layer, specificity, and source order. Prefer understandable selectors and intentional layers rather than escalating specificity to defeat another rule."],
    [/color|opacity|length unit|px|rem|em|vw|vh|margin|padding|border|box model|box-sizing/i, "CSS sizes are interpreted through the box model and the containing context. `box-sizing: border-box` includes padding and border in the declared size; relative units such as `rem`, `%`, and viewport units adapt to user settings and available space."],
    [/typography|font|background|gradient|image sizing|display|normal flow/i, "Text and backgrounds should remain readable when content, font metrics, and viewport dimensions change. Normal flow is the resilient default; choose display modes to express a real layout relationship."],
    [/position|stacking|z-index/i, "Positioning changes how an element participates in layout and which containing block it uses. A stacking context isolates its descendants; a large `z-index` cannot escape an ancestor stacking context."],
    [/flexbox|flex item|grid|track|placement|subgrid|intrinsic|auto-placement/i, "Flexbox distributes items along one main axis; Grid defines rows and columns for two-dimensional placement. Intrinsic sizing and `minmax()` let tracks respond to their content instead of overflowing fixed dimensions."],
    [/responsive|mobile-first|media quer|breakpoint|container quer|fluid|clamp/i, "Responsive CSS adapts to available space and user preferences. Start with a usable narrow layout, add breakpoints when the content needs them, and use container queries when a component depends on its own available width."],
    [/pseudo-class|pseudo-element|focus|reduced motion/i, "Pseudo-classes describe a state such as `:focus-visible`; pseudo-elements style a generated part such as `::before`. Preserve visible keyboard focus and respect `prefers-reduced-motion` for animated effects."],
    [/transition|transform|animation|keyframe|scroll-driven|composit/i, "Use transitions and keyframes to communicate a state change, not to hide important information. Animate a small set of properties, avoid layout-heavy motion when possible, and provide a reduced-motion alternative."],
    [/custom propert|design token|theme|dark mode|color-scheme/i, "Custom properties centralize design decisions such as spacing and color. Define tokens at a deliberate scope, keep theme contrast accessible, and use `color-scheme` to coordinate native controls with the active theme."],
    [/performance|rendering|debug|computed style|cross-browser|feature quer|architecture|naming|module|nesting/i, "Debug styles by inspecting the computed declaration and layout box in the browser. Keep architecture predictable, check feature support when required, and profile before optimizing rendering."],
  ],
  javascript: [
    [/script|browser|server|module script/i, "A browser script runs in the page's JavaScript environment; a module script has module scope and supports imports. Defer work until the document or required elements are available rather than querying an unfinished page."],
    [/primitive|type conversion|operator|expression|number|bigint|boolean|truthiness|nullish/i, "JavaScript values have distinct primitive and object types. Prefer explicit conversions and strict comparisons; use `??` when only `null` or `undefined` should trigger a default, unlike `||`, which also treats `0` and an empty string as absent."],
    [/string|template/i, "Strings are immutable sequences of text. Template literals interpolate expressions, while methods such as `trim`, `includes`, and `slice` return values rather than modifying the original string."],
    [/array|map method|filter|iteration|loop/i, "Arrays preserve order and can be transformed with methods such as `map` (transform each item), `filter` (select items), and `reduce` (accumulate a result). Choose the operation that describes the intent and avoid mutating shared input unexpectedly."],
    [/object|property|destructur/i, "Objects associate keys with values. Destructuring reads properties into local bindings; it does not deep-copy nested values, so object updates should account for shared references."],
    [/condition|switch/i, "A conditional selects a branch based on a Boolean expression. Handle mutually exclusive cases explicitly, include a deliberate default path where appropriate, and avoid relying on accidental truthiness."],
    [/function|parameter|return value|scope|lexical/i, "A function packages behavior with inputs and a return value. Lexical scope determines which bindings are visible where the function is defined; keep side effects clear and return values explicit."],
    [/json|serialize|parse/i, "JSON is a text format for a limited set of data types. `JSON.parse` can throw on invalid text, and JSON does not preserve functions, `undefined`, or object identity; validate parsed external data before trusting it."],
    [/error|exception|debug/i, "Exceptions communicate failure through the call stack. Catch an error where the program can recover or add useful context, and preserve enough information to diagnose the failure instead of silently continuing."],
    [/execution context|call stack|closure|event loop|task|microtask|prototype|higher-order|functional|generator|iterator|promise|async|abort|memory|performance|descriptor|symbol|regular expression|testing/i, "Advanced JavaScript behavior is easiest to reason about by tracing values, references, scheduling, and ownership. Make the relevant boundary observable with a small test, and avoid assuming that asynchronous or shared state changes occur immediately."],
  ],
  "git-github": [
    [/version control|installing git|identity|init|clone|status|diff|stage|commit|message|history|ignore/i, "Git's index separates the working tree from the next commit. Use `git status` and `git diff` to inspect changes, stage only intended files, then inspect the staged diff before recording a commit."],
    [/branch|switch|merge|rebase|conflict|tag/i, "A branch is a movable reference to a commit. Integrate changes by understanding both histories; resolve conflicts by reconciling intent, then run tests and inspect the resulting diff before committing."],
    [/github|remote|publish|push|pull request|review|issue|action/i, "A remote is another repository endpoint; pushing shares commits but does not merge them into a protected branch. A pull request records discussion and review, and required checks should pass before integration."],
    [/undo|reset|revert|stash|restore|cherry-pick/i, "`git restore` changes working-tree files, `git reset` can move the current reference or unstage changes, and `git revert` creates a new commit that reverses an earlier one. Choose based on whether history is already shared."],
  ],
  react: [
    [/why react|declarative|component|create a react application/i, "A React component describes a UI from props and state. Compose small components around meaningful responsibilities; changes to state cause React to compute and commit an updated interface."],
    [/jsx/i, "JSX is syntax for describing React elements inside JavaScript. Expressions go in braces, attributes use React's DOM conventions, and each rendered sibling in a list needs a stable key."],
    [/event|handler|form/i, "Pass an event handler as a function reference and update state through the setter. Use controlled inputs when React state is the source of truth, and preserve native form labels and keyboard behavior."],
    [/list|conditional|catalog/i, "Render collections with a stable key derived from item identity, not array position when order can change. Conditional rendering should represent a clear state such as loading, empty, success, or error."],
    [/state|immutab|object|array/i, "State updates must provide a new object or array when its contents change. Functional updates are useful when the next value depends on the previous one; derive display values instead of duplicating them in state."],
    [/effect|external system|fetch|timer/i, "An effect synchronizes with an external system after rendering. Declare every reactive dependency, clean up subscriptions or requests, and avoid effects for values that can be calculated during render."],
    [/ref|dom access/i, "A ref stores a value that does not itself trigger rendering; DOM refs are useful for focus, measurement, or integration with a browser API. Prefer declarative state for anything that changes visible UI."],
    [/context|memo|usememo|usecallback|suspense|lazy|developer tools|test/i, "Use this feature when its measured or architectural benefit is clear. Context distributes values across a component tree, memoization can skip work only when inputs are stable, and developer tools help inspect renders and component state."],
  ],
  nextjs: [
    [/what next|create and explore|app router|route group|routing|navigation|multi-page/i, "In the App Router, folders define route segments and special files define layouts, pages, loading states, and errors. Keep route structure aligned with the URL and make dynamic parameters explicit."],
    [/server component|client component|server|client boundary/i, "Server Components can access server-side data without shipping that code to the browser. Client Components are for state, event handlers, and browser APIs; place the client boundary as low as practical."],
    [/static asset|public directory|css|global style/i, "Use the public directory for files addressed by a stable URL and component-scoped styles for local presentation. Global styles should establish shared foundations without unintentionally leaking component-specific rules."],
    [/metadata|seo|social preview|open graph/i, "Route metadata communicates a page title and description to browsers and search engines; social metadata controls link previews. Keep titles specific and avoid putting private or user-controlled content into trusted metadata without validation."],
    [/loading|error|not-found|stream|suspense/i, "Route-level loading and error boundaries provide a useful state while server work is pending or fails. Design the pending, not-found, and error paths as part of the route rather than leaving a blank screen."],
    [/image|font|next\/image|next\/font/i, "The framework image and font helpers optimize delivery and layout stability when used with valid dimensions and configuration. Supply meaningful alternative text for informative images and avoid loading fonts that the page does not use."],
    [/cache|revalidat|data fetching|route handler|api route|deploy|build/i, "Choose cache and revalidation behavior based on how fresh the data must be. Keep secrets server-side, validate incoming route-handler data, and test the production build and route behavior."],
  ],
  "tailwind-css": [
    [/utility-first|workflow|install|configure|architecture/i, "Tailwind's build scans source for statically detectable class names and emits matching CSS. Use the installation method for the project's version and keep class names discoverable by the compiler."],
    [/applying utilities|typography|color|border|spacing|responsive/i, "Utilities compose declarations in markup, and responsive variants apply them at configured breakpoints. Keep the HTML semantic, check contrast and focus styles, and use consistent design tokens."],
    [/arbitrary value/i, "An arbitrary value is useful for a one-off constraint that cannot be expressed with the design scale. Repeated arbitrary values are a sign to define a shared token or reusable component."],
    [/dark mode|theme|token|color/i, "A theme should preserve contrast and communicate state in every color scheme. Centralize recurring values as tokens and verify hover, focus, disabled, and error states in both themes."],
    [/conditional class|class name|css module|plain css/i, "Conditional utilities should be selected from complete, statically visible class names so the build can detect them. Use component variants for a finite set of states and plain CSS when the behavior is clearer there."],
  ],
  nodejs: [
    [/what node|where it runs|install node|npm|package manager|lockfile/i, "Node.js runs JavaScript in a process outside the browser. npm scripts and a committed lockfile make project commands and dependency resolution repeatable across environments."],
    [/script|command-line|argument|process object|environment/i, "A Node process receives arguments and environment configuration through `process`. Validate required configuration at startup and keep secrets out of logs and committed files."],
    [/commonjs|ecmascript module|import|export/i, "CommonJS uses `require` and `module.exports`; ECMAScript modules use `import` and `export`. Package metadata and file extensions affect how Node interprets a module."],
    [/file system|json file/i, "Use `node:fs/promises` for asynchronous file operations and handle file-not-found, permission, and parse errors deliberately. Avoid synchronous file operations in request handlers."],
    [/stream|buffer|event loop|worker|performance/i, "Streams process data incrementally and respect backpressure, reducing memory use for large inputs. CPU-heavy work can still block the event loop and may require a worker or a different execution strategy."],
    [/logging|diagnostic|error|test|shutdown|signal/i, "Log structured diagnostic context without secrets, handle process-level failures deliberately, and close connections during graceful shutdown. Tests should cover error paths as well as successful output."],
  ],
  expressjs: [
    [/install express|create an application|middleware/i, "Express middleware runs in registration order. Parsers and security middleware generally need to run before routes, while the error-handling middleware is registered after routes."],
    [/json parsing|request body|validation|route|endpoint|rest|status|response/i, "A route should validate its input, call a focused service, and send one response with an intentional status. `201` is appropriate for a newly created resource; client errors should not become generic server failures."],
    [/static|not-found|error handling/i, "Static-file middleware, not-found handlers, and error handlers have different pipeline roles. Register them in the right order and make sure every unmatched request receives a deliberate response."],
    [/pagination|filter|sorting/i, "Bound page size, validate sort fields against an allowlist, and use a stable ordering key. Unbounded client-controlled pagination can exhaust database and server resources."],
    [/cors|rate limit|upload|file/i, "CORS controls which browser origins may read responses; it is not authentication. Rate limits and upload size/type checks reduce abuse, but authorization and file validation still belong on the server."],
  ],
  mongodb: [
    [/find|filter|projection|sort|limit|pagination/i, "A query filter selects matching documents; projection limits returned fields and a sort should include a stable key for pagination. Index fields that match measured query patterns."],
    [/update operator|delete|safe filter/i, "Use update operators to change selected fields without unintentionally replacing a document. Verify filters before destructive operations and use acknowledged results to detect whether a document matched."],
    [/aggregate|group|pipeline|lookup/i, "An aggregation pipeline passes documents through ordered stages such as match, project, group, and lookup. Filter early when practical and inspect the result shape and execution cost at each stage."],
    [/embed|referenc|relationship|one-to-one|one-to-many/i, "Embedding keeps related values together for atomic reads and writes; references avoid unbounded duplication and support independently managed entities. Choose based on access patterns, update frequency, and growth."],
    [/index|driver|connect|transaction|backup|restore/i, "Indexes accelerate matching and sorting at the cost of storage and write work. Use the driver with bounded queries and explicit connection handling; test backups by restoring them, not merely by creating them."],
  ],
  postgresql: [
    [/table|row|column|data type|identity|primary key/i, "Relational tables represent typed rows. A primary key identifies each row, and a suitable data type plus `NOT NULL`, `UNIQUE`, or `CHECK` constraints can enforce invariants in the database."],
    [/insert|select|update|delete|filter|sort|limit/i, "Use SQL to express the rows and columns needed, bind user-supplied values as parameters, and constrain results with appropriate filters and limits. Check how updates and deletes select their target rows."],
    [/null|three-valued/i, "`NULL` means unknown or absent, so equality comparisons with it are not true or false. Use `IS NULL` and account for unknown results in Boolean expressions and joins."],
    [/foreign key|constraint|relationship|normaliz|many-to-many|one-to-one/i, "Foreign keys and constraints protect relational integrity. Normalize facts that need independent updates, then use join tables for many-to-many relationships and deliberate constraints for valid associations."],
    [/join|aggregate|group|subquer|common table expression|cte/i, "Joins combine rows according to a relationship; aggregate functions summarize groups. Define the join condition and grouping columns explicitly to avoid accidental row multiplication or misleading totals."],
    [/index|query plan|explain|transaction|migration|concurr|lock/i, "Indexes change the cost of reads and writes, so use `EXPLAIN` with representative data before adding them. Transactions group related work, and migrations should be repeatable with an understood rollback plan."],
  ],
  "system-design": [
    [/scope|requirement|functional|non-functional|capacity|estimate|back-of-the-envelope/i, "First clarify users, core operations, data size, latency targets, and failure expectations. State assumptions in capacity estimates so the team can revise the design when those assumptions change."],
    [/latency|throughput|availability|reliability|failure|consistency/i, "Latency is the time for an operation, throughput is completed work per unit time, and availability concerns whether the service can respond. Improve one objective without ignoring consistency and failure trade-offs."],
    [/monolith|service boundar|microservice/i, "A modular monolith can keep deployment and transactions simple while preserving clear domain boundaries. Split a service when independent scaling, ownership, or failure isolation justifies the new network and operational costs."],
    [/storage|relational|non-relational|database|data model/i, "Choose a storage model from access patterns, consistency needs, and relationships—not from popularity. Identify ownership, retention, and the queries the system must support."],
    [/cach|load balanc|scal|queue|cdn/i, "Caching and load balancing can improve latency or distribute load, but add invalidation, consistency, and failure modes. Define cache keys, freshness, and what happens when the cache or a replica is unavailable."],
    [/url service|design a simple|architecture|diagram|observability|monitor/i, "Trace a request through the proposed components, name each data store and communication boundary, and walk through a partial failure. Include metrics, logs, and recovery behavior in the design."],
  ],
  "web-security": [
    [/same-origin|browser boundar|cors/i, "The same-origin policy limits how a document can interact with resources from another origin. CORS selectively relaxes browser read restrictions; it does not authenticate callers or replace server-side authorization."],
    [/cookie|session|session fixation|rotation/i, "Session cookies should use `HttpOnly`, `Secure`, and an appropriate `SameSite` setting. Rotate session identifiers after authentication or privilege changes and invalidate them on logout."],
    [/password|credential|hash/i, "Passwords should be stored using a dedicated slow password-hashing function with a unique salt, never reversible encryption or a fast general-purpose hash. Protect resets and avoid logging credentials."],
    [/cross-site scripting|xss|output encoding/i, "Prevent XSS by encoding untrusted data for its output context and using safe templating APIs. HTML text, attributes, URLs, and JavaScript contexts require different handling; do not treat input filtering as a universal defense."],
    [/csrf|request forgery/i, "CSRF abuses ambient browser credentials to trigger an unwanted state change. Use appropriate SameSite cookies and anti-CSRF defenses, and require authorization plus safe HTTP method semantics for every action."],
    [/sql|injection|query/i, "Parameterized queries keep untrusted values separate from SQL syntax. Do not construct a query by string concatenation; allowlist identifiers such as sort columns that cannot be passed as ordinary parameters."],
    [/secret|dependency|access control|ownership|rate limit|abuse|logging/i, "Apply least privilege, validate object ownership on the server, and keep secrets out of source, client bundles, and logs. Bound expensive operations and update vulnerable dependencies through a reviewed process."],
  ],
  devops: [
    [/environment|development|staging|production|configuration/i, "Build an artifact once and supply environment-specific configuration at runtime. Keep secrets in a managed secret store and test that staging and production configuration are complete."],
    [/shell|process|command/i, "Scripts should fail visibly when a required command fails and should quote data safely. Avoid printing credentials, and make process exit status part of pipeline validation."],
    [/build artifact|reproducible|continuous integration|ci|pipeline/i, "A reproducible pipeline checks out a known revision, installs locked dependencies, runs tests, and publishes a traceable artifact. Keep deployment gated by the checks required for the service."],
    [/docker|image|layer|volume|compose|container/i, "A container image packages an application and its runtime dependencies; layers affect cache reuse and size. Keep persistent state outside the disposable container filesystem and avoid baking secrets into image layers."],
    [/deploy|rollback|monitor|observab|backup|incident|network/i, "A deployment needs health checks, useful telemetry, and a tested rollback or recovery path. Monitor user-visible service health and verify that backups can be restored."],
    [/secret|least privilege|security/i, "Give pipeline and runtime identities only the permissions they need. Inject secrets at runtime, rotate them safely, and ensure command output does not expose secret values."],
  ],
  "ai-for-web-developers": [
    [/ai product pattern|choosing an ai feature|real problem/i, "Start with a user task where probabilistic language generation adds measurable value. Define a non-AI baseline, acceptable failure behavior, latency and cost limits, and a human fallback."],
    [/prompt|instruction|template|version/i, "A useful prompt states the task, provides relevant context, defines the expected output, and includes constraints. Version prompts and evaluate changes on representative examples rather than relying on one successful interaction."],
    [/privacy|sensitive data|security|guardrail/i, "Send only data required for the task, honor user consent and retention requirements, and protect provider credentials on the server. Treat both prompt input and model output as untrusted."],
    [/retrieval|rag|vector|embedding|metadata/i, "Retrieval-augmented generation finds relevant trusted passages and includes them as bounded context for a model. Measure retrieval quality separately from answer quality and cite or expose the source material when useful."],
    [/tool calling|controlled action/i, "A model's tool request is a proposal, not permission. Validate the requested tool and arguments, enforce user authorization in application code, bound side effects, and require confirmation for consequential actions."],
    [/retry|timeout|rate limit|evaluation|quality|human review|feedback/i, "Model calls need timeouts, bounded retries, and rate-limit handling. Evaluate accuracy, refusal behavior, latency, and cost on a maintained dataset, and route uncertain or consequential cases to human review."],
  ],
};

const missingProfile: CourseProfile = {
  name: "this technology",
  foundation: "Reliable engineering starts with understanding the model, constraints, and observable behavior of the system being changed.",
  workflow: "State the expected behavior, make one focused change, verify it against realistic inputs, and record any trade-offs.",
  principle: "Prefer explicit behavior that can be tested and explained.",
  useCases: ["Applying the concept in a real project", "Reviewing an existing implementation", "Explaining design choices to a teammate"],
  mistakes: ["Copying an example without checking its assumptions", "Ignoring edge cases and error behavior", "Optimizing before the required behavior is clear"],
  tips: ["Read the relevant documentation for the version in use", "Verify assumptions with a small experiment", "Prefer clear, testable changes"],
};

function focusedGuidance(courseSlug: string, title: string, profile: CourseProfile) {
  const topic = title.toLowerCase();
  const courseGuidance = courseTopicRules[courseSlug]?.find(([pattern]) => pattern.test(topic))?.[1];
  if (courseGuidance) return courseGuidance;
  if (/semantic|accessib|aria|keyboard|label|alt text|caption/.test(topic)) {
    return "This topic is also an accessibility contract: preserve meaningful names, roles, and keyboard operation, then verify the result with the accessibility tree and a keyboard-only pass.";
  }
  if (/form|input|validation|request|security|auth|permission|protect|injection|xss|csrf/.test(topic)) {
    return "The important boundary is where untrusted input enters the system. Validate its shape and meaning there, enforce authorization on the server, and return a deliberate error instead of continuing with partial data.";
  }
  if (/async|promise|fetch|http|network|stream|event loop|concurr|abort|api/.test(topic)) {
    return "Asynchronous work has both a success path and a failure or cancellation path. Make those outcomes explicit, avoid blocking the event loop, and keep loading, retry, and timeout behavior visible to callers.";
  }
  if (/database|query|index|schema|transaction|model|aggregation|sql|document/.test(topic)) {
    return "Start from the read/write patterns and integrity rules. Encode invariants close to the data, parameterize values, and measure the query plan with representative records before optimizing.";
  }
  if (/responsive|layout|grid|flex|position|container|breakpoint|animation|motion/.test(topic)) {
    return "Test the layout with changing content, viewport widths, and input methods. Prefer constraints and flow-based layout over fixed coordinates, and respect reduced-motion preferences.";
  }
  if (/test|debug|error|exception|profil|performance|monitor|observab|deploy|pipeline|incident/.test(topic)) {
    return "Make the behavior observable and reproducible: define the expected result, exercise a failure case, collect the relevant signal, and verify the change in an environment close to production.";
  }
  if (/component|props|state|hook|render|effect|server|client|route|routing|navigation/.test(topic)) {
    return "Trace where the data originates, which layer owns it, and when it changes. Keep state at the narrowest useful boundary and test the rendered or routed behavior rather than only the implementation detail.";
  }
  return `${profile.workflow} In this lesson, apply that workflow specifically to “${title}” and check the behavior against the example below.`;
}

function makeCodeExample(courseSlug: string, title: string): LessonCodeExample {
  const topic = title.toLowerCase();
  const examples: Record<string, LessonCodeExample> = {
    html: {
      title: "Semantic page structure",
      language: "html",
      code: `<main>\n  <article>\n    <h1>${title}</h1>\n    <p>Give this content a clear structure and purpose.</p>\n    <a href=\"/next-step\">Continue reading</a>\n  </article>\n</main>`,
      explanation: "The main and article elements describe the page regions; the heading gives the content a title, and an anchor represents navigation.",
    },
    css: {
      title: "A resilient layout",
      language: "css",
      code: `.lesson-card {\n  display: grid;\n  gap: 1rem;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));\n  padding: clamp(1rem, 3vw, 2rem);\n}`,
      explanation: "The grid creates as many columns as fit, while min() and clamp() let the layout adapt without hard-coding a single viewport width.",
    },
    javascript: {
      title: "A small, testable transformation",
      language: "javascript",
      code: `function summarize${title.replace(/[^a-z0-9]/gi, "") || "Topic"}(items) {\n  if (!Array.isArray(items)) {\n    throw new TypeError("Expected an array");\n  }\n\n  return items.map((item) => String(item).trim()).filter(Boolean);\n}`,
      explanation: "The function checks its boundary input, transforms each value, and returns a new array instead of mutating the caller's data.",
    },
    "git-github": {
      title: "Review a focused change",
      language: "bash",
      code: "git status --short\ngit diff -- path/to/file\ngit add path/to/file\ngit diff --cached\ngit commit -m \"Explain the focused change\"",
      explanation: "Inspect the working tree and both unstaged and staged diffs before committing. Stage only the files that belong to this change.",
    },
    react: {
      title: "State drives the rendered interface",
      language: "jsx",
      code: `import { useState } from "react";\n\nfunction LessonToggle() {\n  const [expanded, setExpanded] = useState(false);\n  return (\n    <section>\n      <button aria-expanded={expanded} onClick={() => setExpanded((value) => !value)}>\n        {expanded ? "Hide details" : "Show details"}\n      </button>\n      {expanded && <p>Render details from the current state.</p>}\n    </section>\n  );\n}`,
      explanation: "The component renders from state. The functional update uses the previous value safely, and aria-expanded exposes the control state.",
    },
    nextjs: {
      title: "Keep data access on the server",
      language: "tsx",
      code: `export default async function Page() {\n  const response = await fetch(\"https://example.com/api/items\", {\n    next: { revalidate: 60 },\n  });\n  if (!response.ok) throw new Error(\"Unable to load items\");\n  const items = await response.json();\n  return <main><h1>Items</h1><pre>{JSON.stringify(items, null, 2)}</pre></main>;\n}`,
      explanation: "A server component can fetch data without exposing server-only credentials to the browser. The response is checked before its body is used.",
    },
    "tailwind-css": {
      title: "Responsive, focus-visible control",
      language: "html",
      code: `<button class="rounded-lg bg-violet-700 px-4 py-2 font-semibold text-white hover:bg-violet-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700 sm:px-6">\n  Continue\n</button>`,
      explanation: "Utilities compose base, hover, keyboard-focus, and small-screen styles. The focus ring remains visible to keyboard users.",
    },
    nodejs: {
      title: "Handle asynchronous I/O",
      language: "javascript",
      code: `import { readFile } from "node:fs/promises";\n\nasync function readSettings(path) {\n  const text = await readFile(path, "utf8");\n  return JSON.parse(text);\n}\n\ntry {\n  const settings = await readSettings("./settings.json");\n  console.log(settings);\n} catch (error) {\n  console.error("Could not load settings:", error.message);\n}`,
      explanation: "The promise-based file API avoids blocking I/O. Parsing and file errors are allowed to reach a deliberate error handler.",
    },
    expressjs: {
      title: "Validate a request before using it",
      language: "javascript",
      code: `app.post("/api/items", async (req, res, next) => {\n  try {\n    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";\n    if (!name) return res.status(400).json({ error: "A name is required" });\n\n    const item = await itemService.create({ name });\n    return res.status(201).json({ data: item });\n  } catch (error) {\n    return next(error);\n  }\n});`,
      explanation: "The route validates untrusted input, delegates business logic, returns an explicit status, and forwards unexpected errors to the error middleware.",
    },
    mongodb: {
      title: "Filter and project documents",
      language: "javascript",
      code: `const activeUsers = await db.collection("users")\n  .find(\n    { status: "active" },\n    { projection: { name: 1, email: 1, _id: 0 } },\n  )\n  .sort({ name: 1 })\n  .limit(20)\n  .toArray();`,
      explanation: "The filter selects matching documents, projection limits returned fields, and sort plus limit bounds the result set.",
    },
    postgresql: {
      title: "Use parameters and constraints",
      language: "sql",
      code: `CREATE TABLE tasks (\n  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  title text NOT NULL CHECK (length(trim(title)) > 0),\n  completed boolean NOT NULL DEFAULT false\n);\n\nSELECT id, title, completed\nFROM tasks\nWHERE completed = $1\nORDER BY id\nLIMIT $2;`,
      explanation: "The table constraints protect data integrity, and $1/$2 are bound parameters rather than values concatenated into SQL.",
    },
    "system-design": {
      title: "Trace a request and its failure boundary",
      language: "text",
      code: "Client -> API -> Service -> Database\n           |       |          |\n        timeout  validate   transaction\n           |       |          |\n       retry?   4xx/5xx   commit/rollback",
      explanation: "A design review follows a request across components and asks what happens at each boundary, including timeout, validation, and partial failure.",
    },
    "web-security": {
      title: "Keep data values out of SQL syntax",
      language: "javascript",
      code: `const result = await db.query(\n  "SELECT id, email FROM users WHERE email = $1",\n  [untrustedEmail],\n);`,
      explanation: "A parameterized query sends the user value separately from SQL syntax, preventing that value from changing the query structure.",
    },
    devops: {
      title: "Automate checks before deployment",
      language: "yaml",
      code: `name: verify\non: [push, pull_request]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 22\n      - run: npm ci\n      - run: npm test`,
      explanation: "The pipeline uses a clean checkout, a declared runtime, and a reproducible install before running tests on every change.",
    },
    "ai-for-web-developers": {
      title: "Call a model through a protected server endpoint",
      language: "javascript",
      code: `const response = await fetch("/api/assistant", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify({ question }),\n});\nif (!response.ok) throw new Error("Assistant request failed");\nconst result = await response.json();\nif (typeof result.answer !== "string") throw new TypeError("Invalid response");`,
      explanation: "The browser sends the user's task to the application's server, which can protect provider credentials. The response is checked before display.",
    },
  };
  const example = examples[courseSlug] ?? {
    title: `${title}: a practical starting point`,
    language: "text",
    code: `Goal: ${title}\n1. State the expected behavior.\n2. Apply the smallest relevant change.\n3. Verify a success case and a failure case.`,
    explanation: "A repeatable workflow makes assumptions visible and gives the change a concrete verification step.",
  };

  if (courseSlug === "html" && /form|input|label|validation/.test(topic)) {
    return {
      title: "A labeled, browser-validated form",
      language: "html",
      code: `<form action="/subscribe" method="post">\n  <label for="email">Email address</label>\n  <input id="email" name="email" type="email" autocomplete="email" required>\n  <button type="submit">Subscribe</button>\n</form>`,
      explanation: "The label provides an accessible name, type=email enables native validation, and the name attribute identifies the submitted value. The server must still validate it.",
    };
  }
  if (courseSlug === "html" && /image|alternative text/.test(topic)) {
    return {
      title: "Describe an informative image",
      language: "html",
      code: `<figure>\n  <img src="/team.jpg" alt="The project team reviewing a design together">\n  <figcaption>Planning the first release</figcaption>\n</figure>`,
      explanation: "The alternative text conveys the image's relevant information; the caption provides visible context. Decorative images should instead use empty alt text.",
    };
  }
  if (courseSlug === "css" && /flex|alignment/.test(topic)) {
    return {
      title: "Align items with Flexbox",
      language: "css",
      code: `.toolbar {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n  flex-wrap: wrap;\n}`,
      explanation: "Flexbox distributes items along one main axis. Wrapping and gap keep the toolbar usable when space becomes limited.",
    };
  }
  if (courseSlug === "css" && /grid|track/.test(topic)) {
    return {
      title: "Build columns that adapt to available space",
      language: "css",
      code: `.cards {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));\n  gap: 1rem;\n}`,
      explanation: "The browser fits as many minimum-width tracks as it can, then shares remaining space across the tracks.",
    };
  }
  if (courseSlug === "javascript" && /array|map|filter|iteration/.test(topic)) {
    return {
      title: "Transform a collection without mutating it",
      language: "javascript",
      code: `const completedTitles = tasks\n  .filter((task) => task.completed)\n  .map((task) => task.title);`,
      explanation: "filter selects matching records and map projects each one to a title. Both return new arrays, leaving tasks unchanged.",
    };
  }
  if (courseSlug === "javascript" && /async|promise|fetch|http/.test(topic)) {
    return {
      title: "Handle an HTTP response explicitly",
      language: "javascript",
      code: `async function loadItems() {\n  const response = await fetch("/api/items");\n  if (!response.ok) throw new Error(\`Request failed: \${response.status}\`);\n  return response.json();\n}`,
      explanation: "fetch rejects on network errors, not ordinary HTTP error statuses, so response.ok must be checked before consuming the body.",
    };
  }
  if (courseSlug === "react" && /effect|fetch|external/.test(topic)) {
    return {
      title: "Synchronize with an external system",
      language: "jsx",
      code: `useEffect(() => {\n  const controller = new AbortController();\n  fetch("/api/items", { signal: controller.signal })\n    .then((response) => {\n      if (!response.ok) throw new Error("Request failed");\n      return response.json();\n    })\n    .then(setItems)\n    .catch((error) => {\n      if (error.name !== "AbortError") setError(error.message);\n    });\n  return () => controller.abort();\n}, []);`,
      explanation: "The effect owns the request lifecycle and aborts it on cleanup. Error handling distinguishes cancellation from a real failure.",
    };
  }
  return example;
}

export function buildLessonMaterial({
  courseSlug,
  courseTitle,
  moduleTitle,
  lessonTitle,
  description,
  level,
}: {
  courseSlug: string;
  courseTitle: string;
  moduleTitle: string;
  lessonTitle: string;
  description: string | null;
  level: string;
}): LessonMaterial {
  const profile = profiles[courseSlug] ?? { ...missingProfile, name: courseTitle };
  const focused = focusedGuidance(courseSlug, lessonTitle, profile);
  const codeExample = makeCodeExample(courseSlug, lessonTitle);
  const lessonLevel = level?.trim() ? level.trim() : "beginner";
  const introduction = description?.trim() ||
    `This lesson introduces ${lessonTitle} in ${moduleTitle}. It is written for a ${lessonLevel.toLowerCase()} learner, so you do not need advanced knowledge to start. We will look at the idea, a simple example, and a short practice task so the concept feels clear and useful.`;
  const explanation = [
    "## What is this?",
    `${lessonTitle} is a practical concept in ${profile.name}. ${profile.foundation}`,
    "## Why does it matter?",
    `${focused} ${profile.workflow}`,
    "## How to think about it",
    "Start with the problem, then check the input, the behavior, and the result. If you can explain what changes and how to verify it, you understand the idea.",
  ].join("\n\n");
  const example = `**Scenario:** A team is working on “${lessonTitle}” in a real ${profile.name} project. ${focused} The example below shows one small, readable pattern. Before copying it, identify the input, the result, and the case that could fail.`;
  const terminology: LessonTerm[] = [
    {
      term: "Concept",
      definition: `${lessonTitle} is the main idea in this lesson. It describes how a part of ${profile.name} works in practice.`,
      example: "You learn the idea first, then apply it to a small example.",
    },
    {
      term: "Input",
      definition: "The value or information that enters a system or function.",
      example: "A user name, a form value, or an API response.",
    },
    {
      term: "Output",
      definition: "The result or visible effect that comes after the code runs.",
      example: "A rendered page, a database row, or a message in the console.",
    },
    {
      term: "Verification",
      definition: "Checking whether the result matches the intended behavior.",
      example: "Test the code with a simple real case before you trust the result.",
    },
  ];
  const useCases = profile.useCases.map((useCase) => `${useCase}. For this lesson, decide which part of “${lessonTitle}” supports that outcome and how you would verify it.`);
  const mistakes = [
    ...profile.mistakes,
    `Copying the “${lessonTitle}” example without checking its assumptions, inputs, and failure behavior.`,
  ];
  const tips = [
    ...profile.tips,
    `When practicing “${lessonTitle},” change one variable at a time and explain the observed result.`,
  ];
  const practice = [
    `Create a tiny example that shows “${lessonTitle}” in a project related to ${moduleTitle}. Write down the expected result before you code it.`,
    `Add one realistic edge case. Explain what your code should do when the input is unusual or missing.`,
    `Review your work against the common mistakes above and check the result in a way that matches the topic.`,
  ];
  const phaseSections: LessonPhaseSection[] = [
    {
      id: "learn",
      title: "Phase 1 · Learn",
      summary: "Understand the idea",
      content: `In this phase, focus on the purpose of ${lessonTitle}. ${profile.foundation} You are learning the problem the concept solves before looking at the exact code.`,
      audio_url: null,
    },
    {
      id: "see",
      title: "Phase 2 · See",
      summary: "Read a working example",
      content: `${codeExample.explanation} Notice the input, the result, and the boundary where the behavior changes.`,
      code: codeExample.code,
      language: codeExample.language,
      audio_url: null,
    },
    {
      id: "practice",
      title: "Phase 3 · Practice",
      summary: "Try it yourself",
      content: `Practice with a small task, then explain what changed and how you checked the result. ${profile.workflow}`,
      tasks: practice,
      audio_url: null,
    },
  ];
  const correctAnswer = profile.principle;
  const quiz: LessonQuizQuestion[] = [
    {
      id: "lesson-approach",
      type: "multiple_choice",
      prompt: `When applying **${lessonTitle}**, which approach is most reliable?`,
      options: [
        correctAnswer,
        "Copy a working example without checking its assumptions.",
        "Optimize the implementation before defining its expected behavior.",
        "Rely on the visible happy path and skip failure cases.",
      ],
      correctAnswer,
      explanation: `${correctAnswer} This keeps the implementation aligned with the constraints explained in this lesson and makes it possible to verify the result.`,
    },
    {
      id: "lesson-boundary",
      type: "multiple_choice",
      prompt: `What should you do before relying on an implementation of **${lessonTitle}**?`,
      options: [
        "Check its inputs, assumptions, and behavior for an edge or failure case.",
        "Assume the example is correct for every project and runtime.",
        "Remove validation so unexpected values pass through.",
        "Measure only how the code looks, not what it does.",
      ],
      correctAnswer: "Check its inputs, assumptions, and behavior for an edge or failure case.",
      explanation: `Real systems differ in data, runtime, and failure conditions. The lesson's workflow starts by checking those boundaries and verifying observable behavior.`,
    },
    {
      id: "lesson-principle",
      type: "true_false",
      prompt: `A good implementation of **${lessonTitle}** should make its assumptions clear and be verified against realistic behavior.`,
      options: ["True", "False"],
      correctAnswer: "True",
      explanation: `${profile.principle} Testing realistic behavior helps confirm that the chosen implementation satisfies that principle.`,
    },
  ];

  return {
    introduction,
    explanation,
    example,
    codeExample,
    terminology,
    phaseSections,
    useCases,
    mistakes,
    tips,
    practice,
    quiz,
    audioUrl: null,
    audioPath: null,
    audioLanguage: "so",
  };
}

export function resolveLessonQuiz(
  storedQuestions: LessonQuizQuestion[] | null | undefined,
  material: LessonMaterial,
): LessonQuizQuestion[] {
  return storedQuestions?.length ? storedQuestions : material.quiz;
}
