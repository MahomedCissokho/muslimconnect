import type { Dua, DuaCategory } from "../types";

// ─── Catégories ─────────────────────────────────

export const DUA_CATEGORIES: DuaCategory[] = [
  {
    id: "morning",
    nameEn: "Morning",
    nameFr: "Matin",
    icon: "sunny",
    gradient: ["#F59E0B", "#F9BD64"] as const,
  },
  {
    id: "evening",
    nameEn: "Evening",
    nameFr: "Soir",
    icon: "moon",
    gradient: ["#4338CA", "#818CF8"] as const,
  },
  {
    id: "prayer",
    nameEn: "After Prayer",
    nameFr: "Après la prière",
    icon: "hand-left",
    gradient: ["#672CBC", "#9879E9"] as const,
  },
  {
    id: "protection",
    nameEn: "Protection",
    nameFr: "Protection",
    icon: "shield-checkmark",
    gradient: ["#047857", "#34D399"] as const,
  },
  {
    id: "forgiveness",
    nameEn: "Forgiveness",
    nameFr: "Pardon",
    icon: "heart",
    gradient: ["#BE185D", "#F472B6"] as const,
  },
  {
    id: "rizq",
    nameEn: "Sustenance",
    nameFr: "Subsistance",
    icon: "leaf",
    gradient: ["#15803D", "#86EFAC"] as const,
  },
  {
    id: "travel",
    nameEn: "Travel",
    nameFr: "Voyage",
    icon: "airplane",
    gradient: ["#0369A1", "#38BDF8"] as const,
  },
  {
    id: "rain",
    nameEn: "Rain",
    nameFr: "Pluie",
    icon: "rainy",
    gradient: ["#1E40AF", "#60A5FA"] as const,
  },
  {
    id: "marriage",
    nameEn: "Marriage & Family",
    nameFr: "Mariage & Famille",
    icon: "people",
    gradient: ["#9D174D", "#FB7185"] as const,
  },
  {
    id: "dhikr",
    nameEn: "Dhikr",
    nameFr: "Dhikr",
    icon: "sparkles",
    gradient: ["#B45309", "#FCD34D"] as const,
  },
  {
    id: "ramadan",
    nameEn: "Ramadan",
    nameFr: "Ramadan",
    icon: "moon-outline",
    gradient: ["#1E3A8A", "#3B82F6"] as const,
  },
  {
    id: "suhur",
    nameEn: "Suhur",
    nameFr: "Suhur",
    icon: "partly-sunny-outline",
    gradient: ["#92400E", "#F59E0B"] as const,
  },
  {
    id: "iftar",
    nameEn: "Iftar",
    nameFr: "Rupture du jeûne",
    icon: "restaurant-outline",
    gradient: ["#7C3AED", "#A78BFA"] as const,
  },
];

// ─── Adhkar du matin ────────────────────────────

const MORNING_DUAS: Dua[] = [
  {
    id: 100,
    categoryId: "morning",
    titleEn: "Upon waking up",
    titleFr: "Au réveil",
    textAr:
      "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ.",
    phonetic:
      "Al-ḥamdu lillāhi-lladhī aḥyānā ba'da mā amātanā wa ilayhi-n-nushūr.",
    textEn:
      "All praise is for Allah who gave us life after causing us to die, and to Him is the resurrection.",
    textFr:
      "Toute louange est à Allah qui nous a donné la vie après nous avoir fait mourir, et c'est vers Lui la résurrection.",
    referenceEn: "Bukhari",
    referenceFr: "Boukhari",
  },
  {
    id: 101,
    categoryId: "morning",
    titleEn: "Morning remembrance",
    titleFr: "Rappel du matin",
    textAr:
      "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.",
    phonetic:
      "Aṣbaḥnā wa aṣbaḥa-l-mulku lillāh, wa-l-ḥamdu lillāh, lā ilāha illā-llāhu waḥdahu lā sharīka lah, lahu-l-mulku wa lahu-l-ḥamdu wa huwa 'alā kulli shay'in qadīr.",
    textEn:
      "We have reached the morning and the dominion belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah alone, without partner. To Him belongs the dominion and all praise, and He is over all things Able.",
    textFr:
      "Nous voilà au matin et le royaume appartient à Allah. Toute louange est à Allah. Nul ne mérite d'être adoré sauf Allah, Seul, sans associé. À Lui le royaume et la louange, et Il est capable de toute chose.",
    referenceEn: "Muslim",
    referenceFr: "Mouslim",
  },
  {
    id: 102,
    categoryId: "morning",
    titleEn: "Master of Istighfar",
    titleFr: "Maître de l'Istighfar",
    textAr:
      "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ.",
    phonetic:
      "Allāhumma anta rabbī lā ilāha illā anta, khalaqtanī wa anā 'abduka, wa anā 'alā 'ahdika wa wa'dika mā-staṭa'tu, a'ūdhu bika min sharri mā ṣana'tu, abū'u laka bi-ni'matika 'alayya wa abū'u bi-dhanbī fa-ghfir lī fa-innahu lā yaghfiru-dh-dhunūba illā anta.",
    textEn:
      "O Allah, You are my Lord, none has the right to be worshipped except You. You created me and I am Your servant, and I abide by Your covenant and promise as best I can. I seek refuge in You from the evil of what I have done. I acknowledge Your favor upon me and I acknowledge my sin, so forgive me, for none forgives sins but You.",
    textFr:
      "Ô Allah, Tu es mon Seigneur, nul ne mérite d'être adoré sauf Toi. Tu m'as créé et je suis Ton serviteur, et je tiens à Ton pacte et Ta promesse autant que possible. Je cherche refuge auprès de Toi contre le mal que j'ai fait. Je reconnais Ton bienfait sur moi et je reconnais mon péché, alors pardonne-moi, car nul ne pardonne les péchés sauf Toi.",
    referenceEn: "Bukhari",
    referenceFr: "Boukhari",
  },
  {
    id: 103,
    categoryId: "morning",
    titleEn: "Trust in Allah",
    titleFr: "Confiance en Allah",
    textAr:
      "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ.",
    phonetic:
      "Bismillāhi tawakkaltu 'ala-llāh, lā ḥawla wa lā quwwata illā billāh.",
    textEn:
      "In the name of Allah, I place my trust in Allah. There is no might and no power except with Allah.",
    textFr:
      "Au nom d'Allah, je place ma confiance en Allah. Il n'y a de puissance ni de force qu'en Allah.",
    referenceEn: "Abu Dawud, Tirmidhi",
    referenceFr: "Abou Dawoud, Tirmidhi",
  },
  {
    id: 104,
    categoryId: "morning",
    titleEn: "Seeking protection (3x)",
    titleFr: "Rechercher la protection (3x)",
    textAr:
      "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.",
    phonetic:
      "Bismillāhi-lladhī lā yaḍurru ma'a-smihi shay'un fi-l-arḍi wa lā fi-s-samā'i wa huwa-s-samī'u-l-'alīm.",
    textEn:
      "In the name of Allah with whose name nothing is harmed on earth or in the heavens, and He is the All-Hearing, the All-Knowing.",
    textFr:
      "Au nom d'Allah, par le nom duquel rien n'est nui ni sur terre ni dans les cieux, et Il est l'Audient, l'Omniscient.",
    referenceEn: "Abu Dawud, Tirmidhi",
    referenceFr: "Abou Dawoud, Tirmidhi",
  },
];

