# NarKontroll opplæring · Konsept A «Veileder ved siden av»

Et guidet kurs på PC mens deltakeren bruker den ekte NarKontroll-appen på mobilen.
Kurset viser oppgaven til venstre. Til høyre, i «skannesonen», står det deltakeren skal gjøre
i appen, med kodene som skal skannes. Se `Losningsforslag.md` del 4 for idé og avgrensning.

> Alt faginnhold, alle koder og all beholdning er **dummy**. Tekst merket
> `[AVKLARES: …]` vises som gul merkelapp i kurset.

## Kom i gang

| Hva | Hvordan |
|---|---|
| Åpne kurset | Dobbeltklikk `index.html`. Kurset går i lokal testmodus og lagrer fremdriften i nettleseren |
| Utviklermodus | `index.html?dev=1`, eller <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>D</kbd>. Et klikk på en QR-kode tolkes som «skannet», og et klikk på ID-kortet som «tæppet». Panelet nede til venstre lar deg hoppe mellom moduler, nullstille fremdriften og se registrene over skjermbilder, AVKLARES-punkter og koder |
| Slå av utviklermodus | `index.html?dev=0` |
| Introfilm | Spilles når kurset åpnes, og går rett over i hovedmenyen. `?intro=0` hopper over, `?intro=1` viser den også i utviklermodus |
| Gå rett til et steg | `index.html#case-1/3` (modul-ID / stegnummer). `index.html#meny` åpner hovedmenyen |
| Lag SCORM-pakken | `python scripts/pakk-scorm.py` gir `dist/NarKontroll-KonseptA-scorm12.zip` |

## Filer

```
index.html            startfil, ikonsett og logomerke (inline SVG)
imsmanifest.xml       SCORM 1.2. Fillisten oppdateres av pakkeskriptet
css/app.css           tokens (lys og mørk), layout, skannesone, utskrift
js/scorm.js           felles SCORM 1.2-wrapper med lokal testmodus
js/app.js             konseptets logikk
js/vendor/qrcode.js   QR-generator (Kazuhiko Arase, MIT), lagt lokalt
content/kurs.js       moduler og steg (felles innholdsmodell)
content/koder.js      QR-register. Bytt bare `payload` når de ekte kodene kommer
content/skjermer.js   register over skjermbilder. Tomt: kurset viser ikke bilder av appen (G-04)
assets/               logo, skjermbilder og introfilm (video/introfilm.mp4)
scripts/pakk-scorm.py lager zip-filen
```

## Innhold i denne versjonen

Kurset er kortet ned etter tilbakemeldingene fra fagekspertene (se `Tilbakemeldinger/`), fra 130 til 34 steg.
Målet er 15–20 minutter. M0 sier nå ca. 20 minutter. Det må måles med en testperson.

- Infoboksen «Før du starter» er borte. Kurset går rett fra introfilmen til hovedmenyen, og stegene
  (start appen, Opplæringsmodus, kamera, lagerkoden) er første steg i M0 «Sjekk at appen er klar».
  M0 har bare dette ene steget. Det tidligere steg 2 «Du er i Opplæringsmodus» (med bildet av startmenyen)
  er nå punkt 5 i steget.
- M1 «Bli kjent med startmenyen» er slettet. Deltakeren lærer knappene ved å bruke dem i casene.
- M2 «Signering og dobbeltkontroll» er ikke lenger egen modul. Innholdet står i Case 1 (når dobbeltkontroll
  kreves, og å utsette), Case 2 (avvik, bruker 2, tæpp to ganger) og Case 5 (ikke overlat det til neste skift).
- Hver registrering står på én side (stegtypen `registrer`): det deltakeren gjør i appen, i appens rekkefølge,
  med QR-kodene og mengden på samme side.
- Kurset viser ingen bilder av appen, bortsett fra den skjematiske startmenyen i M0 steg 2.
- Hvor NFC-leseren sitter på telefonen, forklares første gang deltakeren signerer (Case 1). Senere ligger
  forklaringen bak lenken «Hvor sitter leseren?».
- Case 2 er ett uttak av Oxynorm, der deltakeren teller og oppdager at det mangler én (avvik).
- 7 kontrollspørsmål. Ingen spør om ny beholdning: deltakeren sammenligner beholdningen i appen med det de teller.

M0 og Case 1–4 bygger på manus. Selve oppstarten (manus «AAA Intro») står i M0 steg 1.
Case 5–9 er skrevet om fra «Case 5 – IKKE FERDIG» og er merket **Utkast, ikke faglig godkjent**.

## SCORM

- `lesson_status` er `incomplete` til alle modulene er fullført, og blir da `completed`.
- `score.raw` er andelen kontrollspørsmål som er besvart riktig på første forsøk (0–100).
  Den settes først når deltakeren har svart på minst ett spørsmål.
- `suspend_data` er kompakt JSON (ca. 450 tegn når hele kurset er gjennomført, grensen er 4096).
- `lesson_location` er `<modul-id>:<steg>`. Kurset fortsetter der deltakeren slapp.
- Manifestet har ingen `masteryscore`, fordi kravet til bestått ikke er avklart.

