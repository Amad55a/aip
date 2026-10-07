update public.lessons as lesson
set
  content = case
    when lesson.slug = 'what-is-html' then
      'HTML stands for HyperText Markup Language. It gives a browser the structure and meaning of a page before CSS adds presentation and JavaScript adds behavior.'
    when lesson.slug = 'how-the-web-works' then
      'The browser requests a page, the server sends HTML, and the browser reads it to build a document that can be styled and interacted with.'
    when lesson.slug = 'html-document-structure' then
      'Every HTML page follows a clear structure: a document type, an html root, a head for metadata, and a body for visible content.'
    when lesson.slug = 'doctype-declaration' then
      'The doctype declaration tells the browser which HTML standard to use so the page renders consistently in modern browsers.'
    when lesson.slug = 'html-head-body' then
      'The html element wraps the full document. The head contains metadata and the body contains the visible content.'
    when lesson.slug = 'headings-outline' then
      'Headings organize a page into a readable outline. Use one main heading and use lower-level headings to show structure.'
    when lesson.slug = 'paragraphs-line-breaks' then
      'Paragraphs group text into blocks. Line breaks are useful for short, intentional breaks, but structure should usually come from tags such as p and headings.'
    when lesson.slug = 'text-formatting' then
      'HTML gives text meaning and emphasis. A browser can display bold, italics, strong emphasis, and code without changing the content itself.'
    when lesson.slug = 'links-anchor-elements' then
      'Links connect pages and resources. The anchor element plus the href attribute makes navigation possible inside a website and across the web.'
    when lesson.slug = 'images-alt-text' then
      'Images add visual information to a page. Always add helpful alternative text so screen readers and users without image access can still understand the content.'
    when lesson.slug = 'lists' then
      'Lists help group related items clearly. Use ordered lists for steps, unordered lists for general items, and description lists for terms and definitions.'
    else lesson.content
  end,
  explanation = case
    when lesson.slug = 'what-is-html' then
      '## What is HTML?

HTML is the language that describes the structure and meaning of a web page. It tells the browser which parts are headings, paragraphs, links, images, forms, and other content.

HTML is not the same as CSS or JavaScript. CSS decides how the page looks, and JavaScript decides how it behaves. HTML is the foundation of the page itself.

## Why does it matter?

Without HTML, the browser would not know how to organize the content on a page. The structure you create with HTML also helps accessibility tools, search engines, and other developer tools understand the page.'
    when lesson.slug = 'how-the-web-works' then
      '## How the web works

When you open a web page, your browser sends a request to a server. The server responds with HTML, CSS, JavaScript, and other assets. The browser reads the HTML and builds the page from it.

This process is the foundation of how websites work. The browser parses HTML, creates the document structure, then applies CSS and runs JavaScript to make the page interactive.'
    when lesson.slug = 'html-document-structure' then
      '## Basic HTML structure

Every HTML document follows a familiar pattern: the document type, the html root, the head, and the body. This structure keeps the page valid and predictable.

The head contains metadata such as the page title and links to stylesheets. The body contains the visible content that users read and interact with.'
    when lesson.slug = 'doctype-declaration' then
      '## Why the doctype matters

The doctype declaration appears at the very top of the document. It tells the browser to use the correct HTML parsing mode so the page is interpreted consistently.

Modern HTML uses `<!DOCTYPE html>`. It is the first line in a normal HTML5 document and does not affect the visible content.'
    when lesson.slug = 'html-head-body' then
      '## The html, head, and body elements

The `html` element wraps the whole page. The `head` element contains metadata, such as the title, character encoding, and links to external resources. The `body` element contains the visible content of the page.'
    when lesson.slug = 'headings-outline' then
      '## Headings and structure

Headings help readers and browsers understand the page structure. They also help screen readers announce content in a meaningful order.

Use `h1` for the main heading and use lower-level headings for subtopics. In most pages, you should not skip levels without reason.'
    when lesson.slug = 'paragraphs-line-breaks' then
      '## Paragraphs and breaks

The `p` element starts a new paragraph. Paragraphs help break long text into readable blocks.

`br` creates a line break inside a block of text, but it is usually better to use structural tags like `p` and headings when you want meaningful separation.'
    when lesson.slug = 'text-formatting' then
      '## Text formatting

HTML gives meaning to text, not just appearance. Tags such as `strong`, `em`, `b`, and `i` help communicate emphasis or importance. CSS can then decide how these elements should look.'
    when lesson.slug = 'links-anchor-elements' then
      '## Links

