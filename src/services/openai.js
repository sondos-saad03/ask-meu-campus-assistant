import OpenAI from 'openai';

// قاعدة بيانات معلومات جامعة الشرق الأوسط
const MEU_KNOWLEDGE_BASE = {
  // معلومات عامة عن الجامعة
  general: {
    name: 'جامعة الشرق الأوسط',
    englishName: 'Middle East University',
    location: 'عمان، الأردن',
    founded: '2005',
    type: 'جامعة خاصة',
    accreditation: 'معتمدة من وزارة التعليم العالي والبحث العلمي الأردنية',
    website: 'www.meu.edu.jo'
  },

  // معلومات التسجيل
  registration: {
    'تسجيل المواد': 'يتم التسجيل إلكترونياً عبر نظام الطالب الإلكتروني. مواعيد التسجيل تُعلن قبل بداية كل فصل. يحق للطالب تسجيل 12-18 ساعة معتمدة في الفصل العادي.',
    'الرسوم': 'تختلف الرسوم حسب التخصص. يتم دفع الرسوم عبر البنوك المعتمدة أو عبر الموقع الإلكتروني. يوجد خصومات للمتفوقين وأبناء المنتسبين.',
    'المنح': 'تقدم الجامعة منح جزئية وكاملة للطلبة المتفوقين. منحة التميز الأكاديمي للحاصلين على معدل 90% فأكثر في الثانوية العامة.',
    'الانسحاب': 'يمكن الانسحاب من المواد خلال الأسابيع الأولى من الفصل. بعد ذلك يُسجل انسحاب ويؤثر على المعدل.',
    'التأجيل': 'يمكن تأجيل الفصل لأسباب مبررة بعد تقديم طلب رسمي لعمادة القبول والتسجيل.'
  },

  // الكليات والتخصصات
  faculties: {
    'كلية تكنولوجيا المعلومات': [
      'علوم الحاسوب',
      'هندسة البرمجيات', 
      'نظم المعلومات الحاسوبية',
      'الذكاء الاصطناعي',
      'الأمن السيبراني'
    ],
    'كلية الأعمال': [
      'إدارة الأعمال',
      'المحاسبة',
      'التمويل والمصارف',
      'التسويق',
      'الاقتصاد'
    ],
    'كلية الهندسة': [
      'الهندسة المدنية',
      'الهندسة الكهربائية',
      'الهندسة الميكانيكية',
      'هندسة العمارة'
    ],
    'كلية الآداب والعلوم': [
      'اللغة العربية وآدابها',
      'اللغة الإنجليزية وآدابها',
      'الترجمة',
      'علم النفس',
      'الرياضيات'
    ],
    'كلية الحقوق': [
      'القانون'
    ],
    'كلية الإعلام': [
      'الصحافة والإعلام',
      'العلاقات العامة والإعلان'
    ]
  },

  // الخدمات والمرافق
  facilities: {
    'المكتبة': 'مكتبة مركزية مجهزة بأحدث التقنيات. مفتوحة من 8 صباحاً حتى 8 مساءً. تحتوي على أكثر من 50,000 كتاب وقواعد بيانات إلكترونية.',
    'المختبرات': 'مختبرات حاسوب متطورة، مختبرات علمية مجهزة، مختبرات هندسية متخصصة.',
    'القاعات': 'قاعات دراسية مكيفة ومجهزة بأجهزة عرض حديثة. مدرج كبير يتسع لـ 300 طالب.',
    'الكافتيريا': 'كافتيريا رئيسية تقدم وجبات متنوعة. مفتوحة من 7:30 صباحاً حتى 6 مساءً.',
    'المواقف': 'مواقف مجانية للطلبة وأعضاء هيئة التدريس. مواقف مظللة ومواقف مفتوحة.',
    'الملاعب': 'ملعب كرة قدم، ملعب كرة سلة، صالة رياضية مغلقة.',
    'العيادة': 'عيادة طبية لتقديم الإسعافات الأولية والاستشارات الطبية.'
  },

  // الامتحانات والدرجات
  exams: {
    'النصفي': 'امتحانات نصف الفصل تُعقد في الأسبوع الثامن من الفصل. تشكل 30% من الدرجة النهائية.',
    'النهائي': 'الامتحان النهائي يشكل 40% من الدرجة النهائية. يُعقد في نهاية الفصل حسب الجدول المعلن.',
    'الأعمال': 'أعمال الفصل تشمل الواجبات والمشاريع والاختبارات القصيرة وتشكل 30% من الدرجة.',
    'المعدل': 'المعدل من 4.0. الحد الأدنى للنجاح هو 2.0. الإنذار الأكاديمي عند انخفاض المعدل عن 2.0.',
    'التقديرات': 'A: 90-100، B: 80-89، C: 70-79، D: 60-69، F: أقل من 60'
  },

  // معلومات الاتصال
  contact: {
    'الهاتف': '+962-6-4291511',
    'العنوان': 'مطار الملكة علياء الدولي، عمان، الأردن',
    'البريد الإلكتروني': 'info@meu.edu.jo',
    'ساعات العمل': 'الأحد - الخميس: 8:00 ص - 4:00 م',
    'القبول والتسجيل': 'admission@meu.edu.jo',
    'الشؤون المالية': 'finance@meu.edu.jo'
  }
};

