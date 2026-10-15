/*
 * Felles SCORM 1.2-wrapper for NarKontroll-opplæringen.
 *
 * Finner LMS-ets API-objekt i parent-vinduer (og opener). Uten LMS går den i
 * lokal testmodus: kallene logges til konsollen, og verdiene lagres i localStorage.
 *
 * Bruk:
 *   SCORM.start();                     // ved oppstart
 *   SCORM.get("cmi.suspend_data");
 *   SCORM.set("cmi.core.lesson_location", "case-1:3");
 *   SCORM.commit();
 *   SCORM.finish();                    // ved lukking (kalles også automatisk)
 */
(function () {
  "use strict";

  var LAGRINGSNOKKEL = "nk-konsept-a-scorm12";
  var api = null;
  var lokal = false;
  var lokaleVerdier = {};
  var startTid = Date.now();
  var startet = false;
  var avsluttet = false;

  function finnApi(vindu) {
    var forsok = 0;
    while (vindu && forsok < 10) {
      try {
        if (vindu.API) return vindu.API;
      } catch (e) { /* annen origin */ }
      if (!vindu.parent || vindu.parent === vindu) break;
      vindu = vindu.parent;
      forsok++;
    }
    return null;
  }

  function hentApi() {
    var funnet = finnApi(window);
    if (!funnet && window.opener) funnet = finnApi(window.opener);
    return funnet;
  }

  function lesLokalt() {
    try {
      var raa = localStorage.getItem(LAGRINGSNOKKEL);
      lokaleVerdier = raa ? JSON.parse(raa) : {};
    } catch (e) { lokaleVerdier = {}; }
  }

  function skrivLokalt() {
    try { localStorage.setItem(LAGRINGSNOKKEL, JSON.stringify(lokaleVerdier)); } catch (e) { /* privat modus */ }
  }

  function logg() {
    if (!window.console) return;
    var args = Array.prototype.slice.call(arguments);
    args.unshift("%c[SCORM lokal]", "color:#186F7B;font-weight:600");
    console.log.apply(console, args);
  }

  // SCORM 1.2 CMITimespan: HHHH:MM:SS.SS
  function tidsrom(ms) {
    var sek = ms / 1000;
    var t = Math.floor(sek / 3600);
    var m = Math.floor((sek % 3600) / 60);
    var s = (sek % 60).toFixed(2);
    function pad(n, l) { n = String(n); while (n.length < l) n = "0" + n; return n; }
    return pad(t, 4) + ":" + pad(m, 2) + ":" + (s < 10 ? "0" : "") + s;
  }

  var SCORM = {
    get modus() { return lokal ? "lokal" : (api ? "lms" : "ukjent"); },

    start: function () {
      if (startet) return true;
      startet = true;
      api = hentApi();
      if (api) {
        var ok = String(api.LMSInitialize("")) === "true";
        if (!ok) {
          console.warn("[SCORM] LMSInitialize feilet:", api.LMSGetLastError && api.LMSGetLastError());
        }
        var status = api.LMSGetValue("cmi.core.lesson_status");
        if (status === "not attempted" || status === "") {
          api.LMSSetValue("cmi.core.lesson_status", "incomplete");
        }
        return ok;
      }
      lokal = true;
      lesLokalt();
      if (!lokaleVerdier["cmi.core.lesson_status"]) lokaleVerdier["cmi.core.lesson_status"] = "incomplete";
      skrivLokalt();
      logg("Fant ikke LMS. Kjører i lokal testmodus. Lagrede verdier:", lokaleVerdier);
      return true;
    },

    get: function (felt) {
      if (api) return api.LMSGetValue(felt);
      return lokaleVerdier[felt] || "";
    },

    set: function (felt, verdi) {
      verdi = String(verdi);
      if (felt === "cmi.suspend_data" && verdi.length > 4096) {
        console.warn("[SCORM] suspend_data er " + verdi.length + " tegn. SCORM 1.2 tillater 4096.");
      }
      if (api) return String(api.LMSSetValue(felt, verdi)) === "true";
      if (lokaleVerdier[felt] !== verdi) logg("set", felt, "=", verdi.length > 80 ? verdi.slice(0, 80) + "…" : verdi);
      lokaleVerdier[felt] = verdi;
      return true;
    },

    commit: function () {
      if (api) return String(api.LMSCommit("")) === "true";
      skrivLokalt();
      return true;
    },

    finish: function () {
      if (!startet || avsluttet) return;
      avsluttet = true;
      this.set("cmi.core.session_time", tidsrom(Date.now() - startTid));
      if (this.get("cmi.core.lesson_status") !== "completed" && this.get("cmi.core.lesson_status") !== "passed") {
        this.set("cmi.core.exit", "suspend");
      } else {
        this.set("cmi.core.exit", "");
      }
      this.commit();
      if (api) api.LMSFinish("");
      else logg("finish, øktens varighet", lokaleVerdier["cmi.core.session_time"]);
    },

    /** Nullstiller lokal testmodus (brukes fra dev-panelet). Påvirker ikke LMS. */
    nullstillLokalt: function () {
      lokaleVerdier = { "cmi.core.lesson_status": "incomplete" };
      skrivLokalt();
    }
  };

  window.addEventListener("pagehide", function () { SCORM.finish(); });
  window.addEventListener("beforeunload", function () { SCORM.finish(); });

  window.SCORM = SCORM;
})();
