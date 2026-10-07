update public.lessons as lesson
set
  content = case
    when lesson.slug = 'what-css-does' then
      'CSS stands for Cascading Style Sheets. It controls the appearance of HTML content: colors, spacing, layout, typography, and responsiveness.'
    when lesson.slug = 'style-application' then
      'CSS can be written inline, embedded in the head, or placed in a separate stylesheet linked to the page. Separate stylesheets are the most maintainable approach.'
    when lesson.slug = 'css-rules' then
      'A CSS rule has a selector and one or more declarations. The selector chooses which element or elements the rule affects.'
    when lesson.slug = 'selectors' then
      'Selectors target elements by tag, class, id, or attribute. They let you apply styles in a precise and reusable way.'
    when lesson.slug = 'selectors-combinators' then
      'Combinators and selector lists let you target elements based on their relationship to other elements or target multiple selectors in one rule.'
    when lesson.slug = 'cascade-specificity' then
      'The cascade decides which styles win when multiple rules match the same element. Specificity and source order are important parts of CSS behavior.'
    when lesson.slug = 'colors' then
      'CSS colors can use names, hex values, rgb values, hsla values, and other formats. Colors control text, backgrounds, borders, and effects.'
    when lesson.slug = 'length-units' then
      'CSS uses length units such as px, em, rem, %, vw, and vh to define sizes and spacing. The right unit depends on the design goal.'
    when lesson.slug = 'box-model' then
      'Every element has a box model: content, padding, border, and margin. Understanding this model is essential for layout and spacing.'
    when lesson.slug = 'margin-padding-border' then
      'Margin adds space outside the element, padding adds space inside the element, and border defines the surrounding line.'
    when lesson.slug = 'typography' then
      'Typography controls the look of text. Font families, line height, letter spacing, and font weight all affect readability.'
    when lesson.slug = 'backgrounds' then
      'Background properties set color, gradients, and image treatment. They help create a clear visual hierarchy and polished layouts.'
    when lesson.slug = 'display-values' then
      'Display properties determine how elements participate in layout. Block elements fill a row, while inline elements sit within text flow.'
    when lesson.slug = 'responsive-thinking' then
      'Responsive design begins with flexible layouts and scalable sizes. A page should adapt gracefully to different screen sizes.'
    else lesson.content
  end,
  explanation = case
    when lesson.slug = 'what-css-does' then
      '## What CSS does

CSS gives HTML its visual presentation. It decides colors, spacing, positioning, fonts, borders, layout, and responsiveness.

HTML gives structure. CSS gives style. Together, the page becomes readable and visually organized.'
    when lesson.slug = 'style-application' then
      '## How CSS is applied

CSS can be written in three ways: inline, inside a style tag, or in an external stylesheet. The external stylesheet is usually the cleanest choice because styles can be reused across pages.'
    when lesson.slug = 'css-rules' then
      '## CSS rules

A CSS rule contains a selector and declarations. The selector tells the browser which elements the rule applies to. The declarations tell the browser what to change.'
    when lesson.slug = 'selectors' then
      '## Selectors

Selectors let you target elements precisely. You can style all paragraphs, a class of elements, a single element with an id, or elements with a specific attribute.'
    when lesson.slug = 'selectors-combinators' then
      '## Combinators and selector lists

Combinators describe relationships between elements. For example, a child selector matches only direct children, while a descendant selector matches deeper elements. Selector lists let you apply the same rules to several targets.'
    when lesson.slug = 'cascade-specificity' then
      '## The cascade and specificity

When more than one rule matches an element, the browser uses the cascade to decide which one wins. Specificity, source order, and important rules all affect the final result.'
    when lesson.slug = 'colors' then
      '## Colors in CSS

You can define colors with names, hex values, rgb values, hsl values, or other modern color functions. Choose a color format that makes the code easy to read and maintain.'
    when lesson.slug = 'length-units' then
      '## CSS units

CSS uses different units to express size and spacing. A `px` value is absolute, while `rem` and `em` are based on font size. `vw` and `vh` are relative to the viewport size.'
    when lesson.slug = 'box-model' then
      '## The box model

Every HTML element forms a box. That box has content, padding, border, and margin. These layers determine how much space the element takes on the page.'
    when lesson.slug = 'margin-padding-border' then
      '## Spacing and borders

Padding creates space inside an element, margin creates space outside it, and border draws a visual boundary around the element. These are among the most important layout tools in CSS.'
    when lesson.slug = 'typography' then
      '## Typography

Typography affects readability. Use a clear font stack, comfortable line-height, and consistent spacing to make text easier to scan and understand.'
    when lesson.slug = 'backgrounds' then
      '## Backgrounds and surfaces

CSS backgrounds can include solid colors, gradients, or images. Backgrounds can create depth, highlight sections, and make designs easier to read.'
    when lesson.slug = 'display-values' then
      '## Display and flow

