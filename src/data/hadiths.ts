import type { Hadith, HadithCollection } from "../types";

// ─── Collections ────────────────────────────────

export const HADITH_COLLECTIONS: HadithCollection[] = [
  {
    id: "nawawi",
    nameAr: "الأربعون النووية",
    nameEn: "40 Nawawi",
    nameFr: "40 Nawawi",
    author: "Imam An-Nawawi",
    authorAr: "الإمام النووي",
    totalHadiths: 42,
    descriptionEn:
      "A compilation of 42 hadiths covering the fundamentals of Islam, by Imam An-Nawawi.",
    descriptionFr:
      "Une compilation de 42 hadiths couvrant les fondements de l'Islam, par l'Imam An-Nawawi.",
    gradient: ["#672CBC", "#9879E9"] as const,
    icon: "star",
  },
  {
    id: "bukhari",
    nameAr: "صحيح البخاري",
    nameEn: "Sahih Al-Bukhari",
    nameFr: "Sahih Al-Bukhari",
    author: "Imam Al-Bukhari",
    authorAr: "الإمام البخاري",
    totalHadiths: 15,
    descriptionEn:
      "The most authentic collection of hadiths, compiled by Imam Al-Bukhari.",
    descriptionFr:
      "La collection de hadiths la plus authentique, compilée par l'Imam Al-Bukhari.",
    gradient: ["#1B7A4A", "#34D399"] as const,
    icon: "book",
  },
  {
    id: "muslim",
    nameAr: "صحيح مسلم",
    nameEn: "Sahih Muslim",
    nameFr: "Sahih Muslim",
    author: "Imam Muslim",
    authorAr: "الإمام مسلم",
    totalHadiths: 15,
    descriptionEn:
      "One of the most trusted collections of prophetic traditions, by Imam Muslim.",
    descriptionFr:
      "L'une des collections les plus fiables de traditions prophétiques, par l'Imam Muslim.",
    gradient: ["#C2410C", "#FB923C"] as const,
    icon: "library",
  },
];

// ─── 40 Nawawi ─────────────────────────────────