// ─── Adhkar du soir ─────────────────────────────

const EVENING_DUAS: Dua[] = [
  {
    id: 200,
    categoryId: "evening",
    titleEn: "Evening remembrance",
    titleFr: "Rappel du soir",
    textAr:
      "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.",
    phonetic:
      "Amsaynā wa amsa-l-mulku lillāh, wa-l-ḥamdu lillāh, lā ilāha illā-llāhu waḥdahu lā sharīka lah, lahu-l-mulku wa lahu-l-ḥamdu wa huwa 'alā kulli shay'in qadīr.",
    textEn:
      "We have reached the evening and the dominion belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah alone, without partner.",
    textFr:
      "Nous voilà au soir et le royaume appartient à Allah. Toute louange est à Allah. Nul ne mérite d'être adoré sauf Allah, Seul, sans associé.",
    referenceEn: "Muslim",
    referenceFr: "Mouslim",
  },
  {
    id: 201,
    categoryId: "evening",
    titleEn: "Before sleep",
    titleFr: "Avant de dormir",
    textAr: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا.",
    phonetic: "Bismika-llāhumma amūtu wa aḥyā.",
    textEn: "In Your name, O Allah, I die and I live.",
    textFr: "En Ton nom, ô Allah, je meurs et je vis.",
    referenceEn: "Bukhari",
    referenceFr: "Boukhari",
  },
  {
    id: 202,
    categoryId: "evening",
    titleEn: "Ayat Al-Kursi",
    titleFr: "Ayat Al-Koursi",
    textAr:
      "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ.",
    phonetic:
      "Allāhu lā ilāha illā huwa-l-ḥayyu-l-qayyūm, lā ta'khudhuhū sinatun wa lā nawm, lahu mā fi-s-samāwāti wa mā fi-l-arḍ...",
    textEn:
      "Allah! There is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth.",
    textFr:
      "Allah ! Nulle divinité autre que Lui, le Vivant, le Subsistant par Lui-même. Ni somnolence ni sommeil ne Le saisissent. À Lui appartient tout ce qui est dans les cieux et sur la terre.",
    referenceEn: "Quran 2:255",
    referenceFr: "Coran 2:255",
  },
  {
    id: 203,
    categoryId: "evening",
    titleEn: "Protection at night",
    titleFr: "Protection de la nuit",
    textAr: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ.",
    phonetic: "A'ūdhu bi-kalimāti-llāhi-t-tāmmāt min sharri mā khalaq.",
    textEn:
      "I seek refuge in the perfect words of Allah from the evil of what He has created.",
    textFr:
      "Je cherche refuge dans les paroles parfaites d'Allah contre le mal de ce qu'Il a créé.",
    referenceEn: "Muslim",
    referenceFr: "Mouslim",
  },
  {
    id: 204,
    categoryId: "evening",
    titleEn: "Seeking forgiveness before sleep",
    titleFr: "Demander pardon avant de dormir",
    textAr:
      "أَسْتَغْفِرُ اللَّهَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ.",
    phonetic:
      "Astaghfiru-llāha-lladhī lā ilāha illā huwa-l-ḥayyu-l-qayyūmu wa atūbu ilayh.",
    textEn:
      "I seek forgiveness from Allah, the One whom there is no deity worthy of worship except Him, the Ever-Living, the Sustainer, and I repent to Him.",
    textFr:
      "Je demande pardon à Allah, Celui dont il n'y a nulle divinité digne d'adoration sauf Lui, le Vivant, le Subsistant, et je me repens à Lui.",
    referenceEn: "Abu Dawud, Tirmidhi",
    referenceFr: "Abou Dawoud, Tirmidhi",
  },
];

// ─── Après la prière ────────────────────────────

