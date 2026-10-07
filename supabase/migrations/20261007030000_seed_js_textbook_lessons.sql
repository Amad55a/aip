update public.lessons as lesson
set
  content = case
    when lesson.slug = 'javascript-browser-server' then
      'JavaScript runs in the browser and can also run on the server using runtimes such as Node.js. In the browser it responds to user actions and updates the page.'
    when lesson.slug = 'script-tags' then
      'A script can be added directly in HTML or loaded from an external file. Module scripts are useful when you want modern import and export behavior.'
    when lesson.slug = 'values-variables' then
      'JavaScript stores values in variables. Use const when the value should not be reassigned, and let when it should change over time.'
    when lesson.slug = 'primitive-types' then
      'JavaScript has primitive values such as strings, numbers, booleans, null, undefined, and symbols. Type conversion is part of everyday code.'
    when lesson.slug = 'operators' then
      'Operators combine values and create expressions. They include arithmetic, comparison, logical, assignment, and spread operators.'
    when lesson.slug = 'strings' then
      'Strings are sequences of characters. JavaScript gives you helpful string methods for joining, slicing, replacing, and checking content.'
    when lesson.slug = 'numbers-bigint' then
      'JavaScript numbers follow IEEE-754 rules, so some calculations are approximate. BigInt handles large integers when needed.'
    when lesson.slug = 'booleans-nullish' then
      'Boolean logic decides when code should run. JavaScript also has nullish values and truthiness rules that affect conditions.'
    when lesson.slug = 'arrays' then
      'Arrays store ordered collections of values. Common methods such as map, filter, and reduce help transform and inspect data.'
    when lesson.slug = 'objects' then
      'Objects store related data as key-value pairs. Destructuring helps read values in a clean and readable way.'
    when lesson.slug = 'conditionals' then
      'Conditionals let code make decisions. If, else, and switch statements allow the program to follow different paths.'
    when lesson.slug = 'loops' then
      'Loops allow code to repeat. Use loops when you need to process a list, check values, or perform repeated tasks.'
    when lesson.slug = 'functions' then
      'Functions are reusable blocks of code. They can take inputs, return output, and keep logic organized.'
    when lesson.slug = 'scope' then
      'Scope defines which variables are available from different parts of the code. Understanding scope prevents confusing bugs.'
    when lesson.slug = 'errors-debugging' then
      'JavaScript can throw errors. A good developer reads the error message, tests the broken behavior, and fixes the root cause.'
    when lesson.slug = 'json' then
      'JSON is a lightweight data format used across the web. It is easy to read, easy to send, and easy to convert to JavaScript values.'
    else lesson.content
  end,
  explanation = case
    when lesson.slug = 'javascript-browser-server' then
      '## JavaScript in context

JavaScript is the language of interactive behavior. In the browser, it reacts to clicks, form input, and page updates. On the server, it can read files, create APIs, and run background logic.

The JavaScript you write in the browser usually works with the DOM, the document model created from HTML.'
    when lesson.slug = 'script-tags' then
      '## Loading JavaScript

You add JavaScript to a page with a script tag or by loading an external script file. Scripts are often placed near the end of the body or loaded as modules when you want modern syntax.'
    when lesson.slug = 'values-variables' then
      '## Variables and values

A variable stores a value so you can reuse it later. Use a clear name and choose `const` when the value should stay fixed. Use `let` only when the value must change.'
    when lesson.slug = 'primitive-types' then
      '## Primitive values

JavaScript has primitive values such as strings, numbers, booleans, undefined, null, and symbols. You can also convert values from one type to another when needed.'
    when lesson.slug = 'operators' then
      '## Operators and expressions

Operators combine values to make expressions. Arithmetic operators calculate numbers, comparison operators check values, and logical operators combine conditions.'
    when lesson.slug = 'strings' then
      '## Strings

Strings are text values. They can be created with single quotes, double quotes, or template literals. Template literals make it easy to insert variables into text.'
    when lesson.slug = 'numbers-bigint' then
      '## Numbers and precision

JavaScript numbers are floating-point values, so some calculations may have small precision issues. BigInt is used for very large integers when you need exact integer math.'
    when lesson.slug = 'booleans-nullish' then
      '## Conditions and truthiness

Boolean values are used in conditions. JavaScript evaluates many non-boolean values as truthy or falsy, so understanding those rules matters when writing logic.'
    when lesson.slug = 'arrays' then
      '## Arrays

Arrays let you store lists of values. They are useful for collections, iteration, and transformations. Common methods help you filter, map, and reduce data.'
    when lesson.slug = 'objects' then
      '## Objects

Objects store related data in key-value pairs. They are one of the most important JavaScript building blocks. Destructuring makes it easier to read specific values.'
    when lesson.slug = 'conditionals' then
      '## Making decisions

Conditionals allow your program to take different paths. An if statement tests a value, and an else branch handles the opposite case.'
    when lesson.slug = 'loops' then
      '## Repetition