const NAWAWI_HADITHS: Hadith[] = [
  {
    id: 1001,
    collectionId: "nawawi",
    number: 1,
    chapterEn: "Intention",
    chapterFr: "L'intention",
    textAr:
      "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ فَهِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ، وَمَنْ كَانَتْ هِجْرَتُهُ لِدُنْيَا يُصِيبُهَا أَوْ امْرَأَةٍ يَنْكِحُهَا فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ.",
    phonetic:
      "Innamā-l-a'mālu bi-n-niyyāt, wa innamā li-kulli-mri'in mā nawā, fa-man kānat hijratuhu ilā-llāhi wa rasūlihi fa-hijratuhu ilā-llāhi wa rasūlih.",
    textEn:
      "Actions are judged by intentions, and every person will receive what they intended. Whoever migrates for the sake of Allah and His Messenger, then his migration is for Allah and His Messenger. And whoever migrates for worldly gain or to marry a woman, then his migration is for what he migrated for.",
    textFr:
      "Les actes ne valent que par les intentions, et chaque personne ne recevra que ce qu'elle a eu l'intention de faire. Celui dont l'émigration est pour Allah et Son Messager, son émigration est pour Allah et Son Messager. Et celui dont l'émigration est pour un bien mondain ou pour épouser une femme, son émigration est pour ce vers quoi il a émigré.",
    narratorEn: "Umar ibn Al-Khattab (may Allah be pleased with him)",
    narratorFr: "Omar ibn Al-Khattab (qu'Allah soit satisfait de lui)",
    reference: "Nawawi 1",
  },
  {
    id: 1002,
    collectionId: "nawawi",
    number: 2,
    chapterEn: "Islam, Iman, Ihsan",
    chapterFr: "Islam, Iman, Ihsan",
    textAr:
      "أَنْ تَعْبُدَ اللَّهَ كَأَنَّكَ تَرَاهُ، فَإِنْ لَمْ تَكُنْ تَرَاهُ فَإِنَّهُ يَرَاكَ.",
    phonetic:
      "An ta'buda-llāha ka'annaka tarāh, fa-in lam takun tarāhu fa-innahu yarāk.",
    textEn:
      "Worship Allah as though you see Him, and if you cannot see Him, then know that He sees you.",
    textFr:
      "Adore Allah comme si tu Le voyais, car si tu ne Le vois pas, Lui te voit.",
    narratorEn: "Umar ibn Al-Khattab (may Allah be pleased with him)",
    narratorFr: "Omar ibn Al-Khattab (qu'Allah soit satisfait de lui)",
    reference: "Nawawi 2",
  },
  {
    id: 1003,
    collectionId: "nawawi",
    number: 3,
    chapterEn: "Pillars of Islam",
    chapterFr: "Les piliers de l'Islam",
    textAr:
      "بُنِيَ الْإِسْلَامُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلَاةِ، وَإِيتَاءِ الزَّكَاةِ، وَحَجِّ الْبَيْتِ، وَصَوْمِ رَمَضَانَ.",
    phonetic:
      "Buniya-l-islāmu 'alā khams: shahādati an lā ilāha illā-llāhu wa anna Muḥammadan rasūlu-llāh, wa iqāmi-ṣ-ṣalāh, wa ītā'i-z-zakāh, wa ḥajji-l-bayt, wa ṣawmi Ramaḍān.",
    textEn:
      "Islam is built upon five pillars: testifying that there is no god but Allah and that Muhammad is the Messenger of Allah, establishing prayer, paying zakat, performing Hajj to the House, and fasting in Ramadan.",
    textFr:
      "L'Islam est bâti sur cinq piliers : l'attestation qu'il n'y a de divinité qu'Allah et que Muhammad est le Messager d'Allah, l'accomplissement de la prière, l'acquittement de la zakat, le pèlerinage à la Maison sacrée, et le jeûne du Ramadan.",
    narratorEn: "Abdullah ibn Umar (may Allah be pleased with them)",
    narratorFr: "Abdullah ibn Omar (qu'Allah soit satisfait d'eux)",
    reference: "Nawawi 3",
  },
  {
    id: 1004,
    collectionId: "nawawi",
    number: 4,
    chapterEn: "Stages of Creation",
    chapterFr: "Les étapes de la création",
    textAr:
      "إِنَّ أَحَدَكُمْ يُجْمَعُ خَلْقُهُ فِي بَطْنِ أُمِّهِ أَرْبَعِينَ يَوْمًا نُطْفَةً، ثُمَّ يَكُونُ عَلَقَةً مِثْلَ ذَلِكَ، ثُمَّ يَكُونُ مُضْغَةً مِثْلَ ذَلِكَ، ثُمَّ يُرْسَلُ إِلَيْهِ الْمَلَكُ فَيَنْفُخُ فِيهِ الرُّوحَ.",
    textEn:
      "Each of you is constituted in the womb of his mother for forty days as a drop, then it becomes a clot for a similar period, then a morsel of flesh for a similar period, then the angel is sent to breathe the soul into it.",
    textFr:
      "Chacun de vous voit sa création rassemblée dans le ventre de sa mère pendant quarante jours sous forme de goutte, puis devient un caillot de sang pendant une durée similaire, puis un morceau de chair pendant une durée similaire, puis l'ange est envoyé pour y insuffler l'âme.",
    narratorEn: "Abdullah ibn Mas'ud (may Allah be pleased with him)",
    narratorFr: "Abdullah ibn Mas'oud (qu'Allah soit satisfait de lui)",
    reference: "Nawawi 4",
  },
  {
    id: 1005,
    collectionId: "nawawi",
    number: 5,
    chapterEn: "Rejection of Innovation",
    chapterFr: "Le rejet de l'innovation",
    textAr: "مَنْ أَحْدَثَ فِي أَمْرِنَا هَذَا مَا لَيْسَ مِنْهُ فَهُوَ رَدٌّ.",
    textEn:
      "Whoever introduces into this matter of ours something that is not from it, it is rejected.",
    textFr:
      "Quiconque introduit dans notre affaire ce qui n'en fait pas partie, cela est rejeté.",
    narratorEn: "Aisha (may Allah be pleased with her)",
    narratorFr: "Aïcha (qu'Allah soit satisfait d'elle)",
    reference: "Nawawi 5",
  },
  {
    id: 1006,
    collectionId: "nawawi",
    number: 6,
    chapterEn: "The Lawful and the Unlawful",
    chapterFr: "Le licite et l'illicite",
    textAr:
      "إِنَّ الْحَلَالَ بَيِّنٌ وَإِنَّ الْحَرَامَ بَيِّنٌ وَبَيْنَهُمَا أُمُورٌ مُشْتَبِهَاتٌ لَا يَعْلَمُهُنَّ كَثِيرٌ مِنَ النَّاسِ، فَمَنِ اتَّقَى الشُّبُهَاتِ فَقَدِ اسْتَبْرَأَ لِدِينِهِ وَعِرْضِهِ.",
    phonetic:
      "Inna-l-ḥalāla bayyinun wa inna-l-ḥarāma bayyinun wa baynahumā umūrun mushtabihāt, fa-man-ttaqā-sh-shubuhāti fa-qad-i-stābra'a li-dīnihi wa 'irḍih.",
    textEn:
      "The lawful is clear and the unlawful is clear, and between them are doubtful matters which many people do not know. Whoever avoids the doubtful matters has safeguarded his religion and his honor.",
    textFr:
      "Le licite est clair et l'illicite est clair, et entre les deux il y a des choses ambiguës que beaucoup de gens ne connaissent pas. Celui qui évite les ambiguïtés a préservé sa religion et son honneur.",
    narratorEn: "An-Nu'man ibn Bashir (may Allah be pleased with him)",
    narratorFr: "An-Nu'man ibn Bachir (qu'Allah soit satisfait de lui)",
    reference: "Nawawi 6",
  },
  {
    id: 1007,
    collectionId: "nawawi",
    number: 7,
    chapterEn: "Sincerity in Religion",
    chapterFr: "La sincérité dans la religion",
    textAr:
      "الدِّينُ النَّصِيحَةُ. قُلْنَا: لِمَنْ؟ قَالَ: لِلَّهِ وَلِكِتَابِهِ وَلِرَسُولِهِ وَلِأَئِمَّةِ الْمُسْلِمِينَ وَعَامَّتِهِمْ.",
    textEn:
      "Religion is sincerity. We said: To whom? He said: To Allah, His Book, His Messenger, the leaders of the Muslims, and their common people.",
    textFr:
      "La religion, c'est le bon conseil. Nous avons dit : Envers qui ? Il a dit : Envers Allah, Son Livre, Son Messager, les dirigeants des musulmans et l'ensemble des musulmans.",
    narratorEn: "Tamim Ad-Dari (may Allah be pleased with him)",
    narratorFr: "Tamim Ad-Dari (qu'Allah soit satisfait de lui)",
    reference: "Nawawi 7",
  },
  {
    id: 1008,
    collectionId: "nawawi",
    number: 9,
    chapterEn: "Ease in Obligations",
    chapterFr: "La facilité dans les obligations",
    textAr:
      "مَا نَهَيْتُكُمْ عَنْهُ فَاجْتَنِبُوهُ، وَمَا أَمَرْتُكُمْ بِهِ فَأْتُوا مِنْهُ مَا اسْتَطَعْتُمْ.",
    textEn:
      "What I have prohibited for you, avoid it. And what I have commanded you, do as much of it as you are able.",
    textFr:
      "Ce que je vous ai interdit, évitez-le. Et ce que je vous ai ordonné, faites-en ce que vous pouvez.",
    narratorEn: "Abu Hurayra (may Allah be pleased with him)",
    narratorFr: "Abou Hourayra (qu'Allah soit satisfait de lui)",
    reference: "Nawawi 9",
  },
  {
    id: 1009,
    collectionId: "nawawi",
    number: 10,
    chapterEn: "Pure Sustenance",
    chapterFr: "La nourriture pure",
    textAr: "إِنَّ اللَّهَ طَيِّبٌ لَا يَقْبَلُ إِلَّا طَيِّبًا.",
    textEn: "Indeed, Allah is pure and He only accepts that which is pure.",
    textFr: "Certes, Allah est pur et Il n'accepte que ce qui est pur.",
    narratorEn: "Abu Hurayra (may Allah be pleased with him)",
    narratorFr: "Abou Hourayra (qu'Allah soit satisfait de lui)",
    reference: "Nawawi 10",
  },
  {
    id: 1010,
    collectionId: "nawawi",
    number: 11,
    chapterEn: "Leaving Doubt",
    chapterFr: "Délaisser le doute",
    textAr: "دَعْ مَا يَرِيبُكَ إِلَى مَا لَا يَرِيبُكَ.",
    textEn:
      "Leave that which makes you doubt for that which does not make you doubt.",
    textFr: "Laisse ce qui te fait douter pour ce qui ne te fait pas douter.",
    narratorEn: "Al-Hasan ibn Ali (may Allah be pleased with them)",
    narratorFr: "Al-Hassan ibn Ali (qu'Allah soit satisfait d'eux)",
    reference: "Nawawi 11",
  },
  {
    id: 1011,
    collectionId: "nawawi",
    number: 12,
    chapterEn: "Leaving What Does Not Concern",
    chapterFr: "Délaisser ce qui ne concerne pas",
    textAr: "مِنْ حُسْنِ إِسْلَامِ الْمَرْءِ تَرْكُهُ مَا لَا يَعْنِيهِ.",
    textEn:
      "Part of the perfection of a person's Islam is leaving that which does not concern him.",
    textFr:
      "Fait partie de l'excellence de l'Islam d'une personne le fait de délaisser ce qui ne la concerne pas.",
    narratorEn: "Abu Hurayra (may Allah be pleased with him)",
    narratorFr: "Abou Hourayra (qu'Allah soit satisfait de lui)",
    reference: "Nawawi 12",
  },
  {
    id: 1012,
    collectionId: "nawawi",
    number: 13,
    chapterEn: "Loving for Others",
    chapterFr: "Aimer pour les autres",
    textAr:
      "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ.",
    phonetic:
      "Lā yu'minu aḥadukum ḥattā yuḥibba li-akhīhi mā yuḥibbu li-nafsih.",
    textEn:
      "None of you truly believes until he loves for his brother what he loves for himself.",
    textFr:
      "Aucun de vous ne croit véritablement tant qu'il n'aime pas pour son frère ce qu'il aime pour lui-même.",
    narratorEn: "Anas ibn Malik (may Allah be pleased with him)",
    narratorFr: "Anas ibn Malik (qu'Allah soit satisfait de lui)",
    reference: "Nawawi 13",
  },
  {
    id: 1013,
    collectionId: "nawawi",
    number: 15,
    chapterEn: "Generosity and Good Words",
    chapterFr: "La générosité et les bonnes paroles",
    textAr:
      "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ، وَمَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيُكْرِمْ جَارَهُ، وَمَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيُكْرِمْ ضَيْفَهُ.",
    textEn:
      "Whoever believes in Allah and the Last Day, let him speak good or remain silent. Whoever believes in Allah and the Last Day, let him honor his neighbor. Whoever believes in Allah and the Last Day, let him honor his guest.",
    textFr:
      "Celui qui croit en Allah et au Jour dernier, qu'il dise du bien ou qu'il se taise. Celui qui croit en Allah et au Jour dernier, qu'il honore son voisin. Celui qui croit en Allah et au Jour dernier, qu'il honore son hôte.",
    narratorEn: "Abu Hurayra (may Allah be pleased with him)",
    narratorFr: "Abou Hourayra (qu'Allah soit satisfait de lui)",
    reference: "Nawawi 15",
  },
  {
    id: 1014,
    collectionId: "nawawi",
    number: 16,
    chapterEn: "Do Not Be Angry",
    chapterFr: "Ne te mets pas en colère",
    textAr: "لَا تَغْضَبْ. فَرَدَّدَ مِرَارًا، قَالَ: لَا تَغْضَبْ.",
    phonetic: "Lā taghḍab.",
    textEn:
      "Do not become angry. The man repeated his request several times, and he said: Do not become angry.",
    textFr:
      "Ne te mets pas en colère. L'homme a répété sa demande plusieurs fois, et il a dit : Ne te mets pas en colère.",
    narratorEn: "Abu Hurayra (may Allah be pleased with him)",
    narratorFr: "Abou Hourayra (qu'Allah soit satisfait de lui)",
    reference: "Nawawi 16",
  },
  {
    id: 1015,
    collectionId: "nawawi",
    number: 17,
    chapterEn: "Excellence in All Things",
    chapterFr: "L'excellence en toute chose",
    textAr: "إِنَّ اللَّهَ كَتَبَ الْإِحْسَانَ عَلَى كُلِّ شَيْءٍ.",
    textEn: "Indeed, Allah has prescribed excellence (ihsan) in everything.",
    textFr: "Certes, Allah a prescrit l'excellence (ihsan) en toute chose.",
    narratorEn: "Shaddad ibn Aws (may Allah be pleased with him)",
    narratorFr: "Shaddad ibn Aws (qu'Allah soit satisfait de lui)",
    reference: "Nawawi 17",
  },
  {
    id: 1016,
    collectionId: "nawawi",
    number: 18,
    chapterEn: "Piety and Good Character",
    chapterFr: "La piété et le bon caractère",
    textAr:
      "اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ، وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا، وَخَالِقِ النَّاسَ بِخُلُقٍ حَسَنٍ.",
    phonetic:
      "Ittaqi-llāha ḥaythumā kunta, wa atbi'i-s-sayyi'ata-l-ḥasanata tamḥuhā, wa khāliqi-n-nāsa bi-khuluqin ḥasan.",
    textEn:
      "Fear Allah wherever you are, follow a bad deed with a good one and it will erase it, and treat people with good character.",
    textFr:
      "Crains Allah où que tu sois, fais suivre la mauvaise action d'une bonne action et elle l'effacera, et comporte-toi avec les gens avec un bon caractère.",
    narratorEn:
      "Abu Dharr and Mu'adh ibn Jabal (may Allah be pleased with them)",
    narratorFr:
      "Abou Dharr et Mou'adh ibn Jabal (qu'Allah soit satisfait d'eux)",
    reference: "Nawawi 18",
  },
  {
    id: 1017,
    collectionId: "nawawi",
    number: 19,
    chapterEn: "Mindfulness of Allah",
    chapterFr: "La conscience d'Allah",
    textAr: "احْفَظِ اللَّهَ يَحْفَظْكَ، احْفَظِ اللَّهَ تَجِدْهُ تُجَاهَكَ.",
    textEn:
      "Be mindful of Allah and He will protect you. Be mindful of Allah and you will find Him before you.",
    textFr:
      "Préserve Allah et Il te préservera. Préserve Allah et tu Le trouveras devant toi.",
    narratorEn: "Abdullah ibn Abbas (may Allah be pleased with them)",
    narratorFr: "Abdullah ibn Abbas (qu'Allah soit satisfait d'eux)",
    reference: "Nawawi 19",
  },
  {
    id: 1018,
    collectionId: "nawawi",
    number: 20,
    chapterEn: "Modesty",
    chapterFr: "La pudeur",
    textAr:
      "إِنَّ مِمَّا أَدْرَكَ النَّاسُ مِنْ كَلَامِ النُّبُوَّةِ الْأُولَى: إِذَا لَمْ تَسْتَحِ فَاصْنَعْ مَا شِئْتَ.",
    textEn:
      "Among the words people have received from earlier prophecy: If you feel no shame, then do as you wish.",
    textFr:
      "Parmi les paroles que les gens ont retenues de la prophétie ancienne : Si tu n'as pas de pudeur, fais ce que tu veux.",
    narratorEn: "Abu Mas'ud (may Allah be pleased with him)",
    narratorFr: "Abou Mas'oud (qu'Allah soit satisfait de lui)",
    reference: "Nawawi 20",
  },
  {
    id: 1019,
    collectionId: "nawawi",
    number: 22,
    chapterEn: "Path to Paradise",
    chapterFr: "Le chemin vers le Paradis",
    textAr:
      "أَرَأَيْتَ إِذَا صَلَّيْتُ الْمَكْتُوبَاتِ، وَصُمْتُ رَمَضَانَ، وَأَحْلَلْتُ الْحَلَالَ، وَحَرَّمْتُ الْحَرَامَ، وَلَمْ أَزِدْ عَلَى ذَلِكَ شَيْئًا، أَأَدْخُلُ الْجَنَّةَ؟ قَالَ: نَعَمْ.",
    textEn:
      '"Tell me, if I perform the obligatory prayers, fast Ramadan, make lawful what is lawful, and make unlawful what is unlawful, and do nothing more, will I enter Paradise?" He said: "Yes."',
    textFr:
      '"Dis-moi, si j\'accomplis les prières obligatoires, que je jeûne le Ramadan, que je rends licite le licite et illicite l\'illicite, et que je n\'ajoute rien à cela, entrerai-je au Paradis ?" Il a dit : "Oui."',
    narratorEn:
      "Abu Abdullah Jabir ibn Abdullah (may Allah be pleased with him)",
    narratorFr:
      "Abou Abdullah Jabir ibn Abdullah (qu'Allah soit satisfait de lui)",
    reference: "Nawawi 22",
  },
  {
    id: 1020,
    collectionId: "nawawi",
    number: 24,
    chapterEn: "Prohibition of Injustice",
    chapterFr: "L'interdiction de l'injustice",
    textAr:
      "يَا عِبَادِي إِنِّي حَرَّمْتُ الظُّلْمَ عَلَى نَفْسِي وَجَعَلْتُهُ بَيْنَكُمْ مُحَرَّمًا فَلَا تَظَالَمُوا.",
    textEn:
      "O My servants, I have forbidden injustice for Myself and I have made it forbidden among you, so do not wrong one another.",
    textFr:
      "Ô Mes serviteurs, Je Me suis interdit l'injustice et Je l'ai rendue interdite entre vous, alors ne vous faites pas d'injustice les uns aux autres.",
    narratorEn: "Abu Dharr Al-Ghifari (may Allah be pleased with him)",
    narratorFr: "Abou Dharr Al-Ghifari (qu'Allah soit satisfait de lui)",
    reference: "Nawawi 24",
  },
  {
    id: 1021,
    collectionId: "nawawi",
    number: 25,
    chapterEn: "Charity",
    chapterFr: "L'aumône",
    textAr:
      "كُلُّ سُلَامَى مِنَ النَّاسِ عَلَيْهِ صَدَقَةٌ، كُلَّ يَوْمٍ تَطْلُعُ فِيهِ الشَّمْسُ: تَعْدِلُ بَيْنَ اثْنَيْنِ صَدَقَةٌ.",
    textEn:
      "Every joint of a person must perform a charity every day the sun rises: acting justly between two people is a charity.",
    textFr:
      "Chaque articulation des gens a une aumône due chaque jour où le soleil se lève : être juste entre deux personnes est une aumône.",
    narratorEn: "Abu Hurayra (may Allah be pleased with him)",
    narratorFr: "Abou Hourayra (qu'Allah soit satisfait de lui)",
    reference: "Nawawi 25",
  },
  {
    id: 1022,
    collectionId: "nawawi",
    number: 27,
    chapterEn: "Righteousness and Sin",
    chapterFr: "La vertu et le péché",
    textAr:
      "الْبِرُّ حُسْنُ الْخُلُقِ، وَالْإِثْمُ مَا حَاكَ فِي نَفْسِكَ وَكَرِهْتَ أَنْ يَطَّلِعَ عَلَيْهِ النَّاسُ.",
    textEn:
      "Righteousness is good character, and sin is what disturbs your soul and you would not like people to find out about.",
    textFr:
      "La vertu, c'est le bon caractère, et le péché, c'est ce qui te trouble intérieurement et que tu n'aimerais pas que les gens découvrent.",
    narratorEn: "An-Nawwas ibn Sam'an (may Allah be pleased with him)",
    narratorFr: "An-Nawwas ibn Sam'an (qu'Allah soit satisfait de lui)",
    reference: "Nawawi 27",
  },
  {
    id: 1023,
    collectionId: "nawawi",
    number: 32,
    chapterEn: "No Harm",
    chapterFr: "Pas de préjudice",
    textAr: "لَا ضَرَرَ وَلَا ضِرَارَ.",
    phonetic: "Lā ḍarara wa lā ḍirār.",
    textEn: "There should be neither harm nor reciprocal harm.",
    textFr: "Pas de préjudice ni de tort réciproque.",
    narratorEn: "Abu Sa'id Al-Khudri (may Allah be pleased with him)",
    narratorFr: "Abou Sa'id Al-Khoudri (qu'Allah soit satisfait de lui)",
    reference: "Nawawi 32",
  },
  {
    id: 1024,
    collectionId: "nawawi",
    number: 34,
    chapterEn: "Forbidding Evil",
    chapterFr: "Interdire le mal",
    textAr:
      "مَنْ رَأَى مِنْكُمْ مُنْكَرًا فَلْيُغَيِّرْهُ بِيَدِهِ، فَإِنْ لَمْ يَسْتَطِعْ فَبِلِسَانِهِ، فَإِنْ لَمْ يَسْتَطِعْ فَبِقَلْبِهِ، وَذَلِكَ أَضْعَفُ الْإِيمَانِ.",
    textEn:
      "Whoever among you sees an evil, let him change it with his hand; if he cannot, then with his tongue; if he cannot, then with his heart — and that is the weakest of faith.",
    textFr:
      "Celui d'entre vous qui voit un mal, qu'il le change avec sa main; s'il ne peut pas, alors avec sa langue; s'il ne peut pas, alors avec son cœur — et c'est le degré le plus faible de la foi.",
    narratorEn: "Abu Sa'id Al-Khudri (may Allah be pleased with him)",
    narratorFr: "Abou Sa'id Al-Khoudri (qu'Allah soit satisfait de lui)",
    reference: "Nawawi 34",
  },
  {
    id: 1025,
    collectionId: "nawawi",
    number: 36,
    chapterEn: "Helping Others",
    chapterFr: "Aider les autres",
    textAr:
      "مَنْ نَفَّسَ عَنْ مُؤْمِنٍ كُرْبَةً مِنْ كُرَبِ الدُّنْيَا نَفَّسَ اللَّهُ عَنْهُ كُرْبَةً مِنْ كُرَبِ يَوْمِ الْقِيَامَةِ.",
    textEn:
      "Whoever relieves a believer of a hardship of this world, Allah will relieve him of a hardship of the Day of Resurrection.",
    textFr:
      "Celui qui soulage un croyant d'une difficulté de ce monde, Allah le soulagera d'une difficulté du Jour de la Résurrection.",
    narratorEn: "Abu Hurayra (may Allah be pleased with him)",
    narratorFr: "Abou Hourayra (qu'Allah soit satisfait de lui)",
    reference: "Nawawi 36",
  },
  {
    id: 1026,
    collectionId: "nawawi",
    number: 40,
    chapterEn: "Be in This World as a Stranger",
    chapterFr: "Sois dans ce monde comme un étranger",
    textAr: "كُنْ فِي الدُّنْيَا كَأَنَّكَ غَرِيبٌ أَوْ عَابِرُ سَبِيلٍ.",
    phonetic: "Kun fi-d-dunyā ka'annaka gharībun aw 'ābiru sabīl.",
    textEn: "Be in this world as though you were a stranger or a traveler.",
    textFr:
      "Sois dans ce monde comme si tu étais un étranger ou un voyageur de passage.",
    narratorEn: "Abdullah ibn Umar (may Allah be pleased with them)",
    narratorFr: "Abdullah ibn Omar (qu'Allah soit satisfait d'eux)",
    reference: "Nawawi 40",
  },
  {
    id: 1027,
    collectionId: "nawawi",
    number: 42,
    chapterEn: "Vastness of Allah's Mercy",
    chapterFr: "L'immensité de la miséricorde d'Allah",
    textAr:
      "يَا ابْنَ آدَمَ، إِنَّكَ مَا دَعَوْتَنِي وَرَجَوْتَنِي غَفَرْتُ لَكَ عَلَى مَا كَانَ مِنْكَ وَلَا أُبَالِي.",
    textEn:
      "O son of Adam, as long as you call upon Me and put your hope in Me, I will forgive you for what you have done and I do not mind.",
    textFr:
      "Ô fils d'Adam, tant que tu M'invoques et que tu places ton espoir en Moi, Je te pardonne ce que tu as fait et Je ne M'en soucie pas.",
    narratorEn: "Anas ibn Malik (may Allah be pleased with him)",
    narratorFr: "Anas ibn Malik (qu'Allah soit satisfait de lui)",
    reference: "Nawawi 42",
  },
];

