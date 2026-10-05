alter table public.learning_paths
  add column if not exists translations jsonb not null default '{}'::jsonb
  check (jsonb_typeof(translations) = 'object');

alter table public.courses
  add column if not exists translations jsonb not null default '{}'::jsonb
  check (jsonb_typeof(translations) = 'object');

alter table public.modules
  add column if not exists translations jsonb not null default '{}'::jsonb
  check (jsonb_typeof(translations) = 'object');

alter table public.lessons
  add column if not exists translations jsonb not null default '{}'::jsonb
  check (jsonb_typeof(translations) = 'object');

update public.learning_paths
set translations = jsonb_build_object(
  'so', jsonb_build_object(
    'title', 'Horumarinta Webka / MERN Stack',
    'description', 'Baro aasaaska webka, dabadeed dhis, ilaali, oo maamul apps casri ah oo full-stack ah. Waxaad ku bilaabaysaa HTML, CSS, JavaScript, iyo Git, ka dibna waxaad u gudbaysaa frontend, backend, database, amniga, iyo AI.',
    'short_description', 'Ka bilow aasaaska webka, kuna sii soco dhisidda apps full-stack ah.'
  ),
  'ar', jsonb_build_object(
    'title', 'تطوير الويب / MERN Stack',
    'description', 'تعلّم أساسيات الويب، ثم ابنِ تطبيقات متكاملة وحديثة واحمِها وشغّلها. ابدأ بـ HTML وCSS وJavaScript وGit، ثم انتقل إلى الواجهات والخوادم وقواعد البيانات والأمان والذكاء الاصطناعي.',
    'short_description', 'ابدأ بأساسيات الويب وتقدّم إلى بناء تطبيقات متكاملة.'
  )
)
where slug = 'web-development-mern-stack';

update public.courses
set translations = jsonb_build_object(
  'so', jsonb_build_object(
    'title', 'HTML',
    'description', 'Samee bogag web ah oo si fiican loo habeeyey, macnahoodu cad yahay, qof walbana isticmaali karo.'
  ),
  'ar', jsonb_build_object(
    'title', 'HTML',
    'description', 'أنشئ صفحات ويب منظّمة وواضحة المعنى ويمكن للجميع استخدامها.'
  )
)
where slug = 'html';

update public.modules
set translations = jsonb_build_object(
  'so', jsonb_build_object(
    'title', 'Aasaaska HTML',
    'description', 'Baro sida webku u soo gudbiyo bogagga, kuna dhis bogag HTML ah oo sax ah.'
  ),
  'ar', jsonb_build_object(
    'title', 'أساسيات HTML',
    'description', 'تعرّف على كيفية عرض الويب للصفحات، وأنشئ صفحات HTML صحيحة.'
  )
)
where slug = 'html-basics';

