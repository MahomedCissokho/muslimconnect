export interface HizbQuarterInfo {
  quarter: number; // 1-240
  hizb: number; // 1-60
  startSurah: number;
  startAyah: number;
  juz: number; // 1-30
}

// Each entry: [quarter, hizb, startSurah, startAyah, juz]
// Based on the standard Mushaf al-Madinah hizb quarter divisions.
// 30 juz x 2 hizb x 4 quarters = 240 hizb quarters.
const HIZB_DATA: [number, number, number, number, number][] = [
  // === Juz 1 (Al-Fatiha 1:1 - Al-Baqarah 2:141) ===
  [1, 1, 1, 1, 1],       // Hizb 1 Q1 - Al-Fatiha 1:1
  [2, 1, 2, 26, 1],      // Hizb 1 Q2 - Al-Baqarah 2:26
  [3, 1, 2, 44, 1],      // Hizb 1 Q3 - Al-Baqarah 2:44
  [4, 1, 2, 60, 1],      // Hizb 1 Q4 - Al-Baqarah 2:60
  [5, 2, 2, 75, 1],      // Hizb 2 Q1 - Al-Baqarah 2:75
  [6, 2, 2, 92, 1],      // Hizb 2 Q2 - Al-Baqarah 2:92
  [7, 2, 2, 106, 1],     // Hizb 2 Q3 - Al-Baqarah 2:106
  [8, 2, 2, 124, 1],     // Hizb 2 Q4 - Al-Baqarah 2:124

  // === Juz 2 (Al-Baqarah 2:142 - Al-Baqarah 2:252) ===
  [9, 3, 2, 142, 2],     // Hizb 3 Q1 - Al-Baqarah 2:142
  [10, 3, 2, 158, 2],    // Hizb 3 Q2 - Al-Baqarah 2:158
  [11, 3, 2, 177, 2],    // Hizb 3 Q3 - Al-Baqarah 2:177
  [12, 3, 2, 189, 2],    // Hizb 3 Q4 - Al-Baqarah 2:189
  [13, 4, 2, 203, 2],    // Hizb 4 Q1 - Al-Baqarah 2:203
  [14, 4, 2, 219, 2],    // Hizb 4 Q2 - Al-Baqarah 2:219
  [15, 4, 2, 233, 2],    // Hizb 4 Q3 - Al-Baqarah 2:233
  [16, 4, 2, 243, 2],    // Hizb 4 Q4 - Al-Baqarah 2:243

  // === Juz 3 (Al-Baqarah 2:253 - Al-Imran 3:92) ===
  [17, 5, 2, 253, 3],    // Hizb 5 Q1 - Al-Baqarah 2:253
  [18, 5, 2, 263, 3],    // Hizb 5 Q2 - Al-Baqarah 2:263
  [19, 5, 2, 272, 3],    // Hizb 5 Q3 - Al-Baqarah 2:272
  [20, 5, 2, 283, 3],    // Hizb 5 Q4 - Al-Baqarah 2:283
  [21, 6, 3, 15, 3],     // Hizb 6 Q1 - Al-Imran 3:15
  [22, 6, 3, 33, 3],     // Hizb 6 Q2 - Al-Imran 3:33
  [23, 6, 3, 52, 3],     // Hizb 6 Q3 - Al-Imran 3:52
  [24, 6, 3, 75, 3],     // Hizb 6 Q4 - Al-Imran 3:75

  // === Juz 4 (Al-Imran 3:93 - An-Nisa 4:23) ===
  [25, 7, 3, 93, 4],     // Hizb 7 Q1 - Al-Imran 3:93
  [26, 7, 3, 113, 4],    // Hizb 7 Q2 - Al-Imran 3:113
  [27, 7, 3, 133, 4],    // Hizb 7 Q3 - Al-Imran 3:133
  [28, 7, 3, 153, 4],    // Hizb 7 Q4 - Al-Imran 3:153
  [29, 8, 3, 171, 4],    // Hizb 8 Q1 - Al-Imran 3:171
  [30, 8, 3, 186, 4],    // Hizb 8 Q2 - Al-Imran 3:186
  [31, 8, 4, 1, 4],      // Hizb 8 Q3 - An-Nisa 4:1
  [32, 8, 4, 12, 4],     // Hizb 8 Q4 - An-Nisa 4:12

  // === Juz 5 (An-Nisa 4:24 - An-Nisa 4:147) ===
  [33, 9, 4, 24, 5],     // Hizb 9 Q1 - An-Nisa 4:24
  [34, 9, 4, 36, 5],     // Hizb 9 Q2 - An-Nisa 4:36
  [35, 9, 4, 58, 5],     // Hizb 9 Q3 - An-Nisa 4:58
  [36, 9, 4, 74, 5],     // Hizb 9 Q4 - An-Nisa 4:74
  [37, 10, 4, 88, 5],    // Hizb 10 Q1 - An-Nisa 4:88
  [38, 10, 4, 100, 5],   // Hizb 10 Q2 - An-Nisa 4:100
  [39, 10, 4, 114, 5],   // Hizb 10 Q3 - An-Nisa 4:114
  [40, 10, 4, 135, 5],   // Hizb 10 Q4 - An-Nisa 4:135

  // === Juz 6 (An-Nisa 4:148 - Al-Maidah 5:81) ===
  [41, 11, 4, 148, 6],   // Hizb 11 Q1 - An-Nisa 4:148
  [42, 11, 4, 163, 6],   // Hizb 11 Q2 - An-Nisa 4:163
  [43, 11, 5, 1, 6],     // Hizb 11 Q3 - Al-Maidah 5:1
  [44, 11, 5, 12, 6],    // Hizb 11 Q4 - Al-Maidah 5:12
  [45, 12, 5, 27, 6],    // Hizb 12 Q1 - Al-Maidah 5:27
  [46, 12, 5, 41, 6],    // Hizb 12 Q2 - Al-Maidah 5:41
  [47, 12, 5, 51, 6],    // Hizb 12 Q3 - Al-Maidah 5:51
  [48, 12, 5, 67, 6],    // Hizb 12 Q4 - Al-Maidah 5:67

  // === Juz 7 (Al-Maidah 5:82 - Al-An'am 6:110) ===
  [49, 13, 5, 82, 7],    // Hizb 13 Q1 - Al-Maidah 5:82
  [50, 13, 5, 97, 7],    // Hizb 13 Q2 - Al-Maidah 5:97
  [51, 13, 5, 109, 7],   // Hizb 13 Q3 - Al-Maidah 5:109
  [52, 13, 6, 13, 7],    // Hizb 13 Q4 - Al-An'am 6:13
  [53, 14, 6, 36, 7],    // Hizb 14 Q1 - Al-An'am 6:36
  [54, 14, 6, 59, 7],    // Hizb 14 Q2 - Al-An'am 6:59
  [55, 14, 6, 74, 7],    // Hizb 14 Q3 - Al-An'am 6:74
  [56, 14, 6, 95, 7],    // Hizb 14 Q4 - Al-An'am 6:95

  // === Juz 8 (Al-An'am 6:111 - Al-A'raf 7:87) ===
  [57, 15, 6, 111, 8],   // Hizb 15 Q1 - Al-An'am 6:111
  [58, 15, 6, 127, 8],   // Hizb 15 Q2 - Al-An'am 6:127
  [59, 15, 6, 141, 8],   // Hizb 15 Q3 - Al-An'am 6:141
  [60, 15, 6, 151, 8],   // Hizb 15 Q4 - Al-An'am 6:151
  [61, 16, 7, 1, 8],     // Hizb 16 Q1 - Al-A'raf 7:1
  [62, 16, 7, 31, 8],    // Hizb 16 Q2 - Al-A'raf 7:31
  [63, 16, 7, 47, 8],    // Hizb 16 Q3 - Al-A'raf 7:47
  [64, 16, 7, 65, 8],    // Hizb 16 Q4 - Al-A'raf 7:65

  // === Juz 9 (Al-A'raf 7:88 - Al-Anfal 8:40) ===
  [65, 17, 7, 88, 9],    // Hizb 17 Q1 - Al-A'raf 7:88
  [66, 17, 7, 117, 9],   // Hizb 17 Q2 - Al-A'raf 7:117
  [67, 17, 7, 142, 9],   // Hizb 17 Q3 - Al-A'raf 7:142
  [68, 17, 7, 156, 9],   // Hizb 17 Q4 - Al-A'raf 7:156
  [69, 18, 7, 171, 9],   // Hizb 18 Q1 - Al-A'raf 7:171
  [70, 18, 7, 189, 9],   // Hizb 18 Q2 - Al-A'raf 7:189
  [71, 18, 8, 1, 9],     // Hizb 18 Q3 - Al-Anfal 8:1
  [72, 18, 8, 22, 9],    // Hizb 18 Q4 - Al-Anfal 8:22

  // === Juz 10 (Al-Anfal 8:41 - At-Tawbah 9:92) ===
  [73, 19, 8, 41, 10],   // Hizb 19 Q1 - Al-Anfal 8:41
  [74, 19, 8, 61, 10],   // Hizb 19 Q2 - Al-Anfal 8:61
  [75, 19, 9, 1, 10],    // Hizb 19 Q3 - At-Tawbah 9:1
  [76, 19, 9, 19, 10],   // Hizb 19 Q4 - At-Tawbah 9:19
  [77, 20, 9, 34, 10],   // Hizb 20 Q1 - At-Tawbah 9:34
  [78, 20, 9, 46, 10],   // Hizb 20 Q2 - At-Tawbah 9:46
  [79, 20, 9, 60, 10],   // Hizb 20 Q3 - At-Tawbah 9:60
  [80, 20, 9, 75, 10],   // Hizb 20 Q4 - At-Tawbah 9:75

  // === Juz 11 (At-Tawbah 9:93 - Hud 11:5) ===
  [81, 21, 9, 93, 11],   // Hizb 21 Q1 - At-Tawbah 9:93
  [82, 21, 9, 111, 11],  // Hizb 21 Q2 - At-Tawbah 9:111
  [83, 21, 9, 122, 11],  // Hizb 21 Q3 - At-Tawbah 9:122
  [84, 21, 10, 11, 11],  // Hizb 21 Q4 - Yunus 10:11
  [85, 22, 10, 26, 11],  // Hizb 22 Q1 - Yunus 10:26
  [86, 22, 10, 53, 11],  // Hizb 22 Q2 - Yunus 10:53
  [87, 22, 10, 71, 11],  // Hizb 22 Q3 - Yunus 10:71
  [88, 22, 10, 90, 11],  // Hizb 22 Q4 - Yunus 10:90

  // === Juz 12 (Hud 11:6 - Yusuf 12:52) ===
  [89, 23, 11, 6, 12],   // Hizb 23 Q1 - Hud 11:6
  [90, 23, 11, 24, 12],  // Hizb 23 Q2 - Hud 11:24
  [91, 23, 11, 41, 12],  // Hizb 23 Q3 - Hud 11:41
  [92, 23, 11, 61, 12],  // Hizb 23 Q4 - Hud 11:61
  [93, 24, 11, 84, 12],  // Hizb 24 Q1 - Hud 11:84
  [94, 24, 11, 108, 12], // Hizb 24 Q2 - Hud 11:108
  [95, 24, 12, 7, 12],   // Hizb 24 Q3 - Yusuf 12:7
  [96, 24, 12, 30, 12],  // Hizb 24 Q4 - Yusuf 12:30

  // === Juz 13 (Yusuf 12:53 - Ibrahim 14:52) ===
  [97, 25, 12, 53, 13],  // Hizb 25 Q1 - Yusuf 12:53
  [98, 25, 12, 77, 13],  // Hizb 25 Q2 - Yusuf 12:77
  [99, 25, 12, 101, 13], // Hizb 25 Q3 - Yusuf 12:101
  [100, 25, 13, 5, 13],  // Hizb 25 Q4 - Ar-Ra'd 13:5
  [101, 26, 13, 19, 13], // Hizb 26 Q1 - Ar-Ra'd 13:19
  [102, 26, 13, 35, 13], // Hizb 26 Q2 - Ar-Ra'd 13:35
  [103, 26, 14, 10, 13], // Hizb 26 Q3 - Ibrahim 14:10
  [104, 26, 14, 28, 13], // Hizb 26 Q4 - Ibrahim 14:28

  // === Juz 14 (Al-Hijr 15:1 - An-Nahl 16:128) ===
  [105, 27, 15, 1, 14],  // Hizb 27 Q1 - Al-Hijr 15:1
  [106, 27, 15, 49, 14], // Hizb 27 Q2 - Al-Hijr 15:49
  [107, 27, 15, 85, 14], // Hizb 27 Q3 - Al-Hijr 15:85
  [108, 27, 16, 7, 14],  // Hizb 27 Q4 - An-Nahl 16:7
  [109, 28, 16, 30, 14], // Hizb 28 Q1 - An-Nahl 16:30
  [110, 28, 16, 51, 14], // Hizb 28 Q2 - An-Nahl 16:51
  [111, 28, 16, 75, 14], // Hizb 28 Q3 - An-Nahl 16:75
  [112, 28, 16, 90, 14], // Hizb 28 Q4 - An-Nahl 16:90

  // === Juz 15 (Al-Isra 17:1 - Al-Kahf 18:74) ===
  [113, 29, 17, 1, 15],  // Hizb 29 Q1 - Al-Isra 17:1
  [114, 29, 17, 23, 15], // Hizb 29 Q2 - Al-Isra 17:23
  [115, 29, 17, 50, 15], // Hizb 29 Q3 - Al-Isra 17:50
  [116, 29, 17, 70, 15], // Hizb 29 Q4 - Al-Isra 17:70
  [117, 30, 17, 99, 15], // Hizb 30 Q1 - Al-Isra 17:99
  [118, 30, 18, 17, 15], // Hizb 30 Q2 - Al-Kahf 18:17
  [119, 30, 18, 32, 15], // Hizb 30 Q3 - Al-Kahf 18:32
  [120, 30, 18, 51, 15], // Hizb 30 Q4 - Al-Kahf 18:51

  // === Juz 16 (Al-Kahf 18:75 - Ta-Ha 20:135) ===
  [121, 31, 18, 75, 16], // Hizb 31 Q1 - Al-Kahf 18:75
  [122, 31, 18, 99, 16], // Hizb 31 Q2 - Al-Kahf 18:99
  [123, 31, 19, 22, 16], // Hizb 31 Q3 - Maryam 19:22
  [124, 31, 19, 59, 16], // Hizb 31 Q4 - Maryam 19:59
  [125, 32, 19, 77, 16], // Hizb 32 Q1 - Maryam 19:77
  [126, 32, 20, 13, 16], // Hizb 32 Q2 - Ta-Ha 20:13
  [127, 32, 20, 55, 16], // Hizb 32 Q3 - Ta-Ha 20:55
  [128, 32, 20, 83, 16], // Hizb 32 Q4 - Ta-Ha 20:83

  // === Juz 17 (Al-Anbiya 21:1 - Al-Hajj 22:78) ===
  [129, 33, 21, 1, 17],  // Hizb 33 Q1 - Al-Anbiya 21:1
  [130, 33, 21, 29, 17], // Hizb 33 Q2 - Al-Anbiya 21:29
  [131, 33, 21, 51, 17], // Hizb 33 Q3 - Al-Anbiya 21:51
  [132, 33, 21, 83, 17], // Hizb 33 Q4 - Al-Anbiya 21:83
  [133, 34, 22, 1, 17],  // Hizb 34 Q1 - Al-Hajj 22:1
  [134, 34, 22, 19, 17], // Hizb 34 Q2 - Al-Hajj 22:19
  [135, 34, 22, 38, 17], // Hizb 34 Q3 - Al-Hajj 22:38
  [136, 34, 22, 60, 17], // Hizb 34 Q4 - Al-Hajj 22:60

  // === Juz 18 (Al-Mu'minun 23:1 - Al-Furqan 25:20) ===
  [137, 35, 23, 1, 18],  // Hizb 35 Q1 - Al-Mu'minun 23:1
  [138, 35, 23, 36, 18], // Hizb 35 Q2 - Al-Mu'minun 23:36
  [139, 35, 23, 75, 18], // Hizb 35 Q3 - Al-Mu'minun 23:75
  [140, 35, 23, 105, 18],// Hizb 35 Q4 - Al-Mu'minun 23:105
  [141, 36, 24, 1, 18],  // Hizb 36 Q1 - An-Nur 24:1
  [142, 36, 24, 21, 18], // Hizb 36 Q2 - An-Nur 24:21
  [143, 36, 24, 35, 18], // Hizb 36 Q3 - An-Nur 24:35
  [144, 36, 24, 53, 18], // Hizb 36 Q4 - An-Nur 24:53

  // === Juz 19 (Al-Furqan 25:21 - An-Naml 27:55) ===
  [145, 37, 25, 21, 19], // Hizb 37 Q1 - Al-Furqan 25:21
  [146, 37, 25, 53, 19], // Hizb 37 Q2 - Al-Furqan 25:53
  [147, 37, 26, 1, 19],  // Hizb 37 Q3 - Ash-Shu'ara 26:1
  [148, 37, 26, 52, 19], // Hizb 37 Q4 - Ash-Shu'ara 26:52
  [149, 38, 26, 111, 19],// Hizb 38 Q1 - Ash-Shu'ara 26:111
  [150, 38, 26, 181, 19],// Hizb 38 Q2 - Ash-Shu'ara 26:181
  [151, 38, 27, 1, 19],  // Hizb 38 Q3 - An-Naml 27:1
  [152, 38, 27, 27, 19], // Hizb 38 Q4 - An-Naml 27:27

  // === Juz 20 (An-Naml 27:56 - Al-Ankabut 29:45) ===
  [153, 39, 27, 56, 20], // Hizb 39 Q1 - An-Naml 27:56
  [154, 39, 27, 82, 20], // Hizb 39 Q2 - An-Naml 27:82
  [155, 39, 28, 12, 20], // Hizb 39 Q3 - Al-Qasas 28:12
  [156, 39, 28, 29, 20], // Hizb 39 Q4 - Al-Qasas 28:29
  [157, 40, 28, 51, 20], // Hizb 40 Q1 - Al-Qasas 28:51
  [158, 40, 28, 76, 20], // Hizb 40 Q2 - Al-Qasas 28:76
  [159, 40, 29, 1, 20],  // Hizb 40 Q3 - Al-Ankabut 29:1
  [160, 40, 29, 26, 20], // Hizb 40 Q4 - Al-Ankabut 29:26

  // === Juz 21 (Al-Ankabut 29:46 - Al-Ahzab 33:30) ===
  [161, 41, 29, 46, 21], // Hizb 41 Q1 - Al-Ankabut 29:46
  [162, 41, 30, 1, 21],  // Hizb 41 Q2 - Ar-Rum 30:1
  [163, 41, 30, 31, 21], // Hizb 41 Q3 - Ar-Rum 30:31
  [164, 41, 30, 54, 21], // Hizb 41 Q4 - Ar-Rum 30:54
  [165, 42, 31, 22, 21], // Hizb 42 Q1 - Luqman 31:22
  [166, 42, 32, 11, 21], // Hizb 42 Q2 - As-Sajdah 32:11
  [167, 42, 33, 1, 21],  // Hizb 42 Q3 - Al-Ahzab 33:1
  [168, 42, 33, 18, 21], // Hizb 42 Q4 - Al-Ahzab 33:18

  // === Juz 22 (Al-Ahzab 33:31 - Ya-Sin 36:27) ===
  [169, 43, 33, 31, 22], // Hizb 43 Q1 - Al-Ahzab 33:31
  [170, 43, 33, 51, 22], // Hizb 43 Q2 - Al-Ahzab 33:51
  [171, 43, 33, 60, 22], // Hizb 43 Q3 - Al-Ahzab 33:60
  [172, 43, 34, 10, 22], // Hizb 43 Q4 - Saba 34:10
  [173, 44, 34, 24, 22], // Hizb 44 Q1 - Saba 34:24
  [174, 44, 34, 46, 22], // Hizb 44 Q2 - Saba 34:46
  [175, 44, 35, 15, 22], // Hizb 44 Q3 - Fatir 35:15
  [176, 44, 35, 41, 22], // Hizb 44 Q4 - Fatir 35:41

  // === Juz 23 (Ya-Sin 36:28 - Az-Zumar 39:31) ===
  [177, 45, 36, 28, 23], // Hizb 45 Q1 - Ya-Sin 36:28
  [178, 45, 36, 60, 23], // Hizb 45 Q2 - Ya-Sin 36:60
  [179, 45, 37, 22, 23], // Hizb 45 Q3 - As-Saffat 37:22
  [180, 45, 37, 83, 23], // Hizb 45 Q4 - As-Saffat 37:83
  [181, 46, 37, 145, 23],// Hizb 46 Q1 - As-Saffat 37:145
  [182, 46, 38, 21, 23], // Hizb 46 Q2 - Sad 38:21
  [183, 46, 38, 52, 23], // Hizb 46 Q3 - Sad 38:52
  [184, 46, 39, 8, 23],  // Hizb 46 Q4 - Az-Zumar 39:8

  // === Juz 24 (Az-Zumar 39:32 - Fussilat 41:46) ===
  [185, 47, 39, 32, 24], // Hizb 47 Q1 - Az-Zumar 39:32
  [186, 47, 39, 53, 24], // Hizb 47 Q2 - Az-Zumar 39:53
  [187, 47, 40, 1, 24],  // Hizb 47 Q3 - Ghafir 40:1
  [188, 47, 40, 21, 24], // Hizb 47 Q4 - Ghafir 40:21
  [189, 48, 40, 41, 24], // Hizb 48 Q1 - Ghafir 40:41
  [190, 48, 40, 66, 24], // Hizb 48 Q2 - Ghafir 40:66
  [191, 48, 41, 9, 24],  // Hizb 48 Q3 - Fussilat 41:9
  [192, 48, 41, 25, 24], // Hizb 48 Q4 - Fussilat 41:25

  // === Juz 25 (Fussilat 41:47 - Al-Jathiyah 45:37) ===
  [193, 49, 41, 47, 25], // Hizb 49 Q1 - Fussilat 41:47
  [194, 49, 42, 13, 25], // Hizb 49 Q2 - Ash-Shura 42:13
  [195, 49, 42, 27, 25], // Hizb 49 Q3 - Ash-Shura 42:27
  [196, 49, 42, 51, 25], // Hizb 49 Q4 - Ash-Shura 42:51
  [197, 50, 43, 24, 25], // Hizb 50 Q1 - Az-Zukhruf 43:24
  [198, 50, 43, 57, 25], // Hizb 50 Q2 - Az-Zukhruf 43:57
  [199, 50, 44, 17, 25], // Hizb 50 Q3 - Ad-Dukhan 44:17
  [200, 50, 45, 12, 25], // Hizb 50 Q4 - Al-Jathiyah 45:12

  // === Juz 26 (Al-Ahqaf 46:1 - Adh-Dhariyat 51:30) ===
  [201, 51, 46, 1, 26],  // Hizb 51 Q1 - Al-Ahqaf 46:1
  [202, 51, 46, 21, 26], // Hizb 51 Q2 - Al-Ahqaf 46:21
  [203, 51, 47, 10, 26], // Hizb 51 Q3 - Muhammad 47:10
  [204, 51, 47, 33, 26], // Hizb 51 Q4 - Muhammad 47:33
  [205, 52, 48, 18, 26], // Hizb 52 Q1 - Al-Fath 48:18
  [206, 52, 49, 1, 26],  // Hizb 52 Q2 - Al-Hujurat 49:1
  [207, 52, 49, 14, 26], // Hizb 52 Q3 - Al-Hujurat 49:14
  [208, 52, 50, 27, 26], // Hizb 52 Q4 - Qaf 50:27

  // === Juz 27 (Adh-Dhariyat 51:31 - Al-Hadid 57:29) ===
  [209, 53, 51, 31, 27], // Hizb 53 Q1 - Adh-Dhariyat 51:31
  [210, 53, 52, 24, 27], // Hizb 53 Q2 - At-Tur 52:24
  [211, 53, 53, 26, 27], // Hizb 53 Q3 - An-Najm 53:26
  [212, 53, 54, 28, 27], // Hizb 53 Q4 - Al-Qamar 54:28
  [213, 54, 55, 1, 27],  // Hizb 54 Q1 - Ar-Rahman 55:1
  [214, 54, 56, 1, 27],  // Hizb 54 Q2 - Al-Waqi'ah 56:1
  [215, 54, 56, 75, 27], // Hizb 54 Q3 - Al-Waqi'ah 56:75
  [216, 54, 57, 16, 27], // Hizb 54 Q4 - Al-Hadid 57:16

  // === Juz 28 (Al-Mujadilah 58:1 - At-Tahrim 66:12) ===
  [217, 55, 58, 1, 28],  // Hizb 55 Q1 - Al-Mujadilah 58:1
  [218, 55, 58, 14, 28], // Hizb 55 Q2 - Al-Mujadilah 58:14
  [219, 55, 59, 11, 28], // Hizb 55 Q3 - Al-Hashr 59:11
  [220, 55, 60, 7, 28],  // Hizb 55 Q4 - Al-Mumtahanah 60:7
  [221, 56, 62, 1, 28],  // Hizb 56 Q1 - Al-Jumu'ah 62:1
  [222, 56, 63, 4, 28],  // Hizb 56 Q2 - Al-Munafiqun 63:4
  [223, 56, 65, 1, 28],  // Hizb 56 Q3 - At-Talaq 65:1
  [224, 56, 66, 1, 28],  // Hizb 56 Q4 - At-Tahrim 66:1

  // === Juz 29 (Al-Mulk 67:1 - Al-Mursalat 77:50) ===
  [225, 57, 67, 1, 29],  // Hizb 57 Q1 - Al-Mulk 67:1
  [226, 57, 68, 1, 29],  // Hizb 57 Q2 - Al-Qalam 68:1
  [227, 57, 69, 1, 29],  // Hizb 57 Q3 - Al-Haqqah 69:1
  [228, 57, 70, 19, 29], // Hizb 57 Q4 - Al-Ma'arij 70:19
  [229, 58, 72, 1, 29],  // Hizb 58 Q1 - Al-Jinn 72:1
  [230, 58, 73, 20, 29], // Hizb 58 Q2 - Al-Muzzammil 73:20
  [231, 58, 75, 1, 29],  // Hizb 58 Q3 - Al-Qiyamah 75:1
  [232, 58, 76, 19, 29], // Hizb 58 Q4 - Al-Insan 76:19

  // === Juz 30 (An-Naba 78:1 - An-Nas 114:6) ===
  [233, 59, 78, 1, 30],  // Hizb 59 Q1 - An-Naba 78:1
  [234, 59, 80, 1, 30],  // Hizb 59 Q2 - Abasa 80:1
  [235, 59, 82, 1, 30],  // Hizb 59 Q3 - Al-Infitar 82:1
  [236, 59, 84, 1, 30],  // Hizb 59 Q4 - Al-Inshiqaq 84:1
  [237, 60, 87, 1, 30],  // Hizb 60 Q1 - Al-A'la 87:1
  [238, 60, 90, 1, 30],  // Hizb 60 Q2 - Al-Balad 90:1
  [239, 60, 94, 1, 30],  // Hizb 60 Q3 - Ash-Sharh 94:1
  [240, 60, 100, 9, 30], // Hizb 60 Q4 - Al-Adiyat 100:9
];

