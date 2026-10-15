# NarKontroll opplæring – plan for tre løsningsforslag

**Status:** Utkast til planlegging, 29.09.2026
**Mål:** Tre ulike designkonsepter for et opplæringskurs i NarKontroll. Konseptene lages som tre separate prosjekter, og det beste (eller en kombinasjon) velges til videre utvikling.

> Alt faginnhold, alle koder, testdata og all beholdning i dette dokumentet er **dummy-innhold** laget for å kunne produsere løsningsforslagene. Riktig innhold kommer senere.

---

## 0. Slik brukes dokumentet

- **Del 1–3 er felles** og gjelder alle tre prosjektene. Kopier dem inn i hvert prosjekt.
- **Del 4, 5 og 6** beskriver hvert sitt konsept, og hver av dem blir ett prosjekt.
- **Del 7** brukes når konseptene skal sammenlignes.
- **Del 8** samler beslutningene som tas senere.

Når alle tre bygger på samme innhold og samme datamodell, sammenligner vi selve løsningen og ikke tilfeldige forskjeller i innholdet. Da kan det valgte konseptet også få det ferdige innholdet uten omskriving.

---

## 1. Bakgrunn

Sykehuset Østfold har laget appen **NarKontroll**, en elektronisk løsning for regnskap og kontroll med A- og B-preparater. Brukeren velger en registreringstype i startmenyen og skanner QR-koder for lager, legemiddel og pasient. Med ID-kortet signerer brukeren ved å tæppe det mot telefonen (NFC).

Appen har en **Opplæringsmodus**:
- Den krever ingen innlogging.
- Registreringene er fiktive og lagres ikke permanent.
- Én person kan signere begge signaturene i en dobbeltkontroll med samme ID-kort.

Kurset skal la ansatte øve på funksjonene og på arbeidsflyten i et trygt miljø.

**Startmenyen i appen** (fra skjermbildet i `Narkontroll_logo_bilde.png`):

| Knapp | Farge | Betydning |
|---|---|---|
| UTTAK til pasient | Grå | Pasientknyttet |
| TILBAKELEGGE fra pasient | Grå | Pasientknyttet |
| OVERFØRE til eget underlager | Brun | Intern flytting |
| TILBAKEFØRE fra eget underlager | Brun (deaktivert på skjermbildet) | Intern flytting |
| Mottak fra / Retur til APOTEKET | Blå | Apotek |
| KASSERE små rester lokalt | Rød | Krever to signaturer som ikke kan utsettes |
| LÅN til/fra annen enhet | Rød | Krever to signaturer som ikke kan utsettes |
| KONTROLL av beholdning | Gul | Telling og holdbarhet |
| OVERSIKT (Dobbeltkontroll, Avvik, Siste) | Grønn | Oppgavevarsel (rød badge) og logg |

---

## 2. Felles rammer for alle tre prosjektene

### 2.1 Teknisk: HTML pakket som SCORM

| Tema | Føring |
|---|---|
| Leveranse | Statisk HTML/CSS/JS pakket som SCORM-zip |
| SCORM-versjon | **SCORM 1.2** som utgangspunkt fordi den har bredest støtte. Bytt til 2004 (4th ed.) hvis LMS-et krever det. *Avklares med LMS-ansvarlig.* |
| Pakken | `imsmanifest.xml` i roten, `index.html` som startfil, relative stier |
| Eksterne ressurser | **Ingen.** Alle skript, fonter, ikoner og bilder ligger i pakken (ingen CDN), fordi LMS-er ofte kjører innholdet i en iframe med strenge regler |
| Innholdsdata | Legges som JS-fil (`content/kurs.js`, `window.KURS = {...}`), ikke som JSON hentet med `fetch`. Da virker kurset både i LMS og når `index.html` åpnes lokalt |
| SCORM-lag | Én liten felles wrapper som finner LMS-API-et i parent-vinduer. Uten LMS går den i **lokal testmodus**: logger til konsollen og lagrer i `localStorage` |
| Data til LMS | `lesson_status` (incomplete/completed, eventuelt passed/failed), `lesson_location` (bokmerke), `suspend_data` (fremdrift, maks 4096 tegn i 1.2, så formatet må være kompakt), `session_time`, og `score.raw` der konseptet måler |
| Testing | SCORM Cloud (gratis testkonto) før opplasting til sykehusets LMS |
| Nettlesere | Edge og Chrome på sykehus-PC, Safari på iPhone |
| Tilgjengelighet | WCAG 2.1 AA (uu-krav i offentlig sektor): tastaturnavigasjon, synlig fokus, kontrast, alt-tekst, og **aldri farge alene**. Når kurset forklarer knappefargene, må knappens navn også stå der |

