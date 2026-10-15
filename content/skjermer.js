/*
 * Register over skjermbilder fra appen som kurset viser.
 *
 * Tom med vilje: kurset skal få deltakeren til å se på appen, ikke på bilder av den
 * (tilbakemelding G-04). Kurset viser ingen bilder av appen.
 *
 * Trengs et skjermbilde likevel: legg det i assets/skjermbilder/<id>.png, legg inn
 * `"<id>": { beskrivelse: "…", bilde: "<id>.png" }` her, og sett `skjerm: "<id>"` på steget.
 */
window.SKJERMER = {};
