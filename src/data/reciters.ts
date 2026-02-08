export interface ReciterInfo {
  id: string;
  nameAr: string;
  nameEn: string;
  nameFr: string;
  style: 'murattal' | 'mujawwad';
  color: string; // avatar background color
}

export const RECITERS: ReciterInfo[] = [
  { id: 'ar.alafasy', nameAr: 'مشاري راشد العفاسي', nameEn: 'Mishary Rashid Alafasy', nameFr: 'Mishary Rashid Alafasy', style: 'murattal', color: '#672CBC' },
  { id: 'ar.abdulbasitmurattal', nameAr: 'عبد الباسط عبد الصمد', nameEn: 'Abdul Basit Abdul Samad', nameFr: 'Abdul Basit Abdul Samad', style: 'murattal', color: '#2563EB' },
  { id: 'ar.abdulsamad', nameAr: 'عبد الباسط عبد الصمد', nameEn: 'Abdul Basit (Mujawwad)', nameFr: 'Abdul Basit (Mujawwad)', style: 'mujawwad', color: '#1D4ED8' },
  { id: 'ar.husary', nameAr: 'محمود خليل الحصري', nameEn: 'Mahmoud Khalil Al-Hussary', nameFr: 'Mahmoud Khalil Al-Hussary', style: 'murattal', color: '#059669' },
  { id: 'ar.husarymujawwad', nameAr: 'محمود خليل الحصري', nameEn: 'Al-Hussary (Mujawwad)', nameFr: 'Al-Hussary (Mujawwad)', style: 'mujawwad', color: '#047857' },
  { id: 'ar.abdurrahmaansudais', nameAr: 'عبد الرحمن السديس', nameEn: 'Abdul Rahman Al-Sudais', nameFr: 'Abdul Rahman Al-Sudais', style: 'murattal', color: '#DC2626' },
  { id: 'ar.mahermuaiqly', nameAr: 'ماهر المعيقلي', nameEn: 'Maher Al-Muaiqly', nameFr: 'Maher Al-Muaiqly', style: 'murattal', color: '#D97706' },
  { id: 'ar.shaatree', nameAr: 'أبو بكر الشاطري', nameEn: 'Abu Bakr Al-Shatri', nameFr: 'Abu Bakr Al-Shatri', style: 'murattal', color: '#7C3AED' },
  { id: 'ar.hanirifai', nameAr: 'هاني الرفاعي', nameEn: 'Hani Ar-Rifai', nameFr: 'Hani Ar-Rifai', style: 'murattal', color: '#0891B2' },
];

export const DEFAULT_RECITER_ID = 'ar.alafasy';