**Forslag til mappestruktur (lik i alle tre prosjektene):**

```
/
├─ index.html
├─ imsmanifest.xml
├─ css/
├─ js/
│  ├─ scorm.js          ← felles SCORM-wrapper
│  ├─ app.js            ← konseptets logikk
│  └─ vendor/qrcode.js  ← QR-generator, lagt lokalt i pakken
├─ content/
│  ├─ kurs.js           ← moduler og steg (felles innhold)
│  └─ koder.js          ← QR-register (felles)
├─ assets/
│  ├─ skjermbilder/     ← plassholdere nå, ekte bilder senere
│  └─ illustrasjoner/
└─ scripts/pakk-scorm   ← lager zip-filen
```

### 2.2 QR-plassholdere og utviklermodus

- Alle koder ligger i **ett register** (`koder.js`) med ID, type, visningsnavn og innhold (payload). Når apputvikleren leverer de ekte kodene, byttes bare payload. Layouten røres ikke.
- **Plassholderne er ekte QR-koder med dummy-innhold**, for eksempel `NKDUMMY:PROD:OXYNORM-KAPS-5MG`. Da kan vi teste størrelse og skanning tidlig. Under hver kode står ID og navn, og koden har merket **DUMMY**.
- **Størrelse:** Minst ca. 3,5 × 3,5 cm på skjerm. Manuset sier at beste skanneavstand er ca. 20 cm.
- **Klikkbare koder i utviklermodus:** `index.html?dev=1` (eller en hurtigtast) slår på utviklermodus. Et klikk på en QR-kode tolkes da som «skannet», og kurset går til neste steg. Et lite dev-panel viser gjeldende modul og steg, lar deg hoppe mellom moduler og nullstille fremdriften.
- De ekte appkodene vil ikke kjenne igjen dummy-kodene. Frem til de ekte kodene finnes, testes flyten derfor med klikk.

### 2.3 Plassholdere for skjermbilder og manglende innhold

- **Skjermbilder** vises som en grå mobilramme med ID og beskrivelse, for eksempel `SKJERM uttak-oppsummering: Oppsummering av uttak før signering`. Alle ID-ene samles i et register, slik at det blir en liste over skjermbildene som må tas.
- **Manglende fagtekst** markeres synlig i grensesnittet med en gul merkelapp: `[AVKLARES: …]`. Da er det lett å se hva som gjenstår når prototypene vises frem.

### 2.4 Felles innholdsmodell

Kurset er en liste med moduler, og hver modul er en liste med steg. Konseptene presenterer stegene ulikt, men leser de samme dataene.

```js
window.KURS = {
  tittel: "NarKontroll – opplæring",
  versjon: "0.1-dummy",
  moduler: [
    {
      id: "case-1",
      tittel: "UTTAK til pasient",
      knapp: "uttak",                  // kobler til startmeny-knapp og farge
      kortTekst: "Line Danser har smerter …",
      steg: [
        { type: "fortelling", tekst: "…" },
        { type: "instruks",   tekst: "Trykk på UTTAK til pasient." },
        { type: "skann",      kode: "PROD-OXYNORM-5" },
        { type: "mengde",     verdi: 1, enhet: "stk" },
        { type: "skann",      kode: "PAS-01" },
        { type: "appskjerm",  skjerm: "uttak-oppsummering" },
        { type: "signer",     idkort: "IDKORT-01" },
        { type: "valg",       tekst: "Utsett kontrollsignering" },
        { type: "sporsmal",   tekst: "Hva er ny beholdning?", alternativer: ["18", "19", "20"], fasit: "19" },
        { type: "obs",        tekst: "…" }
      ]
    }
  ]
};
```

**Stegtyper:** `fortelling`, `instruks`, `skann`, `mengde`, `appskjerm`, `signer`, `valg`, `sporsmal`, `obs`, `info`.
Konsept B utvider modellen med en beskrivelse av skjermflyten i appen (se del 5).

### 2.5 Visuell basis

Fargene er hentet fra logoen og fra appens startmeny (omtrentlige verdier):