// إعداد OpenAI client
const openai = new OpenAI({
  apiKey: 'demo-key', // مؤقت للتطوير
  dangerouslyAllowBrowser: true
});

// وظيفة للبحث في قاعدة البيانات المحلية
const searchLocalKnowledge = (question) => {
  const lowerQuestion = question.toLowerCase();
  
  // البحث في معلومات التسجيل
  for (const [key, value] of Object.entries(MEU_KNOWLEDGE_BASE.registration)) {
    if (lowerQuestion.includes(key.toLowerCase()) || 
        lowerQuestion.includes('تسجيل') || 
        lowerQuestion.includes('رسوم') ||
        lowerQuestion.includes('منح') ||
        lowerQuestion.includes('انسحاب') ||
        lowerQuestion.includes('تأجيل')) {
      return `📚 **${key}:**\n\n${value}\n\nلمزيد من المعلومات، يرجى التواصل مع عمادة القبول والتسجيل على: admission@meu.edu.jo`;
    }
  }

  // البحث في الكليات والتخصصات
  if (lowerQuestion.includes('تخصص') || lowerQuestion.includes('كلية') || lowerQuestion.includes('قسم')) {
    let response = '🏛️ **الكليات والتخصصات في جامعة الشرق الأوسط:**\n\n';
    for (const [faculty, majors] of Object.entries(MEU_KNOWLEDGE_BASE.faculties)) {
      response += `**${faculty}:**\n${majors.map(major => `• ${major}`).join('\n')}\n\n`;
    }
    return response + 'لمزيد من التفاصيل حول أي تخصص، يرجى زيارة الموقع الإلكتروني: www.meu.edu.jo';
  }

  // البحث في المرافق والخدمات
  for (const [key, value] of Object.entries(MEU_KNOWLEDGE_BASE.facilities)) {
    if (lowerQuestion.includes(key.toLowerCase()) ||
        lowerQuestion.includes('مكتبة') ||
        lowerQuestion.includes('مختبر') ||
        lowerQuestion.includes('كافتيريا') ||
        lowerQuestion.includes('موقف') ||
        lowerQuestion.includes('ملعب')) {
      return `🏢 **${key}:**\n\n${value}`;
    }
  }

  // البحث في معلومات الامتحانات
  if (lowerQuestion.includes('امتحان') || lowerQuestion.includes('درجة') || 
      lowerQuestion.includes('معدل') || lowerQuestion.includes('نتائج')) {
    let response = '📊 **معلومات الامتحانات والدرجات:**\n\n';
    for (const [key, value] of Object.entries(MEU_KNOWLEDGE_BASE.exams)) {
      response += `**${key}:** ${value}\n\n`;
    }
    return response;
  }

  // معلومات الاتصال
  if (lowerQuestion.includes('اتصال') || lowerQuestion.includes('هاتف') || 
      lowerQuestion.includes('عنوان') || lowerQuestion.includes('موقع')) {
    let response = '📞 **معلومات التواصل:**\n\n';
    for (const [key, value] of Object.entries(MEU_KNOWLEDGE_BASE.contact)) {
      response += `**${key}:** ${value}\n\n`;
    }
    return response;
  }

  // معلومات عامة عن الجامعة
  if (lowerQuestion.includes('جامعة') || lowerQuestion.includes('meu') || 
      lowerQuestion.includes('شرق الأوسط') || lowerQuestion.includes('عن الجامعة')) {
    const general = MEU_KNOWLEDGE_BASE.general;
    return `🏛️ **عن جامعة الشرق الأوسط:**\n\n` +
           `• **الاسم:** ${general.name} (${general.englishName})\n` +
           `• **الموقع:** ${general.location}\n` +
           `• **تأسست:** ${general.founded}\n` +
           `• **النوع:** ${general.type}\n` +
           `• **الاعتماد:** ${general.accreditation}\n` +
           `• **الموقع الإلكتروني:** ${general.website}\n\n` +
           `جامعة الشرق الأوسط هي إحدى الجامعات الرائدة في المنطقة، تقدم تعليماً عالي الجودة في بيئة أكاديمية متميزة.`;
  }

  return null;
};

