# Muslim Universe — Documentation Technique Complète

> **Version** : 1.0.0 | **Plateforme** : iOS & Android | **Langue** : FR / EN
> **Auteur** : Mahomed Cissokho | **Framework** : Expo SDK 54 + React Native 0.81.5

---

## Table des matières

1. [Présentation de l'application](#1-présentation-de-lapplication)
2. [Architecture générale](#2-architecture-générale)
3. [Structure des fichiers](#3-structure-des-fichiers)
4. [Comment les données sont récupérées](#4-comment-les-données-sont-récupérées)
5. [Audio : streaming vs téléchargement](#5-audio--streaming-vs-téléchargement)
6. [Ce qui est stocké localement](#6-ce-qui-est-stocké-localement)
7. [Authentification (Supabase)](#7-authentification-supabase)
8. [Toutes les librairies utilisées](#8-toutes-les-librairies-utilisées)
9. [Les écrans de l'application](#9-les-écrans-de-lapplication)
10. [Internationalisation (FR/EN)](#10-internationalisation-fren)
11. [Notifications](#11-notifications)
12. [Build & Déploiement (EAS)](#12-build--déploiement-eas)

---

## 1. Présentation de l'application

**Muslim Universe** est une application mobile islamique complète, disponible sur **Android et iOS**. Elle accompagne le musulman dans sa pratique spirituelle quotidienne.

### Fonctionnalités principales

| Fonctionnalité | Description |
|---|---|
| 📖 **Coran complet** | Lecture des 114 sourates avec texte arabe, translittération, traduction FR/EN |
| 🔊 **Récitation audio** | Plusieurs récitateurs célèbres, lecture verset par verset ou sourate complète |
| 🕌 **Horaires de prière** | Calcul précis selon la géolocalisation de l'utilisateur |
| 🧭 **Boussole Qibla** | Direction de la Mecque en temps réel |
| 📚 **Hadiths** | Collections de hadiths du Prophète ﷺ |
| 🤲 **Duas & Adhkar** | Invocations quotidiennes avec translittération et traduction |
| 🔖 **Favoris** | Sauvegarde de versets, hadiths et duas |
| 🔍 **Recherche** | Recherche globale dans le Coran, hadiths et duas |

---

## 2. Architecture générale

```
┌─────────────────────────────────────────────────────┐
│                  Muslim Universe App                │
│                                                     │
│  ┌─────────────┐  ┌──────────┐  ┌───────────────┐  │
│  │  Expo Router │  │ NativeWind│  │  react-i18next│  │
│  │  (navigation)│  │  (styles) │  │  (FR / EN)    │  │
│  └─────────────┘  └──────────┘  └───────────────┘  │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │              React Contexts                 │    │
│  │  AuthContext | AudioContext | SettingsContext│    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │
│  │ AsyncStorage│ │ Supabase │  │   expo-audio     │   │
│  │ (local)  │  │  (auth)  │  │ (lecture audio)  │   │
│  └──────────┘  └──────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────┘
         │                │
  ┌──────▼──────┐  ┌──────▼──────┐
  │ alquran.cloud│  │ aladhan.com │
  │  (Coran API) │  │(Prière API) │
  └─────────────┘  └─────────────┘
```

### Principes de conception

- **Offline-first partiel** : Les métadonnées du Coran (114 sourates, 30 juz, 604 pages, 60 hizb) sont **intégrées dans l'app** (aucune requête réseau nécessaire)
- **API pour le contenu lourd** : Les textes arabes complets et les traductions sont chargés à la demande depuis `alquran.cloud`
- **Audio en streaming** : L'audio n'est PAS téléchargé par défaut — il est streamé depuis un CDN
- **État global** : 3 Contexts React (Auth, Audio, Settings) + AsyncStorage pour la persistance

---

## 3. Structure des fichiers

```
muslimconnect/
├── app/                          # Pages (Expo Router — file-based routing)
│   ├── _layout.tsx               # Layout racine : providers, splash, auth gate
│   ├── index.tsx                 # Écran d'accueil / onboarding
│   ├── auth.tsx                  # Connexion / Inscription
│   ├── search.tsx                # Recherche globale
│   ├── reading.tsx               # Lecture unifiée (Juz / Hizb / Page)
│   ├── (tabs)/                   # Navigation par onglets
│   │   ├── _layout.tsx           # Configuration de la barre d'onglets
│   │   ├── index.tsx             # Onglet Coran (accueil)
│   │   ├── prayer.tsx            # Onglet Prières
│   │   ├── hadith.tsx            # Onglet Hadiths
│   │   ├── duas.tsx              # Onglet Duas
│   │   └── bookmark.tsx          # Onglet Favoris
│   ├── surah/[id].tsx            # Détail sourate (id = 1 à 114)
│   ├── juz/[id].tsx              # Détail juz (id = 1 à 30)
│   ├── page/[id].tsx             # Détail page (id = 1 à 604)
│   └── hizb/[id].tsx             # Détail hizb (id = 1 à 60)
│
├── src/
│   ├── components/               # Composants réutilisables
│   │   ├── prayer/               # Composants spécifiques aux prières
│   │   │   ├── QiblaCompass.tsx  # Boussole Qibla animée
│   │   │   ├── PrayerCard.tsx    # Carte horaire de prière
│   │   │   ├── CountdownCard.tsx # Compte à rebours prochaine prière
│   │   │   ├── utils.ts          # Calculs (qibla, countdown, etc.)
│   │   │   └── types.ts          # Types TypeScript spécifiques
│   │   ├── AudioPlayerBar.tsx    # Mini-lecteur audio global (bas d'écran)
│   │   ├── QuranGroupDetail.tsx  # Détail Juz/Hizb/Page (composant partagé)
│   │   ├── SurahList.tsx         # Liste des 114 sourates
│   │   ├── JuzList.tsx           # Liste des 30 juz
│   │   ├── PageList.tsx          # Liste des 604 pages
│   │   ├── HizbList.tsx          # Liste des 60 hizb
│   │   ├── ReciterSelector.tsx   # Sélecteur de récitateur
│   │   ├── ToggleSwitch.tsx      # Composant interrupteur (affichage)
│   │   ├── LoadingIndicator.tsx  # Indicateur de chargement
│   │   └── SkeletonLoader.tsx    # Skeleton placeholder
│   │
│   ├── contexts/                 # États globaux React
│   │   ├── AudioContext.tsx      # État audio (lecture, playlist, piste courante)
│   │   ├── AuthContext.tsx       # Authentification utilisateur (Supabase)
│   │   ├── SettingsContext.tsx   # Paramètres (récitateur, langue, affichage)
│   │   └── DownloadContext.tsx   # Gestion téléchargements (code présent, UI supprimée)
│   │
│   ├── services/                 # Logique métier et appels API
│   │   ├── quran.ts              # API alquran.cloud (texte arabe, traductions)
│   │   ├── audio.ts              # Gestionnaire audio bas niveau (expo-audio)
│   │   ├── bookmarks.ts          # CRUD favoris (AsyncStorage)
│   │   ├── lastRead.ts           # Sauvegarde dernière position de lecture
│   │   ├── settings.ts           # Persistance paramètres utilisateur
│   │   ├── hadithApi.ts          # API HadeethEnc (hadiths en ligne)
│   │   ├── notifications.ts      # Notifications locales (horaires de prière)
│   │   ├── supabase.ts           # Client Supabase (auth)
│   │   └── downloadManager.ts   # Téléchargement audio MP3 (dead code — UI retirée)
│   │
│   ├── hooks/                    # Hooks React personnalisés
│   │   └── useQuran.ts           # Hook pour accéder aux données Coran
│   │
│   ├── constants/                # Constantes visuelles
│   │   ├── colors.ts             # Palette de couleurs (primaire, or, violet...)
│   │   ├── fonts.ts              # Familles et tailles de police
│   │   ├── spacing.ts            # Échelle d'espacement
│   │   └── index.ts              # Export centralisé
│   │
│   ├── i18n/                     # Traductions
│   │   ├── index.ts              # Configuration i18next
│   │   └── locales/
│   │       ├── en.json           # Traductions anglaises
│   │       └── fr.json           # Traductions françaises
│   │
│   ├── types/                    # Définitions TypeScript
│   │   └── index.ts              # Tous les types (Ayah, Surah, Prayer, Hadith, Dua...)
│   │
│   ├── data/                     # Données statiques intégrées dans l'app
│   │   ├── surahs.ts             # 114 sourates (métadonnées)
│   │   ├── juz.ts                # 30 juz (positions)
│   │   ├── hizb.ts               # 240 quarts de hizb
│   │   ├── pages.ts              # 604 pages du mushaf
│   │   ├── reciters.ts           # Liste des récitateurs disponibles
│   │   ├── hadiths.ts            # Hadiths en local (fallback)
│   │   ├── duas.ts               # Collection complète de duas
│   │   └── index.ts              # Export + helpers
│   │
│   └── utils/                    # Utilitaires
│       └── audioUrl.ts           # Construction des URLs audio
│
├── assets/images/                # Icônes et images
├── app.json                      # Configuration Expo
├── eas.json                      # Configuration EAS Build
├── package.json                  # Dépendances npm
└── tailwind.config.js            # Configuration TailwindCSS
```

---

## 4. Comment les données sont récupérées

### 4.1 Données 100% locales (pas de réseau nécessaire)

Ces données sont **bundlées dans l'application** lors du build. Elles sont disponibles instantanément même sans connexion internet.

| Données | Fichier | Contenu |
|---|---|---|
| 114 sourates | `src/data/surahs.ts` | Numéro, nom arabe, translittération, nom FR/EN, type (mecquoise/médinoise), nb de versets |
| 30 Juz | `src/data/juz.ts` | Numéro, sourate de début/fin, verset de début/fin |
| 60 Hizb (240 quarts) | `src/data/hizb.ts` | Numéro, quart (1-4), juz associé, position de début/fin |
| 604 Pages | `src/data/pages.ts` | Numéro, sourate de début, verset de début, numéro de juz |
| Duas & catégories | `src/data/duas.ts` | Toutes les duas avec texte arabe, phonétique, traduction FR/EN |
| Hadiths (fallback) | `src/data/hadiths.ts` | Collection locale utilisée si l'API est inaccessible |
| Récitateurs | `src/data/reciters.ts` | Liste des récitateurs avec leurs identifiants API |

### 4.2 Données depuis des APIs externes

#### API Coran — `alquran.cloud`

**URL de base** : `https://api.alquran.cloud/v1`

C'est l'API principale pour le contenu textuel du Coran. Elle est appelée **à chaque ouverture d'une sourate** ou d'un groupe (juz/hizb/page).

```
Quand tu cliques sur "Al-Fatiha" (sourate 1) :
  → GET https://api.alquran.cloud/v1/surah/1/ar.uthmani     (texte arabe)
  → GET https://api.alquran.cloud/v1/surah/1/fr.hamidullah   (traduction française)
  → Les deux réponses sont fusionnées verset par verset
```

**Ce que retourne l'API** :
- Texte arabe (édition `ar.uthmani` — script Othmane)
- Traduction française (`fr.hamidullah`)
- Traduction anglaise (`en.sahih` ou `en.pickthall`)
- Métadonnées : numéro de verset, page, juz, hizb, sajda

**Gestion des erreurs** : Si l'API échoue (pas de réseau, timeout), l'app affiche un message d'erreur traduit avec un bouton "Réessayer".

#### API Prières — `aladhan.com`

**URL** : `https://api.aladhan.com/v1/timings`

Appelée **une fois par jour** quand l'utilisateur ouvre l'onglet Prières.

```
Quand tu ouvres l'onglet Prière :
  1. L'app demande la permission de géolocalisation
  2. Elle récupère les coordonnées GPS (latitude, longitude)
  3. Elle appelle : GET https://api.aladhan.com/v1/timings?latitude=48.85&longitude=2.35&method=2
  4. L'API retourne les 6 horaires de prière pour le jour en cours
  5. L'app calcule aussi la direction Qibla à partir des coordonnées GPS
```

**Ce que retourne l'API** :
- Horaires : Fajr, Lever du soleil, Dhuhr, Asr, Maghrib, Isha
- Date Grégorienne et Hijri
- Informations sur le fuseau horaire et la méthode de calcul

#### API Hadiths — `hadeethenc.com`

**URL** : `https://hadeethenc.com/api/`

Appelée quand l'utilisateur ouvre l'onglet Hadiths (mode en ligne).

**Fonctionnement** :
- Si disponible → charge les catégories et hadiths depuis l'API
- Si indisponible → bascule sur les données locales (`src/data/hadiths.ts`)

### 4.3 Schéma de flux de données

```
Utilisateur ouvre la sourate Al-Baqara (2)
         │
         ▼
  [Données locales]         [API alquran.cloud]
  ┌──────────────────┐      ┌──────────────────────┐
  │ Nom: "البقرة"    │      │ GET /surah/2/ar.uthmani│
  │ 286 versets      │  +   │ GET /surah/2/fr.hamid. │
  │ Type: Médinoise  │      │ (texte arabe + trad.)  │
  └──────────────────┘      └──────────────────────┘
         │                           │
         └───────────┬───────────────┘
                     ▼
              Affichage de la sourate
              avec texte arabe + traduction
```

---

## 5. Audio : streaming vs téléchargement

### 5.1 Comment fonctionne la lecture audio

Quand tu cliques sur "Lire" pour un verset ou une sourate, l'audio **n'est PAS téléchargé** sur le téléphone. Il est **streamé en direct** depuis un CDN (réseau de diffusion de contenu).

#### Qu'est-ce qu'un CDN ?

Un **CDN (Content Delivery Network)** est un réseau de serveurs répartis dans le monde entier. Au lieu que tout l'audio soit hébergé sur un seul serveur en Amérique, le fichier MP3 que tu écoutes vient du serveur le plus proche de toi géographiquement.

```
Sans CDN :                    Avec CDN (alquran.cloud) :

Téléphone (Paris)             Téléphone (Paris)
      │                             │
      │ 200ms de latence            │ 20ms de latence
      │                             │
      ▼                             ▼
Serveur (USA)              Serveur CDN (Europe/Proche-Orient)
```

**Résultat** : L'audio démarre très rapidement, pas de téléchargement d'abord.

### 5.2 Sources audio

L'application supporte **deux sources audio** :

#### Source 1 : alquran.cloud (principale)

```
Format URL : https://cdn.alquran.cloud/media/audio/ayah/{reciteur}/{numeroVerset}

Exemple pour le verset 1 (Al-Fatiha v.1) avec Al-Afasy :
https://cdn.alquran.cloud/media/audio/ayah/ar.alafasy/1
```

Le `{numeroVerset}` ici est le **numéro global** du verset dans tout le Coran (1 à 6236), pas le numéro dans la sourate.

#### Source 2 : everyayah.com (pour certains récitateurs)

```
Format URL : https://everyayah.com/data/{dossier}/{surah}_{verset}.mp3

Exemple pour Al-Fatiha v.1 :
https://everyayah.com/data/Alafasy_128kbps/001_001.mp3
```

Ici le numéro de sourate et de verset sont **formatés sur 3 chiffres** (001, 002, etc.).

### 5.3 Pré-buffering audio

Pour éviter les blancs entre versets, l'app utilise une technique de **pré-buffering** :

```
En train de lire : Verset 1
         │
         ▼
   [Pendant la lecture de v.1, on charge v.2 en arrière-plan]
         │
         ▼
   Quand v.1 se termine → v.2 est déjà prêt → lecture instantanée
```

Cela évite le délai réseau entre chaque verset lors d'une lecture continue.

### 5.4 L'audio est-il stocké sur le téléphone ?

**Par défaut : NON.** Chaque écoute stream le fichier depuis internet.

Il existe un service `downloadManager.ts` dans le code qui permet de télécharger des sourates en MP3 vers le stockage local (`{documentDirectory}/audio/{reciteur}/{surah}/{verset}.mp3`), mais **le bouton download a été retiré de l'interface** — le code est encore présent mais inutilisé (dead code).

```
État actuel :
✅ Streaming audio depuis CDN → actif et fonctionnel
❌ Bouton téléchargement → retiré de l'UI (code encore dans le projet)
```

---

## 6. Ce qui est stocké localement

Tout ce qui est stocké sur le téléphone de l'utilisateur utilise **AsyncStorage** — une base de données clé-valeur simple, privée et locale à l'application.

### Inventaire complet des données locales

| Clé AsyncStorage | Type | Description |
|---|---|---|
| `@app/bookmarks` | Array | Tous les favoris (versets, hadiths, duas) |
| `@app/lastRead` | Object | Dernière position de lecture |
| `@settings/reciterId` | String | ID du récitateur sélectionné |
| `@settings/displayOptions` | Object | Options d'affichage (arabe, trad., translit.) |
| `@settings/language` | String | Langue de l'app (`'fr'` ou `'en'`) |
| `@settings/prayerNotifications` | Boolean | Notif horaires de prière activées |
| `@settings/morningAdhkar` | Boolean | Rappel adhkar du matin activé |
| `@settings/eveningAdhkar` | Boolean | Rappel adhkar du soir activé |
| *(Supabase session)* | Object | Session utilisateur (géré automatiquement par Supabase) |

### Détail de chaque donnée

#### `@app/bookmarks`

```json
[
  {
    "type": "ayah",
    "id": "2:255",
    "surahNumber": 2,
    "ayahNumber": 255,
    "surahName": "Al-Baqara",
    "textAr": "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ...",
    "savedAt": "2025-01-15T14:30:00Z"
  },
  {
    "type": "hadith",
    "id": "bukhari-1",
    "collectionId": "bukhari",
    "number": 1,
    "textAr": "إنما الأعمال بالنيات...",
    "savedAt": "2025-01-15T15:00:00Z"
  },
  {
    "type": "dua",
    "id": "morning-1",
    "categoryId": "morning",
    "titleFr": "Au réveil",
    "textAr": "الحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا...",
    "savedAt": "2025-01-15T16:00:00Z"
  }
]
```

#### `@app/lastRead`

```json
{
  "surahNumber": 2,
  "ayahNumber": 255,
  "juz": 3,
  "page": 42,
  "hizb": 5,
  "timestamp": "2025-01-15T14:30:00Z"
}
```

#### `@settings/displayOptions`

```json
{
  "showArabic": true,
  "showTransliteration": true,
  "showTranslation": true
}
```

### Ce qui N'est PAS stocké localement

- Les textes arabes des sourates (récupérés à la volée depuis l'API)
- Les traductions des sourates (récupérées à la volée depuis l'API)
- Les fichiers audio MP3 (streamés, non stockés)
- Les hadiths de l'API en ligne (non mis en cache)

---

## 7. Authentification (Supabase)

### Qu'est-ce que Supabase ?

**Supabase** est un service backend "clé en main" (Backend as a Service). Dans Muslim Universe, il est utilisé **uniquement pour l'authentification** (connexion / inscription des utilisateurs).

### Flux d'authentification

```
1. L'utilisateur entre email + mot de passe
         │
         ▼
2. L'app envoie les credentials à Supabase
   POST https://[project].supabase.co/auth/v1/token
         │
         ▼
3. Supabase valide et retourne un JWT (token d'accès)
         │
         ▼
4. L'app stocke ce token dans AsyncStorage (automatiquement)
         │
         ▼
5. Au prochain démarrage → l'app récupère le token → l'utilisateur est connecté
```

### Variables d'environnement nécessaires

```
EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIs...
```

Ces variables sont injectées lors du **build EAS** (via `eas env:create`). Elles sont "publiques" car elles commencent par `EXPO_PUBLIC_` — elles se retrouvent dans l'APK/IPA. La clé Supabase utilisée est la **clé publique anon** (pas la clé admin secrète).

### Données utilisateur stockées

- `email` — adresse de connexion
- `full_name` — nom d'utilisateur (stocké dans `user_metadata`)
- Session JWT — token de connexion (géré automatiquement par Supabase + AsyncStorage)

---

## 8. Toutes les librairies utilisées

### Framework & Navigation

| Librairie | Version | Rôle |
|---|---|---|
| `expo` | ~54.0.33 | Framework mobile (shell natif, build, API) |
| `react` | 19.1.0 | Bibliothèque UI |
| `react-native` | 0.81.5 | Couche native iOS/Android |
| `expo-router` | ~6.0.23 | Routing basé sur les fichiers (comme Next.js) |
| `@react-navigation/bottom-tabs` | 7.4.0 | Barre d'onglets du bas |
| `@react-navigation/native` | 7.1.8 | Navigation core |
| `react-native-screens` | ~4.16.0 | Écrans natifs (performances) |
| `react-native-safe-area-context` | ~5.6.0 | Gestion des encoches/zones sûres |
| `react-native-gesture-handler` | ~2.28.0 | Gestion des gestes tactiles |
| `react-native-reanimated` | ~4.1.1 | Animations fluides (thread natif) |

### Styles

| Librairie | Version | Rôle |
|---|---|---|
| `nativewind` | 4.2.0 | Classes Tailwind CSS pour React Native |
| `tailwindcss` | 3.4.17 | Framework CSS utilitaire |
| `expo-linear-gradient` | 15.0.8 | Arrière-plans en dégradé |

### Polices

| Librairie | Version | Rôle |
|---|---|---|
| `@expo-google-fonts/poppins` | 0.4.1 | Police UI (texte en français/anglais) |
| `@expo-google-fonts/amiri` | 0.4.1 | Police arabe (texte coranique) |
| `expo-font` | ~14.0.8 | Chargement des polices personnalisées |

### Icônes

| Librairie | Version | Rôle |
|---|---|---|
| `@expo/vector-icons` | 15.0.2 | Icônes vectorielles (Ionicons, MaterialIcons...) |

### Internationalisation

| Librairie | Version | Rôle |
|---|---|---|
| `i18next` | 25.7.3 | Framework de traduction |
| `react-i18next` | 16.5.0 | Intégration i18next dans React |
| `expo-localization` | ~17.0.8 | Détection de la langue du système |

### Backend & Stockage

| Librairie | Version | Rôle |
|---|---|---|
| `@supabase/supabase-js` | 2.97.0 | Client Supabase (auth) |
| `@react-native-async-storage/async-storage` | 2.2.0 | Stockage local clé-valeur |

### Audio

| Librairie | Version | Rôle |
|---|---|---|
| `expo-audio` | ~1.1.1 | Lecture audio MP3 (streaming) |

### Localisation & Capteurs

| Librairie | Version | Rôle |
|---|---|---|
| `expo-location` | ~19.0.8 | GPS + cap magnétique (Qibla) |
| `expo-sensors` | ~15.0.8 | Magnétomètre (détection boussole hardware) |

### Notifications

| Librairie | Version | Rôle |
|---|---|---|
| `expo-notifications` | ~0.32.16 | Notifications locales (horaires de prière) |

### Réseau & Images

| Librairie | Version | Rôle |
|---|---|---|
| `axios` | 1.12.2 | Requêtes HTTP (alquran.cloud, aladhan.com) |
| `expo-image` | 3.0.11 | Composant image optimisé |

### Utilitaires système

| Librairie | Version | Rôle |
|---|---|---|
| `expo-file-system` | ~19.0.21 | Accès aux fichiers locaux (download manager) |
| `expo-haptics` | ~15.0.8 | Retour haptique (vibrations, ex: Qibla trouvée) |
| `expo-clipboard` | ~8.0.8 | Copier dans le presse-papiers |
| `expo-web-browser` | ~15.0.10 | Ouvrir des liens dans le navigateur |
| `expo-linking` | ~8.0.11 | Deep links (ex: confirmation email Supabase) |
| `expo-constants` | ~18.0.8 | Variables d'app (version, etc.) |
| `expo-splash-screen` | ~31.0.13 | Contrôle de l'écran de démarrage |
| `react-native-toast-message` | 2.3.3 | Notifications toast dans l'app |

---

## 9. Les écrans de l'application

### Navigation principale

```
                    ┌─────────────────────┐
                    │   Écran d'accueil   │  (onboarding)
                    │     index.tsx       │
                    └──────────┬──────────┘
                               │ → Créer un compte / Se connecter
                    ┌──────────▼──────────┐
                    │   Authentification  │
                    │      auth.tsx       │
                    └──────────┬──────────┘
                               │ → Connexion réussie
          ┌────────────────────▼────────────────────┐
          │              Barre d'onglets             │
          │  Coran | Prière | Hadiths | Duas | Favoris │
          └─────────────────────────────────────────┘
```

### Détail des écrans

| Écran | Route | Description |
|---|---|---|
| **Onboarding** | `/` | Page d'accueil avec présentation des fonctionnalités |
| **Auth** | `/auth` | Connexion / Inscription (Supabase) |
| **Coran** | `/(tabs)/` | Liste des sourates + accès Juz/Page/Hizb |
| **Prière** | `/(tabs)/prayer` | Horaires de prière + boussole Qibla |
| **Hadiths** | `/(tabs)/hadith` | Collections de hadiths |
| **Duas** | `/(tabs)/duas` | Catégories de duas et adhkar |
| **Favoris** | `/(tabs)/bookmark` | Versets, hadiths, duas sauvegardés |
| **Recherche** | `/search` | Recherche globale dans le contenu |
| **Sourate** | `/surah/[1-114]` | Lecture d'une sourate complète |
| **Juz** | `/juz/[1-30]` | Contenu d'un juz |
| **Page** | `/page/[1-604]` | Contenu d'une page de mushaf |
| **Hizb** | `/hizb/[1-60]` | Contenu d'un hizb |
| **Lecture** | `/reading` | Lecteur unifié (Juz/Hizb/Page) avec auto-play |

### Boussole Qibla — fonctionnement détaillé

La boussole Qibla utilise **deux capteurs combinés** :

```
1. Magnetometer.isAvailableAsync()
   → Vérifie si l'appareil a une boussole hardware
   → Si NON → affiche le cap en degrés uniquement (pas de boussole animée)

2. Location.watchHeadingAsync()
   → Donne le cap magnétique fusionné par l'OS (magnétomètre + accéléromètre)
   → Résultat stable même si le téléphone n'est pas à plat
   → Mis à jour en temps réel

3. Calcul de la direction Qibla
   → À partir des coordonnées GPS de l'utilisateur
   → Formule trigonométrique (angle vers La Mecque)

4. Animation
   → La flèche tourne vers la Qibla
   → Quand aligné (±5°) → flash vert + vibration haptique
```

---

## 10. Internationalisation (FR/EN)

L'application supporte **le français et l'anglais** intégralement.

### Comment ça fonctionne

```
1. Au démarrage, l'app lit la langue du système (expo-localization)
2. Si le système est en français → app en français
3. Si le système est en anglais → app en anglais
4. L'utilisateur peut changer la langue dans les Paramètres
5. Le changement est sauvegardé dans AsyncStorage (@settings/language)
6. Au prochain démarrage, la langue sauvegardée est utilisée
```

### Structure des fichiers de traduction

Tous les textes de l'app sont dans :
- `src/i18n/locales/fr.json` — toutes les chaînes en français
- `src/i18n/locales/en.json` — toutes les chaînes en anglais

Exemples de clés de traduction :

```json
{
  "prayer.fajr": "Fajr" / "Fajr",
  "prayer.qiblaAligned": "Qibla trouvée !" / "Qibla found!",
  "prayer.turnToQibla": "Téléphone à plat · tournez jusqu'au vert → Qibla trouvée"
                      / "Hold phone flat · rotate until green → Qibla found",
  "auth.signIn": "Se connecter" / "Sign In",
  "errors.network": "Vérifiez votre connexion internet" / "Check your internet connection"
}
```

### Contenu bilingue dans les données

Certaines données ont des champs EN et FR intégrés directement :

```typescript
// Dans src/data/duas.ts :
{
  titleFr: "Au réveil",
  titleEn: "Upon waking",
  textAr: "الحَمْدُ لِلَّهِ...",
  textFr: "Louange à Allah...",
  textEn: "Praise be to Allah...",
}
```

---

## 11. Notifications

L'app peut envoyer **3 types de notifications locales** :

| Notification | Heure | Clé setting |
|---|---|---|
| **Horaires de prière** | À chaque heure de prière (5x/jour) | `prayerNotifications` |
| **Adhkar du matin** | Chaque jour à 06h30 | `morningAdhkar` |
| **Adhkar du soir** | Chaque jour à 20h30 | `eveningAdhkar` |

Ces notifications sont **locales** (générées par l'appareil lui-même, pas de serveur push). Elles nécessitent la permission de notification de l'OS.

---

## 12. Build & Déploiement (EAS)

### Qu'est-ce qu'EAS ?

**EAS (Expo Application Services)** est le service cloud d'Expo qui compile l'application dans le cloud. Cela évite d'avoir Android Studio ou Xcode installés localement.

### Profils de build

```json
{
  "development": {
    "developmentClient": true,    // App de dev avec outils de debug
    "distribution": "internal"    // Partage interne (lien QR code)
  },
  "preview": {
    "distribution": "internal"    // APK/IPA pour test interne
  },
  "production": {
    "autoIncrement": true         // Incrémente automatiquement le numéro de version
  }
}
```

### Commandes principales

```bash
# Installer les dépendances
npm install

# Lancer en mode développement
npx expo start

# Build Android (test interne)
eas build -p android --profile preview

# Build iOS (test interne)
eas build -p ios --profile preview

# Build Android (production)
eas build -p android --profile production

# Mettre à jour les packages vers les versions compatibles avec l'Expo SDK
npx expo install --fix

# Créer une variable d'environnement dans EAS
eas env:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://xxx.supabase.co"
```

### Variables d'environnement requises

Pour que l'app fonctionne en build EAS, ces variables doivent être configurées :

```
EXPO_PUBLIC_SUPABASE_URL  → URL de ton projet Supabase
EXPO_PUBLIC_SUPABASE_KEY  → Clé publique anon de Supabase
```

Ces variables sont injectées dans le build via EAS Secrets/Environment. Elles sont disponibles dans `process.env.EXPO_PUBLIC_SUPABASE_URL`.

### Historique des problèmes de build rencontrés

#### Problème 1 : Build Gradle échoue (react-native-reanimated 3.x)

**Cause** : `react-native-reanimated 3.17.x` utilisait une API C++ (`ShadowNode::Shared`) dépréciée dans React Native 0.81.4.

**Solution** :
```bash
npx expo install --fix
# Mise à jour vers react-native-reanimated ~4.1.1 et tous les packages compatibles SDK 54
```

#### Problème 2 : L'app crashait après l'écran de démarrage

**Cause** : Les variables `EXPO_PUBLIC_SUPABASE_URL` et `EXPO_PUBLIC_SUPABASE_KEY` n'étaient pas disponibles dans l'environnement EAS (elles existaient uniquement dans le fichier `.env.local` local).

**Solution** :
```bash
eas env:create --scope project --name EXPO_PUBLIC_SUPABASE_URL \
  --value "https://xxx.supabase.co" \
  --environment development,preview,production

eas env:create --scope project --name EXPO_PUBLIC_SUPABASE_KEY \
  --value "eyJhbGci..." \
  --environment development,preview,production
```

### Distribution Android vs iOS

| | Android | iOS |
|---|---|---|
| **Coût** | 25 $ (une seule fois, Google Play) | 99 $/an (Apple Developer) |
| **Test interne** | APK direct (pas besoin de compte) | TestFlight (compte Apple requis) |
| **Distribution EAS** | `.apk` ou `.aab` | `.ipa` |
| **Soumission app store** | `eas submit -p android` | `eas submit -p ios` |

---

## Palette de couleurs

| Nom | Hex | Usage |
|---|---|---|
| `primary` | `#040C23` | Fond principal (bleu très foncé) |
| `secondary` | `#121A3A` | Fond secondaire (cartes) |
| `tertiary` | `#121931` | Fond tertiaire |
| `gold` | `#F9BD64` | Accent principal (or) |
| `purple` | `#672CBC` | Accent secondaire |
| `purpleLight` | `#9879E9` | Violet clair |
| `success` | `#34D399` | Vert (succès, Qibla alignée) |
| `error` | `#F87171` | Rouge (erreurs) |
| `warning` | `#FBBF24` | Jaune (avertissements) |

---

*Documentation générée le 20 février 2026*
