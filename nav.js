/* ============================================================
   nav.js — the navigation is written once, in nav.html, and this
   script puts it into every page. That is the DRY part of the site:
   adding a page means editing nav.html only.

   It also marks the current page, so the navigation can show where
   the visitor is without repeating the menu in every HTML file.
   ============================================================ */

(function () {
  "use strict";

  var slot = document.querySelector("[data-nav]");
  if (!slot) return;

  function currentPage() {
    var file = window.location.pathname.split("/").pop();
    return file === "" ? "index.html" : file;
  }

  fetch("nav.html")
    .then(function (response) {
      if (!response.ok) throw new Error("nav.html: HTTP " + response.status);
      return response.text();
    })
    .then(function (html) {
      slot.innerHTML = html;
      var here = currentPage();
      slot.querySelectorAll("a[href]").forEach(function (link) {
        var target = link.getAttribute("href");
        if (target === here) {
          link.setAttribute("aria-current", "page");
        }
      });
      slot.removeAttribute("aria-busy");
    })
    .catch(function () {
      // If the fragment cannot be fetched (for example when the files are
      // opened directly from disk instead of through a server), show real
      // links rather than an empty header.
      slot.innerHTML =
        '<nav class="site-nav" aria-label="Main"><ul>' +
        '<li><a href="index.html">Home</a></li>' +
        '<li><a href="quotes.html">Quotes</a></li>' +
        '<li><a href="project.html">Ideas</a></li>' +
        '<li><a href="machine.html">Machine</a></li>' +
        '<li><a href="about.html">About</a></li>' +
        "</ul></nav>";
      slot.removeAttribute("aria-busy");
    });
})();