const PRAYER_DUAS: Dua[] = [
  {
    id: 300,
    categoryId: "prayer",
    titleEn: "After Tasleem",
    titleFr: "Après le Tasleem",
    textAr: "أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ.",
    phonetic: "Astaghfiru-llāh, astaghfiru-llāh, astaghfiru-llāh.",
    textEn: "I seek Allah's forgiveness (3 times).",
    textFr: "Je demande pardon à Allah (3 fois).",
    referenceEn: "Muslim",
    referenceFr: "Mouslim",
  },
  {
    id: 301,
    categoryId: "prayer",
    titleEn: "After obligatory prayer",
    titleFr: "Après la prière obligatoire",
    textAr:
      "اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ.",
    phonetic:
      "Allāhumma anta-s-salāmu wa minka-s-salām, tabārakta yā dha-l-jalāli wa-l-ikrām.",
    textEn:
      "O Allah, You are Peace and from You is peace. Blessed are You, O Possessor of majesty and honor.",
    textFr:
      "Ô Allah, Tu es la Paix et de Toi vient la paix. Béni sois-Tu, ô Détenteur de la majesté et de la générosité.",
    referenceEn: "Muslim",
    referenceFr: "Mouslim",
  },
  {
    id: 302,
    categoryId: "prayer",
    titleEn: "SubhanAllah, Alhamdulillah, Allahu Akbar",
    titleFr: "SubhanAllah, Alhamdulillah, Allahou Akbar",
    textAr:
      "سُبْحَانَ اللَّهِ (33) وَالْحَمْدُ لِلَّهِ (33) وَاللَّهُ أَكْبَرُ (33) لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.",
    phonetic:
      "Subḥāna-llāh (33x), wa-l-ḥamdu lillāh (33x), wa-llāhu akbar (33x). Lā ilāha illā-llāhu waḥdahu lā sharīka lah, lahu-l-mulku wa lahu-l-ḥamdu wa huwa 'alā kulli shay'in qadīr.",
    textEn:
      "Glory be to Allah (33x), All praise is for Allah (33x), Allah is the Greatest (33x). None has the right to be worshipped except Allah alone with no partner. To Him belongs the dominion and praise, and He is over all things able.",
    textFr:
      "Gloire à Allah (33x), Louange à Allah (33x), Allah est le Plus Grand (33x). Nul ne mérite d'être adoré sauf Allah, Seul sans associé. À Lui le royaume et la louange, et Il est capable de toute chose.",
    referenceEn: "Muslim",
    referenceFr: "Mouslim",
  },
  {
    id: 303,
    categoryId: "prayer",
    titleEn: "Seeking refuge after prayer",
    titleFr: "Refuge après la prière",
    textAr:
      "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْجُبْنِ، وَأَعُوذُ بِكَ مِنَ الْبُخْلِ، وَأَعُوذُ بِكَ مِنْ أَنْ أُرَدَّ إِلَى أَرْذَلِ الْعُمُرِ، وَأَعُوذُ بِكَ مِنْ فِتْنَةِ الدُّنْيَا وَعَذَابِ الْقَبْرِ.",
    phonetic:
      "Allāhumma innī a'ūdhu bika mina-l-jubni, wa a'ūdhu bika mina-l-bukhli, wa a'ūdhu bika min an uradda ilā ardha-l-'umur, wa a'ūdhu bika min fitnati-d-dunyā wa 'adhābi-l-qabr.",
    textEn:
      "O Allah, I seek refuge in You from cowardice, I seek refuge in You from miserliness, I seek refuge in You from being sent back to a feeble age, and I seek refuge in You from the trial of this life and the punishment of the grave.",
    textFr:
      "Ô Allah, je cherche refuge auprès de Toi contre la lâcheté, je cherche refuge auprès de Toi contre l'avarice, je cherche refuge auprès de Toi contre le fait d'être ramené à l'âge de la décrépitude, et je cherche refuge auprès de Toi contre l'épreuve de ce monde et le châtiment de la tombe.",
    referenceEn: "Bukhari",
    referenceFr: "Boukhari",
  },
];

// ─── Protection ─────────────────────────────────

