create table if not exists public.learning_paths (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  short_description text,
  difficulty text not null,
  estimated_hours integer not null check (estimated_hours > 0),
  thumbnail_url text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  learning_path_id uuid not null references public.learning_paths (id) on delete cascade,
  title text not null,
  slug text not null,
  description text,
  order_index integer not null check (order_index > 0),
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (learning_path_id, slug),
  unique (learning_path_id, order_index)
);

create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  title text not null,
  slug text not null,
  description text,
  level text not null check (level in ('basic', 'intermediate', 'advanced')),
  order_index integer not null check (order_index > 0),
  estimated_hours integer not null check (estimated_hours > 0),
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (course_id, slug),
  unique (course_id, order_index)
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules (id) on delete cascade,
  title text not null,
  slug text not null,
  description text,
  content text not null default '',
  lesson_type text not null default 'lesson'
    check (lesson_type in ('lesson', 'coding', 'quiz', 'project')),
  order_index integer not null check (order_index > 0),
  estimated_minutes integer not null default 15 check (estimated_minutes > 0),
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (module_id, slug),
  unique (module_id, order_index)
);

create index if not exists courses_learning_path_order_idx
  on public.courses (learning_path_id, order_index);
create index if not exists modules_course_order_idx
  on public.modules (course_id, order_index);
create index if not exists lessons_module_order_idx
  on public.lessons (module_id, order_index);

drop trigger if exists learning_paths_set_updated_at on public.learning_paths;
create trigger learning_paths_set_updated_at
before update on public.learning_paths
for each row execute function public.set_updated_at();

drop trigger if exists courses_set_updated_at on public.courses;
create trigger courses_set_updated_at
before update on public.courses
for each row execute function public.set_updated_at();

drop trigger if exists modules_set_updated_at on public.modules;
create trigger modules_set_updated_at
before update on public.modules
for each row execute function public.set_updated_at();

drop trigger if exists lessons_set_updated_at on public.lessons;
create trigger lessons_set_updated_at
before update on public.lessons
for each row execute function public.set_updated_at();

alter table public.learning_paths enable row level security;
alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;

drop policy if exists "Authenticated users can read published learning paths"
  on public.learning_paths;
create policy "Authenticated users can read published learning paths"
on public.learning_paths for select to authenticated
using (is_published);

drop policy if exists "Authenticated users can read courses in published paths"
  on public.courses;
create policy "Authenticated users can read courses in published paths"
on public.courses for select to authenticated
using (
  is_published
  and exists (
    select 1 from public.learning_paths
    where learning_paths.id = courses.learning_path_id
      and learning_paths.is_published
  )
);

drop policy if exists "Authenticated users can read modules in published paths"
  on public.modules;
create policy "Authenticated users can read modules in published paths"
on public.modules for select to authenticated
using (
  is_published
  and exists (
    select 1
    from public.courses
    join public.learning_paths on learning_paths.id = courses.learning_path_id
    where courses.id = modules.course_id
      and courses.is_published
      and learning_paths.is_published
  )
);

drop policy if exists "Authenticated users can read lessons in published paths"
  on public.lessons;
create policy "Authenticated users can read lessons in published paths"
on public.lessons for select to authenticated
using (
  is_published
  and exists (
    select 1
    from public.modules
    join public.courses on courses.id = modules.course_id
    join public.learning_paths on learning_paths.id = courses.learning_path_id
    where modules.id = lessons.module_id
      and modules.is_published
      and courses.is_published
      and learning_paths.is_published
  )
);

revoke all on public.learning_paths, public.courses, public.modules, public.lessons
  from anon, authenticated;
grant select on public.learning_paths, public.courses, public.modules, public.lessons
  to authenticated;

do $curriculum$
declare
  path_id uuid;
  course_data jsonb;
  module_data jsonb;
  lesson_record record;
  current_course_id uuid;
  current_module_id uuid;
  course_index integer;
  module_index integer;
  lesson_title text;
  lesson_slug text;
  lesson_kind text;