| Token | Verdi | Bruk |
|---|---|---|
| `--nk-teal` | `#186F7B` | Logo, overskrifter, primærfarge |
| `--nk-mint` | `#79E3E0` | Logofyll, flater og markering |
| `--nk-uttak` | `#575458` | Grå knapper (Uttak, Tilbakelegge) |
| `--nk-overfore` | `#AE7F60` | Brune knapper |
| `--nk-apotek` | `#1388FF` | Blå knapp |
| `--nk-rod` | `#FF383D` | Røde knapper (Kassere, Lån) |
| `--nk-kontroll` | `#EEF013` | Gul knapp (krever mørk tekst) |
| `--nk-oversikt` | `#2A7C29` | Grønn knapp |
| `--nk-varsel` | `#FE0211` | Oppgavebadge |

- **Kontrast:** Knappefargene fra appen skal gjenkjennes, men de gir ikke alltid nok kontrast til tekst. Blå `#1388FF` med hvit tekst ligger under 4,5:1. Bruk fargene som merkefarger og kanter, og mørkne dem for tekst.
- **Typografi:** Systemfont (`system-ui, -apple-system, "Segoe UI", sans-serif`). Den krever ingen fontfiler og ligner appens iOS-uttrykk. En egen font må i så fall legges i pakken.
- **Ikoner:** Inline SVG i pakken.
- **Design-review:** Prosjektet har skillen `apple-design` i `.claude/skills/`. Bruk den til å gjennomgå prototypene, særlig konsept B, som etterligner en iOS-app.

### 2.6 Ordliste (skrivemåte i alle konsepter)

- **NarKontroll**, med stor K.
- **Opplæringsmodus**, ikke «opplæringsmodul».
- Knappenavnene skrives med store bokstaver slik de står i appen: UTTAK, TILBAKELEGGE, OVERFØRE, TILBAKEFØRE, APOTEKET, KASSERE, LÅN, KONTROLL, OVERSIKT.
- **Dobbeltkontroll** og **dobbeltsignering** brukes konsekvent. «Kontrollsignering» brukes bare der appen selv bruker ordet.
- **Tæppe ID-kortet** mot baksiden av telefonen. Hvor NFC-leseren sitter, varierer: iPhone øverst ved kameraet, Samsung Galaxy midt på, Google Pixel under kamerastripen.

---

## 3. Felles kursinnhold (dummy)

### 3.1 Kursstruktur

| # | Modul | Kilde i manus | Status |
|---|---|---|---|
| M0 | Velkommen og forberedelser: installere appen, starte Opplæringsmodus, tillate kamera, angi lager | AAA Intro | Tekst finnes |
| M1 | Bli kjent med startmenyen: knappene og fargene | Må ha med | Tekst finnes |
| M2 | Signering og dobbeltkontroll: reglene | Case 5 (første del) | Tekst finnes |
| M3 | **Case 1:** UTTAK til pasient | Case 1 + Må ha med (mengde) | Tekst finnes |
| M4 | **Case 2:** UTTAK med avvik | Case 2 | Tekst finnes |
| M5 | **Case 3:** TILBAKELEGGE, fra pasient og fra ukjent pasient | Case 3 | Tekst finnes |
| M6 | **Case 4:** APOTEKET, mottak og retur | Case 4 | Tekst finnes |
| M7 | **Case 5:** OVERSIKT og ettersignering | Case 5 (kap. 4) | Omskrevet til case (dummy) |
| M8 | **Case 6:** OVERFØRE til underlager | – | **Ny, dummy** |
| M9 | **Case 7:** KASSERE små rester | Case 5 (kap. 7) | Omskrevet til case (dummy) |
| M10 | **Case 8:** LÅN til annen enhet | Case 5 (kap. 8) | Omskrevet til case (dummy) |
| M11 | **Case 9:** KONTROLL av beholdning | Case 5 (kap. 9) | Omskrevet til case (dummy) |
| M12 | Gode råd: skanning, heng i appen, nødrutine på papir | Må ha med (outro) | Tekst finnes |
| M13 | Avslutning: logg inn med ekte bruker | Outro | Tekst finnes |

### 3.2 Testdata

**Lager og underlager**

| Kode-ID | Navn | Brukes i |
|---|---|---|
| `LAGER-01` | TEST Medisinrom 1 | M0 og alle caser |
| `LAGER-02` | TEST Medisinrom 2 (nabopost) | Case 8, Lån |
| `UNDERLAGER-01` | TEST Medisintralle | Case 6, Overføre |

**Pasienter.** Fiktive testpasienter fra manus. De ekte test-ID-ene står i «Må ha med»-dokumentet og skal avklares med apputvikler.