const PROTECTION_DUAS: Dua[] = [
  {
    id: 400,
    categoryId: "protection",
    titleEn: "Protection from evil eye",
    titleFr: "Protection contre le mauvais œil",
    textAr:
      "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّةِ مِنْ كُلِّ شَيْطَانٍ وَهَامَّةٍ وَمِنْ كُلِّ عَيْنٍ لَامَّةٍ.",
    phonetic:
      "A'ūdhu bi-kalimāti-llāhi-t-tāmmati min kulli shayṭānin wa hāmmatin wa min kulli 'aynin lāmmah.",
    textEn:
      "I seek refuge in the perfect words of Allah from every devil, poisonous creature, and every envious evil eye.",
    textFr:
      "Je cherche refuge dans les paroles parfaites d'Allah contre tout démon, toute créature venimeuse et tout mauvais œil envieux.",
    referenceEn: "Bukhari",
    referenceFr: "Boukhari",
  },
  {
    id: 401,
    categoryId: "protection",
    titleEn: "Entering the home",
    titleFr: "En entrant chez soi",
    textAr:
      "بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى رَبِّنَا تَوَكَّلْنَا.",
    phonetic:
      "Bismillāhi walajanā, wa bismillāhi kharajnā, wa 'alā rabbinā tawakkalnā.",
    textEn:
      "In the name of Allah we enter, in the name of Allah we leave, and in our Lord we trust.",
    textFr:
      "Au nom d'Allah nous entrons, au nom d'Allah nous sortons, et en notre Seigneur nous plaçons notre confiance.",
    referenceEn: "Abu Dawud",
    referenceFr: "Abou Dawoud",
  },
  {
    id: 402,
    categoryId: "protection",
    titleEn: "Leaving the home",
    titleFr: "En quittant la maison",
    textAr:
      "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ.",
    phonetic:
      "Bismillāhi tawakkaltu 'ala-llāh wa lā ḥawla wa lā quwwata illā billāh.",
    textEn:
      "In the name of Allah, I place my trust in Allah. There is no might or power except with Allah.",
    textFr:
      "Au nom d'Allah, je place ma confiance en Allah. Il n'y a de puissance ni de force qu'en Allah.",
    referenceEn: "Abu Dawud, Tirmidhi",
    referenceFr: "Abou Dawoud, Tirmidhi",
  },
  {
    id: 403,
    categoryId: "protection",
    titleEn: "Against anxiety and sorrow",
    titleFr: "Contre l'anxiété et le chagrin",
    textAr:
      "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَأَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ، وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ.",
    phonetic:
      "Allāhumma innī a'ūdhu bika mina-l-hammi wa-l-ḥazani, wa a'ūdhu bika mina-l-'ajzi wa-l-kasali, wa a'ūdhu bika mina-l-jubni wa-l-bukhli, wa a'ūdhu bika min ghalabati-d-dayni wa qahri-r-rijāl.",
    textEn:
      "O Allah, I seek refuge in You from anxiety and sorrow, from weakness and laziness, from cowardice and miserliness, and from the burden of debt and the domination of men.",
    textFr:
      "Ô Allah, je cherche refuge auprès de Toi contre l'anxiété et le chagrin, contre la faiblesse et la paresse, contre la lâcheté et l'avarice, et contre le poids de la dette et la domination des hommes.",
    referenceEn: "Bukhari",
    referenceFr: "Boukhari",
  },
];

// ─── Pardon ─────────────────────────────────────

const FORGIVENESS_DUAS: Dua[] = [
  {
    id: 500,
    categoryId: "forgiveness",
    titleEn: "Seeking forgiveness",
    titleFr: "Demander le pardon",
    textAr:
      "رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ.",
    phonetic: "Rabbi-ghfir lī wa tub 'alayya innaka anta-t-tawwābu-r-raḥīm.",
    textEn:
      "My Lord, forgive me and accept my repentance. Indeed, You are the Accepter of repentance, the Most Merciful.",
    textFr:
      "Mon Seigneur, pardonne-moi et accepte mon repentir. Tu es certes l'Accueillant au repentir, le Très Miséricordieux.",
    referenceEn: "Abu Dawud, Tirmidhi",
    referenceFr: "Abou Dawoud, Tirmidhi",
  },
  {
    id: 501,
    categoryId: "forgiveness",
    titleEn: "Dua of Yunus (AS)",
    titleFr: "Invocation de Younous (AS)",
    textAr:
      "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ.",
    phonetic: "Lā ilāha illā anta subḥānaka innī kuntu mina-ẓ-ẓālimīn.",
    textEn:
      "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.",
    textFr:
      "Point de divinité à part Toi ! Gloire à Toi ! J'ai été certes du nombre des injustes.",
    referenceEn: "Quran 21:87",
    referenceFr: "Coran 21:87",
  },
  {
    id: 502,
    categoryId: "forgiveness",
    titleEn: "Comprehensive forgiveness",
    titleFr: "Pardon complet",
    textAr:
      "اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ، دِقَّهُ وَجِلَّهُ، وَأَوَّلَهُ وَآخِرَهُ، وَعَلَانِيَتَهُ وَسِرَّهُ.",
    phonetic:
      "Allāhumma-ghfir lī dhanbī kullahu, diqqahu wa jillahu, wa awwalahu wa ākhirahu, wa 'alāniyatahu wa sirrahu.",
    textEn:
      "O Allah, forgive me all my sins, the small and the great, the first and the last, the public and the private.",
    textFr:
      "Ô Allah, pardonne-moi tous mes péchés, les petits et les grands, les premiers et les derniers, les publics et les secrets.",
    referenceEn: "Muslim",
    referenceFr: "Mouslim",
  },
  {
    id: 503,
    categoryId: "forgiveness",
    titleEn: "Dua of Adam (AS)",
    titleFr: "Invocation d'Adam (AS)",
    textAr:
      "رَبَّنَا ظَلَمْنَا أَنْفُسَنَا وَإِنْ لَمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ.",
    phonetic:
      "Rabbanā ẓalamnā anfusanā wa in lam taghfir lanā wa tarḥamnā la-nakūnanna mina-l-khāsirīn.",
    textEn:
      "Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers.",
    textFr:
      "Seigneur ! Nous nous sommes fait du tort à nous-mêmes. Et si Tu ne nous pardonnes pas et ne nous fais pas miséricorde, nous serons certes du nombre des perdants.",
    referenceEn: "Quran 7:23",
    referenceFr: "Coran 7:23",
  },
];

// ─── Subsistance (Rizq) ─────────────────────────