update public.lessons
set translations = $lesson_translations$
{
  "so": {
    "title": "Waa maxay HTML?",
    "description": "Baro sida HTML u qeexo qaab-dhismeedka iyo macnaha bogga webka.",
    "explanation": "HTML (HyperText Markup Language) waa luqadda loo isticmaalo in lagu dhiso qaab-dhismeedka webpage-ka. Waxay browser-ka u sheegtaa qaybta cinwaan, faqrado, link, sawir, ama wax kale tahay. CSS ayaa hagaajiya muuqaalka, JavaScript-na wuxuu ku daraa falal. HTML waxaa laga qoraa elements; badanaa element-ku wuxuu leeyahay tag furitaan, qoraal ama waxyaabo kale, iyo tag xiritaan. Browser-ku marka uu akhriyo HTML wuxuu ka sameeyaa geed xogeed la yiraahdo DOM.",
    "examples": [
      {
        "title": "Dukumenti HTML oo yar",
        "body": "Browser-ku wuxuu tags-kan u fahmaa cinwaan iyo faqrado. Tags-ku uma muuqdaan qoraal caadi ah oo bogga lagu daabacay."
      }
    ],
    "code_examples": [
      {
        "title": "Element-kii ugu horreeyay ee HTML",
        "language": "html",
        "code": "<h1>Hello World</h1>\n<p>This is my first web page.</p>",
        "preview": true,
        "explanation": "h1 waa cinwaanka ugu muhiimsan, p-na waa faqrado. Browser-ku wuxuu labada element u soo bandhigayaa si kala duwan."
      }
    ],
    "notes": [
      "HTML wuxuu qeexaa macnaha iyo qaab-dhismeedka; HTML ma aha programming language.",
      "Elements badan waxay leeyihiin tag furitaan iyo tag xiritaan. Qaar, sida img, ma laha tag xiritaan.",
      "Browser-ku HTML ayuu u rogaa geedka DOM, kaas oo CSS iyo JavaScript la shaqayn karaan."
    ],
    "common_mistakes": [
      "In HTML iyo CSS la isku qaldo: HTML wuxuu qeexaa waxa ku jira bogga, CSS-na muuqaalkiisa.",
      "In la moodo in tags-ku yihiin qoraal booqdaha loo tusayo; browser-ku ayuu fasiraa oo bogga ayuu dhisaa.",
      "In la moodo in element kasta u baahan yahay tag xiritaan; img waa tusaale element aan lahayn tag xiritaan."
    ],
    "practice": [
      "Samee bog leh hal cinwaan weyn iyo laba faqradood oo ka hadlaya mowduuc aad jeceshahay.",
      "Ku dar link website la xiriira, dabadeed sheeg qaybaha qaab-dhismeedka ah iyo qaybaha muuqaalka ah.",
      "Bogga browser-ka ka fur oo developer tools ku eeg geedka DOM."
    ],
    "quiz_questions": [
      {
        "id": "doctype-purpose",
        "type": "multiple_choice",
        "prompt": "DOCTYPE muxuu browser-ka u sheegaa?",
        "options": [
          "Nooca HTML ee dukumentigu isticmaalayo",
          "Midabka asalka bogga",
          "Meesha sawirrada boggu yaallaan",
          "Faylka JavaScript ee la socodsiinayo"
        ],
        "correctAnswer": "Nooca HTML ee dukumentigu isticmaalayo",
        "explanation": "DOCTYPE wuxuu browser-ka u sheegaa inuu dukumentiga u akhriyo habka HTML-ka casriga ah."
      },
      {
        "id": "heading-main-purpose",
        "type": "multiple_choice",
        "prompt": "<h1> maxay ka dhigan tahay?",
        "options": ["Faqrado", "Cinwaanka ugu weyn", "Sawir", "Link"],
        "correctAnswer": "Cinwaanka ugu weyn",
        "explanation": "h1 waa cinwaanka ugu weyn ee qaybta dukumentiga."
      },
      {
        "id": "html-structure-short-answer",
        "type": "short_answer",
        "prompt": "Waa maxay magaca geedka browser-ku ka sameeyo HTML?",
        "correctAnswer": "DOM",
        "acceptableAnswers": ["document object model", "the DOM", "document tree"],
        "explanation": "Browser-ku HTML ayuu u beddelaa Document Object Model, oo badanaa DOM loo soo gaabiyo."
      }
    ],
    "study_material": {
      "introduction": "Baro sida HTML u sheegto browser-ka qaab-dhismeedka iyo macnaha bogga webka.",
      "explanation": "## Fikradda\n\nHTML (HyperText Markup Language) waa luqadda loo isticmaalo in lagu dhiso qaab-dhismeedka webpage-ka. Waxay browser-ka u sheegtaa qaybta cinwaan, faqrado, link, sawir, ama wax kale tahay. CSS ayaa hagaajiya muuqaalka, JavaScript-na wuxuu ku daraa falal. HTML waxaa laga qoraa elements; badanaa element-ku wuxuu leeyahay tag furitaan, qoraal ama waxyaabo kale, iyo tag xiritaan. Browser-ku marka uu akhriyo HTML wuxuu ka sameeyaa geed xogeed la yiraahdo DOM.\n\n## Sida loo isticmaalo\n\nDooro element macnihiisu ku habboon yahay waxa aad qorayso. Tusaale ahaan, u isticmaal h1 cinwaanka ugu weyn, p faqrado, a link, iyo img sawir. Ha dooran element kaliya sababtoo ah muuqaalkiisa ayaa kuu habboon; muuqaalka CSS ayaa hagaajiya.\n\n## Tusaalaha\n\nh1 wuxuu muujinayaa cinwaan, p-na wuxuu muujinayaa faqrado. HTML-ku wuxuu browser-ka siinayaa qaab-dhismeed, browser-kuna wuxuu u soo bandhigayaa qofka bogga eegaya.\n\n## Iska hubi fahamkaaga\n\nSharax waxa HTML qabto, waxa CSS qabto, iyo sida browser-ku HTML uga sameeyo DOM. Kadib ku tijaabi adigoo developer tools ku eegaya bog yar.",
      "example": "**Tusaale:** Waxaad samaynaysaa bog kooban oo qof isku barayo. Isticmaal h1 magaca bogga, p faahfaahinta, iyo a link. Kahor intaadan ku darin CSS, hubi in HTML-ku si sax ah u kala saarayo qaybaha.",
      "codeExample": {
        "title": "Element-kii ugu horreeyay ee HTML",
        "language": "html",
        "code": "<h1>Hello World</h1>\n<p>This is my first web page.</p>",
        "explanation": "h1 waa cinwaanka ugu muhiimsan, p-na waa faqrado. Browser-ku wuxuu labada element u soo bandhigayaa si kala duwan."
      },
      "useCases": [
        "Dhisidda qaab-dhismeed bog oo la heli karo: HTML macne leh ayaa caawiya dadka isticmaala screen reader iyo qalabka kale.",
        "Ururinta xogta isticmaalaha: HTML wuxuu bixiyaa form iyo fields browser-ku fahmayo.",
        "Sharxidda sawirro, media, iyo xog: HTML wuxuu ku daraa qoraal kale oo dadka fahamsiinaya macnaha."
      ],
      "mistakes": [
        "In HTML iyo CSS la isku qaldo: HTML wuxuu qeexaa waxa ku jira bogga, CSS-na muuqaalkiisa.",
        "In la moodo in tags-ku yihiin qoraal booqdaha loo tusayo; browser-ku ayuu fasiraa oo bogga ayuu dhisaa.",
        "In la moodo in element kasta u baahan yahay tag xiritaan; img waa tusaale element aan lahayn tag xiritaan."
      ],
      "tips": [
        "Hubi HTML-ka, dabadeed browser-ka ka eeg accessibility tree.",
        "Bogga ku yeelo hal main oo cad; navigation u isticmaal links, ficilladana buttons.",
        "Marka hore isticmaal hab-dhaqanka browser-ka; JavaScript gaar ah ku dar marka loo baahdo."
      ],
      "practice": [
        "Samee bog leh hal cinwaan weyn iyo laba faqradood oo ka hadlaya mowduuc aad jeceshahay.",
        "Ku dar link website la xiriira, dabadeed sheeg qaybaha qaab-dhismeedka ah iyo qaybaha muuqaalka ah.",
        "Bogga browser-ka ka fur oo developer tools ku eeg geedka DOM."
      ]
    }
  },
  "ar": {
    "title": "ما هي HTML؟",
    "description": "تعرّف على كيفية تحديد HTML لبنية صفحة الويب ومعناها.",
    "explanation": "HTML (لغة ترميز النص التشعبي) هي اللغة المستخدمة لبناء بنية صفحة الويب. تخبر المتصفح إن كان المحتوى عنواناً أو فقرة أو رابطاً أو صورة أو عنصراً آخر. تتحكم CSS في المظهر، وتضيف JavaScript التفاعلات. تُكتب HTML باستخدام عناصر؛ ويتكوّن العنصر غالباً من وسم افتتاحي ومحتوى ووسم إغلاق. عندما يقرأ المتصفح HTML، ينشئ منها شجرة مستند تُسمّى DOM.",
    "examples": [
      {
        "title": "مستند HTML صغير",
        "body": "يفهم المتصفح هذه الوسوم على أنها عنوان وفقرة، ولا يعرض الوسوم كنص عادي في الصفحة."
      }
    ],
    "code_examples": [
      {
        "title": "أول عنصر HTML",
        "language": "html",
        "code": "<h1>Hello World</h1>\n<p>This is my first web page.</p>",
        "preview": true,
        "explanation": "يمثل h1 العنوان الرئيسي، وتمثل p فقرة. يعرض المتصفح العنصرين بشكل مختلف."
      }
    ],
    "notes": [
      "تحدد HTML معنى المحتوى وبنيته؛ وهي ليست لغة برمجة.",
      "تستخدم عناصر كثيرة وسم افتتاح ووسم إغلاق. وبعضها، مثل img، لا يحتاج إلى وسم إغلاق.",
      "ينشئ المتصفح شجرة DOM من HTML، ويمكن لـ CSS وJavaScript التعامل معها."
    ],
    "common_mistakes": [
      "الخلط بين HTML وCSS: تحدد HTML محتوى الصفحة ومعناه، بينما تتحكم CSS في مظهره.",
      "الاعتقاد أن الزائر يرى الوسوم نفسها؛ المتصفح يفسرها ثم يعرض الصفحة.",
      "الاعتقاد أن كل عنصر يحتاج إلى وسم إغلاق؛ عنصر img مثال على عنصر لا يملك وسم إغلاق."
    ],
    "practice": [
      "أنشئ صفحة فيها عنوان رئيسي واحد وفقرتان تصفان موضوعاً تحبه.",
      "أضف رابطاً إلى موقع مناسب، ثم حدّد أجزاء البنية وأجزاء التنسيق.",
      "افتح الصفحة في المتصفح واستخدم أدوات المطور لفحص شجرة DOM."
    ],
    "quiz_questions": [
      {
        "id": "doctype-purpose",
        "type": "multiple_choice",
        "prompt": "ماذا يخبر تصريح DOCTYPE المتصفح؟",
        "options": [
          "معيار HTML الذي يستخدمه المستند",
          "لون خلفية الصفحة",
          "مكان حفظ صور الصفحة",
          "ملف JavaScript الذي يجب تشغيله"
        ],
        "correctAnswer": "معيار HTML الذي يستخدمه المستند",
        "explanation": "يخبر DOCTYPE المتصفح أن يفسر المستند وفق معايير HTML الحديثة."
      },
      {
        "id": "heading-main-purpose",
        "type": "multiple_choice",
        "prompt": "ماذا يمثّل العنصر <h1>؟",
        "options": ["فقرة", "العنوان الرئيسي", "صورة", "رابط"],
        "correctAnswer": "العنوان الرئيسي",
        "explanation": "يمثل h1 العنوان الرئيسي والأعلى مستوى في سياق المحتوى."
      },
      {
        "id": "html-structure-short-answer",
        "type": "short_answer",
        "prompt": "ما اسم الشجرة التي ينشئها المتصفح من مستند HTML؟",
        "correctAnswer": "DOM",
        "acceptableAnswers": ["document object model", "the DOM", "document tree"],
        "explanation": "يحوّل المتصفح HTML إلى نموذج كائن المستند، ويُعرف اختصاراً باسم DOM."
      }
    ],
    "study_material": {
      "introduction": "تعرّف على كيفية إخبار HTML للمتصفح ببنية صفحة الويب ومعنى محتواها.",
      "explanation": "## الفكرة\n\nHTML (لغة ترميز النص التشعبي) هي اللغة المستخدمة لبناء بنية صفحة الويب. تخبر المتصفح إن كان المحتوى عنواناً أو فقرة أو رابطاً أو صورة أو عنصراً آخر. تتحكم CSS في المظهر، وتضيف JavaScript التفاعلات. تُكتب HTML باستخدام عناصر؛ ويتكوّن العنصر غالباً من وسم افتتاحي ومحتوى ووسم إغلاق. عندما يقرأ المتصفح HTML، ينشئ منها شجرة مستند تُسمّى DOM.\n\n## طريقة الاستخدام\n\nاختر العنصر الذي يناسب معنى المحتوى. استخدم h1 للعنوان الرئيسي، وp للفقرات، وa للروابط، وimg للصور. لا تختر العنصر لمظهره الافتراضي فقط؛ فـ CSS مسؤولة عن التنسيق.\n\n## قراءة المثال\n\nيعرض h1 عنواناً، بينما يعرض p فقرة. تمنح HTML المتصفح بنية المحتوى، ثم يعرضها المتصفح للزائر.\n\n## تحقّق من فهمك\n\nاشرح دور HTML ودور CSS، وكيف ينشئ المتصفح DOM من HTML. جرّب ذلك في صفحة صغيرة وافحصها باستخدام أدوات المطور.",
      "example": "**مثال:** أنشئ صفحة تعريف قصيرة. استخدم h1 لعنوان الصفحة، وp للتفاصيل، وa للرابط. قبل إضافة CSS، تأكد أن HTML تفصل المحتوى إلى أجزاء واضحة.",
      "codeExample": {
        "title": "أول عنصر HTML",
        "language": "html",
        "code": "<h1>Hello World</h1>\n<p>This is my first web page.</p>",
        "explanation": "يمثل h1 العنوان الرئيسي، وتمثل p فقرة. يعرض المتصفح العنصرين بشكل مختلف."
      },
      "useCases": [
        "بناء صفحات واضحة وسهلة الوصول: تساعد HTML الدلالية قارئات الشاشة والأدوات الأخرى.",
        "جمع بيانات المستخدم: توفر HTML نماذج وحقولاً يفهمها المتصفح.",
        "شرح الصور والوسائط والبيانات: يمكن أن تضيف HTML نصاً بديلاً يوضح معناها."
      ],
      "mistakes": [
        "الخلط بين HTML وCSS: تحدد HTML محتوى الصفحة ومعناه، بينما تتحكم CSS في مظهره.",
        "الاعتقاد أن الزائر يرى الوسوم نفسها؛ المتصفح يفسرها ثم يعرض الصفحة.",
        "الاعتقاد أن كل عنصر يحتاج إلى وسم إغلاق؛ عنصر img مثال على عنصر لا يملك وسم إغلاق."
      ],
      "tips": [
        "تحقق من صحة HTML، ثم افحص شجرة إمكانية الوصول في المتصفح.",
        "استخدم main رئيسياً واحداً واضحاً، والروابط للتنقل، والأزرار لتنفيذ الأوامر.",
        "استفد من سلوك المتصفح الأصلي قبل إضافة JavaScript مخصص."
      ],
      "practice": [
        "أنشئ صفحة فيها عنوان رئيسي واحد وفقرتان تصفان موضوعاً تحبه.",
        "أضف رابطاً إلى موقع مناسب، ثم حدّد أجزاء البنية وأجزاء التنسيق.",
        "افتح الصفحة في المتصفح واستخدم أدوات المطور لفحص شجرة DOM."
      ]
    }
  }
}
$lesson_translations$::jsonb
where slug = 'what-is-html';