// ─── Sahih Bukhari ─────────────────────────────

const BUKHARI_HADITHS: Hadith[] = [
  {
    id: 2001,
    collectionId: "bukhari",
    number: 1,
    chapterEn: "Revelation",
    chapterFr: "La Révélation",
    textAr:
      "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى.",
    textEn:
      "Actions are judged by intentions, and every person will receive what they intended.",
    textFr:
      "Les actes ne valent que par les intentions, et chaque personne ne recevra que ce qu'elle a eu l'intention de faire.",
    narratorEn: "Umar ibn Al-Khattab (may Allah be pleased with him)",
    narratorFr: "Omar ibn Al-Khattab (qu'Allah soit satisfait de lui)",
    reference: "Bukhari 1",
  },
  {
    id: 2002,
    collectionId: "bukhari",
    number: 6,
    chapterEn: "Faith",
    chapterFr: "La foi",
    textAr:
      "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ، وَالْمُهَاجِرُ مَنْ هَجَرَ مَا نَهَى اللَّهُ عَنْهُ.",
    textEn:
      "A Muslim is the one from whose tongue and hands the Muslims are safe, and an emigrant (muhajir) is the one who abandons what Allah has prohibited.",
    textFr:
      "Le musulman est celui dont les musulmans sont à l'abri de sa langue et de sa main, et l'émigré (muhajir) est celui qui a abandonné ce qu'Allah a interdit.",
    narratorEn: "Abdullah ibn Amr (may Allah be pleased with them)",
    narratorFr: "Abdullah ibn Amr (qu'Allah soit satisfait d'eux)",
    reference: "Bukhari 10",
  },
  {
    id: 2003,
    collectionId: "bukhari",
    number: 3,
    chapterEn: "Faith",
    chapterFr: "La foi",
    textAr:
      "ثَلَاثٌ مَنْ كُنَّ فِيهِ وَجَدَ حَلَاوَةَ الْإِيمَانِ: أَنْ يَكُونَ اللَّهُ وَرَسُولُهُ أَحَبَّ إِلَيْهِ مِمَّا سِوَاهُمَا.",
    textEn:
      "There are three qualities whoever has them will taste the sweetness of faith: that Allah and His Messenger are more beloved to him than anything else.",
    textFr:
      "Trois qualités, celui qui les possède goûtera à la douceur de la foi : qu'Allah et Son Messager lui soient plus chers que tout autre chose.",
    narratorEn: "Anas ibn Malik (may Allah be pleased with him)",
    narratorFr: "Anas ibn Malik (qu'Allah soit satisfait de lui)",
    reference: "Bukhari 16",
  },
  {
    id: 2004,
    collectionId: "bukhari",
    number: 4,
    chapterEn: "Knowledge",
    chapterFr: "La science",
    textAr: "مَنْ يُرِدِ اللَّهُ بِهِ خَيْرًا يُفَقِّهْهُ فِي الدِّينِ.",
    textEn:
      "Whoever Allah wants good for, He gives him understanding of the religion.",
    textFr:
      "Celui à qui Allah veut du bien, Il lui accorde la compréhension de la religion.",
    narratorEn: "Mu'awiya (may Allah be pleased with him)",
    narratorFr: "Mou'awiya (qu'Allah soit satisfait de lui)",
    reference: "Bukhari 71",
  },
  {
    id: 2005,
    collectionId: "bukhari",
    number: 5,
    chapterEn: "Knowledge",
    chapterFr: "La science",
    textAr: "بَلِّغُوا عَنِّي وَلَوْ آيَةً.",
    textEn: "Convey from me, even if it is a single verse.",
    textFr: "Transmettez de moi, ne serait-ce qu'un seul verset.",
    narratorEn: "Abdullah ibn Amr (may Allah be pleased with them)",
    narratorFr: "Abdullah ibn Amr (qu'Allah soit satisfait d'eux)",
    reference: "Bukhari 3461",
  },
  {
    id: 2006,
    collectionId: "bukhari",
    number: 6,
    chapterEn: "Prayer",
    chapterFr: "La prière",
    textAr: "صَلُّوا كَمَا رَأَيْتُمُونِي أُصَلِّي.",
    textEn: "Pray as you have seen me praying.",
    textFr: "Priez comme vous m'avez vu prier.",
    narratorEn: "Malik ibn Al-Huwayrith (may Allah be pleased with him)",
    narratorFr: "Malik ibn Al-Houwayrith (qu'Allah soit satisfait de lui)",
    reference: "Bukhari 631",
  },
  {
    id: 2007,
    collectionId: "bukhari",
    number: 7,
    chapterEn: "Good Manners",
    chapterFr: "Les bonnes manières",
    textAr: "خَيْرُكُمْ خَيْرُكُمْ لِأَهْلِهِ، وَأَنَا خَيْرُكُمْ لِأَهْلِي.",
    textEn:
      "The best of you is the one who is best to his family, and I am the best of you to my family.",
    textFr:
      "Le meilleur d'entre vous est celui qui est le meilleur envers sa famille, et je suis le meilleur d'entre vous envers ma famille.",
    narratorEn: "Aisha (may Allah be pleased with her)",
    narratorFr: "Aïcha (qu'Allah soit satisfait d'elle)",
    reference: "Bukhari 6029",
  },
  {
    id: 2008,
    collectionId: "bukhari",
    number: 8,
    chapterEn: "Kindness",
    chapterFr: "La bonté",
    textAr:
      "الرَّاحِمُونَ يَرْحَمُهُمُ الرَّحْمَنُ، ارْحَمُوا مَنْ فِي الْأَرْضِ يَرْحَمْكُمْ مَنْ فِي السَّمَاءِ.",
    textEn:
      "The merciful are shown mercy by the Most Merciful. Show mercy to those on earth and the One above the heavens will show you mercy.",
    textFr:
      "Les miséricordieux, le Tout Miséricordieux leur fait miséricorde. Soyez miséricordieux envers ceux qui sont sur terre, et Celui qui est au ciel vous fera miséricorde.",
    narratorEn: "Abdullah ibn Amr (may Allah be pleased with them)",
    narratorFr: "Abdullah ibn Amr (qu'Allah soit satisfait d'eux)",
    reference: "Bukhari 6941",
  },
  {
    id: 2009,
    collectionId: "bukhari",
    number: 9,
    chapterEn: "Supplication",
    chapterFr: "L'invocation",
    textAr: "الدُّعَاءُ هُوَ الْعِبَادَةُ.",
    textEn: "Supplication (dua) is worship.",
    textFr: "L'invocation (dua) est l'adoration.",
    narratorEn: "An-Nu'man ibn Bashir (may Allah be pleased with him)",
    narratorFr: "An-Nu'man ibn Bachir (qu'Allah soit satisfait de lui)",
    reference: "Bukhari / Tirmidhi 3372",
  },
  {
    id: 2010,
    collectionId: "bukhari",
    number: 10,
    chapterEn: "Patience",
    chapterFr: "La patience",
    textAr:
      "عَجَبًا لِأَمْرِ الْمُؤْمِنِ، إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ، وَلَيْسَ ذَلِكَ لِأَحَدٍ إِلَّا لِلْمُؤْمِنِ: إِنْ أَصَابَتْهُ سَرَّاءُ شَكَرَ فَكَانَ خَيْرًا لَهُ، وَإِنْ أَصَابَتْهُ ضَرَّاءُ صَبَرَ فَكَانَ خَيْرًا لَهُ.",
    textEn:
      "How wonderful is the affair of the believer! Everything is good for him, and this is only for the believer: if something good happens to him, he is grateful and that is good for him; if something bad happens to him, he is patient and that is good for him.",
    textFr:
      "Comme l'affaire du croyant est étonnante ! Tout est un bien pour lui, et cela n'est réservé qu'au croyant : s'il lui arrive un bonheur, il est reconnaissant et c'est un bien pour lui ; s'il lui arrive un malheur, il patiente et c'est un bien pour lui.",
    narratorEn: "Suhayb (may Allah be pleased with him)",
    narratorFr: "Souhayb (qu'Allah soit satisfait de lui)",
    reference: "Muslim 2999",
  },
  {
    id: 2011,
    collectionId: "bukhari",
    number: 11,
    chapterEn: "Brotherhood",
    chapterFr: "La fraternité",
    textAr:
      "لَا تَحَاسَدُوا وَلَا تَنَاجَشُوا وَلَا تَبَاغَضُوا وَلَا تَدَابَرُوا، وَكُونُوا عِبَادَ اللَّهِ إِخْوَانًا.",
    textEn:
      "Do not envy one another, do not inflate prices against each other, do not hate one another, do not turn away from each other, and be servants of Allah as brothers.",
    textFr:
      "Ne vous enviez pas les uns les autres, ne surenchérissez pas les uns contre les autres, ne vous haïssez pas, ne vous tournez pas le dos, et soyez des serviteurs d'Allah, des frères.",
    narratorEn: "Abu Hurayra (may Allah be pleased with him)",
    narratorFr: "Abou Hourayra (qu'Allah soit satisfait de lui)",
    reference: "Bukhari 6065",
  },
  {
    id: 2012,
    collectionId: "bukhari",
    number: 12,
    chapterEn: "The Smile",
    chapterFr: "Le sourire",
    textAr: "تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ صَدَقَةٌ.",
    textEn: "Your smile to your brother is a charity.",
    textFr: "Ton sourire à ton frère est une aumône.",
    narratorEn: "Abu Dharr (may Allah be pleased with him)",
    narratorFr: "Abou Dharr (qu'Allah soit satisfait de lui)",
    reference: "Tirmidhi 1956",
  },
  {
    id: 2013,
    collectionId: "bukhari",
    number: 13,
    chapterEn: "Seeking Knowledge",
    chapterFr: "La recherche du savoir",
    textAr:
      "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ.",
    textEn:
      "Whoever takes a path seeking knowledge therein, Allah will make easy for him a path to Paradise.",
    textFr:
      "Celui qui emprunte un chemin à la recherche du savoir, Allah lui facilitera un chemin vers le Paradis.",
    narratorEn: "Abu Hurayra (may Allah be pleased with him)",
    narratorFr: "Abou Hourayra (qu'Allah soit satisfait de lui)",
    reference: "Muslim 2699",
  },
  {
    id: 2014,
    collectionId: "bukhari",
    number: 14,
    chapterEn: "Remembrance of Allah",
    chapterFr: "Le rappel d'Allah",
    textAr:
      "كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ، ثَقِيلَتَانِ فِي الْمِيزَانِ، حَبِيبَتَانِ إِلَى الرَّحْمَنِ: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ.",
    textEn:
      "Two words that are light on the tongue, heavy on the Scale, and beloved to the Most Merciful: SubhanAllahi wa bihamdihi, SubhanAllahil-Azim (Glory be to Allah and His praise, Glory be to Allah the Almighty).",
    textFr:
      "Deux paroles légères sur la langue, lourdes dans la balance, et aimées du Tout Miséricordieux : SubhanAllahi wa bihamdihi, SubhanAllahil-Azim (Gloire à Allah et louange à Lui, Gloire à Allah le Très Grand).",
    narratorEn: "Abu Hurayra (may Allah be pleased with him)",
    narratorFr: "Abou Hourayra (qu'Allah soit satisfait de lui)",
    reference: "Bukhari 6406",
  },
  {
    id: 2015,
    collectionId: "bukhari",
    number: 15,
    chapterEn: "Good Deeds",
    chapterFr: "Les bonnes actions",
    textAr: "أَحَبُّ الْأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ.",
    textEn:
      "The most beloved deeds to Allah are the most consistent ones, even if they are small.",
    textFr:
      "Les actes les plus aimés d'Allah sont les plus réguliers, même s'ils sont peu nombreux.",
    narratorEn: "Aisha (may Allah be pleased with her)",
    narratorFr: "Aïcha (qu'Allah soit satisfait d'elle)",
    reference: "Bukhari 6464",
  },
];