const RIZQ_DUAS: Dua[] = [
  {
    id: 600,
    categoryId: "rizq",
    titleEn: "Seeking provision",
    titleFr: "Demander la subsistance",
    textAr:
      "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا.",
    phonetic:
      "Allāhumma innī as'aluka 'ilman nāfi'an wa rizqan ṭayyiban wa 'amalan mutaqabbalan.",
    textEn:
      "O Allah, I ask You for beneficial knowledge, pure provision, and accepted deeds.",
    textFr:
      "Ô Allah, je Te demande un savoir bénéfique, une subsistance pure et des actes acceptés.",
    referenceEn: "Ibn Majah",
    referenceFr: "Ibn Majah",
  },
  {
    id: 601,
    categoryId: "rizq",
    titleEn: "Protection from poverty",
    titleFr: "Protection contre la pauvreté",
    textAr:
      "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْفَقْرِ وَالْقِلَّةِ وَالذِّلَّةِ وَأَعُوذُ بِكَ مِنْ أَنْ أَظْلِمَ أَوْ أُظْلَمَ.",
    phonetic:
      "Allāhumma innī a'ūdhu bika mina-l-faqri wa-l-qillati wa-dh-dhillati wa a'ūdhu bika min an aẓlima aw uẓlam.",
    textEn:
      "O Allah, I seek refuge in You from poverty, scarcity, and humiliation, and I seek refuge in You from wronging or being wronged.",
    textFr:
      "Ô Allah, je cherche refuge auprès de Toi contre la pauvreté, le manque et l'humiliation, et je cherche refuge auprès de Toi contre le fait de commettre ou de subir l'injustice.",
    referenceEn: "Abu Dawud, Nasa'i",
    referenceFr: "Abou Dawoud, Nasa'i",
  },
  {
    id: 602,
    categoryId: "rizq",
    titleEn: "Contentment",
    titleFr: "Le contentement",
    textAr:
      "اللَّهُمَّ قَنِّعْنِي بِمَا رَزَقْتَنِي وَبَارِكْ لِي فِيهِ وَاخْلُفْ عَلَيَّ كُلَّ غَائِبَةٍ لِي بِخَيْرٍ.",
    phonetic:
      "Allāhumma qanni'nī bimā razaqtanī wa bārik lī fīhi wa-khluf 'alayya kulla ghā'ibatin lī bi-khayr.",
    textEn:
      "O Allah, make me content with what You have provided for me, bless it for me, and replace for me every absent thing with something better.",
    textFr:
      "Ô Allah, rends-moi satisfait de ce que Tu m'as accordé, bénis-le pour moi, et remplace pour moi toute chose absente par quelque chose de meilleur.",
    referenceEn: "Al-Hakim",
    referenceFr: "Al-Hakim",
  },
];

// ─── Voyage ─────────────────────────────────────

const TRAVEL_DUAS: Dua[] = [
  {
    id: 700,
    categoryId: "travel",
    titleEn: "Setting out on a journey",
    titleFr: "Partir en voyage",
    textAr:
      "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ.",
    phonetic:
      "Subḥāna-lladhī sakhkhara lanā hādhā wa mā kunnā lahu muqrinīna wa innā ilā rabbinā la-munqalibūn.",
    textEn:
      "Glory be to Him who has subjected this to us, and we could never have it by our efforts. And to our Lord we shall surely return.",
    textFr:
      "Gloire à Celui qui nous a soumis tout cela, alors que nous n'étions pas capables de les dominer. Et c'est vers notre Seigneur que nous retournerons.",
    referenceEn: "Quran 43:13-14",
    referenceFr: "Coran 43:13-14",
  },
  {
    id: 701,
    categoryId: "travel",
    titleEn: "Travel prayer",
    titleFr: "Prière de voyage",
    textAr:
      "اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى وَمِنَ الْعَمَلِ مَا تَرْضَى.",
    phonetic:
      "Allāhumma innā nas'aluka fī safarinā hādhā-l-birra wa-t-taqwā wa mina-l-'amali mā tarḍā.",
    textEn:
      "O Allah, we ask You on this journey for righteousness, piety, and deeds that please You.",
    textFr:
      "Ô Allah, nous Te demandons en ce voyage la piété, la crainte révérencielle, et des actes qui Te satisfont.",
    referenceEn: "Muslim",
    referenceFr: "Mouslim",
  },
  {
    id: 702,
    categoryId: "travel",
    titleEn: "Returning from travel",
    titleFr: "Retour de voyage",
    textAr: "آيِبُونَ تَائِبُونَ عَابِدُونَ لِرَبِّنَا حَامِدُونَ.",
    phonetic: "Ā'ibūna tā'ibūna 'ābidūna li-rabbinā ḥāmidūn.",
    textEn: "We return, repentant, worshipping and praising our Lord.",
    textFr:
      "Nous revenons, repentants, adorateurs de notre Seigneur, et Lui rendant louange.",
    referenceEn: "Muslim",
    referenceFr: "Mouslim",
  },
];

// ─── Pluie ──────────────────────────────────────

