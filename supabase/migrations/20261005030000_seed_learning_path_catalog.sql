insert into public.learning_paths (
  title, slug, description, short_description, difficulty, estimated_hours, is_published, translations
)
values
(
  'Cybersecurity',
  'cybersecurity',
  'A structured route through Cybersecurity Fundamentals, Networking Fundamentals, Linux, security concepts, Web Security, Authentication and Authorization, Cryptography Fundamentals, Vulnerability Assessment, Secure Development, Security Operations, Incident Response, Defensive Security, and Ethical Hacking Fundamentals.',
  'Build a solid foundation in defensive security, secure development, and responsible security testing.',
  'Beginner to Advanced',
  320,
  true,
  '{
    "so": {
      "title": "Amniga Internetka",
      "description": "Jid nidaamsan oo mara aasaaska amniga internetka, networking, Linux, amniga webka, xaqiijinta aqoonsiga, cryptography, qiimaynta nuglaanta, horumarinta amniga leh, hawlaha amniga, ka jawaabista dhacdooyinka, difaaca, iyo tijaabinta amniga ee masuulka ah.",
      "short_description": "Dhis aasaas adag oo difaaca amniga, horumarinta amniga leh, iyo tijaabinta masuulka ah."
    },
    "ar": {
      "title": "الأمن السيبراني",
      "description": "مسار منظم يشمل أساسيات الأمن والشبكات وLinux وأمن الويب والمصادقة والتفويض والتشفير وتقييم الثغرات والتطوير الآمن والعمليات الأمنية والاستجابة للحوادث والدفاع واختبار الاختراق المسؤول.",
      "short_description": "ابنِ أساساً قوياً في الدفاع الأمني والتطوير الآمن والاختبار المسؤول."
    }
  }'::jsonb
),
(
  'English for Technology',
  'english-for-technology',
  'Improve practical English for software work: programming vocabulary, development terminology, technical documentation, error messages, developer communication, Git and GitHub writing, technical interviews, workplace communication, API documentation, and explaining technical concepts.',
  'Practice the English you need to read, build, explain, and collaborate on software.',
  'Beginner to Intermediate',
  120,
  true,
  '{
    "so": {
      "title": "Ingiriisiga Teknoolojiyadda",
      "description": "Hagaaji Ingiriisiga shaqada software-ka: erayada programming-ka, ereyada horumarinta, akhrinta dukumentiyada farsamada, fahamka fariimaha khaladka, wada xiriirka developers-ka, qorista farriimaha Git iyo GitHub, wareysiyada farsamada, isgaarsiinta shaqada, API documentation, iyo sharxidda fikradaha farsamada.",
      "short_description": "Ku tababar Ingiriisiga kaa caawinaya akhrinta, dhisidda, sharxidda, iyo wada shaqaynta software-ka."
    },
    "ar": {
      "title": "الإنجليزية للتقنية",
      "description": "طوّر الإنجليزية العملية للعمل البرمجي: مفردات البرمجة والتطوير، قراءة التوثيق التقني ورسائل الأخطاء، التواصل بين المطورين، كتابة رسائل Git وGitHub، المقابلات التقنية، التواصل في العمل، توثيق API وشرح المفاهيم التقنية.",
      "short_description": "تدرّب على الإنجليزية اللازمة لقراءة البرمجيات وبنائها وشرحها والعمل مع الآخرين."
    }
  }'::jsonb
),
(
  'AI Engineering',
  'ai-engineering',
  'Learn the foundations behind AI engineering, including Python for AI, mathematics and data, machine learning, neural networks, language models, prompt design, retrieval-augmented generation, evaluation, responsible AI, deployment, and monitoring.',
  'Progress from AI and machine-learning fundamentals to building and operating useful AI systems.',
  'Beginner to Advanced',
  360,
  true,
  '{
    "so": {
      "title": "Injineernimada AI",
      "description": "Baro aasaaska injineernimada AI: Python, xisaabta iyo xogta, machine learning, neural networks, language models, qaabaynta prompts, retrieval-augmented generation, qiimaynta, AI masuul ah, daabacaadda, iyo la socodka nidaamyada.",
      "short_description": "Ka gudub aasaaska AI iyo machine learning ilaa dhisidda iyo hawlgelinta nidaamyo AI oo waxtar leh."
    },
    "ar": {
      "title": "هندسة الذكاء الاصطناعي",
      "description": "تعلّم أساسيات هندسة الذكاء الاصطناعي، بما يشمل Python والرياضيات والبيانات وتعلّم الآلة والشبكات العصبية والنماذج اللغوية وتصميم التعليمات والتوليد المعزز بالاسترجاع والتقييم والذكاء الاصطناعي المسؤول والنشر والمراقبة.",
      "short_description": "انتقل من أساسيات الذكاء الاصطناعي وتعلّم الآلة إلى بناء أنظمة مفيدة وتشغيلها."
    }
  }'::jsonb
)
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  short_description = excluded.short_description,
  difficulty = excluded.difficulty,
  estimated_hours = excluded.estimated_hours,
  is_published = excluded.is_published,
  translations = excluded.translations,
  updated_at = now();
