alter table public.lessons
  add column if not exists explanation text not null default '',
  add column if not exists examples jsonb not null default '[]'::jsonb,
  add column if not exists code_examples jsonb not null default '[]'::jsonb,
  add column if not exists notes jsonb not null default '[]'::jsonb,
  add column if not exists common_mistakes jsonb not null default '[]'::jsonb,
  add column if not exists practice jsonb not null default '[]'::jsonb;

update public.lessons as lesson
set
  explanation = case
    when lesson.slug = 'what-is-html' then
      'HTML (HyperText Markup Language) is the standard markup language used to describe the meaning and structure of web pages. It tells a browser which content is a heading, paragraph, link, image, or other element; CSS controls presentation and JavaScript adds behavior. HTML is written with elements, usually represented by an opening tag, content, and a closing tag. Browsers parse this markup into a document tree called the DOM.'
    else format(
      'This lesson introduces %s. Work through the idea in the context of %s. As you study, identify what the browser or document gains from this technique, then apply it in a small page of your own.',
      lesson.title,
      module.title
    )
  end,
  examples = case
    when lesson.slug = 'what-is-html' then
      '[{"title":"A small HTML document","body":"The browser reads these elements as a heading and a paragraph, rather than treating the tags as visible text."}]'::jsonb
    else '[]'::jsonb
  end,
  code_examples = case
    when lesson.slug = 'what-is-html' then
      '[{"title":"A first HTML element","language":"html","code":"<h1>Hello World</h1>\n<p>This is my first web page.</p>","preview":true}]'::jsonb
    else '[]'::jsonb
  end,
  notes = case
    when lesson.slug = 'what-is-html' then
      '["HTML describes content and structure; it is not a programming language.","Most elements use opening and closing tags, while some elements such as img are void elements.","Browsers build a DOM tree from the document, which CSS and JavaScript can work with."]'::jsonb
    else '[]'::jsonb
  end,
  common_mistakes = case
    when lesson.slug = 'what-is-html' then
      '["Confusing HTML with CSS: HTML gives content its meaning; CSS is responsible for visual presentation.","Thinking that tags are displayed to visitors: browsers interpret markup and render the resulting document.","Assuming every element needs a closing tag: void elements such as img do not have one."]'::jsonb
    else '[]'::jsonb
  end,
  practice = case
    when lesson.slug = 'what-is-html' then
      '["Create a page with one main heading and two paragraphs describing a topic you enjoy.","Add a link to a relevant website and describe which parts of the page are structure and which would be presentation.","Open the page in a browser and use developer tools to inspect its document tree."]'::jsonb
    else jsonb_build_array(
      format('Create a small HTML page that demonstrates %s.', lower(lesson.title)),
      'Explain in your own words what each element contributes to the page.'
    )
  end
from public.modules as module
join public.courses as course on course.id = module.course_id
where lesson.module_id = module.id
  and course.slug = 'html'
  and course.is_published
  and module.is_published
  and lesson.is_published;

grant select (
  id, module_id, title, slug, description, content, explanation, examples,
  code_examples, notes, common_mistakes, practice, lesson_type, order_index,
  estimated_minutes, is_published, created_at, updated_at
) on public.lessons to authenticated;