const RAIN_DUAS: Dua[] = [
  {
    id: 800,
    categoryId: "rain",
    titleEn: "When it rains",
    titleFr: "Quand il pleut",
    textAr: "اللَّهُمَّ صَيِّبًا نَافِعًا.",
    phonetic: "Allāhumma ṣayyiban nāfi'an.",
    textEn: "O Allah, let it be a beneficial rain.",
    textFr: "Ô Allah, fais-en une pluie bénéfique.",
    referenceEn: "Bukhari",
    referenceFr: "Boukhari",
  },
  {
    id: 801,
    categoryId: "rain",
    titleEn: "After rain",
    titleFr: "Après la pluie",
    textAr: "مُطِرْنَا بِفَضْلِ اللَّهِ وَرَحْمَتِهِ.",
    phonetic: "Muṭirnā bi-faḍlillāhi wa raḥmatih.",
    textEn: "It has rained by the grace and mercy of Allah.",
    textFr: "Il a plu par la grâce et la miséricorde d'Allah.",
    referenceEn: "Bukhari & Muslim",
    referenceFr: "Boukhari & Mouslim",
  },
  {
    id: 802,
    categoryId: "rain",
    titleEn: "Seeking rain",
    titleFr: "Demander la pluie",
    textAr:
      "اللَّهُمَّ اسْقِنَا غَيْثًا مُغِيثًا مَرِيئًا مَرِيعًا نَافِعًا غَيْرَ ضَارٍّ عَاجِلًا غَيْرَ آجِلٍ.",
    phonetic:
      "Allāhumma-sqinā ghayṭhan mughīṭhan marī'an marī'an nāfi'an ghayra ḍārrin 'ājilan ghayra ājilin.",
    textEn:
      "O Allah, give us rain that is helpful, wholesome, productive, and beneficial, not harmful, soon and not delayed.",
    textFr:
      "Ô Allah, accorde-nous une pluie secourable, bienfaisante, salutaire, fructueuse, bénéfique et non nuisible, prompte et non tardive.",
    referenceEn: "Abu Dawud",
    referenceFr: "Abou Dawoud",
  },
  {
    id: 803,
    categoryId: "rain",
    titleEn: "During thunder",
    titleFr: "Pendant le tonnerre",
    textAr:
      "سُبْحَانَ الَّذِي يُسَبِّحُ الرَّعْدُ بِحَمْدِهِ وَالْمَلَائِكَةُ مِنْ خِيفَتِهِ.",
    phonetic:
      "Subḥāna-lladhī yusabbiḥu-r-ra'du bi-ḥamdihi wa-l-malā'ikatu min khīfatih.",
    textEn:
      "Glory be to Him whom the thunder glorifies with His praise, and the angels out of fear of Him.",
    textFr:
      "Gloire à Celui que le tonnerre glorifie par Sa louange, ainsi que les anges par crainte de Lui.",
    referenceEn: "Malik's Muwatta",
    referenceFr: "Mouwatta de Malik",
  },
];

// ─── Mariage & Famille ──────────────────────────

const MARRIAGE_DUAS: Dua[] = [
  {
    id: 900,
    categoryId: "marriage",
    titleEn: "For the newlyweds",
    titleFr: "Pour les mariés",
    textAr:
      "بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ.",
    phonetic:
      "Bāraka-llāhu laka wa bāraka 'alayka wa jama'a baynakumā fī khayr.",
    textEn:
      "May Allah bless you, shower His blessings upon you, and unite you both in goodness.",
    textFr:
      "Qu'Allah te bénisse, répande Ses bénédictions sur toi, et vous unisse tous deux dans le bien.",
    referenceEn: "Abu Dawud, Tirmidhi",
    referenceFr: "Abou Dawoud, Tirmidhi",
  },
  {
    id: 901,
    categoryId: "marriage",
    titleEn: "For righteous children",
    titleFr: "Pour des enfants pieux",
    textAr:
      "رَبِّ هَبْ لِي مِنْ لَدُنْكَ ذُرِّيَّةً طَيِّبَةً إِنَّكَ سَمِيعُ الدُّعَاءِ.",
    phonetic:
      "Rabbi hab lī min ladunka dhurriyyatan ṭayyibatan innaka samī'u-d-du'ā'.",
    textEn:
      "My Lord, grant me from Yourself a good offspring. Indeed, You are the Hearer of supplication.",
    textFr:
      "Seigneur, accorde-moi de Ta part une descendance vertueuse. Tu es Celui qui entend les invocations.",
    referenceEn: "Quran 3:38",
    referenceFr: "Coran 3:38",
  },
  {
    id: 902,
    categoryId: "marriage",
    titleEn: "For family harmony",
    titleFr: "Pour l'harmonie familiale",
    textAr:
      "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا.",
    phonetic:
      "Rabbanā hab lanā min azwājinā wa dhurriyyātinā qurrata a'yunin wa-j'alnā li-l-muttaqīna imāmā.",
    textEn:
      "Our Lord, grant us from our spouses and offspring comfort to our eyes and make us leaders of the righteous.",
    textFr:
      "Seigneur, fais que nos épouses et nos descendants soient le réconfort de nos yeux, et fais de nous des guides pour les pieux.",
    referenceEn: "Quran 25:74",
    referenceFr: "Coran 25:74",
  },
  {
    id: 903,
    categoryId: "marriage",
    titleEn: "Seeking a righteous spouse",
    titleFr: "Chercher un conjoint pieux",
    textAr: "رَبِّ إِنِّي لِمَا أَنْزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ.",
    phonetic: "Rabbi innī limā anzalta ilayya min khayrin faqīr.",
    textEn:
      "My Lord, indeed I am, for whatever good You would send down to me, in need.",
    textFr:
      "Seigneur, j'ai grand besoin de tout bien que Tu feras descendre vers moi.",
    referenceEn: "Quran 28:24",
    referenceFr: "Coran 28:24",
  },
];

// ─── Dhikr ──────────────────────────────────────