Test i SCORM Cloud før opplasting til sykehusets LMS.

## Design

Designet er laget med skillen `apple-design` (HIG som grunnlag, WCAG 2.1 AA som krav).

- **Oppgaven på hver skjerm:** si hva deltakeren skal gjøre nå, og vise det som skal skannes.
  Venstre kolonne har stegkortet. Høyre kolonne viser bare det steget trenger. På et registrer-steg er det
  hele registreringen som nummererte rader, og da er kolonnene like brede.
- **PC først:** de fleste tar kurset på PC. På lave skjermer (16" bærbar, 650–900 px høyde) strammes
  avstandene, og QR-kodene i et registrer-steg skaleres med høyden (120–168 px), så steget får plass uten
  å rulle. Testet i 1280 × 650, 1536 × 730 og 1920 × 940.
- **Navigasjon:** kurset åpner i **hovedmenyen**. Hele menyen får plass på én skjerm uten å rulle
  (testet i 1280 × 650, 1366 × 600 og 1920 × 950). Øverst står en kort tittel og ingressen på én linje.
  Modulene står som lave kort (merkelapp, status og tittel) i tre åpne grupper: Kom i gang, Caser og Til slutt.
  Fra 1000 px bredde står gruppenavnet til venstre for kortene. Casekortene har appknappens farge øverst,
  og anbefalt neste modul har ramme. Nederst er en smal fremdriftslinje med én knapp videre
  («Start kurset», «Fortsett: …» eller «Neste: …»). Etter hver modul kommer deltakeren tilbake til hovedmenyen.
  Knappen «Hovedmeny» står alltid i toppfeltet, og på første steg i en modul. Rekkefølgen og gruppene står i
  `KURS.grupper` i `kurs.js`.
- **Signaturelementet** er skannesonen: en rolig mintflate med QR-kodene, som kamerarammen i appen.
  Resten av siden er stille.
- **Farger** fra logoen: teal `#186F7B` (5,8:1 på hvitt) og mint `#79E3E0` (flater og markering).
  Appens knappefarger er merkefarger, og der hvit tekst ga for lav kontrast, er de mørknet:
  APOTEKET `#1388FF` → `#0A6FD6` (4,9:1), KASSERE/LÅN `#FF383D` → `#D42A2F` (5,0:1),
  OVERFØRE `#AE7F60` → `#8A5E40` (5,6:1). Knappens navn står alltid ved siden av fargen.
- **Lys og mørk modus** følger systeminnstillingen. Kurset har ingen egen bryter (HIG `dark-mode.md`).
  QR-kodene ligger alltid på hvitt, slik at de kan skannes.
- **Tilgjengelighet:** systemfont, 17 px brødtekst, trykkflater på minst 44 × 44 px, synlig fokus,
  «Hopp til steget», fokus flyttes til nytt steg, og endringer leses opp. Piltastene blar.
  Kurset tar hensyn til redusert bevegelse, redusert gjennomsiktighet og Windows' høykontrastmodus.
- **Introfilm:** `assets/video/introfilm.mp4` (4 s, uten lyd, H.264 Main med «faststart», så den kan starte
  før hele filen er lastet) spilles over hovedmenyen hver gang kurset åpnes. Etterpå kommer hovedmenyen.
  Den har lys flate også i mørk modus, slik som filmen. «Hopp over», <kbd>Esc</kbd> eller klikk ved
  siden av filmen lukker den, og fokus går til hovedmenyen. Står filmen stille i 3 sekunder (starter ikke,
  eller henger på første bilde, slik den gjorde i Arbeidsflate), lukkes den. Filmen vises også når Windows
  har slått av animasjoner (redusert bevegelse), fordi fagekspertene vil ha den på PC. Den vises ikke i
  utviklermodus.
- **Smal skjerm:** én kolonne, og kurset forklarer at det gjøres best på PC, med knapp til QR-arket.
- **QR-ark (case-ark):** knappen «QR-ark» skriver ut ett A4-ark per modul med koder, satt opp som en tegneserie
  for dem som gjør kurset sammen. Øverst står situasjonen med appknappen i appens farge. Deretter kommer hvert steg
  i en egen rute («Steg 1», «Steg 2» …), tre i bredden. Rutene har QR-koden, mengden eller en enkel tegning
  (appknappen, ID-kortet eller telefonen). Kontrollspørsmålene blir ruter med «Snakk sammen» og avkrysningsbokser,
  og fasiten står opp ned nederst på arket. Den siste ruta i en ufullstendig rad strekkes ut, med bildet til venstre.
  Alt hentes fra `kurs.js` (`arkHtml()` i `app.js`). Case 1–5 og 8 fyller to sider.

## Åpne punkter som påvirker dette konseptet

- Beholdningen i appens Opplæringsmodus må stemme med kurset, og vi må vite når den nullstilles.
- De ekte QR-kodene (`koder.js`) fra apputvikler, også lagerkoden `LAGER-01` i M0.
- Hele listen finner du i utviklermodus under **AVKLARES**.
