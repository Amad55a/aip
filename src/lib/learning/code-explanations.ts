export function explainCodeExample(title: string, language: string, code: string) {
  if (language === "html") {
    if (/<form\b/i.test(code)) {
      return "The form groups related controls for submission. Labels name their controls, `name` identifies submitted values, and native input types help the browser validate input; the server must still validate it.";
    }
    if (/<img\b/i.test(code)) {
      return "The `img` element embeds an image and its `alt` text communicates informative content to users who cannot see it. A figure and caption associate visible context with the image.";
    }
    if (/<h1\b/i.test(code) && /<p\b/i.test(code)) {
      return "The browser parses the tags as elements rather than displaying them as text. The `h1` gives the document's main content a heading, and `p` marks a paragraph.";
    }
    return "The browser parses these tags into DOM elements. Read the nesting to understand the parent-child structure, then choose elements whose semantics match the content.";
  }
  if (language === "css") {
    if (/display:\s*grid/i.test(code)) return "The selector targets matching elements and the declarations set up a grid formatting context. Track sizing and `gap` control how child items are arranged.";
    if (/display:\s*flex/i.test(code)) return "The selector targets matching elements and `display: flex` lays out children along a main axis. Alignment, wrapping, and `gap` adapt that relationship to the available space.";
    return "The selector identifies which elements receive the declarations. Each property controls one part of presentation; inspect the computed styles to see how the cascade resolves them.";
  }
  if (language === "javascript" || language === "jsx") {
    if (/async|await|fetch\(/.test(code)) return "The asynchronous operation produces a result later. Check its failure path as well as its success path, and validate data before relying on it.";
    if (/\.map\(|\.filter\(/.test(code)) return "`filter` selects matching values and `map` transforms each selected value into a new array. The original collection is not mutated by these methods.";
    if (/function|=>/.test(code)) return "The function takes explicit inputs and performs a sequence of operations. Trace each input to the returned value, then test both a normal and an edge-case input.";
    return "The statements execute in order, with values passed through expressions and function calls. Trace the data flow and verify the resulting behavior rather than assuming the code succeeded.";
  }
  if (language === "sql") return "The schema declares typed columns and constraints; the query selects an explicit result set. Bound parameters keep values separate from SQL syntax.";
  if (language === "yaml") return "The indentation defines the workflow's nested structure: a job contains ordered steps, and each step performs one repeatable build or verification action.";
  if (language === "bash") return "Each command observes or changes repository state. Review the diff and staged contents before committing so unrelated or sensitive files are not included.";
  if (language === "text") return "Read the diagram from the request's starting point through each component. The annotations identify boundaries where validation, latency, or failure handling must be designed.";
  return `This ${language} snippet demonstrates “${title}.” Trace its inputs and operations, then compare its observable result with the goal of the lesson.`;
}