const DHIKR_DUAS: Dua[] = [
  {
    id: 1100,
    categoryId: "dhikr",
    titleEn: "SubhanAllah",
    titleFr: "SubhanAllah",
    textAr: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ.",
    phonetic: "Subḥāna-llāhi wa bi-ḥamdih, subḥāna-llāhi-l-'aẓīm.",
    textEn: "Glory be to Allah and praise Him, Glory be to Allah the Almighty.",
    textFr: "Gloire à Allah et louange à Lui, Gloire à Allah le Très Grand.",
    referenceEn: "Bukhari & Muslim",
    referenceFr: "Boukhari & Mouslim",
  },
  {
    id: 1101,
    categoryId: "dhikr",
    titleEn: "La ilaha illAllah",
    titleFr: "La ilaha illAllah",
    textAr:
      "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.",
    phonetic:
      "Lā ilāha illā-llāhu waḥdahu lā sharīka lah, lahu-l-mulku wa lahu-l-ḥamdu wa huwa 'alā kulli shay'in qadīr.",
    textEn:
      "None has the right to be worshipped except Allah alone, with no partner. To Him belongs the dominion and all praise, and He is able to do all things.",
    textFr:
      "Nul ne mérite d'être adoré sauf Allah, Seul sans associé. À Lui le royaume et la louange, et Il est capable de toute chose.",
    referenceEn: "Bukhari & Muslim",
    referenceFr: "Boukhari & Mouslim",
  },
  {
    id: 1102,
    categoryId: "dhikr",
    titleEn: "La hawla wa la quwwata",
    titleFr: "La hawla wa la qouwwata",
    textAr: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ.",
    phonetic: "Lā ḥawla wa lā quwwata illā billāh.",
    textEn: "There is no might and no power except with Allah.",
    textFr: "Il n'y a de puissance ni de force qu'en Allah.",
    referenceEn: "Bukhari & Muslim",
    referenceFr: "Boukhari & Mouslim",
  },
  {
    id: 1103,
    categoryId: "dhikr",
    titleEn: "HasbunAllahu wa ni'mal wakil",
    titleFr: "HasbounAllahou wa ni'mal wakil",
    textAr: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ.",
    phonetic: "Ḥasbuna-llāhu wa ni'ma-l-wakīl.",
    textEn:
      "Allah is sufficient for us, and He is the best Disposer of affairs.",
    textFr: "Allah nous suffit et Il est le meilleur Garant.",
    referenceEn: "Quran 3:173",
    referenceFr: "Coran 3:173",
  },
  {
    id: 1104,
    categoryId: "dhikr",
    titleEn: "Salawat on the Prophet ﷺ",
    titleFr: "Salat sur le Prophète ﷺ",
    textAr: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ.",
    phonetic: "Allāhumma ṣalli wa sallim 'alā nabiyyinā Muḥammad.",
    textEn: "O Allah, send prayers and peace upon our Prophet Muhammad.",
    textFr:
      "Ô Allah, envoie Tes prières et Ton salut sur notre Prophète Muhammad.",
    referenceEn: "Tirmidhi",
    referenceFr: "Tirmidhi",
  },
];

// ─── Duas du Ramadan ──────────────────────────────────

const RAMADAN_DUAS: Dua[] = [
  {
    id: 1100,
    categoryId: "ramadan",
    titleEn: "Beginning of Ramadan",
    titleFr: "Début du Ramadan",
    textAr:
      "اللَّهُمَّ سَلِّمْنِي لِرَمَضَانَ وَسَلِّمْ رَمَضَانَ لِي وَتَسَلَّمْهُ مِنِّي مُتَقَبَّلاً.",
    phonetic:
      "Allāhumma sallimnī li-Ramaḍān, wa sallim Ramaḍāna lī, wa tasallamhu minnī mutaqabbalan.",
    textEn:
      "O Allah, keep me safe for Ramadan, and keep Ramadan safe for me, and receive it from me as an accepted deed.",
    textFr:
      "Ô Allah, préserve-moi pour le Ramadan, et préserve le Ramadan pour moi, et reçois-le de moi comme une bonne œuvre acceptée.",
    referenceEn: "Al-Bayhaqi",
    referenceFr: "Al-Bayhaqi",
  },
  {
    id: 1101,
    categoryId: "ramadan",
    titleEn: "Seeing the new moon",
    titleFr: "En voyant le croissant",
    textAr:
      "اللَّهُ أَكْبَرُ، اللَّهُمَّ أَهِلَّهُ عَلَيْنَا بِالْأَمْنِ وَالْإِيمَانِ، وَالسَّلَامَةِ وَالْإِسْلَامِ، وَالتَّوْفِيقِ لِمَا تُحِبُّ وَتَرْضَى.",
    phonetic:
      "Allāhu akbar. Allāhumma ahillahu 'alaynā bil-amni wal-īmān, wa-s-salāmati wal-Islām, wa-t-tawfīqi limā tuḥibbu wa tarḍā.",
    textEn:
      "Allah is the Greatest. O Allah, let this moon appear over us with security, faith, safety, and Islam, and with the ability to do what You love and what pleases You.",
    textFr:
      "Allah est le plus Grand. Ô Allah, fais apparaître ce croissant sur nous avec sécurité, foi, saud et Islam, et avec la capacité de faire ce que Tu aimes et ce qui T'agrée.",
    referenceEn: "Tirmidhi",
    referenceFr: "Tirmidhi",
  },
  {
    id: 1102,
    categoryId: "ramadan",
    titleEn: "Laylat al-Qadr",
    titleFr: "Laylat al-Qadr",
    textAr: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي.",
    phonetic: "Allāhumma innaka 'afwón tuḥibbó l-'afwa fa-'fu 'annī.",
    textEn: "O Allah, You are Forgiving and love forgiveness, so forgive me.",
    textFr:
      "Ô Allah, Tu es le Tout-Pardonnant et Tu aimes pardonner, alors pardonne-moi.",
    referenceEn: "Ibn Majah – Tirmidhi",
    referenceFr: "Ibn Majah – Tirmidhi",
  },
];

// ─── Duas du Suhur ────────────────────────────────────