update public.lessons as lesson
set translations = lesson.translations || jsonb_build_object(
  'so', coalesce(lesson.translations -> 'so', '{}'::jsonb) || jsonb_build_object(
    'title', translated.somali_title,
    'description', translated.somali_description
  ),
  'ar', coalesce(lesson.translations -> 'ar', '{}'::jsonb) || jsonb_build_object(
    'title', translated.arabic_title,
    'description', translated.arabic_description
  )
)
from (
  values
    (
      'How the web works: browsers, servers, and HTTP',
      'Sida webku u shaqeeyo: browsers, servers, iyo HTTP',
      'Baro sida browser-ka, server-ka, iyo HTTP ay isula shaqeeyaan marka bog la furo.',
      'كيف يعمل الويب: المتصفحات والخوادم وHTTP',
      'تعرّف على كيفية تواصل المتصفح والخادم وHTTP عند فتح صفحة.'
    ),
    (
      'HTML document structure',
      'Qaab-dhismeedka dukumentiga HTML',
      'Baro qaybaha aasaasiga ah ee ku jira dukumenti HTML.',
      'بنية مستند HTML',
      'تعرّف على الأجزاء الأساسية في مستند HTML.'
    ),
    (
      'The DOCTYPE declaration',
      'Qoraalka DOCTYPE',
      'Baro sababta dukumenti HTML loogu bilaabo DOCTYPE.',
      'تصريح DOCTYPE',
      'تعرّف على سبب بدء مستند HTML بتصريح DOCTYPE.'
    ),
    (
      'The html, head, and body elements',
      'Elements-ka html, head, iyo body',
      'Baro qaybaha dukumentiga ee html, head, iyo body.',
      'عناصر html وhead وbody',
      'تعرّف على أقسام المستند التي تمثلها عناصر html وhead وbody.'
    ),
    (
      'Headings and document outline',
      'Cinwaannada iyo kala-habaynta dukumentiga',
      'Isticmaal cinwaannada si aad u muujiso kala-habaynta qaybaha bogga.',
      'العناوين وبنية المستند',
      'استخدم العناوين لتوضيح ترتيب أقسام الصفحة.'
    ),
    (
      'Paragraphs and line breaks',
      'Faqradaha iyo jebinta sadar-ka',
      'Baro sida p iyo br loogu habeeyo qoraalka bogga.',
      'الفقرات وفواصل الأسطر',
      'تعرّف على استخدام p وbr لتنظيم نص الصفحة.'
    ),
    (
      'Text formatting and emphasis',
      'Qaabaynta qoraalka iyo xoojinta macnaha',
      'Dooro elements muujinaya qaabaynta ama xoojinta macnaha qoraalka.',
      'تنسيق النص والتأكيد على معناه',
      'اختر عناصر توضّح تنسيق النص أو التأكيد على معناه.'
    ),
    (
      'HTML comments',
      'Faallooyinka HTML',
      'Baro sida faallo loogu qoro HTML iyo in booqdaha boggu aanu arkin.',
      'تعليقات HTML',
      'تعرّف على كتابة التعليقات في HTML وأن زائر الصفحة لا يراها.'
    ),
    (
      'Attributes and global attributes',
      'Attributes iyo attributes-ka guud',
      'Ku dar attributes si aad u bixiso xog dheeraad ah ama aqoonsi element.',
      'الخصائص والخصائص العامة',
      'أضف الخصائص لتوفير معلومات إضافية أو معرّف للعنصر.'
    ),
    (
      'Links and anchor elements',
      'Links iyo anchor elements',
      'Samee links dadka u gudbiya bogag ama meelo kale.',
      'الروابط وعناصر a',
      'أنشئ روابط تنقل المستخدم إلى صفحات أو مواضع أخرى.'
    ),
    (
      'URLs, paths, and fragments',
      'URLs, waddooyinka, iyo qaybaha gudaha bogga',
      'Faham sida URL, path, iyo fragment ay u tilmaamaan meelaha webka.',
      'عناوين URL والمسارات والأجزاء',
      'افهم كيف تحدد عناوين URL والمسارات والأجزاء مواضع الويب.'
    ),
    (
      'Images and alternative text',
      'Sawirrada iyo qoraalka beddelka ah',
      'Ku dar sawirro, dabadeed qoraal u qor dadka aan arki karin sawirka.',
      'الصور والنص البديل',
      'أضف الصور واكتب نصاً بديلاً لمن لا يستطيع رؤيتها.'
    ),
    (
      'Ordered, unordered, and description lists',
      'Liisaska kala horreeya, aan kala horreyn, iyo sharraxaadda',
      'Dooro nooca liiska ku habboon sida xogtu u kala horreyso.',
      'القوائم المرتبة وغير المرتبة وقوائم الوصف',
      'اختر نوع القائمة المناسب لطريقة ترتيب المعلومات.'
    ),
    (
      'Build a semantic profile page',
      'Dhis bog profile ah oo HTML macne leh adeegsada',
      'Adeegso HTML si aad u dhisto bog profile ah oo qaybahu macne cad leeyihiin.',
      'أنشئ صفحة ملف شخصي باستخدام HTML دلالية',
      'استخدم HTML الدلالية لبناء صفحة ملف شخصي ذات أقسام واضحة المعنى.'
    ),
    (
      'HTML basics knowledge check',
      'Imtixaanka hubinta aasaaska HTML',
      'Iska hubi fahamkaaga tags-ka, attributes-ka, links-ka, iyo qaab-dhismeedka HTML.',
      'اختبار أساسيات HTML',
      'تحقق من فهمك للوسوم والخصائص والروابط وبنية HTML.'
    )
) as translated(
  english_title,
  somali_title,
  somali_description,
  arabic_title,
  arabic_description
),
public.modules as module,
public.courses as course
where lesson.title = translated.english_title
  and lesson.module_id = module.id
  and module.course_id = course.id
  and module.slug = 'html-basics'
  and course.slug = 'html';