Loops repeat code without writing it multiple times. Use them to process arrays, repeat a task, or check values until a condition changes.'
    when lesson.slug = 'functions' then
      '## Functions

Functions let you group related logic into reusable pieces. They help make code shorter, easier to test, and easier to understand.'
    when lesson.slug = 'scope' then
      '## Scope and closures

Scope controls where variables can be used. Variables declared inside a function are not usually available outside it, which keeps code more predictable.'
    when lesson.slug = 'errors-debugging' then
      '## Errors and debugging

Errors are part of normal development. Read the message, isolate the broken code, and test the fix with a small example.'
    when lesson.slug = 'json' then
      '## JSON

JSON is a data format that stores information in a simple structure of keys and values. It is widely used in browser apps and APIs.'
    else lesson.explanation
  end,
  examples = case
    when lesson.slug = 'values-variables' then
      '[{"title":"Variable example","body":"A variable can store a value and then be reused in later calculations."}]'::jsonb
    when lesson.slug = 'functions' then
      '[{"title":"Function example","body":"A function can take a name argument and return a welcome message."}]'::jsonb
    when lesson.slug = 'arrays' then
      '[{"title":"Array example","body":"An array can hold several values, and a loop can process each one in order."}]'::jsonb
    when lesson.slug = 'conditionals' then
      '[{"title":"Decision example","body":"If a user is logged in, show a welcome message; otherwise show a sign-in prompt."}]'::jsonb
    else lesson.examples
  end,
  code_examples = case
    when lesson.slug = 'values-variables' then
      '[{"title":"Variables and const","language":"javascript","code":"const name = \"Ali\";\nlet score = 5;\n\nscore = score + 1;\nconsole.log(name);\nconsole.log(score);","preview":false}]'::jsonb
    when lesson.slug = 'functions' then
      '[{"title":"Function that returns a greeting","language":"javascript","code":"function greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet(\"Ahmed\"));","preview":false}]'::jsonb
    when lesson.slug = 'arrays' then
      '[{"title":"Array and loop","language":"javascript","code":"const fruits = [\"apple\", \"banana\", \"orange\"];\n\nfor (const fruit of fruits) {\n  console.log(fruit);\n}","preview":false}]'::jsonb
    when lesson.slug = 'conditionals' then
      '[{"title":"If statement","language":"javascript","code":"const score = 85;\n\nif (score >= 80) {\n  console.log(\"Great job!\");\n} else {\n  console.log(\"Keep practicing.\");\n}","preview":false}]'::jsonb
    else lesson.code_examples
  end,
  notes = case
    when lesson.slug = 'values-variables' then
      '["Use const by default.","Use let when a value changes.","Choose readable names for variables."]'::jsonb
    when lesson.slug = 'functions' then
      '["Functions help group logic.","A function should do one clear job.","Return values make functions reusable."]'::jsonb
    when lesson.slug = 'arrays' then
      '["Arrays are ordered lists.","Use loops to inspect each item.","Methods like map and filter help transform data."]'::jsonb
    when lesson.slug = 'conditionals' then
      '["Conditions decide program flow.","Use clear comparisons.","Keep branch logic readable."]'::jsonb
    else lesson.notes
  end,
  common_mistakes = case
    when lesson.slug = 'values-variables' then
      '["Using let when const would be clearer.","Reusing a variable name in a confusing way.","Forgetting that assignment changes the value."]'::jsonb
    when lesson.slug = 'functions' then
      '["Forgetting to return a value.","Making functions too large and unclear.","Not naming arguments meaningfully."]'::jsonb
    when lesson.slug = 'arrays' then
      '["Using loops without understanding index order.","Mutating arrays unexpectedly.","Ignoring the data type of each element."]'::jsonb
    when lesson.slug = 'conditionals' then
      '["Using assignment instead of comparison.","Writing overly complicated branch logic.","Skipping the else path when it matters."]'::jsonb
    else lesson.common_mistakes
  end,
  practice = case
    when lesson.slug = 'values-variables' then
      '["Create a variable for your name and log it to the console.","Change the value of a number and print the new value.","Write a short explanation of why const is often a safer default."]'::jsonb
    when lesson.slug = 'functions' then
      '["Write a function that adds two numbers.","Call it with different values and check the output.","Create a greeting function for a name." ]'::jsonb
    when lesson.slug = 'arrays' then
      '["Create an array of three student names.","Use a loop to print each name.","Add a new item to the array and show the result."]'::jsonb
    when lesson.slug = 'conditionals' then
      '["Write an if statement that checks if a number is greater than 10.","Add an else branch with a different message.","Try the same code with several values to confirm the logic." ]'::jsonb
    else lesson.practice
  end
where lesson.slug in (
  'javascript-browser-server',
  'script-tags',
  'values-variables',
  'primitive-types',
  'operators',
  'strings',
  'numbers-bigint',
  'booleans-nullish',
  'arrays',
  'objects',
  'conditionals',
  'loops',
  'functions',
  'scope',
  'errors-debugging',
  'json',
  'number-game-project',
  'javascript-fundamentals-knowledge-check'
);