const SUHUR_DUAS: Dua[] = [
  {
    id: 1200,
    categoryId: "suhur",
    titleEn: "Intention to fast",
    titleFr: "Intention du jeûne",
    textAr:
      "نَوَيْتُ صَوْمَ غَدٍ مِنْ شَهْرِ رَمَضَانَ الْمُبَارَكِ فَرْضًا لِلَّهِ تَعَالَى.",
    phonetic:
      "Nawaytu ṣawma ghadin min shahri Ramaḍāna l-mubāraki farḍan lillāhi ta'ālā.",
    textEn:
      "I intend to fast tomorrow in the blessed month of Ramadan, as an obligatory act for Allah Most High.",
    textFr:
      "J'ai l'intention de jeûner demain dans le béni mois de Ramadan, par obligation pour Allah le Très-Haut.",
    referenceEn: "Traditional supplication",
    referenceFr: "Invoëcation traditionnelle",
  },
  {
    id: 1201,
    categoryId: "suhur",
    titleEn: "Blessing of Suhur",
    titleFr: "Bénédiction du Suhur",
    textAr:
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ. اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ.",
    phonetic:
      "Bismillāhir-raḥmānir-raḥīm. Allāhumma bārik lanā fīmā razaqtanā wa qinā 'adhāba-n-nār.",
    textEn:
      "In the name of Allah, the Most Gracious, the Most Merciful. O Allah, bless us in what You have provided us and protect us from the punishment of the Fire.",
    textFr:
      "Au nom d'Allah, le Très-Clément, le Très-Miséricordieux. Ô Allah, bénis-nous dans ce que Tu nous as accordé et préserve-nous du châtiment du Feu.",
    referenceEn: "Abu Dawud",
    referenceFr: "Abou Dawoud",
  },
  {
    id: 1202,
    categoryId: "suhur",
    titleEn: "Supplication at dawn",
    titleFr: "Invocation à l'aube",
    textAr:
      "اللَّهُمَّ إِنِّي أَسْأَلُكَ رِزْقًا طَيِّبًا وَعِلْمًا نَافِعًا وَعَمَلًا مُتَقَبَّلًا.",
    phonetic:
      "Allāhumma innī as'aluka rizqan ṭayyiban wa 'ilman nāfi'an wa 'amalan mutaqabbalan.",
    textEn:
      "O Allah, I ask You for good sustenance, beneficial knowledge, and accepted deeds.",
    textFr:
      "Ô Allah, je Te demande une bonne subsistance, un savoir profitable et des actes acceptés.",
    referenceEn: "Ibn Majah",
    referenceFr: "Ibn Majah",
  },
];

// ─── Duas de l'Iftar ──────────────────────────────────

const IFTAR_DUAS: Dua[] = [
  {
    id: 1300,
    categoryId: "iftar",
    titleEn: "Breaking the fast",
    titleFr: "Rompre le jeûne",
    textAr: "اللَّهُمَّ لَكَ صُمْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ.",
    phonetic: "Allāhumma laka ṣumtu wa 'alā rizqika afṭartu.",
    textEn:
      "O Allah, for You I fasted and with Your provision I break my fast.",
    textFr:
      "Ô Allah, pour Toi j'ai jeûné et c'est par Ton attribution que je romps mon jeûne.",
    referenceEn: "Abu Dawud",
    referenceFr: "Abou Dawoud",
  },
  {
    id: 1301,
    categoryId: "iftar",
    titleEn: "Thirst has gone",
    titleFr: "La soif s'en est allée",
    textAr:
      "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ.",
    phonetic:
      "Dhahaba-ẓẓama'u wa-btallati-l-'urūqu wa thabata-l-ajru in shā'a-llāh.",
    textEn:
      "The thirst has gone and the veins are moistened, and the reward is established, if Allah wills.",
    textFr:
      "La soif s'est dissipée, les veines sont humifiées et la récompense est acquise, si Allah le veut.",
    referenceEn: "Abu Dawud",
    referenceFr: "Abou Dawoud",
  },
  {
    id: 1302,
    categoryId: "iftar",
    titleEn: "Joy of the fasting person",
    titleFr: "Joie du jeûneur",
    textAr:
      "لِلصَّائِمِ فَرْحَتَانِ يَفْرَحُهُمَا: إِذَا أَفْطَرَ فَرِحَ بِفِطْرِهِ وَإِذَا لَقِيَ رَبَّهُ فَرِحَ بِصَوْمِهِ.",
    phonetic:
      "Lil-ṣā'imi faraḥatāni yafraḥuhumā: idhā afṭara fariḥa bifiṭrihi, wa idhā laqiya rabbahu fariḥa biṣawmihi.",
    textEn:
      "The fasting person has two moments of joy: when he breaks his fast, he rejoices at breaking it; and when he meets his Lord, he rejoices at his fasting.",
    textFr:
      "Le jeûneur aura deux moments de joie : quand il rompt son jeûne, il se réjouit de le rompre ; et quand il rencontre son Seigneur, il se réjouit de son jeûne.",
    referenceEn: "Bukhari – Muslim",
    referenceFr: "Boukhari – Mouslim",
  },
];

// ─── Combined exports ───────────────────────────────────

export const ALL_DUAS: Dua[] = [
  ...MORNING_DUAS,
  ...EVENING_DUAS,
  ...PRAYER_DUAS,
  ...PROTECTION_DUAS,
  ...FORGIVENESS_DUAS,
  ...RIZQ_DUAS,
  ...TRAVEL_DUAS,
  ...RAIN_DUAS,
  ...MARRIAGE_DUAS,
  ...DHIKR_DUAS,
  ...RAMADAN_DUAS,
  ...SUHUR_DUAS,
  ...IFTAR_DUAS,
];

export function getDuasByCategory(categoryId: string): Dua[] {
  return ALL_DUAS.filter((d) => d.categoryId === categoryId);
}

export function getCategory(categoryId: string): DuaCategory | undefined {
  return DUA_CATEGORIES.find((c) => c.id === categoryId);
}