export const HIZB_QUARTERS: HizbQuarterInfo[] = HIZB_DATA.map(
  ([quarter, hizb, startSurah, startAyah, juz]) => ({
    quarter,
    hizb,
    startSurah,
    startAyah,
    juz,
  })
);

/**
 * Get the hizb quarter info for a given quarter number (1-240).
 */
export const getHizbQuarter = (quarter: number): HizbQuarterInfo | undefined =>
  HIZB_QUARTERS.find((hq) => hq.quarter === quarter);

/**
 * Get all hizb quarters for a given juz number (1-30).
 * Returns 8 quarters per juz.
 */
export const getHizbQuartersByJuz = (juz: number): HizbQuarterInfo[] =>
  HIZB_QUARTERS.filter((hq) => hq.juz === juz);

/**
 * Get all 4 quarters for a given hizb number (1-60).
 */
export const getQuartersByHizb = (hizb: number): HizbQuarterInfo[] =>
  HIZB_QUARTERS.filter((hq) => hq.hizb === hizb);

/**
 * Find which hizb quarter a given surah:ayah falls in.
 */
export const findHizbQuarter = (
  surah: number,
  ayah: number
): HizbQuarterInfo | undefined => {
  for (let i = HIZB_QUARTERS.length - 1; i >= 0; i--) {
    const hq = HIZB_QUARTERS[i];
    if (
      surah > hq.startSurah ||
      (surah === hq.startSurah && ayah >= hq.startAyah)
    ) {
      return hq;
    }
  }
  return HIZB_QUARTERS[0];
};