begin
  insert into public.learning_paths (
    title, slug, description, short_description, difficulty, estimated_hours, is_published
  ) values (
    'Web Development / MERN Stack',
    'web-development-mern-stack',
    'A structured progression from web fundamentals to full-stack application development and advanced engineering practice. Build durable foundations in HTML, CSS, JavaScript, and Git before moving through modern frontend, backend, databases, security, infrastructure, and applied AI.',
    'Go from web fundamentals to building, securing, and operating modern full-stack applications.',
    'Beginner to Advanced',
    684,
    true
  )
  on conflict (slug) do update set
    title = excluded.title,
    description = excluded.description,
    short_description = excluded.short_description,
    difficulty = excluded.difficulty,
    estimated_hours = excluded.estimated_hours,
    is_published = excluded.is_published
  returning id into path_id;

  course_index := 1;
  for course_data in
    select value
    from jsonb_array_elements($data$
    [
      {"slug":"html","title":"HTML","description":"Create well-structured, semantic, accessible documents for the web.","modules":[
        {"slug":"html-basics","title":"HTML Basics","level":"basic","hours":12,"description":"Understand how the web delivers documents and build valid HTML pages.","lessons":["What is HTML?","How the web works: browsers, servers, and HTTP","HTML document structure","The DOCTYPE declaration","The html, head, and body elements","Headings and document outline","Paragraphs and line breaks","Text formatting and emphasis","HTML comments","Attributes and global attributes","Links and anchor elements","URLs, paths, and fragments","Images and alternative text","Ordered, unordered, and description lists",{"title":"Build a semantic profile page","type":"project"},{"title":"HTML basics knowledge check","type":"quiz"}]},
        {"slug":"html-structure-and-forms","title":"HTML Structure and Forms","level":"intermediate","hours":16,"description":"Organize content with semantic elements and collect user input with native forms.","lessons":["Generic containers: div and span","Semantic HTML and landmark regions","The header element","The nav element","The main element","Sectioning content with section","Articles and self-contained content","Complementary content with aside","The footer element","Figures and figcaptions","Form fundamentals and the form element","Input types and name values","Labels and accessible form controls","Buttons and button types","Multiline input with textarea","Select menus and option groups","Checkboxes and radio groups","File inputs and upload attributes","Native constraint validation","Grouping controls with fieldset and legend"]},
        {"slug":"html-advanced","title":"Advanced HTML","level":"advanced","hours":14,"description":"Build robust, accessible documents and use richer browser-native content features.","lessons":["Data tables and table structure","Accessible tables: captions, headers, and scope","Embedding content with iframe","Audio elements and media controls","Video elements and captions","SVG fundamentals for scalable graphics","Canvas drawing basics","Metadata and the head element","SEO fundamentals for document markup","Open Graph and social sharing metadata","Accessibility fundamentals and keyboard navigation","ARIA roles, states, and authoring practices","Native interactive elements: details and dialog","HTML validation and browser parsing","Progressive enhancement and HTML best practices"]}
      ]},
      {"slug":"css","title":"CSS","description":"Style responsive interfaces with a reliable grasp of layout, design systems, and rendering.","modules":[
        {"slug":"css-foundations","title":"CSS Foundations","level":"basic","hours":14,"description":"Learn the cascade, selectors, typography, and the CSS box model.","lessons":["What CSS does and how stylesheets are applied","Connecting external, embedded, and inline styles","CSS rules, declarations, and comments","Type, class, ID, and attribute selectors","Combinators and selector lists","The cascade, specificity, and inheritance","Colors, opacity, and color formats","Length units: px, rem, em, %, vw, and vh","The box model and box-sizing","Margins, padding, and borders","Typography, font stacks, and web fonts","Backgrounds, gradients, and image sizing","Display values and normal flow","Basic responsive thinking",{"title":"Build a styled profile card","type":"project"},{"title":"CSS foundations knowledge check","type":"quiz"}]},
        {"slug":"css-layout-and-responsive-design","title":"Layout and Responsive Design","level":"intermediate","hours":18,"description":"Compose flexible page layouts and adapt them to screen sizes and input devices.","lessons":["Positioning: relative, absolute, fixed, and sticky","Stacking contexts and z-index","Flexbox axes, alignment, and wrapping","Flex items, sizing, and common patterns","CSS Grid tracks and fractional units","Grid placement, areas, and alignment","Combining Grid and Flexbox","Responsive layouts and mobile-first design","Media queries and breakpoints","Container queries","Fluid type and clamp()","Pseudo-classes and interactive states","Pseudo-elements and generated content","Transitions and timing functions","Transforms and compositing","Reusable CSS custom properties","Accessible focus indicators and reduced motion","Create a responsive dashboard layout","Responsive CSS code exercise"]},
        {"slug":"css-advanced","title":"Advanced CSS","level":"advanced","hours":16,"description":"Scale stylesheets with modern CSS capabilities, architecture, and performance techniques.","lessons":["Cascade layers and @layer","Modern selector patterns with :is, :where, and :has","Advanced Grid: subgrid and auto-placement","Intrinsic sizing and minmax()","Advanced container-query patterns","CSS architecture and naming strategies","Design tokens and theme systems","Dark mode and color-scheme","Complex animations and keyframes","Scroll-driven effects and motion preferences","CSS functions: calc, min, max, and clamp","Native nesting and at-rules","CSS modules and component styling trade-offs","Rendering performance and layout work","Debugging computed styles and layout","Cross-browser support and feature queries","Build a reusable responsive design system","CSS architecture review"]}
      ]},
      {"slug":"javascript","title":"JavaScript","description":"Progress from core language concepts to asynchronous browser and application programming.","modules":[
        {"slug":"javascript-foundations","title":"JavaScript Foundations","level":"basic","hours":18,"description":"Learn the language fundamentals and write clear, predictable programs.","lessons":["JavaScript in the browser and on the server","Adding scripts and module scripts to HTML","Values, variables, and const versus let","Primitive types and type conversion","Operators and expressions","Strings, templates, and useful string methods","Numbers, BigInt, and numeric pitfalls","Booleans, truthiness, and nullish values","Arrays and common array methods","Objects, properties, and destructuring","Conditionals and switch statements","Loops and iteration","Functions, parameters, and return values","Scope and lexical environments","Errors, exceptions, and debugging basics","Reading and writing JSON",{"title":"Build a command-line number game","type":"project"},{"title":"JavaScript fundamentals knowledge check","type":"quiz"}]},
        {"slug":"javascript-browser-and-async","title":"Browser APIs and Asynchronous JavaScript","level":"intermediate","hours":22,"description":"Build interactive browser features and coordinate asynchronous work with confidence.","lessons":["The DOM tree and document queries","Creating, updating, and removing DOM nodes","Events, listeners, and event objects","Event bubbling, delegation, and propagation","Forms, input events, and validation","Browser storage: localStorage and sessionStorage","The Fetch API and HTTP responses","Promises and promise chaining","async and await with error handling","Timers and scheduling work","ES modules: imports and exports","Classes, prototypes, and composition","Map, Set, and weak collections","Iterators and generators","Regular expressions for input parsing","Testing JavaScript functions","Package scripts and npm fundamentals","Build a searchable browser interface","Fetch and render a public API code exercise"]},
        {"slug":"javascript-advanced","title":"Advanced JavaScript","level":"advanced","hours":20,"description":"Understand runtime behavior, composition, performance, and safer JavaScript systems.","lessons":["Execution contexts and the call stack","Closures and practical encapsulation","The event loop, tasks, and microtasks","Prototype chains and property lookup","Functional programming and pure functions","Higher-order functions and composition","Advanced async flows and Promise combinators","AbortController and cancellation","Memory management and leak diagnosis","Performance profiling and optimization","Property descriptors and metaprogramming","Symbols and well-known protocols","Secure handling of untrusted input","Internationalization APIs","JavaScript architecture and module boundaries","Debugging race conditions","Write resilient asynchronous utilities","Advanced JavaScript code review"]}
      ]},
      {"slug":"git-github","title":"Git & GitHub","description":"Track changes confidently and collaborate through professional Git workflows.","modules":[
        {"slug":"git-foundations","title":"Git Foundations","level":"basic","hours":8,"description":"Create repositories, record changes, and understand Git's core model.","lessons":["Version control and why Git is useful","Installing Git and setting identity","Repositories, working trees, and the index","git init and cloning repositories","Inspecting status and file changes","Staging files and creating commits","Writing clear commit messages","Reading commit history","Ignoring files with .gitignore","Branches and switching contexts","Undoing unstaged and staged changes","Connect a local project to GitHub",{"title":"Publish a project repository on GitHub","type":"project"},{"title":"Git foundations knowledge check","type":"quiz"}]},
        {"slug":"git-collaboration","title":"Git Collaboration","level":"intermediate","hours":10,"description":"Work with remotes, pull requests, branches, and shared project history.","lessons":["Remote repositories and origin","Push, fetch, and pull","Tracking branches and upstreams","Merge commits and fast-forward merges","Resolving merge conflicts safely","Pull requests and code review","Forks and contributing to open source","Branch naming and feature workflows","Rebasing local commits","Reverting published commits","Tags and release basics","GitHub issues and project discussions","Collaborate on a small feature branch","Team Git workflow exercise"]},
        {"slug":"git-advanced","title":"Git Advanced Workflows","level":"advanced","hours":8,"description":"Recover from complex mistakes and keep repository history maintainable.","lessons":["Interactive rebase and commit cleanup","Cherry-picking selected changes","Stash workflows and conflict handling","Bisecting regressions with git bisect","Reflog and recovering lost commits","Reset modes and history implications","Rewriting history safely","Submodules and repository alternatives","Signed commits and provenance","Large files and Git LFS concepts","Maintaining release branches","Diagnose and repair a broken branch","Advanced Git workflow review"]}
      ]},
      {"slug":"react","title":"React","description":"Build reusable user interfaces with React's component and state model.","modules":[
        {"slug":"react-foundations","title":"React Foundations","level":"basic","hours":16,"description":"Compose interfaces from components and render data-driven views.","lessons":["Why React and declarative user interfaces","Create a React application","JSX syntax and expressions","Function components and props","Rendering lists and stable keys","Conditional rendering patterns","Events and event handlers","Local state with useState","State updates and render cycles","Controlled form inputs","Component composition and children","Sharing UI through reusable components","Styling React components","React developer tools",{"title":"Build a reusable component library starter","type":"project"},{"title":"React foundations knowledge check","type":"quiz"}]},
        {"slug":"react-state-and-effects","title":"State, Effects, and Data","level":"intermediate","hours":20,"description":"Coordinate component state, effects, forms, and data-driven application screens.","lessons":["State as a snapshot","Updating objects and arrays immutably","Lifting state to shared parents","Choosing state ownership","useEffect and synchronization","Effect dependencies and cleanup","Avoiding unnecessary effects","Refs and DOM access","Custom hooks for reusable behavior","Context for cross-tree values","Reducer-based state transitions","Form design and validation","Loading, empty, and error states","Fetching data in React","Component boundaries and composition","Testing components and user behavior","Build an interactive searchable catalog","React state code exercise"]},
        {"slug":"react-advanced","title":"Advanced React","level":"advanced","hours":18,"description":"Apply advanced rendering, performance, accessibility, and architecture practices.","lessons":["React rendering and reconciliation","Memoization: memo, useMemo, and useCallback","When memoization does not help","Concurrent rendering concepts","Suspense boundaries and loading UI","Error boundaries and recovery","Portals and layered interfaces","Compound component patterns","Accessible interaction patterns","Performance profiling with React tools","Avoiding stale closures","State machines and complex interactions","Server and client component boundaries","Testing asynchronous UI","Design systems and component APIs","Security considerations for rendered content","Optimize a data-heavy React screen","Advanced React architecture review"]}
      ]},
      {"slug":"nextjs","title":"Next.js","description":"Deliver production web applications with the Next.js App Router and React.","modules":[
        {"slug":"nextjs-foundations","title":"Next.js Foundations","level":"basic","hours":16,"description":"Understand routing, layouts, rendering, and the Next.js project structure.","lessons":["What Next.js adds to React","Create and explore a Next.js application","App Router folders and files","Pages, layouts, and nested routes","Link navigation and route segments","Static assets and the public directory","Server Components by default","Client Components and the use client boundary","Passing props across component boundaries","CSS and global styles","Metadata fundamentals","Loading UI and loading.tsx","Not-found routes and notFound()","Environment variables and public values",{"title":"Build a multi-page Next.js site","type":"project"},{"title":"Next.js foundations knowledge check","type":"quiz"}]},
        {"slug":"nextjs-data-and-routing","title":"Data, Routing, and Server Features","level":"intermediate","hours":20,"description":"Connect routes to data, handle mutations, and use server capabilities safely.","lessons":["Dynamic route segments","Route groups and private folders","Fetching data in Server Components","Request memoization and caching","Revalidation strategies","Server Actions and form submissions","Route Handlers and HTTP methods","Cookies and headers on the server","Authentication-aware page rendering","Streaming and Suspense","Parallel and intercepted routes","Image optimization with next/image","Fonts and next/font","SEO metadata and social previews","Error boundaries and route recovery","Deploying a Next.js application","Build a data-backed directory","Next.js data-flow coding exercise"]},
        {"slug":"nextjs-advanced","title":"Advanced Next.js","level":"advanced","hours":18,"description":"Optimize, secure, and operate larger applications using advanced App Router patterns.","lessons":["Rendering strategies and their trade-offs","Cache components and cache invalidation","Partial prerendering concepts","Middleware and request interception","Authorization boundaries and secure data access","Streaming and progressive rendering","Internationalization and locale routing","Monorepos and shared packages","Bundle analysis and code splitting","Web vitals and runtime performance","Image, font, and script loading strategy","Production error monitoring","Preview deployments and environments","Content security policies in Next.js","Migrate a legacy route design","Production deployment checklist","Next.js performance investigation","Advanced App Router architecture review"]}
      ]},
      {"slug":"tailwind-css","title":"Tailwind CSS","description":"Build consistent interfaces efficiently with a utility-first design system.","modules":[
        {"slug":"tailwind-foundations","title":"Tailwind CSS Foundations","level":"basic","hours":10,"description":"Compose layouts and styling with utility classes and design tokens.","lessons":["Utility-first CSS and Tailwind's workflow","Install and configure Tailwind CSS","Applying utilities in markup","Spacing, sizing, and the box model","Typography, colors, and borders","Flexbox and Grid utilities","Responsive design prefixes","Hover, focus, and state variants","Arbitrary values and when to avoid them","Extracting reusable UI components","Dark mode fundamentals","Accessible focus and motion utilities",{"title":"Build a responsive profile card","type":"project"},{"title":"Tailwind foundations knowledge check","type":"quiz"}]},
        {"slug":"tailwind-components","title":"Responsive Components and Design Systems","level":"intermediate","hours":12,"description":"Create reusable, responsive UI patterns and maintain a consistent visual language.","lessons":["Responsive layout composition","Grid templates and placement utilities","Container queries in component design","Interactive variants and group states","Data-driven styling and class composition","Component extraction in React","Theme tokens and CSS variables","Configuring colors and typography","Forms and accessible controls","Complex component states","Handling conditional class names","Build a responsive navigation system","Tailwind component code exercise"]},
        {"slug":"tailwind-advanced","title":"Advanced Tailwind CSS","level":"advanced","hours":10,"description":"Scale Tailwind usage across applications with clear conventions and optimized output.","lessons":["Tailwind CSS v4 architecture","Design token strategy and theme configuration","Custom utilities and variants","Integrating CSS modules and plain CSS","Class sorting and codebase conventions","Managing conditional variants at scale","Production output and CSS optimization","Accessibility audits for utility-built UI","Maintainable component APIs","Migration and version upgrade planning","Build a small design-system page","Advanced Tailwind code review"]}
      ]},
      {"slug":"nodejs","title":"Node.js","description":"Use JavaScript on the server to build reliable tools and application services.","modules":[
        {"slug":"nodejs-foundations","title":"Node.js Foundations","level":"basic","hours":14,"description":"Understand the Node.js runtime, modules, packages, and core APIs.","lessons":["What Node.js is and where it runs","The V8 runtime and event-driven model","Install Node.js and use npm","Run scripts and pass command-line arguments","CommonJS and ECMAScript modules","The global process object","File system basics","Paths and platform differences","Environment variables","Working with JSON files","Buffers and streams introduction","Create a basic HTTP server","Handle errors in Node programs",{"title":"Build a command-line utility","type":"project"},{"title":"Node.js foundations knowledge check","type":"quiz"}]},
        {"slug":"nodejs-services","title":"Asynchronous Services and Tooling","level":"intermediate","hours":18,"description":"Build asynchronous services and use the Node ecosystem effectively.","lessons":["The event loop in Node.js","Callbacks, promises, and async functions","Timers and scheduling APIs","Readable and writable streams","Pipelines and backpressure","HTTP requests and responses","URL parsing and request data","Package management and lockfiles","Configuration by environment","Logging and structured diagnostics","Testing Node.js modules","Worker threads and when they fit","Child processes and subprocess safety","Graceful shutdown","Build a small JSON HTTP service","Node async code exercise"]},
        {"slug":"nodejs-advanced","title":"Advanced Node.js","level":"advanced","hours":18,"description":"Design observable, secure, and performant Node services for production.","lessons":["Event-loop latency and workload isolation","Memory profiling and heap snapshots","Stream backpressure and throughput","Process lifecycle and signal handling","Security of dependencies and package scripts","Secrets and configuration boundaries","Observability: logs, metrics, and traces","Resilience, retries, and timeouts","Worker pools and CPU-heavy tasks","Node.js permission and runtime features","Performance profiling with built-in tools","Service testing and test isolation","Deploying and scaling Node processes","Production incident investigation","Harden a Node service","Advanced Node.js architecture review"]}
      ]},
      {"slug":"expressjs","title":"Express.js","description":"Design HTTP APIs and middleware pipelines with Express.","modules":[
        {"slug":"express-foundations","title":"Express.js Foundations","level":"basic","hours":12,"description":"Create HTTP servers and define clear routes and responses.","lessons":["HTTP request and response fundamentals","Install Express and create an application","Routes, methods, and route parameters","Query strings and request bodies","JSON parsing middleware","Sending status codes and responses","Static file serving","Middleware and request flow","Organizing routes into routers","Basic input validation","Not-found responses","Centralized error handling",{"title":"Build a small REST endpoint","type":"project"},{"title":"Express foundations knowledge check","type":"quiz"}]},
        {"slug":"express-api-design","title":"API Design and Middleware","level":"intermediate","hours":16,"description":"Build maintainable APIs with validation, authentication hooks, and consistent errors.","lessons":["REST resource and URL design","HTTP status codes and error formats","Middleware ordering and composition","Schema-based request validation","Authentication middleware boundaries","Authorization and ownership checks","Pagination, filtering, and sorting","CORS and browser access","Rate limiting concepts","File upload handling and limits","API versioning strategies","Request logging and correlation IDs","Testing routes and middleware","Document APIs with OpenAPI","Build a versioned resource API","Express API code exercise"]},
        {"slug":"express-advanced","title":"Advanced Express.js","level":"advanced","hours":14,"description":"Operate Express APIs with strong security, observability, and production discipline.","lessons":["Production error handling strategy","Trust proxy and secure deployment settings","Security headers and Helmet","Abuse prevention and rate-limit design","Request size and timeout limits","Graceful shutdown and connection draining","Async handler failure modes","Dependency injection and testability","Structured observability and tracing","API contract and compatibility","Performance bottlenecks in middleware","Secrets and configuration management","Production API readiness review","Harden and document an Express API"]}
      ]},
      {"slug":"mongodb","title":"MongoDB","description":"Model application data and build dependable persistence with MongoDB.","modules":[
        {"slug":"mongodb-foundations","title":"MongoDB Foundations","level":"basic","hours":12,"description":"Understand documents, collections, queries, and basic data modeling.","lessons":["Document databases and MongoDB concepts","Documents, BSON, and collections","Connect with mongosh and a local database","Insert and inspect documents","Find queries and filters","Comparison and logical query operators","Projection and sorting","Update operators","Delete operations and safe filters","Schema flexibility and validation","Embedding versus referencing","Indexes and query basics","Connect an application with the MongoDB driver","MongoDB foundations knowledge check"]},
        {"slug":"mongodb-data-modeling","title":"Data Modeling and Aggregation","level":"intermediate","hours":16,"description":"Choose document structures and query patterns that match application workloads.","lessons":["Modeling around access patterns","One-to-one and one-to-many relationships","Embedding and document growth","Reference patterns and lookups","Compound indexes","Unique, sparse, and partial indexes","Aggregation pipeline fundamentals","Filtering, grouping, and projection stages","Array operators and update pipelines","Transactions and session basics","Schema validation rules","Pagination and stable ordering","Explain plans and query inspection","Backup and restore fundamentals",{"title":"Build a catalog query model","type":"project"},{"title":"MongoDB query coding exercise","type":"coding"}]},
        {"slug":"mongodb-advanced","title":"Advanced MongoDB Operations","level":"advanced","hours":16,"description":"Tune queries and operate MongoDB safely in production environments.","lessons":["Advanced index design and selectivity","Aggregation optimization","Diagnosing slow queries with explain","Replica sets and failover concepts","Read and write concerns","Transactions: costs and trade-offs","Sharding and partitioning fundamentals","Connection pools and application lifecycle","Change streams and event-driven updates","Data migrations and schema evolution","Access control and least privilege","Encryption and sensitive fields","Operational monitoring and alerts","Restore testing and recovery objectives","Performance investigation lab","MongoDB production readiness review"]}
      ]},
      {"slug":"postgresql","title":"PostgreSQL","description":"Build relational data models and reliable SQL-backed application features.","modules":[
        {"slug":"postgresql-foundations","title":"PostgreSQL Foundations","level":"basic","hours":14,"description":"Learn relational modeling, SQL, constraints, and everyday queries.","lessons":["Relational databases and PostgreSQL","Tables, rows, columns, and data types","Primary keys and identity columns","Create databases and tables","Insert, select, update, and delete","Filtering, sorting, and limiting results","NULL values and three-valued logic","Constraints and data integrity","Foreign keys and relationships","Joins: inner, left, and full","Aggregate functions and grouping","Subqueries and common table expressions","Indexes and query basics","Connect an application with a PostgreSQL client","PostgreSQL foundations knowledge check"]},
        {"slug":"postgresql-sql-and-modeling","title":"SQL, Modeling, and Transactions","level":"intermediate","hours":18,"description":"Design normalized schemas and express application operations safely in SQL.","lessons":["Normalization and relational trade-offs","One-to-one and many-to-many relationships","Composite keys and unique constraints","Advanced joins and lateral queries","Window functions","CTEs and recursive queries","Transactions and ACID properties","Isolation levels and concurrent access","Locks and deadlocks","Parameterized SQL and injection prevention","Views and materialized views","JSONB and relational document data","Migrations and schema versioning","Pagination and keyset queries","Read execution plans with EXPLAIN",{"title":"Build a transactional data feature","type":"project"},{"title":"SQL query coding exercise","type":"coding"}]},
        {"slug":"postgresql-advanced","title":"Advanced PostgreSQL","level":"advanced","hours":18,"description":"Tune database performance and operate PostgreSQL with resilience and security.","lessons":["Index types and advanced index design","EXPLAIN ANALYZE and query tuning","Statistics, vacuum, and analyze","Connection pooling and limits","Backup strategies and point-in-time recovery","Replication and high availability concepts","Roles, grants, and least privilege","Row-level security policy design","Partitioning and large tables","Advisory locks and concurrency patterns","Functions, triggers, and generated columns","Monitoring, logs, and slow queries","Data retention and operational maintenance","Database security hardening","Performance tuning lab","PostgreSQL production readiness review"]}
      ]},
      {"slug":"system-design","title":"System Design","description":"Reason about scalable web systems, data flows, and operational trade-offs.","modules":[
        {"slug":"system-design-foundations","title":"System Design Foundations","level":"basic","hours":12,"description":"Learn the core building blocks and vocabulary of distributed web systems.","lessons":["What system design is and how to scope a problem","Functional and non-functional requirements","Capacity estimates and back-of-the-envelope math","Latency, throughput, and availability","Client-server architecture","HTTP, DNS, and the request lifecycle","Monoliths and service boundaries","Relational and non-relational storage choices","Caching fundamentals","Load balancing concepts","Queues and asynchronous work","Reliability and failure modes","Design a simple URL service","System design foundations knowledge check"]},
        {"slug":"system-design-scale","title":"Data, APIs, and Scaling","level":"intermediate","hours":16,"description":"Apply scaling patterns while balancing consistency, cost, and complexity.","lessons":["Horizontal and vertical scaling","Stateless services and session storage","Database replication and read scaling","Partitioning and sharding strategies","Indexes and workload-driven data models","Cache invalidation and cache consistency","CDNs and edge delivery","Message queues and event-driven workflows","Idempotency and retry-safe APIs","Rate limiting and backpressure","Consistency models and CAP trade-offs","Search systems and indexing pipelines","Object storage and media delivery","Observability and service-level objectives",{"title":"Design a notification platform","type":"project"},{"title":"System design trade-off exercise","type":"coding"}]},
        {"slug":"system-design-advanced","title":"Advanced Distributed Systems","level":"advanced","hours":18,"description":"Design for resilience, evolution, and predictable operation at scale.","lessons":["Distributed transactions and sagas","Eventual consistency and reconciliation","Exactly-once delivery myths and practical guarantees","Resilience patterns: bulkheads and circuit breakers","Disaster recovery and multi-region design","Data privacy and threat boundaries","Schema and API evolution","Service decomposition and organizational cost","Workload isolation and noisy neighbors","Capacity planning and cost controls","Consistency, availability, and partition trade-offs","Failure injection and chaos testing","SLOs, error budgets, and incident response","Design a multi-region application","Architecture decision records","Advanced system design review"]}
      ]},
      {"slug":"web-security","title":"Web Security","description":"Protect web applications by understanding threats and applying defense in depth.","modules":[
        {"slug":"web-security-foundations","title":"Web Security Foundations","level":"basic","hours":12,"description":"Understand browser security, identity, and common application vulnerabilities.","lessons":["Security mindset and threat modeling basics","HTTP security foundations","Same-origin policy and browser boundaries","Cookies, sessions, and secure attributes","Authentication versus authorization","Password storage and credential safety","Cross-site scripting and output encoding","SQL injection and parameterized queries","Cross-site request forgery","Transport security and HTTPS","Secrets management fundamentals","Dependency risk and updates",{"title":"Create a basic threat model","type":"project"},{"title":"Web security foundations knowledge check","type":"quiz"}]},
        {"slug":"web-security-application-defense","title":"Application Defense","level":"intermediate","hours":16,"description":"Apply secure defaults to APIs, forms, sessions, and data handling.","lessons":["Input validation and canonicalization","Context-aware output encoding","Content Security Policy","Security headers and browser protections","OAuth and OpenID Connect concepts","Session fixation and rotation","CSRF tokens and SameSite trade-offs","Access control and object ownership","API authentication and token handling","Rate limits and abuse prevention","File upload validation and storage","CORS configuration","Logging without leaking sensitive data","Secure error handling","Web security testing and scanners","Harden a sample API","Application defense code exercise"]},
        {"slug":"web-security-advanced","title":"Advanced Web Security","level":"advanced","hours":16,"description":"Use security architecture and verification practices to manage deeper application risks.","lessons":["OWASP Top 10 risk analysis","Server-side request forgery defenses","Request smuggling and parser boundaries","Prototype pollution and unsafe deserialization","Supply-chain security and provenance","Cryptographic choices and key lifecycle","Multi-tenant authorization boundaries","Security architecture and trust boundaries","Abuse cases and adversarial testing","Incident response and evidence handling","Privacy by design and data minimization","Security reviews in CI/CD","Penetration testing scope and safe practice","Build a defense-in-depth checklist","Advanced web threat model review"]}
      ]},
      {"slug":"devops","title":"DevOps","description":"Ship applications reliably with automation, containers, observability, and safe releases.","modules":[
        {"slug":"devops-foundations","title":"DevOps Foundations","level":"basic","hours":12,"description":"Understand delivery pipelines, environments, and operational fundamentals.","lessons":["What DevOps means in a software team","Development, staging, and production environments","Shell and process fundamentals","Environment variables and configuration","Build artifacts and reproducible builds","Git-based collaboration and delivery","Continuous integration concepts","Automated checks and test stages","Application logs and basic monitoring","HTTP health checks","Deployment strategies overview","Secrets and least privilege",{"title":"Create a basic CI pipeline","type":"project"},{"title":"DevOps foundations knowledge check","type":"quiz"}]},
        {"slug":"devops-containers-and-delivery","title":"Containers and Delivery","level":"intermediate","hours":18,"description":"Package applications and automate repeatable testing and deployment workflows.","lessons":["Container images and registries","Writing and understanding a Dockerfile","Build layers and image size","Container networking and ports","Persistent data and volumes","Compose for local environments","CI workflows and pipeline stages","Test, build, and publish artifacts","Infrastructure as code concepts","Reverse proxies and TLS termination","Deployment strategies: rolling and blue-green","Database migrations during releases","Secrets in CI and deployment","Metrics, dashboards, and alerts","Backups and restore practice","Deploy a containerized web service","Delivery pipeline code exercise"]},
        {"slug":"devops-advanced","title":"Advanced Operations and Reliability","level":"advanced","hours":18,"description":"Operate production workloads through reliability engineering and controlled change.","lessons":["Infrastructure automation and drift","Kubernetes concepts and workload primitives","Autoscaling and resource requests","Service discovery and internal networking","Observability: metrics, logs, and traces","Service-level indicators and objectives","Error budgets and release decisions","Incident response and postmortems","Capacity and cost optimization","Progressive delivery and feature flags","Disaster recovery and recovery testing","Supply-chain controls and artifact signing","Zero-downtime schema evolution","Production access and audit trails","Reliability game day","Production operations readiness review"]}
      ]},
      {"slug":"ai-for-web-developers","title":"AI for Web Developers","description":"Integrate AI capabilities into web products with sound engineering and evaluation.","modules":[
        {"slug":"ai-web-foundations","title":"AI Foundations for Web Developers","level":"basic","hours":12,"description":"Understand modern AI capabilities and the boundaries of model-powered features.","lessons":["AI, machine learning, and language models","How text generation models work at a high level","Tokens, context windows, and model limits","Common AI product patterns","Choosing an AI feature that solves a real problem","Model APIs and request-response basics","Prompt structure and clear instructions","Handling latency and loading states","Privacy and sensitive data considerations","Output validation and user expectations",{"title":"Build a simple model-powered web feature","type":"project"},{"title":"AI foundations knowledge check","type":"quiz"}]},
        {"slug":"ai-web-applications","title":"AI-Powered Web Applications","level":"intermediate","hours":16,"description":"Connect model APIs to web applications with retrieval, tools, and evaluation loops.","lessons":["Calling a model API from a trusted server","Streaming model responses to the browser","Prompt templates and versioning","Structured outputs and schema validation","Embeddings and semantic similarity","Retrieval-augmented generation concepts","Chunking and document preparation","Vector search and metadata filters","Tool calling and controlled actions","Conversation state and context management","Retries, timeouts, and rate limits","Cost monitoring and token budgets","Evaluation datasets and quality checks","Human review and feedback loops","Build a grounded documentation assistant","AI application code exercise"]},
        {"slug":"ai-web-advanced","title":"Advanced AI Engineering","level":"advanced","hours":16,"description":"Build observable, secure, and measurable AI systems suitable for production use.","lessons":["AI system architecture and failure boundaries","Retrieval quality and ranking evaluation","Prompt injection and untrusted content","Data isolation and tenant-aware retrieval","Model selection and task routing","Caching and deterministic response design","Guardrails, refusals, and output constraints","AI observability and trace evaluation","Offline and online evaluation strategies","Cost, latency, and quality trade-offs","Privacy, retention, and model provider controls","Agent workflows and bounded tool permissions","Fallback strategies and graceful degradation","AI feature rollout and monitoring","Evaluate an AI-powered product feature","Advanced AI system design review"]}
      ]}
    ]$data$::jsonb)
  loop
    insert into public.courses (
      learning_path_id, title, slug, description, order_index, is_published
    ) values (
      path_id,
      course_data->>'title',
      course_data->>'slug',
      course_data->>'description',
      course_index,
      true
    )
    on conflict (learning_path_id, slug) do update set
      title = excluded.title,
      description = excluded.description,
      order_index = excluded.order_index,
      is_published = excluded.is_published
    returning id into current_course_id;

    module_index := 0;
    for module_data in
      select value from jsonb_array_elements(course_data->'modules')
    loop
      module_index := module_index + 1;
      insert into public.modules (
        course_id, title, slug, description, level, order_index, estimated_hours, is_published
      ) values (
        current_course_id,
        module_data->>'title',
        module_data->>'slug',
        module_data->>'description',
        module_data->>'level',
        module_index,
        (module_data->>'hours')::integer,
        true
      )
      on conflict (course_id, slug) do update set
        title = excluded.title,
        description = excluded.description,
        level = excluded.level,
        order_index = excluded.order_index,
        estimated_hours = excluded.estimated_hours,
        is_published = excluded.is_published
      returning id into current_module_id;

      for lesson_record in
        select value, ordinality::integer as order_index
        from jsonb_array_elements(module_data->'lessons') with ordinality
      loop
        lesson_title := case
          when jsonb_typeof(lesson_record.value) = 'string'
            then lesson_record.value #>> '{}'
          else lesson_record.value->>'title'
        end;
        lesson_slug := trim(both '-' from regexp_replace(
          regexp_replace(lower(lesson_title), '[^a-z0-9]+', '-', 'g'),
          '(^-|-$)', '', 'g'
        ));
        lesson_kind := coalesce(lesson_record.value->>'type', 'lesson');

        insert into public.lessons (
          module_id, title, slug, description, lesson_type, order_index,
          estimated_minutes, is_published
        ) values (
          current_module_id,
          lesson_title,
          lesson_slug,
          case
            when jsonb_typeof(lesson_record.value) = 'object'
              then lesson_record.value->>'description'
            else null
          end,
          lesson_kind,
          lesson_record.order_index,
          15,
          true
        )
        on conflict (module_id, slug) do update set
          title = excluded.title,
          description = excluded.description,
          lesson_type = excluded.lesson_type,
          order_index = excluded.order_index,
          estimated_minutes = excluded.estimated_minutes,
          is_published = excluded.is_published;
      end loop;
    end loop;
    course_index := course_index + 1;
  end loop;
end;
$curriculum$;

notify pgrst, 'reload schema';
