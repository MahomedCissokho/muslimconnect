export interface ReciterInfo {
  id: string;
  nameAr: string;
  nameEn: string;
  nameFr: string;
  style: 'murattal' | 'mujawwad';
  color: string;
  /** Photo URL — shown in ReciterSelector; falls back to colored avatar if missing or broken */
  photoUrl?: string;
  /** If set, audio comes from everyayah.com instead of cdn.islamic.network */
  everyayahFolder?: string;
}

// ─── alquran.cloud / cdn.islamic.network ─────────────────────────────────────
// Audio URL: https://cdn.islamic.network/quran/audio/128/{id}/{globalAyahNumber}.mp3

// ─── everyayah.com ────────────────────────────────────────────────────────────
// Audio URL: https://everyayah.com/data/{everyayahFolder}/{SSS}{AAA}.mp3
// SSS = surah padded to 3 digits, AAA = ayah-in-surah padded to 3 digits

export const RECITERS: ReciterInfo[] = [
  // ── Most popular ──────────────────────────────────────────────────────────
  {
    id: 'ar.alafasy',
    nameAr: 'مشاري راشد العفاسي',
    nameEn: 'Mishary Rashid Alafasy',
    nameFr: 'Mishary Rashid Alafasy',
    style: 'murattal',
    color: '#672CBC',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Mishary-Alafasy.jpg/220px-Mishary-Alafasy.jpg',
  },
  {
    id: 'ar.abdurrahmaansudais',
    nameAr: 'عبد الرحمن السديس',
    nameEn: 'Abdul Rahman Al-Sudais',
    nameFr: 'Abdul Rahman Al-Sudais',
    style: 'murattal',
    color: '#DC2626',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Abdurrahman_as-Sudais.jpg/220px-Abdurrahman_as-Sudais.jpg',
  },
  {
    id: 'ar.mahermuaiqly',
    nameAr: 'ماهر المعيقلي',
    nameEn: 'Maher Al-Muaiqly',
    nameFr: 'Maher Al-Muaiqly',
    style: 'murattal',
    color: '#D97706',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Maher_Almuaiqly.jpg/220px-Maher_Almuaiqly.jpg',
  },
  {
    id: 'ar.saoodshuraym',
    nameAr: 'سعود الشريم',
    nameEn: 'Saood Al-Shuraym',
    nameFr: 'Saood Al-Shuraym',
    style: 'murattal',
    color: '#B45309',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Saud_Al-Shuraim.jpg/220px-Saud_Al-Shuraim.jpg',
  },

  // ── Abdul Basit ────────────────────────────────────────────────────────────
  {
    id: 'ar.abdulbasitmurattal',
    nameAr: 'عبد الباسط عبد الصمد (مرتل)',
    nameEn: 'Abdul Basit Abdul Samad',
    nameFr: 'Abdul Basit Abdul Samad',
    style: 'murattal',
    color: '#2563EB',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Abdul_Basit_Abd_us-Samad.jpg/220px-Abdul_Basit_Abd_us-Samad.jpg',
  },
  {
    id: 'ar.abdulsamad',
    nameAr: 'عبد الباسط عبد الصمد (مجود)',
    nameEn: 'Abdul Basit (Mujawwad)',
    nameFr: 'Abdul Basit (Mujawwad)',
    style: 'mujawwad',
    color: '#1D4ED8',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Abdul_Basit_Abd_us-Samad.jpg/220px-Abdul_Basit_Abd_us-Samad.jpg',
  },

  // ── Al-Hussary ─────────────────────────────────────────────────────────────
  {
    id: 'ar.husary',
    nameAr: 'محمود خليل الحصري',
    nameEn: 'Mahmoud Khalil Al-Hussary',
    nameFr: 'Mahmoud Khalil Al-Hussary',
    style: 'murattal',
    color: '#059669',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Mahmoud_Khalil_al-Hussary.jpg/220px-Mahmoud_Khalil_al-Hussary.jpg',
  },
  {
    id: 'ar.husarymujawwad',
    nameAr: 'محمود خليل الحصري (مجود)',
    nameEn: 'Al-Hussary (Mujawwad)',
    nameFr: 'Al-Hussary (Mujawwad)',
    style: 'mujawwad',
    color: '#047857',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Mahmoud_Khalil_al-Hussary.jpg/220px-Mahmoud_Khalil_al-Hussary.jpg',
  },

  // ── Yasser Al-Dossary (everyayah.com) ─────────────────────────────────────
  {
    id: 'everyayah.dossary',
    nameAr: 'ياسر الدوسري',
    nameEn: 'Yasser Al-Dossary',
    nameFr: 'Yasser Al-Dossary',
    style: 'murattal',
    color: '#7C3AED',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Yasser_al-Dosari.jpg/220px-Yasser_al-Dosari.jpg',
    everyayahFolder: 'Yasser_Ad-Dussary_128kbps',
  },

  // ── Nasser Alqatami (everyayah.com) ───────────────────────────────────────
  {
    id: 'everyayah.alqatami',
    nameAr: 'ناصر القطامي',
    nameEn: 'Nasser Alqatami',
    nameFr: 'Nasser Alqatami',
    style: 'murattal',
    color: '#0891B2',
    everyayahFolder: 'Nasser_Alqatami_128kbps',
  },

  // ── Other popular reciters (alquran.cloud) ─────────────────────────────────
  {
    id: 'ar.shaatree',
    nameAr: 'أبو بكر الشاطري',
    nameEn: 'Abu Bakr Al-Shatri',
    nameFr: 'Abu Bakr Al-Shatri',
    style: 'murattal',
    color: '#7C3AED',
  },
  {
    id: 'ar.hanirifai',
    nameAr: 'هاني الرفاعي',
    nameEn: 'Hani Ar-Rifai',
    nameFr: 'Hani Ar-Rifai',
    style: 'murattal',
    color: '#0891B2',
  },
  {
    id: 'ar.abdullahbasfar',
    nameAr: 'عبد الله بصفر',
    nameEn: 'Abdullah Basfar',
    nameFr: 'Abdullah Basfar',
    style: 'murattal',
    color: '#0E7490',
  },
  {
    id: 'ar.hudhaify',
    nameAr: 'علي الحذيفي',
    nameEn: 'Ali Al-Hudhaify',
    nameFr: 'Ali Al-Hudhaify',
    style: 'murattal',
    color: '#065F46',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Ali_bin_Abdurrahman_Al-Hudhaifi.jpg/220px-Ali_bin_Abdurrahman_Al-Hudhaifi.jpg',
  },
  {
    id: 'ar.ibrahimakhbar',
    nameAr: 'إبراهيم الأخضر',
    nameEn: 'Ibrahim Akhdar',
    nameFr: 'Ibrahim Akhdar',
    style: 'murattal',
    color: '#166534',
  },
  {
    id: 'ar.muhammadayyoub',
    nameAr: 'محمد أيوب',
    nameEn: 'Muhammad Ayyoub',
    nameFr: 'Muhammad Ayyoub',
    style: 'murattal',
    color: '#9A3412',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Muhammad_Ayyoub.jpg/220px-Muhammad_Ayyoub.jpg',
  },
  {
    id: 'ar.muhammadjibreel',
    nameAr: 'محمد جبريل',
    nameEn: 'Muhammad Jibreel',
    nameFr: 'Muhammad Jibreel',
    style: 'murattal',
    color: '#7E22CE',
  },
  {
    id: 'ar.ahmedajamy',
    nameAr: 'أحمد بن علي العجمي',
    nameEn: 'Ahmed ibn Ali Al-Ajamy',
    nameFr: 'Ahmed ibn Ali Al-Ajamy',
    style: 'murattal',
    color: '#1E40AF',
  },
  {
    id: 'ar.aymanswoaid',
    nameAr: 'أيمن سويد',
    nameEn: 'Ayman Sowaid',
    nameFr: 'Ayman Sowaid',
    style: 'murattal',
    color: '#374151',
  },

  // ── Classic Egyptian reciters (everyayah.com) ──────────────────────────────
  {
    id: 'everyayah.tablawi',
    nameAr: 'محمد الطبلاوي',
    nameEn: 'Mohammad Al-Tablawi',
    nameFr: 'Mohammad Al-Tablawi',
    style: 'mujawwad',
    color: '#92400E',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Mohammad_al-Tablawi.jpg/220px-Mohammad_al-Tablawi.jpg',
    everyayahFolder: 'Mohammad_al_Tablaway_128kbps',
  },
  {
    id: 'everyayah.mustafaismail',
    nameAr: 'مصطفى إسماعيل',
    nameEn: 'Mustafa Ismail',
    nameFr: 'Mustafa Ismail',
    style: 'mujawwad',
    color: '#78350F',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Mustafa_Ismail.jpg/220px-Mustafa_Ismail.jpg',
    everyayahFolder: 'Mustafa_Ismail_48kbps',
  },

  // ── More popular (everyayah.com) ───────────────────────────────────────────
  {
    id: 'everyayah.ghamadi',
    nameAr: 'سعد الغامدي',
    nameEn: 'Saad Al-Ghamdi',
    nameFr: 'Saad Al-Ghamdi',
    style: 'murattal',
    color: '#4C1D95',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Sa%27ad_Al-Ghamdi.jpg/220px-Sa%27ad_Al-Ghamdi.jpg',
    everyayahFolder: 'Ghamadi_40kbps',
  },
  {
    id: 'everyayah.alijaber',
    nameAr: 'علي جابر',
    nameEn: 'Ali Jaber',
    nameFr: 'Ali Jaber',
    style: 'murattal',
    color: '#6D28D9',
    everyayahFolder: 'Ali_Jaber_64kbps',
  },
  {
    id: 'everyayah.muhsinqasim',
    nameAr: 'محسن القاسم',
    nameEn: 'Muhsin Al-Qasim',
    nameFr: 'Muhsin Al-Qasim',
    style: 'murattal',
    color: '#1E3A5F',
    everyayahFolder: 'Muhsin_Al_Qasim_192kbps',
  },
];

export const DEFAULT_RECITER_ID = 'ar.alafasy';