Display values explain how an element sits in the page layout. Block elements consume full width by default, while inline elements fit within the flow of text.'
    when lesson.slug = 'responsive-thinking' then
      '## Responsive design

Responsive design means your page should still look good on mobile, tablet, and desktop. Flexible layouts and fluid sizing are the first tools to use.'
    else lesson.explanation
  end,
  examples = case
    when lesson.slug = 'what-css-does' then
      '[{"title":"Basic CSS example","body":"A CSS rule can change the paragraph text color and create a cleaner visual hierarchy."}]'::jsonb
    when lesson.slug = 'css-rules' then
      '[{"title":"Rule example","body":"The selector p chooses paragraph elements, and the declarations set color and spacing."}]'::jsonb
    when lesson.slug = 'box-model' then
      '[{"title":"Box model example","body":"A card element may have padding inside, border around it, and margin outside it to separate it from nearby content."}]'::jsonb
    when lesson.slug = 'responsive-thinking' then
      '[{"title":"Responsive layout idea","body":"A layout can stack vertically on mobile and arrange into columns on wider screens."}]'::jsonb
    else lesson.examples
  end,
  code_examples = case
    when lesson.slug = 'what-css-does' then
      '[{"title":"Style a heading","language":"css","code":"h1 {\n  color: #7D288F;\n  font-size: 2rem;\n}\n\np {\n  color: #333;\n  line-height: 1.6;\n}","preview":true}]'::jsonb
    when lesson.slug = 'box-model' then
      '[{"title":"Box model demo","language":"css","code":".card {\n  width: 220px;\n  padding: 16px;\n  border: 1px solid #ddd;\n  margin: 20px;\n  background: white;\n}","preview":true}]'::jsonb
    when lesson.slug = 'responsive-thinking' then
      '[{"title":"Mobile-first layout","language":"css","code":".layout {\n  display: grid;\n  gap: 1rem;\n}\n\n@media (min-width: 700px) {\n  .layout {\n    grid-template-columns: 1fr 1fr;\n  }\n}","preview":true}]'::jsonb
    else lesson.code_examples
  end,
  notes = case
    when lesson.slug = 'what-css-does' then
      '["CSS controls presentation, not page structure.","Use selectors to target the correct elements.","Keep styles readable and predictable."]'::jsonb
    when lesson.slug = 'cascade-specificity' then
      '["Specificity helps decide which rule wins.","Order matters when specificity is equal.","Rules are applied in a defined cascade."]'::jsonb
    when lesson.slug = 'box-model' then
      '["The content area is the inner box.","Padding sits inside the border.","Margin sits outside the border and contributes to spacing between elements."]'::jsonb
    when lesson.slug = 'responsive-thinking' then
      '["Start from the smallest screen first.","Use flexible layouts and fluid sizing.","Test large and small viewports."]'::jsonb
    else lesson.notes
  end,
  common_mistakes = case
    when lesson.slug = 'what-css-does' then
      '["Trying to solve layout by changing HTML instead of CSS.","Using styles without understanding selectors.","Forgetting that CSS is separate from the document structure."]'::jsonb
    when lesson.slug = 'cascade-specificity' then
      '["Adding high specificity rules to fix problems without understanding the cascade.","Ignoring the order of style declarations.","Overusing !important."]'::jsonb
    when lesson.slug = 'box-model' then
      '["Confusing padding with margin.","Setting width without accounting for padding and border.","Forgetting that box sizing can change layout outcomes."]'::jsonb
    when lesson.slug = 'responsive-thinking' then
      '["Designing only for large screens.","Using fixed widths everywhere.","Skipping test sizes for mobile and tablet."]'::jsonb
    else lesson.common_mistakes
  end,
  practice = case
    when lesson.slug = 'what-css-does' then
      '["Create a page with a heading and paragraph and style the heading in a different color.","Change the paragraph spacing and line height.","Explain which part of the page is HTML and which part is CSS."]'::jsonb
    when lesson.slug = 'box-model' then
      '["Build a small card that includes padding, border, and margin.","Change the spacing values and observe how the box changes.","Describe the difference between margin and padding in your own words."]'::jsonb
    when lesson.slug = 'responsive-thinking' then
      '["Create a two-column layout for desktop and a single-column layout for mobile.","Use media queries to change the layout at a breakpoint.","Check the design on a narrow screen."]'::jsonb
    else lesson.practice
  end
where lesson.slug in (
  'what-css-does',
  'style-application',
  'css-rules',
  'selectors',
  'selectors-combinators',
  'cascade-specificity',
  'colors',
  'length-units',
  'box-model',
  'margin-padding-border',
  'typography',
  'backgrounds',
  'display-values',
  'responsive-thinking',
  'styled-profile-card',
  'css-foundations-knowledge-check'
);