| Kode-ID | Navn | Brukes i |
|---|---|---|
| `PAS-01` | Line Danser | Case 1, 2 |
| `PAS-02` | Finn Dottno | Case 3 |
| `PAS-03` | Gry Telokk | Reserve |
| `PAS-04` | Harry Händel | Reserve |
| – | «Ukjent pasient» | Valg i appen, ikke en kode (Case 3) |

**ID-kort** (vises som kort man klikker eller «tæpper»)

| ID | Navn |
|---|---|
| `IDKORT-01` | Deg |
| `IDKORT-02` | Kollega (dummy: «Kari Kontroll»). I Opplæringsmodus kan IDKORT-01 brukes til begge signaturene |

**Legemidler og dummy-beholdning.** A/B-klassifiseringen er min antakelse og **må verifiseres**, fordi den styrer kravene til dobbeltkontroll.

| Kode-ID | Legemiddel | A/B | Enhet | Startbeholdning | Etter kurset |
|---|---|---|---|---|---|
| `PROD-OXYNORM-5` | Oxynorm kaps 5 mg | A | stk | 20 | 14 |
| `PROD-SOBRIL-10` | Sobril tab 10 mg | B | stk | 30 (faktisk 29) | 28,5 |
| `PROD-FENTANYL-50` | Fentanyl depotplaster 50 mikrog/time | A | stk | 10 | 10 |
| `PROD-SOBRIL-15` | Sobril tab 15 mg | B | stk | 0 | 50 |
| `PROD-COSYLAN` | Cosylan mikst 1,7 mg/ml, 180 ml | B | ml | 0 | 180 |
| `PROD-OXYCODONE-INJ` | Oxycodone Hameln inj 10 mg/ml, 2 ml | A | stk | 0 | 18 |
| `PROD-METADON-MIKST` | Metadon Nordic Drugs mikst 80 mg/flaske | A | `[AVKLARES: unntak?]` | 0 | 2 |
| `PROD-DOLCONTIN-100` | Dolcontin depottab 100 mg | A | stk | 6 | 4 |

> **Viktig for konsept A og C:** Casene bygger på hverandre (beholdningen endres fra case til case). Da må beholdningen i appens Opplæringsmodus stemme med kurset, og vi må vite når Opplæringsmodus nullstilles. *Avklares med apputvikler.* Konsept B styrer beholdningen selv.

### 3.3 Casene (kortversjon med fasit)

Uttrykket «tell» betyr at deltakeren sammenligner ny beholdning i appen med en fasit som kurset oppgir.

**Case 1: UTTAK til pasient** (`PAS-01`, `PROD-OXYNORM-5`)
Line Danser har smerter og trenger smertestillende. Registrer uttak av **1 stk** Oxynorm kaps 5 mg.
- **Flyt:** UTTAK → skann produkt → angi mengde → skann pasient → oppsummering → tell → signer med ID-kort → velg *utsett kontrollsignering* → rød badge på OVERSIKT.
- **Fasit:** 20 → **19**.
- **Obs:** Mengden kan være desimal (1,5 stk) eller en annen enhet (ml).

**Case 2: UTTAK med avvik** (`PAS-01`, `PROD-SOBRIL-10`, `PROD-FENTANYL-50`)
Line Danser trenger også beroligende. Appen sier 30 Sobril 10 mg, men du teller 29. Du mistenker at en kollega har glemt å registrere et uttak.
- **Flyt:** Registrer uttak av 1 stk og korriger beholdningen → registrer avvik (velg sannsynlig årsak, skriv kommentar) → slå på *Nytt uttak til samme pasient* → dobbeltsigner umiddelbart. I Opplæringsmodus kan samme kort brukes. Deretter uttak av 1 stk fentanylplaster 50 mikrog/time.
- **Fasit:** Sobril 30 → 29 (avvik −1) → **28**. Fentanyl 10 → **9**.
- **Obs:** En ekte registrering med avvik krever dobbeltsignering med en gang. Den kan ikke utsettes.

**Case 3: TILBAKELEGGE** (`PAS-02`, `PROD-FENTANYL-50`, `PROD-SOBRIL-10`)
Fentanylplasteret til Finn Dottno er seponert, men neste dose var allerede tatt ut. Legg den tilbake. Senere finner du en løs Sobril 10 mg i medisintrallen og vet ikke hvem den tilhører. Legg den tilbake med *Ukjent pasient*.
- **Fasit:** Fentanyl 9 → **10**. Sobril 28 → **29**.

**Case 4: APOTEKET, mottak og retur**
Det kommer en forsyning fra apoteket. Slå på *Nytt mottak på samme lager*.
- **Mottak:**
  - Sobril 15 mg: **50 stk**
  - Cosylan: **180 ml** (flytende, 10 ml eller mer, så ml)
  - Oxycodone Hameln inj: **20 stk** (flytende, under 10 ml, så stk)
  - Metadon mikst: **2 `[AVKLARES: enhet]`**
