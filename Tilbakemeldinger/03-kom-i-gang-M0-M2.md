# 03 · Kom i gang (M0, M1, M2)

[← Til oversikten](README.md)

| Modul | Lysbilder | Kort sagt |
|---|---|---|
| M0 Sjekk at appen er klar | 9–10 | Beholdes. Steg 2 får beholde bildet |
| M1 Bli kjent med startmenyen | 11–18 | Slettes |
| M2 Signering og dobbeltkontroll | 19–26 | Flyttes inn i casene |

---

<a id="k-01"></a>
### K-01 · M0 steg 2 er unntaket som får beholde bildet av appen

- [x] Gjort
- **Hvor:** M0, steg 2 «Du er i Opplæringsmodus», [kurs.js:78](../content/kurs.js#L78)
- **Fra:** ikke navngitt · lysbilde 6 og 10
- **Notat:** Den skjematiske startmenyen står bare her. Teksten om at knappene gjennomgås i neste modul er byttet ut.
- **Endret senere:** Steg 2 er fjernet. Teksten er nå punkt 5 i steg 1 ([kurs.js:64](../content/kurs.js#L64)), og kurset viser ikke lenger bildet av startmenyen.

> Kurset må fokuser på at vi skal aktiv bruke appen og ikke bruke bilder. Med untakk av side 2 på "sjekk at appen er klar" .

**Tolkning:** Behold den skjematiske startmenyen her. Det er det eneste stedet i kurset den skal stå ([G-04](01-generelt.md#g-04)).
Hvis innholdet fra «Før du starter» flyttes inn i M0 ([H-02](02-oppstart-og-hovedmeny.md#h-02)), blir M0 den naturlige startmodulen.
**❓ Avklares:** På lysbilde 10 er teksten i venstre kolonne markert med grått. Det står ingen kommentar til markeringen. Spør om den betyr noe.

---

<a id="k-02"></a>
### K-02 · Slett hele M1 «Bli kjent med startmenyen»

- [x] Gjort
- **Hvor:** Modul `m1-startmenyen`, [kurs.js:88-153](../content/kurs.js#L88-L153), og i `grupper` på [kurs.js:56](../content/kurs.js#L56)
- **Fra:** ikke navngitt · lysbilde 11 (lysbilde 11–18 viser alle de 8 stegene)
- **Notat:** Modulen er slettet. Lagret fremdrift fra før blir ryddet: fullførte moduler som ikke finnes lenger, telles ikke.

> Slette hele kapittel "Bli kjent med startmenyen"
> 8 neste bilder

**Tolkning:** Fjern modulen og de to kontrollspørsmålene i den. Deltakeren lærer knappene ved å bruke dem i casene.
Sjekk etterpå:
- M0 steg 2 sier «I neste modul går vi gjennom knappene» ([kurs.js:80](../content/kurs.js#L80)). Den setningen må endres.
- Antall moduler og SCORM-fullføring (`lesson_status` blir `completed` når alle moduler er fullført). Lagret fremdrift (`suspend_data`) for deltakere som har startet, kan inneholde M1.

---

<a id="k-03"></a>
### K-03 · M2 «Signering og dobbeltkontroll» skal ikke være egen modul

- [x] Gjort
- **Hvor:** Modul `m2-signering`, [kurs.js:156-220](../content/kurs.js#L156-L220)
- **Fra:** ikke navngitt · lysbilde 19 (lysbilde 19–26 viser alle de 7 stegene). Utdypet på lysbilde 33 og 36
- **Notat:** Fordelt slik: dobbeltkontroll for A- og B-preparater, og om den kan utsettes, står på eget faktasteg i Case 1. «Bruker 2 trenger ikke logge inn», «avvik kan ikke utsettes» og «tæpp to ganger i Opplæringsmodus» står ved dobbeltsigneringen i Case 2. «Manglende dobbeltkontroll hos en kollega» står i Case 5 steg 1, og «Ikke overlat det til neste skift» er slått sammen med OBS-en i Case 5. Kontrollspørsmålet er fjernet.

> Dette som står i de neste bildene, må "tas inn i kapitell om dobbelkontroll under avvik
> Bør ikke være eget kapittel
> 7 bilder

**Tolkning:** Slett M2 som modul, men behold fagstoffet og flytt det inn der det trengs:

| Innhold i M2 i dag | Flyttes til |
|---|---|
| Steg 1 Når kreves dobbeltkontroll? (A- og B-preparater) | Case 2 avvik ([C2-04](05-case-2-uttak-med-avvik.md#c2-04)) eller Case 1 signering ([C1-06](04-case-1-uttak.md#c1-06)) |
| Steg 2 Bruker 2 trenger ikke logge inn | Case 2, ved dobbeltsigneringen |
| Steg 3 Utsette eller signere med en gang | Case 1 steg 8 «Signer og lagre» ([C1-06](04-case-1-uttak.md#c1-06)) |
| Steg 4 Manglende dobbeltkontroll hos en kollega | Case 2 eller Case 5 |
| Steg 5 Ikke overlat det til neste skift | Case 5 har allerede en lignende OBS ([kurs.js:735](../content/kurs.js#L735)). Slå sammen |
| Steg 6 I Opplæringsmodus (tæpp to ganger) | Første dobbeltsignering i Case 2 |
| Steg 7 Kontrollspørsmål | Vurder å fjerne ([G-03](01-generelt.md#g-03)) |

**❓ Avklares:** Fordelingen i tabellen er mitt forslag. Fageksperten skriver «under avvik», så det meste bør trolig samles i Case 2.
