/* === SVG Icons & Mock Data (Sections 4, 9, 10) === */

var ICONS = {
  chat: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>',
  newspaper: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>',
  lifebuoy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"/><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"/><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"/></svg>',
  lightbulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/></svg>'
};

/* === Spaces & Channels (Гуру-пространства) === */

var SPACES_DATA = [
  /* --- 1. JAGA Хаб (системный уровень) --- */
  {
    id: 'general',
    name: 'JAGA Хаб',
    icon: '✨',
    isSystem: true,
    subtitle: 'Центральное пространство для всех',
    channels: [
      {
        id: 'gen_announcements',
        name: 'Объявления',
        iconType: 'newspaper',
        iconBg: '#E0F2FE',
        iconColor: '#0284C7',
        lastSender: 'Радха Даси',
        lastText: 'Сегодня вечерняя программа начнётся в 18:30. Киртан будет в большом зале.',
        time: '10:42',
        unread: 2,
        messages: [
          { sender: 'Радха Даси', time: 'Вчера, 18:00', text: 'Дорогие участники! Напоминаем о расписании программ на неделю.' },
          { sender: 'Радха Даси', time: '10:42', text: 'Сегодня вечерняя программа начнётся в 18:30. Киртан будет в большом зале.' }
        ]
      },
      {
        id: 'gen_help',
        name: 'Вопросы и помощь',
        iconType: 'lifebuoy',
        iconBg: '#DCFCE7',
        iconColor: '#16A34A',
        lastSender: 'Мадхава дас',
        lastText: 'Кто-нибудь знает, где можно найти русский перевод комментариев Вишванатхи Чакраварти?',
        time: '09:18',
        unread: 0,
        messages: [
          { sender: 'Мадхава дас', time: '09:18', text: 'Кто-нибудь знает, где можно найти русский перевод комментариев Вишванатхи Чакраварти?' },
          { sender: 'Вриндаван дас', time: '09:25', text: 'Да, они выложены в библиотеке в разделе «Философия». Могу скинуть ссылку.' },
          { sender: 'Мадхава дас', time: '09:28', text: 'Буду очень признателен 🙏' }
        ]
      },
      {
        id: 'gen_free_chat',
        name: 'Свободное общение',
        iconType: 'chat',
        iconBg: '#F3E8FF',
        iconColor: '#9333EA',
        lastSender: 'Гопал дас',
        lastText: 'Харе Кришна! Кто завтра едет в храм утром?',
        time: 'вчера',
        unread: 4,
        messages: [
          { sender: 'Гопал дас', time: 'Вчера, 19:40', text: 'Харе Кришна! Кто завтра едет в храм утром?' },
          { sender: 'Радха Даси', time: 'Вчера, 19:45', text: 'Мы выезжаем около 8:00, есть два свободных места.' },
          { sender: 'Ананда дас', time: 'Вчера, 19:50', text: 'Я бы с удовольствием присоединился!' },
          { sender: 'Гопал дас', time: 'Вчера, 20:00', text: 'Отлично, напиши мне в личку номер.' }
        ]
      }
    ]
  },

  /* --- 2. Бхакти Вигьяна Госвами --- */
  {
    id: 'bhakti',
    name: 'Бхакти Вигьяна Госвами',
    icon: '🪷',
    subtitle: 'Ученики, духовная практика и наставления',
    channels: [
      {
        id: 'bhakti_japa',
        name: 'Утренняя джапа',
        iconType: 'chat',
        iconBg: '#F3E8FF',
        iconColor: '#9333EA',
        lastSender: 'Ананда дас',
        lastText: 'Сегодня получилось закончить 16 кругов до восьми утра 🙏',
        time: '08:06',
        unread: 0,
        messages: [
          { sender: 'Ананда дас', time: '08:06', text: 'Сегодня получилось закончить 16 кругов до восьми утра 🙏' }
        ]
      },
      {
        id: 'bhakti_gita',
        name: 'Бхагавад-гита',
        iconType: 'newspaper',
        iconBg: '#E0F2FE',
        iconColor: '#0284C7',
        lastSender: 'Нитьянанда дас',
        lastText: 'Мне кажется, во второй главе здесь особенно важен переход от знания к действию.',
        time: '10:15',
        unread: 1,
        messages: [
          { sender: 'Нитьянанда дас', time: '09:48', text: 'Кто сегодня читал вторую главу?' },
          { sender: 'Мадхава дас', time: '09:51', text: 'Да. Я как раз остановился на стихах про устойчивый разум.' },
          { sender: 'Лалита Даси', time: '09:53', text: 'Мне там нравится, что речь не просто про спокойствие, а про отсутствие зависимости от результата.' },
          { sender: 'Нитьянанда дас', time: '10:02', text: 'Да, именно. И дальше это постепенно связывается с действием.' },
          { sender: 'Ананда дас', time: '10:07', text: 'То есть идея не в том, чтобы перестать действовать, а в том, чтобы изменить отношение к действию?' },
          { sender: 'Нитьянанда дас', time: '10:15', text: 'Мне кажется, во второй главе здесь особенно важен переход от знания к действию.' }
        ]
      },
      {
        id: 'bhakti_prasad',
        name: 'Прасад',
        iconType: 'lightbulb',
        iconBg: '#FEF3C7',
        iconColor: '#D97706',
        lastSender: 'Лалита Даси',
        lastText: 'Я добавляю чуть позже, чтобы они совсем не разварились.',
        time: 'вчера',
        unread: 0,
        messages: [
          { sender: 'Лалита Даси', time: 'Вчера, 17:20', text: 'Кто спрашивал рецепт кичари после воскресной программы?' },
          { sender: 'Мира', time: 'Вчера, 17:24', text: 'Я :)' },
          { sender: 'Лалита Даси', time: 'Вчера, 17:26', text: 'Рис и мунг дал примерно один к одному. Сначала немного обжариваю специи в ги.' },
          { sender: 'Мира', time: 'Вчера, 17:28', text: 'А овощи сразу?' },
          { sender: 'Лалита Даси', time: 'Вчера, 17:32', text: 'Я добавляю чуть позже, чтобы они совсем не разварились.' }
        ]
      },
      {
        id: 'bhakti_seva',
        name: 'Сева',
        iconType: 'calendar',
        iconBg: '#FFE4E6',
        iconColor: '#E11D48',
        lastSender: 'Рагхунатха дас',
        lastText: 'На субботу ещё нужны два человека помочь с подготовкой зала.',
        time: 'вчера',
        unread: 2,
        messages: [
          { sender: 'Рагхунатха дас', time: 'Вчера, 16:00', text: 'На субботу ещё нужны два человека помочь с подготовкой зала.' },
          { sender: 'Ананда дас', time: 'Вчера, 16:15', text: 'Я смогу прийти к 11:00.' },
          { sender: 'Рагхунатха дас', time: 'Вчера, 16:20', text: 'Отлично! Нужен еще один помощник.' }
        ]
      }
    ]
  },

  /* --- 3. Радханатх Свами --- */
  {
    id: 'govardhan',
    name: 'Радханатх Свами',
    icon: '⛰',
    subtitle: 'Киртан, милосердие и паломничества',
    channels: [
      {
        id: 'gov_kirtan',
        name: 'Киртан',
        iconType: 'lifebuoy',
        iconBg: '#DCFCE7',
        iconColor: '#16A34A',
        lastSender: 'Шьям дас',
        lastText: 'Послушайте запись вчерашнего киртана. Последние десять минут очень сильные.',
        time: '11:03',
        unread: 3,
        messages: [
          { sender: 'Шьям дас', time: '10:51', text: 'Харе Кришна. Есть у кого-нибудь запись вчерашнего киртана?' },
          { sender: 'Гопал дас', time: '10:54', text: 'У меня есть почти целиком.' },
          { sender: 'Гопал дас', time: '10:55', text: 'Запись вчерашнего киртана', isAudio: true, audioDuration: '32:14' },
          { sender: 'Гаура Даси', time: '10:58', text: 'Спасибо!' },
          { sender: 'Шьям дас', time: '11:03', text: 'Послушайте последние десять минут, очень сильные.' }
        ]
      },
      {
        id: 'gov_pilgrim',
        name: 'Паломничества',
        iconType: 'calendar',
        iconBg: '#FFE4E6',
        iconColor: '#E11D48',
        lastSender: 'Гаура Даси',
        lastText: 'В октябре снова планируем поездку во Вриндаван. Скоро отправлю детали.',
        time: 'вчера',
        unread: 0,
        messages: [
          { sender: 'Гаура Даси', time: 'Вчера', text: 'В октябре снова планируем поездку во Вриндаван. Скоро отправлю детали.' }
        ]
      },
      {
        id: 'gov_temples',
        name: 'Храмы и места',
        iconType: 'newspaper',
        iconBg: '#E0F2FE',
        iconColor: '#0284C7',
        lastSender: 'Мукунда дас',
        lastText: 'Добавил несколько фотографий Радха-кунды с нашей прошлой поездки.',
        time: 'пн',
        unread: 0,
        messages: [
          { sender: 'Мукунда дас', time: 'Пн', text: 'Добавил несколько фотографий Радха-кунды с нашей прошлой поездки.' }
        ]
      },
      {
        id: 'gov_flood',
        name: 'Флудилка',
        iconType: 'chat',
        iconBg: '#F3E8FF',
        iconColor: '#9333EA',
        lastSender: 'Хари дас',
        lastText: 'Кто опять оставил огромный пакет бананов на кухне? 😄',
        time: 'пн',
        unread: 0,
        messages: [
          { sender: 'Хари дас', time: 'Пн', text: 'Кто опять оставил огромный пакет бананов на кухне? 😄' },
          { sender: 'Гопал дас', time: 'Пн', text: 'Это для вечернего прасада! 🍌' }
        ]
      }
    ]
  },

  /* --- 4. Джаяпатака Свами --- */
  {
    id: 'navadvipa',
    name: 'Джаяпатака Свами',
    icon: '🌼',
    subtitle: 'Навадвипа, санкиртана и книги',
    channels: [
      {
        id: 'nava_lila',
        name: 'Чайтанья-лила',
        iconType: 'newspaper',
        iconBg: '#E0F2FE',
        iconColor: '#0284C7',
        lastSender: 'Вриндаван дас',
        lastText: 'Нашёл интересное описание Навадвипы конца XV века. Закину вечером.',
        time: '09:44',
        unread: 1,
        messages: [
          { sender: 'Вриндаван дас', time: '09:44', text: 'Нашёл интересное описание Навадвипы конца XV века. Закину вечером.' }
        ]
      },
      {
        id: 'nava_books',
        name: 'Книги',
        iconType: 'lightbulb',
        iconBg: '#FEF3C7',
        iconColor: '#D97706',
        lastSender: 'Кешава дас',
        lastText: 'Начал «Чайтанья-чаритамриту» заново. Есть желающие читать вместе?',
        time: 'вчера',
        unread: 0,
        messages: [
          { sender: 'Кешава дас', time: 'Вчера', text: 'Начал «Чайтанья-чаритамриту» заново. Есть желающие читать вместе?' }
        ]
      },
      {
        id: 'nava_newbies',
        name: 'Вопросы новичков',
        iconType: 'lifebuoy',
        iconBg: '#DCFCE7',
        iconColor: '#16A34A',
        lastSender: 'Мира',
        lastText: 'А чем джапа принципиально отличается от киртана?',
        time: 'вчера',
        unread: 0,
        messages: [
          { sender: 'Мира', time: 'Вчера, 19:11', text: 'Можно глупый вопрос?' },
          { sender: 'Кешава дас', time: 'Вчера, 19:12', text: 'Здесь именно для этого канал :)' },
          { sender: 'Мира', time: 'Вчера, 19:14', text: 'А чем джапа принципиально отличается от киртана?' },
          { sender: 'Кешава дас', time: 'Вчера, 19:18', text: 'Джапа — личное повторение мантры, обычно на чётках. Киртан — совместное воспевание, как правило музыкальное.' },
          { sender: 'Мира', time: 'Вчера, 19:20', text: 'Теперь понятно, спасибо.' }
        ]
      }
    ]
  },

  /* --- 5. Гопал Кришна Госвами --- */
  {
    id: 'gopal_krishna',
    name: 'Гопал Кришна Госвами',
    icon: '📜',
    subtitle: 'Служение божествам и издание книг',
    channels: [
      {
        id: 'gk_publishing',
        name: 'Издание книг',
        iconType: 'newspaper',
        iconBg: '#E0F2FE',
        iconColor: '#0284C7',
        lastSender: 'Бхакта Дмитрий',
        lastText: 'Новый тираж «Шримад-Бхагаватам» уже на складе!',
        time: '12:10',
        unread: 2,
        messages: [
          { sender: 'Бхакта Дмитрий', time: '12:10', text: 'Новый тираж «Шримад-Бхагаватам» уже на складе!' },
          { sender: 'Мадхава дас', time: '12:15', text: 'Отличная новость! Сколько комплектов прибыло?' }
        ]
      },
      {
        id: 'gk_temple_seva',
        name: 'Храмовое служение',
        iconType: 'calendar',
        iconBg: '#FFE4E6',
        iconColor: '#E11D48',
        lastSender: 'Према Даси',
        lastText: 'Составляем расписание пуджари на следующую неделю.',
        time: 'вчера',
        unread: 0,
        messages: [
          { sender: 'Према Даси', time: 'Вчера', text: 'Составляем расписание пуджари на следующую неделю.' }
        ]
      }
    ]
  },

  /* --- 6. Бхакти Чайтанья Свами --- */
  {
    id: 'bhakti_chaitanya',
    name: 'Бхакти Чайтанья Свами',
    icon: '🌿',
    subtitle: 'Святые дхамы и ведическая философия',
    channels: [
      {
        id: 'bc_vrindavan_dhama',
        name: 'Паломничества по Вриндавану',
        iconType: 'lifebuoy',
        iconBg: '#DCFCE7',
        iconColor: '#16A34A',
        lastSender: 'Вриндаван Чандра',
        lastText: 'Видеозапись лекции на Варшане загружена в архив.',
        time: '14:20',
        unread: 1,
        messages: [
          { sender: 'Вриндаван Чандра', time: '14:20', text: 'Видеозапись лекции на Варшане загружена в архив.' }
        ]
      },
      {
        id: 'bc_seminars',
        name: 'Лекции и семинары',
        iconType: 'lightbulb',
        iconBg: '#FEF3C7',
        iconColor: '#D97706',
        lastSender: 'Яшода Даси',
        lastText: 'Следующий вебинар по «Нектару преданности» в четверг.',
        time: 'пн',
        unread: 0,
        messages: [
          { sender: 'Яшода Даси', time: 'Пн', text: 'Следующий вебинар по «Нектару преданности» в четверг.' }
        ]
      }
    ]
  },

  /* --- 7. Девамрита Свами --- */
  {
    id: 'devamrita',
    name: 'Девамрита Свами',
    icon: '🔥',
    subtitle: 'Городская миссия и молодежные центры',
    channels: [
      {
        id: 'dev_loft',
        name: 'Мантра-лофты и молодежь',
        iconType: 'chat',
        iconBg: '#F3E8FF',
        iconColor: '#9333EA',
        lastSender: 'Арджуна дас',
        lastText: 'В эту пятницу на встрече клуба обсуждаем книгу «В поисках вечной любви».',
        time: '15:30',
        unread: 3,
        messages: [
          { sender: 'Арджуна дас', time: '15:30', text: 'В эту пятницу на встрече клуба обсуждаем книгу «В поисках вечной любви».' }
        ]
      },
      {
        id: 'dev_outreach',
        name: 'Городские проекты',
        iconType: 'lightbulb',
        iconBg: '#FEF3C7',
        iconColor: '#D97706',
        lastSender: 'Кришна Канти',
        lastText: 'Готовим презентацию для веганского фестиваля.',
        time: 'вчера',
        unread: 0,
        messages: [
          { sender: 'Кришна Канти', time: 'Вчера', text: 'Готовим презентацию для веганского фестиваля.' }
        ]
      }
    ]
  },

  /* --- 8. Локанатх Свами --- */
  {
    id: 'lokanath',
    name: 'Локанатх Свами',
    icon: '🪗',
    subtitle: 'Падаятра, киртан и харинама-санкиртана',
    channels: [
      {
        id: 'loka_harinama',
        name: 'Харинама-санкиртана',
        iconType: 'lifebuoy',
        iconBg: '#DCFCE7',
        iconColor: '#16A34A',
        lastSender: 'Бхакта Алексей',
        lastText: 'Сбор на субботнюю харинаму в центре в 16:00 возле фонтана.',
        time: '16:45',
        unread: 1,
        messages: [
          { sender: 'Бхакта Алексей', time: '16:45', text: 'Сбор на субботнюю харинаму в центре в 16:00 возле фонтана.' }
        ]
      },
      {
        id: 'loka_padayatra',
        name: 'Падаятра всемирная',
        iconType: 'calendar',
        iconBg: '#FFE4E6',
        iconColor: '#E11D48',
        lastSender: 'Рама дас',
        lastText: 'Маршрут пешего паломничества утвержден на июль.',
        time: 'пн',
        unread: 0,
        messages: [
          { sender: 'Рама дас', time: 'Пн', text: 'Маршрут пешего паломничества утвержден на июль.' }
        ]
      }
    ]
  },

  /* --- 9. Индрадьюмна Свами --- */
  {
    id: 'indradyumna',
    name: 'Индрадьюмна Свами',
    icon: '🌺',
    subtitle: 'Фестивали Индии и странствия',
    channels: [
      {
        id: 'ids_festivals',
        name: 'Фестиваль Индии',
        iconType: 'calendar',
        iconBg: '#FFE4E6',
        iconColor: '#E11D48',
        lastSender: 'Шримати Даси',
        lastText: 'Репетиция танцевальной труппы завтра в 11:00.',
        time: '17:00',
        unread: 2,
        messages: [
          { sender: 'Шримати Даси', time: '17:00', text: 'Репетиция танцевальной труппы завтра в 11:00.' }
        ]
      },
      {
        id: 'ids_diary',
        name: 'Дневник странствующего монаха',
        iconType: 'newspaper',
        iconBg: '#E0F2FE',
        iconColor: '#0284C7',
        lastSender: 'Говинда дас',
        lastText: 'Опубликована новая глава путевых заметок Махараджа.',
        time: 'вчера',
        unread: 0,
        messages: [
          { sender: 'Говинда дас', time: 'Вчера', text: 'Опубликована новая глава путевых заметок Махараджа.' }
        ]
      }
    ]
  }
];