- **Retur:** Under ryddingen etter mottaket oppdager du at to Dolcontin 100 mg fra lageret har gått ut på dato. Registrer RETUR til apotek: 6 → **4**.
- **Obs:** Det finnes unntak fra hovedregelen for mengdeenhet. Sjekk om enheten er stk, mg eller ml.

**Case 5: OVERSIKT og ettersignering** (dummy)
Gå til OVERSIKT.
- Fanen *Dobbeltkontroll* viser uttaket fra Case 1. Bruker 2 teller beholdningen, langtrykker på registreringen og tæpper ID-kortet. Den røde badgen forsvinner.
- Finn avviket fra Case 2 i fanen *Avvik*. Kommentaren er skjult, og bare medisinromsansvarlig eller leder kan se den.
- Se fanen *Siste* (de siste 14 dagene). Prøv søk og filter ved å skanne et legemiddel.
- Skriv en etterkommentar ved å langtrykke.
- **Obs:** Ikke overlat manglende dobbeltkontroller til neste skift.

**Case 6: OVERFØRE til underlager** (dummy)
Medisintrallen skal fylles opp. Overfør **5 stk** Oxynorm 5 mg fra TEST Medisinrom 1 til TEST Medisintralle.
- **Fasit:** Medisinrom 19 → **14**, underlager 0 → **5**.
- **Obs:** TILBAKEFØRE er deaktivert når registreringen ikke er tillatt.

**Case 7: KASSERE små rester** (dummy)
Du mister en halv Sobril 10 mg på gulvet. Kasser **0,5 stk**. Det krever dobbeltsignering med en gang.
- **Fasit:** 29 → **28,5**.
- **Obs:** Gjelder det flere doser, skal de returneres til apoteket.

**Case 8: LÅN til annen enhet** (dummy)
Naboposten mangler Oxycodone Hameln inj. Lån ut **2 stk**.
- **Flyt:** Møtes fysisk → kontroller ID-kortet til den som låner → skann `LAGER-02` → begge signerer → mottakeren ettersignerer INNLÅN.
- **Fasit:** 20 → **18**.
- **Obs:** Utlån gjøres fra medisinrommet, ikke fra underlager, og bare når begge enhetene bruker NarKontroll.

**Case 9: KONTROLL av beholdning** (dummy)
Rutinekontroll av fentanylplaster. Tell beholdningen (**10**, stemmer), sjekk holdbarheten og registrer KONTROLL.
- **Obs:** Hyppigheten av kontrollene følger enhetens rutine.

---

## 4. Konsept A: «Veileder ved siden av»

*Et guidet kurs på PC mens deltakeren bruker den ekte appen på mobilen.*

### Idé
Kurset er en rolig, lineær veileder på PC-skjermen, og det er den ekte appen som gjør jobben. Hvert steg forteller deltakeren hva hen skal gjøre, viser QR-koden som skal skannes og viser hvordan appen skal se ut etterpå. Konseptet ligger nærmest dagens manus.

### Deltakeropplevelse
1. Deltakeren åpner kurset i LMS på PC og har mobilen med NarKontroll i hånden.
2. Hvert case har en kort historie øverst og deretter steg for steg.
3. Deltakeren skanner QR-koden fra skjermen, gjør handlingen i appen og trykker **«Ferdig, neste»**.
4. Et kontrollspørsmål avslutter hvert case («Hva viser appen nå som ny beholdning?»).

### Skjermoppsett
- **Venstre kolonne** (ca. 60 %): Modulnavn, historien, gjeldende steg med nummer og instruks, og «Neste»/«Tilbake».
- **Høyre kolonne** (ca. 40 %), «skannesonen»: Én stor QR om gangen, eller plassholderen for appskjermen som viser det deltakeren skal se.
- **Toppen:** Fremdriftslinje med modulene (M0–M13) og en markør for gjeldende modul.
- **Utskriftsvisning:** Et QR-ark per case, for dem som vil ha kodene på papir.

### Skanning og enheter
- **Krever to enheter:** Kurset på PC eller nettbrett, appen på mobilen. Mobilen kan ikke skanne sin egen skjerm.
- Åpnes kurset på en smal skjerm, viser det en melding: «Dette kurset gjøres best på PC. Du kan også skrive ut QR-arket.»
- **Utviklermodus:** Et klikk på QR-koden går videre.

