# 01 · Generelt for hele kurset

Tilbakemeldinger som ikke gjelder én bestemt side, men styrer hvordan hele kurset bør endres.
[← Til oversikten](README.md)

---

<a id="g-01"></a>
### G-01 · Kurset må ned fra ca. 40 til 15–20 minutter

- [x] Gjort
- **Hvor:** Hele kurset. Tidsangivelsen står i «Før du starter» ([kurs.js:40](../content/kurs.js#L40): «Ca. 30–40 minutter»)
- **Fra:** Saxe · lysbilde 2
- **Notat:** 130 steg ble til 37, og 19 kontrollspørsmål ble til 8. M1 er slettet (K-02), og M2 er fordelt på casene (K-03). «Før du starter» sier nå «Ca. 20 minutter». Det er et anslag: tiden må måles med en testperson.

> Avtalen var at kurset skulle ta ca. 15-20 min. Nå er det 40 min.

**Tolkning:** Dette er det overordnede målet. De fleste andre punktene (slette M1, slå sammen M2 inn i casene, slå sammen skann-steg, færre kontrollspørsmål) bidrar til det. Oppdater tidsangivelsen i «Før du starter» når kurset er kortet ned.

---

<a id="g-02"></a>
### G-02 · Færre klikk, mindre musevandring og færre «Neste»

- [x] Gjort
- **Hvor:** Alle casene. Stegvisningen i [js/app.js](../js/app.js)
- **Fra:** Saxe · lysbilde 2
- **Notat:** Ny stegtype `registrer`: hele registreringen på én side. Høyre kolonne har nummererte rader i appens rekkefølge, med QR-koden og mengden på raden der de trengs. Fortellingen står i stegkortet og i boksen øverst. «Trykk på UTTAK» er første rad, ikke en egen side.

> Må bli færre klikk og mindre musevandring i kurset. Ha case/story og skanne-kodene på samme side

> Mindre "Neste"-klikk

**Tolkning:** To grep:
1. Vis situasjonen (fortellingen) og QR-kodene på samme side, i stedet for en egen fortellingsside før skanningen starter.
2. Slå sammen steg som hver bare har én kode eller én instruks. Se også [C1-03](04-case-1-uttak.md#c1-03) og [C3-02](06-case-3-tilbakelegge.md#c3-02), der den andre fageksperten ber om det samme: produkt, mengde og pasient på én side.

---

<a id="g-03"></a>
### G-03 · Færre kontrollspørsmål om beholdning

- [x] Gjort
- **Hvor:** Kontrollspørsmålene «Hva er ny beholdning av …» i Case 1, 2, 3, 4, 6, 7 og 8
- **Fra:** Saxe · lysbilde 2
- **Notat:** Fjernet: Case 2 (avviket, se [C2-03](05-case-2-uttak-med-avvik.md#c2-03)), Case 1, Case 3 (begge), Case 4 (Dolcontin), Case 6, Case 7 og Case 8 (begge, C8-03). Spørsmålene i M1 og M2 forsvant med modulene.

> Færre kontrollspørsmål om beholdning.

**Tolkning:** I dag har nesten hvert case et spørsmål om ny beholdning. Behold kanskje ett eller to der regnestykket er poenget (for eksempel avviket i Case 2), og fjern resten. Se også [C4-01](07-case-4-apoteket.md#c4-01) og [C8-03](09-case-6-9.md#c8-03), der den andre fageksperten vil fjerne konkrete spørsmål.

---

<a id="g-04"></a>
### G-04 · Deltakeren skal bruke appen, ikke se på bilder av den

- [x] Gjort
- **Hvor:** Alle steg med skjematisk startmeny (`meny:`) eller appskjerm (`skjerm:`, `type: "appskjerm"`) i [kurs.js](../content/kurs.js)
- **Fra:** ikke navngitt · lysbilde 6 (og gjentatt på lysbilde 27, 31, 35, 56 og 71)
- **Notat:** Ingen `meny:` eller `skjerm:` utenom M0 steg 2. De skjematiske valgene og bryterne er også borte: valgene står som tekst i radene. M13 viser ikke innloggingsbildet lenger. `content/skjermer.js` er tom.

> Kurset må fokuser på at vi skal aktiv bruke appen og ikke bruke bilder. Med untakk av side 2 på "sjekk at appen er klar" .

**Tolkning:** Fjern de skjematiske startmenyene og plassholderne for appskjermer i høyre kolonne. Skriv heller hva deltakeren skal se etter på mobilen. Unntaket er M0 steg 2 «Du er i Opplæringsmodus», der bildet av startmenyen skal stå ([K-01](03-kom-i-gang-M0-M2.md#k-01)).
Konkrete steder: [C1-01](04-case-1-uttak.md#c1-01), [C1-04](04-case-1-uttak.md#c1-04), [C1-07](04-case-1-uttak.md#c1-07), [C3-01](06-case-3-tilbakelegge.md#c3-01), [C5-01](08-case-5-oversikt.md#c5-01), [C5-03](08-case-5-oversikt.md#c5-03).

Dette påvirker også registeret over skjermbilder som må tas ([content/skjermer.js](../content/skjermer.js)). Mange av dem trengs kanskje ikke lenger.

---

<a id="g-05"></a>
### G-05 · Forklar tæpping av ID-kortet bare én gang

- [x] Gjort
- **Hvor:** Alle `type: "signer"`-steg. Hjelpepanelet med iPhone/Samsung/Google Pixel vises på hvert av dem
- **Fra:** ikke navngitt · lysbilde 6 (og lysbilde 73 om Case 9)
- **Notat:** Telefonmodellene vises bare i Case 1, der deltakeren signerer første gang (`forklar: true`). Andre signeringssteg viser ID-kortet og én linje. Forklaringen ligger bak lenken «Hvor sitter leseren?» i tilfelle deltakeren tar casene i en annen rekkefølge. I registrer-stegene er signeringen én rad.

> Det holder å forklare 1 gang at man skal tappe korte.

**Tolkning:** Vis hjelpen om hvor kortet skal holdes (telefonmodellene) første gang deltakeren signerer. Senere signer-steg kan være en kort linje, for eksempel «Tæpp ID-kortet for å signere», uten panelet. Se også [C9-01](09-case-6-9.md#c9-01).

---

<a id="g-06"></a>
### G-06 · Kurset må fungere godt på PC først

- [x] Gjort
- **Hvor:** Layout og skalering i [css/app.css](../css/app.css)
- **Fra:** Saxe · lysbilde 2
- **Notat:** Ingen regler for smal skjerm lekket inn i PC-visningen, men avstandene var for romslige for en 16"-skjerm. Ny kompakt visning når skjermen er 900 px høy eller lavere, med et ekstra trinn for 14" (1366 × 768). Registrer-steg har like brede kolonner, og QR-kodene skaleres med høyden. Alle 37 steg er målt uten å rulle i 1366 × 608, 1280 × 650, 1536 × 730 og 1920 × 940 (visningsflate). Hovedmenyen ruller fortsatt, se H-04.

> Jeg tror de fleste i HSØ kommer til å gjøre kurset fra PC via Læringsportalen.

> Har skjermskalering for mobil gått ut over PC-tilpasning? Vertikalt vs horisontal orientering...

**Tolkning:** Prioriter liggende PC-skjerm (16" bærbar og 24" skjerm) foran mobil og nettbrett. Sjekk at ikke tilpasningene for smal skjerm gjør PC-visningen høyere enn nødvendig. Henger sammen med [H-04](02-oppstart-og-hovedmeny.md#h-04) om hovedmenyen uten skrolling.