update public.lessons
set translations = jsonb_set(
  jsonb_set(
    translations,
    '{so,study_material}',
    $somali_project${
      "introduction": "Ku tababar HTML adigoo dhisaya bog profile ah oo xogtu si cad u kala qaybsan tahay.",
      "explanation": "## Waxa aad dhisayso\n\nSamee bog profile ah oo qofka booqda u sheegaya qofka aad tahay, waxa aad qabato, iyo sida lagula soo xiriiri karo. Isticmaal elements macne leh sida header, main, section, nav, iyo footer marka ay ku habboon yihiin.\n\n## Sida loo habeeyo\n\nBogga ku bilow cinwaan cad. Ku dar qayb hordhac ah, xirfadahaaga, mashaariic aad samaysay, iyo faahfaahinta xiriirka. Cinwaannada u kala hormari h1, h2, iyo h3 si ay u muujiyaan qaab-dhismeedka; ha u dooran cabbirka qoraalka oo keliya.\n\n## Hubi shaqada\n\nBogga browser-ka ka fur, link-yada tijaabi, keyboard-kana ku dhex soco. Developer tools ku eeg DOM-ka oo hubi in qaybaha boggu leeyihiin macne cad.",
      "example": "**Tusaale:** Qaybta mashaariicda ku samee section leh h2 cinwaan ah, dabadeed article u samee mashruuc kasta. Sidaas ayay browser-ka iyo qalabka akhrisku u fahmayaan xogta.",
      "codeExample": {
        "title": "Qaab-dhismeedka bog profile",
        "language": "html",
        "code": "<header>\n  <h1>My Portfolio</h1>\n  <nav aria-label=\"Main navigation\">\n    <a href=\"#projects\">Projects</a>\n    <a href=\"#contact\">Contact</a>\n  </nav>\n</header>\n<main>\n  <section id=\"projects\" aria-labelledby=\"projects-title\">\n    <h2 id=\"projects-title\">Projects</h2>\n  </section>\n</main>",
        "explanation": "header wuxuu qabtaa cinwaanka iyo navigation-ka. main waa qaybta ugu weyn ee bogga; section-na wuxuu kooxeeyaa waxyaabaha isku mowduuca ah."
      },
      "useCases": ["Soo bandhigidda xirfadaha iyo shaqadaada.", "Samaynta bog ay shaqo-bixiyeyaashu si fudud kaaga bartaan.", "Ku tababarashada qaab-dhismeedka HTML ee macnaha leh."],
      "mistakes": ["In div loo isticmaalo meel kasta iyadoo element macne leh jiro.", "In cinwaannada loo doorto cabbirkooda halkii laga eegi lahaa kala-habaynta.", "In link loo qoro qoraal aan sheegin meesha uu aadayo."],
      "tips": ["Bogga u samee hal h1 oo qeexaya ujeeddadiisa.", "Link ku qor meel uu u socdo oo cad.", "Keyboard ku tijaabi in qaybaha iyo links-ka si fudud loo gaari karo."],
      "practice": ["Ku dar magacaaga iyo qoraal kooban oo isbarasho ah.", "Ku dar ugu yaraan laba mashruuc oo leh cinwaan iyo sharaxaad.", "Samee qayb xiriir oo leh link email ah, dabadeed browser-ka ku tijaabi."]
    }$somali_project$::jsonb,
    true
  ),
  '{ar,study_material}',
  $arabic_project${
    "introduction": "تدرّب على HTML من خلال إنشاء صفحة ملف شخصي تقسم المعلومات بوضوح.",
    "explanation": "## ما الذي ستبنيه\n\nأنشئ صفحة ملف شخصي توضّح للزائر من أنت وما الذي تفعله وكيف يمكنه التواصل معك. استخدم عناصر دلالية مثل header وmain وsection وnav وfooter عندما تناسب المحتوى.\n\n## تنظيم الصفحة\n\nابدأ بعنوان واضح. أضف نبذة قصيرة ومهاراتك ومشاريعك ومعلومات التواصل. رتّب العناوين باستخدام h1 ثم h2 ثم h3 لتعكس بنية الصفحة، لا لتغيير حجم الخط فقط.\n\n## تحقّق من عملك\n\nافتح الصفحة في المتصفح واختبر الروابط والتنقل باستخدام لوحة المفاتيح. افحص DOM باستخدام أدوات المطور وتأكد أن لكل قسم معنى واضحاً.",
    "example": "**مثال:** أنشئ قسماً للمشاريع باستخدام section وعنوان h2، ثم استخدم article لكل مشروع. يساعد ذلك المتصفح وأدوات القراءة على فهم تنظيم المحتوى.",
    "codeExample": {
      "title": "بنية صفحة الملف الشخصي",
      "language": "html",
      "code": "<header>\n  <h1>My Portfolio</h1>\n  <nav aria-label=\"Main navigation\">\n    <a href=\"#projects\">Projects</a>\n    <a href=\"#contact\">Contact</a>\n  </nav>\n</header>\n<main>\n  <section id=\"projects\" aria-labelledby=\"projects-title\">\n    <h2 id=\"projects-title\">Projects</h2>\n  </section>\n</main>",
      "explanation": "يجمع header العنوان والتنقل. ويمثل main المحتوى الأساسي للصفحة، بينما يجمع section المحتوى الذي يتناول موضوعاً واحداً."
    },
    "useCases": ["عرض مهاراتك وأعمالك.", "إنشاء صفحة تساعد أصحاب العمل على التعرف عليك بسهولة.", "التدرب على بنية HTML الدلالية."],
    "mistakes": ["استخدام div في كل مكان مع وجود عنصر دلالي أنسب.", "اختيار العناوين لحجم الخط بدلاً من ترتيب المحتوى.", "كتابة نص رابط لا يوضح وجهته."],
    "tips": ["استخدم h1 واحداً يوضح موضوع الصفحة.", "اكتب نصاً واضحاً للروابط.", "اختبر الوصول إلى الأقسام والروابط باستخدام لوحة المفاتيح."],
    "practice": ["أضف اسمك ونبذة قصيرة للتعريف بنفسك.", "اعرض مشروعين على الأقل مع عنوان ووصف لكل منهما.", "أضف قسماً للتواصل يتضمن رابط بريد إلكتروني واختبره في المتصفح."]
  }$arabic_project$::jsonb,
  true
)
where slug = 'build-a-semantic-profile-page';