### Måling og SCORM
- `completed` når alle modulene er gjennomgått.
- Resultatene fra kontrollspørsmålene gir `score.raw`. Kurset kan ikke se hva som faktisk skjedde i appen.

### Styrker
- Raskest å lage, og ligger nærmest manuset som finnes.
- Trener den ekte appen, det ekte kameraet og den ekte ID-kortsigneringen.
- Lite vedlikehold når appen endres, fordi appen selv er fasiten. Bare skjermbildene må byttes.

### Svakheter og risiko
- Krever både mobil med appen og PC.
- Kurset kan ikke kontrollere at oppgaven ble gjort riktig i appen.
- Er avhengig av at dataene og beholdningen i Opplæringsmodus stemmer med kurset (se 3.2).
- Mer «instruksjon» enn opplevelse. Risikoen er at deltakeren klikker seg gjennom.

### Første prototype skal vise
- M0 Velkommen, M1 Startmenyen og M3 Case 1 komplett med alle stegtypene.
- M4 Case 2 som skisse.
- Fremdriftslinje, kontrollspørsmål, QR-ark for utskrift, utviklermodus og SCORM-status.

---

## 5. Konsept B: «Appen i nettleseren»

*En interaktiv simulering av NarKontroll. Deltakeren trenger ingen telefon.*

### Idé
Kurset inneholder en klikkbar kopi av NarKontroll i en telefonramme midt på skjermen. Rundt telefonen ligger en **arbeidsbenk** med gjenstandene fra casene: legemiddelpakninger, pasientarmbånd og ID-kort, hver med sin QR-kode. Å klikke eller dra en gjenstand til telefonen er det samme som å skanne den, og å klikke på ID-kortet er det samme som å tæppe det. Simulatoren holder selv rede på beholdningen og reagerer som appen, også når deltakeren gjør feil. Dette ligger nærmest ordlyden «simuleringsprogram» i produktbeskrivelsen.

### Deltakeropplevelse
1. **Guidet modus** (hovedsporet): En instruksboble peker på neste handling, for eksempel «Trykk på UTTAK til pasient». Gjør deltakeren feil, reagerer appen realistisk («Feil legemiddel skannet») og gir et hint.
2. **Fri øving** (sandkasse): Alle knappene virker. Deltakeren velger selv en oppgave fra en liste eller øver fritt.
3. Hvert case ender med at simulatoren kontrollerer resultatet: riktig beholdning, riktig pasient, avvik registrert.

### Skjermoppsett
- **Midten:** Telefonramme med den simulerte appen. Startmenyen bygges etter skjermbildet, og brukernavn og «TEST Medisinrom 1» vises øverst.
- **Venstre:** Oppgavekort med historien og en sjekkliste over delmål som hukes av automatisk.
- **Høyre eller nederst:** Arbeidsbenken med gjenstandene. På mobil blir den en skuff som trekkes opp fra bunnen.
- Merket **«SIMULERING – ikke den ekte appen»** er alltid synlig.

### Teknisk tillegg til innholdsmodellen
- Et **skjermkart** for appen: skjerm-ID, felter, knapper og overganger. Eksempel: `startmeny → uttak-skann-produkt → uttak-mengde → uttak-skann-pasient → uttak-oppsummering → signer → startmeny`.
- En **tilstandsmodell** for beholdning, oppgaver som venter på dobbeltkontroll, avvik og logg. Den driver badgen på OVERSIKT og fanene Dobbeltkontroll, Avvik og Siste.
- **Regler** per registreringstype: om dobbeltkontroll kreves, om den kan utsettes, og om mengdeenheten er riktig.
- Skjermkartet bygges nå med dummy-skjermer. Det må kvalitetssikres mot appen når skjermbildene og flyten fra apputvikler kommer.

### Måling og SCORM
Konseptet gir mest måledata:
- Fullførte oppgaver, antall feil og hint, og tid per case gir `score.raw`.
- Med SCORM 2004 kan hver handling eventuelt rapporteres som `interactions`.
- Resultatet kan være `passed` eller `failed` mot en terskel.

### Styrker
- Trenger ingen telefon, app eller testdata. Kurset kan gjennomføres hvor som helst i LMS-et, også på mobil.
- Kan faktisk kontrollere at deltakeren gjorde riktig, og gir objektiv måling.
- Avvik, feil og sjeldne situasjoner (Lån, Kassere) kan øves trygt og likt for alle.
- Kurset styrer beholdningen, så casene går alltid opp.

