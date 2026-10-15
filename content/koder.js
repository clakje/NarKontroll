/*
 * QR-register for NarKontroll-opplæringen (felles for konsept A, B og C).
 *
 * Alt her er DUMMY-innhold. Når apputvikleren leverer de ekte kodene,
 * byttes bare `payload`. ID, navn og layout røres ikke.
 *
 * type: "lager" | "produkt" | "pasient" | "idkort"
 * ID-kort signeres med NFC (tæppes mot telefonen) og har derfor ingen QR.
 */
window.KODER = {
  // Lager og underlager
  "LAGER-01":      { type: "lager",   navn: "TEST Medisinrom 1",               payload: "NKDUMMY:LAGER:TEST-MEDISINROM-1" },
  "LAGER-02":      { type: "lager",   navn: "TEST Medisinrom 2 (nabopost)",    payload: "NKDUMMY:LAGER:TEST-MEDISINROM-2" },
  "UNDERLAGER-01": { type: "lager",   navn: "TEST Medisintralle",              payload: "NKDUMMY:UNDERLAGER:TEST-MEDISINTRALLE" },

  // Pasienter (fiktive). Ekte test-ID-er avklares med apputvikler.
  "PAS-01": { type: "pasient", navn: "Line Danser",   payload: "NKDUMMY:PAS:LINE-DANSER" },
  "PAS-02": { type: "pasient", navn: "Finn Dottno",   payload: "NKDUMMY:PAS:FINN-DOTTNO" },
  "PAS-03": { type: "pasient", navn: "Gry Telokk",    payload: "NKDUMMY:PAS:GRY-TELOKK" },
  "PAS-04": { type: "pasient", navn: "Harry Händel",  payload: "NKDUMMY:PAS:HARRY-HANDEL" },

  // Legemidler. A/B-klassifiseringen må verifiseres av farmasøyt.
  "PROD-OXYNORM-5":     { type: "produkt", navn: "Oxynorm kaps 5 mg",                          ab: "A", enhet: "stk", payload: "NKDUMMY:PROD:OXYNORM-KAPS-5MG" },
  "PROD-SOBRIL-10":     { type: "produkt", navn: "Sobril tab 10 mg",                           ab: "B", enhet: "stk", payload: "NKDUMMY:PROD:SOBRIL-TAB-10MG" },
  "PROD-FENTANYL-50":   { type: "produkt", navn: "Fentanyl depotplaster 50 mikrog/time",       ab: "A", enhet: "stk", payload: "NKDUMMY:PROD:FENTANYL-PLASTER-50" },
  "PROD-SOBRIL-15":     { type: "produkt", navn: "Sobril tab 15 mg",                           ab: "B", enhet: "stk", payload: "NKDUMMY:PROD:SOBRIL-TAB-15MG" },
  "PROD-COSYLAN":       { type: "produkt", navn: "Cosylan mikst 1,7 mg/ml, 180 ml",            ab: "B", enhet: "ml",  payload: "NKDUMMY:PROD:COSYLAN-MIKST-180ML" },
  "PROD-OXYCODONE-INJ": { type: "produkt", navn: "Oxycodone Hameln inj 10 mg/ml, 2 ml",        ab: "A", enhet: "stk", payload: "NKDUMMY:PROD:OXYCODONE-HAMELN-INJ-2ML" },
  "PROD-METADON-MIKST": { type: "produkt", navn: "Metadon Nordic Drugs mikst 80 mg/flaske",    ab: "A", enhet: "[AVKLARES: unntak?]", payload: "NKDUMMY:PROD:METADON-MIKST-80MG" },
  "PROD-DOLCONTIN-100": { type: "produkt", navn: "Dolcontin depottab 100 mg",                  ab: "A", enhet: "stk", payload: "NKDUMMY:PROD:DOLCONTIN-DEPOTTAB-100MG" },

  // ID-kort (NFC, ingen QR)
  "IDKORT-01": { type: "idkort", navn: "Deg",           rolle: "Bruker 1" },
  "IDKORT-02": { type: "idkort", navn: "Kari Kontroll", rolle: "Kollega (dummy)" }
};