update public.lessons
set translations = jsonb_set(
  jsonb_set(
    translations,
    '{so,quiz_questions}',
    $somali_profile_quiz$[
      {
        "id": "profile-semantic-structure",
        "type": "multiple_choice",
        "prompt": "Maxaa ugu habboon in loo isticmaalo qaybta ugu weyn ee bogga?",
        "options": ["main", "footer", "br", "style"],
        "correctAnswer": "main",
        "explanation": "main wuxuu calaamadeeyaa nuxurka ugu muhiimsan ee bogga."
      }
    ]$somali_profile_quiz$::jsonb,
    true
  ),
  '{ar,quiz_questions}',
  $arabic_profile_quiz$[
    {
      "id": "profile-semantic-structure",
      "type": "multiple_choice",
      "prompt": "ما العنصر الأنسب لتمثيل المحتوى الرئيسي للصفحة؟",
      "options": ["main", "footer", "br", "style"],
      "correctAnswer": "main",
      "explanation": "يحدد main المحتوى الأساسي في الصفحة."
    }
  ]$arabic_profile_quiz$::jsonb,
  true
)
where slug = 'build-a-semantic-profile-page';

update public.lessons
set translations = jsonb_set(
  jsonb_set(
    translations,
    '{so,quiz_questions}',
    $somali_quiz$[
      {
        "id": "html-quiz-doctype",
        "type": "multiple_choice",
        "prompt": "Qoraalkee waa in la dhigaa bilowga dukumenti HTML casri ah?",
        "options": ["<!DOCTYPE html>", "<html5>", "<head>", "<meta>"],
        "correctAnswer": "<!DOCTYPE html>",
        "explanation": "DOCTYPE-ka HTML5 waa <!DOCTYPE html>, wuxuuna ka horreeyaa element-ka html."
      },
      {
        "id": "html-quiz-alt",
        "type": "true_false",
        "prompt": "Qoraalka beddelka ahi wuxuu sharxi karaa macnaha sawirka marka qofku aanu arki karin.",
        "options": ["True", "False"],
        "correctAnswer": "True",
        "explanation": "Alt text waxtar leh wuxuu dadka siinayaa qoraal lagu fahmi karo sawirka."
      }
    ]$somali_quiz$::jsonb,
    true
  ),
  '{ar,quiz_questions}',
  $arabic_quiz$[
    {
      "id": "html-quiz-doctype",
      "type": "multiple_choice",
      "prompt": "ما التصريح الذي يوضع في بداية مستند HTML حديث؟",
      "options": ["<!DOCTYPE html>", "<html5>", "<head>", "<meta>"],
      "correctAnswer": "<!DOCTYPE html>",
      "explanation": "يُكتب تصريح HTML5 هكذا: <!DOCTYPE html>، ويوضع قبل عنصر html."
    },
    {
      "id": "html-quiz-alt",
      "type": "true_false",
      "prompt": "يمكن للنص البديل شرح معنى الصورة عندما يتعذر على الشخص رؤيتها.",
      "options": ["True", "False"],
      "correctAnswer": "True",
      "explanation": "يوفر النص البديل المفيد وصفاً نصياً يساعد على فهم الصورة."
    }
  ]$arabic_quiz$::jsonb,
  true
)
where slug = 'html-basics-knowledge-check';

revoke all on public.lessons from anon, authenticated;
grant select (
  id, module_id, title, slug, description, content, explanation, examples,
  code_examples, notes, common_mistakes, practice, quiz_questions, translations,
  lesson_type, order_index, estimated_minutes, is_published, created_at, updated_at
) on public.lessons to authenticated;

notify pgrst, 'reload schema';