// ─── Sahih Muslim ──────────────────────────────

const MUSLIM_HADITHS: Hadith[] = [
  {
    id: 3001,
    collectionId: "muslim",
    number: 1,
    chapterEn: "Faith",
    chapterFr: "La foi",
    textAr:
      "الْإِيمَانُ بِضْعٌ وَسَبْعُونَ أَوْ بِضْعٌ وَسِتُّونَ شُعْبَةً، فَأَفْضَلُهَا قَوْلُ لَا إِلَهَ إِلَّا اللَّهُ، وَأَدْنَاهَا إِمَاطَةُ الْأَذَى عَنِ الطَّرِيقِ، وَالْحَيَاءُ شُعْبَةٌ مِنَ الْإِيمَانِ.",
    textEn:
      "Faith has over seventy branches, the highest of which is the declaration that there is no god but Allah, and the lowest is removing harm from the road. And modesty is a branch of faith.",
    textFr:
      "La foi comporte plus de soixante-dix branches, la plus élevée est l'attestation qu'il n'y a de divinité qu'Allah, et la plus basse est d'écarter un obstacle du chemin. Et la pudeur est une branche de la foi.",
    narratorEn: "Abu Hurayra (may Allah be pleased with him)",
    narratorFr: "Abou Hourayra (qu'Allah soit satisfait de lui)",
    reference: "Muslim 35",
  },
  {
    id: 3002,
    collectionId: "muslim",
    number: 2,
    chapterEn: "Kindness to Parents",
    chapterFr: "La piété filiale",
    textAr:
      "رَغِمَ أَنْفُ، ثُمَّ رَغِمَ أَنْفُ، ثُمَّ رَغِمَ أَنْفُ مَنْ أَدْرَكَ أَبَوَيْهِ عِنْدَ الْكِبَرِ أَحَدَهُمَا أَوْ كِلَيْهِمَا فَلَمْ يَدْخُلِ الْجَنَّةَ.",
    textEn:
      "Disgraced! Disgraced! Disgraced is the one who finds either or both of his parents old and does not enter Paradise through serving them.",
    textFr:
      "Humilié ! Humilié ! Humilié est celui qui trouve l'un de ses parents ou les deux âgés et n'entre pas au Paradis en les servant.",
    narratorEn: "Abu Hurayra (may Allah be pleased with him)",
    narratorFr: "Abou Hourayra (qu'Allah soit satisfait de lui)",
    reference: "Muslim 2551",
  },
  {
    id: 3003,
    collectionId: "muslim",
    number: 3,
    chapterEn: "Purification",
    chapterFr: "La purification",
    textAr: "الطُّهُورُ شَطْرُ الْإِيمَانِ.",
    textEn: "Purification is half of faith.",
    textFr: "La purification est la moitié de la foi.",
    narratorEn: "Abu Malik Al-Ash'ari (may Allah be pleased with him)",
    narratorFr: "Abou Malik Al-Ach'ari (qu'Allah soit satisfait de lui)",
    reference: "Muslim 223",
  },
  {
    id: 3004,
    collectionId: "muslim",
    number: 4,
    chapterEn: "Truthfulness",
    chapterFr: "La véracité",
    textAr:
      "عَلَيْكُمْ بِالصِّدْقِ فَإِنَّ الصِّدْقَ يَهْدِي إِلَى الْبِرِّ، وَإِنَّ الْبِرَّ يَهْدِي إِلَى الْجَنَّةِ.",
    textEn:
      "Be truthful, for truthfulness leads to righteousness, and righteousness leads to Paradise.",
    textFr:
      "Soyez véridiques, car la véracité mène à la piété, et la piété mène au Paradis.",
    narratorEn: "Abdullah ibn Mas'ud (may Allah be pleased with him)",
    narratorFr: "Abdullah ibn Mas'oud (qu'Allah soit satisfait de lui)",
    reference: "Muslim 2607",
  },
  {
    id: 3005,
    collectionId: "muslim",
    number: 5,
    chapterEn: "Gentleness",
    chapterFr: "La douceur",
    textAr: "إِنَّ اللَّهَ رَفِيقٌ يُحِبُّ الرِّفْقَ فِي الْأَمْرِ كُلِّهِ.",
    textEn: "Indeed, Allah is gentle and He loves gentleness in all things.",
    textFr: "Certes, Allah est doux et Il aime la douceur en toute chose.",
    narratorEn: "Aisha (may Allah be pleased with her)",
    narratorFr: "Aïcha (qu'Allah soit satisfait d'elle)",
    reference: "Muslim 2593",
  },
  {
    id: 3006,
    collectionId: "muslim",
    number: 6,
    chapterEn: "Forbearance",
    chapterFr: "L'indulgence",
    textAr:
      "مَا كَانَ الرِّفْقُ فِي شَيْءٍ إِلَّا زَانَهُ، وَلَا نُزِعَ مِنْ شَيْءٍ إِلَّا شَانَهُ.",
    textEn:
      "Gentleness is not found in anything except that it beautifies it, and it is not removed from anything except that it disgraces it.",
    textFr:
      "La douceur ne se trouve dans rien sans l'embellir, et n'est retirée de rien sans l'enlaidir.",
    narratorEn: "Aisha (may Allah be pleased with her)",
    narratorFr: "Aïcha (qu'Allah soit satisfait d'elle)",
    reference: "Muslim 2594",
  },
  {
    id: 3007,
    collectionId: "muslim",
    number: 7,
    chapterEn: "Good Character",
    chapterFr: "Le bon caractère",
    textAr:
      "إِنَّ مِنْ أَحَبِّكُمْ إِلَيَّ وَأَقْرَبِكُمْ مِنِّي مَجْلِسًا يَوْمَ الْقِيَامَةِ أَحَاسِنَكُمْ أَخْلَاقًا.",
    textEn:
      "The most beloved of you to me and the closest to me in the Hereafter are those with the best character.",
    textFr:
      "Les plus aimés d'entre vous auprès de moi et les plus proches de moi le Jour de la Résurrection sont ceux qui ont le meilleur caractère.",
    narratorEn: "Jabir (may Allah be pleased with him)",
    narratorFr: "Jabir (qu'Allah soit satisfait de lui)",
    reference: "Tirmidhi 2018",
  },
  {
    id: 3008,
    collectionId: "muslim",
    number: 8,
    chapterEn: "Supplication",
    chapterFr: "L'invocation",
    textAr:
      "أَقْرَبُ مَا يَكُونُ الْعَبْدُ مِنْ رَبِّهِ وَهُوَ سَاجِدٌ فَأَكْثِرُوا الدُّعَاءَ.",
    textEn:
      "The closest a servant is to his Lord is when he is prostrating, so increase your supplications.",
    textFr:
      "Le moment où le serviteur est le plus proche de son Seigneur est lorsqu'il est en prosternation, alors multipliez les invocations.",
    narratorEn: "Abu Hurayra (may Allah be pleased with him)",
    narratorFr: "Abou Hourayra (qu'Allah soit satisfait de lui)",
    reference: "Muslim 482",
  },
  {
    id: 3009,
    collectionId: "muslim",
    number: 9,
    chapterEn: "Gratitude",
    chapterFr: "La gratitude",
    textAr: "مَنْ لَا يَشْكُرُ النَّاسَ لَا يَشْكُرُ اللَّهَ.",
    textEn: "He who does not thank people does not thank Allah.",
    textFr: "Celui qui ne remercie pas les gens ne remercie pas Allah.",
    narratorEn: "Abu Hurayra (may Allah be pleased with him)",
    narratorFr: "Abou Hourayra (qu'Allah soit satisfait de lui)",
    reference: "Tirmidhi 1954",
  },
  {
    id: 3010,
    collectionId: "muslim",
    number: 10,
    chapterEn: "Charity",
    chapterFr: "L'aumône",
    textAr: "مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ.",
    textEn: "Charity does not diminish wealth.",
    textFr: "L'aumône ne diminue pas la richesse.",
    narratorEn: "Abu Hurayra (may Allah be pleased with him)",
    narratorFr: "Abou Hourayra (qu'Allah soit satisfait de lui)",
    reference: "Muslim 2588",
  },
  {
    id: 3011,
    collectionId: "muslim",
    number: 11,
    chapterEn: "Beauty",
    chapterFr: "La beauté",
    textAr: "إِنَّ اللَّهَ جَمِيلٌ يُحِبُّ الْجَمَالَ.",
    textEn: "Indeed, Allah is beautiful and He loves beauty.",
    textFr: "Certes, Allah est beau et Il aime la beauté.",
    narratorEn: "Abdullah ibn Mas'ud (may Allah be pleased with him)",
    narratorFr: "Abdullah ibn Mas'oud (qu'Allah soit satisfait de lui)",
    reference: "Muslim 91",
  },
  {
    id: 3012,
    collectionId: "muslim",
    number: 12,
    chapterEn: "Body of the Believer",
    chapterFr: "Le corps du croyant",
    textAr:
      "مَثَلُ الْمُؤْمِنِينَ فِي تَوَادِّهِمْ وَتَرَاحُمِهِمْ وَتَعَاطُفِهِمْ مَثَلُ الْجَسَدِ، إِذَا اشْتَكَى مِنْهُ عُضْوٌ تَدَاعَى لَهُ سَائِرُ الْجَسَدِ بِالسَّهَرِ وَالْحُمَّى.",
    textEn:
      "The believers in their mutual kindness, compassion, and sympathy are like a single body. When one limb aches, the whole body responds with sleeplessness and fever.",
    textFr:
      "Les croyants dans leur amour mutuel, leur compassion et leur sympathie sont comme un seul corps. Lorsqu'un membre souffre, tout le corps réagit par l'insomnie et la fièvre.",
    narratorEn: "An-Nu'man ibn Bashir (may Allah be pleased with him)",
    narratorFr: "An-Nu'man ibn Bachir (qu'Allah soit satisfait de lui)",
    reference: "Muslim 2586",
  },
  {
    id: 3013,
    collectionId: "muslim",
    number: 13,
    chapterEn: "Path",
    chapterFr: "Le chemin",
    textAr:
      "إِنَّ اللَّهَ لَا يَنْظُرُ إِلَى صُوَرِكُمْ وَأَمْوَالِكُمْ وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ وَأَعْمَالِكُمْ.",
    textEn:
      "Indeed, Allah does not look at your appearances or wealth, but He looks at your hearts and your deeds.",
    textFr:
      "Certes, Allah ne regarde pas vos apparences ni vos richesses, mais Il regarde vos cœurs et vos actes.",
    narratorEn: "Abu Hurayra (may Allah be pleased with him)",
    narratorFr: "Abou Hourayra (qu'Allah soit satisfait de lui)",
    reference: "Muslim 2564",
  },
  {
    id: 3014,
    collectionId: "muslim",
    number: 14,
    chapterEn: "Good Deeds After Death",
    chapterFr: "Les bonnes actions après la mort",
    textAr:
      "إِذَا مَاتَ الْإِنْسَانُ انْقَطَعَ عَمَلُهُ إِلَّا مِنْ ثَلَاثٍ: صَدَقَةٍ جَارِيَةٍ، أَوْ عِلْمٍ يُنْتَفَعُ بِهِ، أَوْ وَلَدٍ صَالِحٍ يَدْعُو لَهُ.",
    textEn:
      "When a person dies, his deeds are cut off except for three: ongoing charity, beneficial knowledge, or a righteous child who prays for him.",
    textFr:
      "Lorsqu'un homme meurt, ses actes s'interrompent sauf pour trois choses : une aumône continue, un savoir dont on tire bénéfice, ou un enfant pieux qui invoque pour lui.",
    narratorEn: "Abu Hurayra (may Allah be pleased with him)",
    narratorFr: "Abou Hourayra (qu'Allah soit satisfait de lui)",
    reference: "Muslim 1631",
  },
  {
    id: 3015,
    collectionId: "muslim",
    number: 15,
    chapterEn: "The Strong Believer",
    chapterFr: "Le croyant fort",
    textAr:
      "الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللَّهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ، وَفِي كُلٍّ خَيْرٌ.",
    textEn:
      "The strong believer is better and more beloved to Allah than the weak believer, and in each there is good.",
    textFr:
      "Le croyant fort est meilleur et plus aimé d'Allah que le croyant faible, et en chacun il y a du bien.",
    narratorEn: "Abu Hurayra (may Allah be pleased with him)",
    narratorFr: "Abou Hourayra (qu'Allah soit satisfait de lui)",
    reference: "Muslim 2664",
  },
];

// ─── Combined export ────────────────────────────

export const ALL_HADITHS: Hadith[] = [
  ...NAWAWI_HADITHS,
  ...BUKHARI_HADITHS,
  ...MUSLIM_HADITHS,
];

export function getHadithsByCollection(collectionId: string): Hadith[] {
  return ALL_HADITHS.filter((h) => h.collectionId === collectionId);
}

export function getCollection(
  collectionId: string,
): HadithCollection | undefined {
  return HADITH_COLLECTIONS.find((c) => c.id === collectionId);
}
