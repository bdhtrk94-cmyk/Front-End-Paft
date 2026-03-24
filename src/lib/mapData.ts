export interface PaftCountry {
    name: string;
    nameAr: string;
    coords: [number, number];
    type: 'headquarters' | 'regional-office' | 'office';
    region: string;
}

export const paftCountries: PaftCountry[] = [
    // Headquarters
    { name: 'Egypt', nameAr: 'مصر', coords: [26.8206, 30.8025], type: 'headquarters', region: 'Middle East & Africa' },

    // Regional Offices
    { name: 'United States', nameAr: 'الولايات المتحدة', coords: [37.0902, -95.7129], type: 'regional-office', region: 'North America' },
    { name: 'Dubai', nameAr: 'دبي', coords: [25.2048, 55.2708], type: 'regional-office', region: 'Middle East & Africa' },

    // Offices
    { name: 'Morocco', nameAr: 'المغرب', coords: [31.7917, -7.0926], type: 'office', region: 'Middle East & Africa' },
    { name: 'Sudan', nameAr: 'السودان', coords: [12.8628, 30.2176], type: 'office', region: 'Middle East & Africa' },
    { name: 'Syria', nameAr: 'سوريا', coords: [34.8021, 38.9968], type: 'office', region: 'Middle East & Africa' },
    { name: 'Kenya', nameAr: 'كينيا', coords: [-0.0236, 37.9062], type: 'office', region: 'Middle East & Africa' },
    { name: 'Saudi Arabia', nameAr: 'السعودية', coords: [23.8859, 45.0792], type: 'office', region: 'Middle East & Africa' },
    { name: 'Libya', nameAr: 'ليبيا', coords: [26.3351, 17.2283], type: 'office', region: 'Middle East & Africa' },
    { name: 'Jordan', nameAr: 'الأردن', coords: [30.5852, 36.2384], type: 'office', region: 'Middle East & Africa' },
    { name: 'Algeria', nameAr: 'الجزائر', coords: [28.0339, 1.6596], type: 'office', region: 'Middle East & Africa' },
    { name: 'Lebanon', nameAr: 'لبنان', coords: [33.8547, 35.8623], type: 'office', region: 'Middle East & Africa' },
    { name: 'Ghana', nameAr: 'غانا', coords: [7.9465, -1.0232], type: 'office', region: 'Middle East & Africa' },
    { name: 'Nigeria', nameAr: 'نيجيريا', coords: [9.082, 8.6753], type: 'office', region: 'Middle East & Africa' },
];

export const REGIONS = [...new Set(paftCountries.map((c) => c.region))];
export const TOTAL_COUNTRIES = paftCountries.length;
export const TOTAL_REGIONS = REGIONS.length;