// وظيفة للحصول على إجابة من الذكي الاصطناعي
export const getAIResponse = async (question) => {
  try {
    // أولاً، ابحث في قاعدة البيانات المحلية
    const localResponse = searchLocalKnowledge(question);
    if (localResponse) {
      return localResponse;
    }

    // إجابات تجريبية محسنة للأسئلة الشائعة
    const enhancedResponses = {
      'مرحبا': 'مرحباً بك في Ask MEU! 👋\n\nأنا مساعدك الذكي لجامعة الشرق الأوسط. يمكنني مساعدتك في:\n\n• معلومات التسجيل والرسوم\n• التخصصات والكليات\n• المرافق والخدمات\n• الامتحانات والدرجات\n• معلومات الاتصال\n\nكيف يمكنني مساعدتك اليوم؟',
      
      'شكرا': 'العفو! 😊 أتمنى أن تكون المعلومات مفيدة لك. إذا كان لديك أي أسئلة أخرى حول جامعة الشرق الأوسط، لا تتردد في السؤال!',
      
      'وقت': 'ساعات العمل في جامعة الشرق الأوسط:\n\n🕐 **الدوام الرسمي:**\nالأحد - الخميس: 8:00 ص - 4:00 م\n\n📚 **المكتبة:**\nالأحد - الخميس: 8:00 ص - 8:00 م\n\n🍽️ **الكافتيريا:**\nالأحد - الخميس: 7:30 ص - 6:00 م',
      
      'مساعدة': 'يمكنني مساعدتك في العديد من الأمور المتعلقة بجامعة الشرق الأوسط:\n\n📚 **الأكاديمية:**\n• التسجيل وإلغاء التسجيل\n• الرسوم والمنح\n• التخصصات والمناهج\n• الامتحانات والدرجات\n\n🏢 **الخدمات:**\n• المرافق الجامعية\n• المكتبة والمختبرات\n• الأنشطة الطلابية\n\n📞 **التواصل:**\n• أرقام الهواتف\n• العناوين الإلكترونية\n• ساعات العمل\n\nاسأل عن أي موضوع تريد معرفة المزيد عنه!'
    };

    // محاكاة تأخير الشبكة
    await new Promise(resolve => setTimeout(resolve, 1200));

    // البحث عن إجابة مناسبة
    for (let key in enhancedResponses) {
      if (question.toLowerCase().includes(key)) {
        return enhancedResponses[key];
      }
    }
    
    // إجابة افتراضية محسنة
    return `شكراً لك على سؤالك! 🤔\n\nلم أجد إجابة محددة في قاعدة البيانات الحالية، ولكن يمكنك:\n\n📞 **التواصل المباشر:**\n• الهاتف: +962-6-4291511\n• البريد الإلكتروني: info@meu.edu.jo\n\n🌐 **زيارة الموقع الإلكتروني:**\nwww.meu.edu.jo\n\n🏢 **زيارة الجامعة:**\nمطار الملكة علياء الدولي، عمان، الأردن\n\nفريق الدعم سيكون سعيداً لمساعدتك! 😊`;
    
  } catch (error) {
    console.error('خطأ في الاتصال مع الذكي الاصطناعي:', error);
    return 'عذراً، حدث خطأ تقني مؤقت. يرجى المحاولة مرة أخرى أو التواصل مع الدعم التقني على: info@meu.edu.jo 📧';
  }
};

// وظيفة لتحليل نوع السؤال (محسنة)
export const analyzeQuestion = (question) => {
  const lowerQuestion = question.toLowerCase();
  
  const categories = {
    registration: ['تسجيل', 'رسوم', 'منح', 'قبول', 'تأجيل', 'انسحاب'],
    academic: ['تخصص', 'كلية', 'مادة', 'مقرر', 'منهج', 'دراسة'],
    facilities: ['مكتبة', 'مختبر', 'كافتيريا', 'موقف', 'ملعب', 'قاعة'],
    exams: ['امتحان', 'درجة', 'معدل', 'نتيجة', 'تقدير'],
    contact: ['اتصال', 'هاتف', 'عنوان', 'موقع', 'بريد'],
    general: ['جامعة', 'معلومات', 'عن', 'meu']
  };

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => lowerQuestion.includes(keyword))) {
      return category;
    }
  }
  
  return 'general';
};