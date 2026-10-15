/*
 * Kursinnhold for NarKontroll-opplæringen (felles innholdsmodell, se Losningsforslag.md 2.4).
 *
 * ALT innhold er DUMMY. Tekst i [AVKLARES: …] vises som gul merkelapp i kurset.
 * **fet** i tekst blir fet skrift.
 *
 * Stegtyper: registrer, skann, signer, sporsmal, obs, info
 *   (og fortelling, instruks, mengde, appskjerm, valg, som ikke brukes nå)
 *
 * registrer: hele registreringen på én side. Deltakeren gjør den i appen, og kurset viser
 *   radene i appens rekkefølge i høyre kolonne, med QR-koden og mengden der de trengs.
 *   rekke: [{ tekst, kode?, mengde?, enhet?, merknad? }]
 *
 * Valgfrie felt på et steg:
 *   tittel    kort overskrift. Uten tittel vises `tekst` som overskrift.
 *   punkter   liste under teksten
 *   tips      liten hjelpetekst
 *   forklar   (signer) vis hvor leseren sitter på ulike telefoner. Bare første gang deltakeren signerer.
 *   antall    (signer) 2 = dobbeltsignering
 *   iKortet   (registrer) vis radene i stegkortet, uten skannesone til høyre
 *   meny      { fremhev: [], badge: 1 }. Viser skjematisk startmeny. Bare i M0: ellers skal deltakeren
 *             se på appen, ikke på bilder av den
 *   panel     { type: "fakta", tittel, rader: [[etikett, verdi]] } | { type: "idkort", idkort } | { type: "resultat" }
 */