### Svakheter og risiko
- Klart mest arbeid: Appen må gjenskapes skjerm for skjerm.
- **Vedlikehold:** Endres appen, må simulatoren oppdateres. Ellers lærer deltakeren noe som ikke stemmer.
- Deltakeren trener ikke det ekte kameraet, NFC eller skannetipsene. Det kan veies opp med en valgfri avsluttende øvelse i den ekte appen.
- Krever tett dialog med apputvikleren om flyt og tekster.

### Designføringer
- Simulatoren skal oppføre seg som en iOS-app:
  - trykkflater på minst 44 × 44 pt
  - systemfont
  - ark (sheets) og brytere som i iOS
  - tydelig tilbakemelding på «skann» (vibrasjon eller blink og lyd som kan slås av).
- Gjennomgå prototypen med skillen `apple-design` (HIG-lens), særlig tilgjengelighet og kontrast på de fargede knappene.

### Første prototype skal vise
- Startmenyen med alle knappene. Knapper uten flyt gir beskjeden «Kommer i senere versjon».
- **Case 1 komplett:** UTTAK med skann, mengde, pasient, oppsummering, signering og utsatt kontroll, og badgen på OVERSIKT.
- **Case 2:** Avviksdialogen og bryteren «Nytt uttak til samme pasient».
- Arbeidsbenken, sjekklisten, guidet modus og SCORM-status.

---

## 6. Konsept C: «En vakt i medisinrommet»

*Et scenariobasert kurs der deltakeren går en hel vakt, og der fagforståelse og valg står i sentrum.*

### Idé
Deltakeren får rollen som sykepleier på en dummy-vakt («Kveldsvakt på post TEST»). Kurset er en **vaktoversikt**: en tidslinje med hendelser som «16:10 Line Danser har smerter» og «18:30 Varelevering fra apoteket». Hver hendelse åpner et case. Før deltakeren utfører casen i appen, må hen ta **faglige valg** med tilbakemelding, for eksempel «Du teller 29, appen sier 30. Hva gjør du?». Vakten avsluttes med en **vaktrapport** som viser hva som ble gjort, og om det er dobbeltkontroller som ellers ville blitt overlatt til neste skift.

### Deltakeropplevelse
1. **Vaktstart:** Deltakeren blir kjent med posten, medisinrommet og appen (M0–M2 er pakket inn som en «første dag»).
2. **Vaktoversikten:** Tidslinjen viser hendelsene. De låses opp i rekkefølge, men etter Case 4 kan de valgfrie oppgavene (Case 6–9) tas i den rekkefølgen deltakeren vil.
3. **Hver hendelse har tre deler:**
   - **Situasjon:** En scene med illustrasjon og kort tekst.
   - **Beslutning:** 1–2 flervalgsspørsmål med forklarende tilbakemelding.
   - **Utførelse:** Skanning og registrering, som i konsept A. Utførelsen er bygget som en egen komponent, slik at den senere kan byttes med simulatoren fra konsept B.
4. **Vaktrapport:** Oppsummering av vakten, beholdningen før og etter, og en påminnelse om dobbeltkontroll.

### Skjermoppsett
- **Vaktoversikt:** En vertikal tidslinje med klokkeslett, hendelseskort i fargen til knappen i appen, og status (låst, aktiv, fullført).
- **Scenevisning:** En stor illustrasjon (plassholder), med tekst og valg under. Scener som trengs: Medisinrom, Pasientrom, Medisintralle, Varemottak og Naboposten.
- **Utførelse:** QR-kode, instruks og appskjerm (som i A) i et panel over scenen.
- **Vaktrapport:** Et oppsummeringskort som kan skrives ut.

### Skanning og enheter
- Standard er den ekte appen, som i A, med samme krav om to enheter.
- **Beslutningsdelen virker uten telefon.** Det gjør konseptet robust hvis appen eller testdataene ikke er klare.
- **Utviklermodus:** Et klikk på QR-koden går videre.

### Måling og SCORM
- Poeng fra beslutningene gir `score.raw`.
- `completed` når vaktrapporten er nådd.
- `passed` eventuelt mot en terskel på beslutningsspørsmålene.

### Styrker
- Lærer *hvorfor* og ikke bare *hvordan*: avvik, dobbeltkontrollkultur og nødrutiner.
- Kjent hverdag gir motivasjon og hjelper deltakeren å huske.
- Tar i bruk fagstoffet i Case 5 og «Må ha med» naturlig.
- Den modulære utførelsesdelen kan gjenbruke A eller B.

