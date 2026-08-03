/** Ambulance / general emergency numbers by ISO country code. */

export const DEFAULT_EMERGENCY = {
  number: "112",
  label: "112",
};

/** @type {Record<string, { number: string, label: string }>} */
export const EMERGENCY_BY_COUNTRY = {
  // Americas
  US: { number: "911", label: "911" },
  CA: { number: "911", label: "911" },
  MX: { number: "911", label: "911" },
  BR: { number: "192", label: "192" },
  AR: { number: "107", label: "107" },
  CL: { number: "131", label: "131" },
  CO: { number: "123", label: "123" },
  PE: { number: "106", label: "106" },

  // Europe (112 works EU-wide; local numbers listed where commonly used)
  GB: { number: "999", label: "999" },
  IE: { number: "112", label: "112" },
  DE: { number: "112", label: "112" },
  FR: { number: "112", label: "112" },
  ES: { number: "112", label: "112" },
  IT: { number: "112", label: "112" },
  PT: { number: "112", label: "112" },
  NL: { number: "112", label: "112" },
  BE: { number: "112", label: "112" },
  AT: { number: "112", label: "112" },
  CH: { number: "144", label: "144" },
  SE: { number: "112", label: "112" },
  NO: { number: "113", label: "113" },
  DK: { number: "112", label: "112" },
  FI: { number: "112", label: "112" },
  PL: { number: "112", label: "112" },
  CZ: { number: "112", label: "112" },
  RO: { number: "112", label: "112" },
  GR: { number: "112", label: "112" },
  UA: { number: "103", label: "103" },
  RU: { number: "103", label: "103" },
  TR: { number: "112", label: "112" },

  // Middle East & Africa
  AE: { number: "998", label: "998" },
  SA: { number: "997", label: "997" },
  IL: { number: "101", label: "101" },
  EG: { number: "123", label: "123" },
  ZA: { number: "10177", label: "10177" },
  NG: { number: "112", label: "112" },
  KE: { number: "999", label: "999" },

  // South Asia
  IN: { number: "112", label: "112" },
  PK: { number: "115", label: "115" },
  BD: { number: "999", label: "999" },
  LK: { number: "110", label: "110" },
  NP: { number: "102", label: "102" },

  // East & Southeast Asia
  CN: { number: "120", label: "120" },
  HK: { number: "999", label: "999" },
  TW: { number: "119", label: "119" },
  JP: { number: "119", label: "119" },
  KR: { number: "119", label: "119" },
  SG: { number: "995", label: "995" },
  MY: { number: "999", label: "999" },
  TH: { number: "1669", label: "1669" },
  VN: { number: "115", label: "115" },
  ID: { number: "118", label: "118" },
  PH: { number: "911", label: "911" },

  // Oceania
  AU: { number: "000", label: "000" },
  NZ: { number: "111", label: "111" },
};

export function getEmergencyForCountry(countryCode) {
  if (!countryCode || countryCode === "XX") {
    return { ...DEFAULT_EMERGENCY, countryCode: null };
  }

  const code = countryCode.toUpperCase();
  const entry = EMERGENCY_BY_COUNTRY[code] ?? DEFAULT_EMERGENCY;

  return {
    ...entry,
    countryCode: code,
  };
}
