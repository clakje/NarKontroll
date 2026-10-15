/*
 * NarKontroll opplæring · Konsept A «Veileder ved siden av»
 *
 * Venstre kolonne: modul, historie og det ene steget deltakeren skal gjøre nå.
 * Høyre kolonne («skannesonen»): det steget trenger. I et registrer-steg er det hele registreringen
 * i appens rekkefølge, med QR-kodene og mengden på samme side. Ellers er det QR-koden eller ID-kortet.
 *
 * Hovedmenyen (#meny) er startsiden. Der velger deltakeren modul eller case, og dit kommer
 * de tilbake når en modul er fullført.
 *
 * Adresse: #meny, eller #<modul-id>/<steg-nr>, for eksempel #case-1/3.
 * Utviklermodus: index.html?dev=1 eller Alt+Shift+D.
 */
(function () {
  "use strict";

  var KURS = window.KURS;
  var KODER = window.KODER || {};
  var SKJERMER = window.SKJERMER || {};
  var MODULER = KURS.moduler;
  var SCORM = window.SCORM;

  var APPKNAPPER = {
    uttak:        { merke: "UTTAK til pasient",               farge: "var(--app-uttak)",    navn: "UTTAK",           under: "til pasient",            ikon: "minus" },
    tilbakelegge: { merke: "TILBAKELEGGE fra pasient",        farge: "var(--app-uttak)",    navn: "TILBAKELEGGE",    under: "fra pasient",            ikon: "pluss" },
    overfore:     { merke: "OVERFØRE til eget underlager",    farge: "var(--app-overfore)", navn: "OVERFØRE til",    under: "eget underlager",        ikon: "skuff" },
    tilbakefore:  { merke: "TILBAKEFØRE fra eget underlager", farge: "#C9C9CE",             navn: "TILBAKEFØRE fra", under: "eget underlager",        ikon: "skuff", deaktivert: true },
    apotek:       { merke: "APOTEKET",                        farge: "var(--app-apotek)",   navn: "APOTEKET",        under: "Mottak fra / Retur til", ikon: "kors", hel: true, underForst: true },
    kassere:      { merke: "KASSERE små rester",              farge: "var(--app-rod)",      navn: "KASSERE",         under: "små rester lokalt",      ikon: "soppel" },
    lan:          { merke: "LÅN til/fra annen enhet",         farge: "var(--app-rod)",      navn: "LÅN",             under: "til/fra annen enhet",    ikon: "retur" },
    kontroll:     { merke: "KONTROLL av beholdning",          farge: "var(--app-kontroll)", navn: "KONTROLL",        under: "av beholdning",          ikon: "merke" },
    oversikt:     { merke: "OVERSIKT",                        farge: "var(--app-oversikt)", navn: "OVERSIKT",        under: "Dobbeltkontroll<br>Avvik<br>Siste" }
  };
  var MENYREKKEFOLGE = ["uttak", "tilbakelegge", "overfore", "tilbakefore", "apotek", "kassere", "lan", "kontroll", "oversikt"];

  var STEGTYPER = {
    fortelling: { etikett: "Situasjon",        ikon: "i-bok" },
    registrer:  { etikett: "Beskrivelse",      ikon: "i-trykk" },
    instruks:   { etikett: "Beskrivelse",      ikon: "i-trykk" },
    skann:      { etikett: "Skann",            ikon: "i-qr" },
    mengde:     { etikett: "Angi mengde",      ikon: "i-tall" },
    appskjerm:  { etikett: "Se i appen",       ikon: "i-oye" },
    signer:     { etikett: "Signer",           ikon: "i-nfc" },
    valg:       { etikett: "Velg i appen",     ikon: "i-bryter" },
    sporsmal:   { etikett: "Kontrollspørsmål", ikon: "i-sporsmal" },
    obs:        { etikett: "Obs",              ikon: "i-obs" },
    info:       { etikett: "Godt å vite",      ikon: "i-info" }
  };

  /* ───────────── Tilstand ───────────── */

  var tilstand = nyTilstand();
  var visning = "meny";      // "meny" eller "modul"
  var nyligFerdig = null;    // modul-ID som hovedmenyen gratulerer med
  var dev = false;
  var devLukket = true;       // panelet starter sammenfoldet, så det ikke dekker steget
  var signerte = 0;          // ID-kort-tæpp på gjeldende steg (dev)
  var skannet = {};          // rader i et registrer-steg som er skannet (dev)
  var valgtSvar = null;      // valgt alternativ før «Sjekk svar»
  var venter = false;        // skann-animasjon pågår

  function nyTilstand() {
    return { m: 0, s: 0, ferdig: {}, sett: {}, svar: {} };
  }

  var $ = function (sel, rot) { return (rot || document).querySelector(sel); };

  /* ───────────── Hjelpere ───────────── */

  function esc(t) {
    return String(t == null ? "" : t)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  // Tekst fra innholdet: **fet**, [AVKLARES: …] og {ikon:opplaeringsmodus} (bilde fra assets/)
  function fmt(t) {
    return esc(t)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\[AVKLARES:\s*([^\]]*)\]/g, '<mark class="avklares">AVKLARES: $1</mark>')
      .replace(/\{ikon:([a-z-]+)\}/g, '<img class="tekstikon" src="assets/ikon-$1.svg" alt="">');
  }

  function ren(t) {
    return String(t || "").replace(/\*\*/g, "").replace(/\s*\[AVKLARES:[^\]]*\]/g, "").replace(/\s*\{ikon:[a-z-]+\}/g, "");
  }

  function ikon(id, klasse) {
    return '<svg class="ikon' + (klasse ? " " + klasse : "") + '" aria-hidden="true"><use href="#' + id + '"/></svg>';
  }

  function tall(v) { return String(v).replace(".", ","); }

  function modul(i) { return MODULER[i == null ? tilstand.m : i]; }
  function steg(m, s) { return modul(m).steg[s == null ? tilstand.s : s]; }
  function svarNokkel(m, s) { return modul(m).id + ":" + s; }
  function erSisteModul(m) { return m === MODULER.length - 1; }
  function erSisteSteg(m, s) { return s === modul(m).steg.length - 1; }

  function modulIndeks(id) {
    for (var i = 0; i < MODULER.length; i++) if (MODULER[i].id === id) return i;
    return -1;
  }

  function modulStatus(i) {
    var m = MODULER[i], sett = tilstand.sett[m.id];
    // kort: teksten ved statusmerket på modulkortet i hovedmenyen (kortene er smale)
    if (tilstand.ferdig[m.id]) return { kode: "ferdig", tekst: "Fullført", kort: "", handling: "Ta på nytt" };
    if (sett != null) return { kode: "pabegynt", tekst: "Påbegynt, steg " + (sett + 1) + " av " + m.steg.length, kort: (sett + 1) + "/" + m.steg.length, handling: "Fortsett" };
    return { kode: "ikke", tekst: "Ikke startet", kort: "", handling: "Start" };
  }

  // Gruppene i hovedmenyen. Moduler som ikke står i noen gruppe, havner til slutt.
  function grupper() {
    var brukt = {}, liste = [];
    (KURS.grupper || []).forEach(function (g) {
      var idx = g.moduler.map(modulIndeks).filter(function (i) { return i >= 0; });
      idx.forEach(function (i) { brukt[i] = true; });
      if (idx.length) liste.push({ tittel: g.tittel, tekst: g.tekst, moduler: idx });
    });
    var rest = MODULER.map(function (m, i) { return i; }).filter(function (i) { return !brukt[i]; });
    if (rest.length) liste.push({ tittel: liste.length ? "Andre moduler" : "Moduler", moduler: rest });
    return liste;
  }

  // Påbegynt modul der deltakeren sist var, ellers første ufullførte i anbefalt rekkefølge
  function anbefaltNeste() {
    var id = modul().id;
    if (!tilstand.ferdig[id] && tilstand.sett[id] != null) return tilstand.m;
    var rekke = [].concat.apply([], grupper().map(function (g) { return g.moduler; }));
    for (var i = 0; i < rekke.length; i++) if (!tilstand.ferdig[MODULER[rekke[i]].id]) return rekke[i];
    return -1;
  }

  function modulNavn(m) { return m.eyebrow + ": " + ren(m.tittel); }

  function antallSporsmal() {
    var n = 0;
    MODULER.forEach(function (m) { m.steg.forEach(function (s) { if (s.type === "sporsmal") n++; }); });
    return n;
  }

  function poeng() {
    var totalt = antallSporsmal(), riktige = 0, besvart = 0;
    Object.keys(tilstand.svar).forEach(function (k) {
      besvart++;
      if (tilstand.svar[k][1] === 1) riktige++;
    });
    return { totalt: totalt, riktige: riktige, besvart: besvart, prosent: totalt ? Math.round((riktige / totalt) * 100) : 0 };
  }

  function antallFerdig() {
    return MODULER.filter(function (m) { return tilstand.ferdig[m.id]; }).length;
  }

  /* ───────────── QR ───────────── */

  var qrBuffer = {};
  function qrSvg(payload, merkelapp) {
    if (!qrBuffer[payload]) {
      var q = window.qrcode(0, "M");
      q.addData(payload);
      q.make();
      var n = q.getModuleCount(), marg = 4, str = n + marg * 2, d = "";
      for (var r = 0; r < n; r++) {
        for (var c = 0; c < n; c++) {
          if (q.isDark(r, c)) d += "M" + (c + marg) + " " + (r + marg) + "h1v1h-1z";
        }
      }
      qrBuffer[payload] = '<svg viewBox="0 0 ' + str + " " + str + '" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<rect width="' + str + '" height="' + str + '" fill="#fff"/><path d="' + d + '" fill="#000"/></svg>';
    }
    return qrBuffer[payload];
  }

  /* ───────────── Lagring (SCORM) ───────────── */

  function lagre() {
    var data = {
      v: 1,
      k: KURS.versjon,
      m: modul().id,
      s: tilstand.s,
      f: Object.keys(tilstand.ferdig),
      x: tilstand.sett,
      q: tilstand.svar
    };
    SCORM.set("cmi.suspend_data", JSON.stringify(data));
    SCORM.set("cmi.core.lesson_location", modul().id + ":" + tilstand.s);

    // Score først når noe er besvart, ellers ser 0 ut som et resultat i LMS-et
    var p = poeng();
    if (p.besvart > 0) {
      SCORM.set("cmi.core.score.min", "0");
      SCORM.set("cmi.core.score.max", "100");
      SCORM.set("cmi.core.score.raw", String(p.prosent));
    }

    if (antallFerdig() === MODULER.length && SCORM.get("cmi.core.lesson_status") !== "completed") {
      SCORM.set("cmi.core.lesson_status", "completed");
    }
    SCORM.commit();
  }

  function hent() {
    var raa = SCORM.get("cmi.suspend_data");
    if (!raa) return;
    try {
      var d = JSON.parse(raa);
      // Ny kursversjon kan ha nummerert stegene på nytt. Da gjelder ikke lagrede stegnummer og svar
      // lenger, men fullførte moduler står seg.
      var sammeVersjon = d.k === KURS.versjon;
      var mi = modulIndeks(d.m);
      tilstand.m = mi >= 0 ? mi : 0;
      tilstand.s = sammeVersjon ? Math.min(Math.max(0, d.s | 0), modul().steg.length - 1) : 0;
      (d.f || []).forEach(function (id) { if (modulIndeks(id) >= 0) tilstand.ferdig[id] = true; });
      tilstand.sett = sammeVersjon ? d.x || {} : {};
      // En modul kan ha fått færre steg siden fremdriften ble lagret
      MODULER.forEach(function (m) { if (tilstand.sett[m.id] != null) tilstand.sett[m.id] = Math.min(tilstand.sett[m.id], m.steg.length - 1); });
      tilstand.svar = sammeVersjon ? d.q || {} : {};
    } catch (e) {
      console.warn("Kunne ikke lese suspend_data", e);
    }
  }

  /* ───────────── Navigasjon ───────────── */

  function gaTil(m, s, opts) {
    opts = opts || {};
    m = Math.max(0, Math.min(MODULER.length - 1, m));
    s = Math.max(0, Math.min(modul(m).steg.length - 1, s));
    visning = "modul";
    nyligFerdig = null;
    tilstand.m = m;
    tilstand.s = s;
    var id = modul(m).id;
    tilstand.sett[id] = Math.max(tilstand.sett[id] == null ? -1 : tilstand.sett[id], s);
    signerte = 0;
    skannet = {};
    valgtSvar = null;
    venter = false;
    try { history.replaceState(null, "", "#" + id + "/" + (s + 1)); } catch (e) { /* file:// i enkelte nettlesere */ }
    lagre();
    tegn(opts.fokus !== false);
  }

  function neste() {
    if (venter) return;
    var st = steg();
    if (st.type === "sporsmal" && !tilstand.svar[svarNokkel(tilstand.m, tilstand.s)]) {
      sjekkSvar();
      return;
    }
    if (!erSisteSteg(tilstand.m, tilstand.s)) {
      gaTil(tilstand.m, tilstand.s + 1);
      return;
    }
    // Ferdig modul: tilbake til hovedmenyen, som viser hva som er neste
    tilstand.ferdig[modul().id] = true;
    visMeny({ ferdig: modul().id });
  }

  function forrige() {
    if (venter) return;
    if (tilstand.s > 0) gaTil(tilstand.m, tilstand.s - 1);
    else visMeny();
  }

  function visMeny(opts) {
    opts = opts || {};
    visning = "meny";
    nyligFerdig = opts.ferdig || null;
    signerte = 0;
    valgtSvar = null;
    venter = false;
    try { history.replaceState(null, "", "#meny"); } catch (e) { /* file:// i enkelte nettlesere */ }
    lagre();
    tegn(opts.fokus !== false);
  }

  function sjekkSvar() {
    if (valgtSvar == null) return;
    var st = steg();
    var riktig = st.alternativer[valgtSvar] === st.fasit;
    tilstand.svar[svarNokkel(tilstand.m, tilstand.s)] = [valgtSvar, riktig ? 1 : 0];
    lagre();
    tegn(false);
    var tb = $("#tilbakemelding");
    if (tb) tb.focus();
  }

  function kunngjor(tekst) {
    var el = $("#kunngjoring");
    el.textContent = "";
    setTimeout(function () { el.textContent = tekst; }, 30);
  }

  /* ───────────── Tegning ───────────── */

  function tegn(flyttFokus) {
    document.body.setAttribute("data-visning", visning);
    $("#app").setAttribute("data-visning", visning);
    tegnPlassering();

    if (visning === "meny") {
      document.title = "Hovedmeny – NarKontroll opplæring";
      $("#app").innerHTML = menyHtml();
      if (dev) tegnDev();
      if (flyttFokus) {
        var mal = $("#meny-fremdrift-tittel") && nyligFerdig ? $("#meny-fremdrift-tittel") : $("#meny-tittel");
        mal.focus({ preventScroll: true });
        window.scrollTo(0, 0);
        kunngjor("Hovedmeny. " + (nyligFerdig ? mal.textContent : "Velg en modul eller et case."));
      }
      return;
    }

    var mod = modul(), st = steg();
    document.title = ren(mod.eyebrow) + ": " + ren(mod.tittel) + " – NarKontroll opplæring";

    $("#app").innerHTML = veilederHtml(mod, st) + (st.iKortet ? "" : soneHtml(mod, st));
    if (dev) tegnDev();

    if (flyttFokus) {
      var kort = $("#steg");
      if (kort) kort.focus({ preventScroll: true });
      window.scrollTo(0, 0);
      kunngjor("Steg " + (tilstand.s + 1) + " av " + mod.steg.length + ". " + ren(st.tittel || st.tekst));
    }
  }

  function veilederHtml(mod, st) {
    var t = STEGTYPER[st.type] || STEGTYPER.info;
    var n = mod.steg.length;
    var knapp = mod.knapp && APPKNAPPER[mod.knapp];

    var prikker = "";
    for (var i = 0; i < n; i++) {
      var s = i < tilstand.s ? "ferdig" : i === tilstand.s ? "aktiv" : "";
      prikker += '<span data-s="' + s + '"></span>';
    }

    var h = '<section class="veileder" aria-labelledby="modul-tittel">';

    // Case: merkelappen viser allerede tittelen, så h1 skjules visuelt og raden forstørres.
    // CASE-etiketten står da som overskrift i historieboksen i stedet for i toppraden.
    var caseIHistorie = knapp && mod.kortTekst;
    h += '<div class="modul-topp' + (knapp ? " modul-topp--case" : "") + '"><div class="eyebrow-rad">';
    if (!caseIHistorie) h += '<span class="eyebrow">' + esc(mod.eyebrow) + "</span>";
    if (knapp) h += '<span class="appmerke" style="--f:' + knapp.farge + '">' + esc(knapp.merke) + "</span>";
    if (mod.utkast) h += '<span class="merkelapp">Utkast, ikke faglig godkjent</span>';
    h += '</div><h1 class="modul-tittel' + (knapp ? " sr" : "") + '" id="modul-tittel">' + fmt(mod.tittel) + "</h1></div>";

    if (caseIHistorie) {
      h += '<div class="historie historie--case"><p class="historie-tittel">' + esc(mod.eyebrow) + "</p><p>" + fmt(mod.kortTekst) + "</p></div>";
    } else if (mod.kortTekst) {
      h += '<div class="historie">' + ikon(mod.knapp ? "i-bok" : "i-info") + "<p>" + fmt(mod.kortTekst) + "</p></div>";
    }

    // Stegtelleren står øverst inne i stegkortet
    var teller = '<div class="stegteller"><span>Steg <strong>' + (tilstand.s + 1) + "</strong> av " + n + '</span><div class="stegprikker" aria-hidden="true">' + prikker + "</div></div>";

    if (st.iKortet) {
      // Innholdet fra skannesonen står i selve stegkortet, og sonen til høyre vises ikke
      var panel = velgPanel(st);
      h += '<article class="stegkort inn" id="steg" tabindex="-1" data-type="' + st.type + '" data-ikortet aria-label="' + esc(panel.etikett) + '">' + teller;
      h += '<div class="sone-eyebrow"><p class="stegtype">' + ikon(panel.ikon) + esc(panel.etikett) + "</p>" + (panel.hoyre || "") + "</div>";
      h += panel.html;
    } else if (st.type === "sporsmal") {
      h += '<article class="stegkort inn" id="steg" tabindex="-1" data-type="' + st.type + '" aria-labelledby="steg-tittel">' + teller;
      h += '<p class="stegtype">' + ikon(t.ikon) + esc(t.etikett) + "</p>";
      h += '<h2 class="stegtittel" id="steg-tittel">' + fmt(st.tekst) + "</h2>";
      h += sporsmalHtml(st);
    } else {
      h += '<article class="stegkort inn" id="steg" tabindex="-1" data-type="' + st.type + '" aria-labelledby="steg-tittel">' + teller;
      h += '<p class="stegtype">' + ikon(t.ikon) + esc(t.etikett) + "</p>";
      if (st.tittel) {
        h += '<h2 class="stegtittel" id="steg-tittel">' + fmt(st.tittel) + "</h2>";
        if (st.tekst) h += '<p class="stegtekst">' + fmt(st.tekst) + "</p>";
      } else {
        h += '<h2 class="stegtittel" id="steg-tittel">' + fmt(st.tekst) + "</h2>";
      }
      if (st.punkter) h += '<ul class="punkter">' + st.punkter.map(function (p) { return "<li>" + fmt(p) + "</li>"; }).join("") + "</ul>";
      if (st.tips) h += '<p class="tips">' + ikon("i-info") + "<span>" + fmt(st.tips) + "</span></p>";
    }
    h += "</article>";

    h += navradHtml(st);

    var modus = SCORM.modus;
    h += '<p class="status-linje"><span class="status-prikk" data-modus="' + modus + '" aria-hidden="true"></span>' +
      (modus === "lms" ? "Fremdriften lagres i LMS." : "Lokal testmodus: fremdriften lagres bare i denne nettleseren.") + "</p>";

    h += "</section>";
    return h;
  }

  function navradHtml(st) {
    var forste = tilstand.s === 0;
    var sist = erSisteSteg(tilstand.m, tilstand.s);
    var besvart = tilstand.svar[svarNokkel(tilstand.m, tilstand.s)];
    var label, deaktivert = false, ikonId = "i-neste";

    if (st.type === "sporsmal" && !besvart) {
      label = "Sjekk svar";
      deaktivert = valgtSvar == null;
      ikonId = "i-sjekk";
    } else if (sist && erSisteModul(tilstand.m)) {
      if (antallFerdig() === MODULER.length) { label = "Til hovedmenyen"; ikonId = "i-hjem"; }
      else { label = "Fullfør kurset"; ikonId = "i-sjekk"; }
    } else if (sist) {
      label = modul().knapp ? "Fullfør casen" : "Fullfør modulen";
      ikonId = "i-sjekk";
    } else {
      label = { skann: "Skannet, neste", signer: "Signert, neste", registrer: "Ferdig, neste", instruks: "Ferdig, neste", mengde: "Ferdig, neste", valg: "Ferdig, neste" }[st.type] || "Neste";
    }

    return '<div class="navrad">' +
      (forste
        ? '<button class="knapp knapp-sekundar" type="button" data-handling="meny">' + ikon("i-hjem") + "<span>Hovedmeny</span></button>"
        : '<button class="knapp knapp-sekundar" type="button" data-handling="forrige">' + ikon("i-forrige") + "<span>Tilbake</span></button>") +
      '<div class="navrad-hoyre"><span class="tastatur-hint" aria-hidden="true"><kbd>←</kbd> <kbd>→</kbd> for å bla</span>' +
      '<button class="knapp knapp-primar knapp-stor" type="button" id="knapp-neste" data-handling="neste"' + (deaktivert ? " disabled" : "") + "><span>" + esc(label) + "</span>" + ikon(ikonId) + "</button></div>" +
      "</div>";
  }

  function sporsmalHtml(st) {
    var besvart = tilstand.svar[svarNokkel(tilstand.m, tilstand.s)];
    var h = '<fieldset class="svar-liste"' + (besvart ? " data-laast" : "") + '><legend class="sr">Velg ett svar</legend>';
    st.alternativer.forEach(function (alt, i) {
      var res = "", status = "";
      if (besvart) {
        if (alt === st.fasit) { res = "riktig"; status = ikon("i-sjekk") + (besvart[0] === i ? "Ditt svar, riktig" : "Riktig svar"); }
        else if (besvart[0] === i) { res = "feil"; status = ikon("i-kryss") + "Ditt svar"; }
      }
      var valgt = besvart ? besvart[0] === i : valgtSvar === i;
      h += '<label class="svar"' + (res ? ' data-resultat="' + res + '"' : "") + ">" +
        '<input type="radio" name="svar" value="' + i + '"' + (valgt ? " checked" : "") + (besvart ? " disabled" : "") + ">" +
        '<span class="svar-markor" aria-hidden="true"></span><span>' + fmt(alt) + "</span>" +
        (status ? '<span class="svar-status">' + status + "</span>" : "") + "</label>";
    });
    h += "</fieldset>";
    if (besvart) {
      var ok = besvart[1] === 1;
      h += '<div class="tilbakemelding" id="tilbakemelding" tabindex="-1" role="status" data-resultat="' + (ok ? "riktig" : "feil") + '">' +
        ikon(ok ? "i-sjekk" : "i-info") + "<p><strong>" + (ok ? "Riktig." : "Ikke helt. Riktig svar er " + esc(st.fasit) + ".") + "</strong> " + fmt(st.forklaring || "") + "</p></div>";
    }
    return h;
  }

  /* ───────────── Skannesonen ───────────── */

  function soneHtml(mod, st) {
    var panel = velgPanel(st);
    if (panel.ingen) return "";
    var h = '<aside class="sone" aria-label="Skannesone"' + (panel.stille ? " data-stille" : "") + (panel.rekke ? " data-rekke" : "") + ">";
    h += '<div class="sone-eyebrow"><span class="eyebrow">' + ikon(panel.ikon) + esc(panel.etikett) + "</span>" + (panel.hoyre || "") + "</div>";
    h += '<div class="sone-innhold inn">' + panel.html + "</div>";
    h += "</aside>";
    return h;
  }

  function velgPanel(st) {
    var p = st.panel;
    if (st.type === "registrer") {
      var harKode = (st.rekke || []).some(function (r) { return r.kode; });
      return { etikett: "Gjør dette i appen", ikon: "i-trykk", rekke: true, html: rekkeHtml(st.rekke || []),
        hoyre: harKode ? '<span class="sone-hoyre">Skann fra ca. 20 cm</span>' : "" };
    }
    if (p && p.type === "fakta") return { etikett: "Til hjelp", ikon: "i-info", html: faktaHtml(p) };
    if (p && p.type === "resultat") return { etikett: "Resultat", ikon: "i-sjekk", html: resultatHtml() };
    if (p && p.type === "idkort") return { etikett: "Kontroller ID-kortet", ikon: "i-kort", html: idkortHtml(p.idkort, { kunKort: true }) };

    if (st.type === "skann") return qrPanel(st);
    if (st.type === "signer") return { etikett: "Tæpp ID-kortet", ikon: "i-nfc", html: idkortHtml(st.idkort, { antall: st.antall || 1, forklar: st.forklar }) };
    if (st.type === "mengde") return { etikett: "Skriv inn i appen", ikon: "i-tall", html: mengdeHtml(st) };
    if (st.type === "valg") return { etikett: "Velg i appen", ikon: "i-bryter", html: valgHtml(st.valg) };
    if (st.meny) return { etikett: "Startmenyen i appen", ikon: "i-trykk", html: startmenyHtml(st.meny, st.type === "instruks") };
    if (st.skjerm) return { etikett: "Slik ser det ut i appen", ikon: "i-oye", html: plassholderHtml(st.skjerm) };
    // Kontrollspørsmål uten eget panel får ingen skannesone, bare stegkortet
    if (st.type === "sporsmal") return { etikett: "Kontrollspørsmål", ikon: "i-sporsmal", ingen: true };
    if (st.type === "obs") return { etikett: "Obs", ikon: "i-obs", stille: true, html: stilleHtml("i-obs", "Les dette før du går videre.") };
    return { etikett: "Les og gå videre", ikon: "i-info", stille: true, html: stilleHtml("i-bok", "Ingen skanning i dette steget.") };
  }

  // QR-koden som knapp i utviklermodus (klikk = skannet), ellers som bilde.
  // rad: radnummer i et registrer-steg. Uten rad går klikket videre til neste steg.
  function qrFlateHtml(kodeId, rad) {
    var k = KODER[kodeId], navn = esc(k.navn);
    var ferdig = rad != null && skannet[rad];
    var flate = dev
      ? '<button class="qr-flate' + (ferdig ? " skannet" : "") + '" type="button" data-handling="skann"' + (rad != null ? ' data-rad="' + rad + '"' : "") + ' aria-label="Simuler skanning av ' + navn + '">'
      : '<div class="qr-flate" role="img" aria-label="QR-kode for ' + navn + ", " + esc(kodeId) + ', dummy">';
    flate += qrSvg(k.payload) + '<span class="skannelinje"></span><span class="skannet-hake">' + ikon("i-sjekk") + "</span>";
    return flate + (dev ? "</button>" : "</div>");
  }

  function kodeMetaHtml(kodeId) {
    return '<p class="qr-meta"><span class="kode-id">' + esc(kodeId) + '</span><span class="dummy" title="Plassholderkode. Den ekte appen kjenner den ikke igjen ennå.">DUMMY</span></p>';
  }

  function qrPanel(st) {
    var k = KODER[st.kode];
    if (!k) return { etikett: "Mangler kode", ikon: "i-obs", html: stilleHtml("i-obs", "Koden " + st.kode + " finnes ikke i koder.js.") };
    var html = '<div class="sokeramme">' + qrFlateHtml(st.kode) + "</div>" +
      '<div class="qr-etikett"><p class="qr-navn">' + esc(k.navn) + "</p>" + kodeMetaHtml(st.kode) + "</div>";
    if (!st.tips) html += '<p class="sone-tekst">Hold telefonen ca. 20 cm fra skjermen.</p>';
    if (dev) html += '<span class="dev-hint">' + ikon("i-verktoy") + "Klikk koden for å skanne</span>";
    return { etikett: "Skann med NarKontroll", ikon: "i-qr", html: html };
  }

  // Hele registreringen på én side: det deltakeren gjør i appen, i appens rekkefølge,
  // med QR-koden og mengden på raden der de trengs.
  // Rad: { tekst, kode?, mengde?, enhet?, merknad? }
  function rekkeHtml(rekke) {
    var h = '<ol class="rekke">' + rekke.map(function (r, i) {
      var k = r.kode && KODER[r.kode];
      var rad = '<li class="rekke-rad"' + (k ? " data-qr" : "") + '><span class="rekke-nr" aria-hidden="true">' + (i + 1) + "</span>" +
        '<div class="rekke-tekst"><p>' + fmt(r.tekst) + "</p>";
      if (r.kode && !k) rad += '<p class="rekke-merknad">' + ikon("i-obs") + "Koden " + esc(r.kode) + " finnes ikke i koder.js.</p>";
      if (k) rad += '<p class="rekke-navn">' + esc(k.navn) + "</p>" + kodeMetaHtml(r.kode);
      if (r.mengde != null) {
        rad += '<p class="rekke-mengde"><span class="rekke-mengde-etikett">Mengde</span><b>' + esc(tall(r.mengde)) + "</b> " + fmt(r.enhet || "") + "</p>";
      }
      if (r.merknad) rad += '<p class="rekke-merknad">' + fmt(r.merknad) + "</p>";
      rad += "</div>";
      if (k) rad += '<div class="rekke-qr">' + qrFlateHtml(r.kode, i) + "</div>";
      return rad + "</li>";
    }).join("") + "</ol>";
    if (dev && rekke.some(function (r) { return r.kode; })) h += '<span class="dev-hint">' + ikon("i-verktoy") + "Klikk en kode for å skanne</span>";
    return h;
  }

  function idkortHtml(kortId, opts) {
    var k = KODER[kortId] || { navn: "Deg", rolle: "" };
    var antall = opts.antall || 1;
    var kanKlikke = dev && !opts.kunKort;
    var tag = kanKlikke ? "button" : "div";
    var attr = kanKlikke
      ? ' type="button" data-handling="taepp" aria-label="Simuler at ID-kortet tæppes' + (antall > 1 ? ", " + (signerte + 1) + " av " + antall : "") + '"'
      : ' role="img" aria-label="ID-kort: ' + esc(k.navn) + '"';

    var h = '<div class="idkort-scene">';
    h += "<" + tag + ' class="idkort"' + attr + ">" +
      '<span class="idkort-topp"><span>ID-kort</span>' + ikon("i-nfc") + "</span>" +
      '<span class="idkort-foto">' + ikon("i-person") + "</span>" +
      '<span class="idkort-navn">' + esc(k.navn) + "</span>" +
      '<span class="idkort-rolle">' + esc(k.rolle) + "</span></" + tag + ">";

    if (opts.kunKort) {
      h += '<p class="sone-tekst">Sjekk at navn og bilde stemmer med personen foran deg.</p>';
    } else {
      // Hvor leseren sitter, forklares én gang (steget har forklar: true). Senere ligger det bak en lenke.
      var modeller = [
        ["iphone", "iPhone", "Øverst, ved kameraet"],
        ["samsung", "Samsung Galaxy", "Midt på"],
        ["pixel", "Google Pixel", "Under kamerastripen"]
      ];
      var modellHtml = '<ul class="taepp-modeller">' +
        modeller.map(function (m) {
          return '<li><span class="taepp-tlf" data-modell="' + m[0] + '" aria-hidden="true"><span class="taepp-kamera"></span></span>' +
            "<b>" + m[1] + "</b><span>" + m[2] + "</span></li>";
        }).join("") +
        '</ul><p class="taepp-merknad">Andre Android-telefoner: prøv midt på baksiden.</p>';
      var linje = "Tæpp kortet mot <strong>baksiden</strong> av telefonen" + (antall > 1 ? ", to ganger" : "");
      h += opts.forklar
        ? '<div class="taepp"><p class="taepp-tekst">' + linje + ". Hvor leseren sitter, varierer:</p>" + modellHtml + "</div>"
        : '<div class="taepp"><p class="taepp-tekst">' + linje + '.</p><details class="taepp-mer"><summary>Hvor sitter leseren?</summary>' + modellHtml + "</details></div>";
      if (antall > 1) {
        h += '<div class="signaturer" aria-label="Signaturer">';
        for (var i = 0; i < antall; i++) {
          var ok = i < signerte;
          h += '<span class="signatur"' + (ok ? " data-signert" : "") + ">" + ikon(ok ? "i-sjekk" : "i-nfc") + "Bruker " + (i + 1) + (ok ? ", signert" : "") + "</span>";
        }
        h += "</div>";
      }
      if (dev) h += '<span class="dev-hint">' + ikon("i-verktoy") + "Klikk kortet for å tæppe</span>";
    }
    return h + "</div>";
  }

  function mengdeHtml(st) {
    return '<div class="mengde" role="img" aria-label="Mengde: ' + esc(tall(st.verdi)) + " " + esc(ren(st.enhet)) + '">' +
      '<span class="mengde-etikett">Mengde</span>' +
      '<span class="mengde-verdi"><b>' + esc(tall(st.verdi)) + "</b><span>" + fmt(st.enhet) + "</span></span></div>" +
      '<p class="sone-tekst">Desimaltall skrives med komma, for eksempel 1,5.</p>';
  }

  function valgHtml(v) {
    var h = '<div class="valgark" role="img" aria-label="Skjematisk: ' + esc(v.form === "bryter" ? v.etikett + " slått på" : "velg " + v.velg) + '">';
    if (v.form === "bryter") {
      h += '<div class="valgark-rad" data-valgt><span>' + esc(v.etikett) + '</span><span style="display:flex;align-items:center"><span class="bryter-tekst">PÅ</span><span class="bryter"></span></span></div>';
    } else {
      v.alternativer.forEach(function (a) {
        var valgt = a === v.velg;
        h += '<div class="valgark-rad"' + (valgt ? " data-valgt" : "") + "><span>" + esc(a) + "</span>" + (valgt ? ikon("i-sjekk") : "") + "</div>";
      });
    }
    h += "</div>";
    return h + '<p class="bildetekst"><span class="merkelapp">Skjematisk</span>Tekstene i appen kan avvike</p>';
  }

  function faktaHtml(p) {
    return '<div class="fakta"><p class="fakta-tittel">' + esc(p.tittel || "") + "</p><dl>" +
      p.rader.map(function (r) { return '<div class="fakta-rad"><dt>' + fmt(r[0]) + "</dt><dd>" + fmt(r[1]) + "</dd></div>"; }).join("") +
      "</dl>" + (p.merknad ? '<p class="fakta-merknad">' + fmt(p.merknad) + "</p>" : "") + "</div>";
  }

  function stilleHtml(ikonId, tekst) {
    return '<div class="slik-ikon" style="width:72px;height:72px;border-radius:24px">' + ikon(ikonId) + '</div><p class="sone-tekst">' + esc(tekst) + "</p>";
  }

  function plassholderHtml(id) {
    var s = SKJERMER[id] || { beskrivelse: "Ukjent skjerm" };
    var innhold = s.bilde
      ? '<img src="assets/skjermbilder/' + esc(s.bilde) + '" alt="' + esc(s.beskrivelse) + '">'
      : '<div class="plassholder">' + ikon("i-skjerm") + '<span class="plassholder-id">SKJERM ' + esc(id) + '</span><span class="plassholder-tekst">' + esc(s.beskrivelse) + "</span></div>";
    return '<div class="telefon"' + (s.bilde ? "" : ' role="img" aria-label="Plassholder for skjermbilde: ' + esc(s.beskrivelse) + '"') + '><div class="telefon-skjerm">' + innhold + "</div></div>" +
      (s.bilde ? "" : '<p class="bildetekst"><span class="merkelapp">Plassholder</span>Ekte skjermbilde kommer</p>');
  }

  var SM_IKON = {
    minus: "M5 12h14",
    pluss: "M12 5v14M5 12h14",
    skuff: "M3 13l3-8h12l3 8v6H3zM3 13h5l1 2h6l1-2h5",
    kors: "M9 3h6v6h6v6h-6v6H9v-6H3V9h6z",
    soppel: "M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13",
    retur: "M9 14l-4-4 4-4M5 10h10a4 4 0 0 1 0 8h-3",
    merke: "M12 3l2.4 1.8 3-.2.9 2.9 2.4 1.8-1 2.8 1 2.8-2.4 1.8-.9 2.9-3-.2L12 21l-2.4-1.8-3 .2-.9-2.9-2.4-1.8 1-2.8-1-2.8 2.4-1.8.9-2.9 3 .2zM8.5 12l2.5 2.5 4.5-5"
  };

  function startmenyHtml(meny, visPeker) {
    var fremhev = meny.skjulFremhev ? [] : (meny.fremhev || []);
    var badge = meny.badge || 0;
    var h = '<div class="startmeny"' + (fremhev.length ? " data-fokus" : "") + ">";
    h += '<div class="sm-topp"><div class="sm-bruker">Pålogget bruker:<strong>Opplæringsmodus</strong></div>' +
      '<div class="sm-logg"><svg aria-hidden="true"><use href="#nk-mark"/></svg>Logg av</div></div>';
    h += '<div class="sm-lager">TEST Medisinrom 1</div><div class="sm-rutenett">';
    MENYREKKEFOLGE.forEach(function (id) {
      var k = APPKNAPPER[id];
      var fr = fremhev.indexOf(id) >= 0;
      var ik = k.ikon ? '<svg class="ikon" style="width:16px;height:16px" viewBox="0 0 24 24" aria-hidden="true"><path d="' + SM_IKON[k.ikon] + '"/></svg>' : "";
      var tekst = k.underForst ? "<small>" + k.under + "</small><b>" + k.navn + "</b>" : "<b>" + k.navn + "</b><small>" + k.under + "</small>";
      h += '<div class="sm-knapp sm-' + id + (k.hel ? " sm-hel" : "") + '"' + (fr ? " data-fremhev" : "") + ">" + ik + tekst +
        (id === "oversikt" && badge ? '<span class="sm-badge">' + badge + "</span>" : "") +
        (fr && visPeker ? '<span class="sm-peker">Trykk her</span>' : "") + "</div>";
    });
    h += '</div><div class="sm-bunn"><span>⚙︎</span><span>ⓘ 4.0</span></div></div>';

    var beskr = "Skjematisk startmeny for TEST Medisinrom 1.";
    if (fremhev.length) beskr += " Fremhevet: " + fremhev.map(function (id) { return APPKNAPPER[id].merke; }).join(" og ") + ".";
    if (badge) beskr += " OVERSIKT viser et rødt varsel med tallet " + badge + ".";
    else if (meny.badge === 0) beskr += " OVERSIKT har ikke noe varsel.";

    return '<div class="telefon" role="img" aria-label="' + esc(beskr) + '"><div class="telefon-skjerm">' + h + "</div></div>" +
      '<p class="bildetekst"><span class="merkelapp">Skjematisk</span>Bygget etter skjermbildet av appen</p>';
  }

  function resultatHtml() {
    var p = poeng(), ferdige = antallFerdig(), alle = ferdige === MODULER.length;
    // Siste modul regnes som ferdig først når «Fullfør kurset» er trykket
    var gjenstar = MODULER.filter(function (m, i) { return !tilstand.ferdig[m.id] && i !== MODULER.length - 1; });
    var h = '<div class="resultat">' +
      '<svg class="resultat-merke" aria-hidden="true"><use href="#nk-mark"/></svg>' +
      '<div class="resultat-tall">' +
      "<div><b>" + ferdige + "/" + MODULER.length + "</b><span>moduler fullført</span></div>" +
      "<div><b>" + p.riktige + "/" + p.totalt + "</b><span>riktige på første forsøk</span></div></div>";
    if (alle) {
      h += '<p class="sone-tekst">Kurset er registrert som fullført' + (SCORM.modus === "lms" ? " i LMS." : " (lokal testmodus).") + "</p>";
    } else if (gjenstar.length) {
      h += '<p class="sone-tekst">Disse modulene er ikke fullført: ' + gjenstar.map(function (m) { return esc(m.eyebrow + ": " + m.tittel); }).join(", ") + ".</p>";
    } else {
      h += '<p class="sone-tekst">Trykk «Fullfør kurset» for å registrere kurset som fullført.</p>';
    }
    return h + "</div>";
  }

  /* ───────────── Toppfeltet: hvor er jeg? ───────────── */

  function tegnPlassering() {
    var el = $("#plassering-tekst");
    if (visning === "meny") { el.innerHTML = ""; return; }
    var m = modul();
    el.innerHTML = '<span class="sr">Du er i </span><strong>' + esc(m.eyebrow) + "</strong> · " + esc(ren(m.tittel));
  }

  /* ───────────── Hovedmenyen ───────────── */

  // Hele menyen skal få plass på én skjerm uten å rulle, også på en 16"-bærbar (tilbakemelding H-04):
  // kort tittel og ingress, gruppene åpne under hverandre, lave kort og en smal fremdriftslinje nederst.
  function menyHtml() {
    var hm = KURS.hovedmeny || {};
    var h = '<section class="meny" aria-labelledby="meny-tittel">';

    var avsnitt = [].concat(hm.ingress || []);
    h += '<div class="meny-hode"><h1 class="meny-tittel" id="meny-tittel" tabindex="-1">' + fmt(hm.tittel || KURS.tittel) + "</h1>" +
      (avsnitt.length ? '<div class="meny-ingress">' + avsnitt.map(function (p) { return "<p>" + fmt(p) + "</p>"; }).join("") + "</div>" : "") + "</div>";

    grupper().forEach(function (g, gi) {
      var ferdige = g.moduler.filter(function (i) { return tilstand.ferdig[MODULER[i].id]; }).length;
      h += '<section class="meny-gruppe" aria-labelledby="gruppe-' + gi + '">' +
        '<div class="gruppe-hode"><h2 class="gruppe-tittel" id="gruppe-' + gi + '"><span class="gruppe-nr" aria-hidden="true">' + (gi + 1) + "</span>" + esc(g.tittel) + "</h2>" +
        (g.tekst ? '<p class="gruppe-ingress">' + esc(g.tekst) + "</p>" : "") +
        '<p class="gruppe-teller"' + (ferdige === g.moduler.length ? " data-ferdig" : "") + ">" + ferdige + " av " + g.moduler.length + " fullført</p></div>" +
        '<ol class="kortgrid">' + g.moduler.map(modulkortHtml).join("") + "</ol></section>";
    });

    return h + fremdriftHtml() + "</section>";
  }

  // Smal linje nederst: gratulasjon eller status, fremdriften, hvor den lagres, og én knapp videre
  function fremdriftHtml() {
    var ferdige = antallFerdig(), n = MODULER.length, alle = ferdige === n;
    var neste = anbefaltNeste();
    var tittel, meta = "<span><strong>" + ferdige + "</strong> av " + n + " moduler fullført", knapp = "";

    if (nyligFerdig && modulIndeks(nyligFerdig) >= 0) {
      tittel = alle ? "Gratulerer, kurset er fullført!" : "Bra! Du har fullført " + modulNavn(MODULER[modulIndeks(nyligFerdig)]) + ".";
    } else if (alle) {
      tittel = "Kurset er fullført";
    } else if (ferdige === 0 && neste === 0 && tilstand.sett[MODULER[0].id] == null) {
      tittel = "Klar til å begynne?";
    } else {
      tittel = "Din fremdrift";
    }

    if (alle) {
      var p = poeng();
      meta += ". " + p.riktige + " av " + p.totalt + " kontrollspørsmål riktig på første forsøk";
    } else if (neste >= 0) {
      var m = MODULER[neste], st = modulStatus(neste);
      var verb = st.kode === "pabegynt" ? "Fortsett" : ferdige === 0 && neste === 0 ? "Start kurset" : "Neste";
      knapp = '<button class="knapp knapp-primar" type="button" data-gaa="' + neste + '"><span>' + esc(verb === "Start kurset" ? verb : verb + ": " + modulNavn(m)) + "</span>" + ikon("i-neste") + "</button>";
    }

    meta += '</span><span class="fremdrift-lagring"><span class="status-prikk" data-modus="' + SCORM.modus + '" aria-hidden="true"></span>' +
      (SCORM.modus === "lms" ? "Fremdriften lagres i LMS." : "Lokal testmodus: fremdriften lagres bare i denne nettleseren.") + "</span>";

    var spor = "";
    MODULER.forEach(function (m) { spor += "<span" + (tilstand.ferdig[m.id] ? " data-ferdig" : "") + "></span>"; });

    return '<div class="meny-fremdrift"' + (alle ? " data-alle" : nyligFerdig ? " data-nylig" : "") + ">" +
      '<div class="fremdrift-tekst"><h2 id="meny-fremdrift-tittel" tabindex="-1">' + (nyligFerdig || alle ? ikon("i-sjekk") : "") + esc(tittel) + "</h2>" +
      "<p>" + meta + "</p></div>" +
      '<div class="fremdrift-spor" aria-hidden="true">' + spor + "</div>" +
      knapp + "</div>";
  }

  // Lavt kort: merkelapp og status øverst, tittelen under. Beskrivelsen (kortTekst) står inne i modulen.
  function modulkortHtml(i) {
    var m = MODULER[i], st = modulStatus(i);
    var k = m.knapp && APPKNAPPER[m.knapp];
    var anbefalt = i === anbefaltNeste();
    var id = "mk-" + i;
    // Anbefalt neste vises med rammen rundt kortet og knappen i fremdriftslinjen
    var merke = st.kode === "ferdig" ? ikon("i-sjekk")
      : '<span class="statusring" style="--p:' + Math.round(((tilstand.sett[m.id] + 1) / m.steg.length) * 100) + '%"></span>';
    var status = st.kode === "ikke" ? ""
      : '<span class="modulkort-status" data-status="' + st.kode + '" title="' + esc(st.tekst) + '" aria-hidden="true">' + merke + esc(st.kort) + "</span>";

    return '<li><button class="modulkort" type="button" data-gaa="' + i + '" data-status="' + st.kode + '"' +
      (k ? ' style="--f:' + k.farge + '" data-farge' : "") + (anbefalt ? " data-anbefalt" : "") +
      ' aria-labelledby="' + id + "-e " + id + "-t " + id + '-s">' +
      '<span class="modulkort-topp"><span class="eyebrow" id="' + id + '-e">' + esc(m.eyebrow) + "</span>" +
      (m.utkast ? '<span class="merkelapp">Utkast</span>' : "") + status + "</span>" +
      '<span class="modulkort-tittel" id="' + id + '-t">' + fmt(m.tittel) + "</span>" +
      '<span class="sr" id="' + id + '-s">. ' + esc(st.tekst) + (anbefalt ? ", anbefalt neste" : "") + ". " + esc(st.handling) + "</span>" +
      "</button></li>";
  }

  function apneModul(i) {
    var id = MODULER[i].id;
    var s = 0;
    if (!tilstand.ferdig[id] && tilstand.sett[id] != null) s = tilstand.sett[id];
    gaTil(i, s);
  }

  /* ───────────── QR-ark for utskrift ───────────── */

  function koderIModul(m) {
    var sett = {}, liste = [];
    function legg(kode) {
      if (kode && !sett[kode] && KODER[kode]) { sett[kode] = true; liste.push(kode); }
    }
    m.steg.forEach(function (s) {
      if (s.type === "skann") legg(s.kode);
      if (s.type === "registrer") (s.rekke || []).forEach(function (r) { legg(r.kode); });
    });
    return liste;
  }

  function apneQrArk() {
    var denne = visning === "modul" ? koderIModul(modul()).length : 0;
    var alle = MODULER.filter(function (m) { return koderIModul(m).length; }).length;
    var radDenne = $('#qrark-skjema input[value="denne"]');
    radDenne.disabled = denne === 0;
    radDenne.checked = denne > 0;
    $('#qrark-skjema input[value="alle"]').checked = denne === 0;
    $("#qrark-denne").textContent = denne ? denne + (denne === 1 ? " kode" : " koder") : visning === "meny" ? "Åpne en modul først" : "Ingen koder i denne modulen";
    $("#qrark-alle").textContent = alle + " ark";
    $("#dlg-qrark").showModal();
  }

  function skrivUt(omfang) {
    var moduler = omfang === "alle" ? MODULER : [modul()];
    var html = moduler.filter(function (m) { return koderIModul(m).length; }).map(function (m) {
      var koder = koderIModul(m);
      return '<section class="ark-side"><header class="ark-hode"><div><p class="eyebrow">NarKontroll opplæring · QR-ark</p><h1>' +
        esc(m.eyebrow + ": " + ren(m.tittel)) + "</h1><p>Skann kodene i denne rekkefølgen. Alle kodene er DUMMY-koder for Opplæringsmodus.</p></div>" +
        '<svg style="width:14mm;height:14mm" aria-hidden="true"><use href="#nk-mark"/></svg></header><div class="ark-rutenett">' +
        koder.map(function (id, i) {
          var k = KODER[id];
          return '<div class="ark-kode"><span class="ark-nr">' + (i + 1) + "</span>" + qrSvg(k.payload) + "<b>" + esc(k.navn) + "</b><span>" + esc(id) + " · DUMMY</span></div>";
        }).join("") +
        '</div><p class="ark-fot">Versjon ' + esc(KURS.versjon) + '. Skriv ut i 100 % størrelse (ikke «tilpass til side») for riktig kodestørrelse.</p></section>';
    }).join("");
    $("#utskrift").innerHTML = html;
    $("#dlg-qrark").close();
    setTimeout(function () { window.print(); }, 50);
  }

  /* ───────────── Utviklermodus ───────────── */

  function settDev(pa) {
    dev = pa;
    try { sessionStorage.setItem("nk-dev", pa ? "1" : "0"); } catch (e) { /* ignorer */ }
    if (!pa) $("#dev-rot").innerHTML = "";
    tegn(false);
  }

  function tegnDev() {
    var mod = modul();
    var suspend = SCORM.get("cmi.suspend_data") || "";
    var avklares = samleAvklares();
    var h = '<aside class="dev" aria-label="Utviklerpanel"' + (devLukket ? " data-lukket" : "") + ">" +
      '<div class="dev-topp">' + ikon("i-verktoy") + "<b>UTVIKLERMODUS</b>" +
      '<button class="knapp-ikon" type="button" data-dev="lukk" aria-expanded="' + !devLukket + '" aria-label="' + (devLukket ? "Vis" : "Skjul") + ' utviklerpanelet">' + ikon(devLukket ? "i-liste" : "i-lukk") + "</button></div>" +
      '<div class="dev-innhold">' +
      '<label>Modul<select id="dev-modul">' + MODULER.map(function (m, i) {
        return '<option value="' + i + '"' + (i === tilstand.m ? " selected" : "") + ">" + esc(m.nr + " · " + m.eyebrow + ": " + ren(m.tittel)) + "</option>";
      }).join("") + "</select></label>" +
      '<label>Steg<select id="dev-steg">' + mod.steg.map(function (s, i) {
        return '<option value="' + i + '"' + (i === tilstand.s ? " selected" : "") + ">" + (i + 1) + " · " + esc(s.type + ": " + ren(s.tittel || s.tekst).slice(0, 48)) + "</option>";
      }).join("") + "</select></label>" +
      '<div class="dev-rad"><button class="dev-knapp" type="button" data-dev="nullstill">Nullstill fremdrift</button>' +
      '<button class="dev-knapp" type="button" data-dev="fullfor">Merk alle fullført</button></div>' +
      '<div class="dev-rad"><button class="dev-knapp" type="button" data-dev="skjermer">Skjermbilder (' + Object.keys(SKJERMER).length + ")</button>" +
      '<button class="dev-knapp" type="button" data-dev="avklares">AVKLARES (' + avklares.length + ")</button>" +
      '<button class="dev-knapp" type="button" data-dev="koder">Koder (' + Object.keys(KODER).length + ")</button></div>" +
      '<p class="dev-info">SCORM <code>' + SCORM.modus + "</code> · status <code>" + esc(SCORM.get("cmi.core.lesson_status")) + "</code> · score <code>" + esc(SCORM.get("cmi.core.score.raw") || "–") +
      "</code> · suspend_data <code>" + suspend.length + "</code>/4096</p>" +
      '<p class="dev-info">Klikk QR-koden = skannet. Klikk ID-kortet = tæppet. <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>D</kbd> slår av.</p>' +
      "</div></aside>";
    $("#dev-rot").innerHTML = h;
  }

  function samleAvklares() {
    var funn = [];
    var re = /\[AVKLARES:\s*([^\]]*)\]/g, t;
    function sok(verdi, sted) {
      if (typeof verdi === "string") {
        re.lastIndex = 0;
        while ((t = re.exec(verdi))) funn.push({ tekst: t[1], sted: sted });
      } else if (verdi && typeof verdi === "object") {
        Object.keys(verdi).forEach(function (k) { sok(verdi[k], sted); });
      }
    }
    MODULER.forEach(function (m) {
      m.steg.forEach(function (s, i) { sok(s, m.eyebrow + ", steg " + (i + 1)); });
    });
    Object.keys(KODER).forEach(function (id) { sok(KODER[id], "koder.js: " + id); });
    return funn;
  }

  function visRegister(hva) {
    var tittel, rader, hode;
    if (hva === "skjermer") {
      var bruk = {};
      MODULER.forEach(function (m, mi) {
        m.steg.forEach(function (s, si) {
          if (s.skjerm) (bruk[s.skjerm] = bruk[s.skjerm] || []).push('<a href="#' + m.id + "/" + (si + 1) + '" data-lukk>' + esc(m.eyebrow) + " · " + (si + 1) + "</a>");
        });
      });
      tittel = "Skjermbilder som må tas";
      hode = ["ID", "Beskrivelse", "Brukt i", "Status"];
      rader = Object.keys(SKJERMER).map(function (id) {
        var s = SKJERMER[id];
        return ["<code>" + esc(id) + "</code>", esc(s.beskrivelse), (bruk[id] || ['<span class="register-tom">Ikke brukt</span>']).join("<br>"), s.bilde ? "Bilde" : "Plassholder"];
      });
    } else if (hva === "avklares") {
      tittel = "Må avklares";
      hode = ["Hva", "Hvor"];
      rader = samleAvklares().map(function (a) { return [esc(a.tekst), esc(a.sted)]; });
    } else {
      tittel = "QR-register (koder.js)";
      hode = ["ID", "Navn", "Payload"];
      rader = Object.keys(KODER).map(function (id) {
        var k = KODER[id];
        return ["<code>" + esc(id) + "</code>", esc(k.navn), k.payload ? "<code>" + esc(k.payload) + "</code>" : '<span class="register-tom">NFC, ingen QR</span>'];
      });
    }
    var dlg = $("#dlg-register");
    if (!dlg) {
      dlg = document.createElement("dialog");
      dlg.id = "dlg-register";
      dlg.className = "ark";
      dlg.style.width = "min(860px, calc(100vw - 32px))";
      dlg.setAttribute("aria-labelledby", "dlg-register-tittel");
      document.body.appendChild(dlg);
    }
    dlg.innerHTML = '<div class="ark-topp"><h2 id="dlg-register-tittel">' + esc(tittel) + '</h2><button class="knapp-ikon" type="button" data-lukk aria-label="Lukk">' + ikon("i-lukk") + "</button></div>" +
      '<div class="register"><table><thead><tr>' + hode.map(function (x) { return "<th>" + x + "</th>"; }).join("") + "</tr></thead><tbody>" +
      rader.map(function (r) { return "<tr>" + r.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>"; }).join("") +
      "</tbody></table></div>";
    dlg.showModal();
  }

  /* ───────────── Hendelser ───────────── */

  function simulerSkann(knapp) {
    if (venter) return;
    // I et registrer-steg merkes bare raden. Deltakeren går videre med «Ferdig, neste».
    if (knapp.hasAttribute("data-rad")) {
      skannet[knapp.getAttribute("data-rad")] = true;
      knapp.classList.add("skannet");
      kunngjor("Skannet.");
      return;
    }
    venter = true;
    knapp.classList.add("skannet");
    var reduser = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    kunngjor("Skannet.");
    setTimeout(function () { venter = false; neste(); }, reduser ? 250 : 900);
  }

  function simulerTaepp() {
    if (venter) return;
    var st = steg();
    var antall = st.antall || 1;
    signerte = Math.min(antall, signerte + 1);
    if (signerte < antall) {
      tegn(false);
      kunngjor("Bruker " + signerte + " har signert. Tæpp igjen for bruker " + (signerte + 1) + ".");
      var kort = $(".idkort");
      if (kort) kort.focus();
      return;
    }
    tegn(false);
    venter = true;
    kunngjor(antall > 1 ? "Begge har signert." : "Signert.");
    setTimeout(function () { venter = false; neste(); }, 600);
  }

  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-handling],[data-gaa],[data-dev],[data-lukk]");
    if (!el) return;

    if (el.hasAttribute("data-lukk")) {
      var d = el.closest("dialog");
      if (d) d.close();
      return;
    }
    if (el.hasAttribute("data-gaa")) {
      var dlg = el.closest("dialog");
      if (dlg) dlg.close();
      apneModul(+el.getAttribute("data-gaa"));
      return;
    }
    if (el.hasAttribute("data-dev")) {
      var hva = el.getAttribute("data-dev");
      if (hva === "lukk") {
        devLukket = !devLukket;
        try { sessionStorage.setItem("nk-dev-lukket", devLukket ? "1" : "0"); } catch (e2) { /* ignorer */ }
        tegnDev();
        $('[data-dev="lukk"]').focus();
      }
      else if (hva === "nullstill") {
        if (!confirm("Nullstille all fremdrift og alle svar?")) return;
        tilstand = nyTilstand();
        if (SCORM.modus === "lokal") SCORM.nullstillLokalt();
        SCORM.set("cmi.core.lesson_status", "incomplete");
        visMeny();
      } else if (hva === "fullfor") {
        MODULER.forEach(function (m) { tilstand.ferdig[m.id] = true; tilstand.sett[m.id] = m.steg.length - 1; });
        lagre();
        tegn(false);
      } else visRegister(hva);
      return;
    }

    var h = el.getAttribute("data-handling");
    if (h === "neste") neste();
    else if (h === "forrige") forrige();
    else if (h === "skann") simulerSkann(el);
    else if (h === "taepp") simulerTaepp();
    else if (h === "qrark") apneQrArk();
    else if (h === "meny") visMeny();
  });

  document.addEventListener("change", function (e) {
    if (e.target.name === "svar") {
      valgtSvar = +e.target.value;
      var knapp = $("#knapp-neste");
      if (knapp) knapp.disabled = false;
    } else if (e.target.id === "dev-modul") {
      gaTil(+e.target.value, 0, { fokus: false });
    } else if (e.target.id === "dev-steg") {
      gaTil(tilstand.m, +e.target.value, { fokus: false });
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.altKey && e.shiftKey && (e.key === "D" || e.key === "d")) {
      e.preventDefault();
      settDev(!dev);
      return;
    }
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (document.querySelector("dialog[open]")) return;
    var t = e.target;
    if (t.closest && t.closest("input, select, textarea, [contenteditable], .dev")) return;
    if (visning !== "modul") return;
    if (e.key === "ArrowRight") {
      var k = $("#knapp-neste");
      if (k && !k.disabled) { e.preventDefault(); neste(); }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      forrige();
    }
  });

  window.addEventListener("hashchange", function () {
    var mal = lesAdresse();
    if (!mal) return;
    if (mal.meny) { if (visning !== "meny") visMeny(); }
    else if (visning !== "modul" || mal.m !== tilstand.m || mal.s !== tilstand.s) gaTil(mal.m, mal.s);
  });

  $("#knapp-qrark").addEventListener("click", apneQrArk);
  $("#qrark-skjema").addEventListener("submit", function (e) {
    e.preventDefault();
    skrivUt(new FormData(e.target).get("omfang"));
  });
  window.addEventListener("afterprint", function () { $("#utskrift").innerHTML = ""; });

  // Klikk på bakgrunnen lukker dialoger
  Array.prototype.forEach.call(document.querySelectorAll("dialog"), function (d) {
    d.addEventListener("click", function (e) { if (e.target === d) d.close(); });
  });
  document.addEventListener("click", function (e) {
    if (e.target.id === "dlg-register") e.target.close();
  });

  function lesAdresse() {
    var h = decodeURIComponent(location.hash.replace(/^#/, ""));
    if (!h) return null;
    if (h === "meny") return { meny: true };
    var deler = h.split("/");
    var mi = modulIndeks(deler[0]);
    if (mi < 0) return null;
    var s = Math.max(1, parseInt(deler[1], 10) || 1) - 1;
    return { m: mi, s: Math.min(s, MODULER[mi].steg.length - 1) };
  }

  /* ───────────── Introfilm ───────────── */

  // Spilles over hovedmenyen når kurset åpnes. Etterpå kommer deltakeren rett til hovedmenyen.
  // Filmen er uten lyd, så nettleseren tillater autoavspilling. Står den siste rammen litt før den
  // tones ut. «Hopp over», Esc eller klikk utenfor filmen lukker med en gang.
  // Står filmen stille i 3 s, lukkes den. Det skjer når den ikke starter (blokkert autoavspilling,
  // treg lasting), og når den henger på første bilde, slik den gjorde i Arbeidsflate (tilbakemelding H-01).
  function visIntro() {
    var dlg = $("#dlg-intro");
    var film = $(".intro-film", dlg);
    var ferdig = false;
    var sist = 0, stille = 0;

    function lukk() {
      if (ferdig) return;
      ferdig = true;
      if (dlg.open) dlg.close();
    }

    var vakt = setInterval(function () {
      if (ferdig || film.ended) return;
      if (film.currentTime > sist + 0.1) { sist = film.currentTime; stille = 0; }
      else if (++stille >= 3) lukk();
    }, 1000);

    dlg.addEventListener("close", function () {
      ferdig = true;
      clearInterval(vakt);
      film.pause();
      dlg.removeAttribute("data-ut");
      tegn(true); // flytter fokus til hovedmenyen og leser den opp
    }, { once: true });

    film.addEventListener("ended", function () {
      setTimeout(function () {
        if (ferdig) return;
        dlg.setAttribute("data-ut", "");
        setTimeout(lukk, 450);
      }, 700);
    });
    film.addEventListener("error", lukk);

    dlg.showModal();
    var p = film.play();
    if (p && p.catch) p.catch(lukk);
  }

  /* ───────────── Oppstart ───────────── */

  SCORM.start();
  hent();

  var sok = new URLSearchParams(location.search);
  var lagretDev = null;
  try { lagretDev = sessionStorage.getItem("nk-dev"); } catch (e) { /* ignorer */ }
  dev = sok.get("dev") === "1" || (sok.get("dev") !== "0" && lagretDev === "1");
  try { devLukket = sessionStorage.getItem("nk-dev-lukket") !== "0"; } catch (e) { /* ignorer */ }
  if (sok.get("dev") === "0") { try { sessionStorage.setItem("nk-dev", "0"); } catch (e) { /* ignorer */ } }

  // Kurset åpner alltid i hovedmenyen, med «Fortsett» til der deltakeren slapp.
  // Adressen (#modul/steg) blir liggende ved omlasting, så den følges bare i utviklermodus.
  var mal = dev ? lesAdresse() : null;
  if (mal && !mal.meny) gaTil(mal.m, mal.s, { fokus: false });
  else visMeny({ fokus: false });

  // Introfilmen vises ikke i utviklermodus (med mindre ?intro=1), og ?intro=0 hopper over den.
  // Den vises også når Windows har slått av animasjoner (redusert bevegelse). Det er vanlig på
  // jobb-PC-er og i Arbeidsflate, og fagekspertene vil ha filmen der (H-01). Den er kort, uten blink,
  // og kan hoppes over.
  if (sok.get("intro") === "1" || (!dev && sok.get("intro") !== "0")) visIntro();
})();
