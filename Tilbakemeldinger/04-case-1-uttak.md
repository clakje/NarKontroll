# 04 · Case 1 UTTAK til pasient

Modul `case-1`, [kurs.js:77](../content/kurs.js#L77). Lysbilde 27–38.
Linjelenkene under «Hvor» viser til kurset slik det var da tilbakemeldingene kom.
[← Til oversikten](README.md)

| Steg | Innhold | Lysbilde | Tilbakemelding |
|---|---|---|---|
| 1 | Line Danser har smerter | 27 | [C1-01](#c1-01) |
| 2 | Trykk på UTTAK | 28 | [C1-02](#c1-02) Slettes |
| 3 | Skann produktkoden | 29 | [C1-03](#c1-03) Samle på én side |
| 4 | Angi mengde | – | [C1-03](#c1-03) |
| 5 | Skann pasient-ID | 30 | [C1-03](#c1-03) Slettes |
| 6 | Oppsummeringsbildet | 31 | [C1-04](#c1-04) |
| 7 | Tell beholdningen | 32 | [C1-05](#c1-05) |
| 8 | Signer og lagre | 33 | [C1-06](#c1-06) |
| 9 | Utsett kontrollsigneringen | 34 | Ingen kommentar |
| 10 | Varsel på OVERSIKT | 35 | [C1-07](#c1-07) |
| 11 | Kontrollspørsmål: ny beholdning | 36–37 | Kommentaren på lysbilde 36 gjelder Case 2, se [05-case-2](05-case-2-uttak-med-avvik.md). Se også [G-03](01-generelt.md#g-03) |
| 12 | Kontrollspørsmål: det røde tallet | 38 | Ingen kommentar |

---

<a id="c1-01"></a>
### C1-01 · Ikke vis bilder av menyen. Bruk menyen på telefonen

- [x] Gjort
- **Hvor:** Står på steg 1 ([kurs.js:232](../content/kurs.js#L232)), men gjelder stegene med skjematisk startmeny: steg 2 og steg 10
- **Fra:** ikke navngitt · lysbilde 27
- **Notat:** Startmenyene er fjernet. Første steg sier at registreringen gjøres på mobilen.

> Ikke bruk bilder fra menyen, det er bedre at de bruker menye på tlf og at dette komme tydelig frem at det er appen som skal brukes I e-læringen

**Tolkning:** Fjern de skjematiske startmenyene i høyre kolonne ([G-04](01-generelt.md#g-04)). Allerede på steg 1 bør det komme tydelig frem at deltakeren skal gjøre oppgaven i appen.

---

<a id="c1-02"></a>
### C1-02 · Slett steg 2 «Trykk på UTTAK til pasient»

- [x] Gjort
- **Hvor:** Steg 2, [kurs.js:247](../content/kurs.js#L247)
- **Fra:** ikke navngitt · lysbilde 28
- **Notat:** Står som første rad på registreringssiden.

> Siden slettes

**Tolkning:** Instruksen kan stå som én linje på siden med QR-kodene ([C1-03](#c1-03)), for eksempel: «Trykk på UTTAK til pasient, og skann kodene.»

---

<a id="c1-03"></a>
### C1-03 · Produkt, mengde og pasient-ID på samme side

- [x] Gjort
- **Hvor:** Steg 3, 4 og 5, [kurs.js:252-268](../content/kurs.js#L252-L268)
- **Fra:** ikke navngitt · lysbilde 29 og 30
- **Notat:** Produkt og mengde står på samme rad, og pasient-ID-koden på neste rad, på samme side.

Ved steg 3 «Skann produktkoden»:

> Kan QR stå på samme side?
> Både produkt, mengde og pasient-ID

Ved steg 5 «Skann pasient-ID-koden»:

> Slettes

**Tolkning:** Én side med produktkoden, mengden og pasient-ID-koden ved siden av hverandre, i den rekkefølgen appen spør. Steg 5 slettes fordi pasientkoden flyttes hit.
Krever endring i [js/app.js](../js/app.js): i dag viser hvert `skann`-steg bare én kode. Det trengs en stegtype som viser flere koder (og mengden) samtidig.
Samme ønske for Case 3: [C3-02](06-case-3-tilbakelegge.md#c3-02). Bør gjelde alle casene.

---

<a id="c1-04"></a>
### C1-04 · Oppsummeringsbildet: se på telefonen i stedet

- [x] Gjort
- **Hvor:** Steg 6, [kurs.js:270](../content/kurs.js#L270) (skjerm `uttak-oppsummering`)
- **Fra:** ikke navngitt · lysbilde 31
- **Notat:** Er nå raden «Se over oppsummeringsbildet» på registreringssiden, slått sammen med tellingen (C1-05 er fortsatt åpen).

> Se over oppsummeringsbilde på tlf din
> I steden for alt som står her

**Tolkning:** Erstatt teksten og plassholderen for appskjermen med én kort instruks: «Se over oppsummeringsbildet på telefonen din.» Kan kanskje slås sammen med steg 7 eller 8.

---

<a id="c1-05"></a>
### C1-05 · Tell beholdningen: «en case som man ser på tlf»?

- [x] Gjort (bekreftes med fageksperten)
- **Hvor:** Steg 7, [kurs.js:276](../content/kurs.js#L276)
- **Fra:** ikke navngitt · lysbilde 32
- **Notat:** Panelet «Beholdning i kurset» er fjernet. Tellingen er nå en rad på registreringssiden ([kurs.js:93](../content/kurs.js#L93)): deltakeren ser ny beholdning på oppsummeringsbildet i appen og sammenligner med det de teller. Det dekker begge lesningene nedenfor. Startbeholdningen (20 stk) står bare som merknad. Den må stemme med Opplæringsmodus.

> Kan det være en case her som man ser på tlf??

**Tolkning:** Usikker. Mulige lesninger:
- Panelet «Beholdning i kurset» (20 stk før, 1 stk uttak) bør erstattes av at deltakeren ser beholdningen i appen.
- Det bør være en liten situasjon her, der deltakeren må sammenligne det appen viser med det de «teller».

**❓ Avklares:** Spør fageksperten hva som menes, og om løsningen i notatet er det de så for seg.

---

<a id="c1-06"></a>
### C1-06 · Signer og lagre: ta inn dobbeltkontroll, utsette eller signere med en gang

- [x] Gjort
- **Hvor:** Steg 8, [kurs.js:290](../content/kurs.js#L290), og steg 9 «Utsett kontrollsigneringen»
- **Fra:** ikke navngitt · lysbilde 33
- **Notat:** Nytt faktasteg før signeringen om når dobbeltkontroll kreves og når den kan utsettes. Signeringssteget forklarer tæpping og ber deltakeren velge «Utsett kontrollsignering» (det tidligere steg 9).

> Her kan man ta inn noe om dobbeltkontroll og dette å utsette og det å gjøre med en gang som var I kappitelet om dobbelt kontroll

**Tolkning:** Flytt M2 steg 3 «Utsette eller signere med en gang» (og trolig steg 1 «Når kreves dobbeltkontroll?») hit. Se [K-03](03-kom-i-gang-M0-M2.md#k-03). Dette er første gang deltakeren signerer, så her hører også forklaringen av tæpping hjemme ([G-05](01-generelt.md#g-05)).

---

<a id="c1-07"></a>
### C1-07 · Varsel på OVERSIKT: unngå bildet av appen

- [x] Gjort
- **Hvor:** Steg 10, [kurs.js:303](../content/kurs.js#L303)
- **Fra:** ikke navngitt · lysbilde 35
- **Notat:** Kontrollspørsmålet sier nå «Se på startmenyen i appen» i stedet for å vise et bilde.

> Igjen er bilde av appen dette må vi prøve å unngå

**Tolkning:** Fjern den skjematiske startmenyen. Be deltakeren se etter det røde tallet på OVERSIKT i appen.