### Svakheter og risiko
- Illustrasjoner og historie koster tid, og tekstene til beslutningene må kvalitetssikres faglig.
- Tar lengre tid å gjennomføre enn A.
- Historien kan skygge for selve prosedyren hvis den får for stor plass.

### Første prototype skal vise
- Vaktoversikten med alle hendelsene (de fleste låst).
- **Hendelse Case 1** komplett: scene, én beslutning og utførelse.
- **Hendelse Case 2:** Avviksbeslutningen med tilbakemelding.
- Vaktrapporten, utviklermodus og SCORM-status.

---

## 7. Sammenligning

| Kriterium | A: Veileder | B: Simulator | C: Vakten |
|---|---|---|---|
| Utviklingsinnsats | Lav | Høy | Middels |
| Avhengig av appen og apputvikleren | Høy (testdata og beholdning) | Middels (flyt og skjermer) | Høy for utførelsen, lav for beslutningene |
| Krever mobil med appen | Ja | Nei | Ja (ikke for beslutningene) |
| Trener den ekte appen, kameraet og NFC | Ja | Nei | Ja |
| Måler faktisk læring | Svakt | Sterkt | Middels (fagforståelse) |
| Kan gjennomføres på mobil alene | Nei | Ja | Delvis |
| Vedlikehold ved appendringer | Lavt | Høyt | Lavt til middels |
| Opplevelse og motivasjon | Nøktern | Høy (praktisk) | Høy (fortelling) |
| Omtrentlig gjennomføringstid* | 30–40 min | 40–60 min | 45–60 min |

\*Grovt anslag for hele kurset. Må vurderes på nytt når faginnholdet er ferdig.

**Mulige kombinasjoner senere:**
- C med B som utførelsesdel: fortelling og simulator.
- A med B-simulator som reserve for dem som ikke har appen tilgjengelig.

**Forslag til vurdering av prototypene:** La 3–5 ansatte fra målgruppen prøve alle tre (ca. 10 minutter hver). Mål om de forstår hva de skal gjøre, hvor de står fast og hvilken de foretrekker. Legg til en faglig vurdering fra medisinromsansvarlig og en teknisk test i SCORM Cloud og i sykehusets LMS.

---

## 8. Åpne beslutninger (tas senere)

| # | Beslutning | Hvem |
|---|---|---|
| 1 | Innholdet i de ekte QR-kodene for lager, legemidler og pasienter | Apputvikler |
| 2 | Testdata og startbeholdning i Opplæringsmodus, og når den nullstilles | Apputvikler |
| 3 | Skjermbilder av alle stegene, og for B også full skjermflyt og tekster | Apputvikler / prosjekt |
| 4 | LMS og SCORM-versjon (1.2 eller 2004), og krav til fullføring og bestått | LMS-ansvarlig |
| 5 | A/B-klassifisering av legemidlene i casene, og unntakene for mengdeenhet (Metadon) | Farmasøyt / fag |
| 6 | Endelig faginnhold og godkjenning, inkludert Case 5–9 | Fagansvarlig |
| 7 | Målgruppe og krav: obligatorisk for alle, varighet, språk (bokmål/nynorsk) | Oppdragsgiver |
| 8 | Om video skal brukes (manuset har spor av et videomanus med kapitler og tidskoder) | Prosjekt |
| 9 | Lokale innstillinger: dobbeltsignering på B-preparater, underlager per enhet | Systemforvalter |
| 10 | Illustrasjonsstil og om fotografier kan brukes (konsept C) | Prosjekt |

---

## 9. Kildeoversikt

| Fil | Brukt i |
|---|---|
| `Produktbeskrivelse.txt` | Del 1 |
| `Narkontroll_logo_bilde.png` | Del 1 (startmenyen) og 2.5 (farger) |
| `NarKontroll-manus/AAA Intro.docx` | M0 |
| `NarKontroll-manus/Case 1 - UTTAK til pasient.docx` | M3 |
| `NarKontroll-manus/CASE 2 - UTTAK til pasient med avvik.docx` | M4 |
| `NarKontroll-manus/CASE 3 - TILBAKELEGGE fra pasient-ID og Ukjent pasient.docx` | M5 |
| `NarKontroll-manus/CASE 4 - APOTEK fra og til.docx` | M6 |
| `NarKontroll-manus/Case 5 - IKKE FERDIG.docx` | M2, M7, M9–M11 |
| `NarKontroll-manus/Må ha med. HVOR.docx` | M1, M3 (mengde), 3.2 (pasienter), M12 |
| `NarKontroll-manus/Outro.docx` | M13 |