window.KURS = {
  tittel: "NarKontroll – opplæring",
  versjon: "0.2-dummy",

  /* Hovedmenyen: første side deltakeren ser (rett etter introfilmen), og siden de kommer tilbake til
     etter hver modul. Ingressen er ett eller flere avsnitt under tittelen, i full bredde.
     Hold den kort, så hele menyen fortsatt får plass uten å rulle (H-04). */
  hovedmeny: {
    tittel: "Kurs i NarKontroll-appen",
    ingress: [
      "NarKontroll er en elektronisk løsning for regnskap og kontroll med A- og B-preparater, utviklet av Sykehuset Østfold. Dette kurset guider deg gjennom alle funksjonene steg for steg med grundige forklaringer, slik at du trygt kan bli kjent med appen uten å bekymre deg for å gjøre feil.",
      "Kurset er alltid tilgjengelig, slik at du kan komme tilbake og øve akkurat når det passer deg. Casene er delt inn slik at case 1 til 4 går gjennom de viktigste og mest brukte funksjonene, og det anbefales å øve på disse til du føler deg helt trygg. For deg som ønsker å lære resten av funksjonene, er case 5 til 9 tilgjengelig for ekstra øving."
    ]
  },

  /* Gruppene i hovedmenyen, i anbefalt rekkefølge */
  grupper: [
    { tittel: "Kom i gang", tekst: "Gjør denne først. Her gjør du klar appen på mobilen.", moduler: ["m0-velkommen"] },
    { tittel: "Caser", tekst: "Øv på situasjoner fra hverdagen. Casene bygger på hverandre, så ta dem gjerne i rekkefølge.", moduler: ["case-1", "case-2", "case-3", "case-4", "case-5", "case-6", "case-7", "case-8", "case-9"] },
    { tittel: "Til slutt", tekst: "Gode råd og innlogging med din egen bruker.", moduler: ["m12-gode-rad", "m13-avslutning"] }
  ],

  moduler: [

    /* ───────────────────────── M0 ───────────────────────── */
    {
      id: "m0-velkommen",
      nr: "M0",
      eyebrow: "Forberedelser",
      tittel: "Sjekk at appen er klar",
      kortTekst: "Du gjør kurset på PC og bruker den ekte appen på mobilen. Du trenger mobilen med **NarKontroll** installert, ID-kortet ditt og ca. 20 minutter.",
      steg: [
        {
          // Innholdet fra den tidligere infoboksen «Før du starter» (manus: AAA Intro, tilbakemelding H-02 og H-03).
          // iKortet: radene står i stegkortet i stedet for i skannesonen (tittelen brukes bare av skjermleseren)
          type: "registrer",
          iKortet: true,
          tittel: "Start appen i Opplæringsmodus",
          rekke: [
            { tekst: "Start **NarKontroll**-appen på mobilen." },
            { tekst: "Trykk på ikonet øverst til høyre for å gå til **Opplæringsmodus**. {ikon:opplaeringsmodus}", merknad: "I Opplæringsmodus er det ingen innlogging med ekte brukernavn og passord. Registreringer som gjøres i Opplæringsmodus, slettes når modusen avsluttes." },
            { tekst: "Spør appen om å få bruke kameraet? Trykk **Tillat**.", merknad: "Dette skjer bare første gang du åpner appen." },
            { kode: "LAGER-01", tekst: "Trykk på **Angi lager**, og skann lagerkoden." },
            { tekst: "Nå er du i **Opplæringsmodus** og ser startmenyen. Øverst står lageret: **TEST Medisinrom 1**. I casene gjør du registreringene i appen, og kurset viser kodene du skal skanne.", merknad: "Ser du noe annet? Gjør punktene over på nytt." }
          ]
        }
      ]
    },

    /* ───────────────────────── M3 · Case 1 ───────────────────────── */
    {
      id: "case-1",
      nr: "M3",
      eyebrow: "Case 1",
      tittel: "UTTAK til pasient",
      knapp: "uttak",
      kortTekst: "Line Danser har smerter og trenger smertestillende. Registrer UTTAK til pasient av 1 stk Oxynorm kaps 5 mg.",
      steg: [
        {
          type: "registrer",
          tittel: "Registrer uttaket i appen",
          tekst: "Gjør registreringen på mobilen. Kurset viser stegene i den rekkefølgen appen spør, og kodene du skal skanne.",
          tips: "Mengden kan være et desimaltall, for eksempel 1,5 stk. Den kan også ha en annen enhet enn stk, for eksempel ml for store miksturflasker eller hetteglass som deles av flere pasienter.",
          rekke: [
            { tekst: "Trykk på **UTTAK** til pasient." },
            { kode: "PROD-OXYNORM-5", mengde: 1, enhet: "stk", tekst: "Skann produktkoden. Skriv inn mengden, og trykk **Fortsett**." },
            { kode: "PAS-01", tekst: "Skann pasient-ID-koden." },
            { tekst: "Se over oppsummeringsbildet. Tell hvor mange Oxynorm det er igjen. Ny beholdning i appen skal stemme med det du teller.", merknad: "Beholdningen er 20 stk før uttaket. [AVKLARES: startbeholdningen i Opplæringsmodus må stemme med kurset]" }
          ]
        },
        {
          type: "info",
          tittel: "Dobbeltkontroll: med en gang eller senere?",
          tekst: "Oxynorm er et A-preparat, så uttaket må dobbeltkontrolleres. På et vanlig uttak kan du utsette dobbeltkontrollen hvis ingen kollega er ledig.",
          tips: "Få helst en annen til å dobbeltkontrollere samtidig med registreringen, eller så fort som mulig. Ikke overlat manglende dobbeltkontroller til neste skift.",
          panel: {
            type: "fakta",
            tittel: "Dobbeltkontroll",
            rader: [
              ["A-preparat", "Alltid dobbeltkontroll, etter forskriftskrav. Det samme gjelder kassasjon"],
              ["B-preparat", "Ikke samme krav, men mange enheter har dobbeltsignering som lokalt krav"],
              ["Kan utsettes", "For eksempel UTTAK til pasient uten avvik"],
              ["Kan ikke utsettes", "Røde knapper og røde brytere, og registreringer med avvik. De lagres ikke før begge har signert"]
            ],
            merknad: "Lokale krav settes opp av systemforvalter på bestilling fra leder."
          }
        },
        {
          type: "signer",
          idkort: "IDKORT-01",
          forklar: true,
          tittel: "Signer, og utsett dobbeltkontrollen",
          tekst: "Tæpp ID-kortet mot baksiden av telefonen for å signere på at beholdningen er korrekt. Når appen spør om dobbeltkontroll, velger du **Utsett kontrollsignering**. Den gjør du ferdig i Case 5."
        },
        {
          type: "sporsmal",
          tekst: "Se på startmenyen i appen. OVERSIKT har fått et rødt tall. Hva betyr det?",
          alternativer: ["Antall avvik på lageret", "Antall registreringer som venter på dobbeltkontroll", "Antall uttak i dag"],
          fasit: "Antall registreringer som venter på dobbeltkontroll",
          forklaring: "Utsatte dobbeltkontroller gir det røde oppgavevarselet. Det forsvinner når alle er signert."
        }
      ]
    },

    /* ───────────────────────── M4 · Case 2 ───────────────────────── */
    {
      id: "case-2",
      nr: "M4",
      eyebrow: "Case 2",
      tittel: "UTTAK med avvik",
      knapp: "uttak",
      kortTekst: "Line Danser trenger en ny dose Oxynorm kaps 5 mg. Uttaket gjør du som i Case 1, men denne gangen stemmer ikke beholdningen. Nå skal du registrere et uttak **med avvik**.",
      steg: [
        {
          // Ett uttak i stedet for to (tilbakemelding C2-01). Avviket oppdages ved tellingen som i Case 1,
          // og deltakeren ser den korrigerte beholdningen i appen, ikke i et kontrollspørsmål (C2-03).
          type: "registrer",
          tittel: "Beholdningen stemmer ikke",
          tekst: "Du tar ut 1 Oxynorm og teller det som er igjen. Appen sier at det skal være 18, men du teller 17. Du mistenker at en kollega har glemt å registrere et uttak. Derfor korrigerer du beholdningen i samme registrering. Da blir det et **avvik**.",
          rekke: [
            { tekst: "Trykk på **UTTAK** til pasient." },
            { kode: "PROD-OXYNORM-5", mengde: 1, enhet: "stk", tekst: "Skann produktkoden, og skriv inn mengden." },
            { kode: "PAS-01", tekst: "Skann pasient-ID-koden." },
            { tekst: "Tell hvor mange Oxynorm det er igjen. Appen sier 18, men du teller 17. Følg instruksjonene i appen for å korrigere beholdningen.", merknad: "Beholdningen er 19 stk før uttaket. [AVKLARES: hvor i flyten korrigeringen gjøres]" },
            { tekst: "Velg sannsynlig årsak til avviket, og skriv en forklarende kommentar.", merknad: "Eksempel: «Mistenker at forrige uttak ikke er registrert.»" },
            { tekst: "Se på oppsummeringsbildet. Ny beholdning skal nå stemme med det du teller: 17 stk." }
          ]
        },
        {
          type: "signer",
          idkort: "IDKORT-01",
          antall: 2,
          tittel: "Dobbeltsigner avviket med en gang",
          tekst: "Tæpp ID-kortet to ganger: først som bruker 1, så som bruker 2.",
          punkter: [
            "Avvik kan ikke utsettes. Registreringen lagres ikke før begge har signert.",
            "Bruker 2 trenger ikke logge inn, bare tæppe ID-kortet.",
            "I Opplæringsmodus signerer du begge med ditt eget kort."
          ],
          tips: "Skal samme pasient ha flere legemidler? Slå på bryteren **Nytt uttak til samme pasient** før du signerer. Da slipper du å skanne pasienten på nytt."
        },
        {
          type: "sporsmal",
          tekst: "I Case 1 kunne du utsette dobbeltkontrollen. Hvorfor kunne du ikke det nå?",
          alternativer: ["Fordi registreringen hadde avvik", "Fordi Oxynorm er et A-preparat", "Fordi det var samme pasient"],
          fasit: "Fordi registreringen hadde avvik",
          forklaring: "Registreringer med avvik er risikoregistreringer. De krever dobbeltsignering med en gang. Oxynorm er et A-preparat, men det var det også i Case 1."
        }
      ]
    },

    /* ───────────────────────── M5 · Case 3 ───────────────────────── */
    {
      id: "case-3",
      nr: "M5",
      eyebrow: "Case 3",
      tittel: "TILBAKELEGGE fra pasient",
      knapp: "tilbakelegge",
      kortTekst: "Fentanylplasteret til Finn Dottno er seponert, men neste dose var allerede tatt ut. Senere finner du en løs Sobril-tablett i medisintrallen.",
      steg: [
        {
          type: "registrer",
          tittel: "Legg tilbake fentanylplasteret",
          tekst: "Hos Finn Dottno er forordningen på fentanylplaster seponert. Neste dose var allerede klargjort og tatt ut av narkotikaregnskapet. Den skal legges tilbake.",
          tips: "Følg appen på mobilen. Her i kurset trenger du bare kodene.",
          rekke: [
            { tekst: "Trykk på **TILBAKELEGGE** fra pasient." },
            { kode: "PROD-FENTANYL-50", mengde: 1, enhet: "stk", tekst: "Skann produktkoden, og skriv inn mengden." },
            { kode: "PAS-02", tekst: "Skann pasient-ID-koden.", merknad: "Vet du ikke hvilken pasient legemidlet kommer fra? Da velger du **Ukjent pasient** i stedet." },
            { tekst: "Kontroller oppsummeringen, og tæpp ID-kortet for å signere.", merknad: "[AVKLARES: krav om dobbeltkontroll ved TILBAKELEGGE]" }
          ]
        },
        {
          type: "registrer",
          tittel: "En løs tablett i medisintrallen",
          tekst: "Senere på vakten rydder du i medisintrallen. Du finner en løs Sobril-tablett og vet ikke hvilken pasient den kommer fra.",
          rekke: [
            { tekst: "Trykk på **TILBAKELEGGE** fra pasient." },
            { kode: "PROD-SOBRIL-10", mengde: 1, enhet: "stk", tekst: "Skann produktkoden, og skriv inn mengden." },
            { tekst: "Velg **Ukjent pasient** i stedet for å skanne en pasient." },
            { tekst: "Tæpp ID-kortet for å signere og lagre." }
          ]
        }
      ]
    },

    /* ───────────────────────── M6 · Case 4 ───────────────────────── */
    {
      id: "case-4",
      nr: "M6",
      eyebrow: "Case 4",
      tittel: "APOTEKET: mottak og retur",
      knapp: "apotek",
      kortTekst: "Det kommer en forsyning fra apoteket. Registrer mottak av fire legemidler. Etterpå returnerer du to Dolcontin som har gått ut på dato.",
      steg: [
        {
          type: "registrer",
          tittel: "Registrer mottaket",
          tekst: "Mengdeenheten for de fleste legemidler er stk. For flytende legemidler er hovedregelen:",
          punkter: [
            "**10 ml eller mer** registreres som ml.",
            "**Under 10 ml** registreres som stk."
          ],
          tips: "Det finnes unntak. Sjekk om enheten er stk, mg eller ml.",
          rekke: [
            { tekst: "Trykk på **APOTEKET**, og velg **MOTTAK**." },
            { tekst: "Slå på bryteren **Nytt mottak på samme lager**. Da kan du registrere flere legemidler etter hverandre." },
            { kode: "PROD-SOBRIL-15", mengde: 50, enhet: "stk", tekst: "Skann, skriv inn mengden, og signer og lagre." },
            { kode: "PROD-COSYLAN", mengde: 180, enhet: "ml", tekst: "Skann, skriv inn mengden, og signer og lagre.", merknad: "Flytende, 180 ml per flaske. Altså ml." }
          ]
        },
        {
          type: "registrer",
          tittel: "Registrer resten av mottaket",
          tekst: "Bryteren er fortsatt på, så du fortsetter rett med neste legemiddel. Husk regelen: 10 ml eller mer registreres som ml, under 10 ml som stk.",
          rekke: [
            { kode: "PROD-OXYCODONE-INJ", mengde: 20, enhet: "stk", tekst: "Skann, skriv inn mengden, og signer og lagre.", merknad: "Flytende, 2 ml per ampulle. Altså stk." },
            { kode: "PROD-METADON-MIKST", mengde: 2, enhet: "[AVKLARES: enhet]", tekst: "Skann, skriv inn mengden, og signer og lagre.", merknad: "Metadon kan være et unntak fra hovedregelen. Sjekk enheten i appen." }
          ]
        },
        {
          type: "registrer",
          tittel: "To tabletter har gått ut på dato",
          tekst: "Når du rydder etter mottaket, oppdager du at to Dolcontin depottab 100 mg fra lageret har gått ut på dato. De skal returneres til apoteket.",
          tips: "RETUR til Sykehusapoteket er ofte A- eller B-preparater som skal destrueres fordi holdbarheten er utløpt. Returen leveres etter prosedyre.",
          rekke: [
            { tekst: "Trykk på **APOTEKET**, og velg **RETUR**." },
            { kode: "PROD-DOLCONTIN-100", mengde: 2, enhet: "stk", tekst: "Skann produktkoden, og skriv inn mengden." },
            { tekst: "Tæpp ID-kortet for å signere og lagre." }
          ]
        },
        {
          type: "sporsmal",
          tekst: "Hvilken enhet registrerer du Cosylan mikst 180 ml i?",
          alternativer: ["stk", "ml", "mg"],
          fasit: "ml",
          forklaring: "Flytende legemidler på 10 ml eller mer registreres som ml."
        },
        {
          type: "sporsmal",
          tekst: "Hvilken enhet registrerer du Oxycodone Hameln inj 2 ml i?",
          alternativer: ["stk", "ml", "mg"],
          fasit: "stk",
          forklaring: "Flytende legemidler under 10 ml registreres som stk."
        }
      ]
    },

    /* ───────────────────────── M7 · Case 5 ───────────────────────── */
    {
      id: "case-5",
      nr: "M7",
      eyebrow: "Case 5",
      tittel: "OVERSIKT og ettersignering",
      knapp: "oversikt",
      utkast: true,
      kortTekst: "Finn igjen registreringene du har gjort, og fullfør dobbeltkontrollen fra Case 1.",
      steg: [
        {
          type: "registrer",
          tittel: "Nå er du bruker 2",
          tekst: "Uttaket fra Case 1 venter på dobbeltkontroll. Tenk deg at det er en kollega som har registrert det, og at du er den som kontrollerer. Gå inn i OVERSIKT i appen, og gjør dobbeltkontrollen.",
          punkter: [
            "På vakt dobbeltkontrollerer du alltid en annens registrering, aldri din egen.",
            "I Opplæringsmodus finnes bare dine egne registreringer. Derfor spiller du kollegaen her. [AVKLARES: kan Opplæringsmodus ha en ferdig registrering fra en annen bruker?]"
          ],
          tips: "Mangler det dobbeltkontroll på forrige registrering en annen bruker har gjort på samme legemiddel, får du også mulighet til å dobbeltsignere den.",
          rekke: [
            { tekst: "Trykk på **OVERSIKT**, den grønne knappen med det røde tallet." },
            { tekst: "Den første fanen, **Dobbeltkontroll**, er en liste over registreringer som mangler dobbeltsignering. Finn uttaket fra Case 1." },
            { tekst: "Kontroller registreringen, og tell beholdningen. Langtrykk så på registreringen." },
            { tekst: "Bekreft beholdningen ved å tæppe ID-kortet.", merknad: "I Opplæringsmodus bruker du ditt eget kort." },
            { tekst: "Gå tilbake til startmenyen. Det røde tallet på OVERSIKT er borte når alle dobbeltkontroller er signert." }
          ]
        },
        {
          type: "registrer",
          tittel: "Se gjennom fanene",
          tekst: "OVERSIKT har tre faner. Du kan søke og filtrere i alle tre. På avvik gjelder dette:",
          punkter: [
            "Kommentarer om avvik er skjult.",
            "Medisinromsansvarlig og/eller leder kan se kommentarene og har ansvar for å saksbehandle avvik."
          ],
          rekke: [
            { tekst: "Åpne den midterste fanen, **Avvik**. Den viser avvik fra den siste måneden. Finn avviket fra Case 2." },
            { tekst: "Åpne fanen til høyre, **Siste**. Den viser registreringene de siste 14 dagene." },
            { kode: "PROD-SOBRIL-10", tekst: "Søk ved å skanne produktkoden mens du står i en av fanene.", merknad: "Du kan også skrive navnet på legemidlet i søkefeltet." },
            { tekst: "Du kan skrive en etterkommentar på alle registreringer. Langtrykk på en registrering, og skriv kommentaren.", merknad: "[AVKLARES: navnet på menyvalget]" }
          ]
        },
        {
          type: "obs",
          tittel: "Ikke overlat det til neste skift",
          tekst: "En utsatt dobbeltkontroll gir det røde varselet i startmenyen og et varsel på startskjermen til andre brukere som er innlogget på samme lager. Få en annen til å dobbeltkontrollere samtidig med registreringen når det er mulig, eller så fort som mulig."
        },
        {
          type: "sporsmal",
          tekst: "Hvem kan lese kommentarene på et avvik?",
          alternativer: ["Alle brukere på lageret", "Medisinromsansvarlig og/eller leder", "Bare den som registrerte avviket"],
          fasit: "Medisinromsansvarlig og/eller leder",
          forklaring: "Kommentarene holdes skjult. Medisinromsansvarlig og/eller leder kan se dem og saksbehandler avvikene."
        }
      ]
    },

    /* ───────────────────────── M8 · Case 6 ───────────────────────── */
    {
      id: "case-6",
      nr: "M8",
      eyebrow: "Case 6",
      tittel: "OVERFØRE til underlager",
      knapp: "overfore",
      utkast: true,
      kortTekst: "Medisintrallen skal fylles opp. Overfør 5 stk Oxynorm kaps 5 mg fra TEST Medisinrom 1 til TEST Medisintralle.",
      steg: [
        {
          type: "registrer",
          tittel: "Fyll opp medisintrallen",
          tekst: "Medisintrallen er et underlager til medisinrommet. Den skal ha 5 stk Oxynorm kaps 5 mg. [AVKLARES: navnet på underlageret i Opplæringsmodus]",
          tips: "Skal legemidler tilbake fra underlageret til medisinrommet, bruker du **TILBAKEFØRE**. Knappen er blek når registreringen ikke er tillatt.",
          rekke: [
            { tekst: "Trykk på **OVERFØRE** til eget underlager." },
            { kode: "UNDERLAGER-01", tekst: "Skann koden til underlageret.", merknad: "[AVKLARES: skannes underlageret, eller velges det i en liste?]" },
            { kode: "PROD-OXYNORM-5", mengde: 5, enhet: "stk", tekst: "Skann produktkoden, og skriv inn mengden." },
            { tekst: "Kontroller oppsummeringen, og tæpp ID-kortet for å signere." }
          ]
        }
      ]
    },

    /* ───────────────────────── M9 · Case 7 ───────────────────────── */
    {
      id: "case-7",
      nr: "M9",
      eyebrow: "Case 7",
      tittel: "KASSERE små rester",
      knapp: "kassere",
      utkast: true,
      kortTekst: "Du deler en Sobril tab 10 mg og mister den ene halvdelen på gulvet. Den kan ikke brukes. Kasser 0,5 stk.",
      steg: [
        {
          type: "registrer",
          tittel: "Når bruker du KASSERE?",
          tekst: "KASSERE brukes for å kassere SMÅ mengder lokalt, når kassasjonen ikke er knyttet til en annen registrering. Eksempler:",
          punkter: ["En tablett du har mistet på gulvet", "En halv tablett", "En skvett som ikke skal brukes"],
          rekke: [
            { tekst: "Trykk på **KASSERE** små rester lokalt." },
            { kode: "PROD-SOBRIL-10", mengde: 0.5, enhet: "stk", tekst: "Skann produktkoden, og skriv inn mengden.", merknad: "Desimaltall skrives med komma." }
          ]
        },
        {
          type: "signer",
          idkort: "IDKORT-01",
          antall: 2,
          tittel: "Dobbeltsigner med en gang",
          tekst: "KASSERE er en rød knapp og krever to signaturer med en gang. Tæpp ID-kortet to ganger.",
          tips: "Gjelder det flere doser A- og B-preparater, skal de returneres til Sykehusapoteket, ikke kasseres lokalt."
        }
      ]
    },

    /* ───────────────────────── M10 · Case 8 ───────────────────────── */
    {
      id: "case-8",
      nr: "M10",
      eyebrow: "Case 8",
      tittel: "LÅN til annen enhet",
      knapp: "lan",
      utkast: true,
      kortTekst: "En sykepleier fra naboposten mangler Oxycodone Hameln inj 10 mg/ml. Lån ut 2 stk til TEST Medisinrom 2.",
      steg: [
        {
          type: "info",
          tittel: "Regler for LÅN",
          tekst: "LÅN brukes bare når både avsender og mottaker har tatt i bruk NarKontroll.",
          punkter: [
            "Utlån gjøres fra medisinrommet, ikke fra underlager.",
            "Medarbeiderne fra de to enhetene må møtes fysisk for overleveringen.",
            "Den som låner inn, tar med QR-koden til sitt medisinrom, enten i appen eller på en lapp."
          ],
          tips: "Kontroller ID-kortet til den som skal låne, før du registrerer lånet.",
          panel: { type: "idkort", idkort: "IDKORT-02" }
        },
        {
          type: "registrer",
          tittel: "Registrer lånet i appen",
          tekst: "Gjør utlånet i appen sammen med sykepleieren fra naboposten.",
          rekke: [
            { tekst: "Trykk på **LÅN** til/fra annen enhet." },
            { kode: "PROD-OXYCODONE-INJ", mengde: 2, enhet: "stk", tekst: "Skann produktkoden, og skriv inn mengden." },
            { kode: "LAGER-02", tekst: "Skann lagerkoden til mottakeren." },
            { tekst: "LÅN er en rød knapp. Du og den som låner, signerer begge med en gang. I Opplæringsmodus tæpper du ditt eget kort **to ganger**." }
          ]
        },
        {
          type: "info",
          tittel: "Mottakeren får en ny signeringsoppgave",
          tekst: "Når lånet er lagret, får mottakeravdelingen en ny signeringsoppgave på sitt lager: dobbeltsignering for INNLÅN. Den må signeres av en tredje bruker.",
          punkter: [
            "Du som låner ut, signerer bare for selve utlånet og din egen beholdning.",
            "Den som låner inn, signerer sammen med deg ved overleveringen.",
            "En tredje bruker dobbeltsignerer INNLÅNET på mottakerens lager. [AVKLARES: er det en kollega på mottakeravdelingen?]"
          ],
          tips: "Oppgaven ligger i **OVERSIKT** under Dobbeltkontroll på mottakerens lager. [AVKLARES: stemmer det, eller signeres innlånet et annet sted? Langtrykk på registreringen?]"
        }
      ]
    },

    /* ───────────────────────── M11 · Case 9 ───────────────────────── */
    {
      id: "case-9",
      nr: "M11",
      eyebrow: "Case 9",
      tittel: "KONTROLL av beholdning",
      knapp: "kontroll",
      utkast: true,
      kortTekst: "Rutinekontroll av fentanylplaster. Tell beholdningen, sjekk holdbarheten og registrer KONTROLL.",
      steg: [
        {
          type: "registrer",
          tittel: "Regelmessig kontroll",
          tekst: "Bruk den gule knappen for å dokumentere KONTROLL av beholdning. Enheten din skal ha en rutine for regelmessig telling og kontroll av holdbarhet.",
          tips: "Hvor ofte det kontrolleres, følger enhetens rutine.",
          rekke: [
            { tekst: "Trykk på **KONTROLL** av beholdning." },
            { kode: "PROD-FENTANYL-50", tekst: "Skann produktkoden." },
            { tekst: "Tell beholdningen, og sammenlign med det appen viser. Her stemmer det. Sjekk holdbarheten på pakningene." },
            { tekst: "Tæpp ID-kortet for å signere og lagre kontrollen." }
          ]
        },
        {
          type: "sporsmal",
          tekst: "Tellingen stemmer ikke med beholdningen i appen. Hva gjør du?",
          alternativer: ["Registrerer et avvik med årsak og kommentar", "Retter tallet uten kommentar", "Venter til neste kontroll"],
          fasit: "Registrerer et avvik med årsak og kommentar",
          forklaring: "Som i Case 2: korriger beholdningen og registrer avviket med sannsynlig årsak og en kommentar. [AVKLARES: fremgangsmåte ved avvik under KONTROLL]"
        }
      ]
    },

    /* ───────────────────────── M12 ───────────────────────── */
    {
      id: "m12-gode-rad",
      nr: "M12",
      eyebrow: "Gode råd",
      tittel: "Skanning, heng og nødrutine",
      kortTekst: "Noen råd som gjør hverdagen med NarKontroll enklere.",
      steg: [
        {
          type: "info",
          tittel: "Skann det du sikter på",
          tekst: "Kameraet kan lett fange opp andre produktkoder og fødselsnumre enn det du siktet mot.",
          punkter: [
            "Beste skanneavstand er ca. 20 cm.",
            "Glinsende emballasje kan gi refleks. Endre vinkelen litt på det du skanner."
          ]
        },
        {
          type: "info",
          tittel: "Hvis appen henger",
          tekst: "Løsningen er den samme som i andre apper: start appen på nytt.",
          punkter: [
            "Dra sakte opp fra bunnen av skjermen.",
            "Sveip forhåndsvisningen av appen oppover, slik at den forsvinner.",
            "Start appen på nytt."
          ]
        },
        {
          type: "info",
          tittel: "Ingen integrasjon ennå",
          tekst: "NarKontroll har foreløpig ingen integrasjon mot kurve- eller lagerstyringsapplikasjoner."
        },
        {
          type: "obs",
          tittel: "Nødrutine",
          tekst: "Virker ikke NarKontroll-appen, fører du regnskapet på papir."
        },
        {
          type: "sporsmal",
          tekst: "NarKontroll virker ikke. Hva er nødrutinen?",
          alternativer: ["Vente til appen virker igjen", "Føre regnskapet på papir", "Registrere uttaket i kurven"],
          fasit: "Føre regnskapet på papir",
          forklaring: "Nødrutinen er å føre regnskapet på papir."
        }
      ]
    },

    /* ───────────────────────── M13 ───────────────────────── */
    {
      id: "m13-avslutning",
      nr: "M13",
      eyebrow: "Avslutning",
      tittel: "Logg inn med ekte bruker",
      kortTekst: "Kurset i Opplæringsmodus er ferdig. Til slutt sjekker du at du har tilgang med din egen bruker.",
      steg: [
        {
          type: "instruks",
          tittel: "Sjekk tilgangen din",
          tekst: "Logg inn i appen med ditt ekte brukernavn og passord. Tilgangen kontrolleres, og du får opp hovedmenyen."
        },
        {
          type: "info",
          tittel: "Du er klar til å bruke NarKontroll",
          tekst: "Ha en fin dag videre!",
          panel: { type: "resultat" }
        }
      ]
    }
  ]
};
