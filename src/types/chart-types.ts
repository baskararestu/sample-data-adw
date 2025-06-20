// src/types/chart-types.ts

export type TransformedChartData = {
  date: string; // Akan berisi label minggu, misal "25-05 s.d. 01-06"
  [picKey: string]: number | string; // Kunci PIC yang disanitasi dan durasinya
};

// Anda juga bisa memindahkan tipe lain yang dipakai di banyak tempat ke sini, contoh:
export type ChartRow = {
  week: string; // Misal: "2025-06-10_to_2025-06-16"
  [picKey: string]: number | string; // Kunci dinamis untuk PIC dan durasinya
};

// type ComplaintEntry = { ... }; // Jika Anda ingin ComplaintEntry juga global