The anchor element `a` creates links. The most important attribute is `href`, which tells the browser where the link should go.

Links can point to another page, a section on the same page, an email address, or a phone number. They are the foundation of navigation on the web.'
    when lesson.slug = 'images-alt-text' then
      '## Images and alternative text

The `img` element adds an image to the page. The `src` attribute points to the image file, and the `alt` attribute provides text that describes the image.

Alternative text is important because screen readers use it, and some users may not be able to see the image. A descriptive `alt` value is much better than leaving it empty.'
    when lesson.slug = 'lists' then
      '## Lists

Lists are useful when you need to group related items. HTML provides unordered lists, ordered lists, and description lists.

Use an ordered list for steps, unordered list for items with no required order, and a description list when you need a term and a definition.'
    else lesson.explanation
  end,
  examples = case
    when lesson.slug = 'what-is-html' then
      '[{"title":"A small HTML document","body":"The browser reads the markup and turns it into a document with meaning. The title becomes the browser tab title, while the heading and paragraph become visible content."}]'::jsonb
    when lesson.slug = 'how-the-web-works' then
      '[{"title":"Request and response flow","body":"A browser requests a page from a server. The server sends HTML and the browser parses it to build the page the user sees."}]'::jsonb
    when lesson.slug = 'html-document-structure' then
      '[{"title":"Basic page skeleton","body":"Each HTML document generally begins with a doctype, then the html element, then head and body sections."}]'::jsonb
    when lesson.slug = 'headings-outline' then
      '[{"title":"Document outline","body":"Use one h1 for the page topic and use h2, h3, and so on to show subtopics clearly."}]'::jsonb
    when lesson.slug = 'links-anchor-elements' then
      '[{"title":"Navigation example","body":"Use a link to move to another page or to a section within the same page with an href value such as #contact."}]'::jsonb
    when lesson.slug = 'images-alt-text' then
      '[{"title":"Accessible image example","body":"The image is displayed, but the alt text still communicates the meaning when the image itself is unavailable."}]'::jsonb
    when lesson.slug = 'lists' then
      '[{"title":"List example","body":"Use a list to show grouped items in a clear reading order for the user."}]'::jsonb
    else lesson.examples
  end,
  code_examples = case
    when lesson.slug = 'what-is-html' then
      '[{"title":"A first HTML element","language":"html","code":"<h1>Hello, world!</h1>\n<p>This is my first HTML page.</p>","preview":true}]'::jsonb
    when lesson.slug = 'html-document-structure' then
      '[{"title":"HTML page skeleton","language":"html","code":"<!DOCTYPE html>\n<html>\n  <head>\n    <title>My Page</title>\n  </head>\n  <body>\n    <h1>Welcome!</h1>\n    <p>This is a simple web page.</p>\n  </body>\n</html>","preview":true}]'::jsonb
    when lesson.slug = 'headings-outline' then
      '[{"title":"Headings and structure","language":"html","code":"<h1>TechPath AI</h1>\n<h2>Learn web development</h2>\n<h3>HTML basics</h3>\n<p>Start with structure before styling.</p>","preview":true}]'::jsonb
    when lesson.slug = 'links-anchor-elements' then
      '[{"title":"Link example","language":"html","code":"<a href=\"https://example.com\">Visit example.com</a>\n<a href=\"#contact\">Jump to contact</a>","preview":true}]'::jsonb
    when lesson.slug = 'images-alt-text' then
      '[{"title":"Image with alt text","language":"html","code":"<img src=\"/images/profile.jpg\" alt=\"A smiling developer holding a laptop\">", "preview": true}]'::jsonb
    when lesson.slug = 'lists' then
      '[{"title":"List example","language":"html","code":"<ul>\n  <li>HTML</li>\n  <li>CSS</li>\n  <li>JavaScript</li>\n</ul>\n\n<ol>\n  <li>Open the browser</li>\n  <li>Write the HTML</li>\n  <li>Preview the page</li>\n</ol>","preview":true}]'::jsonb
    else lesson.code_examples
  end,
  notes = case
    when lesson.slug = 'what-is-html' then
      '["HTML gives structure and meaning, not visual design.","Browsers interpret HTML and build a document tree.","Use HTML elements for purpose, then use CSS for presentation."]'::jsonb
    when lesson.slug = 'how-the-web-works' then
      '["The browser requests assets from a server.","HTML is the starting point of a page.","CSS and JavaScript are applied after the browser reads the HTML."]'::jsonb
    when lesson.slug = 'html-document-structure' then
      '["The document type must appear first.","The html element wraps the page.","The head is metadata, while the body contains visible content."]'::jsonb
    when lesson.slug = 'headings-outline' then
      '["Use one h1 per main page topic.","Use headings to make content easier to scan.","Do not use heading levels only for visual size."]'::jsonb
    when lesson.slug = 'links-anchor-elements' then
      '["The href value is the destination for the link.","Use a meaningful link text.","The anchor element is the mechanism for navigation."]'::jsonb
    when lesson.slug = 'images-alt-text' then
      '["Always add alt text when it adds meaning.","The alt attribute is also useful for accessibility.","Image tags are void elements and do not need a closing tag."]'::jsonb
    when lesson.slug = 'lists' then
      '["Ordered lists are useful for steps.","Unordered lists are useful for item groups.","Description lists pair a term with its explanation."]'::jsonb
    else lesson.notes
  end,
  common_mistakes = case
    when lesson.slug = 'what-is-html' then
      '["Confusing HTML with CSS: structure and meaning belong to HTML.","Forgetting that browsers do not show tags; they render the final document.","Writing content without a meaningful element structure."]'::jsonb
    when lesson.slug = 'how-the-web-works' then
      '["Assuming the browser instantly renders without networking.","Forgetting that HTML is only one part of the page load.","Ignoring that CSS and JavaScript must be requested too."]'::jsonb
    when lesson.slug = 'html-document-structure' then
      '["Missing the doctype declaration.","Placing visible content in the head element.","Forgetting to close the html, head, or body elements."]'::jsonb
    when lesson.slug = 'headings-outline' then
      '["Using h1 for every heading on the page.","Choosing heading levels only for appearance.","Skipping levels without a good reason."]'::jsonb
    when lesson.slug = 'links-anchor-elements' then
      '["Using vague text like click here.","Forgetting the href attribute.","Mixing navigation links with button actions."]'::jsonb
    when lesson.slug = 'images-alt-text' then
      '["Leaving alt blank when the image adds meaning.","Using generic text such as image.","Forgetting that alt helps accessible users too."]'::jsonb
    when lesson.slug = 'lists' then
      '["Using a paragraph instead of a list when the content is a list.","Forgetting semantic meaning for steps and grouped items.","Mixing list items with unrelated text."]'::jsonb
    else lesson.common_mistakes
  end,
  practice = case
    when lesson.slug = 'what-is-html' then
      '["Create a page with one main heading and two short paragraphs about something you enjoy.","Add a link to a relevant website and explain which part is structure and which part is presentation.","Open the page in a browser and inspect the document tree in developer tools."]'::jsonb
    when lesson.slug = 'how-the-web-works' then
      '["Explain in your own words what the browser does after it receives HTML.","List the main parts of a page request and response cycle.","Try opening a simple page and inspecting the network tab in the browser."]'::jsonb
    when lesson.slug = 'html-document-structure' then
      '["Write a small HTML document with a title, a heading, and a paragraph.","Place each section in the correct part of the page structure.","Check that the page still looks simple and readable without CSS."]'::jsonb
    when lesson.slug = 'headings-outline' then
      '["Create a page with one h1 and a few h2 headings.","Organize a short article using a clear outline.","Check that the document reads naturally in order." ]'::jsonb
    when lesson.slug = 'links-anchor-elements' then
      '["Create a navigation list with three links.","Link one item to another page and another to a section within the same page.","Use meaningful link text that describes the destination."]'::jsonb
    when lesson.slug = 'images-alt-text' then
      '["Add an image with descriptive alt text.","Write one alt description that communicates the meaning of the picture.","Check that your code uses the correct image source and path."]'::jsonb
    when lesson.slug = 'lists' then
      '["Write an ordered list for a simple process.","Write an unordered list for a set of tools or ideas.","Create a description list for a term and its meaning."]'::jsonb
    else lesson.practice
  end
where lesson.slug in (
  'what-is-html',
  'how-the-web-works',
  'html-document-structure',
  'doctype-declaration',
  'html-head-body',
  'headings-outline',
  'paragraphs-line-breaks',
  'text-formatting',
  'links-anchor-elements',
  'images-alt-text',
  'lists',
  'semantic-profile-page',
  'html-basics-knowledge-check'
);
